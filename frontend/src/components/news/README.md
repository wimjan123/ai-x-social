# News Components Suite

A comprehensive set of React components for displaying and interacting with news content in the AI social media platform. Features X-like styling, political alignment filtering, AI persona reactions, and responsive design.

## Components Overview

### 🔗 NewsFeed
Main news feed component with integrated filtering, search, and trending sidebar.

```tsx
import { NewsFeed } from '@/components/news';

<NewsFeed
  variant="default" // 'default' | 'minimal' | 'detailed'
  showFilters={true}
  showSearch={true}
  showTrending={true}
  pageSize={20}
  onArticleClick={(article) => console.log('Article clicked:', article)}
  onPersonaReaction={(article) => console.log('Persona reaction:', article)}
/>
```

**Features:**
- Pagination with infinite scroll
- Real-time filtering and search
- Error handling and loading states
- Responsive grid layout
- Integration with trending sidebar

### 📰 NewsCard
Individual news article card with multiple display variants.

```tsx
import { NewsCard } from '@/components/news';

<NewsCard
  article={newsArticle}
  variant="default" // 'compact' | 'default' | 'detailed'
  showActions={true}
  showPersonaReactions={true}
  onClick={(article) => console.log('Card clicked:', article)}
  onPersonaReaction={(article) => console.log('Show reactions')}
/>
```

**Features:**
- Three display variants (compact, default, detailed)
- Political alignment indicators
- Sentiment analysis display
- Social actions (share, bookmark, external link)
- Responsive image handling
- Accessibility compliant

### 🎯 NewsFilters
Advanced filtering system for categories, regions, and political perspectives.

```tsx
import { NewsFilters } from '@/components/news';

<NewsFilters
  currentFilters={{
    category: 'POLITICS',
    region: 'US',
    politicalLean: 'center'
  }}
  onFiltersChange={(filters) => console.log('Filters changed:', filters)}
/>
```

**Features:**
- Category filtering (Politics, Business, Technology, etc.)
- Regional filtering (US, UK, EU, Worldwide, etc.)
- Political perspective filtering (Left, Center, Right)
- Active filter display with clear options
- Dropdown and keyboard navigation

### 🔍 NewsSearch
Intelligent search with trending suggestions and history.

```tsx
import { NewsSearch } from '@/components/news';

<NewsSearch
  onSearch={(query) => console.log('Search:', query)}
  placeholder="Search news articles..."
  showSuggestions={true}
  showRecentSearches={true}
/>
```

**Features:**
- Real-time search suggestions
- Recent search history (localStorage)
- Trending topics integration
- Keyboard navigation (Escape to close)
- Debounced input handling

### 📈 TrendingNews
Sidebar component showing trending topics and articles.

```tsx
import { TrendingNews } from '@/components/news';

<TrendingNews
  variant="default" // 'default' | 'compact' | 'detailed'
  maxItems={5}
  filters={{ category: 'POLITICS' }}
  onArticleClick={(article) => console.log('Trending article:', article)}
  onTopicClick={(topic) => console.log('Trending topic:', topic)}
/>
```

**Features:**
- Political reaction bars
- Trending scores and engagement metrics
- Category filtering
- Responsive layout
- Real-time updates

### 📖 NewsDetail
Expanded article view with full content and related articles.

```tsx
import { NewsDetail } from '@/components/news';

<NewsDetail
  article={newsArticle}
  onBack={() => console.log('Back to feed')}
  showPersonaReactions={true}
  showRelatedArticles={true}
  onRelatedClick={(article) => console.log('Related article:', article)}
/>
```

**Features:**
- Full article content display
- Article statistics (views, shares, bookmarks)
- Sentiment analysis visualization
- Related articles sidebar
- Social sharing actions
- Responsive layout with sticky sidebar

### 🤖 PersonaReactions
AI persona reactions and analysis for news articles.

```tsx
import { PersonaReactions } from '@/components/news';

<PersonaReactions
  article={newsArticle}
  variant="detailed" // 'preview' | 'detailed' | 'compact'
  maxReactions={5}
  onPersonaClick={(persona) => console.log('Persona:', persona)}
  onReactionClick={(persona, reaction) => console.log('Reaction:', reaction)}
/>
```

