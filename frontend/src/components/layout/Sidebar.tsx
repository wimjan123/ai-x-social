'use client';

import {
  Box,
  VStack,
  Text,
  Avatar,
  Flex,
  useColorModeValue,
  Tooltip,
  Button,
  Badge,
  Divider,
} from '@chakra-ui/react';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Users,
  Settings,
  MoreHorizontal,
  TrendingUp,
  Hash,
  Calendar,
} from 'lucide-react';
import { NavigationMenu } from './NavigationMenu';
import DarkModeToggle from '../ui/DarkModeToggle';

interface SidebarProps {
  isCollapsed?: boolean;
  className?: string;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  politicalAlignment: 'conservative' | 'liberal' | 'progressive' | 'moderate';
  influenceLevel: 'minimal' | 'emerging' | 'rising' | 'influential' | 'viral';
  followers: number;
  following: number;
}

// Mock user data - would come from auth context
const mockUser: UserProfile = {
  id: '1',
  username: '@johndoe',
  displayName: 'John Doe',
  avatar: '',
  politicalAlignment: 'moderate',
  influenceLevel: 'rising',
  followers: 1250,
  following: 340,
};

export function Sidebar({ isCollapsed = false, className = '' }: SidebarProps) {
  const bgColor = useColorModeValue('white', 'x.600');
  const textColor = useColorModeValue('x.500', 'x.100');
  const mutedTextColor = useColorModeValue('x.300', 'x.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      isActive: true,
    },
    {
      icon: Search,
      label: 'Explore',
      href: '/explore',
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
      badge: 3,
    },
    {
      icon: Mail,
      label: 'Messages',
      href: '/messages',
      badge: 12,
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      href: '/bookmarks',
    },
    {
      icon: Hash,
      label: 'Topics',
      href: '/topics',
    },
    {
      icon: TrendingUp,
      label: 'Trending',
      href: '/trending',
    },
    {
      icon: Users,
      label: 'Communities',
      href: '/communities',
    },
    {
      icon: Calendar,
      label: 'Events',
      href: '/events',
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
    },
  ];

  const getPoliticalColor = (alignment: string) => {
    const colors = {
      conservative: 'political.conservative.500',
      liberal: 'political.liberal.500',
      progressive: 'political.progressive.500',
      moderate: 'political.moderate.500',
    };
    return colors[alignment as keyof typeof colors] || 'gray.500';
  };

  const getInfluenceBadgeVariant = (level: string) => {
    const variants = {
      minimal: 'influence-minimal',
      emerging: 'influence-emerging',
      rising: 'influence-rising',
      influential: 'influence-influential',
      viral: 'influence-viral',
    };
    return variants[level as keyof typeof variants] || 'gray';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isCollapsed) {
    return (
      <Box
        w="88px"
        h="100vh"
        bg={bgColor}
        p={3}
        className={className}
      >
        <VStack spacing={1} align="center">
          {/* Logo */}
          <Box
            w="40px"
            h="40px"
            bg="xBlue.500"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="xl"
            mb={4}
          >
            X
          </Box>

          {/* Navigation Items */}
          {navigationItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.label} label={item.label} placement="right">
                <Box position="relative">
                  <Button
                    variant="ghost"
                    size="lg"
                    w="48px"
                    h="48px"
                    p={0}
                    borderRadius="full"
                    color={item.isActive ? 'xBlue.500' : textColor}
                    bg={item.isActive ? 'xBlue.50' : 'transparent'}
                    _hover={{ bg: hoverBg }}
                    _dark={{
                      bg: item.isActive ? 'xBlue.900' : 'transparent',
                    }}
                  >
                    <Icon size={24} />
                  </Button>
                  {item.badge && (
                    <Badge
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="xs"
                      minW="20px"
                      h="20px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Box>
              </Tooltip>
            );
          })}

          {/* More Options */}
          <Tooltip label="More" placement="right">
            <Button
              variant="ghost"
              size="lg"
              w="48px"
              h="48px"
              p={0}
              borderRadius="full"
              color={textColor}
              _hover={{ bg: hoverBg }}
            >
              <MoreHorizontal size={24} />
            </Button>
          </Tooltip>

          {/* User Avatar */}
          <Box mt={4}>
            <Tooltip label={mockUser.displayName} placement="right">
              <Avatar
                size="md"
                name={mockUser.displayName}
                src={mockUser.avatar}
                variant={`political-${mockUser.politicalAlignment}`}
                cursor="pointer"
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.2s"
              />
            </Tooltip>
          </Box>

          {/* Dark Mode Toggle */}
          <Box mt={2}>
            <DarkModeToggle size="sm" />
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      w="275px"
      h="100vh"
      bg={bgColor}
      p={6}
      className={className}
    >
      <VStack spacing={6} align="stretch" h="full">
        {/* Logo */}
        <Flex align="center" gap={3}>
          <Box
            w="40px"
            h="40px"
            bg="xBlue.500"
            borderRadius="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="xl"
          >
            X
          </Box>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            AI Social
          </Text>
        </Flex>

        {/* Navigation Menu */}
        <NavigationMenu items={navigationItems} />

        {/* Post Button */}
        <Button
          variant="x-primary"
          size="x-lg"
          w="full"
          fontWeight="bold"
          fontSize="lg"
          h="52px"
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          }}
        >
          Post
        </Button>

        {/* Spacer */}
        <Box flex={1} />

        {/* User Profile Section */}
        <Box>
          <Divider mb={4} borderColor={borderColor} />

          {/* User Stats */}
          <Flex justify="space-between" mb={4}>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {formatNumber(mockUser.followers)}
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                Followers
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                {formatNumber(mockUser.following)}
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                Following
              </Text>
            </Box>
            <Box textAlign="center">
              <Badge variant={getInfluenceBadgeVariant(mockUser.influenceLevel)}>
                {mockUser.influenceLevel}
              </Badge>
            </Box>
          </Flex>

          {/* User Profile */}
          <Flex
            align="center"
            gap={3}
            p={3}
            borderRadius="16px"
            _hover={{ bg: hoverBg }}
            cursor="pointer"
            transition="background 0.2s"
          >
            <Avatar
              size="md"
              name={mockUser.displayName}
              src={mockUser.avatar}
              variant={`political-${mockUser.politicalAlignment}`}
            />
            <Box flex={1} minW={0}>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={textColor}
                isTruncated
              >
                {mockUser.displayName}
              </Text>
              <Text
                fontSize="sm"
                color={mutedTextColor}
                isTruncated
              >
                {mockUser.username}
              </Text>
            </Box>
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={getPoliticalColor(mockUser.politicalAlignment)}
              title={`Political alignment: ${mockUser.politicalAlignment}`}
            />
          </Flex>

          {/* Dark Mode Toggle */}
          <Flex justify="center" mt={4}>
            <DarkModeToggle />
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
}

export default Sidebar;