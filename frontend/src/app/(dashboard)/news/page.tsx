'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  useToast,
  Button,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  NewsFeed,
  NewsFilters,
  NewsSearch,
  TrendingNews,
  PersonaReactions,
  RegionalNewsToggle,
  type NewsArticle,
  type TrendingTopic,
} from '@/components/news';
import { cn, getAnimationClasses } from '@/lib/design-system';
import {
  Newspaper,
  TrendingUp,
  Globe2,
  Bot,
  RefreshCw,
  AlertCircle,
  Filter,
  Search,
} from 'lucide-react';

interface NewsPageState {
  selectedArticle: NewsArticle | null;
  activeFilter: {
    category?: string;
    region?: string;
    search?: string;
    politicalLean?: 'left' | 'center' | 'right';
  };
  showPersonaReactions: boolean;
  isRegionalMode: boolean;
  viewMode: 'feed' | 'trending' | 'search';
}

export default function NewsPage() {
  const [state, setState] = useState<NewsPageState>({
    selectedArticle: null,
    activeFilter: {},
    showPersonaReactions: true,
    isRegionalMode: false,
    viewMode: 'feed',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const toast = useToast();
  const animations = getAnimationClasses();

  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const sidebarWidth = useBreakpointValue({ base: '100%', lg: '300px' });

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');

  // Initialize page data
  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load initial news data and user preferences
        const [newsResponse, preferencesResponse] = await Promise.all([
          fetch('/api/news?limit=20'),
          fetch('/api/user/preferences/news'),
        ]);

        if (!newsResponse.ok) {
          throw new Error('Failed to load news');
        }

        const newsData = await newsResponse.json();

        // Load user preferences if available
        if (preferencesResponse.ok) {
          const preferences = await preferencesResponse.json();
          setState(prev => ({
            ...prev,
            activeFilter: preferences.defaultFilters || {},
            showPersonaReactions: preferences.showPersonaReactions ?? true,
            isRegionalMode: preferences.regionalMode ?? false,
          }));
        }

        setLastRefresh(new Date());
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast({
          title: 'Error loading news',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [toast]);

  // Auto-refresh news every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filters: typeof state.activeFilter) => {
    setState(prev => ({
      ...prev,
      activeFilter: { ...prev.activeFilter, ...filters },
    }));

    // Save user preferences
    fetch('/api/user/preferences/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ defaultFilters: filters }),
    }).catch(console.error);
  }, []);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    setState(prev => ({
      ...prev,
      activeFilter: { ...prev.activeFilter, search: searchTerm },
      viewMode: searchTerm ? 'search' : 'feed',
    }));
  }, []);

  // Handle article selection
  const handleArticleClick = useCallback((article: NewsArticle) => {
    setState(prev => ({
      ...prev,
      selectedArticle: article,
    }));

    // Track article view
    fetch('/api/analytics/article-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: article.id }),
    }).catch(console.error);
  }, []);

  // Handle persona reactions
  const handlePersonaReaction = useCallback((article: NewsArticle) => {
    // This will trigger the PersonaReactions component to show reactions
    setState(prev => ({
      ...prev,
      selectedArticle: article,
      showPersonaReactions: true,
    }));
  }, []);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/news/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: state.activeFilter }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh news');
      }

      setLastRefresh(new Date());
      toast({
        title: 'News refreshed',
        description: 'Latest articles have been loaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh';
      setError(errorMessage);
      toast({
        title: 'Refresh failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [state.activeFilter, toast]);

  // Toggle regional mode
  const handleRegionalToggle = useCallback((enabled: boolean) => {
    setState(prev => ({
      ...prev,
      isRegionalMode: enabled,
    }));
  }, []);

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} p={4}>
        <VStack spacing={6} maxW="7xl" mx="auto">
          <Skeleton height="60px" width="100%" />
          <Flex w="100%" gap={6}>
            <Skeleton height="500px" flex={1} />
            {!isMobile && <Skeleton height="500px" width={sidebarWidth || "300px"} />}
          </Flex>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        bg={cardBg}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        py={6}
        className={animations.slideDown}
      >
        <Flex align="center" justify="space-between" maxW="7xl" mx="auto">
          <HStack spacing={3}>
            <Icon as={Newspaper} w={8} h={8} color="blue.500" />
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                News & Current Events
              </Text>
              <Text fontSize="sm" color="gray.500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RefreshCw size={16} />}
              onClick={handleRefresh}
              loadingText="Refreshing..."
            >
              Refresh
            </Button>

            {!isMobile && (
              <RegionalNewsToggle
                currentRegion={state.isRegionalMode ? 'US' : 'WORLDWIDE'}
                onRegionChange={(region) => handleRegionalToggle(region !== 'WORLDWIDE')}
              />
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box maxW="7xl" mx="auto" p={4}>
          <Alert status="error" className={animations.slideDown}>
            <AlertIcon />
            <Box>
              <AlertTitle>Error loading news</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
            <Button
              ml="auto"
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </Alert>
        </Box>
      )}

      {/* Main Content */}
      <Flex maxW="7xl" mx="auto" gap={6} p={4}>
        {/* News Feed */}
        <Box flex={1} className={animations.fadeIn}>
          {/* Mobile Controls */}
          {isMobile && (
            <VStack spacing={4} mb={6}>
              <NewsSearch
                onSearch={handleSearch}
                placeholder="Search news..."
                className="w-full"
              />
              <HStack w="100%" justify="space-between">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Filter size={16} />}
                  onClick={() => {/* Open filter modal */}}
                >
                  Filters
                </Button>
                <RegionalNewsToggle
                  currentRegion={state.isRegionalMode ? 'US' : 'WORLDWIDE'}
                  onRegionChange={(region) => handleRegionalToggle(region !== 'WORLDWIDE')}
                />
              </HStack>
            </VStack>
          )}

          <NewsFeed
            variant="detailed"
            showFilters={!isMobile}
            showSearch={!isMobile}
            showTrending={false}
            onArticleClick={handleArticleClick}
            onPersonaReaction={handlePersonaReaction}
            className={cn('w-full', animations.fadeIn)}
          />
        </Box>

        {/* Sidebar */}
        {!isMobile && (
          <VStack
            width={sidebarWidth || "300px"}
            spacing={6}
            className={animations.slideInRight}
          >
            {/* Search */}
            <Box w="100%">
              <NewsSearch
                onSearch={handleSearch}
                placeholder="Search news..."
              />
            </Box>

            {/* Filters */}
            <Box w="100%">
              <NewsFilters
                currentFilters={state.activeFilter}
                onFiltersChange={handleFilterChange}
              />
            </Box>

            {/* Trending Topics */}
            <Box w="100%">
              <TrendingNews
                onTopicClick={(topic: TrendingTopic) => {
                  handleSearch(topic.hashtag);
                }}
                variant="compact"
              />
            </Box>

            {/* AI Persona Reactions */}
            {state.selectedArticle && state.showPersonaReactions && (
              <Box w="100%">
                <PersonaReactions
                  article={state.selectedArticle}
                  variant="compact"
                  onPersonaClick={(persona) => {
                    // Navigate to persona profile or show more reactions
                    console.log('Persona clicked:', persona);
                  }}
                />
              </Box>
            )}
          </VStack>
        )}
      </Flex>

      {/* Mobile Persona Reactions Modal */}
      {isMobile && state.selectedArticle && state.showPersonaReactions && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg={cardBg}
          borderTop="1px"
          borderColor={borderColor}
          p={4}
          maxH="50vh"
          overflowY="auto"
          className={animations.slideUp}
        >
          <PersonaReactions
            article={state.selectedArticle}
            variant="compact"
            onPersonaClick={(persona) => {
              console.log('Persona clicked:', persona);
            }}
          />
        </Box>
      )}
    </Box>
  );
}