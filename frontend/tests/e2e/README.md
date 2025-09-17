# E2E Test Suite for AI Social Media Platform

This comprehensive End-to-End test suite validates the complete user journey and system functionality of the AI-powered political social media simulator.

## Test Coverage

### 🚀 Complete User Journey (`user.journey.spec.ts`)

**Core Scenarios Covered:**

1. **User Registration & Profile Setup**
   - Account creation with political persona selection
   - Political alignment configuration (economic/social positions)
   - Profile customization and verification
   - Email validation and form error handling

2. **X-like Interface Verification**
   - Three-column layout (navigation, timeline, trends)
   - Responsive design across desktop, tablet, mobile
   - Dark/light theme functionality
   - Navigation and UI component verification

3. **Post Creation & Interactions**
   - Creating posts with political content
   - Hashtag extraction and linking
   - Like, reply, and repost functionality
   - Post engagement tracking

4. **AI Persona Interactions**
   - AI response generation within 2 minutes (per requirements)
   - Political alignment-based varied responses
   - AI persona identification and labeling
   - Debate thread development

5. **Real-time Features**
   - Server-Sent Events for timeline updates
   - WebSocket connection for chat features
   - Live metrics updates
   - Real-time notifications

6. **News Integration**
   - Multi-source news aggregation
   - Regional filtering (US, UK, Worldwide)
   - Category-based news filtering
   - AI persona news reactions

7. **Influence Metrics & Progression**
   - Follower count tracking
   - Engagement rate calculation
   - Approval rating system
   - Achievement badges and progression

8. **Settings & Customization**
   - AI chatter level adjustment
   - News region configuration
   - Theme toggle functionality
   - Custom AI service configuration

9. **Error Handling & Recovery**
   - Network failure recovery
   - Form validation errors
   - API error responses
   - Graceful fallback mechanisms

10. **Session Management**
    - Login/logout functionality
    - Protected route access
    - Session persistence
    - Authentication state management

### ♿ Accessibility Testing (`accessibility.spec.ts`)

**WCAG 2.1 AA Compliance:**

- **Keyboard Navigation**
  - Tab order verification
  - Focus management
  - Keyboard shortcuts
  - Escape key functionality

- **Screen Reader Support**
  - ARIA labels and landmarks
  - Heading hierarchy
  - Live regions for updates
  - Form field associations

- **Visual Design**
  - Color contrast requirements
  - Focus indicators
  - High contrast mode support
  - Reduced motion preferences

- **Interactive Elements**
  - Touch target sizing (44px minimum)
  - Button accessibility
  - Modal dialog accessibility
  - Form error announcements

### ⚡ Performance Testing (`performance.spec.ts`)

**Core Web Vitals & Performance Metrics:**

- **Load Performance**
  - First Contentful Paint (FCP) < 1.8s
  - Largest Contentful Paint (LCP) < 2.5s
  - Time to First Byte (TTFB) < 500ms
  - Page load time < 2s

- **Interactivity**
  - First Input Delay (FID) < 100ms
  - Real-time feature performance
  - Rapid user interaction handling

- **Visual Stability**
  - Cumulative Layout Shift (CLS) < 0.1
  - Image loading optimization
  - Layout stability during updates

- **Resource Optimization**
  - Bundle size validation
  - Memory usage monitoring
  - API response time tracking
  - Memory leak detection

### 🌐 Cross-Browser Compatibility

Tests are configured to run across:
- **Desktop**: Chrome, Firefox, Safari (WebKit)
- **Mobile**: Chrome Mobile, Safari Mobile
- **Viewports**: Desktop (1440x900), Tablet (768x1024), Mobile (375x667)

## Getting Started

### Prerequisites

```bash
# Ensure Node.js and dependencies are installed
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Setup

Create `.env.test` file:
```env
# Test environment configuration
DATABASE_URL="postgresql://test:test@localhost:5432/social_platform_test"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="test-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services (optional - tests use mocks)
OPENAI_API_KEY="test-key"
ANTHROPIC_API_KEY="test-key"
GOOGLE_AI_API_KEY="test-key"
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suite
npx playwright test user.journey.spec.ts
npx playwright test accessibility.spec.ts
npx playwright test performance.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests for specific viewport
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Test Reports

