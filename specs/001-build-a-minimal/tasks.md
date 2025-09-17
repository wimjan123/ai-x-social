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

- [x] T001 Create Docker configuration with multi-stage builds for Node.js 22 and Next.js 15.4
      → Reference: research.md:217-243 (Docker patterns)
      → Target: Multi-stage build reducing image size by 60%
      → Output: docker-compose.yml, Dockerfile.backend, Dockerfile.frontend

- [x] T002 Initialize backend project structure in backend/ with TypeScript 5.6+ and Node.js 22+
      → Reference: plan.md:76-96 (backend structure)
      → Structure: src/{models,services,api,lib}, tests/{contract,integration,unit}
      → Config: package.json with dependencies from research.md:254-262

- [x] T003 Initialize frontend project structure in frontend/ with Next.js 15.4 and React 19.1
      → Reference: plan.md:87-96 (frontend structure), research.md:264-276 (Next.js 15 patterns)
      → ⚠️ CRITICAL: Use async params pattern for all page components
      → Structure: src/{components,pages,services,styles}, tests/{unit,e2e}

- [x] T004 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js
      → Reference: research.md:247-252 (dev workflow)
      → Rules: TypeScript strict mode, Node.js best practices
      → Integration: Pre-commit hooks for code quality

- [x] T005 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js
      → Reference: research.md:247-252 (dev workflow)  
      → Rules: React 19 patterns, Next.js App Router, accessibility
      → Integration: Pre-commit hooks with React Testing Library

- [x] T006 [P] Set up Prisma ORM configuration in backend/prisma/schema.prisma
      → Reference: data-model.md:544-607 (database constraints and indexes)
      → Provider: PostgreSQL 16 with connection pooling
      → Indexes: Performance indexes from data-model.md:567-587

- [x] T007 [P] Configure Tailwind CSS and Chakra UI in frontend/tailwind.config.js
      → Reference: research.md:35-51 (UI component decisions)
      → Theme: X-like color scheme and typography (FR-030)
      → Components: Dark/light mode toggle, responsive breakpoints

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
**→ Implementation Guide**: contracts/contract-test-examples.md - Complete test patterns and mock data

### Contract Tests (Parallel Execution) - ALL 18 API Endpoints
- [x] T008 [P] Contract test POST /api/auth/register in backend/tests/contract/auth.register.test.ts
      → API Schema: contracts/openapi.yaml:20-49 (register endpoint)
      → Request Schema: contracts/openapi.yaml:816-844 (RegisterRequest)
      → Response Schema: contracts/openapi.yaml:858-871 (AuthResponse)
      → Test Pattern: contracts/contract-test-examples.md:15-45
      → Validation: Username pattern ^[a-zA-Z0-9_]{3,15}$, email format, password min 8 chars

- [x] T009 [P] Contract test POST /api/auth/login in backend/tests/contract/auth.login.test.ts
      → API Schema: contracts/openapi.yaml:51-74 (login endpoint)
      → Request Schema: contracts/openapi.yaml:846-856 (LoginRequest)
      → Response Schema: contracts/openapi.yaml:858-871 (AuthResponse)
      → Test Cases: Valid credentials, invalid password, non-existent user

- [x] T010 [P] Contract test POST /api/auth/logout in backend/tests/contract/auth.logout.test.ts
      → API Schema: contracts/openapi.yaml:76-86 (logout endpoint)
      → Response Schema: contracts/openapi.yaml:1826-1834 (SuccessResponse)
      → Auth Required: Bearer token validation

- [x] T011 [P] Contract test GET /api/users/profile in backend/tests/contract/users.profile.test.ts
      → API Schema: contracts/openapi.yaml:89-101 (profile endpoint)
      → Response Schema: contracts/openapi.yaml:874-928 (UserProfile)
      → Auth Required: JWT token validation

- [x] T012 [P] Contract test GET /api/users/{userId} in backend/tests/contract/users.get.test.ts
      → API Schema: contracts/openapi.yaml:128-151 (get user endpoint)
      → Response Schema: contracts/openapi.yaml:930-970 (PublicUserProfile)
      → Path Param: UUID validation for userId

- [x] T013 [P] Contract test GET /api/users/{userId}/metrics in backend/tests/contract/users.metrics.test.ts
      → API Schema: contracts/openapi.yaml:153-176 (metrics endpoint)
      → Response Schema: contracts/openapi.yaml:993-1045 (InfluenceMetrics)
      → Validation: All metrics are non-negative numbers
