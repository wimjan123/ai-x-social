'use client';

import {
  Box,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { cn } from '@/lib/design-system';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      className={cn(
        'border rounded-2xl overflow-hidden',
        className
      )}
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
    >
      <Box p={6} borderBottom="1px" borderColor={borderColor}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue('gray.900', 'white')}
          mb={description ? 2 : 0}
        >
          {title}
        </Text>
        {description && (
          <Text
            fontSize="sm"
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            {description}
          </Text>
        )}
      </Box>

      <Box p={6}>
        <VStack spacing={6} align="stretch">
          {children}
        </VStack>
      </Box>
    </Box>
  );
}

export default SettingsSection;