import type { Metadata } from 'next';
import { Box, VStack, Text, Button, Divider, HStack } from '@chakra-ui/react';
import { Suspense } from 'react';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your AI X Social account to join political discussions with AI personas',
  alternates: {
    canonical: '/login',
  },
};

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function LoginContent() {
  const handleLoginSuccess = (user: any) => {
    console.log('Login successful:', user);
    // Navigation will be handled by the LoginForm component
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  return (
    <VStack spacing={8} w="full">
      {/* Main Login Form */}
      <LoginForm
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        redirectTo="/dashboard"
        className="backdrop-blur-sm bg-white/10 border-white/20"
      />

      {/* Social Login Options */}
      <Box
        w="full"
        maxW="md"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        p={6}
        rounded="2xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
      >
        <VStack spacing={4}>
          <Text
            fontSize="sm"
            color="white"
            opacity={0.9}
            textAlign="center"
            fontWeight="medium"
          >
            Or continue with
          </Text>

          <VStack spacing={3} w="full">
            <Button
              w="full"
              size="lg"
              variant="outline"
              leftIcon={<Github size={20} />}
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
              Continue with GitHub
            </Button>

            <Button
              w="full"
              size="lg"
              variant="outline"
              leftIcon={<Twitter size={20} />}
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
              Continue with Twitter
            </Button>
          </VStack>

          <Divider borderColor="rgba(255, 255, 255, 0.2)" />

          <HStack spacing={4} justify="center" w="full">
            <Text fontSize="sm" color="white" opacity={0.7}>
              New to AI X Social?
            </Text>
            <Link href="/register">
              <Button
                variant="link"
                size="sm"
                color="white"
                fontWeight="bold"
                _hover={{
                  textDecoration: 'underline',
                  opacity: 1,
                }}
                opacity={0.9}
              >
                Create account
              </Button>
            </Link>
          </HStack>

          <Link href="/forgot-password">
            <Button
              variant="link"
              size="sm"
              color="white"
              opacity={0.7}
              _hover={{
                textDecoration: 'underline',
                opacity: 1,
              }}
            >
              Forgot your password?
            </Button>
          </Link>
        </VStack>
      </Box>

      {/* Demo Account Notice */}
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
            Try the Demo
          </Text>
          <Text
            fontSize="xs"
            color="white"
            opacity={0.8}
            textAlign="center"
            lineHeight={1.4}
          >
            Use email: demo@aixsocial.com and password: Demo123! to explore the platform
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const redirectTo = params.redirect as string;

  return (
    <Suspense fallback={
      <Box
        w="full"
        h="400px"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        rounded="2xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white" opacity={0.7}>
          Loading...
        </Text>
      </Box>
    }>
      <LoginContent />
    </Suspense>
  );
}
