'use client';

import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Alert,
  AlertIcon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, User, Globe, MapPin, Link as LinkIcon } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { apiClient } from '@/services/api';
import type { UserSettings, SettingsUpdateForm } from '@/types';

const generalSettingsSchema = z.object({
  newsRegion: z.string().min(1, 'News region is required'),
  newsLanguages: z.array(z.string()).min(1, 'At least one language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

interface GeneralSettingsProps {
  settings: UserSettings | null;
  onSettingsUpdate: (settings: UserSettings) => void;
}

const NEWS_REGIONS = [
  { value: 'WORLDWIDE', label: 'Worldwide' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
];

export function GeneralSettings({ settings, onSettingsUpdate }: GeneralSettingsProps) {
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
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      newsRegion: settings?.newsRegion || 'WORLDWIDE',
      newsLanguages: settings?.newsLanguages || ['en'],
      timezone: settings?.timezone || 'UTC',
    },
  });

  // Reset form when settings change
  useEffect(() => {
    if (settings) {
      reset({
        newsRegion: settings.newsRegion,
        newsLanguages: settings.newsLanguages,
        timezone: settings.timezone,
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
          title: 'Settings Updated',
          description: 'Your general settings have been saved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update settings';
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

  const watchedLanguages = watch('newsLanguages');

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection
        title="Regional Preferences"
        description="Configure your news region and language preferences"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}

            <FormControl isInvalid={!!errors.newsRegion}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Globe size={16} />
                News Region
              </FormLabel>
              <Select
                {...register('newsRegion')}
                placeholder="Select news region"
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
              >
                {NEWS_REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
              {errors.newsRegion && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.newsRegion.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.newsLanguages}>
              <FormLabel>Preferred Languages</FormLabel>
              <VStack spacing={2} align="stretch">
                {LANGUAGES.map((language) => (
                  <label key={language.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={watchedLanguages?.includes(language.value) || false}
                      onChange={(e) => {
                        const current = watchedLanguages || [];
                        if (e.target.checked) {
                          setValue('newsLanguages', [...current, language.value]);
                        } else {
                          setValue('newsLanguages', current.filter(l => l !== language.value));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Text fontSize="sm">{language.label}</Text>
                  </label>
                ))}
              </VStack>
              {errors.newsLanguages && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.newsLanguages.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.timezone}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <MapPin size={16} />
                Timezone
              </FormLabel>
              <Select
                {...register('timezone')}
                placeholder="Select timezone"
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
              >
                {TIMEZONES.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </Select>
              {errors.timezone && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.timezone.message}
                </Text>
              )}
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
                Save Changes
              </Button>
            </HStack>
          </VStack>
        </form>
      </SettingsSection>
    </VStack>
  );
}

export default GeneralSettings;