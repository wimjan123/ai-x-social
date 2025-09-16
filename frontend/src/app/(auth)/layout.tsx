import type { Metadata } from 'next';
import { Box, Container, Flex, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | AI X Social',
    default: 'Authentication | AI X Social',
  },
  description: 'Sign in or create your account to join the AI-powered political discussion platform',
  keywords: ['login', 'register', 'authentication', 'AI social', 'political discussion'],
  robots: 'noindex, nofollow',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      minH="100vh"
      bg={{
        base: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 100%)',
        _dark: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(15, 23, 42) 100%)',
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Background decorations */}
      <Box
        position="absolute"
        top="-50%"
        right="-20%"
        w="80%"
        h="80%"
        bg="rgba(255, 255, 255, 0.1)"
        rounded="full"
        filter="blur(40px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-30%"
        left="-20%"
        w="60%"
        h="60%"
        bg="rgba(255, 255, 255, 0.05)"
        rounded="full"
        filter="blur(30px)"
        pointerEvents="none"
      />

      <Container maxW="7xl" h="100vh" py={8}>
        <Flex direction="column" h="full">
          {/* Header */}
          <Flex justify="space-between" align="center" mb={8}>
            <Link href="/">
              <Box
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                className="text-gradient-x"
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                transition="opacity 0.2s"
              >
                AI X Social
              </Box>
            </Link>

            <Box
              px={4}
              py={2}
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              rounded="full"
              border="1px solid rgba(255, 255, 255, 0.2)"
            >
              <Box fontSize="sm" color="white" opacity={0.9}>
                Political Discussion Platform
              </Box>
            </Box>
          </Flex>

          {/* Main Content */}
          <Flex flex={1} align="center" justify="center">
            <Box
              w="full"
              maxW="lg"
              position="relative"
              zIndex={1}
            >
              {children}
            </Box>
          </Flex>

          {/* Footer */}
          <Flex
            justify="center"
            align="center"
            mt={8}
            gap={6}
            color="white"
            opacity={0.7}
            fontSize="sm"
          >
            <Link href="/privacy">
              <Box cursor="pointer" _hover={{ opacity: 1 }} transition="opacity 0.2s">
                Privacy Policy
              </Box>
            </Link>
            <Box>•</Box>
            <Link href="/terms">
              <Box cursor="pointer" _hover={{ opacity: 1 }} transition="opacity 0.2s">
                Terms of Service
              </Box>
            </Link>
            <Box>•</Box>
            <Link href="/help">
              <Box cursor="pointer" _hover={{ opacity: 1 }} transition="opacity 0.2s">
                Help
              </Box>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
