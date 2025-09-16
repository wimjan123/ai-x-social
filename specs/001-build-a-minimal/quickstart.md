# Quickstart Guide: Politician/Influencer Social Media Simulator

**Version**: 1.0.0  
**Date**: 2025-09-16  
**Purpose**: End-to-end testing and validation scenarios

## Overview

This quickstart guide provides step-by-step instructions for testing all core functionality of the politician/influencer social media simulator. Each scenario validates specific functional requirements and user stories.

## Prerequisites

### Development Environment

#### Option 1: Docker (Recommended)
```bash
# Required software
Docker 24+
Docker Compose 2.0+

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 2: Local Development
```bash
# Required software
Node.js 22+
PostgreSQL 16+
Redis 7+
npm or yarn

# Environment variables (create .env.local)
DATABASE_URL="postgresql://user:password@localhost:5432/social_platform"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Service Configuration (optional for demo mode)
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-claude-key"
GOOGLE_AI_API_KEY="your-gemini-key"
```

### Database Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed default AI personas
npm run seed
```

### Server Start
```bash
# Start development servers
npm run dev          # Next.js frontend (port 3000)
npm run dev:api      # Backend API (port 3001)
npm run dev:redis    # Redis server
```

## Core User Journey Tests

### Test 1: User Registration and Profile Setup
**Validates**: FR-001, FR-002, User account creation with political persona

#### Steps:
1. **Navigate to Registration**
   ```
   URL: http://localhost:3000/register
   Expected: Registration form with persona type selection
   ```

2. **Fill Registration Form**
   ```
   Username: test_politician
   Email: test@example.com
   Password: SecurePass123!
   Display Name: Test Politician
   Persona Type: POLITICIAN
   Bio: Fighting for progressive change in our democracy
   Political Stance:
     - Economic Position: 25 (center-left)
     - Social Position: 20 (liberal)
     - Primary Issues: ["Healthcare", "Climate Change", "Education"]
     - Party Affiliation: "Democratic Party"
     - Debate Willingness: 75
   ```

3. **Submit and Verify**
   ```
   Expected Response: 201 Created
   Expected: Redirect to /feed
   Expected: Profile shows political stance indicators
   Expected: Influence metrics initialized (0 followers, 0 posts)
   ```

4. **Validate Database**
   ```sql
   SELECT * FROM UserAccount WHERE username = 'test_politician';
   SELECT * FROM UserProfile WHERE userId = [user_id];
   SELECT * FROM PoliticalAlignment WHERE userId = [user_id];
   SELECT * FROM InfluenceMetrics WHERE userId = [user_id];
   ```

### Test 2: X-like Interface Verification
**Validates**: FR-026 through FR-031, X-style UI design

#### Steps:
1. **Check Layout Structure**
   ```
   Expected Layout:
   ┌─────────────────────────────────────────────────────┐
   │  [Logo]     [Search Bar]           [Profile] [⚙️]   │
   ├─────────────┬─────────────────────────┬─────────────┤
   │             │                         │             │
   │ Navigation  │     Main Timeline       │   Trends    │
   │ Sidebar     │     (Central Feed)      │   Sidebar   │
   │             │                         │             │
   │ • Home      │  ┌─────────────────────┐ │ Trending    │
   │ • Profile   │  │     Post Card       │ │ Topics      │
   │ • Messages  │  │  [Avatar] [@user]   │ │             │
   │ • Settings  │  │  Post content...    │ │ Suggested   │
   │             │  │  [♥️ 💬 🔄 📤]       │ │ Users       │
   │             │  └─────────────────────┘ │             │
   └─────────────┴─────────────────────────┴─────────────┘
   ```

2. **Verify Responsive Design**
   ```
   Desktop (1200px+): Three-column layout
   Tablet (768-1199px): Two-column (hide trends)
   Mobile (<768px): Single column + bottom navigation
   ```

