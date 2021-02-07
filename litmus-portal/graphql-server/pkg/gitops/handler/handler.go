// GQL handlers and other external functions to facilitate gitops
package handler

import (
	"context"
	"errors"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/chaos-workflow/ops"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/cluster"
	store "github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/data-store"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/database/mongodb"
	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/ghodss/yaml"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/graph/model"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/database/mongodb/operations"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/database/mongodb/schema"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/gitops"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
)

const timeout = time.Second * 5

var (
	gitLock           = gitops.NewGitLock()
	backgroundContext = context.Background()
)

//TODO add projectID and user permission validation
//EnableGitOpsHandler enables gitops for a particular project
func EnableGitOpsHandler(ctx context.Context, config model.GitConfig) (bool, error) {
	gitLock.Lock(config.ProjectID, nil)
	defer gitLock.Unlock(config.ProjectID, nil)

	gitLock.Lock(config.RepoURL, &config.Branch)
	defer gitLock.Unlock(config.RepoURL, &config.Branch)

	_, err := operations.GetProject(ctx, config.ProjectID)
	if err != nil {
		return false, errors.New("Failed to setup GitOps : " + err.Error())
	}

	log.Print("Enabling Gitops")
	gitDB := schema.GetGitConfigDB(config)

	commit, err := gitops.SetupGitOps(gitops.GitUserFromContext(ctx), gitDB)
	if err != nil {
		return false, errors.New("Failed to setup GitOps : " + err.Error())
	}
	gitDB.LatestCommit = commit

	err = operations.AddGitConfig(ctx, &gitDB)
	if err != nil {
		return false, errors.New("Failed to enable GitOps in DB : " + err.Error())
	}

	return true, nil
}

//DisableGitOpsHandler disables gitops for a specific project
func DisableGitOpsHandler(ctx context.Context, projectID string) (bool, error) {
	gitLock.Lock(projectID, nil)
	defer gitLock.Unlock(projectID, nil)

	log.Print("Disabling Gitops")
	err := operations.DeleteGitConfig(ctx, projectID)
	if err != nil {
		return false, errors.New("Failed to delete git config from DB : " + err.Error())
	}

	err = os.RemoveAll(gitops.DefaultPath + projectID)
	if err != nil {
		return false, errors.New("Failed to delete git repo from disk : " + err.Error())
	}

	return true, nil
}

//GitOpsNotificationHandler sends workflow run request(single run workflow only) to agent on gitops notification
func GitOpsNotificationHandler(ctx context.Context, clusterInfo model.ClusterIdentity, workflowID string) (string, error) {
	cInfo, err := cluster.VerifyCluster(clusterInfo)
	if err != nil {
		log.Print("Validation failed : ", clusterInfo.ClusterID)
		return "Validation failed", err
	}
	gitLock.Lock(cInfo.ProjectID, nil)
	defer gitLock.Unlock(cInfo.ProjectID, nil)
	config, err := operations.GetGitConfig(ctx, cInfo.ProjectID)
	if err != nil {
		return "", errors.New("Cannot get Git Config from DB : " + err.Error())
	}
	if config == nil {
		return "Gitops Disabled", nil
	}
	query := bson.D{{"cluster_id", clusterInfo.ClusterID}, {"workflow_id", workflowID}, {"isRemoved", false}}
	workflows, err := mongodb.GetWorkflows(query)
	if err != nil {
		log.Print("Could not get workflow :", err)
		return "could not get workflow", err
	}
	if len(workflows) == 0 {
		return "", errors.New("no such workflow found")
	}
	resKind := gjson.Get(workflows[0].WorkflowManifest, "kind").String()
	if strings.ToLower(resKind) == "cronworkflow" { // no op
		return "Request Acknowledged for workflowID: " + workflowID, nil
	}

	workflows[0].WorkflowManifest, err = sjson.Set(workflows[0].WorkflowManifest, "metadata.name", workflows[0].WorkflowName+"-"+strconv.FormatInt(time.Now().Unix(), 10))
	if err != nil {
		log.Print("Failed to updated workflow name :", err)
		return "", errors.New("Failed to updated workflow name " + err.Error())
	}

	ops.SendWorkflowToSubscriber(&model.ChaosWorkFlowInput{
		WorkflowManifest: workflows[0].WorkflowManifest,
		ProjectID:        workflows[0].ProjectID,
		ClusterID:        workflows[0].ClusterID,
	}, "create", store.Store)

	return "Request Acknowledged for workflowID: " + workflowID, nil
}