```bash
# Generate HTML report
npx playwright show-report

# View test results
cat test-results.json

# View JUnit report (for CI)
cat test-results.xml
```

## Test Architecture

### Page Object Model

Tests use the Page Object Model pattern for maintainability:

```typescript
// Example usage
const homePage = new HomePage(page);
await homePage.goto('/');
await homePage.verifyHomepageElements();

const registrationPage = new RegistrationPage(page);
await registrationPage.registerUser('politician');
```

### Test Data Management

Centralized test data in `utils/test-data.ts`:

```typescript
import { TEST_USERS, MOCK_POSTS, MOCK_AI_PERSONAS } from './utils/test-data';

// Use predefined test users
await TestUtils.setupTestUser(page, 'politician');

// Use predefined test content
await feedPage.createPost(MOCK_POSTS.political.healthcare);
```

### API Mocking

External services are mocked for consistent testing:

```typescript
// Automatic API mocking setup
await TestUtils.setupAPIMocks(page);

// Custom mock responses for specific scenarios
await page.route('**/api/ai/**', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ response: 'Mock AI response' })
  });
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Validation Criteria

### ✅ Success Criteria (from quickstart.md)

**Primary Functional Requirements:**
- [ ] User registration with political persona (< 2 minutes)
- [ ] AI persona response within 2 minutes
- [ ] X-like interface renders correctly (< 30 seconds)
- [ ] Political alignment affects AI responses (< 3 minutes)
- [ ] News integration with AI reactions (< 2 minutes)
- [ ] Influence metrics update correctly (< 1 minute)
- [ ] Settings changes affect behavior (< 3 minutes)
- [ ] Demo mode functions without AI keys (< 1 minute)

**Technical Requirements:**
- [ ] All API endpoints return correct status codes
- [ ] Database constraints prevent invalid data
- [ ] Real-time features work without refresh
- [ ] Performance targets met (<2s load, 60fps)
- [ ] Content moderation filters inappropriate content
- [ ] Responsive design works across devices
- [ ] Theme toggle functions properly
- [ ] AI fallback system activates correctly

**User Experience Requirements:**
- [ ] Interface feels familiar to X (Twitter) users
- [ ] Political discourse feels authentic
- [ ] AI personas have distinct personalities
- [ ] Progression system motivates engagement
- [ ] News integration feels relevant
- [ ] Customization options provide control

## Debugging Failed Tests

### Common Issues & Solutions

1. **Test Timeouts**
   ```bash
   # Increase timeout for slow operations
   npx playwright test --timeout=60000

   # Debug specific test
   npx playwright test --debug accessibility.spec.ts
   ```

2. **Element Not Found**
   ```typescript
   // Add explicit waits
   await page.waitForSelector('[data-testid="element"]');

   // Use more flexible selectors
   await page.locator('text=Submit').click();
   ```

3. **API Mock Issues**
   ```typescript
   // Verify mock setup
   await TestUtils.setupAPIMocks(page);

   // Check network requests
   page.on('response', response => {
     console.log(response.url(), response.status());
   });
   ```

4. **Performance Test Failures**
   ```bash
   # Run on less loaded system
   npx playwright test performance.spec.ts --workers=1

   # Skip performance tests in CI if needed
   npx playwright test --grep-invert="Performance"
   ```

### Test Maintenance

- **Update selectors** when UI changes
- **Adjust timeouts** for slower environments
- **Update test data** when business logic changes
- **Review mock responses** when APIs change
- **Monitor test flakiness** and improve stability

## Contributing

When adding new tests:

1. **Follow naming conventions**: `feature.type.spec.ts`
2. **Use page object models** for reusable interactions
3. **Add proper test data** to `utils/test-data.ts`
4. **Include accessibility checks** for new features
5. **Verify performance impact** of new functionality
6. **Update this README** with new test coverage

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Project Quickstart Guide](../../specs/001-build-a-minimal/quickstart.md)