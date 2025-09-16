# Posts Endpoints Contract Tests (T014-T018)

This directory contains comprehensive contract tests for Posts endpoints that validate the API exactly matches the OpenAPI specification. **These tests are designed to FAIL initially** as no backend implementation exists yet.

## Test Files Created

### T014: POST /api/posts
**File**: `posts.create.test.ts`
- Tests post creation with valid content
- Validates 280-character limit enforcement
- Tests hashtag and mention extraction (#politics @user)
- Tests media URL validation (max 4 URLs)
- Tests reply and repost functionality
- Tests content warning handling
- Tests authentication requirements
- Tests business logic constraints

### T015: GET /api/posts
**File**: `posts.list.test.ts`
- Tests public timeline with pagination
- Tests category filtering (politics, technology, entertainment, sports)
- Tests post ordering (newest first)
- Tests author information inclusion
- Tests AI persona post handling
- Tests hidden/deleted post exclusion
- Tests performance with large datasets

### T016: GET /api/posts/{postId}
**File**: `posts.get.test.ts`
- Tests detailed post retrieval
- Tests replies inclusion in thread context
- Tests AI-generated post with persona info
- Tests repost information
- Tests link preview handling
- Tests interaction counts accuracy
- Tests edited post timestamps
- Tests access control for hidden posts

### T017: GET /api/posts/{postId}/replies
**File**: `posts.replies.test.ts`
- Tests direct replies retrieval (not nested)
- Tests pagination of replies
- Tests chronological ordering (oldest first)
- Tests thread hierarchy maintenance
- Tests author information for each reply
- Tests AI persona replies
- Tests hidden/deleted reply exclusion
- Tests performance with large threads

### T018: POST /api/posts/{postId}/reactions
**File**: `reactions.test.ts`
- Tests all reaction types (LIKE, REPOST, BOOKMARK, REPORT)
- Tests reaction creation and validation
- Tests duplicate reaction prevention
- Tests post reaction count updates
- Tests multiple users reacting to same post
- Tests different reaction types from same user
- Tests authentication requirements
- Tests business logic constraints

## Helper Functions

### Authentication Helpers (`helpers/auth.ts`)
- `createTestUser()` - Creates test users with various personas
- `getValidJWT()` - Generates valid JWT tokens
- `getExpiredJWT()` - Generates expired tokens for testing
- Mock user data for consistent testing

### Post Helpers (`helpers/posts.ts`)
- `createTestPost()` - Creates test posts with various content
- `createTestReply()` - Creates reply posts
- `createTestRepost()` - Creates repost posts
- `createAIGeneratedPost()` - Creates AI persona posts
- Content processing utilities (hashtag/mention extraction)

### Reaction Helpers (`helpers/reactions.ts`)
- `createTestReaction()` - Creates test reactions
- `createLikeReaction()`, `createRepostReaction()`, etc.
- Reaction validation and batch creation utilities
- Mock reaction data for testing

### News Helpers (`helpers/news.ts`)
- `createTestNewsItem()` - Creates test news items
- Category-specific news creation functions
- News validation utilities
- Mock news data for testing

## Contract Validation Features

### Schema Validation
- Validates response schemas match OpenAPI specification exactly
- Tests UUID format validation for all IDs
- Tests ISO date format validation for timestamps
- Tests required vs optional field handling

### Authentication Testing
- Tests unauthorized access rejection (401)
- Tests invalid JWT token handling
- Tests expired token handling
- Tests malformed Authorization header handling

### Validation Error Testing
- Tests all required field validation
- Tests field format validation (UUID, URL, enum)
- Tests length constraints (280 chars, max 4 media URLs)
- Tests additional field rejection

### Business Logic Testing
- Tests post creation, editing, deletion workflows
- Tests thread hierarchy and reply relationships
- Tests reaction uniqueness and conflict handling
- Tests hidden/deleted content access control

### Edge Case Testing
- Tests maximum content lengths
- Tests empty result sets
- Tests large page numbers
- Tests concurrent operations
- Tests performance requirements

### Error Response Testing
- Tests 400 (Bad Request) with validation details
- Tests 401 (Unauthorized) with proper error codes
- Tests 404 (Not Found) for missing resources
- Tests 409 (Conflict) for duplicate reactions

## Expected Test Behavior

**CRITICAL**: These tests MUST FAIL initially because:

1. No backend server implementation exists
2. No database schema or connections exist
3. No API endpoints are implemented
4. No authentication middleware exists

The tests are designed to:
- Validate the complete API contract specification
- Ensure proper error handling and response formats
- Test all success and failure scenarios
- Provide comprehensive coverage for when implementation begins

## Usage

```bash
# Run all contract tests (will fail initially)
npm test -- --testPathPattern="contract"

# Run specific test file
npm test -- tests/contract/posts.create.test.ts

# Run with verbose output
npm test -- --testPathPattern="contract" --verbose
```

## Implementation Roadmap

When backend implementation begins, these tests will guide development by:

1. **API Endpoint Implementation**: Tests specify exact endpoint behavior
2. **Database Schema**: Tests require specific data models and relationships
3. **Authentication**: Tests require JWT-based authentication middleware
4. **Validation**: Tests specify all input validation requirements
5. **Error Handling**: Tests require specific error response formats
6. **Business Logic**: Tests specify complex workflows and constraints

These contract tests serve as the definitive specification for the Posts API implementation, ensuring 100% compliance with the OpenAPI contract when development is complete.