3. **Test Dark/Light Mode Toggle**
   ```
   Click theme toggle → Smooth transition
   Expected: Colors switch between light/dark themes
   Expected: User preference saved to localStorage
   ```

### Test 3: Creating Posts and AI Persona Interaction
**Validates**: FR-003, FR-005, FR-009, Post creation and AI responses

#### Steps:
1. **Create Initial Post**
   ```
   POST /api/posts
   Content: "Healthcare should be a human right, not a privilege. We need universal coverage now! #HealthcareForAll"
   Expected: 201 Created
   Expected: Post appears in timeline immediately
   Expected: Hashtags extracted: ["HealthcareForAll"]
   ```

2. **Monitor AI Persona Responses**
   ```
   Timeline: http://localhost:3000/feed
   Expected: Within 2 minutes, at least one AI persona replies
   Expected: AI responses align with their political stances
   
   Example Expected Responses:
   - @progressive_voice: "Absolutely agree! Healthcare is a fundamental right..."
   - @conservative_thinker: "While I understand the concern, we must consider fiscal responsibility..."
   ```

3. **Verify AI Response Labeling**
   ```
   Expected: AI posts clearly marked with "🤖 AI Response" badge
   Expected: Persona profile shows AI-generated indicator
   Expected: Different personas have distinct writing styles
   ```

### Test 4: Political Alignment-Based Interactions
**Validates**: FR-009, Political discourse simulation

#### Steps:
1. **Create Politically Charged Post**
   ```
   Content: "Climate change is the greatest threat facing our generation. We need aggressive action NOW, not corporate-friendly half-measures!"
   Expected: Post created successfully
   ```

2. **Observe Varied AI Reactions**
   ```
   Expected Supporting Personas:
   - @green_activist: Strong agreement, adds environmental data
   - @progressive_politician: Policy solutions, legislative support
   
   Expected Opposing Personas:
   - @business_advocate: Economic concerns, job impact discussion
   - @conservative_voice: Questions on implementation, cost concerns
   
   Expected Neutral Personas:
   - @journalist_bot: Factual reporting, multiple perspectives
   ```

3. **Verify Engagement Patterns**
   ```
   Expected: Higher engagement from aligned personas
   Expected: Debate threads develop between opposing viewpoints
   Expected: Controversy meter increases for political content
   ```

### Test 5: Real-Time News Integration
**Validates**: FR-010, FR-021, FR-026, News integration and AI reactions

#### Steps:
1. **Check News Feed Integration**
   ```
   URL: http://localhost:3000/news
   Expected: Recent news from multiple sources
   Expected: Regional filtering works (US, UK, Worldwide)
   Expected: Categories available (Politics, Technology, etc.)
   ```

2. **Monitor AI Persona News Reactions**
   ```
   Expected: Personas automatically react to relevant news within 2 minutes
   Expected: News-driven posts include source attribution
   Expected: Link previews show source, publish time, description
   
   Example AI News Post:
   "@political_analyst: Breaking: New climate legislation passes committee! 
   This could be the breakthrough we've been waiting for. 
   🔗 Source: Reuters | Published: 2 hours ago"
   ```

3. **Test Trending Topics**
   ```
   URL: http://localhost:3000/trends
   Expected: Topics update based on news activity
   Expected: Trending score calculated correctly
   Expected: Regional trends differ by location setting
   ```

### Test 6: Influence Metrics and Progression
**Validates**: FR-007, FR-008, FR-025, FR-030, Gamification elements

#### Steps:
1. **Generate Engagement Activity**
   ```
   Actions:
   - Create 5 posts
   - Receive likes and reposts from AI personas
   - Get replies and start conversations
   - React to other users' content
   ```

2. **Check Metrics Dashboard**
   ```
   URL: http://localhost:3000/profile/metrics
   Expected Metrics:
   - Follower count: Updated real-time
   - Engagement rate: Calculated from interactions
   - Approval rating: Based on positive vs negative reactions
   - Controversy level: Based on debate-generating content
   - Influence rank: Position among all users
   - Growth charts: Daily/weekly/monthly trends
   ```

