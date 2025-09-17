import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { NewsFeed } from '@/components/news/NewsFeed';
import type { NewsArticle, ApiResponse } from '@/types';

// Mock the design system utilities
jest.mock('@/lib/design-system', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
  getAnimationClasses: () => ({
    fadeIn: 'animate-fade-in',
    slideIn: 'animate-slide-in',
  }),
}));

// Mock child components
jest.mock('@/components/news/NewsCard', () => ({
  NewsCard: ({ article, onClick, onPersonaReaction, className, style }: any) => (
    <div
      data-testid={`news-card-${article.id}`}
      className={className}
      style={style}
      onClick={() => onClick?.(article)}
    >
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <button onClick={() => onPersonaReaction?.(article)}>
        Persona Reaction
      </button>
    </div>
  ),
}));

jest.mock('@/components/news/NewsFilters', () => ({
  NewsFilters: ({ onFiltersChange, currentFilters }: any) => (
    <div data-testid="news-filters">
      <select
        data-testid="category-filter"
        onChange={(e) => onFiltersChange({ ...currentFilters, category: e.target.value })}
        value={currentFilters.category || ''}
      >
        <option value="">All Categories</option>
        <option value="politics">Politics</option>
        <option value="technology">Technology</option>
      </select>
    </div>
  ),
}));

