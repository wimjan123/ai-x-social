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
  Alert,
  AlertIcon,
  useColorModeValue,
  useToast,
  Box,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Bell, Mail, Smartphone, MessageCircle, Heart, Repeat, UserPlus, Newspaper, Bot } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { apiClient } from '@/services/api';
import type { UserSettings, SettingsUpdateForm } from '@/types';

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  notificationCategories: z.array(z.enum(['MENTIONS', 'REPLIES', 'LIKES', 'REPOSTS', 'FOLLOWERS', 'NEWS_ALERTS', 'PERSONA_INTERACTIONS'])),
});

interface NotificationSettingsProps {
  settings: UserSettings | null;
  onSettingsUpdate: (settings: UserSettings) => void;
}

const NOTIFICATION_CATEGORIES = [
  {
    value: 'MENTIONS',
    label: 'Mentions',
    description: 'When someone mentions you in a post',
    icon: MessageCircle,
    color: 'blue',
  },
  {
    value: 'REPLIES',
    label: 'Replies',
    description: 'When someone replies to your posts',
    icon: MessageCircle,
    color: 'green',
  },
  {
    value: 'LIKES',
    label: 'Likes',
    description: 'When someone likes your posts',
    icon: Heart,
    color: 'red',
  },
  {
    value: 'REPOSTS',
    label: 'Reposts',
    description: 'When someone reposts your content',
    icon: Repeat,
    color: 'green',
  },
  {
    value: 'FOLLOWERS',
    label: 'New Followers',
    description: 'When someone follows you',
    icon: UserPlus,
    color: 'purple',
  },
  {
    value: 'NEWS_ALERTS',
    label: 'News Alerts',
    description: 'Breaking news and trending topics',
    icon: Newspaper,
    color: 'orange',
  },
  {
    value: 'PERSONA_INTERACTIONS',
    label: 'AI Persona Interactions',
    description: 'When AI personas interact with your content',
    icon: Bot,
    color: 'teal',
  },
];

export function NotificationSettings({ settings, onSettingsUpdate }: NotificationSettingsProps) {
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
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: settings?.emailNotifications ?? true,
      pushNotifications: settings?.pushNotifications ?? true,
      notificationCategories: settings?.notificationCategories || ['MENTIONS', 'REPLIES'],
    },
  });

  // Reset form when settings change
  useEffect(() => {
    if (settings) {
      reset({
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        notificationCategories: settings.notificationCategories,
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
          title: 'Notification Settings Updated',
          description: 'Your notification preferences have been saved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update notification settings';
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

  const watchedCategories = watch('notificationCategories');
  const emailEnabled = watch('emailNotifications');
  const pushEnabled = watch('pushNotifications');

  const toggleCategory = (category: string) => {
    const current = watchedCategories || [];
    if (current.includes(category as any)) {
      setValue('notificationCategories', current.filter(c => c !== category) as any);
    } else {
      setValue('notificationCategories', [...current, category] as any);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection
        title="Notification Preferences"
        description="Choose how and when you want to be notified"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}

            {/* Delivery Methods */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={4} color={useColorModeValue('gray.900', 'white')}>
                Delivery Methods
              </Text>

              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <HStack spacing={3}>
                    <Box
                      p={2}
                      rounded="lg"
                      bg="blue.100"
                      color="blue.600"
                    >
                      <Mail size={18} />
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <FormLabel mb={0} fontSize="sm" fontWeight="medium">
                        Email Notifications
                      </FormLabel>
                      <Text fontSize="xs" color="gray.600">
                        Receive notifications via email
                      </Text>
                    </VStack>
                  </HStack>
                  <Switch
                    {...register('emailNotifications')}
                    size="lg"
                    colorScheme="blue"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <HStack spacing={3}>
                    <Box
                      p={2}
                      rounded="lg"
                      bg="green.100"
                      color="green.600"
                    >
                      <Smartphone size={18} />
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <FormLabel mb={0} fontSize="sm" fontWeight="medium">
                        Push Notifications
                      </FormLabel>
                      <Text fontSize="xs" color="gray.600">
                        Receive browser push notifications
                      </Text>
                    </VStack>
                  </HStack>
                  <Switch
                    {...register('pushNotifications')}
                    size="lg"
                    colorScheme="green"
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            {/* Notification Categories */}
            <Box>
              <HStack spacing={3} mb={4}>
                <Text fontSize="md" fontWeight="semibold" color={useColorModeValue('gray.900', 'white')}>
                  Notification Types
                </Text>
                {(!emailEnabled && !pushEnabled) && (
                  <Badge colorScheme="orange" size="sm">
                    No delivery methods enabled
                  </Badge>
                )}
              </HStack>

              <VStack spacing={3} align="stretch">
                {NOTIFICATION_CATEGORIES.map((category) => {
                  const isEnabled = watchedCategories?.includes(category.value as any) || false;
                  const IconComponent = category.icon;

                  return (
                    <Box
                      key={category.value}
                      p={4}
                      border="1px"
                      borderColor={isEnabled ? 'blue.300' : useColorModeValue('gray.200', 'gray.600')}
                      rounded="xl"
                      bg={isEnabled ? 'blue.50' : useColorModeValue('gray.50', 'gray.700')}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: isEnabled ? 'blue.400' : 'gray.400',
                        transform: 'translateY(-1px)',
                      }}
                      onClick={() => toggleCategory(category.value)}
                      opacity={(!emailEnabled && !pushEnabled) ? 0.5 : 1}
                    >
                      <HStack spacing={3}>
                        <Box
                          p={2}
                          rounded="lg"
                          bg={`${category.color}.100`}
                          color={`${category.color}.600`}
                        >
                          <IconComponent size={18} />
                        </Box>

                        <VStack align="flex-start" spacing={1} flex={1}>
                          <HStack>
                            <Text fontWeight="medium" fontSize="sm">
                              {category.label}
                            </Text>
                            {isEnabled && (
                              <Badge colorScheme="blue" size="sm">
                                Enabled
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize="xs" color="gray.600">
                            {category.description}
                          </Text>
                        </VStack>

                        <Switch
                          isChecked={isEnabled}
                          onChange={() => toggleCategory(category.value)}
                          size="md"
                          colorScheme="blue"
                          isDisabled={!emailEnabled && !pushEnabled}
                        />
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>

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
                Save Notification Settings
              </Button>
            </HStack>
          </VStack>
        </form>
      </SettingsSection>
    </VStack>
  );
}

export default NotificationSettings;