3. **Verify Progression Elements**
   ```
   Expected Badges:
   - "First Post" badge after initial post
   - "Trendsetter" badge for viral content (>100 engagements)
   - "Debate Master" badge for generating discussions
   
   Expected Mood Indicators:
   - Personas show different moods based on recent interactions
   - Mood affects response probability and tone
   ```

### Test 7: Settings and Customization
**Validates**: FR-012, FR-013, FR-017, FR-018, User preferences

#### Steps:
1. **Access Settings Panel**
   ```
   URL: http://localhost:3000/settings
   Expected: Comprehensive settings interface
   ```

2. **Test News Region Configuration**
   ```
   Change Region: United States → United Kingdom
   Expected: News feed updates to UK sources
   Expected: AI personas reference UK-relevant topics
   Expected: Trending topics shift to UK trends
   ```

3. **Test AI Chatter Level**
   ```
   Set AI Chatter Level: 100 (Maximum)
   Expected: Increased AI persona activity
   Expected: More frequent replies and interactions
   
   Set AI Chatter Level: 0 (Minimum)
   Expected: Minimal AI persona activity
   Expected: Only direct responses to mentions
   ```

4. **Test Custom AI Configuration**
   ```
   Add Custom API Key: [test-key]
   Add Custom Base URL: https://custom-ai.example.com
   Expected: Settings saved successfully
   Expected: System attempts to use custom AI service
   ```

5. **Test Demo Mode Fallback**
   ```
   Remove all AI API keys
   Expected: System switches to demo mode
   Expected: Mock AI responses generated
   Expected: "Demo Mode" indicator shown
   Expected: All functionality continues to work
   ```

### Test 8: Real-Time Features
**Validates**: Real-time communication, live updates

#### Steps:
1. **Test Server-Sent Events**
   ```
   URL: http://localhost:3000/api/live-updates
   Expected: Event stream connection established
   Expected: Real-time notifications for new posts
   Expected: Live timeline updates without refresh
   ```

2. **Test WebSocket Connection**
   ```
   URL: ws://localhost:3000/ws/chat
   Expected: WebSocket connection for chat features
   Expected: Real-time typing indicators
   Expected: Instant message delivery
   ```

3. **Verify Real-Time Metrics**
   ```
   Action: Have AI persona like your post
   Expected: Like count updates immediately
   Expected: Influence metrics recalculate
   Expected: Real-time notification appears
   ```

### Test 9: Content Moderation and Safety
**Validates**: FR-019, FR-020, Content filtering

#### Steps:
1. **Test Content Filtering**
   ```
   Attempt to post: "This is clearly hate speech targeting [protected group]"
   Expected: Post blocked or flagged
   Expected: Warning message displayed
   Expected: Content not visible in public timeline
   ```

2. **Test Report Functionality**
   ```
   Report inappropriate content
   Expected: Report submitted successfully
   Expected: Content reviewed by moderation system
   Expected: Repeated reports trigger automatic hiding
   ```

3. **Verify AI Response Safety**
   ```
   Ask AI persona controversial question
   Expected: AI provides balanced, informative response
   Expected: No medical or legal advice given
   Expected: Harmful content automatically filtered
   ```

### Test 10: Performance and Scalability
**Validates**: Performance requirements, system resilience

#### Steps:
1. **Load Testing**
   ```
   Simulate: 50 concurrent users posting content
   Expected: Response times <2 seconds
   Expected: System remains stable
   Expected: Database queries optimized
   ```

2. **Timeline Performance**
   ```
   Load timeline with 1000+ posts
   Expected: Infinite scroll works smoothly
   Expected: Images load optimally
   Expected: 60fps scrolling performance
   ```

3. **AI Response Time**
   ```
   Post content requiring AI response
   Expected: AI reply generated within 2 minutes
   Expected: Fallback providers used if primary fails
   Expected: Demo mode activates if all providers fail
   ```