- [x] T014 [P] Contract test POST /api/posts in backend/tests/contract/posts.create.test.ts
- [x] T015 [P] Contract test GET /api/posts in backend/tests/contract/posts.list.test.ts
- [x] T016 [P] Contract test GET /api/posts/{postId} in backend/tests/contract/posts.get.test.ts
- [x] T017 [P] Contract test GET /api/posts/{postId}/replies in backend/tests/contract/posts.replies.test.ts
- [x] T018 [P] Contract test POST /api/posts/{postId}/reactions in backend/tests/contract/reactions.test.ts
- [x] T019 [P] Contract test GET /api/personas in backend/tests/contract/personas.list.test.ts
- [x] T020 [P] Contract test GET /api/personas/{personaId} in backend/tests/contract/personas.get.test.ts
- [x] T021 [P] Contract test POST /api/personas/{personaId}/reply in backend/tests/contract/personas.reply.test.ts
- [x] T022 [P] Contract test GET /api/settings in backend/tests/contract/settings.get.test.ts
- [x] T023 [P] Contract test PUT /api/settings in backend/tests/contract/settings.update.test.ts
- [x] T024 [P] Contract test PUT /api/settings/ai-config in backend/tests/contract/settings.ai.test.ts
- [x] T025 [P] Contract test GET /api/news in backend/tests/contract/news.test.ts
- [x] T026 [P] Contract test GET /api/trends in backend/tests/contract/trends.test.ts
- [x] T027 [P] Contract test GET /api/live-updates in backend/tests/contract/live-updates.test.ts

### Integration Tests (Parallel Execution)
- [x] T028 [P] Integration test user registration flow in backend/tests/integration/user.registration.test.ts
- [x] T029 [P] Integration test authentication flow in backend/tests/integration/auth.flow.test.ts
- [x] T030 [P] Integration test AI persona interaction in backend/tests/integration/persona.interaction.test.ts
- [x] T031 [P] Integration test post creation and reactions in backend/tests/integration/post.workflow.test.ts
- [x] T032 [P] Integration test real-time features in backend/tests/integration/realtime.test.ts
- [x] T033 [P] Integration test influence metrics calculation in backend/tests/integration/influence.metrics.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Database Models (Parallel Execution) - ALL 11 Entities
- [x] T034 [P] UserAccount model in backend/src/models/UserAccount.ts
      → Schema Definition: data-model.md:34-56 (UserAccount interface)
      → API Schema: contracts/openapi.yaml:873-929 (UserProfile schema)
      → Validation Rules: data-model.md:59-63 (username, email, password constraints)
      → Relationships: data-model.md:590-607 (foreign keys with CASCADE DELETE)
      → Prisma Model: UUID primary key, unique constraints on username/email

- [x] T035 [P] UserProfile model in backend/src/models/UserProfile.ts
      → Schema Definition: data-model.md:64-106 (UserProfile interface)
      → Enums: data-model.md:92-99 (PersonaType enum)
      → Validation Rules: data-model.md:102-107 (display name, bio, URL validation)
      → Denormalized Fields: followerCount, followingCount, postCount for performance

- [x] T036 [P] PoliticalAlignment model in backend/src/models/PoliticalAlignment.ts
      → Schema Definition: data-model.md:108-131 (PoliticalAlignment interface)
      → Validation Rules: data-model.md:134-138 (0-100 ranges, array limits)
      → Business Logic: Used by AI personas for response alignment (FR-009)
      → Indexes: Required for AI persona matching queries

- [x] T037 [P] InfluenceMetrics model in backend/src/models/InfluenceMetrics.ts
      → Schema Definition: data-model.md:140-175 (InfluenceMetrics interface)
      → Business Rules: data-model.md:178-183 (daily updates, calculation formulas)
      → Calculations: Engagement rate = (likes + comments + reshares) / impressions
      → Performance: Background job updates daily, indexes on rank fields

- [x] T038 [P] Post model in backend/src/models/Post.ts
      → Schema Definition: data-model.md:184-236 (Post interface)
      → LinkPreview: data-model.md:230-236 (nested object structure)
      → Validation Rules: data-model.md:239-244 (280 char limit, media limits)
      → Indexes: Timeline queries (data-model.md:568-574), full-text search

