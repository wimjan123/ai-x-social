# Implementation Plan: Politician/Influencer Social Media Simulator with AI Personas

**Branch**: `001-build-a-minimal` | **Date**: 2025-09-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-a-minimal/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a politician/influencer social media simulator with X-like interface where users create customizable political personas, engage with AI characters that respond based on political alignment, and track influence metrics in a game-like progression system with real-time news integration.

## Technical Context
**Language/Version**: TypeScript 5.6+, Node.js 22+  
**Primary Dependencies**: React 19.1+, Next.js 15.4+, Tailwind CSS, Prisma ORM, Zustand  
**Storage**: PostgreSQL for user data, Redis for real-time features, File storage for media  
**Testing**: Jest, React Testing Library, Playwright for E2E  
**Target Platform**: Web application (responsive design for desktop and mobile)  
**Containerization**: Docker with multi-stage builds, Docker Compose for development
**Project Type**: web - frontend + backend API  
**Performance Goals**: <2s initial load, real-time AI responses within 2 minutes, 60fps UI animations  
**Constraints**: X-like visual design fidelity, configurable AI service integration, demo mode fallback  
**Scale/Scope**: MVP for 100+ concurrent users, 10+ AI personas, news integration from free APIs

**⚠️ CRITICAL UPDATE**: Research using Context7 revealed Next.js 15 breaking changes requiring async patterns for params/searchParams. See research.md for implementation details.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASS (Constitution template not yet populated with specific rules)

Since the constitution file contains only placeholder content, no specific violations can be identified. The approach follows general best practices:
- Modular architecture with clear separation of concerns
- API-first design for AI service integration
- Configurable settings for flexibility
- Demo mode for graceful degradation

## Project Structure

### Documentation (this feature)
```
specs/001-build-a-minimal/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 2: Web application (frontend + backend detected)
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
│   ├── pages/         # Next.js pages and routing
│   ├── services/      # API clients, state management
│   └── styles/        # Tailwind CSS, X-like styling
└── tests/
    ├── unit/          # Component unit tests
    └── e2e/           # Playwright E2E tests
```

**Structure Decision**: Option 2 - Web application (frontend React/Next.js + backend Node.js API)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Research modern React/Next.js architecture patterns
   - Investigate X-like UI component libraries and design systems
   - Research AI service integration patterns (OpenAI, Anthropic, local models)
   - Analyze real-time news API options (NewsAPI, RSS feeds, etc.)
   - Research real-time communication patterns (WebSockets, SSE, polling)

2. **Generate and dispatch research agents**:
   ```
   Task: "Research Next.js 15 App Router architecture for social media apps"
   Task: "Find X (Twitter)-like UI component libraries and design patterns"
   Task: "Research AI service integration patterns with fallback mechanisms"  
   Task: "Find free news APIs for real-time current events integration"
   Task: "Research real-time features implementation (WebSockets vs SSE vs polling)"
   Task: "Find PostgreSQL schema patterns for social media platforms"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technical choices resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - UserAccount, UserProfile, Post, Persona, Thread, Reaction
   - InfluenceMetrics, PoliticalAlignment, Settings, Trend, NewsItem
   - Validation rules from functional requirements
   - State transitions for influence progression

2. **Generate API contracts** from functional requirements:
   - Authentication: POST /auth/register, POST /auth/login
   - Posts: GET/POST /posts, GET/POST /posts/:id/replies
   - Personas: GET/POST/PUT /personas, POST /personas/:id/reply
   - Users: GET/PUT /users/profile, GET /users/:id/metrics
   - Settings: GET/PUT /settings, POST /settings/ai-config
   - Real-time: WebSocket /ws/timeline, /ws/notifications
   - Output OpenAPI schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint group
   - Assert request/response schemas match OpenAPI
   - Tests must fail initially (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Account creation flow → integration test
   - AI persona interaction → integration test
   - Influence progression → integration test
   - X-like UI rendering → E2E test

5. **Update agent file incrementally**:
   - Run update script for Claude Code context
   - Add React/Next.js, AI integration, social media domain knowledge
   - Preserve existing manual additions
   - Keep under 150 lines for efficiency

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each API endpoint → contract test task + implementation task [P]
- Each entity/model → creation task [P] 
- Each user story → integration test task
- UI components → component creation + styling tasks [P]
- AI service integration → service implementation task
- Real-time features → WebSocket/SSE implementation task

**Ordering Strategy**:
- TDD order: Contract tests → implementation → integration tests
- Dependency order: Models → Services → API → UI
- Database setup → Backend services → Frontend components
- Mark [P] for parallel execution (independent components)

**Estimated Output**: 35-40 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations identified at this stage*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution template - See `/memory/constitution.md`*