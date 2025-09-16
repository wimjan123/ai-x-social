'use client';

import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Avatar,
  HStack,
  useColorModeValue,
  useBreakpointValue,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import {
  Bell,
  Mail,
  Settings,
  User,
  LogOut,
  ArrowLeft,
  MoreHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchBar } from './SearchBar';
import DarkModeToggle from '../ui/DarkModeToggle';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  className?: string;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  politicalAlignment: 'conservative' | 'liberal' | 'progressive' | 'moderate';
  influenceLevel: 'minimal' | 'emerging' | 'rising' | 'influential' | 'viral';
  isAuthenticated: boolean;
}

// Mock user data - would come from auth context
const mockUser: UserProfile = {
  id: '1',
  username: '@johndoe',
  displayName: 'John Doe',
  avatar: '',
  politicalAlignment: 'moderate',
  influenceLevel: 'rising',
  isAuthenticated: true,
};

export function Header({
  title,
  showBackButton = false,
  showSearch = true,
  className = '',
}: HeaderProps) {
  const router = useRouter();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  // Theme colors
  const bgColor = useColorModeValue('white', 'x.600');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('x.500', 'x.100');

  const handleBack = () => {
    router.back();
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleMessages = () => {
    router.push('/messages');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleSignOut = () => {
    // Handle sign out logic
    console.log('Sign out');
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  if (isMobile) {
    // Mobile Header
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bg={bgColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        zIndex={20}
        h="60px"
        className={className}
      >
        <Flex align="center" justify="space-between" h="100%" px={4}>
          {/* Left side */}
          <Flex align="center" gap={2}>
            {showBackButton ? (
              <IconButton
                aria-label="Go back"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                size="sm"
                onClick={handleBack}
              />
            ) : (
              <Avatar
                size="sm"
                name={mockUser.isAuthenticated ? mockUser.displayName : 'Guest'}
                src={mockUser.avatar}
                variant={mockUser.isAuthenticated ? `political-${mockUser.politicalAlignment}` : undefined}
                cursor="pointer"
                onClick={handleProfile}
              />
            )}
          </Flex>

          {/* Center */}
          <Box flex={1} textAlign="center">
            {title ? (
              <Text fontSize="lg" fontWeight="bold" color={textColor} isTruncated>
                {title}
              </Text>
            ) : (
              <Text fontSize="lg" fontWeight="bold" color="xBlue.500">
                AI Social
              </Text>
            )}
          </Box>

          {/* Right side */}
          <HStack spacing={1}>
            <DarkModeToggle size="sm" />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="More options"
                icon={<MoreHorizontal size={18} />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                {mockUser.isAuthenticated ? (
                  <>
                    <MenuItem icon={<Bell size={16} />} onClick={handleNotifications}>
                      Notifications
                    </MenuItem>
                    <MenuItem icon={<Mail size={16} />} onClick={handleMessages}>
                      Messages
                    </MenuItem>
                    <MenuItem icon={<User size={16} />} onClick={handleProfile}>
                      Profile
                    </MenuItem>
                    <MenuItem icon={<Settings size={16} />} onClick={handleSettings}>
                      Settings
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
                      Sign Out
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
                    <MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>
    );
  }

  // Desktop/Tablet Header
  return (
    <Box
      position="sticky"
      top={0}
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      zIndex={20}
      h={isDesktop ? "0" : "60px"} // Hidden on desktop when sidebar is present
      className={className}
    >
      {!isDesktop && (
        <Flex align="center" justify="space-between" h="100%" px={6}>
          {/* Left side */}
          <Flex align="center" gap={4}>
            {showBackButton && (
              <IconButton
                aria-label="Go back"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                size="md"
                onClick={handleBack}
              />
            )}

            {title ? (
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {title}
              </Text>
            ) : (
              <Flex align="center" gap={3}>
                <Box
                  w="32px"
                  h="32px"
                  bg="xBlue.500"
                  borderRadius="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  X
                </Box>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  AI Social
                </Text>
              </Flex>
            )}
          </Flex>

          {/* Center - Search */}
          {showSearch && (
            <Box flex={1} maxW="400px" mx={8}>
              <SearchBar placeholder="Search AI Social" size="md" showModal />
            </Box>
          )}

          {/* Right side */}
          <HStack spacing={2}>
            {mockUser.isAuthenticated ? (
              <>
                <IconButton
                  aria-label="Notifications"
                  icon={<Bell size={20} />}
                  variant="ghost"
                  size="md"
                  position="relative"
                  onClick={handleNotifications}
                >
                  <Badge
                    position="absolute"
                    top="6px"
                    right="6px"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                    minW="18px"
                    h="18px"
                  >
                    3
                  </Badge>
                </IconButton>

                <IconButton
                  aria-label="Messages"
                  icon={<Mail size={20} />}
                  variant="ghost"
                  size="md"
                  position="relative"
                  onClick={handleMessages}
                >
                  <Badge
                    position="absolute"
                    top="6px"
                    right="6px"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                    minW="18px"
                    h="18px"
                  >
                    12
                  </Badge>
                </IconButton>

                <DarkModeToggle />

                <Menu>
                  <MenuButton>
                    <Avatar
                      size="md"
                      name={mockUser.displayName}
                      src={mockUser.avatar}
                      variant={`political-${mockUser.politicalAlignment}`}
                      cursor="pointer"
                      _hover={{ transform: 'scale(1.05)' }}
                      transition="transform 0.2s"
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<User size={16} />} onClick={handleProfile}>
                      Profile
                    </MenuItem>
                    <MenuItem icon={<Settings size={16} />} onClick={handleSettings}>
                      Settings
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<LogOut size={16} />} onClick={handleSignOut}>
                      Sign Out
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <DarkModeToggle />
                <Button variant="x-secondary" size="x-md" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button variant="x-primary" size="x-md" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      )}
    </Box>
  );
}