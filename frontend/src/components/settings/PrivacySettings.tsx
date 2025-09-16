'use client';

import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Switch,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Alert,
  AlertIcon,
  useColorModeValue,
  useToast,
  Box,
  Badge,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Shield, Eye, Users, Lock } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { apiClient } from '@/services/api';
import type { UserSettings, SettingsUpdateForm } from '@/types';

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE']),
  allowPersonaInteractions: z.boolean(),
  allowDataForAI: z.boolean(),
});

interface PrivacySettingsProps {
  settings: UserSettings | null;
  onSettingsUpdate: (settings: UserSettings) => void;
}

const VISIBILITY_OPTIONS = [
  {
    value: 'PUBLIC',
    label: 'Public',
    description: 'Anyone can see your profile and posts',
    icon: Eye,
    color: 'green',
  },
  {
    value: 'FOLLOWERS_ONLY',
    label: 'Followers Only',
    description: 'Only people you follow back can see your posts',
    icon: Users,
    color: 'yellow',
  },
  {
    value: 'PRIVATE',
    label: 'Private',
    description: 'Only approved followers can see your content',
    icon: Lock,
    color: 'red',
  },
];

export function PrivacySettings({ settings, onSettingsUpdate }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<SettingsUpdateForm>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: settings?.profileVisibility || 'PUBLIC',
      allowPersonaInteractions: settings?.allowPersonaInteractions ?? true,
      allowDataForAI: settings?.allowDataForAI ?? true,
    },
  });

  // Reset form when settings change
  useEffect(() => {
    if (settings) {
      reset({
        profileVisibility: settings.profileVisibility,
        allowPersonaInteractions: settings.allowPersonaInteractions,
        allowDataForAI: settings.allowDataForAI,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsUpdateForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.put<UserSettings>('/settings', data);

      if (response.success && response.data) {
        onSettingsUpdate(response.data);
        toast({
          title: 'Privacy Settings Updated',
          description: 'Your privacy preferences have been saved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update privacy settings';
      setError(errorMsg);
      toast({
        title: 'Update Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVisibility = watch('profileVisibility');
  const selectedVisibilityOption = VISIBILITY_OPTIONS.find(opt => opt.value === selectedVisibility);

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection
        title="Profile Visibility"
        description="Control who can see your profile and posts"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}

            <FormControl isInvalid={!!errors.profileVisibility}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Shield size={16} />
                Profile Visibility
              </FormLabel>

              <VStack spacing={3} align="stretch">
                {VISIBILITY_OPTIONS.map((option) => {
                  const isSelected = selectedVisibility === option.value;
                  const IconComponent = option.icon;

                  return (
                    <Box
                      key={option.value}
                      p={4}
                      border="2px"
                      borderColor={isSelected ? 'blue.500' : useColorModeValue('gray.200', 'gray.600')}
                      rounded="xl"
                      bg={isSelected ? 'blue.50' : useColorModeValue('gray.50', 'gray.700')}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: isSelected ? 'blue.600' : 'gray.400',
                        transform: 'translateY(-1px)',
                      }}
                      onClick={() => setValue('profileVisibility', option.value as any)}
                    >
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          rounded="lg"
                          bg={`${option.color}.100`}
                          color={`${option.color}.600`}
                        >
                          <IconComponent size={20} />
                        </Box>

                        <VStack align="flex-start" spacing={1} flex={1}>
                          <HStack>
                            <Text fontWeight="semibold" fontSize="sm">
                              {option.label}
                            </Text>
                            {isSelected && (
                              <Badge colorScheme="blue" size="sm">
                                Current
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize="xs" color="gray.600">
                            {option.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>

              {errors.profileVisibility && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.profileVisibility.message}
                </Text>
              )}
            </FormControl>

            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <VStack align="flex-start" spacing={1} flex={1} mr={4}>
                <FormLabel mb={0}>
                  Allow AI Persona Interactions
                </FormLabel>
                <Text fontSize="xs" color="gray.600">
                  Let AI personas respond to and interact with your posts
                </Text>
              </VStack>
              <Switch
                {...register('allowPersonaInteractions')}
                size="lg"
                colorScheme="blue"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <VStack align="flex-start" spacing={1} flex={1} mr={4}>
                <FormLabel mb={0}>
                  Allow Data for AI Training
                </FormLabel>
                <Text fontSize="xs" color="gray.600">
                  Help improve AI personas by allowing your public posts to be used for training
                </Text>
              </VStack>
              <Switch
                {...register('allowDataForAI')}
                size="lg"
                colorScheme="blue"
              />
            </FormControl>

            <HStack justify="flex-end" pt={4}>
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                isDisabled={!isDirty}
                loadingText="Saving..."
                leftIcon={<Save size={18} />}
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
                rounded="xl"
              >
                Save Privacy Settings
              </Button>
            </HStack>
          </VStack>
        </form>
      </SettingsSection>
    </VStack>
  );
}

export default PrivacySettings;