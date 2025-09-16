'use client';

import {
  Box,
  Container,
  Flex,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
  showRightSidebar?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  showRightSidebar = true,
  className = '',
}: MainLayoutProps) {
  // Responsive breakpoints
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Theme colors
  const bgColor = useColorModeValue('white', 'x.600');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      className={`relative ${className}`}
    >
      {/* Mobile Header */}
      {isMobile && <Header />}

      <Flex direction="row" minH="100vh">
        {/* Left Sidebar - Hidden on mobile */}
        {(isDesktop || isTablet) && (
          <Box
            w={isDesktop ? '275px' : '88px'}
            position="fixed"
            left={0}
            top={0}
            bottom={0}
            bg={bgColor}
            borderRight="1px solid"
            borderColor={borderColor}
            zIndex={10}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: borderColor,
                borderRadius: '3px',
              },
            }}
          >
            <Sidebar isCollapsed={isTablet} />
          </Box>
        )}

        {/* Main Content Area */}
        <Flex
          flex={1}
          ml={isDesktop ? '275px' : isTablet ? '88px' : 0}
          mr={isDesktop && showRightSidebar ? '350px' : 0}
          direction="column"
          minH="100vh"
          pt={isMobile ? '60px' : 0}
          pb={isMobile ? '64px' : 0}
        >
          {/* Desktop Header */}
          {!isMobile && <Header />}

          {/* Main Feed */}
          <Box
            flex={1}
            maxW={isDesktop ? '600px' : '100%'}
            w="100%"
            borderLeft={isDesktop ? '1px solid' : 'none'}
            borderRight={isDesktop ? '1px solid' : 'none'}
            borderColor={borderColor}
            bg={bgColor}
            position="relative"
          >
            {children}
          </Box>
        </Flex>

        {/* Right Sidebar - Desktop only */}
        {isDesktop && showRightSidebar && (
          <Box
            w="350px"
            position="fixed"
            right={0}
            top={0}
            bottom={0}
            bg={bgColor}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: borderColor,
                borderRadius: '3px',
              },
            }}
          >
            <RightSidebar />
          </Box>
        )}
      </Flex>

      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNavigation />}
    </Box>
  );
}

export default MainLayout;