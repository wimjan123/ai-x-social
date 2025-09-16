'use client';

import type { Metadata } from 'next';
import {
  Box,
  VStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/services/api';

// Note: This would normally be in the parent component or layout,
// but for this client component we'll handle metadata separately

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiClient.post('/auth/forgot-password', data);

      if (response.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send reset email';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      await apiClient.post('/auth/forgot-password', { email });
      // Success feedback would be shown here
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to resend email';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <VStack spacing={8} w="full">
        {/* Success State */}
        <Box
          w="full"
          maxW="md"
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          p={8}
          rounded="2xl"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <VStack spacing={6} textAlign="center">
            <Box
              w={16}
              h={16}
              bg="rgba(34, 197, 94, 0.2)"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="animate-bounce-gentle"
            >
              <CheckCircle size={32} className="text-green-400" />
            </Box>

            <VStack spacing={3}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="white"
                className="text-gradient-x"
              >
                Check Your Email
              </Text>
              <Text
                fontSize="sm"
                color="white"
                opacity={0.9}
                lineHeight={1.5}
              >
                We've sent a password reset link to{' '}              <Text as="span" fontWeight="semibold">
                  {getValues('email')}
                </Text>
                . Click the link in the email to reset your password.
              </Text>
            </VStack>

            <VStack spacing={3} w="full">
              <Text fontSize="xs" color="white" opacity={0.7}>
                Didn't receive the email?
              </Text>
              <HStack spacing={2}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendEmail}
                  isLoading={isLoading}
                  loadingText="Sending..."
                  bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  }}
                  rounded="lg"
                >
                  Resend Email
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  color="white"
                  opacity={0.8}
                  _hover={{ opacity: 1 }}
                  onClick={() => setIsSuccess(false)}
                >
                  Try Different Email
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Back to Login */}
        <Link href="/login">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.3)"
            _hover={{
              bg: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-1px)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            rounded="xl"
          >
            Back to Sign In
          </Button>
        </Link>
      </VStack>
    );
  }

  return (
    <VStack spacing={8} w="full">
      {/* Main Reset Form */}
      <Box
        w="full"
        maxW="md"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        p={8}
        rounded="2xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Box
              w={12}
              h={12}
              bg="rgba(59, 130, 246, 0.2)"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <Mail size={24} className="text-blue-400" />
            </Box>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              className="text-gradient-x"
              mb={2}
            >
              Reset Your Password
            </Text>
            <Text fontSize="sm" color="white" opacity={0.9} lineHeight={1.5}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </Box>

          {errorMessage && (
            <Alert status="error" rounded="lg" bg="rgba(220, 38, 38, 0.1)" border="1px solid rgba(220, 38, 38, 0.3)">
              <AlertIcon color="red.400" />
              <Text fontSize="sm" color="red.400">
                {errorMessage}
              </Text>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm" fontWeight="medium" color="white" opacity={0.9}>
                  Email Address
                </FormLabel>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email address"
                  size="lg"
                  rounded="xl"
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                  color="white"
                  _placeholder={{
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                  _hover={{
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  }}
                  _focus={{
                    borderColor: 'rgb(59, 130, 246)',
                    boxShadow: '0 0 0 1px rgb(59 130 246 / 0.5)',
                    bg: 'rgba(255, 255, 255, 0.15)',
                  }}
                />
                {errors.email && (
                  <Text fontSize="xs" color="red.400" mt={1}>
                    {errors.email.message}
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                size="lg"
                w="full"
                isLoading={isLoading}
                isDisabled={!isValid}
                loadingText="Sending reset link..."
                leftIcon={<Mail size={18} />}
                bg="rgb(59, 130, 246)"
                color="white"
                _hover={{
                  bg: 'rgb(37, 99, 235)',
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
                rounded="xl"
                className="x-btn-primary"
              >
                Send Reset Link
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>

      {/* Help Text */}
      <Box
        w="full"
        maxW="md"
        bg="rgba(59, 130, 246, 0.1)"
        backdropFilter="blur(10px)"
        p={4}
        rounded="xl"
        border="1px solid rgba(59, 130, 246, 0.3)"
      >
        <VStack spacing={2}>
          <Text
            fontSize="sm"
            color="white"
            fontWeight="medium"
            textAlign="center"
          >
            Having trouble?
          </Text>
          <Text
            fontSize="xs"
            color="white"
            opacity={0.8}
            textAlign="center"
            lineHeight={1.4}
          >
            Make sure to check your spam folder. If you still don't receive the email,
            contact our support team for assistance.
          </Text>
        </VStack>
      </Box>

      {/* Navigation */}
      <HStack spacing={4}>
        <Link href="/login">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.3)"
            _hover={{
              bg: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              transform: 'translateY(-1px)',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            rounded="xl"
          >
            Back to Sign In
          </Button>
        </Link>

        <Link href="/register">
          <Button
            variant="link"
            size="sm"
            color="white"
            opacity={0.8}
            _hover={{
              textDecoration: 'underline',
              opacity: 1,
            }}
          >
            Create new account
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
}
