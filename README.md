# Vlogger - Scalable Live Streaming Infrastructure

Vlogger is a specialized software platform designed for high-performance, scalable live Streaming. Unlike traditional social media platforms, Vlogger focuses on providing a robust API and creator tools for managing professional-grade live broadcasts.

## 🚀 Features

- **Scalable Live Streaming API**: Optimized for high concurrency, supporting thousands of active streams and viewers simultaneously.
- **Stream Key Architecture**: Secure ingestion system using unique, per-stream keys for ingestion via RTMP/HLS (infrastructure ready).
- **Real-time Analytics**: Built-in tracking for viewer counts and stream health metrics.
- **Premium Creator SPA**: A modern, high-performance Single Page Application (SPA) for managing streams, featuring a sleek, professional UI.
- **Dockerized Infrastructure**: Complete environment orchestration for the API, Database, and Cache.
- **Robust Error Handling & Logging**: Production-ready error masking and structured logging via Winston.

## 🛠 Technology Stack

### Backend
- **Core**: Node.js & TypeScript
- **API**: Apollo Server 3 (GraphQL)
- **ORM**: TypeORM 0.3 (Data Source pattern)
- **Database**: PostgreSQL
- **Caching & Sessions**: Redis
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 14
- **UI Library**: Chakra UI (Premium Theme)
- **GraphQL Client**: URQL with GraphCache
- **State Management**: Formik & Framer Motion

## 🐳 Docker Deployment

The easiest way to get Vlogger running is using Docker Compose.

1. **Start all services**:
   ```bash
   cd server
   docker-compose up -d
   ```
   This will spin up:
   - **Streaming API** on `http://localhost:4000/graphql`
   - **PostgreSQL** on `5432`
   - **Redis** on `6379`

2. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```

## 💻 Local Development

### Server
```bash
cd server
npm install
npm run server
```

### Web
```bash
cd web
npm install
npm run dev
```

## 🏗 Project Structure

- `/server`: The core Streaming API and business logic.
- `/web`: The Next.js Single Page Application.
- `/server/src/entity`: Database models (User, LiveStream).
- `/server/src/resolvers`: GraphQL API logic.

## 📈 Recent Milestones
- [x] Pivot to dedicated Streaming software (removed legacy social features).
- [x] Implemented scalable pagination for active streams.
- [x] Migrated to TypeORM 0.3 and modern dependency stack.
- [x] Created premium SPA for stream management and viewing.
- [x] Unified Docker orchestration for all services.

## 📜 License
ISC
