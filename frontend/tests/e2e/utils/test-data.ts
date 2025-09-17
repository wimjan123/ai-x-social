/**
 * Test Data and Utilities for E2E Tests
 *
 * This file contains reusable test data, mock responses, and utility functions
 * for the comprehensive E2E test suite.
 */

export const TEST_USERS = {
  politician: {
    username: 'test_politician_e2e',
    email: 'politician-e2e@example.com',
    password: 'SecureTestPass123!',
    displayName: 'E2E Test Politician',
    bio: 'Fighting for progressive change in our democracy - E2E Test User',
    personaType: 'politician' as const,
    politicalStance: {
      economicPosition: 25,
      socialPosition: 20,
      primaryIssues: ['Healthcare', 'Climate Change', 'Education'],
      partyAffiliation: 'Democratic Party',
      debateWillingness: 75
    }
  },
  influencer: {
    username: 'test_influencer_e2e',
    email: 'influencer-e2e@example.com',
    password: 'SecureTestPass123!',
    displayName: 'E2E Test Influencer',
    bio: 'Building community and sharing perspectives - E2E Test User',
    personaType: 'influencer' as const,
    politicalStance: {
      economicPosition: 45,
      socialPosition: 30,
      primaryIssues: ['Technology', 'Social Justice', 'Environment'],
      partyAffiliation: 'Independent',
      debateWillingness: 60
    }
  },
  journalist: {
    username: 'test_journalist_e2e',
    email: 'journalist-e2e@example.com',
    password: 'SecureTestPass123!',
    displayName: 'E2E Test Journalist',
    bio: 'Reporting on politics and policy - E2E Test User',
    personaType: 'journalist' as const,
    politicalStance: {
      economicPosition: 50,
      socialPosition: 40,
      primaryIssues: ['Press Freedom', 'Government Transparency', 'Democracy'],
      partyAffiliation: 'Nonpartisan',
      debateWillingness: 85
    }
  }
};

export const MOCK_POSTS = {
  political: {
    healthcare: 'Healthcare should be a human right, not a privilege. We need universal coverage now! #HealthcareForAll',
    climate: 'Climate change is the greatest threat facing our generation. We need aggressive action NOW! #ClimateAction',
    economy: 'Working families deserve policies that put them first, not the wealthy elite. #EconomicJustice',
    education: 'Every child deserves access to quality education, regardless of their zip code. #EducationForAll'
  },
  controversial: {
    wealth_inequality: 'Time to have an honest conversation about wealth inequality in America. The system is rigged.',
    immigration: 'Our immigration system needs comprehensive reform that balances security with humanity.',
    gun_policy: 'Common-sense gun safety measures have broad public support. When will Congress act?',
    voting_rights: 'Voting rights are under attack. We must protect the foundation of our democracy.'
  },
  casual: {
    townhall: 'Great turnout at today\'s town hall! Democracy works best when everyone participates. 🗳️',
    coffee: 'Starting the day with coffee and reviewing policy briefings. What\'s on your mind today?',
    weekend: 'Spending the weekend in the district, listening to constituents. Their voices matter.',
    gratitude: 'Grateful for the opportunity to serve and make a difference. #PublicService'
  },
  news_reactions: {
    economic_data: 'Just saw the latest economic data - we need policies that work for working families.',
    supreme_court: 'Today\'s Supreme Court decision will have lasting impacts on our democracy.',
    international: 'Global challenges require coordinated responses and strong alliances.',
    local_news: 'Local issues matter just as much as national ones. Community first.'
  }
};

