'use client';

import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  Flex,
  Avatar,
  Button,
  Badge,
  Divider,
  useColorModeValue,
  HStack,
  Progress,
  Link,
} from '@chakra-ui/react';
import {
  TrendingUp,
  Users,
  Hash,
  ExternalLink,
  Calendar,
  MapPin,
  Flame,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { SearchBar } from './SearchBar';

interface TrendingTopic {
  id: string;
  hashtag: string;
  category: string;
  posts: number;
  change: number; // percentage change
  sentiment: 'positive' | 'negative' | 'neutral';
  politicalLean?: 'conservative' | 'liberal' | 'progressive' | 'moderate';
}

interface SuggestedUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio: string;
  followers: number;
  politicalAlignment: 'conservative' | 'liberal' | 'progressive' | 'moderate';
  influenceLevel: 'minimal' | 'emerging' | 'rising' | 'influential' | 'viral';
  isVerified?: boolean;
  isFollowing?: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  engagementCount: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
}

export function RightSidebar() {
  const bgColor = useColorModeValue('white', 'x.600');
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('x.500', 'x.100');
  const mutedTextColor = useColorModeValue('x.300', 'x.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data
  const trendingTopics: TrendingTopic[] = [
    {
      id: '1',
      hashtag: '#ClimateAction',
      category: 'Politics',
      posts: 45200,
      change: 23.5,
      sentiment: 'positive',
      politicalLean: 'progressive',
    },
    {
      id: '2',
      hashtag: '#EconomicPolicy',
      category: 'Politics',
      posts: 32100,
      change: -5.2,
      sentiment: 'neutral',
      politicalLean: 'moderate',
    },
    {
      id: '3',
      hashtag: '#TechRegulation',
      category: 'Technology',
      posts: 28900,
      change: 15.8,
      sentiment: 'negative',
      politicalLean: 'liberal',
    },
    {
      id: '4',
      hashtag: '#Healthcare',
      category: 'Politics',
      posts: 21400,
      change: 8.3,
      sentiment: 'positive',
    },
    {
      id: '5',
      hashtag: '#Elections2024',
      category: 'Politics',
      posts: 67800,
      change: 45.2,
      sentiment: 'neutral',
    },
  ];

  const suggestedUsers: SuggestedUser[] = [
    {
      id: '1',
      username: '@sarahpolicy',
      displayName: 'Sarah Chen',
      bio: 'Policy analyst • Climate advocate',
      followers: 45200,
      politicalAlignment: 'progressive',
      influenceLevel: 'influential',
      isVerified: true,
    },
    {
      id: '2',
      username: '@econmike',
      displayName: 'Michael Thompson',
      bio: 'Economic researcher • Data enthusiast',
      followers: 12800,
      politicalAlignment: 'moderate',
      influenceLevel: 'rising',
    },
    {
      id: '3',
      username: '@techpolicy',
      displayName: 'TechPolicy Watch',
      bio: 'Technology policy updates',
      followers: 89300,
      politicalAlignment: 'liberal',
      influenceLevel: 'viral',
      isVerified: true,
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'New Climate Bill Passes Senate Committee',
      source: 'Political News',
      url: '#',
      publishedAt: '2h',
      category: 'Politics',
      engagementCount: 1250,
    },
    {
      id: '2',
      title: 'Tech Giants Face New Regulation Proposals',
      source: 'Tech Times',
      url: '#',
      publishedAt: '4h',
      category: 'Technology',
      engagementCount: 890,
    },
    {
      id: '3',
      title: 'Healthcare Reform Debate Continues',
      source: 'Health News',
      url: '#',
      publishedAt: '6h',
      category: 'Healthcare',
      engagementCount: 675,
    },
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'Climate Action Town Hall',
      date: 'Tomorrow, 7 PM',
      location: 'Community Center',
      attendees: 245,
      category: 'Politics',
    },
    {
      id: '2',
      title: 'Tech Policy Webinar',
      date: 'Thursday, 3 PM',
      location: 'Online',
      attendees: 1200,
      category: 'Technology',
    },
  ];

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

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'green.400',
      negative: 'red.400',
      neutral: 'gray.400',
    };
    return colors[sentiment as keyof typeof colors];
  };

  return (
    <Box w="350px" p={4} bg={bgColor}>
      <VStack spacing={6} align="stretch">
        {/* Search Bar */}
        <SearchBar placeholder="Search AI Social" size="md" />

        {/* Trending Topics */}
        <Card bg={cardBg} variant="outline">
          <CardBody p={4}>
            <Flex align="center" gap={2} mb={4}>
              <TrendingUp size={20} color="#1da1f2" />
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Trending for you
              </Text>
            </Flex>

            <VStack spacing={3} align="stretch">
              {trendingTopics.slice(0, 5).map((topic, index) => (
                <Box key={topic.id}>
                  <Flex justify="space-between" align="flex-start" gap={3}>
                    <Box flex={1}>
                      <Flex align="center" gap={2} mb={1}>
                        <Text
                          fontSize="sm"
                          color={mutedTextColor}
                          textTransform="capitalize"
                        >
                          {index + 1} · {topic.category}
                        </Text>
                        {topic.politicalLean && (
                          <Box
                            w="6px"
                            h="6px"
                            borderRadius="full"
                            bg={getPoliticalColor(topic.politicalLean)}
                          />
                        )}
                      </Flex>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={textColor}
                        cursor="pointer"
                        _hover={{ color: 'xBlue.500' }}
                      >
                        {topic.hashtag}
                      </Text>
                      <Text fontSize="sm" color={mutedTextColor}>
                        {formatNumber(topic.posts)} posts
                      </Text>
                    </Box>
                    <VStack spacing={1} align="flex-end">
                      <Flex align="center" gap={1}>
                        {topic.change > 0 ? (
                          <ArrowUp size={12} color="green" />
                        ) : (
                          <ArrowDown size={12} color="red" />
                        )}
                        <Text
                          fontSize="xs"
                          color={topic.change > 0 ? 'green.500' : 'red.500'}
                          fontWeight="semibold"
                        >
                          {Math.abs(topic.change)}%
                        </Text>
                      </Flex>
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={getSentimentColor(topic.sentiment)}
                        title={`Sentiment: ${topic.sentiment}`}
                      />
                    </VStack>
                  </Flex>
                  {index < trendingTopics.length - 1 && <Divider mt={3} />}
                </Box>
              ))}
            </VStack>

            <Button
              variant="ghost"
              size="sm"
              color="xBlue.500"
              mt={3}
              w="full"
              _hover={{ bg: 'xBlue.50' }}
              _dark={{ _hover: { bg: 'xBlue.900' } }}
            >
              Show more
            </Button>
          </CardBody>
        </Card>

        {/* Who to follow */}
        <Card bg={cardBg} variant="outline">
          <CardBody p={4}>
            <Flex align="center" gap={2} mb={4}>
              <Users size={20} color="#1da1f2" />
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Who to follow
              </Text>
            </Flex>

            <VStack spacing={4} align="stretch">
              {suggestedUsers.map((user) => (
                <Flex key={user.id} gap={3} align="flex-start">
                  <Avatar
                    size="md"
                    name={user.displayName}
                    src={user.avatar}
                    variant={`political-${user.politicalAlignment}`}
                  />
                  <Box flex={1} minW={0}>
                    <Flex align="center" gap={2} mb={1}>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={textColor}
                        isTruncated
                      >
                        {user.displayName}
                      </Text>
                      {user.isVerified && (
                        <Badge colorScheme="blue" variant="solid" size="sm">
                          ✓
                        </Badge>
                      )}
                    </Flex>
                    <Text fontSize="sm" color={mutedTextColor} mb={1}>
                      {user.username}
                    </Text>
                    <Text fontSize="sm" color={textColor} mb={2} noOfLines={2}>
                      {user.bio}
                    </Text>
                    <Flex align="center" gap={3} mb={2}>
                      <Text fontSize="xs" color={mutedTextColor}>
                        {formatNumber(user.followers)} followers
                      </Text>
                      <Badge
                        variant={`influence-${user.influenceLevel}`}
                        size="sm"
                      >
                        {user.influenceLevel}
                      </Badge>
                    </Flex>
                    <Button
                      size="sm"
                      variant={user.isFollowing ? 'outline' : 'x-primary'}
                      w="full"
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </Box>
                </Flex>
              ))}
            </VStack>

            <Button
              variant="ghost"
              size="sm"
              color="xBlue.500"
              mt={3}
              w="full"
              _hover={{ bg: 'xBlue.50' }}
              _dark={{ _hover: { bg: 'xBlue.900' } }}
            >
              Show more
            </Button>
          </CardBody>
        </Card>

        {/* News */}
        <Card bg={cardBg} variant="outline">
          <CardBody p={4}>
            <Flex align="center" gap={2} mb={4}>
              <Hash size={20} color="#1da1f2" />
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                What's happening
              </Text>
            </Flex>

            <VStack spacing={3} align="stretch">
              {newsItems.map((news) => (
                <Box key={news.id}>
                  <Link href={news.url} isExternal>
                    <Flex justify="space-between" align="flex-start" gap={2}>
                      <Box flex={1}>
                        <Text fontSize="sm" color={mutedTextColor} mb={1}>
                          {news.category} · {news.source} · {news.publishedAt}
                        </Text>
                        <Text
                          fontSize="md"
                          fontWeight="semibold"
                          color={textColor}
                          mb={1}
                          _hover={{ color: 'xBlue.500' }}
                          noOfLines={2}
                        >
                          {news.title}
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor}>
                          {formatNumber(news.engagementCount)} people are talking about this
                        </Text>
                      </Box>
                      <ExternalLink size={16} color={mutedTextColor} />
                    </Flex>
                  </Link>
                  <Divider mt={3} />
                </Box>
              ))}
            </VStack>

            <Button
              variant="ghost"
              size="sm"
              color="xBlue.500"
              mt={3}
              w="full"
              _hover={{ bg: 'xBlue.50' }}
              _dark={{ _hover: { bg: 'xBlue.900' } }}
            >
              Show more
            </Button>
          </CardBody>
        </Card>

        {/* Events */}
        <Card bg={cardBg} variant="outline">
          <CardBody p={4}>
            <Flex align="center" gap={2} mb={4}>
              <Calendar size={20} color="#1da1f2" />
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Upcoming events
              </Text>
            </Flex>

            <VStack spacing={3} align="stretch">
              {events.map((event) => (
                <Box key={event.id}>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    mb={1}
                    cursor="pointer"
                    _hover={{ color: 'xBlue.500' }}
                  >
                    {event.title}
                  </Text>
                  <HStack spacing={2} mb={1}>
                    <Calendar size={14} color={mutedTextColor} />
                    <Text fontSize="sm" color={mutedTextColor}>
                      {event.date}
                    </Text>
                  </HStack>
                  <HStack spacing={2} mb={1}>
                    <MapPin size={14} color={mutedTextColor} />
                    <Text fontSize="sm" color={mutedTextColor}>
                      {event.location}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={mutedTextColor}>
                    {formatNumber(event.attendees)} interested
                  </Text>
                  <Divider mt={3} />
                </Box>
              ))}
            </VStack>

            <Button
              variant="ghost"
              size="sm"
              color="xBlue.500"
              mt={3}
              w="full"
              _hover={{ bg: 'xBlue.50' }}
              _dark={{ _hover: { bg: 'xBlue.900' } }}
            >
              Show more
            </Button>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}

export default RightSidebar;