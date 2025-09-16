# Tasks: Politician/Influencer Social Media Simulator

**Input**: Design documents from `/specs/001-build-a-minimal/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow
```
1. Load plan.md from feature directory
   → Tech stack: Next.js 15.4 + React 19.1 + Node.js 22 + TypeScript 5.6
   → Structure: Web application (frontend + backend)
2. Load design documents:
   → data-model.md: 11 entities (UserAccount, Post, Persona, etc.)
   → contracts/: 18 API endpoints across authentication, posts, personas, settings
   → quickstart.md: 10 test scenarios for validation
3. Generate tasks by category:
   → Setup: Docker, dependencies, Prisma, linting
   → Tests: Contract tests, integration tests (TDD approach)
   → Core: Models, services, API endpoints
   → Integration: Database, AI services, real-time features
   → Polish: Unit tests, performance, E2E validation
4. Task ordering: Setup → Tests → Models → Services → API → Integration → Polish
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Project Setup

- [ ] T001 Create Docker configuration with multi-stage builds for Node.js 22 and Next.js 15.4
- [ ] T002 Initialize backend project structure in backend/ with TypeScript 5.6+ and Node.js 22+
- [ ] T003 Initialize frontend project structure in frontend/ with Next.js 15.4 and React 19.1
- [ ] T004 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js
- [ ] T005 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js  
- [ ] T006 [P] Set up Prisma ORM configuration in backend/prisma/schema.prisma
- [ ] T007 [P] Configure Tailwind CSS and Chakra UI in frontend/tailwind.config.js

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Parallel Execution) - ALL 18 API Endpoints
- [ ] T008 [P] Contract test POST /api/auth/register in backend/tests/contract/auth.register.test.ts
- [ ] T009 [P] Contract test POST /api/auth/login in backend/tests/contract/auth.login.test.ts
- [ ] T010 [P] Contract test POST /api/auth/logout in backend/tests/contract/auth.logout.test.ts
- [ ] T011 [P] Contract test GET /api/users/profile in backend/tests/contract/users.profile.test.ts
- [ ] T012 [P] Contract test GET /api/users/{userId} in backend/tests/contract/users.get.test.ts
- [ ] T013 [P] Contract test GET /api/users/{userId}/metrics in backend/tests/contract/users.metrics.test.ts
- [ ] T014 [P] Contract test POST /api/posts in backend/tests/contract/posts.create.test.ts
- [ ] T015 [P] Contract test GET /api/posts in backend/tests/contract/posts.list.test.ts
- [ ] T016 [P] Contract test GET /api/posts/{postId} in backend/tests/contract/posts.get.test.ts
- [ ] T017 [P] Contract test GET /api/posts/{postId}/replies in backend/tests/contract/posts.replies.test.ts
- [ ] T018 [P] Contract test POST /api/posts/{postId}/reactions in backend/tests/contract/reactions.test.ts
- [ ] T019 [P] Contract test GET /api/personas in backend/tests/contract/personas.list.test.ts
- [ ] T020 [P] Contract test GET /api/personas/{personaId} in backend/tests/contract/personas.get.test.ts
- [ ] T021 [P] Contract test POST /api/personas/{personaId}/reply in backend/tests/contract/personas.reply.test.ts
- [ ] T022 [P] Contract test GET /api/settings in backend/tests/contract/settings.get.test.ts
- [ ] T023 [P] Contract test PUT /api/settings in backend/tests/contract/settings.update.test.ts
- [ ] T024 [P] Contract test PUT /api/settings/ai-config in backend/tests/contract/settings.ai.test.ts
- [ ] T025 [P] Contract test GET /api/news in backend/tests/contract/news.test.ts
- [ ] T026 [P] Contract test GET /api/trends in backend/tests/contract/trends.test.ts
- [ ] T027 [P] Contract test GET /api/live-updates in backend/tests/contract/live-updates.test.ts

