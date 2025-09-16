'use client';

import {
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  VStack,
  Text,
  Flex,
  Avatar,
  Badge,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Divider,
  Button,
  HStack,
} from '@chakra-ui/react';
import { Search, Hash, TrendingUp, Users, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchResult {
  id: string;
  type: 'user' | 'hashtag' | 'trend' | 'recent';
  title: string;
  subtitle?: string;
  avatar?: string;
  count?: number;
  change?: number;
  politicalAlignment?: 'conservative' | 'liberal' | 'progressive' | 'moderate';
  influenceLevel?: 'minimal' | 'emerging' | 'rising' | 'influential' | 'viral';
  isVerified?: boolean;
}

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  showModal?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
}

export function SearchBar({
  placeholder = "Search AI Social",
  size = 'md',
  showModal = false,
  className = '',
  onSearch,
  onResultSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const focusBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('x.500', 'x.100');
  const mutedTextColor = useColorModeValue('x.300', 'x.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'user',
      title: 'Sarah Chen',
      subtitle: '@sarahpolicy',
      avatar: '',
      politicalAlignment: 'progressive',
      influenceLevel: 'influential',
      isVerified: true,
    },
    {
      id: '2',
      type: 'hashtag',
      title: '#ClimateAction',
      count: 45200,
      change: 23.5,
    },
    {
      id: '3',
      type: 'trend',
      title: 'Economic Policy',
      count: 32100,
      change: -5.2,
    },
    {
      id: '4',
      type: 'user',
      title: 'Michael Thompson',
      subtitle: '@econmike',
      avatar: '',
      politicalAlignment: 'moderate',
      influenceLevel: 'rising',
    },
    {
      id: '5',
      type: 'hashtag',
      title: '#TechRegulation',
      count: 28900,
      change: 15.8,
    },
  ];

  const mockRecentSearches: SearchResult[] = [
    {
      id: 'r1',
      type: 'recent',
      title: 'healthcare reform',
    },
    {
      id: 'r2',
      type: 'recent',
      title: '#Elections2024',
    },
    {
      id: 'r3',
      type: 'recent',
      title: '@politicalnews',
    },
  ];

  useEffect(() => {
    setRecentSearches(mockRecentSearches);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (value.trim()) {
      // Filter mock results based on query
      const filtered = mockResults.filter(
        result =>
          result.title.toLowerCase().includes(value.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }

    onSearch?.(value);
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    onResultSelect?.(result);

    // Add to recent searches (avoid duplicates)
    setRecentSearches(prev => {
      const newRecent = { ...result, type: 'recent' as const };
      const filtered = prev.filter(item => item.title !== result.title);
      return [newRecent, ...filtered].slice(0, 5);
    });

    if (showModal) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch?.(query);
      if (showModal) {
        onClose();
      }
    }
    if (e.key === 'Escape' && showModal) {
      onClose();
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPoliticalColor = (alignment?: string) => {
    if (!alignment) return 'gray.400';
    const colors = {
      conservative: 'political.conservative.400',
      liberal: 'political.liberal.400',
      progressive: 'political.progressive.400',
      moderate: 'political.moderate.400',
    };
    return colors[alignment as keyof typeof colors];
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'hashtag':
        return <Hash size={16} />;
      case 'trend':
        return <TrendingUp size={16} />;
      case 'user':
        return <Users size={16} />;
      case 'recent':
        return <Clock size={16} />;
      default:
        return <Search size={16} />;
    }
  };

  const renderSearchResult = (result: SearchResult) => (
    <Flex
      key={result.id}
      align="center"
      gap={3}
      p={3}
      cursor="pointer"
      borderRadius="md"
      _hover={{ bg: hoverBg }}
      onClick={() => handleResultClick(result)}
    >
      {result.type === 'user' ? (
        <Avatar
          size="sm"
          name={result.title}
          src={result.avatar}
          variant={result.politicalAlignment ? `political-${result.politicalAlignment}` : undefined}
        />
      ) : (
        <Box color={mutedTextColor}>
          {getResultIcon(result.type)}
        </Box>
      )}

      <Box flex={1} minW={0}>
        <Flex align="center" gap={2} mb={1}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} isTruncated>
            {result.title}
          </Text>
          {result.isVerified && (
            <Badge colorScheme="blue" variant="solid" size="sm">
              ✓
            </Badge>
          )}
        </Flex>

        {result.subtitle && (
          <Text fontSize="sm" color={mutedTextColor} isTruncated>
            {result.subtitle}
          </Text>
        )}

        {result.count && (
          <Text fontSize="sm" color={mutedTextColor}>
            {formatNumber(result.count)} posts
            {result.change && (
              <Text
                as="span"
                color={result.change > 0 ? 'green.500' : 'red.500'}
                fontWeight="semibold"
                ml={2}
              >
                {result.change > 0 ? '+' : ''}{result.change}%
              </Text>
            )}
          </Text>
        )}
      </Box>

      {result.politicalAlignment && (
        <Box
          w="8px"
          h="8px"
          borderRadius="full"
          bg={getPoliticalColor(result.politicalAlignment)}
          title={`Political alignment: ${result.politicalAlignment}`}
        />
      )}
    </Flex>
  );

  const inputComponent = (
    <InputGroup size={size}>
      <InputLeftElement>
        <Search size={18} color={mutedTextColor} />
      </InputLeftElement>
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={showModal ? onOpen : undefined}
        placeholder={placeholder}
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="full"
        _focus={{
          bg: focusBg,
          borderColor: 'xBlue.500',
          boxShadow: '0 0 0 1px #1da1f2',
        }}
        _hover={{
          borderColor: 'xBlue.300',
        }}
        fontSize={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
        className={className}
      />
    </InputGroup>
  );

  if (showModal) {
    return (
      <>
        {inputComponent}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent mt={8} mx={4} borderRadius="16px">
            <ModalBody p={0}>
              <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                <InputGroup size="lg">
                  <InputLeftElement>
                    <Search size={20} color={mutedTextColor} />
                  </InputLeftElement>
                  <Input
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    border="none"
                    _focus={{ boxShadow: 'none' }}
                    fontSize="xl"
                    autoFocus
                  />
                </InputGroup>
              </Box>

              <Box maxH="400px" overflowY="auto">
                {query.trim() ? (
                  <VStack spacing={0} align="stretch">
                    {results.length > 0 ? (
                      results.map(renderSearchResult)
                    ) : (
                      <Box p={4} textAlign="center">
                        <Text color={mutedTextColor}>
                          No results found for "{query}"
                        </Text>
                      </Box>
                    )}
                  </VStack>
                ) : (
                  <VStack spacing={0} align="stretch">
                    {recentSearches.length > 0 && (
                      <>
                        <Box p={4} pb={2}>
                          <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            Recent searches
                          </Text>
                        </Box>
                        {recentSearches.map(renderSearchResult)}
                        <Divider />
                      </>
                    )}

                    <Box p={4} pb={2}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        Trending
                      </Text>
                    </Box>
                    {mockResults.slice(0, 3).map(renderSearchResult)}
                  </VStack>
                )}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // Non-modal version with dropdown
  return (
    <Box position="relative" className={className}>
      {inputComponent}

      {(query.trim() || recentSearches.length > 0) && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg={focusBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          mt={2}
          boxShadow="lg"
          zIndex={10}
          maxH="400px"
          overflowY="auto"
        >
          <VStack spacing={0} align="stretch">
            {query.trim() ? (
              results.length > 0 ? (
                results.map(renderSearchResult)
              ) : (
                <Box p={4} textAlign="center">
                  <Text color={mutedTextColor}>
                    No results found for "{query}"
                  </Text>
                </Box>
              )
            ) : (
              <>
                {recentSearches.length > 0 && (
                  <>
                    <Box p={3} pb={1}>
                      <Text fontSize="sm" fontWeight="semibold" color={mutedTextColor}>
                        Recent searches
                      </Text>
                    </Box>
                    {recentSearches.slice(0, 3).map(renderSearchResult)}
                  </>
                )}
              </>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default SearchBar;