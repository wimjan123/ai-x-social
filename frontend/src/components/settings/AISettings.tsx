'use client';

import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Bot, Volume2, MessageSquare, Key, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { apiClient } from '@/services/api';
import type { UserSettings, SettingsUpdateForm, AIConfigForm } from '@/types';

const aiSettingsSchema = z.object({
  aiChatterLevel: z.number().min(0).max(100),
  aiPersonalities: z.array(z.string()),
  aiResponseTone: z.enum(['PROFESSIONAL', 'CASUAL', 'HUMOROUS', 'SERIOUS', 'SARCASTIC', 'EMPATHETIC']),
});

const aiConfigSchema = z.object({
  customAIApiKey: z.string().optional(),
  customAIBaseUrl: z.string().url().optional(),
});

interface AISettingsProps {
  settings: UserSettings | null;
  onSettingsUpdate: (settings: UserSettings) => void;
}

const RESPONSE_TONES = [
  { value: 'PROFESSIONAL', label: 'Professional', description: 'Formal and business-like responses' },
  { value: 'CASUAL', label: 'Casual', description: 'Relaxed and friendly tone' },
  { value: 'HUMOROUS', label: 'Humorous', description: 'Witty and entertaining responses' },
  { value: 'SERIOUS', label: 'Serious', description: 'Thoughtful and earnest tone' },
  { value: 'SARCASTIC', label: 'Sarcastic', description: 'Sharp and ironic responses' },
  { value: 'EMPATHETIC', label: 'Empathetic', description: 'Understanding and compassionate' },
];

const DEFAULT_PERSONALITIES = [
  'Political Analyst',
  'News Commentator',
  'Social Activist',
  'Policy Expert',
  'Debate Moderator',
  'Fact Checker',
  'Opinion Leader',
  'Town Hall Host',
];