export const MOCK_AI_PERSONAS = {
  progressive_politician: {
    id: 'progressive_politician',
    name: 'Progressive Voice',
    username: '@progressive_voice',
    bio: 'Fighting for working families and social justice',
    politicalStance: {
      economicPosition: 15,
      socialPosition: 10,
      primaryIssues: ['Healthcare', 'Climate Change', 'Workers Rights'],
      partyAffiliation: 'Democratic Party'
    },
    responses: {
      healthcare: 'Absolutely agree! Healthcare is a fundamental right. We need Medicare for All.',
      climate: 'The climate crisis demands bold action NOW. Green New Deal is the way forward.',
      economy: 'We must rebuild an economy that works for everyone, not just the wealthy.'
    }
  },
  conservative_thinker: {
    id: 'conservative_thinker',
    name: 'Conservative Perspective',
    username: '@conservative_thinker',
    bio: 'Advocating for fiscal responsibility and traditional values',
    politicalStance: {
      economicPosition: 75,
      socialPosition: 70,
      primaryIssues: ['Fiscal Responsibility', 'Small Government', 'Constitution'],
      partyAffiliation: 'Republican Party'
    },
    responses: {
      healthcare: 'While healthcare is important, we must consider fiscal responsibility and market solutions.',
      climate: 'Environmental protection is vital, but we need market-based solutions that don\'t kill jobs.',
      economy: 'Free markets and reduced regulation create prosperity for all Americans.'
    }
  },
  independent_analyst: {
    id: 'independent_analyst',
    name: 'Independent Analyst',
    username: '@independent_analyst',
    bio: 'Nonpartisan analysis of policy and politics',
    politicalStance: {
      economicPosition: 50,
      socialPosition: 45,
      primaryIssues: ['Data-Driven Policy', 'Government Efficiency', 'Bipartisanship'],
      partyAffiliation: 'Independent'
    },
    responses: {
      healthcare: 'Healthcare policy requires careful analysis of costs, benefits, and implementation challenges.',
      climate: 'Climate policy should be based on scientific evidence and economic feasibility studies.',
      economy: 'Economic policy effectiveness depends on data-driven analysis, not ideology.'
    }
  }
};

export const MOCK_NEWS_ARTICLES = [
  {
    id: 'news-1',
    title: 'Congress Debates Healthcare Reform Package',
    description: 'Lawmakers consider comprehensive healthcare legislation with bipartisan support',
    source: 'Mock News Network',
    category: 'Politics',
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    url: 'https://example.com/news/healthcare-reform',
    content: 'Congress is debating a comprehensive healthcare reform package...',
    reactions: {
      progressive_politician: 'This healthcare package is a step in the right direction for universal coverage.',
      conservative_thinker: 'We need to ensure any healthcare reforms don\'t burden taxpayers unnecessarily.',
      independent_analyst: 'The proposed healthcare reforms show promise but require careful cost analysis.'
    }
  },
  {
    id: 'news-2',
    title: 'Economic Data Shows Mixed Signals',
    description: 'Latest economic indicators present complex picture for policy makers',
    source: 'Economic Times Mock',
    category: 'Economy',
    publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    url: 'https://example.com/news/economic-data',
    content: 'The latest economic data presents a mixed picture...',
    reactions: {
      progressive_politician: 'These numbers show we need more investment in working families.',
      conservative_thinker: 'Economic growth requires reduced regulation and business-friendly policies.',
      independent_analyst: 'The economic data suggests cautious optimism with continued monitoring needed.'
    }
  },
  {
    id: 'news-3',
    title: 'Climate Summit Reaches Key Agreement',
    description: 'International climate summit produces framework for emissions reduction',
    source: 'Environmental Report Mock',
    category: 'Environment',
    publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    url: 'https://example.com/news/climate-summit',
    content: 'World leaders at the climate summit have reached a significant agreement...',
    reactions: {
      progressive_politician: 'This climate agreement is crucial for our planet\'s future. We must act now.',
      conservative_thinker: 'Environmental protection is important, but we must consider economic impacts.',
      independent_analyst: 'The climate agreement framework provides a solid foundation for future action.'
    }
  }
];

export const MOCK_TRENDING_TOPICS = [
  {
    id: 'trend-1',
    hashtag: '#HealthcareReform',
    posts: 1250,
    engagement: 15600,
    trend: 'rising',
    category: 'Politics'
  },
  {
    id: 'trend-2',
    hashtag: '#ClimateAction',
    posts: 890,
    engagement: 12300,
    trend: 'stable',
    category: 'Environment'
  },
  {
    id: 'trend-3',
    hashtag: '#EconomicPolicy',
    posts: 670,
    engagement: 8900,
    trend: 'falling',
    category: 'Economy'
  },
  {
    id: 'trend-4',
    hashtag: '#VotingRights',
    posts: 520,
    engagement: 7800,
    trend: 'rising',
    category: 'Democracy'
  }
];

export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile'
  },
  posts: {
    create: '/api/posts',
    list: '/api/posts',
    like: (id: string) => `/api/posts/${id}/like`,
    reply: (id: string) => `/api/posts/${id}/reply`,
    repost: (id: string) => `/api/posts/${id}/repost`
  },
  news: {
    articles: '/api/news/articles',
    trends: '/api/news/trends',
    reactions: '/api/news/reactions'
  },
  ai: {
    personas: '/api/ai/personas',
    respond: '/api/ai/respond',
    settings: '/api/ai/settings'
  },
  users: {
    profile: (id: string) => `/api/users/${id}`,
    follow: (id: string) => `/api/users/${id}/follow`,
    metrics: (id: string) => `/api/users/${id}/metrics`
  }
};

