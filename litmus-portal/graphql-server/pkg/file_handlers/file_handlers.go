package file_handlers

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/cluster"
	database "github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/database/mongodb"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/pkg/types"
	"github.com/litmuschaos/litmus/litmus-portal/graphql-server/utils"
)

var subscriberConfiguration = &types.SubscriberConfigurationVars{
	PortalNamespace:         os.Getenv("PORTAL_NAMESPACE"),
	PortalScope:             os.Getenv("PORTAL_SCOPE"),
	GQLServerURI:            os.Getenv("SERVICE_ADDRESS") + "/query",
	SubscriberImage:         os.Getenv("SUBSCRIBER_IMAGE"),
	ArgoServerImage:         os.Getenv("ARGO_SERVER_IMAGE"),
	WorkflowControllerImage: os.Getenv("ARGO_WORKFLOW_CONTROLLER_IMAGE"),
	ChaosOperatorImage:      os.Getenv("LITMUS_CHAOS_OPERATOR_IMAGE"),
	WorkflowExecutorImage:   os.Getenv("ARGO_WORKFLOW_EXECUTOR_IMAGE"),
	ChaosRunnerImage:        os.Getenv("LITMUS_CHAOS_RUNNER_IMAGE"),
}

//FileHandler dynamically generates the manifest file and sends it as a response
func FileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	token := vars["key"]

	id, err := cluster.ClusterValidateJWT(token)
	if err != nil {
		log.Print("ERROR", err)
		utils.WriteHeaders(&w, 404)
		return
	}

	reqCluster, err := database.GetCluster(id)
	if err != nil {
		log.Print("ERROR", err)
		utils.WriteHeaders(&w, 500)
		return
	}

	if !reqCluster.IsRegistered {
		var respData []byte

		if subscriberConfiguration.SubscriberSC == "cluster" {
			respData, err = utils.ManifestParser(reqCluster.ClusterID, reqCluster.AccessKey, "manifests/cluster-subscriber.yml", subscriberConfiguration)
		} else if subscriberConfiguration.SubscriberSC == "namespace" {
			respData, err = utils.ManifestParser(reqCluster.ClusterID, reqCluster.AccessKey, "manifests/namespace-subscriber.yml", subscriberConfiguration)
		} else {
			log.Print("ERROR- PORTAL SCOPE NOT SELECTED!")
		}

		if err != nil {
			log.Print("ERROR", err)
			utils.WriteHeaders(&w, 500)
			return
		}
		utils.WriteHeaders(&w, 200)
		w.Write(respData)
		return
	}

	utils.WriteHeaders(&w, 404)
}