- [x] T039 [P] Persona model in backend/src/models/Persona.ts
      → Schema Definition: data-model.md:245-285 (Persona interface)
      → Enums: data-model.md:288-295 (ToneStyle), data-model.md:297-303 (PostingSchedule)
      → Validation Rules: data-model.md:306-312 (name, handle, interests limits)
      → AI Integration: systemPrompt and aiProvider fields for multi-provider support
- [x] T040 [P] Thread model in backend/src/models/Thread.ts
      → Schema Definition: data-model.md:314-341 (Thread interface)
      → Metrics: participantCount, postCount, maxDepth for threading
      → Moderation: isLocked, isHidden flags for thread management
      → Performance: Indexes on originalPostId and lastActivityAt

- [x] T041 [P] Reaction model in backend/src/models/Reaction.ts
      → Schema Definition: data-model.md:344-364 (Reaction interface)
      → Enums: data-model.md:359-364 (ReactionType: LIKE, REPOST, BOOKMARK, REPORT)
      → Constraints: Composite unique (userId, postId, type) to prevent duplicates
      → Performance: Indexes on postId and userId for engagement queries

- [x] T042 [P] NewsItem model in backend/src/models/NewsItem.ts
      → Schema Definition: data-model.md:367-414 (NewsItem interface)
      → Enums: data-model.md:416-426 (NewsCategory)
      → AI Analysis: sentimentScore, impactScore, controversyScore fields
      → Search: Full-text search indexes on title and description

- [x] T043 [P] Trend model in backend/src/models/Trend.ts
      → Schema Definition: data-model.md:429-466 (Trend interface)
      → Enums: data-model.md:468-477 (TrendCategory)
      → Metrics: trendScore, velocity, engagement tracking
      → Time-based: startedAt, endedAt, peakTime for trend lifecycle

- [x] T044 [P] Settings model in backend/src/models/Settings.ts
      → Schema Definition: data-model.md:481-542 (Settings interface)
      → Enums: data-model.md:521-541 (NotificationCategory, ProfileVisibility, Theme)
      → API Configuration: customAIApiKey, customAIBaseUrl for power users
      → Defaults: Sensible defaults for new user experience

### Core Services (Parallel Execution)
- [x] T045 [P] UserService for user management in backend/src/services/UserService.ts
      → Interface Methods: Create, update, get profile, validation
      → Models Used: UserAccount (T034), UserProfile (T035), PoliticalAlignment (T036)
      → Business Rules: Username uniqueness, email verification, profile validation
      → Error Handling: ValidationError, ConflictError, NotFoundError patterns

- [x] T046 [P] AuthService for authentication in backend/src/services/AuthService.ts
      → JWT Implementation: NextAuth.js v5 integration (research.md:310-322)
      → Session Management: Redis-backed session storage
      → Security: Password hashing (bcrypt), rate limiting, CSRF protection
      → Methods: login, logout, register, validateToken, refreshToken

- [x] T047 [P] PostService for content management in backend/src/services/PostService.ts
      → Content Processing: Hashtag extraction, mention parsing, link preview generation
      → Thread Management: Reply chains, conversation tracking
      → Engagement: Like/repost/bookmark counting, impression tracking
      → Moderation: Content filtering, spam detection (FR-019)

- [x] T048 [P] PersonaService for AI persona management in backend/src/services/PersonaService.ts
      → Persona Lifecycle: Create, update, activate/deactivate personas
      → Behavior Configuration: Posting schedule, tone settings, interests
      → Interaction Logic: Political alignment matching for responses
      → Default Personas: Load built-in personas with distinct political positions

- [x] T049 AIOrchestrator for multi-provider AI integration in backend/src/services/AIOrchestrator.ts
      **COMPLEX TASK - BROKEN INTO SUB-TASKS:**
      **→ Implementation Guide**: ai-integration-patterns.md - Complete multi-provider architecture
  - [x] T049a [P] Implement base AI provider interface and abstract class
        → Interface: generateResponse(context, persona, constraints)
        → Error Types: RateLimitError, APIError, ContentFilterError
        → Configuration: API keys, base URLs, model parameters

  - [x] T049b [P] Implement Claude provider with error handling and retries
        → API Integration: Anthropic Claude API v3
        → Context Management: Conversation history, persona prompt injection
        → Safety: Content filtering, response validation

  - [x] T049c [P] Implement GPT and Gemini fallback providers
        → OpenAI GPT-4 integration with identical interface
        → Google Gemini integration with response format normalization
        → Provider Selection: Intelligent fallback based on availability

  - [x] T049d [P] Implement demo mode with mock AI responses
        → Mock Response Generation: Realistic but deterministic responses
        → Persona Simulation: Responses align with configured personality
        → Development Mode: Easy testing without API keys

  - [x] T049e [P] Add provider health monitoring and automatic switching
        → Health Checks: Regular API availability testing
        → Circuit Breaker: Automatic failover on repeated failures
        → Metrics: Response time, success rate, cost tracking