//UpsertWorkflowToGit adds/updates workflow to git
func UpsertWorkflowToGit(ctx context.Context, workflow *model.ChaosWorkFlowInput) error {
	gitLock.Lock(workflow.ProjectID, nil)
	defer gitLock.Unlock(workflow.ProjectID, nil)
	config, err := operations.GetGitConfig(ctx, workflow.ProjectID)
	if err != nil {
		return errors.New("Cannot get Git Config from DB : " + err.Error())
	}
	if config == nil {
		return nil
	}
	gitLock.Lock(config.RepositoryURL, &config.Branch)
	defer gitLock.Unlock(config.RepositoryURL, &config.Branch)

	gitConfig := gitops.GetGitOpsConfig(*config)

	err = gitops.SyncDBToGit(ctx, gitConfig)
	if err != nil {
		return errors.New("Sync Error | " + err.Error())
	}

	workflowPath := gitConfig.LocalPath + "/" + gitops.ProjectDataPath + "/" + gitConfig.ProjectID + "/" + workflow.WorkflowName + ".yaml"

	data, err := yaml.JSONToYAML([]byte(workflow.WorkflowManifest))
	if err != nil {
		return errors.New("Cannot convert manifest to yaml : " + err.Error())
	}

	err = ioutil.WriteFile(workflowPath, data, 0644)
	if err != nil {
		return errors.New("Cannot write workflow to git : " + err.Error())
	}

	commit, err := gitConfig.GitCommit(gitops.GitUserFromContext(ctx), "Updated Workflow : "+workflow.WorkflowName, nil)
	if err != nil {
		return errors.New("Cannot commit workflow to git : " + err.Error())
	}

	err = gitConfig.GitPush()
	if err != nil {
		return errors.New("Cannot push workflow to git : " + err.Error())
	}

	query := bson.D{{"project_id", gitConfig.ProjectID}}
	update := bson.D{{"$set", bson.D{{"latest_commit", commit}}}}
	err = operations.UpdateGitConfig(ctx, query, update)
	if err != nil {
		return errors.New("Failed to update git config : " + err.Error())
	}

	return nil
}

//DeleteWorkflowFromGit deletes workflow from git
func DeleteWorkflowFromGit(ctx context.Context, workflow *model.ChaosWorkFlowInput) error {
	log.Print("Deleting Workflow...")
	gitLock.Lock(workflow.ProjectID, nil)
	defer gitLock.Unlock(workflow.ProjectID, nil)

	config, err := operations.GetGitConfig(ctx, workflow.ProjectID)
	if err != nil {
		return errors.New("Cannot get Git Config from DB : " + err.Error())
	}
	if config == nil {
		return nil
	}
	gitLock.Lock(config.RepositoryURL, &config.Branch)
	defer gitLock.Unlock(config.RepositoryURL, &config.Branch)

	gitConfig := gitops.GetGitOpsConfig(*config)

	err = gitops.SyncDBToGit(ctx, gitConfig)
	if err != nil {
		return errors.New("Sync Error | " + err.Error())
	}

	workflowPath := gitops.ProjectDataPath + "/" + gitConfig.ProjectID + "/" + workflow.WorkflowName + ".yaml"
	exists, err := gitops.PathExists(workflowPath)
	if err != nil {
		return errors.New("Cannot delete workflow from git : " + err.Error())
	}
	if !exists {
		log.Print("File not found in git!")
		return nil
	}
	err = os.RemoveAll(gitConfig.LocalPath + "/" + workflowPath)
	if err != nil {
		return errors.New("Cannot delete workflow from git : " + err.Error())
	}

	commit, err := gitConfig.GitCommit(gitops.GitUserFromContext(ctx), "Deleted Workflow : "+workflow.WorkflowName, &workflowPath)
	if err != nil {
		log.Print("Error", err)
		return errors.New("Cannot commit workflow[delete] to git : " + err.Error())
	}

	err = gitConfig.GitPush()
	if err != nil {
		log.Print("Error", err)
		return errors.New("Cannot push workflow[delete] to git : " + err.Error())
	}

	query := bson.D{{"project_id", gitConfig.ProjectID}}
	update := bson.D{{"$set", bson.D{{"latest_commit", commit}}}}
	err = operations.UpdateGitConfig(ctx, query, update)
	if err != nil {
		return errors.New("Failed to update git config : " + err.Error())
	}

	return nil
}

//GitSyncHelper sync a particular repo with DB
func GitSyncHelper(config schema.GitConfigDB, wg *sync.WaitGroup) {
	if wg != nil {
		defer wg.Done()
	}

	gitLock.Lock(config.ProjectID, nil)
	defer gitLock.Unlock(config.ProjectID, nil)

	gitLock.Lock(config.RepositoryURL, &config.Branch)
	defer gitLock.Unlock(config.RepositoryURL, &config.Branch)

	ctx, cancel := context.WithTimeout(backgroundContext, timeout)
	defer cancel()
	// get most recent data from db after acquiring lock
	conf, err := operations.GetGitConfig(ctx, config.ProjectID)
	if err != nil {
		log.Print("Repo Sync ERROR: ", config.ProjectID, err.Error())
	}
	if conf == nil {
		return
	}

	gitConfig := gitops.GetGitOpsConfig(*conf)

	err = gitops.SyncDBToGit(nil, gitConfig)
	if err != nil {
		log.Print("Repo Sync ERROR: ", conf.ProjectID, err.Error())
	}
}

//GitOpsSyncHandler syncs all repos in the DB
func GitOpsSyncHandler(singleRun bool) {
	const syncGroupSize = 10
	const syncInterval = 2 * time.Minute
	for {
		ctx, cancel := context.WithTimeout(backgroundContext, timeout)
		log.Print("Running GitOps DB Sync...")
		configs, err := operations.GetAllGitConfig(ctx)
		cancel()
		if err != nil {
			log.Print("Failed to get git configs from db : ", err)
		}
		log.Print("Updating : ", configs)
		count := len(configs)
		if count > 0 {
			count = count - 1
			for count >= 0 {
				min := count - (syncGroupSize - 1)
				if min < 0 {
					min = 0
				}
				wg := sync.WaitGroup{}
				wg.Add(count + 1 - min)
				for count >= min {
					go GitSyncHelper(configs[count], &wg)
					count -= 1
				}
				wg.Wait()
			}
		}
		log.Print("GitOps DB Sync Complete")
		if singleRun {
			break
		}
		time.Sleep(syncInterval)
	}
}
