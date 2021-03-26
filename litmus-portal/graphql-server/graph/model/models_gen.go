// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type ActionPayload struct {
	RequestType  string  `json:"request_type"`
	K8sManifest  string  `json:"k8s_manifest"`
	Namespace    string  `json:"namespace"`
	ExternalData *string `json:"external_data"`
}

type Annotation struct {
	Categories       string `json:"Categories"`
	Vendor           string `json:"Vendor"`
	CreatedAt        string `json:"CreatedAt"`
	Repository       string `json:"Repository"`
	Support          string `json:"Support"`
	ChartDescription string `json:"ChartDescription"`
}

type ChaosWorkFlowInput struct {
	WorkflowID          *string            `json:"workflow_id"`
	WorkflowManifest    string             `json:"workflow_manifest"`
	CronSyntax          string             `json:"cronSyntax"`
	WorkflowName        string             `json:"workflow_name"`
	WorkflowDescription string             `json:"workflow_description"`
	Weightages          []*WeightagesInput `json:"weightages"`
	IsCustomWorkflow    bool               `json:"isCustomWorkflow"`
	ProjectID           string             `json:"project_id"`
	ClusterID           string             `json:"cluster_id"`
}

type ChaosWorkFlowResponse struct {
	WorkflowID          string `json:"workflow_id"`
	CronSyntax          string `json:"cronSyntax"`
	WorkflowName        string `json:"workflow_name"`
	WorkflowDescription string `json:"workflow_description"`
	IsCustomWorkflow    bool   `json:"isCustomWorkflow"`
}

type Chart struct {
	APIVersion  string              `json:"ApiVersion"`
	Kind        string              `json:"Kind"`
	Metadata    *Metadata           `json:"Metadata"`
	Spec        *Spec               `json:"Spec"`
	PackageInfo *PackageInformation `json:"PackageInfo"`
}

type Charts struct {
	Charts []*Chart `json:"Charts"`
}

type CloningInput struct {
	HubName       string   `json:"HubName"`
	ProjectID     string   `json:"ProjectID"`
	RepoBranch    string   `json:"RepoBranch"`
	RepoURL       string   `json:"RepoURL"`
	IsPrivate     bool     `json:"IsPrivate"`
	AuthType      AuthType `json:"AuthType"`
	Token         *string  `json:"Token"`
	UserName      *string  `json:"UserName"`
	Password      *string  `json:"Password"`
	SSHPrivateKey *string  `json:"SSHPrivateKey"`
}

type Cluster struct {
	ClusterID             string  `json:"cluster_id"`
	ProjectID             string  `json:"project_id"`
	ClusterName           string  `json:"cluster_name"`
	Description           *string `json:"description"`
	PlatformName          string  `json:"platform_name"`
	AccessKey             string  `json:"access_key"`
	IsRegistered          bool    `json:"is_registered"`
	IsClusterConfirmed    bool    `json:"is_cluster_confirmed"`
	IsActive              bool    `json:"is_active"`
	UpdatedAt             string  `json:"updated_at"`
	CreatedAt             string  `json:"created_at"`
	ClusterType           string  `json:"cluster_type"`
	NoOfSchedules         *int    `json:"no_of_schedules"`
	NoOfWorkflows         *int    `json:"no_of_workflows"`
	Token                 string  `json:"token"`
	AgentNamespace        *string `json:"agent_namespace"`
	Serviceaccount        *string `json:"serviceaccount"`
	AgentScope            string  `json:"agent_scope"`
	AgentNsExists         *bool   `json:"agent_ns_exists"`
	AgentSaExists         *bool   `json:"agent_sa_exists"`
	LastWorkflowTimestamp string  `json:"last_workflow_timestamp"`
}

type ClusterAction struct {
	ProjectID string         `json:"project_id"`
	Action    *ActionPayload `json:"action"`
}

type ClusterActionInput struct {
	ClusterID string `json:"cluster_id"`
	Action    string `json:"action"`
}

type ClusterConfirmResponse struct {
	IsClusterConfirmed bool    `json:"isClusterConfirmed"`
	NewClusterKey      *string `json:"newClusterKey"`
	ClusterID          *string `json:"cluster_id"`
}