### Integration Tests (Parallel Execution)
- [ ] T028 [P] Integration test user registration flow in backend/tests/integration/user.registration.test.ts
- [ ] T029 [P] Integration test authentication flow in backend/tests/integration/auth.flow.test.ts
- [ ] T030 [P] Integration test AI persona interaction in backend/tests/integration/persona.interaction.test.ts
- [ ] T031 [P] Integration test post creation and reactions in backend/tests/integration/post.workflow.test.ts
- [ ] T032 [P] Integration test real-time features in backend/tests/integration/realtime.test.ts
- [ ] T033 [P] Integration test influence metrics calculation in backend/tests/integration/influence.metrics.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Database Models (Parallel Execution) - ALL 11 Entities
- [ ] T034 [P] UserAccount model in backend/src/models/UserAccount.ts
- [ ] T035 [P] UserProfile model in backend/src/models/UserProfile.ts
- [ ] T036 [P] PoliticalAlignment model in backend/src/models/PoliticalAlignment.ts
- [ ] T037 [P] InfluenceMetrics model in backend/src/models/InfluenceMetrics.ts
- [ ] T038 [P] Post model in backend/src/models/Post.ts
- [ ] T039 [P] Persona model in backend/src/models/Persona.ts
- [ ] T040 [P] Thread model in backend/src/models/Thread.ts
- [ ] T041 [P] Reaction model in backend/src/models/Reaction.ts
- [ ] T042 [P] NewsItem model in backend/src/models/NewsItem.ts
- [ ] T043 [P] Trend model in backend/src/models/Trend.ts
- [ ] T044 [P] Settings model in backend/src/models/Settings.ts

### Core Services (Parallel Execution)  
- [ ] T045 [P] UserService for user management in backend/src/services/UserService.ts
- [ ] T046 [P] AuthService for authentication in backend/src/services/AuthService.ts
- [ ] T047 [P] PostService for content management in backend/src/services/PostService.ts
- [ ] T048 [P] PersonaService for AI persona management in backend/src/services/PersonaService.ts
- [ ] T049 [P] AIOrchestrator for multi-provider AI integration in backend/src/services/AIOrchestrator.ts
- [ ] T050 [P] NewsService for news aggregation in backend/src/services/NewsService.ts
- [ ] T051 [P] TrendsService for trending topics in backend/src/services/TrendsService.ts
- [ ] T052 [P] InfluenceService for metrics calculation in backend/src/services/InfluenceService.ts
- [ ] T053 [P] RealtimeService for WebSocket/SSE in backend/src/services/RealtimeService.ts

### API Endpoints (Sequential - shared router files)
- [ ] T054 Authentication routes POST /api/auth/register, /api/auth/login, /api/auth/logout in backend/src/api/auth.ts
- [ ] T055 User profile routes GET /api/users/profile, GET /api/users/{userId}, GET /api/users/{userId}/metrics in backend/src/api/users.ts
- [ ] T056 Posts routes GET/POST /api/posts, GET /api/posts/{postId}, GET /api/posts/{postId}/replies in backend/src/api/posts.ts
- [ ] T057 Post reactions route POST /api/posts/{postId}/reactions in backend/src/api/posts.ts
- [ ] T058 Personas routes GET /api/personas, GET /api/personas/{personaId}, POST /api/personas/{personaId}/reply in backend/src/api/personas.ts
- [ ] T059 Settings routes GET /api/settings, PUT /api/settings, PUT /api/settings/ai-config in backend/src/api/settings.ts
- [ ] T060 News routes GET /api/news in backend/src/api/news.ts
- [ ] T061 Trends routes GET /api/trends in backend/src/api/trends.ts
- [ ] T062 Live updates route GET /api/live-updates in backend/src/api/live-updates.ts

### Frontend Core Components (Parallel Execution)
- [ ] T063 [P] Authentication components in frontend/src/components/auth/
- [ ] T064 [P] Layout components with X-like design in frontend/src/components/layout/
- [ ] T065 [P] Post components (creation, display, reactions) in frontend/src/components/posts/
- [ ] T066 [P] User profile components in frontend/src/components/profile/
- [ ] T067 [P] Settings components in frontend/src/components/settings/
- [ ] T068 [P] News feed components in frontend/src/components/news/
- [ ] T069 [P] Trends sidebar components in frontend/src/components/trends/

### Frontend Pages (Parallel Execution)
- [ ] T070 [P] Authentication pages in frontend/src/pages/(auth)/
- [ ] T071 [P] Main feed page in frontend/src/pages/(dashboard)/feed/page.tsx
- [ ] T072 [P] Profile page in frontend/src/pages/(dashboard)/profile/page.tsx
- [ ] T073 [P] Settings page in frontend/src/pages/(dashboard)/settings/page.tsx
- [ ] T074 [P] News page in frontend/src/pages/(dashboard)/news/page.tsx

## Phase 3.4: Integration & Features

