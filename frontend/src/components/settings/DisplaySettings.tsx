'use client';

import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
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
  useColorMode,
  Badge,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Palette, Sun, Moon, Monitor, Globe, Type } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { apiClient } from '@/services/api';
import type { UserSettings, SettingsUpdateForm } from '@/types';

const displaySettingsSchema = z.object({
  theme: z.enum(['LIGHT', 'DARK', 'AUTO']),
  language: z.string().min(1, 'Language is required'),
});

interface DisplaySettingsProps {
  settings: UserSettings | null;
  onSettingsUpdate: (settings: UserSettings) => void;
}

const THEME_OPTIONS = [
  {
    value: 'LIGHT',
    label: 'Light',
    description: 'Classic light theme',
    icon: Sun,
    color: 'yellow',
  },
  {
    value: 'DARK',
    label: 'Dark',
    description: 'Easy on the eyes',
    icon: Moon,
    color: 'blue',
  },
  {
    value: 'AUTO',
    label: 'Auto',
    description: 'Matches system preference',
    icon: Monitor,
    color: 'gray',
  },
];

const LANGUAGES = [
  { value: 'en', label: 'English', nativeName: 'English' },
  { value: 'es', label: 'Spanish', nativeName: 'Español' },
  { value: 'fr', label: 'French', nativeName: 'Français' },
  { value: 'de', label: 'German', nativeName: 'Deutsch' },
  { value: 'it', label: 'Italian', nativeName: 'Italiano' },
  { value: 'pt', label: 'Portuguese', nativeName: 'Português' },
  { value: 'ja', label: 'Japanese', nativeName: '日本語' },
  { value: 'ko', label: 'Korean', nativeName: '한국어' },
  { value: 'zh', label: 'Chinese', nativeName: '中文' },
  { value: 'ar', label: 'Arabic', nativeName: 'العربية' },
  { value: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { value: 'ru', label: 'Russian', nativeName: 'Русский' },
];

export function DisplaySettings({ settings, onSettingsUpdate }: DisplaySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<SettingsUpdateForm>({
    resolver: zodResolver(displaySettingsSchema),
    defaultValues: {
      theme: settings?.theme || 'AUTO',
      language: settings?.language || 'en',
    },
  });

  // Reset form when settings change
  useEffect(() => {
    if (settings) {
      reset({
        theme: settings.theme,
        language: settings.language,
      });
    }
  }, [settings, reset]);

  // Apply theme changes immediately
  const watchedTheme = watch('theme');
  useEffect(() => {
    if (watchedTheme) {
      switch (watchedTheme) {
        case 'LIGHT':
          setColorMode('light');
          break;
        case 'DARK':
          setColorMode('dark');
          break;
        case 'AUTO':
          // Let system preference handle it
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setColorMode(prefersDark ? 'dark' : 'light');
          break;
      }
    }
  }, [watchedTheme, setColorMode]);

  const onSubmit = async (data: SettingsUpdateForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.put<UserSettings>('/settings', data);

      if (response.success && response.data) {
        onSettingsUpdate(response.data);
        toast({
          title: 'Display Settings Updated',
          description: 'Your display preferences have been saved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update display settings';
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

  const selectedLanguage = watch('language');
  const selectedLanguageOption = LANGUAGES.find(lang => lang.value === selectedLanguage);

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection
        title="Theme Preferences"
        description="Customize your visual experience"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}

            <FormControl isInvalid={!!errors.theme}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Palette size={16} />
                Theme
              </FormLabel>

              <VStack spacing={3} align="stretch">
                {THEME_OPTIONS.map((theme) => {
                  const isSelected = watchedTheme === theme.value;
                  const IconComponent = theme.icon;

                  return (
                    <Box
                      key={theme.value}
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
                      onClick={() => setValue('theme', theme.value as any)}
                    >
                      <HStack spacing={3}>
                        <Box
                          p={3}
                          rounded="lg"
                          bg={`${theme.color}.100`}
                          color={`${theme.color}.600`}
                        >
                          <IconComponent size={24} />
                        </Box>

                        <VStack align="flex-start" spacing={1} flex={1}>
                          <HStack>
                            <Text fontWeight="semibold" fontSize="md">
                              {theme.label}
                            </Text>
                            {isSelected && (
                              <Badge colorScheme="blue" size="sm">
                                Active
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {theme.description}
                          </Text>
                        </VStack>

                        {/* Visual Preview */}
                        <Box
                          w={16}
                          h={10}
                          rounded="md"
                          border="1px"
                          borderColor="gray.300"
                          overflow="hidden"
                          bg={theme.value === 'LIGHT' ? 'white' : theme.value === 'DARK' ? 'gray.800' : 'gray.400'}
                        >
                          <Box
                            h="30%"
                            bg={theme.value === 'LIGHT' ? 'blue.500' : theme.value === 'DARK' ? 'blue.400' : 'blue.500'}
                          />
                          <Box
                            p={1}
                            h="70%"
                            bg={theme.value === 'LIGHT' ? 'white' : theme.value === 'DARK' ? 'gray.800' : 'gradient'}
                          >
                            <Box
                              h="40%"
                              bg={theme.value === 'LIGHT' ? 'gray.300' : theme.value === 'DARK' ? 'gray.600' : 'gray.400'}
                              rounded="sm"
                              mb={1}
                            />
                            <Box
                              h="40%"
                              bg={theme.value === 'LIGHT' ? 'gray.200' : theme.value === 'DARK' ? 'gray.700' : 'gray.500'}
                              rounded="sm"
                            />
                          </Box>
                        </Box>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>

              {errors.theme && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.theme.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.language}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Globe size={16} />
                Language
              </FormLabel>
              <Select
                {...register('language')}
                placeholder="Select language"
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
                {LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label} ({language.nativeName})
                  </option>
                ))}
              </Select>
              {errors.language && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.language.message}
                </Text>
              )}
              {selectedLanguageOption && (
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Content will be displayed in {selectedLanguageOption.label} when available
                </Text>
              )}
            </FormControl>

            {/* Preview Section */}
            <Box
              p={4}
              rounded="xl"
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
              bg={useColorModeValue('gray.50', 'gray.700')}
            >
              <Text fontSize="sm" fontWeight="medium" mb={2} color={useColorModeValue('gray.900', 'white')}>
                Preview
              </Text>
              <Box
                p={3}
                rounded="lg"
                bg={useColorModeValue('white', 'gray.800')}
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('gray.900', 'white')} mb={1}>
                  Sample Post
                </Text>
                <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                  This is how content will appear with your current theme settings.
                </Text>
              </Box>
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
                Save Display Settings
              </Button>
            </HStack>
          </VStack>
        </form>
      </SettingsSection>
    </VStack>
  );
}

export default DisplaySettings;