type ClusterEvent struct {
	EventID     string   `json:"event_id"`
	EventType   string   `json:"event_type"`
	EventName   string   `json:"event_name"`
	Description string   `json:"description"`
	Cluster     *Cluster `json:"cluster"`
}

type ClusterEventInput struct {
	EventName   string `json:"event_name"`
	Description string `json:"description"`
	ClusterID   string `json:"cluster_id"`
	AccessKey   string `json:"access_key"`
}

type ClusterIdentity struct {
	ClusterID string `json:"cluster_id"`
	AccessKey string `json:"access_key"`
}

type ClusterInput struct {
	ClusterName    string  `json:"cluster_name"`
	Description    *string `json:"description"`
	PlatformName   string  `json:"platform_name"`
	ProjectID      string  `json:"project_id"`
	ClusterType    string  `json:"cluster_type"`
	AgentNamespace *string `json:"agent_namespace"`
	Serviceaccount *string `json:"serviceaccount"`
	AgentScope     string  `json:"agent_scope"`
	AgentNsExists  *bool   `json:"agent_ns_exists"`
	AgentSaExists  *bool   `json:"agent_sa_exists"`
}

type CreateMyHub struct {
	HubName       string   `json:"HubName"`
	RepoURL       string   `json:"RepoURL"`
	RepoBranch    string   `json:"RepoBranch"`
	IsPrivate     bool     `json:"IsPrivate"`
	AuthType      AuthType `json:"AuthType"`
	Token         *string  `json:"Token"`
	UserName      *string  `json:"UserName"`
	Password      *string  `json:"Password"`
	SSHPrivateKey *string  `json:"SSHPrivateKey"`
	SSHPublicKey  *string  `json:"SSHPublicKey"`
}

type CreateUserInput struct {
	Username    string  `json:"username"`
	Email       *string `json:"email"`
	CompanyName *string `json:"company_name"`
	Name        *string `json:"name"`
	UserID      string  `json:"userID"`
	Role        string  `json:"role"`
}

type DSInput struct {
	DsID              *string `json:"ds_id"`
	DsName            string  `json:"ds_name"`
	DsType            string  `json:"ds_type"`
	DsURL             string  `json:"ds_url"`
	AccessType        string  `json:"access_type"`
	AuthType          string  `json:"auth_type"`
	BasicAuthUsername *string `json:"basic_auth_username"`
	BasicAuthPassword *string `json:"basic_auth_password"`
	ScrapeInterval    int     `json:"scrape_interval"`
	QueryTimeout      int     `json:"query_timeout"`
	HTTPMethod        string  `json:"http_method"`
	ProjectID         *string `json:"project_id"`
}

type DSResponse struct {
	DsID              *string `json:"ds_id"`
	DsName            *string `json:"ds_name"`
	DsType            *string `json:"ds_type"`
	DsURL             *string `json:"ds_url"`
	AccessType        *string `json:"access_type"`
	AuthType          *string `json:"auth_type"`
	BasicAuthUsername *string `json:"basic_auth_username"`
	BasicAuthPassword *string `json:"basic_auth_password"`
	ScrapeInterval    *int    `json:"scrape_interval"`
	QueryTimeout      *int    `json:"query_timeout"`
	HTTPMethod        *string `json:"http_method"`
	ProjectID         string  `json:"project_id"`
	HealthStatus      string  `json:"health_status"`
	CreatedAt         *string `json:"created_at"`
	UpdatedAt         *string `json:"updated_at"`
}

type ExperimentInput struct {
	ProjectID      string  `json:"ProjectID"`
	ChartName      string  `json:"ChartName"`
	ExperimentName string  `json:"ExperimentName"`
	HubName        string  `json:"HubName"`
	FileType       *string `json:"FileType"`
}

type Experiments struct {
	Name string `json:"Name"`
	Csv  string `json:"CSV"`
	Desc string `json:"Desc"`
}

type GitConfig struct {
	ProjectID     string   `json:"ProjectID"`
	Branch        string   `json:"Branch"`
	RepoURL       string   `json:"RepoURL"`
	AuthType      AuthType `json:"AuthType"`
	Token         *string  `json:"Token"`
	UserName      *string  `json:"UserName"`
	Password      *string  `json:"Password"`
	SSHPrivateKey *string  `json:"SSHPrivateKey"`
}