**Features:**
- AI-generated reactions based on political alignment
- Confidence scoring
- Political stance indicators
- Expandable reaction lists
- Real-time reaction generation
- Engagement metrics

### 🌍 RegionalNewsToggle
Regional news selection with country/region filtering.

```tsx
import { RegionalNewsToggle } from '@/components/news';

<RegionalNewsToggle
  currentRegion="US"
  onRegionChange={(region) => console.log('Region:', region)}
  variant="default" // 'default' | 'compact' | 'minimal'
  showLabel={true}
/>
```

**Features:**
- Global region selection (US, UK, EU, Asia, etc.)
- Flag and timezone display
- Quick access buttons
- Multiple display variants
- Language indicators

## Type Definitions

### NewsArticle
```tsx
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  source: string;
  category: string;
  politicalLean?: 'left' | 'center' | 'right';
  sentiment: number; // -1 to 1
  relevanceScore: number; // 0 to 1
}
```

### NewsFilters
```tsx
interface NewsFilters {
  category?: string;
  region?: string;
  politicalLean?: 'left' | 'center' | 'right';
  search?: string;
}
```

## API Integration

### News Endpoint
The components integrate with the `/api/news` endpoint:

```typescript
// GET /api/news
// Query parameters:
// - category: string (optional)
// - region: string (optional)
// - politicalLean: string (optional)
// - search: string (optional)
// - page: number (default: 1)
// - limit: number (default: 20, max: 50)

interface NewsResponse {
  news: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## Styling and Theming

All components use the project's design system with:
- **Chakra UI + Tailwind CSS** integration
- **X-like styling** with proper contrast ratios
- **Dark mode support** with automatic theme switching
- **Political color system** for alignment indicators
- **Responsive breakpoints** for mobile, tablet, desktop
- **Animation system** for smooth interactions

### Color System
```css
/* Political alignments */
.bg-political-conservative-500 { background-color: #dc2626; }
.bg-political-liberal-500 { background-color: #2563eb; }
.bg-political-progressive-500 { background-color: #059669; }
.bg-political-moderate-500 { background-color: #7c3aed; }
.bg-political-independent-500 { background-color: #16a34a; }
```

## Accessibility Features

- **WCAG 2.1 AA compliant** color contrast ratios
- **Keyboard navigation** support for all interactive elements
- **Screen reader friendly** with proper ARIA labels
- **Focus management** for modals and dropdowns
- **High contrast mode** support
- **Reduced motion** support for animations

## Performance Optimizations

- **Lazy loading** for images and content
- **Virtual scrolling** for large news lists
- **Debounced search** to reduce API calls
- **Optimized bundle size** with tree-shaking
- **Caching strategy** for API responses
- **Progressive loading** for better perceived performance

## Usage Examples

### Basic News Feed
```tsx
import { NewsFeed } from '@/components/news';

export function NewsPage() {
  return (
    <div className="container mx-auto px-4">
      <NewsFeed
        variant="default"
        onArticleClick={(article) => {
          // Navigate to article detail
          router.push(`/news/${article.id}`);
        }}
      />
    </div>
  );
}
```

### Custom News Dashboard
```tsx
import {
  NewsFilters,
  NewsSearch,
  TrendingNews,
  NewsCard
} from '@/components/news';

export function NewsDashboard() {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <NewsSearch onSearch={setSearchQuery} />
        <NewsFilters
          currentFilters={filters}
          onFiltersChange={setFilters}
        />
        {/* News list here */}
      </div>
      <div className="space-y-6">
        <TrendingNews filters={filters} />
      </div>
    </div>
  );
}
```

### Article Detail Page
```tsx
import { NewsDetail, PersonaReactions } from '@/components/news';

export function ArticlePage({ article }: { article: NewsArticle }) {
  return (
    <div className="max-w-4xl mx-auto">
      <NewsDetail
        article={article}
        onBack={() => router.back()}
        showPersonaReactions={true}
        showRelatedArticles={true}
      />
    </div>
  );
}
```

## Development Notes

- All components are **client-side rendered** with `'use client'` directive
- **TypeScript strict mode** enabled with full type coverage
- **Error boundaries** recommended for production use
- **Loading states** handled gracefully with skeleton UI
- **Responsive design** tested across all major device sizes
- **Cross-browser compatibility** for modern browsers (ES2020+)