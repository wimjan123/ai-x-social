# AI Social Media Platform - Backend

Backend API server for the AI social media platform with political persona simulation.

## Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express.js with TypeScript 5.6+
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with bcrypt
- **Testing**: Jest with Supertest
- **Validation**: Zod schemas
- **Logging**: Winston

## Project Structure

```
backend/
├── src/
│   ├── models/          # Prisma schemas and entity definitions
│   ├── services/        # Business logic (AI, news, user management)
│   ├── api/            # REST API endpoints and middleware
│   └── lib/            # Shared utilities, config, types
└── tests/
    ├── contract/       # API contract compliance tests
    ├── integration/    # Integration tests
    └── unit/          # Unit tests
```

## Setup

### Prerequisites

- Node.js 22+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Linting and type checking
npm run lint
npm run typecheck

# Database management
npm run prisma:studio    # Open Prisma Studio
npm run prisma:reset     # Reset database
```

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`: AI provider API keys
- `NEWS_API_KEY`, `GUARDIAN_API_KEY`, `GNEWS_API_KEY`: News API keys

## API Documentation

The API follows RESTful conventions with OpenAPI 3.0 specification.

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Response Format
All responses follow a consistent format:

Success:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Optional details"
}
```

Paginated:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Testing

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:contract      # API contract tests only

# Test with coverage
npm run test:coverage
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open database GUI
- `npm run prisma:reset` - Reset database and run migrations

## Architecture

### Service Layer
Business logic is organized into services:
- `UserService`: User management and authentication
- `PostService`: Post creation, retrieval, interactions
- `AIService`: AI persona generation and responses
- `NewsService`: News aggregation and processing

### API Layer
REST endpoints are organized by resource:
- `/auth` - Authentication endpoints
- `/users` - User management
- `/posts` - Post operations
- `/ai` - AI persona interactions
- `/news` - News endpoints

### Database Layer
Prisma ORM provides:
- Type-safe database queries
- Automatic migrations
- Database schema management
- Connection pooling

## Security

- Helmet.js for security headers
- CORS protection
- Rate limiting
- JWT authentication
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection prevention via Prisma

## Monitoring

- Winston logging with multiple transports
- Request/response logging with Morgan
- Health check endpoint at `/health`
- Error tracking and reporting

## Deployment

The application is containerized with Docker:

```bash
# Build image
docker build -t ai-x-social-backend .

# Run container
docker run -p 3001:3001 ai-x-social-backend
```

For production deployment, ensure:
- Environment variables are properly set
- Database is accessible
- Redis is running
- SSL/TLS is configured
- Monitoring is enabled