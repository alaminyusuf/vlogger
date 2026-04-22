# Vlogger

A modern fashion vlogging and social platform.

## Features
- **User Authentication**: Secure registration and login using Argon2 and session-based tracking.
- **Post Management**: Create, read, and delete written posts.
- **Likes**: Updoot/Like functionality for written posts.
- **Live Streaming**: Infrastructure for creating and managing live stream sessions (schema only).
- **Error Handling**: Centralized error management to ensure robust API responses and security.
- **Structured Logging**: Advanced logging using Winston for better debugging and monitoring.
- **Documentation**: Comprehensive inline JSDoc/TSDoc and API documentation.

## Technology Stack
- **Backend**: Node.js, TypeScript, Apollo Server, Express, TypeORM, GraphQL, PostgreSQL, Redis.
- **Frontend**: React (in `web/` directory).

## Getting Started

### Prerequisites
- Node.js & Yarn/NPM
- PostgreSQL
- Redis

### Installation
1. Clone the repository.
2. Navigate to the `server` directory:
   ```bash
   cd server
   yarn install
   ```
3. Set up your environment variables (database connection, session secret, etc.).
4. Run the database migrations:
   ```bash
   yarn db:migrate
   ```
5. Start the development server:
   ```bash
   yarn server
   ```

## Documentation
- Detailed API documentation can be found in [API.md](./API.md).
- Inline documentation is available throughout the codebase using JSDoc/TSDoc.

## License
ISC
