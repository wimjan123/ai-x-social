'use client';

import { useState } from 'react';
import { cn } from '@/lib/design-system';
import {
  NewsFeed,
  NewsCard,
  NewsFilters,
  NewsSearch,
  TrendingNews,
  NewsDetail,
  PersonaReactions,
  RegionalNewsToggle,
} from '@/components/news';
import { Button } from '@/components/ui/Button';
import type { NewsArticle } from '@/types';

// Mock news article for demonstration
const mockArticle: NewsArticle = {
  id: 'demo-article-1',
  title: 'Global Climate Summit Reaches Historic Agreement on Carbon Emission Targets',
  description: 'World leaders from 195 countries have agreed to ambitious new carbon emission reduction targets in what many are calling the most significant climate agreement in decades. The comprehensive plan includes specific goals for renewable energy adoption and funding for developing nations.',
  url: 'https://example.com/climate-summit-agreement',
  imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
  publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  source: 'Global News Network',
  category: 'WORLD',
  politicalLean: 'center',
  sentiment: 0.7,
  relevanceScore: 0.92,
};

const mockFilters = {
  category: '',
  region: 'WORLDWIDE',
  politicalLean: undefined as 'left' | 'center' | 'right' | undefined,
};

export function NewsComponentsDemo() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [filters, setFilters] = useState(mockFilters);
  const [searchQuery, setSearchQuery] = useState('');

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToFeed = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-x-text dark:text-x-text-dark">
          News Components Demo
        </h1>
        <p className="text-lg text-x-text-secondary dark:text-x-text-secondary-dark max-w-3xl mx-auto">
          Interactive demonstration of the complete news feed component suite for the AI social media platform.
          Features include real-time filtering, search, trending topics, AI persona reactions, and responsive design.
        </p>
      </div>

      {/* Main News Feed Demo */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">Complete News Feed</h2>
        <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
          <p className="text-x-text-secondary dark:text-x-text-secondary-dark mb-6">
            The main news feed component with integrated filtering, search, and trending sidebar.
          </p>
          <NewsFeed
            variant="default"
            showFilters={true}
            showSearch={true}
            showTrending={true}
            onArticleClick={handleArticleClick}
            className="border border-x-border rounded-lg"
          />
        </div>
      </section>

      {/* News Card Variants */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">News Card Variants</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Compact Variant</h3>
              <NewsCard
                article={mockArticle}
                variant="compact"
                onClick={handleArticleClick}
                className="border border-x-border rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Default Variant</h3>
              <NewsCard
                article={mockArticle}
                variant="default"
                onClick={handleArticleClick}
                showPersonaReactions={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Detailed Variant</h3>
            <NewsCard
              article={mockArticle}
              variant="detailed"
              onClick={handleArticleClick}
              showPersonaReactions={true}
            />
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">Filters & Search</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
            <h3 className="text-xl font-semibold mb-4">News Filters</h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark mb-6">
              Advanced filtering system for category, region, and political perspective.
            </p>
            <NewsFilters
              currentFilters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
            <h3 className="text-xl font-semibold mb-4">News Search</h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark mb-6">
              Intelligent search with trending suggestions and recent search history.
            </p>
            <NewsSearch
              onSearch={setSearchQuery}
              initialValue={searchQuery}
              showSuggestions={true}
              showRecentSearches={true}
            />
          </div>
        </div>
      </section>

      {/* Trending News */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">Trending News</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Compact</h3>
            <TrendingNews
              variant="compact"
              maxItems={5}
              onArticleClick={handleArticleClick}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Default</h3>
            <TrendingNews
              variant="default"
              maxItems={4}
              onArticleClick={handleArticleClick}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed</h3>
            <TrendingNews
              variant="detailed"
              maxItems={3}
              onArticleClick={handleArticleClick}
            />
          </div>
        </div>
      </section>

      {/* AI Persona Reactions */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">AI Persona Reactions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Preview Variant</h3>
            <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
              <PersonaReactions
                article={mockArticle}
                variant="preview"
                maxReactions={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Detailed Variant</h3>
            <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
              <PersonaReactions
                article={mockArticle}
                variant="detailed"
                maxReactions={5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Regional News Toggle */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">Regional News Selection</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Default Variant</h3>
            <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
              <RegionalNewsToggle
                currentRegion={filters.region}
                onRegionChange={(region) => setFilters(prev => ({ ...prev, region }))}
                variant="default"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Compact Variant</h3>
            <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
              <RegionalNewsToggle
                currentRegion={filters.region}
                onRegionChange={(region) => setFilters(prev => ({ ...prev, region }))}
                variant="compact"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Minimal Variant</h3>
            <div className="bg-white dark:bg-x-dark rounded-xl border border-x-border p-6">
              <RegionalNewsToggle
                currentRegion={filters.region}
                onRegionChange={(region) => setFilters(prev => ({ ...prev, region }))}
                variant="minimal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Detail View */}
      {selectedArticle && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-x-text dark:text-x-text-dark">News Detail View</h2>
          <NewsDetail
            article={selectedArticle}
            onBack={handleBackToFeed}
            showPersonaReactions={true}
            showRelatedArticles={true}
            onRelatedClick={handleArticleClick}
          />
        </section>
      )}

      {/* Component Features Summary */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Component Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-semibold">Smart Search</h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
              Trending suggestions and search history with real-time filtering
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto text-2xl">
              🎯
            </div>
            <h3 className="text-xl font-semibold">Advanced Filters</h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
              Category, region, and political perspective filtering system
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto text-2xl">
              🤖
            </div>
            <h3 className="text-xl font-semibold">AI Reactions</h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
              Political personas react to news with intelligent analysis
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mx-auto text-2xl">
              📱
            </div>
            <h3 className="text-xl font-semibold">Responsive Design</h3>
            <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
              Optimized for mobile, tablet, and desktop with X-like styling
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-x-text-secondary dark:text-x-text-secondary-dark">
            All components integrate seamlessly with the AI social media platform's backend API
            and support real-time updates, dark mode, and accessibility features.
          </p>
        </div>
      </section>
    </div>
  );
}