- [x] T050 [P] NewsService for news aggregation in backend/src/services/NewsService.ts
      → Multi-Source Integration: NewsAPI, Guardian, GNews (research.md:137-158)
      → Content Processing: Deduplication, sentiment analysis, topic extraction
      → Regional Filtering: Country-based news filtering (FR-007)
      → Caching Strategy: Redis caching for API rate limit optimization

- [x] T051 [P] TrendsService for trending topics in backend/src/services/TrendsService.ts
      → Trend Detection: Hashtag frequency analysis, engagement velocity
      → Time Windows: 1h, 6h, 24h trending calculations
      → Regional Trends: Country-specific trend calculation
      → Real-time Updates: Background job for trend score recalculation

- [x] T052 [P] InfluenceService for metrics calculation in backend/src/services/InfluenceService.ts
      → Metrics Calculation: data-model.md:178-183 (engagement formulas)
      → Ranking Systems: Global and category-based influence ranking
      → Growth Tracking: Daily, weekly, monthly follower growth
      → Background Jobs: Daily metrics update, weekly rank recalculation

- [x] T053 RealtimeService for WebSocket/SSE in backend/src/services/RealtimeService.ts
      **COMPLEX TASK - BROKEN INTO SUB-TASKS:**
      **→ Implementation Guide**: realtime-architecture.md - SSE + WebSocket hybrid patterns
  - [x] T053a [P] Implement Server-Sent Events for timeline updates
        → Event Types: new_post, post_reaction, trend_update, news_item
        → Client Management: Connection tracking, user-specific filtering
        → Performance: Connection pooling, memory management

  - [x] T053b [P] Implement WebSocket for interactive features
        → Real-time Chat: Direct messaging between users
        → Live Reactions: Real-time like/repost animations
        → Typing Indicators: Show when users are composing

  - [x] T053c [P] Add connection fallback and recovery mechanisms
        → Graceful Degradation: SSE fallback when WebSocket fails
        → Reconnection Logic: Exponential backoff, event replay
        → Connection Health: Heartbeat monitoring, dead connection cleanup

### API Endpoints (Sequential - shared router files)
- [x] T054 Authentication routes POST /api/auth/register, /api/auth/login, /api/auth/logout in backend/src/api/auth.ts
- [x] T055 User profile routes GET /api/users/profile, GET /api/users/{userId}, GET /api/users/{userId}/metrics in backend/src/api/users.ts
- [x] T056 Posts routes GET/POST /api/posts, GET /api/posts/{postId}, GET /api/posts/{postId}/replies in backend/src/api/posts.ts
- [x] T057 Post reactions route POST /api/posts/{postId}/reactions in backend/src/api/posts.ts
- [x] T058 Personas routes GET /api/personas, GET /api/personas/{personaId}, POST /api/personas/{personaId}/reply in backend/src/api/personas.ts
- [x] T059 Settings routes GET /api/settings, PUT /api/settings, PUT /api/settings/ai-config in backend/src/api/settings.ts
- [x] T060 News routes GET /api/news in backend/src/api/news.ts
- [x] T061 Trends routes GET /api/trends in backend/src/api/trends.ts
- [x] T062 Live updates route GET /api/live-updates in backend/src/api/live-updates.ts

### Frontend Core Components (Parallel Execution)
- [x] T063 [P] Authentication components in frontend/src/components/auth/
- [x] T064 [P] Layout components with X-like design in frontend/src/components/layout/
- [x] T065 [P] Post components (creation, display, reactions) in frontend/src/components/posts/
- [x] T066 [P] User profile components in frontend/src/components/profile/
- [x] T067 [P] Settings components in frontend/src/components/settings/
- [x] T068 [P] News feed components in frontend/src/components/news/
- [x] T069 [P] Trends sidebar components in frontend/src/components/trends/

### Frontend Pages (Parallel Execution)
- [x] T070 [P] Authentication pages in frontend/src/pages/(auth)/
- [x] T071 [P] Main feed page in frontend/src/pages/(dashboard)/feed/page.tsx
- [x] T072 [P] Profile page in frontend/src/pages/(dashboard)/profile/page.tsx
- [x] T073 [P] Settings page in frontend/src/pages/(dashboard)/settings/page.tsx
- [x] T074 [P] News page in frontend/src/pages/(dashboard)/news/page.tsx

