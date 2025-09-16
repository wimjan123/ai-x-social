# AI X Social - Frontend

Next.js 15.4 + React 19.1 frontend for the AI-powered social media platform.

## Technology Stack

- **Framework**: Next.js 15.4 with App Router
- **UI Library**: React 19.1 with React Compiler
- **Styling**: Tailwind CSS + Chakra UI
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Testing**: Jest + React Testing Library + Playwright
- **Development**: ESLint + Prettier

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── services/           # API clients and external services
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

tests/
├── unit/               # Component unit tests
└── e2e/                # End-to-end tests with Playwright
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Testing
npm test                # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI
```

## Key Features

### Next.js 15 Async Patterns

All page components use the required async pattern:

```typescript
export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  // Page logic here
}
```

### Responsive Design

- Mobile-first approach with Tailwind CSS
- X-inspired dark/light theme support
- Responsive breakpoints for all device sizes

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimized
- Focus management and proper ARIA labels

### Performance

- React 19 Compiler for automatic optimization
- Code splitting and lazy loading
- Image optimization with Next.js Image
- Bundle analysis and optimization

## Configuration

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Tailwind CSS

Configured with X-inspired color palette and custom utilities for political simulation features.

### TypeScript

Strict TypeScript configuration with path mapping:

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/services/*` → `./src/services/*`

## Testing

### Unit Tests

Uses Jest + React Testing Library:

- Component testing
- Utility function testing
- API client testing

### E2E Tests

Uses Playwright for:

- User journey testing
- Cross-browser compatibility
- Accessibility testing
- Visual regression testing

## API Integration

The frontend connects to the backend API running on port 3001. API requests are proxied through
Next.js for development.

## Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

The built application will be optimized for production with:

- Static generation where possible
- Server-side rendering for dynamic content
- Optimized bundles and assets
