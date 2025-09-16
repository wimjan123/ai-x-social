'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Shield, AlertTriangle, LogIn } from 'lucide-react';
import { apiClient } from '@/services/api';
import type { User } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
  onAuthStateChange?: (isAuthenticated: boolean, user?: User) => void;
  className?: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback,
  onAuthStateChange,
  className,
}: AuthGuardProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    onAuthStateChange?.(authState.isAuthenticated, authState.user || undefined);
  }, [authState.isAuthenticated, authState.user, onAuthStateChange]);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if auth token exists
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('authToken') 
        : null;

      if (!token) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: null,
        });
        return;
      }

      // Verify token with server
      const response = await apiClient.get<{ user: User }>('/auth/me');

      if (response.success && response.data) {
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: response.data.user,
          error: null,
        });
      } else {
        // Invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: 'Session expired',
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: 'Authentication failed',
      });
    }
  };

  const handleRetry = () => {
    checkAuthStatus();
  };

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  };

  // Loading state
  if (authState.isLoading) {
    return (
      <Box
        className={className}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="50vh"
        bg={bgColor}
      >
        <VStack spacing={4}>
          <Box
            p={4}
            bg={useColorModeValue('blue.50', 'blue.900')}
            rounded="full"
            className="animate-pulse-slow"
          >
            <Shield size={32} className="text-blue-600" />
          </Box>
          <Spinner
            size="lg"
            color="blue.500"
            thickness="3px"
            className="animate-spin"
          />
          <Text
            fontSize="sm"
            color={useColorModeValue('gray.600', 'gray.400')}
            textAlign="center"
          >
            Verifying authentication...
          </Text>
        </VStack>
      </Box>
    );
  }

  // Error state
  if (authState.error && requireAuth) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box
        className={className}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="50vh"
        p={4}
      >
        <Box
          bg={bgColor}
          p={8}
          rounded="xl"
          shadow="x-lg"
          border="1px"
          borderColor={borderColor}
          maxW="md"
          w="full"
        >
          <VStack spacing={6}>
            <Box
              p={4}
              bg={useColorModeValue('red.50', 'red.900')}
              rounded="full"
              className="animate-bounce-gentle"
            >
              <AlertTriangle size={32} className="text-red-600" />
            </Box>
            
            <VStack spacing={2} textAlign="center">
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Authentication Required
              </Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                {authState.error === 'Session expired'
                  ? 'Your session has expired. Please sign in again.'
                  : 'You need to be signed in to access this page.'}
              </Text>
            </VStack>

            <VStack spacing={3} w="full">
              <Button
                onClick={handleLogin}
                size="lg"
                w="full"
                leftIcon={<LogIn size={18} />}
                className="x-btn-primary"
                bg="blue.500"
                color="white"
                _hover={{
                  bg: 'blue.600',
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
              >
                Sign In
              </Button>
              
              {authState.error === 'Authentication failed' && (
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Retry
                </Button>
              )}
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

  // Unauthenticated but auth not required
  if (!authState.isAuthenticated && !requireAuth) {
    return <>{children}</>;
  }

  // Unauthenticated and auth required - redirect
  if (!authState.isAuthenticated && requireAuth) {
    if (typeof window !== 'undefined') {
      // Use setTimeout to avoid hydration issues
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 0);
    }
    
    return (
      <Box
        className={className}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="50vh"
      >
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          Redirecting to sign in...
        </Text>
      </Box>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}

// HOC version for easier component wrapping
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for accessing auth state in components
export function useAuthGuard() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' 
          ? localStorage.getItem('authToken') 
          : null;

        if (!token) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: null,
          });
          return;
        }

        const response = await apiClient.get<{ user: User }>('/auth/me');

        if (response.success && response.data) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: response.data.user,
            error: null,
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: 'Invalid session',
          });
        }
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: 'Authentication failed',
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}

export default AuthGuard;