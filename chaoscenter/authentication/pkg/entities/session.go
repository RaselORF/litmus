package entities

// RevokedToken struct for storing revoked tokens
type RevokedToken struct {
	Token     string `bson:"token"`
	ExpiresAt int64  `bson:"expires_at"`
	CreatedAt int64  `bson:"created_at"`
}

// ApiTokenInput struct for storing ApiTokenInput
type ApiTokenInput struct {
	UserID               string `json:"user_id"`
	Name                 string `json:"name"`
	ExpirationDateInDays int    `json:"expiration_date_in_days"`
}

// DeleteApiTokenInput struct for storing DeleteApiTokenInput
type DeleteApiTokenInput struct {
	Token string `json:"token"`
}

// ApiToken struct for storing API tokens
type ApiToken struct {
	UserID    string `bson:"user_id"`
	Name      string `bson:"name"`
	Token     string `bson:"token"`
	ExpiresAt int64  `bson:"expires_at"`
	CreatedAt int64  `bson:"created_at"`
}
