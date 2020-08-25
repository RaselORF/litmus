package types

import "encoding/json"

type OperationMessage struct {
	Payload json.RawMessage `json:"payload,omitempty"`
	ID      string          `json:"id,omitempty"`
	Type    string          `json:"type"`
}

type RawData struct {
	Payload Payload `json:"payload"`
	Type    string  `json:"type"`
}

type Payload struct {
	Data Data `json:"data"`
}

type Data struct {
	ClusterConnect ClusterConnect `json:"clusterConnect"`
}

type ClusterConnect struct {
	ProjectID string `json:"project_id"`
	Action    Action `json:"action"`
}

type Action struct {
	K8SManifest  string      `json:"k8s_manifest"`
	ExternalData interface{} `json:"external_data"`
	RequestType  string      `json:"request_type"`
}