- [ ] T075 Connect Prisma to PostgreSQL 16 database with connection pooling
- [ ] T076 Set up Redis 7 connection for real-time features and caching
- [ ] T077 Implement NextAuth.js v5 configuration for Next.js 15 compatibility
- [ ] T078 Configure multi-provider AI service integration (Claude/GPT/Gemini)
- [ ] T079 Set up news API integrations (NewsAPI, Guardian, GNews)
- [ ] T080 Implement real-time WebSocket/SSE for live updates
- [ ] T081 Configure CORS and security headers
- [ ] T082 Set up request/response logging and error handling
- [ ] T083 Implement content moderation and safety filters

## Phase 3.5: Polish & Validation

### Unit Tests (Parallel Execution)
- [ ] T084 [P] Unit tests for UserService in backend/tests/unit/UserService.test.ts
- [ ] T085 [P] Unit tests for AI orchestration in backend/tests/unit/AIOrchestrator.test.ts
- [ ] T086 [P] Unit tests for influence calculations in backend/tests/unit/InfluenceService.test.ts
- [ ] T087 [P] Unit tests for React components in frontend/tests/unit/
- [ ] T088 [P] Unit tests for API client services in frontend/tests/unit/services/

### E2E and Performance Tests
- [ ] T089 [P] E2E test for complete user journey in frontend/tests/e2e/user.journey.spec.ts
- [ ] T090 [P] E2E test for AI persona interactions in frontend/tests/e2e/persona.interaction.spec.ts
- [ ] T091 [P] Performance tests for API endpoints (<2s response time)
- [ ] T092 [P] Performance tests for frontend (<2s initial load, 60fps)

### Deployment & Documentation
- [ ] T093 [P] Create Docker Compose configuration for development
- [ ] T094 [P] Create production Dockerfile with multi-stage builds
- [ ] T095 [P] Update API documentation in backend/docs/api.md
- [ ] T096 Execute quickstart.md validation scenarios
- [ ] T097 Final integration testing and bug fixes

## Dependencies

**Sequential Dependencies:**
- Setup (T001-T007) before all tests and implementation
- Contract tests (T008-T027) before corresponding implementations
- Models (T034-T044) before services (T045-T053)
- Services before API endpoints (T054-T062)
- Core implementation before integration (T075-T083)
- Everything before final validation (T096-T097)

**Parallel Groups:**
- **Group 1 - Contract Tests**: T008-T027 (20 tests covering all 18 endpoints + live-updates + SSE)
- **Group 2 - Integration Tests**: T028-T033 (6 workflow tests)
- **Group 3 - Models**: T034-T044 (11 entity models)
- **Group 4 - Services**: T045-T053 (9 core services)
- **Group 5 - Frontend Components**: T063-T074 (12 component groups)
- **Group 6 - Unit Tests**: T084-T088 (5 unit test suites)
- **Group 7 - E2E Tests**: T089-T092 (4 end-to-end test suites)

## Parallel Execution Examples

### Launch All Contract Tests (T008-T027):
```
Task: "Contract test POST /api/auth/register in backend/tests/contract/auth.register.test.ts"
Task: "Contract test POST /api/auth/login in backend/tests/contract/auth.login.test.ts"
Task: "Contract test POST /api/auth/logout in backend/tests/contract/auth.logout.test.ts"
Task: "Contract test GET /api/users/profile in backend/tests/contract/users.profile.test.ts"
Task: "Contract test GET /api/users/{userId} in backend/tests/contract/users.get.test.ts"
Task: "Contract test GET /api/users/{userId}/metrics in backend/tests/contract/users.metrics.test.ts"
Task: "Contract test POST /api/posts in backend/tests/contract/posts.create.test.ts"
Task: "Contract test GET /api/posts in backend/tests/contract/posts.list.test.ts"
Task: "Contract test GET /api/posts/{postId} in backend/tests/contract/posts.get.test.ts"
Task: "Contract test GET /api/posts/{postId}/replies in backend/tests/contract/posts.replies.test.ts"
Task: "Contract test POST /api/posts/{postId}/reactions in backend/tests/contract/reactions.test.ts"
Task: "Contract test GET /api/personas in backend/tests/contract/personas.list.test.ts"
Task: "Contract test GET /api/personas/{personaId} in backend/tests/contract/personas.get.test.ts"
Task: "Contract test POST /api/personas/{personaId}/reply in backend/tests/contract/personas.reply.test.ts"
Task: "Contract test GET /api/settings in backend/tests/contract/settings.get.test.ts"
Task: "Contract test PUT /api/settings in backend/tests/contract/settings.update.test.ts"
Task: "Contract test PUT /api/settings/ai-config in backend/tests/contract/settings.ai.test.ts"
Task: "Contract test GET /api/news in backend/tests/contract/news.test.ts"
Task: "Contract test GET /api/trends in backend/tests/contract/trends.test.ts"
Task: "Contract test GET /api/live-updates in backend/tests/contract/live-updates.test.ts"
```