type GitConfigResponse struct {
	Enabled       bool      `json:"Enabled"`
	ProjectID     string    `json:"ProjectID"`
	Branch        *string   `json:"Branch"`
	RepoURL       *string   `json:"RepoURL"`
	AuthType      *AuthType `json:"AuthType"`
	Token         *string   `json:"Token"`
	UserName      *string   `json:"UserName"`
	Password      *string   `json:"Password"`
	SSHPrivateKey *string   `json:"SSHPrivateKey"`
}

type Link struct {
	Name string `json:"Name"`
	URL  string `json:"Url"`
}

type Maintainer struct {
	Name  string `json:"Name"`
	Email string `json:"Email"`
}

type Member struct {
	UserID     string     `json:"user_id"`
	UserName   string     `json:"user_name"`
	Name       string     `json:"name"`
	Email      string     `json:"email"`
	Role       MemberRole `json:"role"`
	Invitation string     `json:"invitation"`
	JoinedAt   string     `json:"joined_at"`
}

type MemberInput struct {
	ProjectID string      `json:"project_id"`
	UserID    string      `json:"user_id"`
	Role      *MemberRole `json:"role"`
}

type Metadata struct {
	Name        string      `json:"Name"`
	Version     string      `json:"Version"`
	Annotations *Annotation `json:"Annotations"`
}

type MyHub struct {
	ID            string   `json:"id"`
	RepoURL       string   `json:"RepoURL"`
	RepoBranch    string   `json:"RepoBranch"`
	ProjectID     string   `json:"ProjectID"`
	HubName       string   `json:"HubName"`
	IsPrivate     bool     `json:"IsPrivate"`
	AuthType      AuthType `json:"AuthType"`
	Token         *string  `json:"Token"`
	UserName      *string  `json:"UserName"`
	Password      *string  `json:"Password"`
	SSHPrivateKey *string  `json:"SSHPrivateKey"`
	IsRemoved     bool     `json:"IsRemoved"`
	CreatedAt     string   `json:"CreatedAt"`
	UpdatedAt     string   `json:"UpdatedAt"`
	LastSyncedAt  string   `json:"LastSyncedAt"`
}

type MyHubStatus struct {
	ID            string   `json:"id"`
	RepoURL       string   `json:"RepoURL"`
	RepoBranch    string   `json:"RepoBranch"`
	IsAvailable   bool     `json:"IsAvailable"`
	TotalExp      string   `json:"TotalExp"`
	HubName       string   `json:"HubName"`
	IsPrivate     bool     `json:"IsPrivate"`
	AuthType      AuthType `json:"AuthType"`
	Token         *string  `json:"Token"`
	UserName      *string  `json:"UserName"`
	Password      *string  `json:"Password"`
	IsRemoved     bool     `json:"IsRemoved"`
	SSHPrivateKey *string  `json:"SSHPrivateKey"`
	SSHPublicKey  *string  `json:"SSHPublicKey"`
	LastSyncedAt  string   `json:"LastSyncedAt"`
}

type PackageInformation struct {
	PackageName string         `json:"PackageName"`
	Experiments []*Experiments `json:"Experiments"`
}

type PodLog struct {
	ClusterID     *ClusterIdentity `json:"cluster_id"`
	RequestID     string           `json:"request_id"`
	WorkflowRunID string           `json:"workflow_run_id"`
	PodName       string           `json:"pod_name"`
	PodType       string           `json:"pod_type"`
	Log           string           `json:"log"`
}

type PodLogRequest struct {
	ClusterID      string  `json:"cluster_id"`
	WorkflowRunID  string  `json:"workflow_run_id"`
	PodName        string  `json:"pod_name"`
	PodNamespace   string  `json:"pod_namespace"`
	PodType        string  `json:"pod_type"`
	ExpPod         *string `json:"exp_pod"`
	RunnerPod      *string `json:"runner_pod"`
	ChaosNamespace *string `json:"chaos_namespace"`
}

