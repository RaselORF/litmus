package handler

import (
	"context"
	"errors"
	fuzz "github.com/AdaLogics/go-fuzz-headers"
	"github.com/sirupsen/logrus"
	"testing"
	"time"

	"github.com/litmuschaos/litmus/chaoscenter/graphql/server/pkg/database/mongodb"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/litmuschaos/litmus/chaoscenter/graphql/server/graph/model"
	"github.com/litmuschaos/litmus/chaoscenter/graphql/server/pkg/authorization"
	"github.com/litmuschaos/litmus/chaoscenter/graphql/server/pkg/database/mongodb/environments"
	dbOperationsEnvironment "github.com/litmuschaos/litmus/chaoscenter/graphql/server/pkg/database/mongodb/environments"
	dbMocks "github.com/litmuschaos/litmus/chaoscenter/graphql/server/pkg/database/mongodb/mocks"
	"github.com/litmuschaos/litmus/chaoscenter/graphql/server/utils"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson"
)

var (
	mongodbMockOperator = new(dbMocks.MongoOperator)
	environmentOperator = dbOperationsEnvironment.NewEnvironmentOperator(mongodbMockOperator)
)

const JwtSecret = "testsecret"

func getSignedJWT(name string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS512)
	claims := token.Claims.(jwt.MapClaims)
	claims["uid"] = uuid.NewString()
	claims["role"] = uuid.NewString()
	claims["username"] = name
	claims["exp"] = time.Now().Add(time.Minute).Unix()

	tokenString, err := token.SignedString([]byte(JwtSecret))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func TestCreateEnvironment(t *testing.T) {
	utils.Config.JwtSecret = JwtSecret
	testCases := []struct {
		name           string
		projectID      string
		input          *model.CreateEnvironmentRequest
		mockInsertFunc func(ctx context.Context, env environments.Environment) error
		expectedEnv    *model.Environment
		expectedErr    error
		given          func() string
	}{
		{
			name:      "success",
			projectID: "testProject",
			input: &model.CreateEnvironmentRequest{
				EnvironmentID: "testEnvID",
				Name:          "testName",
			},
			mockInsertFunc: func(ctx context.Context, env environments.Environment) error {
				return nil
			},
			expectedEnv: nil,
			expectedErr: errors.New("invalid Token"),
			given: func() string {
				token, err := getSignedJWT("testUser")
				if err != nil {
					return token
				}
				return "invalid Token"
			},
		},
		{
			name:      "Failed environment creation due to invalid token",
			projectID: "testProject",
			input: &model.CreateEnvironmentRequest{
				EnvironmentID: "testEnvID",
				Name:          "testName",
			},
			mockInsertFunc: func(ctx context.Context, env environments.Environment) error {
				return nil
			},
			expectedEnv: nil,
			expectedErr: errors.New("invalid Token"),
			given: func() string {
				return "invalid Token"
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mongodbMockOperator.On("Insert", mock.Anything, mock.AnythingOfType("environments.Environment")).
				Return(tc.mockInsertFunc)
			token := tc.given()
			ctx := context.WithValue(context.Background(), authorization.AuthKey, token)
			mockOperator := environmentOperator
			service := NewEnvironmentService(mockOperator)

			env, err := service.CreateEnvironment(ctx, tc.projectID, tc.input)
			if (err != nil && tc.expectedErr == nil) ||
				(err == nil && tc.expectedErr != nil) ||
				(err != nil && tc.expectedErr != nil && err.Error() != tc.expectedErr.Error()) {
				t.Fatalf("Expected error %v, but got %v", tc.expectedErr, err)
			}

			if tc.expectedEnv != nil && (env.EnvironmentID != tc.expectedEnv.EnvironmentID ||
				env.Name != tc.expectedEnv.Name) {
				t.Fatalf("Expected environment %+v, but got %+v", tc.expectedEnv, env)
			}
		})
	}
}

