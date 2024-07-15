package v3_4_0

import (
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"context"
)

// VersionManager implements IVersionManger
type VersionManager struct {
	Logger   *log.Logger
	DBClient *mongo.Client
	Context  *context.Context
}

// NewVersionManger provides a new instance of a new VersionManager
func NewVersionManger(logger *log.Logger, dbClient *mongo.Client) *VersionManager {
	return &VersionManager{Logger: logger, DBClient: dbClient}
}

// Run executes all the steps required for the Version Manger
// to upgrade from the previous version to `this` version
func (vm VersionManager) Run() error {
	ctx := context.Background()
	if err := upgradeExecutor(vm.Logger, vm.DBClient, ctx); err != nil {
		return nil
	}
	return nil
}
