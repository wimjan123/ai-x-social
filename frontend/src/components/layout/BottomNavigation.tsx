'use client';

import {
  Box,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  VStack,
  Text,
} from '@chakra-ui/react';
import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  Plus,
  Hash,
  TrendingUp,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { NavigationMenu } from './NavigationMenu';

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Theme colors
  const bgColor = useColorModeValue('white', 'x.600');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('x.500', 'x.100');
  const activeColor = useColorModeValue('xBlue.500', 'xBlue.400');

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      badge: 0,
    },
    {
      icon: Search,
      label: 'Explore',
      href: '/explore',
      badge: 0,
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
      icon: User,
      label: 'Profile',
      href: '/profile',
      badge: 0,
    },
  ];

  const handleCompose = () => {
    // Open compose modal or navigate to compose page
    router.push('/compose');
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      zIndex={20}
      h="64px"
      className={className}
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      _dark={{
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Flex align="center" justify="space-around" h="100%" px={2}>
        {/* Navigation Items */}
        <NavigationMenu
          items={navigationItems}
          orientation="horizontal"
          className="flex-1"
        />

        {/* Compose Button */}
        <Box position="relative" mx={2}>
          <IconButton
            aria-label="Compose post"
            icon={<Plus size={24} />}
            onClick={handleCompose}
            size="lg"
            variant="x-primary"
            borderRadius="full"
            w="56px"
            h="56px"
            position="relative"
            top="-8px"
            boxShadow="lg"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
            }}
            _active={{
              transform: 'scale(0.95)',
            }}
            transition="all 0.2s ease-in-out"
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default BottomNavigation;