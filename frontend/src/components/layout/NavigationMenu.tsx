'use client';

import {
  VStack,
  Button,
  Flex,
  Text,
  Badge,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: number;
  isNew?: boolean;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  isCollapsed?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function NavigationMenu({
  items,
  isCollapsed = false,
  orientation = 'vertical',
  className = '',
}: NavigationMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Theme colors
  const textColor = useColorModeValue('x.500', 'x.100');
  const mutedTextColor = useColorModeValue('x.300', 'x.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const activeBg = useColorModeValue('xBlue.50', 'xBlue.900');
  const activeColor = useColorModeValue('xBlue.500', 'xBlue.400');

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const formatBadgeNumber = (num: number) => {
    if (num > 99) return '99+';
    return num.toString();
  };

  const Container = orientation === 'vertical' ? VStack : Flex;
  const containerProps = orientation === 'vertical'
    ? { spacing: 2, align: 'stretch' }
    : { gap: 2, wrap: 'wrap' as const, justify: 'space-around' };

  return (
    <Container {...containerProps} className={className}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.isActive || isActiveRoute(item.href);

        if (isCollapsed && orientation === 'vertical') {
          // Collapsed vertical menu (sidebar)
          return (
            <Box key={item.label} position="relative">
              <Button
                variant="ghost"
                size="lg"
                w="56px"
                h="56px"
                p={0}
                borderRadius="16px"
                color={isActive ? activeColor : textColor}
                bg={isActive ? activeBg : 'transparent'}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  transform: 'scale(1.05)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                onClick={() => handleNavigation(item.href)}
                transition="all 0.2s ease-in-out"
                title={item.label}
              >
                <Icon size={24} />
              </Button>

              {/* Badge */}
              {item.badge && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="xs"
                  minW="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 0 0 2px white"
                  _dark={{
                    boxShadow: '0 0 0 2px var(--chakra-colors-gray-800)',
                  }}
                >
                  {formatBadgeNumber(item.badge)}
                </Badge>
              )}

              {/* New indicator */}
              {item.isNew && (
                <Box
                  position="absolute"
                  top="2px"
                  right="2px"
                  w="8px"
                  h="8px"
                  bg="green.400"
                  borderRadius="full"
                  boxShadow="0 0 0 2px white"
                  _dark={{
                    boxShadow: '0 0 0 2px var(--chakra-colors-gray-800)',
                  }}
                />
              )}
            </Box>
          );
        }

        if (orientation === 'horizontal') {
          // Horizontal menu (bottom navigation)
          return (
            <Box key={item.label} position="relative" flex={1}>
              <Button
                variant="ghost"
                size="lg"
                w="full"
                h="52px"
                flexDirection="column"
                gap={1}
                p={2}
                color={isActive ? activeColor : textColor}
                bg={isActive ? activeBg : 'transparent'}
                _hover={{
                  bg: isActive ? activeBg : hoverBg,
                  transform: 'translateY(-1px)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                onClick={() => handleNavigation(item.href)}
                transition="all 0.2s ease-in-out"
              >
                <Box position="relative">
                  <Icon size={20} />
                  {item.badge && (
                    <Badge
                      position="absolute"
                      top="-6px"
                      right="-6px"
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="xs"
                      minW="16px"
                      h="16px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {formatBadgeNumber(item.badge)}
                    </Badge>
                  )}
                </Box>
                <Text
                  fontSize="xs"
                  fontWeight={isActive ? 'semibold' : 'normal'}
                  lineHeight="1"
                  color={isActive ? activeColor : mutedTextColor}
                >
                  {item.label}
                </Text>
              </Button>

              {/* New indicator for horizontal */}
              {item.isNew && (
                <Box
                  position="absolute"
                  top="6px"
                  right="50%"
                  transform="translateX(12px)"
                  w="6px"
                  h="6px"
                  bg="green.400"
                  borderRadius="full"
                />
              )}
            </Box>
          );
        }

        // Full vertical menu (default sidebar)
        return (
          <Box key={item.label} position="relative">
            <Button
              variant="ghost"
              size="lg"
              w="full"
              h="56px"
              justifyContent="flex-start"
              px={4}
              borderRadius="28px"
              color={isActive ? activeColor : textColor}
              bg={isActive ? activeBg : 'transparent'}
              fontWeight={isActive ? 'bold' : 'normal'}
              _hover={{
                bg: isActive ? activeBg : hoverBg,
                transform: 'translateX(2px)',
              }}
              _active={{
                transform: 'translateX(0)',
              }}
              onClick={() => handleNavigation(item.href)}
              transition="all 0.2s ease-in-out"
            >
              <Flex align="center" gap={4} flex={1}>
                <Icon size={24} />
                <Text fontSize="lg" flex={1}>
                  {item.label}
                </Text>

                {/* Badge in full menu */}
                {item.badge && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                    minW="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {formatBadgeNumber(item.badge)}
                  </Badge>
                )}

                {/* New indicator in full menu */}
                {item.isNew && (
                  <Box
                    w="8px"
                    h="8px"
                    bg="green.400"
                    borderRadius="full"
                  />
                )}
              </Flex>
            </Button>
          </Box>
        );
      })}
    </Container>
  );
}

export default NavigationMenu;