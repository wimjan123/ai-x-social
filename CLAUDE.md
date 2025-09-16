# AI Social Media Platform Development Guidelines

Auto-generated from feature 001-build-a-minimal. Last updated: 2025-09-16

## Active Technologies

**Frontend**: Next.js 15.4 + React 19.1 + TypeScript + Chakra UI + Tailwind CSS + Lucide Icons  
**Backend**: Node.js + Express + Prisma ORM + PostgreSQL + Redis  
**AI Integration**: Multi-provider (Claude/GPT/Gemini) with intelligent fallback  
**Real-time**: Server-Sent Events + WebSocket hybrid architecture  
**News**: Multi-source aggregation (NewsAPI, Guardian, GNews, RSS)  
**Testing**: Jest + React Testing Library + Playwright  
**Containerization**: Docker multi-stage builds + Docker Compose orchestration  
**Authentication**: NextAuth.js + JWT

**⚠️ BREAKING CHANGES**: Next.js 15 requires async patterns for params/searchParams. React 19 Compiler available for automatic optimization.  

## Project Structure

```
# Web Application (Frontend + Backend)
backend/
├── src/
│   ├── models/          # Prisma schemas, entity definitions
│   ├── services/        # AI service integration, news fetching, user management
│   ├── api/            # REST API endpoints, authentication, real-time subscriptions
│   └── lib/            # Shared utilities, constants, types
└── tests/
    ├── contract/       # API contract tests
    ├── integration/    # Service integration tests
    └── unit/          # Unit tests for services and utilities

frontend/
├── src/
│   ├── components/     # React components (UI, forms, layouts)
│   ├── pages/         # Next.js App Router pages
│   ├── services/      # API clients, state management
│   └── styles/        # Tailwind CSS, X-like styling
└── tests/
    ├── unit/          # Component unit tests
    └── e2e/           # Playwright E2E tests

specs/001-build-a-minimal/
├── plan.md            # Implementation plan
├── research.md        # Technology research and decisions
├── data-model.md      # Database schema and entities
├── quickstart.md      # End-to-end testing guide
└── contracts/         # OpenAPI specifications
```

## Commands

### Development Setup
```bash
# Install dependencies
npm install

# Database setup
npx prisma generate
npx prisma db push
npm run seed

# Start development
npm run dev          # Next.js frontend (port 3000)
npm run dev:api      # Backend API (port 3001)
```

### Testing
```bash
# Unit tests
npm test
npm run test:watch

# E2E tests
npm run test:e2e

# API contract tests
npm run test:contracts
```

### Database Operations
```bash
# View database
npx prisma studio

# Reset database
npx prisma db reset

# Generate new migration
npx prisma db push
```

## Code Style

### TypeScript/React
- Use functional components with hooks
- Implement strict TypeScript typing
- Server Components by default, Client Components only when needed
- Props interfaces defined inline or as separate types

### API Design
- RESTful endpoints following OpenAPI 3.0 specification
- Consistent error handling with proper HTTP status codes
- JWT authentication with NextAuth.js
- Request validation using Zod schemas

### Database
- Use Prisma ORM with PostgreSQL
- UUID primary keys for all entities
- Proper foreign key relationships with CASCADE DELETE
- Performance indexes for common queries

### AI Integration
- Multi-provider fallback pattern (Claude → GPT → Gemini → Demo)
- Streaming responses for real-time interactions
- Context preservation using Redis for hot data
- Rate limiting and cost optimization

## Key Features

### Political/Influencer Simulation
- User account creation with customizable political personas
- AI personas with distinct political alignments and personalities
- Influence metrics tracking (followers, engagement, approval ratings)
- Political discourse simulation with support/opposition dynamics

### X-like Interface
- Three-column layout (navigation, timeline, trends)
- Dark/light theme support
- Mobile-responsive design with bottom navigation
- Character count and X-style post composer

### Real-time Features
- Server-Sent Events for timeline updates
- WebSocket for chat and live interactions
- Real-time AI persona responses within 2 minutes
- Live trending topics and news integration

### News Integration
- Multi-source news aggregation from free APIs
- Regional filtering and localization
- AI persona reactions to current events
- Topic extraction and sentiment analysis

## Recent Changes

**Feature 001-build-a-minimal** (2025-09-16):
- Comprehensive technical research and architecture decisions
- Database schema design for social media with political simulation
- OpenAPI contract specification for all endpoints
- Multi-provider AI integration with fallback mechanisms
- Real-time communication patterns (SSE + WebSocket)
- X-like UI design patterns and responsive layouts

<!-- MANUAL ADDITIONS START -->
<!-- Add any manual project-specific guidelines here -->
<!-- MANUAL ADDITIONS END -->