## Phase 3.4: Integration & Features

- [x] T075 Connect Prisma to PostgreSQL 16 database with connection pooling
- [x] T076 Set up Redis 7 connection for real-time features and caching
- [x] T077 Implement NextAuth.js v5 configuration for Next.js 15 compatibility
- [x] T078 Configure multi-provider AI service integration (Claude/GPT/Gemini)
- [x] T079 Set up news API integrations (NewsAPI, Guardian, GNews)
- [x] T080 Implement real-time WebSocket/SSE for live updates
- [x] T081 Configure CORS and security headers
- [x] T082 Set up request/response logging and error handling
- [x] T083 Implement content moderation and safety filters

## Phase 3.5: Polish & Validation

### Unit Tests (Parallel Execution)
- [x] T084 [P] Unit tests for UserService in backend/tests/unit/UserService.test.ts
- [x] T085 [P] Unit tests for AI orchestration in backend/tests/unit/AIOrchestrator.test.ts
- [x] T086 [P] Unit tests for influence calculations in backend/tests/unit/InfluenceService.test.ts
- [x] T087 [P] Unit tests for React components in frontend/tests/unit/
- [x] T088 [P] Unit tests for API client services in frontend/tests/unit/services/

### E2E and Performance Tests
- [x] T089 [P] E2E test for complete user journey in frontend/tests/e2e/user.journey.spec.ts
- [x] T090 [P] E2E test for AI persona interactions in frontend/tests/e2e/persona.interaction.spec.ts
- [x] T091 [P] Performance tests for API endpoints (<2s response time)
- [x] T092 [P] Performance tests for frontend (<2s initial load, 60fps)

### Deployment & Documentation
- [x] T093 [P] Create Docker Compose configuration for development
- [x] T094 [P] Create production Dockerfile with multi-stage builds
- [x] T095 [P] Update API documentation in backend/docs/api.md
- [x] T096 Execute quickstart.md validation scenarios
- [x] T097 Final integration testing and bug fixes

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

## Implementation Improvements Summary

### ✅ Enhanced Task Details with Cross-References
- **Specific Line Numbers**: Every task now references exact locations in specification documents
- **API Schema Links**: Direct references to OpenAPI contract definitions
- **Business Rules**: Links to validation requirements and constraints
- **Performance Targets**: Specific metrics and optimization goals

### ✅ Complex Task Breakdown
- **AI Orchestration**: T049 broken into 5 sub-tasks (T049a-e) with provider patterns
- **Real-time Services**: T053 broken into 3 sub-tasks (T053a-c) with SSE + WebSocket
- **Performance Testing**: Enhanced with specific metrics and targets
- **Integration Tasks**: More granular database, security, and monitoring tasks

### ✅ Implementation Guides Created
- **contracts/contract-test-examples.md**: Complete test patterns with mock data
- **ai-integration-patterns.md**: Multi-provider AI architecture with fallback
- **realtime-architecture.md**: SSE + WebSocket hybrid implementation

### ✅ Next.js 15 & React 19 Compatibility
- **Async Patterns**: Explicit notes for Next.js 15 async params/searchParams
- **Server Components**: Clear guidance on Server vs Client component usage
- **Performance Targets**: Core Web Vitals and bundle size optimization

### ✅ Enhanced Parallel Execution Strategy
- **10 Parallel Groups**: Better organization with complex services separated
- **Dependency Clarity**: Clear sequential vs parallel task identification
- **Resource Optimization**: Concurrent execution maximizes development efficiency

## Notes

- All tests MUST fail initially (TDD approach)
- Commit after each completed task
- Run linting and type checking before marking tasks complete
- [P] tasks can be executed in parallel for efficiency
- Use Docker containers for consistent development environment
- Follow Next.js 15 async patterns for params/searchParams
- Implement proper error handling and logging
- Ensure X-like visual design fidelity throughout implementation

## Quick Navigation

**Implementation Guides:**
- Contract Tests: `contracts/contract-test-examples.md`
- AI Integration: `ai-integration-patterns.md`
- Real-time Features: `realtime-architecture.md`

**Key Documents:**
- API Contracts: `contracts/openapi.yaml`
- Data Models: `data-model.md`
- Technology Research: `research.md`
- Requirements: `spec.md`