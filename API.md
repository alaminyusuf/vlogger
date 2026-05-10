# Vlogger API Documentation

This document describes the GraphQL API for the Vlogger platform.

## Base URL
The API is available at `http://localhost:4000/graphql`.

## Authentication
Authentication is handled via session cookies. Log in using the `login` mutation to receive a `vlogger` session cookie.

## Resolvers

### User Resolver

#### Queries
- `me: User`: Returns the current logged-in user.
- `users: [User!]!`: Returns a list of all users.
- `user(username: String!): User`: Returns a user by their username.

#### Mutations
- `register(options: InputOptions!): UserResponse!`: Registers a new user.
- `login(usernameOrEmail: String!, password: String!): UserResponse!`: Logs in a user.
- `logout: Boolean!`: Logs out the current user.
- `forgetPassword(email: String!): Boolean!`: Sends a password reset email.
- `changePassword(token: String!, newPassword: String!): UserResponse!`: Changes password using a reset token.

### LiveStream Resolver

#### Queries
- `liveStreams(limit: Int, offset: Int): [LiveStream!]!`: Fetches active live streams with pagination.
- `liveStream(id: Int!): LiveStream`: Fetches a single live stream by ID.

#### Mutations
- `createLiveStream(options: LiveStreamInput!): LiveStreamResponse!`: Creates a new live stream entry and generates a secure stream key.
- `endLiveStream(id: Int!): Boolean!`: Ends a live stream session and invalidates the stream key.

## Error Handling
The API uses a centralized error handler. Errors are returned in the standard GraphQL format. Internal server errors are logged and masked in production.

## Logging
Structured logging is implemented using Winston. Logs are stored in `logs/` directory.