## API Testing Scenarios

### Authentication Flow Test
```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "api_test_user",
    "email": "api@test.com",
    "password": "TestPass123!",
    "displayName": "API Test User",
    "personaType": "INFLUENCER"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "api_test_user",
    "password": "TestPass123!"
  }'

# Use token for authenticated requests
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Post Creation and Interaction Test
```bash
# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Testing the API! #APITest #SocialMedia"
  }'

# Get public timeline
curl -X GET "http://localhost:3000/api/posts?page=1&limit=20"

# React to post
curl -X POST http://localhost:3000/api/posts/{postId}/reactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "LIKE"
  }'
```

### Persona Interaction Test
```bash
# Get available personas
curl -X GET http://localhost:3000/api/personas

# Trigger persona reply
curl -X POST http://localhost:3000/api/personas/{personaId}/reply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "context": "What do you think about universal healthcare?",
    "postId": "{postId}"
  }'
```

## Success Criteria Validation

### ✅ Primary Success Criteria
- [ ] User can register and customize politician/influencer profile (**2 minutes**)
- [ ] AI persona replies to user post within 2 minutes (**2 minutes**)
- [ ] X-like interface renders correctly on desktop and mobile (**30 seconds**)
- [ ] Political alignment affects AI persona responses (**3 minutes**)
- [ ] News integration shows current events with AI reactions (**2 minutes**)
- [ ] Influence metrics update and display progression (**1 minute**)
- [ ] Settings changes affect persona behavior noticeably (**3 minutes**)
- [ ] Demo mode works when no AI keys configured (**1 minute**)

### ✅ Technical Success Criteria
- [ ] All API endpoints return correct HTTP status codes
- [ ] Database constraints prevent invalid data
- [ ] Real-time features work without refresh
- [ ] Performance targets met (<2s load, 60fps)
- [ ] Content moderation filters inappropriate content
- [ ] Responsive design works across device sizes
- [ ] Dark/light theme toggle functions properly
- [ ] AI fallback system activates when services fail

### ✅ User Experience Success Criteria
- [ ] Interface feels familiar to X (Twitter) users
- [ ] Political discourse feels authentic and engaging
- [ ] AI personas have distinct personalities
- [ ] Progression system motivates continued engagement
- [ ] News integration feels relevant and timely
- [ ] Customization options provide meaningful control

## Troubleshooting

### Common Issues

**AI Personas Not Responding**
```bash
# Check AI service configuration
curl -X GET http://localhost:3000/api/settings
# Verify API keys in environment variables
echo $OPENAI_API_KEY
# Check logs for AI service errors
npm run logs:ai
```

**Timeline Not Loading**
```bash
# Check database connection
npx prisma studio
# Verify API endpoints
curl -X GET http://localhost:3000/api/posts
# Check for CORS issues in browser console
```

**Real-Time Features Not Working**
```bash
# Check Redis connection
redis-cli ping
# Verify WebSocket connection
wscat -c ws://localhost:3000/ws
# Check SSE endpoint
curl -N http://localhost:3000/api/live-updates
```

### Performance Issues
```bash
# Monitor database queries
npm run db:monitor
# Check memory usage
npm run monitor:memory
# Profile API response times
npm run monitor:api
```

## Next Steps

After successful quickstart validation:

1. **Production Deployment**
   - Configure production environment variables
   - Set up CI/CD pipeline
   - Deploy to hosting provider (Vercel, Railway, etc.)

2. **Enhanced Testing**
   - Run full integration test suite
   - Perform load testing with realistic traffic
   - Test AI persona behavior over extended periods

3. **User Acceptance Testing**
   - Gather feedback from target users
   - Test with political science professionals
   - Validate engagement and retention metrics

4. **Scaling Preparation**
   - Monitor system resources under load
   - Optimize database queries and indexes
   - Plan horizontal scaling strategy

---

This quickstart guide ensures all core functionality works correctly and provides a foundation for production deployment and user testing.