type PodLogResponse struct {
	WorkflowRunID string `json:"workflow_run_id"`
	PodName       string `json:"pod_name"`
	PodType       string `json:"pod_type"`
	Log           string `json:"log"`
}

type Project struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Members   []*Member `json:"members"`
	State     *string   `json:"state"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
	RemovedAt string    `json:"removed_at"`
}

type Provider struct {
	Name string `json:"Name"`
}

type SSHKey struct {
	PublicKey  string `json:"publicKey"`
	PrivateKey string `json:"privateKey"`
}

type ScheduledWorkflows struct {
	WorkflowID          string        `json:"workflow_id"`
	WorkflowManifest    string        `json:"workflow_manifest"`
	CronSyntax          string        `json:"cronSyntax"`
	ClusterName         string        `json:"cluster_name"`
	WorkflowName        string        `json:"workflow_name"`
	WorkflowDescription string        `json:"workflow_description"`
	Weightages          []*Weightages `json:"weightages"`
	IsCustomWorkflow    bool          `json:"isCustomWorkflow"`
	UpdatedAt           string        `json:"updated_at"`
	CreatedAt           string        `json:"created_at"`
	ProjectID           string        `json:"project_id"`
	ClusterID           string        `json:"cluster_id"`
	ClusterType         string        `json:"cluster_type"`
	IsRemoved           bool          `json:"isRemoved"`
}

type Spec struct {
	DisplayName         string        `json:"DisplayName"`
	CategoryDescription string        `json:"CategoryDescription"`
	Keywords            []string      `json:"Keywords"`
	Maturity            string        `json:"Maturity"`
	Maintainers         []*Maintainer `json:"Maintainers"`
	MinKubeVersion      string        `json:"MinKubeVersion"`
	Provider            string        `json:"Provider"`
	Links               []*Link       `json:"Links"`
	Experiments         []string      `json:"Experiments"`
	ChaosExpCRDLink     string        `json:"ChaosExpCRDLink"`
	Platforms           []string      `json:"Platforms"`
	ChaosType           *string       `json:"ChaosType"`
}

type UpdateMyHub struct {
	ID            string   `json:"id"`
	HubName       string   `json:"HubName"`
	RepoURL       string   `json:"RepoURL"`
	RepoBranch    string   `json:"RepoBranch"`
	IsPrivate     bool     `json:"IsPrivate"`
	AuthType      AuthType `json:"AuthType"`
	Token         *string  `json:"Token"`
	UserName      *string  `json:"UserName"`
	Password      *string  `json:"Password"`
	SSHPrivateKey *string  `json:"SSHPrivateKey"`
	SSHPublicKey  *string  `json:"SSHPublicKey"`
}

type UpdateUserInput struct {
	ID          string  `json:"id"`
	Name        *string `json:"name"`
	Email       *string `json:"email"`
	CompanyName *string `json:"company_name"`
}

type User struct {
	ID              string     `json:"id"`
	Username        string     `json:"username"`
	Email           *string    `json:"email"`
	IsEmailVerified *bool      `json:"is_email_verified"`
	CompanyName     *string    `json:"company_name"`
	Name            *string    `json:"name"`
	Projects        []*Project `json:"projects"`
	Role            *string    `json:"role"`
	State           *string    `json:"state"`
	CreatedAt       string     `json:"created_at"`
	UpdatedAt       string     `json:"updated_at"`
	RemovedAt       string     `json:"removed_at"`
}

type WeightagesInput struct {
	ExperimentName string `json:"experiment_name"`
	Weightage      int    `json:"weightage"`
}

type Workflow struct {
	WorkflowID          string          `json:"workflow_id"`
	WorkflowManifest    string          `json:"workflow_manifest"`
	CronSyntax          string          `json:"cronSyntax"`
	ClusterName         string          `json:"cluster_name"`
	WorkflowName        string          `json:"workflow_name"`
	WorkflowDescription string          `json:"workflow_description"`
	Weightages          []*Weightages   `json:"weightages"`
	IsCustomWorkflow    bool            `json:"isCustomWorkflow"`
	UpdatedAt           string          `json:"updated_at"`
	CreatedAt           string          `json:"created_at"`
	ProjectID           string          `json:"project_id"`
	ClusterID           string          `json:"cluster_id"`
	ClusterType         string          `json:"cluster_type"`
	IsRemoved           bool            `json:"isRemoved"`
	WorkflowRuns        []*WorkflowRuns `json:"workflow_runs"`
}

type WorkflowRun struct {
	WorkflowRunID string  `json:"workflow_run_id"`
	WorkflowID    string  `json:"workflow_id"`
	ClusterName   string  `json:"cluster_name"`
	LastUpdated   string  `json:"last_updated"`
	ProjectID     string  `json:"project_id"`
	ClusterID     string  `json:"cluster_id"`
	WorkflowName  string  `json:"workflow_name"`
	ClusterType   *string `json:"cluster_type"`
	ExecutionData string  `json:"execution_data"`
}

type WorkflowRunInput struct {
	WorkflowID    string           `json:"workflow_id"`
	WorkflowRunID string           `json:"workflow_run_id"`
	WorkflowName  string           `json:"workflow_name"`
	ExecutionData string           `json:"execution_data"`
	ClusterID     *ClusterIdentity `json:"cluster_id"`
	Completed     bool             `json:"completed"`
}

type WorkflowRuns struct {
	ExecutionData string `json:"execution_data"`
	WorkflowRunID string `json:"workflow_run_id"`
	LastUpdated   string `json:"last_updated"`
}

type ClusterRegResponse struct {
	Token       string `json:"token"`
	ClusterID   string `json:"cluster_id"`
	ClusterName string `json:"cluster_name"`
}

type CreateDBInput struct {
	DsID        string        `json:"ds_id"`
	DbName      string        `json:"db_name"`
	DbType      string        `json:"db_type"`
	PanelGroups []*PanelGroup `json:"panel_groups"`
	EndTime     string        `json:"end_time"`
	StartTime   string        `json:"start_time"`
	ProjectID   string        `json:"project_id"`
	ClusterID   string        `json:"cluster_id"`
	RefreshRate string        `json:"refresh_rate"`
}

type DeleteDSInput struct {
	ForceDelete bool   `json:"force_delete"`
	DsID        string `json:"ds_id"`
}

type ListDashboardReponse struct {
	DsID        string                `json:"ds_id"`
	DbID        string                `json:"db_id"`
	DbName      string                `json:"db_name"`
	DbType      string                `json:"db_type"`
	ClusterName *string               `json:"cluster_name"`
	DsName      *string               `json:"ds_name"`
	DsType      *string               `json:"ds_type"`
	PanelGroups []*PanelGroupResponse `json:"panel_groups"`
	EndTime     string                `json:"end_time"`
	StartTime   string                `json:"start_time"`
	RefreshRate string                `json:"refresh_rate"`
	ProjectID   string                `json:"project_id"`
	ClusterID   string                `json:"cluster_id"`
	CreatedAt   *string               `json:"created_at"`
	UpdatedAt   *string               `json:"updated_at"`
}

type Panel struct {
	PanelID      *string      `json:"panel_id"`
	DbID         *string      `json:"db_id"`
	YAxisLeft    *string      `json:"y_axis_left"`
	YAxisRight   *string      `json:"y_axis_right"`
	XAxisDown    *string      `json:"x_axis_down"`
	Unit         *string      `json:"unit"`
	PanelGroupID *string      `json:"panel_group_id"`
	PromQueries  []*PromQuery `json:"prom_queries"`
	PanelOptions *PanelOption `json:"panel_options"`
	PanelName    string       `json:"panel_name"`
}

type PanelGroup struct {
	Panels         []*Panel `json:"panels"`
	PanelGroupName string   `json:"panel_group_name"`
}

type PanelGroupResponse struct {
	Panels         []*PanelResponse `json:"panels"`
	PanelGroupName string           `json:"panel_group_name"`
	PanelGroupID   *string          `json:"panel_group_id"`
}

type PanelOption struct {
	Points   *bool `json:"points"`
	Grids    *bool `json:"grids"`
	LeftAxis *bool `json:"left_axis"`
}

type PanelOptionResponse struct {
	Points   *bool `json:"points"`
	Grids    *bool `json:"grids"`
	LeftAxis *bool `json:"left_axis"`
}

type PanelResponse struct {
	PanelID      string               `json:"panel_id"`
	YAxisLeft    *string              `json:"y_axis_left"`
	YAxisRight   *string              `json:"y_axis_right"`
	XAxisDown    *string              `json:"x_axis_down"`
	Unit         *string              `json:"unit"`
	PromQueries  []*PromQueryResponse `json:"prom_queries"`
	PanelOptions *PanelOptionResponse `json:"panel_options"`
	PanelName    *string              `json:"panel_name"`
}

type PromInput struct {
	Queries []*PromQueryInput `json:"queries"`
	URL     string            `json:"url"`
	Start   string            `json:"start"`
	End     string            `json:"end"`
}

type PromQuery struct {
	Queryid       string  `json:"queryid"`
	PromQueryName *string `json:"prom_query_name"`
	Legend        *string `json:"legend"`
	Resolution    *string `json:"resolution"`
	Minstep       *string `json:"minstep"`
	Line          *bool   `json:"line"`
	CloseArea     *bool   `json:"close_area"`
}

type PromQueryInput struct {
	Queryid    string  `json:"queryid"`
	Query      string  `json:"query"`
	Legend     *string `json:"legend"`
	Resolution *string `json:"resolution"`
	Minstep    int     `json:"minstep"`
}

type PromQueryResponse struct {
	Queryid       string  `json:"queryid"`
	PromQueryName *string `json:"prom_query_name"`
	Legend        *string `json:"legend"`
	Resolution    *string `json:"resolution"`
	Minstep       *string `json:"minstep"`
	Line          *bool   `json:"line"`
	CloseArea     *bool   `json:"close_area"`
}

type PromResponse struct {
	Queryid string              `json:"queryid"`
	Legends [][]*string         `json:"legends"`
	Tsvs    [][]*TimeStampValue `json:"tsvs"`
}

type TimeStampValue struct {
	Timestamp *string `json:"timestamp"`
	Value     *string `json:"value"`
}

type UpdataDBInput struct {
	DbID        string                   `json:"db_id"`
	DsID        string                   `json:"ds_id"`
	DbName      string                   `json:"db_name"`
	DbType      string                   `json:"db_type"`
	EndTime     string                   `json:"end_time"`
	StartTime   string                   `json:"start_time"`
	RefreshRate string                   `json:"refresh_rate"`
	PanelGroups []*UpdatePanelGroupInput `json:"panel_groups"`
}

type UpdatePanelGroupInput struct {
	PanelGroupName string `json:"panel_group_name"`
	PanelGroupID   string `json:"panel_group_id"`
}

type Weightages struct {
	ExperimentName string `json:"experiment_name"`
	Weightage      int    `json:"weightage"`
}

type AuthType string

const (
	AuthTypeNone  AuthType = "none"
	AuthTypeBasic AuthType = "basic"
	AuthTypeToken AuthType = "token"
	AuthTypeSSH   AuthType = "ssh"
)

var AllAuthType = []AuthType{
	AuthTypeNone,
	AuthTypeBasic,
	AuthTypeToken,
	AuthTypeSSH,
}

func (e AuthType) IsValid() bool {
	switch e {
	case AuthTypeNone, AuthTypeBasic, AuthTypeToken, AuthTypeSSH:
		return true
	}
	return false
}

func (e AuthType) String() string {
	return string(e)
}

func (e *AuthType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = AuthType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid AuthType", str)
	}
	return nil
}

func (e AuthType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type MemberRole string

const (
	MemberRoleOwner  MemberRole = "Owner"
	MemberRoleEditor MemberRole = "Editor"
	MemberRoleViewer MemberRole = "Viewer"
)

var AllMemberRole = []MemberRole{
	MemberRoleOwner,
	MemberRoleEditor,
	MemberRoleViewer,
}

func (e MemberRole) IsValid() bool {
	switch e {
	case MemberRoleOwner, MemberRoleEditor, MemberRoleViewer:
		return true
	}
	return false
}

func (e MemberRole) String() string {
	return string(e)
}

func (e *MemberRole) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = MemberRole(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid MemberRole", str)
	}
	return nil
}

func (e MemberRole) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
