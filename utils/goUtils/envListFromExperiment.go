package goUtils

import (
	//"fmt"
	//"github.com/litmuschaos/chaos-operator/pkg/apis/litmuschaos/v1alpha1"
	//appsv1 "k8s.io/api/apps/v1"
	//apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	//"k8s.io/client-go/kubernetes"
	//"error"
	//"flag"
	//clientV1alpha1 "github.com/litmuschaos/litmus/pkg/client/clientset/versioned"
	//"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	//"k8s.io/client-go/tools/clientcmd"
	log "github.com/sirupsen/logrus"
	//"os"
	//"strings"
	//k8serror "k8s.io/apimachinery/pkg/api/errors"
)

func GetList(appns string, chaosExperiment string, config *rest.Config) map[string]string {
	_, litmusClientSet, err := generateClientSets(config)
	if err != nil {
		log.Info(err)
	}
	m := make(map[string]string)
	experimentEnv, err := litmusClientSet.LitmuschaosV1alpha1().ChaosExperiments(appns).Get(chaosExperiment, metav1.GetOptions{})
	envList := experimentEnv.Spec.Definition.ENVList
	for i := range envList {
		key := envList[i].Name
		value := envList[i].Value
		m[key] = value
	}
	return m

}
