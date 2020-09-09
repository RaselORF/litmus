package cluster

import (
	"errors"
	"os"

	database "github.com/litmuschaos/litmus/litmus-portal/backend/graphql-server/pkg/database/mongodb"

	"flag"
	"path/filepath"

	"github.com/litmuschaos/litmus/litmus-portal/backend/graphql-server/graph/model"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

//VerifyCluster utils function used to verify cluster identity
func VerifyCluster(identity model.ClusterIdentity) (*database.Cluster, error) {
	cluster, err := database.GetCluster(identity.ClusterID)
	if err != nil {
		return nil, err
	}

	if !(cluster.AccessKey == identity.AccessKey && cluster.IsRegistered) {
		return nil, errors.New("ERROR:  CLUSTER ID MISMATCH")
	}
	return &cluster, nil
}

// GetIP function is to provide Node IP addresses
func GetIP() string {

	// Require variables declared
	var kubeconfig *string
	//nodeAddresses := []corev1.NodeAddress{}

	// To get In-CLuster config
	config, err := rest.InClusterConfig() // If In-Cluster is nil then it will go for Out-Cluster config
	if config == nil {

		//To get Out-Cluster config
		if home := homedir.HomeDir(); home != "" {
			kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "kubeconfig file it is out-of-cluster")
		} else {
			kubeconfig = flag.String("kubeconfig", "", "Path to the kubeconfig file")
		}
		//panic(err.Error())
		flag.Parse()

		// uses the current context in kubeconfig
		config, err = clientcmd.BuildConfigFromFlags("", *kubeconfig)
		if err != nil {
			panic(err.Error())
		}
	}

	// creates the clientset
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}
	nodeName := os.Getenv("NODE_NAME")

	node, err := clientset.CoreV1().Nodes().Get(nodeName, metav1.GetOptions{})
	address := node.Status.Addresses

	externalIP := ""
	internalIP := ""

	for _, addr := range address {
		if addr.Type == "ExternalIP" && addr.Address != "" {
			externalIP = addr.Address
		} else if addr.Type == "InternalIP" && addr.Address != "" {
			internalIP = addr.Address
		}
	}

	if externalIP == "" {
		externalIP = internalIP
	}
	return externalIP
}