export function AISettings({ settings, onSettingsUpdate }: AISettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<SettingsUpdateForm>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      aiChatterLevel: settings?.aiChatterLevel || 50,
      aiPersonalities: settings?.aiPersonalities || [],
      aiResponseTone: settings?.aiResponseTone || 'PROFESSIONAL',
    },
  });

  const {
    register: registerConfig,
    handleSubmit: handleConfigSubmit,
    formState: { errors: configErrors, isDirty: isConfigDirty },
    reset: resetConfig,
  } = useForm<AIConfigForm>({
    resolver: zodResolver(aiConfigSchema),
  });

  // Reset form when settings change
  useEffect(() => {
    if (settings) {
      reset({
        aiChatterLevel: settings.aiChatterLevel,
        aiPersonalities: settings.aiPersonalities,
        aiResponseTone: settings.aiResponseTone,
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
          title: 'AI Settings Updated',
          description: 'Your AI interaction preferences have been saved.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update AI settings';
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

  const onConfigSubmit = async (data: AIConfigForm) => {
    setIsConfigLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/settings/ai-config', data);

      if (response.success) {
        resetConfig();
        toast({
          title: 'AI Configuration Updated',
          description: 'Your custom AI settings have been saved securely.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update AI configuration';
      setError(errorMsg);
      toast({
        title: 'Configuration Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConfigLoading(false);
    }
  };

  const chatterLevel = watch('aiChatterLevel');
  const selectedPersonalities = watch('aiPersonalities');

  const getChatterDescription = (level: number) => {
    if (level <= 20) return 'Minimal - AI personas rarely interact';
    if (level <= 40) return 'Low - Occasional AI interactions';
    if (level <= 60) return 'Moderate - Regular AI engagement';
    if (level <= 80) return 'High - Frequent AI interactions';
    return 'Maximum - Very active AI personas';
  };

  const togglePersonality = (personality: string) => {
    const current = selectedPersonalities || [];
    if (current.includes(personality)) {
      setValue('aiPersonalities', current.filter(p => p !== personality));
    } else {
      setValue('aiPersonalities', [...current, personality]);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection
        title="AI Interaction Settings"
        description="Configure how AI personas interact with your content"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            )}

            <FormControl>
              <FormLabel display="flex" alignItems="center" gap={2} mb={4}>
                <Volume2 size={16} />
                AI Chatter Level: {chatterLevel}%
              </FormLabel>
              <Box px={3}>
                <Slider
                  value={chatterLevel}
                  onChange={(val) => setValue('aiChatterLevel', val)}
                  min={0}
                  max={100}
                  step={10}
                  colorScheme="blue"
                >
                  <SliderTrack h={2}>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Bot size={16} />
                  </SliderThumb>
                </Slider>
              </Box>
              <Text fontSize="xs" color="gray.600" mt={2} textAlign="center">
                {getChatterDescription(chatterLevel)}
              </Text>
            </FormControl>

            <FormControl isInvalid={!!errors.aiResponseTone}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <MessageSquare size={16} />
                AI Response Tone
              </FormLabel>
              <Select
                {...register('aiResponseTone')}
                placeholder="Select response tone"
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
                {RESPONSE_TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label} - {tone.description}
                  </option>
                ))}
              </Select>
              {errors.aiResponseTone && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.aiResponseTone.message}
                </Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Preferred AI Personalities</FormLabel>
              <Text fontSize="xs" color="gray.600" mb={3}>
                Select AI personalities you'd like to interact with your content
              </Text>
              <VStack spacing={2} align="stretch">
                {DEFAULT_PERSONALITIES.map((personality) => {
                  const isSelected = selectedPersonalities?.includes(personality) || false;

                  return (
                    <Box
                      key={personality}
                      p={3}
                      border="1px"
                      borderColor={isSelected ? 'blue.300' : useColorModeValue('gray.200', 'gray.600')}
                      rounded="lg"
                      bg={isSelected ? 'blue.50' : useColorModeValue('gray.50', 'gray.700')}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: isSelected ? 'blue.400' : 'gray.400',
                      }}
                      onClick={() => togglePersonality(personality)}
                    >
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight={isSelected ? 'semibold' : 'medium'}>
                          {personality}
                        </Text>
                        {isSelected && (
                          <Badge colorScheme="blue" size="sm">
                            Selected
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
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
                Save AI Settings
              </Button>
            </HStack>
          </VStack>
        </form>
      </SettingsSection>

      <SettingsSection
        title="Custom AI Configuration"
        description="Use your own AI API keys for personalized interactions"
      >
        <form onSubmit={handleConfigSubmit(onConfigSubmit)}>
          <VStack spacing={6} align="stretch">
            <Alert status="info" rounded="lg">
              <AlertIcon />
              <Box>
                <Text fontSize="sm" fontWeight="medium">
                  Advanced Configuration
                </Text>
                <Text fontSize="xs" mt={1}>
                  Configure custom AI providers for enhanced personalization. Your API keys are encrypted and stored securely.
                </Text>
              </Box>
            </Alert>

            <FormControl isInvalid={!!configErrors.customAIApiKey}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Key size={16} />
                Custom AI API Key
              </FormLabel>
              <InputGroup>
                <Input
                  {...registerConfig('customAIApiKey')}
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="sk-..."
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
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                    icon={showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  />
                </InputRightElement>
              </InputGroup>
              {configErrors.customAIApiKey && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {configErrors.customAIApiKey.message}
                </Text>
              )}
              <Text fontSize="xs" color="gray.600" mt={1}>
                Optional: Use your own OpenAI API key for personalized responses
              </Text>
            </FormControl>

            <FormControl isInvalid={!!configErrors.customAIBaseUrl}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <ExternalLink size={16} />
                Custom API Base URL
              </FormLabel>
              <Input
                {...registerConfig('customAIBaseUrl')}
                type="url"
                placeholder="https://api.openai.com/v1"
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
              />
              {configErrors.customAIBaseUrl && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {configErrors.customAIBaseUrl.message}
                </Text>
              )}
              <Text fontSize="xs" color="gray.600" mt={1}>
                Optional: Custom API endpoint for specialized AI providers
              </Text>
            </FormControl>

            <HStack justify="flex-end" pt={4}>
              <Button
                type="submit"
                size="lg"
                isLoading={isConfigLoading}
                isDisabled={!isConfigDirty}
                loadingText="Updating..."
                leftIcon={<Save size={18} />}
                bg="teal.500"
                color="white"
                _hover={{
                  bg: 'teal.600',
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
                rounded="xl"
              >
                Save AI Configuration
              </Button>
            </HStack>
          </VStack>
        </form>
      </SettingsSection>
    </VStack>
  );
}

export default AISettings;