### Launch Database Models (T034-T044):
```
Task: "UserAccount model in backend/src/models/UserAccount.ts"
Task: "UserProfile model in backend/src/models/UserProfile.ts"
Task: "PoliticalAlignment model in backend/src/models/PoliticalAlignment.ts"
Task: "InfluenceMetrics model in backend/src/models/InfluenceMetrics.ts"
Task: "Post model in backend/src/models/Post.ts"
Task: "Persona model in backend/src/models/Persona.ts"
Task: "Thread model in backend/src/models/Thread.ts"
Task: "Reaction model in backend/src/models/Reaction.ts"
Task: "NewsItem model in backend/src/models/NewsItem.ts"
Task: "Trend model in backend/src/models/Trend.ts"
Task: "Settings model in backend/src/models/Settings.ts"
```

### Launch Core Services (T045-T053):
```
Task: "UserService for user management in backend/src/services/UserService.ts"
Task: "AuthService for authentication in backend/src/services/AuthService.ts"
Task: "PostService for content management in backend/src/services/PostService.ts"
Task: "PersonaService for AI persona management in backend/src/services/PersonaService.ts"
Task: "AIOrchestrator for multi-provider AI integration in backend/src/services/AIOrchestrator.ts"
Task: "NewsService for news aggregation in backend/src/services/NewsService.ts"
Task: "TrendsService for trending topics in backend/src/services/TrendsService.ts"
Task: "InfluenceService for metrics calculation in backend/src/services/InfluenceService.ts"
Task: "RealtimeService for WebSocket/SSE in backend/src/services/RealtimeService.ts"
```

## Cross-Reference Validation ✅

### API Endpoints Coverage:
- [x] All 18 endpoints from contracts/openapi.yaml have corresponding contract tests (T008-T027)
- [x] All major endpoint groups have implementation tasks (T054-T062)

### Database Entities Coverage:
- [x] All 11 entities from data-model.md have corresponding model tasks (T034-T044)
- [x] Entity names match exactly: UserAccount, UserProfile, PoliticalAlignment, etc.

### Technology Stack Consistency:
- [x] Node.js 22+ referenced in setup tasks
- [x] TypeScript 5.6+ specified in backend initialization
- [x] Next.js 15.4 + React 19.1 specified in frontend initialization
- [x] PostgreSQL 16 + Redis 7 specified in integration tasks
- [x] Docker containerization included in deployment tasks

### File Structure Alignment:
- [x] Backend structure matches plan.md: backend/src/{models,services,api}
- [x] Frontend structure matches plan.md: frontend/src/{components,pages}
- [x] Test structure matches plan.md: backend/tests/{contract,integration,unit}

### Quickstart Scenarios Coverage:
- [x] User registration flow → T028 integration test
- [x] AI persona interaction → T030 integration test  
- [x] Post creation workflow → T031 integration test
- [x] Real-time features → T032 integration test
- [x] Influence metrics → T033 integration test
- [x] Complete user journey → T089 E2E test

## Validation Checklist

- [x] All 18 API endpoints have corresponding contract tests
- [x] All 11 entities have model creation tasks
- [x] All contract tests come before implementation tasks
- [x] All [P] tasks target different files
- [x] Each task specifies exact file path
- [x] Dependencies properly ordered (TDD approach)
- [x] Docker containerization included
- [x] Next.js 15 async patterns considered
- [x] Multi-provider AI integration planned
- [x] Real-time features included
- [x] X-like UI components planned
- [x] Performance and E2E testing included
- [x] Technology versions consistent across all references
- [x] File structure matches plan.md specifications

## Notes

- All tests MUST fail initially (TDD approach)
- Commit after each completed task
- Run linting and type checking before marking tasks complete
- [P] tasks can be executed in parallel for efficiency
- Use Docker containers for consistent development environment
- Follow Next.js 15 async patterns for params/searchParams
- Implement proper error handling and logging
- Ensure X-like visual design fidelity throughout implementation