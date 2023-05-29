package chaos_hub

import (
	"github.com/harness/hce-saas/graphql/server/graph/model"
	"github.com/harness/hce-saas/graphql/server/pkg/database/mongodb"
	"strconv"
)

// ChaosHub ...
type ChaosHub struct {
	ID                      string `bson:"hub_id"`
	ProjectID               string `bson:"project_id"`
	mongodb.ResourceDetails `bson:",inline"`
	mongodb.Audit           `bson:",inline"`
	RepoURL                 string  `bson:"repo_url"`
	RepoBranch              string  `bson:"repo_branch"`
	IsPrivate               bool    `bson:"is_private"`
	AuthType                string  `bson:"auth_type"`
	HubType                 string  `bson:"hub_type"`
	Token                   *string `bson:"token"`
	UserName                *string `bson:"username"`
	Password                *string `bson:"password"`
	SSHPrivateKey           *string `bson:"ssh_private_key"`
	SSHPublicKey            *string `bson:"ssh_public_key"`
	LastSyncedAt            int64   `bson:"last_synced_at"`
}

// GetOutputChaosHub ...
func (c *ChaosHub) GetOutputChaosHub() *model.ChaosHub {
	return &model.ChaosHub{
		ID:            c.ID,
		ProjectID:     c.ProjectID,
		RepoURL:       c.RepoURL,
		RepoBranch:    c.RepoBranch,
		Name:          c.Name,
		Description:   &c.Description,
		Tags:          c.Tags,
		HubType:       model.HubType(c.HubType),
		IsPrivate:     c.IsPrivate,
		UserName:      c.UserName,
		Password:      c.Password,
		AuthType:      model.AuthType(c.AuthType),
		Token:         c.Token,
		IsRemoved:     c.IsRemoved,
		SSHPrivateKey: c.SSHPrivateKey,
		CreatedAt:     strconv.FormatInt(c.CreatedAt, 10),
		UpdatedAt:     strconv.FormatInt(c.UpdatedAt, 10),
		LastSyncedAt:  strconv.FormatInt(c.LastSyncedAt, 10),
	}
}

type TotalCount struct {
	Count int `bson:"count"`
}

type AggregatedChaosHubStats struct {
	TotalChaosHubs []TotalCount `bson:"total_chaos_hubs"`
}
