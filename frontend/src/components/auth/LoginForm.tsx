'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Checkbox,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/services/api';
import type { LoginForm as LoginFormData, User } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
  className?: string;
}

export function LoginForm({
  onSuccess,
  onError,
  redirectTo = '/dashboard',
  className,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post<{ user: User; token: string }>(
        '/auth/login',
        data
      );

      if (response.success && response.data) {
        // Store auth token
        localStorage.setItem('authToken', response.data.token);
        
        // Call success callback
        onSuccess?.(response.data.user);
        
        // Redirect if specified
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      className={className}
      bg={bgColor}
      p={8}
      rounded="2xl"
      shadow="x-lg"
      border="1px"
      borderColor={borderColor}
      maxW="md"
      w="full"
    >
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={textColor}
            className="text-gradient-x"
            mb={2}
          >
            Welcome Back
          </Text>
          <Text fontSize="sm" color="gray.500">
            Sign in to your AI Social account
          </Text>
        </Box>

        {errorMessage && (
          <Alert status="error" rounded="lg">
            <AlertIcon />
            <Text fontSize="sm">{errorMessage}</Text>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Email Address
              </FormLabel>
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                size="lg"
                rounded="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'gray.500'),
                }}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px rgb(59 130 246 / 0.5)',
                }}
                className="focus:shadow-political-glow"
              />
              {errors.email && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.email.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Password
              </FormLabel>
              <InputGroup size="lg">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  rounded="xl"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _hover={{
                    borderColor: useColorModeValue('gray.300', 'gray.500'),
                  }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px rgb(59 130 246 / 0.5)',
                  }}
                  className="focus:shadow-political-glow"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </FormControl>

            <FormControl>
              <Checkbox
                {...register('rememberMe')}
                size="sm"
                colorScheme="blue"
                className="political-checkbox"
              >
                <Text fontSize="sm" color="gray.600">
                  Remember me for 30 days
                </Text>
              </Checkbox>
            </FormControl>

            <Button
              type="submit"
              size="lg"
              w="full"
              isLoading={isLoading}
              isDisabled={!isValid}
              loadingText="Signing in..."
              leftIcon={<LogIn size={18} />}
              className="x-btn-primary"
              rounded="xl"
              bg="blue.500"
              color="white"
              _hover={{
                bg: 'blue.600',
                transform: 'translateY(-1px)',
                shadow: 'lg',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Box textAlign="center" pt={4}>
          <Text fontSize="sm" color="gray.500">
            Don't have an account?{' '}
            <Button
              variant="link"
              size="sm"
              color="blue.500"
              fontWeight="semibold"
              _hover={{ textDecoration: 'underline' }}
              onClick={() => {
                // Navigate to register - this would be handled by parent component
                console.log('Navigate to register');
              }}
            >
              Create account
            </Button>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default LoginForm;