func TestDeleteEnvironment(t *testing.T) {
	utils.Config.JwtSecret = JwtSecret
	testCases := []struct {
		name                   string
		projectID              string
		environmentID          string
		mockGetEnvironmentFunc func(query bson.D) (environments.Environment, error)
		mockUpdateFunc         func(ctx context.Context, query bson.D, update bson.D) error
		expectedResult         string
		expectedErr            error
		given                  func() string
	}{
		{
			name:          "success",
			projectID:     "testProject",
			environmentID: "testEnvID",
			mockGetEnvironmentFunc: func(query bson.D) (environments.Environment, error) {
				return environments.Environment{
					EnvironmentID: "testEnvID",
				}, nil
			},
			mockUpdateFunc: func(ctx context.Context, query bson.D, update bson.D) error {
				return nil
			},
			expectedErr: errors.New("invalid Token"),
			given: func() string {
				token, err := getSignedJWT("testUser")
				if err != nil {
					return token
				}
				return "invalid Token"
			},
		},
		{
			name:          "Failed environment",
			projectID:     "testProject",
			environmentID: "testEnvID",
			mockGetEnvironmentFunc: func(query bson.D) (environments.Environment, error) {
				return environments.Environment{
					EnvironmentID: "testEnvID",
				}, nil
			},
			mockUpdateFunc: func(ctx context.Context, query, update bson.D) error {
				return nil
			},
			expectedErr: errors.New("invalid Token"),
			given: func() string {
				return "invalid Token"
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mongodbMockOperator.On("Insert", mock.Anything, mock.AnythingOfType("environments.Environment")).
				Return(tc.mockUpdateFunc)
			token := tc.given()
			ctx := context.WithValue(context.Background(), authorization.AuthKey, token)

			mockOperator := environmentOperator
			service := NewEnvironmentService(mockOperator)

			_, err := service.DeleteEnvironment(ctx, tc.projectID, tc.environmentID)
			if (err != nil && tc.expectedErr == nil) ||
				(err == nil && tc.expectedErr != nil) ||
				(err != nil && tc.expectedErr != nil && err.Error() != tc.expectedErr.Error()) {
				t.Fatalf("Expected error %v, but got %v", tc.expectedErr, err)
			}
		})
	}
}

func FuzzCreateEnvironment(f *testing.F) {
	utils.Config.JwtSecret = JwtSecret
	f.Fuzz(func(t *testing.T, data []byte) {
		fuzzConsumer := fuzz.NewConsumer(data)
		targetStruct := &struct {
			input     model.CreateEnvironmentRequest
			projectID string
		}{}
		err := fuzzConsumer.GenerateStruct(targetStruct)
		if err != nil {
			return
		}
		mongodbMockOperator.On("Create ", mock.Anything, mongodb.EnvironmentCollection, mock.Anything).Return(nil).Once()
		token, err := getSignedJWT("testUser")
		if err != nil {
			logrus.Errorf("Error genrating token %v", err)
		}

		ctx := context.WithValue(context.Background(), authorization.AuthKey, token)
		service := handler.NewEnvironmentService(environmentOperator)

		env, err := service.CreateEnvironment(ctx, targetStruct.projectID, &targetStruct.input)
		if err != nil {
			t.Errorf("Unexpected error: %v", err)
		}
		if env == nil {
			t.Errorf("Returned environment is nil")
		}
	})
}

func FuzzTestDeleteEnvironment(f *testing.F) {
	utils.Config.JwtSecret = JwtSecret
	testCases := []struct {
		projectID     string
		environmentID string
	}{
		{
			projectID:     "testProject",
			environmentID: "testEnvID",
		},
	}
	for _, tc := range testCases {
		f.Add(tc.projectID, tc.environmentID)
	}

	f.Fuzz(func(t *testing.T, projectID string, environmentID string) {

		findResult := []interface{}{bson.D{
			{Key: "environment_id", Value: environmentID},
			{Key: "project_id", Value: projectID},
		}}
		singleResult := mongo.NewSingleResultFromDocument(findResult[0], nil, nil)
		mongodbMockOperator.On("Get", mock.Anything, mongodb.EnvironmentCollection, mock.Anything).Return(singleResult, nil).Once()
		mongodbMockOperator.On("UpdateMany", mock.Anything, mongodb.EnvironmentCollection, mock.Anything, mock.Anything, mock.Anything).Return(&mongo.UpdateResult{}, nil).Once()
		token, err := getSignedJWT("testUser")
		if err != nil {
			logrus.Errorf("Error genrating token %v", err)
		}

		ctx := context.WithValue(context.Background(), authorization.AuthKey, token)
		service := handler.NewEnvironmentService(environmentOperator)

		env, err := service.DeleteEnvironment(ctx, projectID, environmentID)
		if err != nil {
			t.Errorf("Unexpected error: %v", err)
		}

		if env == "" {
			t.Errorf("Returned environment is nil")
		}
	})
}

func FuzzTestGetEnvironment(f *testing.F) {
	utils.Config.JwtSecret = JwtSecret
	testCases := []struct {
		projectID     string
		environmentID string
	}{
		{
			projectID:     "testProject",
			environmentID: "testEnvID",
		},
	}
	for _, tc := range testCases {
		f.Add(tc.projectID, tc.environmentID)
	}

	f.Fuzz(func(t *testing.T, projectID string, environmentID string) {

		findResult := []interface{}{bson.D{
			{Key: "environment_id", Value: environmentID},
			{Key: "project_id", Value: projectID},
		}}
		singleResult := mongo.NewSingleResultFromDocument(findResult[0], nil, nil)
		mongodbMockOperator.On("Get", mock.Anything, mongodb.EnvironmentCollection, mock.Anything).Return(singleResult, nil).Once()
		service := NewEnvironmentService(environmentOperator)

		env, err := service.GetEnvironment(projectID, environmentID)
		if err != nil {
			t.Errorf("Unexpected error: %v", err)
		}

		if env == nil {
			t.Errorf("Returned environment is nil")
		}
	})
}
