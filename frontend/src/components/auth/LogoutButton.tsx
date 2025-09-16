'use client';

import { useState } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useColorModeValue,
  HStack,
  Text,
  Box,
} from '@chakra-ui/react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useRef } from 'react';
import { apiClient } from '@/services/api';

interface LogoutButtonProps {
  onLogout?: () => void;
  variant?: 'button' | 'menu-item' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showConfirmation?: boolean;
  className?: string;
}

export function LogoutButton({
  onLogout,
  variant = 'button',
  size = 'md',
  showConfirmation = true,
  className,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // Call logout API endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Continue with local logout even if API fails
    }

    // Clear local auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.clear();
    }

    // Call success callback
    onLogout?.();

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    setIsLoading(false);
    onClose();
  };

  const handleClick = () => {
    if (showConfirmation) {
      onOpen();
    } else {
      handleLogout();
    }
  };

  const renderButton = () => {
    const commonProps = {
      onClick: handleClick,
      isLoading,
      loadingText: 'Signing out...',
      className,
    };

    switch (variant) {
      case 'icon':
        return (
          <Button
            {...commonProps}
            variant="ghost"
            size={size}
            aria-label="Sign out"
            className={`x-btn-ghost transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 ${className}`}
            _hover={{
              bg: useColorModeValue('red.50', 'red.900'),
              color: 'red.500',
            }}
          >
            <LogOut size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          </Button>
        );

      case 'menu-item':
        return (
          <Button
            {...commonProps}
            variant="ghost"
            size={size}
            w="full"
            justifyContent="flex-start"
            leftIcon={<LogOut size={16} />}
            className={`text-left transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 ${className}`}
            _hover={{
              bg: useColorModeValue('red.50', 'red.900'),
              color: 'red.500',
            }}
          >
            Sign Out
          </Button>
        );

      case 'button':
      default:
        return (
          <Button
            {...commonProps}
            variant="outline"
            size={size}
            leftIcon={<LogOut size={16} />}
            borderColor="red.300"
            color="red.600"
            className={`transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
            _hover={{
              bg: 'red.50',
              borderColor: 'red.400',
              color: 'red.700',
              transform: 'translateY(-1px)',
              shadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
          >
            Sign Out
          </Button>
        );
    }
  };

  return (
    <>
      {renderButton()}

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay className="backdrop-blur-sm">
          <AlertDialogContent
            bg={bgColor}
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            rounded="xl"
            shadow="x-lg"
            mx={4}
          >
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color={textColor}
              pb={2}
            >
              <HStack spacing={3}>
                <Box
                  p={2}
                  bg={useColorModeValue('red.100', 'red.900')}
                  rounded="lg"
                  className="animate-pulse-slow"
                >
                  <AlertTriangle size={20} className="text-red-600" />
                </Box>
                <Text>Confirm Sign Out</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody color={useColorModeValue('gray.600', 'gray.400')}>
              <Text>
                Are you sure you want to sign out? You'll need to sign in again
                to access your account and continue political discussions.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="outline"
                size={size}
                className="transition-all duration-200"
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.700'),
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                isLoading={isLoading}
                loadingText="Signing out..."
                size={size}
                bg="red.500"
                color="white"
                className="transition-all duration-200 hover:-translate-y-0.5"
                _hover={{
                  bg: 'red.600',
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
              >
                Sign Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default LogoutButton;