package synchandler

import (
	"time"

	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/myhub"

	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/graph/model"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/myhub/myhub_ops"
)

const (
	timeInterval = 6 * time.Hour
)

//RecurringHubSync is used for syncing
func RecurringHubSync() {
	for {
		//Started Syncing of hubs
		myhubs, _ := myhub.GetAllHubs(nil)

		for _, myhub := range myhubs {

			chartsInput := model.CloningInput{
				HubName:       myhub.HubName,
				ProjectID:     myhub.ProjectID,
				RepoURL:       myhub.RepoURL,
				RepoBranch:    myhub.RepoBranch,
				IsPrivate:     myhub.IsPrivate,
				AuthType:      myhub.AuthType,
				Token:         myhub.Token,
				UserName:      myhub.UserName,
				Password:      myhub.Password,
				SSHPrivateKey: myhub.SSHPrivateKey,
			}

			myhub_ops.GitSyncHandlerForProjects(chartsInput)
		}

		//Syncing Completed
		time.Sleep(timeInterval)
	}
}