export const ERROR_MESSAGES = {
  network: 'Network error occurred. Please check your connection.',
  validation: {
    username: 'Username is required and must be at least 3 characters',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    required: 'This field is required'
  },
  auth: {
    invalid_credentials: 'Invalid username or password',
    username_taken: 'Username is already taken',
    email_taken: 'Email address is already registered'
  },
  posts: {
    content_required: 'Post content cannot be empty',
    content_too_long: 'Post content exceeds maximum length',
    inappropriate_content: 'Content violates community guidelines'
  }
};

export const ACCESSIBILITY_REQUIREMENTS = {
  keyboard_navigation: {
    tab_order: ['navigation', 'main-content', 'sidebar'],
    escape_closes_modals: true,
    enter_activates_buttons: true,
    arrow_keys_for_lists: true
  },
  screen_reader: {
    aria_labels: ['compose post', 'like button', 'reply button', 'user menu'],
    aria_live_regions: ['timeline-updates', 'notifications'],
    heading_hierarchy: ['h1', 'h2', 'h3'],
    alt_text_for_images: true
  },
  color_contrast: {
    minimum_ratio: 4.5,
    large_text_ratio: 3.0,
    focus_indicators: 'visible'
  }
};

export const PERFORMANCE_THRESHOLDS = {
  page_load_time: 2000, // 2 seconds
  time_to_first_byte: 500, // 500ms
  largest_contentful_paint: 2500, // 2.5 seconds
  cumulative_layout_shift: 0.1,
  first_input_delay: 100, // 100ms
  memory_usage: 100 * 1024 * 1024 // 100MB
};

// Utility functions for test setup and teardown
export class TestUtils {
  static async setupTestUser(page: any, userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    await page.goto('/register');
    await page.fill('[data-testid="username-input"]', user.username);
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);
    await page.fill('[data-testid="display-name-input"]', user.displayName);
    await page.fill('[data-testid="bio-textarea"]', user.bio);

    await page.click(`[data-testid="persona-type-${user.personaType}"]`);

    if (user.politicalStance) {
      await page.locator('[data-testid="economic-position-slider"]').fill(
        user.politicalStance.economicPosition.toString()
      );
      await page.locator('[data-testid="social-position-slider"]').fill(
        user.politicalStance.socialPosition.toString()
      );

      for (const issue of user.politicalStance.primaryIssues) {
        await page.check(`[data-testid="issue-${issue.toLowerCase().replace(' ', '-')}"]`);
      }

      await page.fill('[data-testid="party-affiliation-input"]', user.politicalStance.partyAffiliation);
      await page.locator('[data-testid="debate-willingness-slider"]').fill(
        user.politicalStance.debateWillingness.toString()
      );
    }

    await page.click('[data-testid="register-submit-button"]');
    await page.waitForURL('/feed');
  }

  static async loginTestUser(page: any, userType: keyof typeof TEST_USERS = 'politician') {
    const user = TEST_USERS[userType];

    await page.goto('/login');
    await page.fill('[data-testid="login-identifier"]', user.username);
    await page.fill('[data-testid="login-password"]', user.password);
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('/feed');
  }

  static async setupAPIMocks(page: any) {
    // Mock news API
    await page.route('**/api/news/**', async (route: any) => {
      const url = route.request().url();

      if (url.includes('/articles')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ articles: MOCK_NEWS_ARTICLES })
        });
      } else if (url.includes('/trends')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ trends: MOCK_TRENDING_TOPICS })
        });
      }
    });

    // Mock AI API
    await page.route('**/api/ai/**', async (route: any) => {
      const url = route.request().url();

      if (url.includes('/personas')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ personas: Object.values(MOCK_AI_PERSONAS) })
        });
      } else if (url.includes('/respond')) {
        const requestBody = route.request().postDataJSON();
        const persona = Object.values(MOCK_AI_PERSONAS)[0]; // Default to first persona

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            response: persona.responses.healthcare || 'This is a mock AI response.',
            persona: persona.id,
            confidence: 0.95,
            timestamp: new Date().toISOString()
          })
        });
      }
    });
  }

  static async cleanupTestData(page: any) {
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Clear cookies
    const context = page.context();
    await context.clearCookies();
  }

  static async waitForPageLoad(page: any, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  static async takeAccessibilitySnapshot(page: any) {
    return await page.evaluate(() => {
      const elements = document.querySelectorAll('[aria-label], [role], [tabindex]');
      return Array.from(elements).map(el => ({
        tagName: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role'),
        tabIndex: el.getAttribute('tabindex')
      }));
    });
  }
}