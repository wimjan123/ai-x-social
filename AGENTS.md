# Repository Guidelines

## Project Structure & Module Organization
The workspace splits into `backend/` (Express + Prisma API) and `frontend/` (Next.js 15 App Router). Backend modules live under `src/` with `api/` route handlers, `services/` orchestration, `models/` Prisma schema bindings, and shared utilities in `lib/`. Automated tests sit in `tests/{unit,integration,contract}`. The frontend `src/` folder contains `app/` routes, `components/ui` primitives, `services/` API clients, and Playwright suites in `tests/e2e`. Shared Docker orchestration lives in `docker/`, while `scripts/docker-dev.sh` wraps compose tasks. Prisma schema files reside in `backend/prisma/` and should be updated alongside migrations.

## Build, Test & Development Commands
Install dependencies inside each package: `npm install` within `backend/` and `frontend/`. Run `npm run dev` in both services for hot reload; `scripts/docker-dev.sh start` boots the full stack with Postgres and Redis. Build with `npm run build` (backend compiles TypeScript, frontend runs `next build`). Key tests: `npm test`, `npm run test:unit`, `npm run test:integration`, and `npm run test:coverage` in `backend/`; `npm test`, `npm run test:e2e`, and `npm run test:all` in `frontend/`. Lint and type-check via `npm run lint`, `npm run lint:fix`, `npm run format`, and `npm run typecheck` (backend) or `npm run type-check` and `npm run quality` (frontend).

## Coding Style & Naming Conventions
Prettier enforces two-space indentation, single quotes, semicolons, 80 character width, and LF endings. Run `npm run format:check` before committing, and rely on ESLint configurations for security and accessibility rules. Use PascalCase for React components and service classes, camelCase for functions and variables, and kebab-case for file names under `app/`. Co-locate Jest specs next to the feature directories using `*.spec.ts` or `*.test.tsx` suffixes.

## Testing Guidelines
Target Jest for unit and integration coverage; new backend modules need matching tests in `tests/unit` plus scenario coverage in `tests/integration` when touching persistence or messaging. Contract changes require `npm run test:contract`. Frontend UI updates should include RTL assertions and, when flows shift, Playwright specs in `tests/e2e`. Run `npm run test:coverage` in each package before submitting to keep deltas visible.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) and append task identifiers like `(T123)` when applicable, matching existing history. Each PR should describe scope, link issues, list automated checks (`npm test`, `npm run lint`, etc.), and attach screenshots or GIFs for UI changes. Flag schema or environment updates with migration steps, and request reviews from backend, frontend, or infrastructure owners based on touched areas.