jest.mock('@/components/news/NewsSearch', () => ({
  NewsSearch: ({ onSearch, initialValue }: any) => (
    <input
      data-testid="news-search"
      placeholder="Search news..."
      defaultValue={initialValue}
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

jest.mock('@/components/news/TrendingNews', () => ({
  TrendingNews: ({ filters, onArticleClick }: any) => (
    <div data-testid="trending-news">
      <h3>Trending News</h3>
      <button onClick={() => onArticleClick({ id: 'trending-1', title: 'Trending Article' })}>
        Trending Article
      </button>
    </div>
  ),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, isLoading, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  ),
}));

describe('Timeline (NewsFeed)', () => {
  const mockNewsArticles: NewsArticle[] = [
    {
      id: 'news-1',
      title: 'Breaking Political News',
      description: 'Important political development',
      url: 'https://example.com/news-1',
      imageUrl: 'https://example.com/image-1.jpg',
      publishedAt: new Date('2023-12-01'),
      source: 'News Source 1',
      category: 'politics',
      politicalLean: 'center',
      sentiment: 0.1,
      relevanceScore: 0.9,
    },
    {
      id: 'news-2',
      title: 'Technology Update',
      description: 'Latest tech developments',
      url: 'https://example.com/news-2',
      publishedAt: new Date('2023-12-02'),
      source: 'Tech News',
      category: 'technology',
      sentiment: 0.5,
      relevanceScore: 0.8,
    },
    {
      id: 'news-3',
      title: 'Economic Report',
      description: 'Market analysis and trends',
      url: 'https://example.com/news-3',
      imageUrl: 'https://example.com/image-3.jpg',
      publishedAt: new Date('2023-12-03'),
      source: 'Financial Times',
      category: 'economy',
      politicalLean: 'right',
      sentiment: -0.2,
      relevanceScore: 0.7,
    },
  ];

  const mockApiResponse = {
    success: true,
    data: mockNewsArticles,
    news: mockNewsArticles,
    pagination: {
      page: 1,
      limit: 20,
      total: 3,
      pages: 1,
    },
  };

  const mockFetch = jest.fn();
  const mockOnArticleClick = jest.fn();
  const mockOnPersonaReaction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders loading state initially', async () => {
      render(<NewsFeed />);

      expect(screen.getByText('Loading latest news...')).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('renders news articles after loading', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
        expect(screen.getByText('Technology Update')).toBeInTheDocument();
        expect(screen.getByText('Economic Report')).toBeInTheDocument();
      });
    });

    it('renders with minimal variant', async () => {
      render(<NewsFeed variant="minimal" />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      // Verify the grid layout classes for minimal variant
      const mainContent = screen.getByText('Breaking Political News').closest('[class*="lg:col-span-3"]');
      expect(mainContent).toBeInTheDocument();
    });

    it('renders with detailed variant', async () => {
      render(<NewsFeed variant="detailed" />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      // Verify the grid layout classes for detailed variant
      const mainContent = screen.getByText('Breaking Political News').closest('[class*="lg:col-span-2"]');
      expect(mainContent).toBeInTheDocument();
    });

    it('hides filters when showFilters is false', async () => {
      render(<NewsFeed showFilters={false} />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('news-filters')).not.toBeInTheDocument();
    });

    it('hides search when showSearch is false', async () => {
      render(<NewsFeed showSearch={false} />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('news-search')).not.toBeInTheDocument();
    });

    it('hides trending when showTrending is false', async () => {
      render(<NewsFeed showTrending={false} />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('trending-news')).not.toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('fetches news on initial load', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/news?page=1&limit=20');
      });
    });

    it('fetches news with custom page size', async () => {
      render(<NewsFeed pageSize={10} />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/news?page=1&limit=10');
      });
    });

    it('handles fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Failed to Load News')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });
    });

    it('handles API response errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch news: Internal Server Error')).toBeInTheDocument();
      });
    });

    it('shows partial error when articles exist but new fetch fails', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      // Simulate a subsequent failed fetch
      mockFetch.mockRejectedValue(new Error('Partial failure'));

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText('Partial failure')).toBeInTheDocument();
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Search', () => {
    it('applies category filter', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByTestId('category-filter')).toBeInTheDocument();
      });

      const categoryFilter = screen.getByTestId('category-filter');
      await userEvent.selectOptions(categoryFilter, 'politics');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/news?category=politics&page=1&limit=20');
      });
    });

    it('applies search filter', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByTestId('news-search')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('news-search');
      await userEvent.type(searchInput, 'political');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/news?search=political&page=1&limit=20');
      });
    });

    it('combines multiple filters', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByTestId('category-filter')).toBeInTheDocument();
        expect(screen.getByTestId('news-search')).toBeInTheDocument();
      });

      const categoryFilter = screen.getByTestId('category-filter');
      const searchInput = screen.getByTestId('news-search');

      await userEvent.selectOptions(categoryFilter, 'politics');
      await userEvent.type(searchInput, 'breaking');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/news?category=politics&search=breaking&page=1&limit=20');
      });
    });

    it('resets pagination when filters change', async () => {
      const multiPageResponse = {
        ...mockApiResponse,
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          pages: 5,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(multiPageResponse),
      });

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByTestId('category-filter')).toBeInTheDocument();
      });

      const categoryFilter = screen.getByTestId('category-filter');
      await userEvent.selectOptions(categoryFilter, 'politics');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenLastCalledWith('/api/news?category=politics&page=1&limit=20');
      });
    });
  });

  describe('Pagination and Load More', () => {
    it('shows load more button when more pages available', async () => {
      const multiPageResponse = {
        ...mockApiResponse,
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          pages: 5,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(multiPageResponse),
      });

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
      });
    });

    it('loads more articles when load more is clicked', async () => {
      const multiPageResponse = {
        ...mockApiResponse,
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          pages: 5,
        },
      };

      const secondPageResponse = {
        ...mockApiResponse,
        news: [
          {
            id: 'news-4',
            title: 'Page 2 Article',
            description: 'Second page content',
            url: 'https://example.com/news-4',
            publishedAt: new Date('2023-12-04'),
            source: 'News Source 2',
            category: 'politics',
            sentiment: 0.0,
            relevanceScore: 0.6,
          },
        ],
        pagination: {
          page: 2,
          limit: 20,
          total: 100,
          pages: 5,
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(multiPageResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(secondPageResponse),
        });

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      await userEvent.click(loadMoreButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/news?page=2&limit=20');
        expect(screen.getByText('Page 2 Article')).toBeInTheDocument();
      });
    });

    it('shows end of feed message when all pages loaded', async () => {
      const lastPageResponse = {
        ...mockApiResponse,
        pagination: {
          page: 1,
          limit: 20,
          total: 3,
          pages: 1,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(lastPageResponse),
      });

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText("You're all caught up! Check back later for more news.")).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
      });
    });

    it('shows loading state for load more', async () => {
      const multiPageResponse = {
        ...mockApiResponse,
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          pages: 5,
        },
      };

      let resolveSecondPage: (value: any) => void;
      const secondPagePromise = new Promise((resolve) => {
        resolveSecondPage = resolve;
      });

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(multiPageResponse),
        })
        .mockReturnValueOnce(secondPagePromise);

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      await userEvent.click(loadMoreButton);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(loadMoreButton).toBeDisabled();

      resolveSecondPage!({
        ok: true,
        json: () => Promise.resolve({
          ...mockApiResponse,
          news: [],
          pagination: { page: 2, limit: 20, total: 100, pages: 5 },
        }),
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('refreshes news when refresh button is clicked', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenLastCalledWith('/api/news?page=1&limit=20');
      });
    });

    it('shows loading state during refresh', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });

      let resolveRefresh: (value: any) => void;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });

      mockFetch.mockReturnValueOnce(refreshPromise);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await userEvent.click(refreshButton);

      expect(refreshButton).toBeDisabled();

      resolveRefresh!({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      await waitFor(() => {
        expect(refreshButton).not.toBeDisabled();
      });
    });

    it('retries failed fetch when try again is clicked', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await userEvent.click(tryAgainButton);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });
    });
  });

  describe('Article Interactions', () => {
    it('calls onArticleClick when article is clicked', async () => {
      render(<NewsFeed onArticleClick={mockOnArticleClick} />);

      await waitFor(() => {
        expect(screen.getByTestId('news-card-news-1')).toBeInTheDocument();
      });

      const newsCard = screen.getByTestId('news-card-news-1');
      await userEvent.click(newsCard);

      expect(mockOnArticleClick).toHaveBeenCalledWith(mockNewsArticles[0]);
    });

    it('calls onPersonaReaction when persona reaction is clicked', async () => {
      render(<NewsFeed onPersonaReaction={mockOnPersonaReaction} />);

      await waitFor(() => {
        expect(screen.getAllByText('Persona Reaction')).toHaveLength(3);
      });

      const reactionButtons = screen.getAllByText('Persona Reaction');
      await userEvent.click(reactionButtons[0]);

      expect(mockOnPersonaReaction).toHaveBeenCalledWith(mockNewsArticles[0]);
    });

    it('handles trending news clicks', async () => {
      render(<NewsFeed onArticleClick={mockOnArticleClick} />);

      await waitFor(() => {
        expect(screen.getByTestId('trending-news')).toBeInTheDocument();
      });

      const trendingButton = screen.getByText('Trending Article');
      await userEvent.click(trendingButton);

      expect(mockOnArticleClick).toHaveBeenCalledWith({
        id: 'trending-1',
        title: 'Trending Article',
      });
    });
  });

  describe('Empty States', () => {
    it('shows empty state when no articles found', async () => {
      const emptyResponse = {
        ...mockApiResponse,
        news: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(emptyResponse),
      });

      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('No news articles found. Try adjusting your filters.')).toBeInTheDocument();
      });
    });
  });

  describe('Statistics Display', () => {
    it('shows article statistics', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Showing 3 of 3 articles')).toBeInTheDocument();
      });
    });

    it('shows statistics with filters applied', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByTestId('category-filter')).toBeInTheDocument();
      });

      const categoryFilter = screen.getByTestId('category-filter');
      await userEvent.selectOptions(categoryFilter, 'politics');

      await waitFor(() => {
        expect(screen.getByText('Showing 3 of 3 articles in politics')).toBeInTheDocument();
      });
    });
  });

  describe('Animation and Styling', () => {
    it('applies animation classes', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByTestId('news-card-news-1')).toHaveClass('animate-fade-in');
      });
    });

    it('applies staggered animation delays', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        const firstCard = screen.getByTestId('news-card-news-1');
        const secondCard = screen.getByTestId('news-card-news-2');

        expect(firstCard).toHaveStyle('animation-delay: 0ms');
        expect(secondCard).toHaveStyle('animation-delay: 100ms');
      });
    });

    it('applies custom className', async () => {
      render(<NewsFeed className="custom-timeline-class" />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      const container = screen.getByText('Latest News').closest('div');
      expect(container).toHaveClass('custom-timeline-class');
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts grid layout for different variants', async () => {
      const { rerender } = render(<NewsFeed variant="default" />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      // Test grid layout changes with variants
      rerender(<NewsFeed variant="detailed" />);

      await waitFor(() => {
        const mainContent = screen.getByText('Breaking Political News').closest('[class*="lg:col-span-2"]');
        expect(mainContent).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels and roles', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
      });
    });

    it('maintains focus management during interactions', async () => {
      render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      refreshButton.focus();
      expect(refreshButton).toHaveFocus();
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for default render', async () => {
      const { container } = render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Breaking Political News')).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for loading state', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { container } = render(<NewsFeed />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for error state', async () => {
      mockFetch.mockRejectedValue(new Error('Test error'));

      const { container } = render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('Failed to Load News')).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for empty state', async () => {
      const emptyResponse = {
        ...mockApiResponse,
        news: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(emptyResponse),
      });

      const { container } = render(<NewsFeed />);

      await waitFor(() => {
        expect(screen.getByText('No news articles found. Try adjusting your filters.')).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});