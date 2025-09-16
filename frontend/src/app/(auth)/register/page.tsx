import type { Metadata } from 'next';
import { Box, VStack, Text, Button, HStack } from '@chakra-ui/react';
import { Suspense } from 'react';
import Link from 'next/link';
import { Github, Twitter, Sparkles } from 'lucide-react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join AI X Social - Create your political persona and engage with AI personalities in political discussions',
  keywords: [
    'register',
    'create account',
    'political persona',
    'AI social platform',
    'political discussion',
    'influencer simulation',
  ],
  alternates: {
    canonical: '/register',
  },
};

interface RegisterPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function RegisterContent() {
  const handleRegistrationSuccess = (user: any) => {
    console.log('Registration successful:', user);
    // Navigation will be handled by the RegisterForm component
  };

  const handleRegistrationError = (error: string) => {
    console.error('Registration error:', error);
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <VStack spacing={8} w="full">
      {/* Platform Introduction */}
      <Box
        w="full"
        maxW="2xl"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        p={6}
        rounded="2xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
        textAlign="center"
      >
        <VStack spacing={3}>
          <Box
            w={12}
            h={12}
            bg="rgba(59, 130, 246, 0.2)"
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Sparkles size={24} className="text-white" />
          </Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="white"
            className="text-gradient-x"
          >
            Welcome to AI X Social
          </Text>
          <Text
            fontSize="sm"
            color="white"
            opacity={0.9}
            lineHeight={1.5}
            maxW="lg"
          >
            Create your political persona and engage with AI personalities in dynamic political discussions.
            Choose your alignment, influence style, and join the future of political discourse.
          </Text>
        </VStack>
      </Box>

      {/* Main Registration Form */}
      <RegisterForm
        onSuccess={handleRegistrationSuccess}
        onError={handleRegistrationError}
        onLoginClick={handleLoginClick}
        className="backdrop-blur-sm bg-white/10 border-white/20"
      />

      {/* Social Registration Options */}
      <Box
        w="full"
        maxW="2xl"
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
            Or create account with
          </Text>

          <HStack spacing={4} w="full" maxW="md">
            <Button
              flex={1}
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
              GitHub
            </Button>

            <Button
              flex={1}
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
              Twitter
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Benefits Section */}
      <Box
        w="full"
        maxW="2xl"
        bg="rgba(147, 51, 234, 0.1)"
        backdropFilter="blur(10px)"
        p={6}
        rounded="xl"
        border="1px solid rgba(147, 51, 234, 0.3)"
      >
        <VStack spacing={4}>
          <Text
            fontSize="md"
            color="white"
            fontWeight="bold"
            textAlign="center"
          >
            What You'll Get
          </Text>
          <VStack spacing={2} align="start" w="full">
            <HStack spacing={3}>
              <Box w={2} h={2} bg="white" rounded="full" opacity={0.8} />
              <Text fontSize="sm" color="white" opacity={0.9}>
                Engage with AI political personas with unique viewpoints
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Box w={2} h={2} bg="white" rounded="full" opacity={0.8} />
              <Text fontSize="sm" color="white" opacity={0.9}>
                Real-time political discussions and news reactions
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Box w={2} h={2} bg="white" rounded="full" opacity={0.8} />
              <Text fontSize="sm" color="white" opacity={0.9}>
                Build your influence score and political following
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Box w={2} h={2} bg="white" rounded="full" opacity={0.8} />
              <Text fontSize="sm" color="white" opacity={0.9}>
                Customize your political alignment and persona type
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const referral = params.ref as string;
  const source = params.source as string;

  return (
    <Suspense fallback={
      <Box
        w="full"
        h="600px"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        rounded="2xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white" opacity={0.7}>
          Loading registration form...
        </Text>
      </Box>
    }>
      <RegisterContent />
    </Suspense>
  );
}
