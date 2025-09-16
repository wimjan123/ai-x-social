'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  Button,
  useColorModeValue,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  User,
  Shield,
  Bell,
  Bot,
  Palette,
  Lock,
  Settings as SettingsIcon,
  Menu,
} from 'lucide-react';
import { cn, getAnimationClasses } from '@/lib/design-system';

export type SettingsTab =
  | 'general'
  | 'privacy'
  | 'notifications'
  | 'ai'
  | 'display'
  | 'security';

interface SettingsLayoutProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  children: React.ReactNode;
}

interface SettingsNavItem {
  id: SettingsTab;
  label: string;
  icon: typeof User;
  description: string;
}

const settingsNavItems: SettingsNavItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: User,
    description: 'Basic account and profile settings',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: Shield,
    description: 'Control who can see your content',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Manage email and push notifications',
  },
  {
    id: 'ai',
    label: 'AI Settings',
    icon: Bot,
    description: 'AI interaction preferences',
  },
  {
    id: 'display',
    label: 'Display',
    icon: Palette,
    description: 'Theme, language, and appearance',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    description: 'Password and security options',
  },
];

function SettingsNavigation({
  activeTab,
  onTabChange,
  onClose,
}: {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onClose?: () => void;
}) {
  const animations = getAnimationClasses();

  return (
    <VStack spacing={2} align="stretch">
      {settingsNavItems.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <Button
            key={item.id}
            variant="ghost"
            justifyContent="flex-start"
            h="auto"
            p={4}
            className={cn(
              'group relative',
              isActive && 'bg-x-blue/10 text-x-blue dark:bg-x-blue/20',
              !isActive && 'hover:bg-gray-50 dark:hover:bg-gray-800',
              animations.fadeIn
            )}
            onClick={() => {
              onTabChange(item.id);
              onClose?.();
            }}
            position="relative"
          >
            {isActive && (
              <Box
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                w="3px"
                bg="blue.500"
                borderRadius="0 2px 2px 0"
              />
            )}

            <Flex align="center" w="full">
              <Icon
                as={item.icon}
                w={5}
                h={5}
                mr={3}
                color={isActive ? 'blue.500' : 'gray.500'}
                _groupHover={{
                  color: isActive ? 'blue.600' : 'gray.700',
                }}
              />

              <VStack align="flex-start" spacing={0} flex={1}>
                <Text
                  fontSize="sm"
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  color={isActive ? 'blue.500' : useColorModeValue('gray.900', 'white')}
                  _groupHover={{
                    color: isActive ? 'blue.600' : useColorModeValue('gray.900', 'white'),
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  fontSize="xs"
                  color={useColorModeValue('gray.600', 'gray.400')}
                  textAlign="left"
                >
                  {item.description}
                </Text>
              </VStack>
            </Flex>
          </Button>
        );
      })}
    </VStack>
  );
}

export function SettingsLayout({
  activeTab,
  onTabChange,
  children,
}: SettingsLayoutProps) {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const animations = getAnimationClasses();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom="1px"
        borderColor={borderColor}
        p={4}
        className={animations.slideDown}
      >
        <Flex align="center" maxW="7xl" mx="auto">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              mr={3}
              onClick={onOpen}
              leftIcon={<Menu size={18} />}
            >
              Menu
            </Button>
          )}

          <Icon as={SettingsIcon} w={6} h={6} mr={3} color="blue.500" />
          <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.900', 'white')}>
            Settings
          </Text>
        </Flex>
      </Box>

      <Flex maxW="7xl" mx="auto" h="calc(100vh - 73px)">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            w="280px"
            bg={sidebarBg}
            borderRight="1px"
            borderColor={borderColor}
            p={6}
            overflowY="auto"
            className={animations.slideInRight}
          >
            <SettingsNavigation
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Settings</DrawerHeader>
            <DrawerBody p={6}>
              <SettingsNavigation
                activeTab={activeTab}
                onTabChange={onTabChange}
                onClose={onClose}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <Box
          flex={1}
          p={6}
          overflowY="auto"
          className={animations.fadeIn}
        >
          <Box maxW="2xl">
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default SettingsLayout;