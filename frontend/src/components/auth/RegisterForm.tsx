'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Checkbox,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Progress,
} from '@chakra-ui/react';
import { Eye, EyeOff, UserPlus, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/services/api';
import type { RegisterForm as RegisterFormData, User, PoliticalAlignment } from '@/types';
import { PoliticalAlignmentSelector } from './PoliticalAlignmentSelector';
import { PersonaTypeSelector } from './PersonaTypeSelector';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

type PersonaType =
  | 'politician'
  | 'influencer'
  | 'journalist'
  | 'business_leader'
  | 'activist'
  | 'celebrity'
  | 'podcaster'
  | 'content_creator'
  | 'regular_user';

interface RegisterFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  onLoginClick?: () => void;
  className?: string;
}

const steps = [
  { title: 'Account Info', description: 'Basic details' },
  { title: 'Account Type', description: 'Choose your role' },
  { title: 'Political Views', description: 'Set alignment' },
  { title: 'Complete', description: 'Finish setup' },
];

export function RegisterForm({
  onSuccess,
  onError,
  onLoginClick,
  className,
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [politicalAlignment, setPoliticalAlignment] = useState<PoliticalAlignment | null>(null);
  const [personaType, setPersonaType] = useState<PersonaType>('regular_user');
  const [personaCustomization, setPersonaCustomization] = useState('');

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.900', 'white');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(watchedFields.username && watchedFields.email && 
                 watchedFields.password && watchedFields.displayName && 
                 watchedFields.agreeToTerms && Object.keys(errors).length === 0);
      case 1:
        return !!personaType;
      case 2:
        return !!politicalAlignment;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1 && isStepValid(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const registrationData = {
        ...data,
        politicalAlignment,
        personaType,
        personaCustomization,
      };

      const response = await apiClient.post<{ user: User; token: string }>(
        '/auth/register',
        registrationData
      );

      if (response.success && response.data) {
        // Store auth token
        localStorage.setItem('authToken', response.data.token);
        
        // Call success callback
        onSuccess?.(response.data.user);
        
        // Move to completion step
        setActiveStep(steps.length - 1);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Registration failed';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.displayName}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Display Name
              </FormLabel>
              <Input
                {...register('displayName')}
                placeholder="Your full name"
                size="lg"
                rounded="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px"
                borderColor={borderColor}
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'gray.500'),
                }}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px rgb(59 130 246 / 0.5)',
                }}
              />
              {errors.displayName && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.displayName.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.username}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Username
              </FormLabel>
              <Input
                {...register('username')}
                placeholder="@username"
                size="lg"
                rounded="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px"
                borderColor={borderColor}
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'gray.500'),
                }}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px rgb(59 130 246 / 0.5)',
                }}
              />
              {errors.username && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.username.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Email Address
              </FormLabel>
              <Input
                {...register('email')}
                type="email"
                placeholder="your.email@example.com"
                size="lg"
                rounded="xl"
                bg={useColorModeValue('gray.50', 'gray.700')}
                border="1px"
                borderColor={borderColor}
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'gray.500'),
                }}
                _focus={{
                  borderColor: 'blue.500',
                  boxShadow: '0 0 0 1px rgb(59 130 246 / 0.5)',
                }}
              />
              {errors.email && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.email.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Password
              </FormLabel>
              <InputGroup size="lg">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  rounded="xl"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  border="1px"
                  borderColor={borderColor}
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.agreeToTerms}>
              <Checkbox
                {...register('agreeToTerms')}
                size="sm"
                colorScheme="blue"
              >
                <Text fontSize="sm" color="gray.600">
                  I agree to the{' '}
                  <Button variant="link" size="sm" color="blue.500">
                    Terms of Service
                  </Button>{' '}
                  and{' '}
                  <Button variant="link" size="sm" color="blue.500">
                    Privacy Policy
                  </Button>
                </Text>
              </Checkbox>
              {errors.agreeToTerms && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errors.agreeToTerms.message}
                </Text>
              )}
            </FormControl>
          </VStack>
        );

      case 1:
        return (
          <PersonaTypeSelector
            value={personaType}
            onChange={(type, customization) => {
              setPersonaType(type);
              setPersonaCustomization(customization || '');
            }}
          />
        );

      case 2:
        return (
          <PoliticalAlignmentSelector
            value={politicalAlignment || undefined}
            onChange={setPoliticalAlignment}
          />
        );

      case 3:
        return (
          <VStack spacing={6} textAlign="center">
            <Box
              w={16}
              h={16}
              bg="green.100"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="animate-bounce-gentle"
            >
              <Check size={32} className="text-green-600" />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Account Created Successfully!
            </Text>
            <Text fontSize="sm" color="gray.500">
              Welcome to AI Social! Your account has been set up and you're ready to start engaging with political discussions.
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => window.location.href = '/dashboard'}
              className="x-btn-primary"
            >
              Go to Dashboard
            </Button>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      className={className}
      bg={bgColor}
      p={8}
      rounded="2xl"
      shadow="x-lg"
      border="1px"
      borderColor={borderColor}
      maxW="2xl"
      w="full"
    >
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={textColor}
            className="text-gradient-x"
            mb={2}
          >
            Create Your Account
          </Text>
          <Text fontSize="sm" color="gray.500">
            Join the AI-powered political discussion platform
          </Text>
        </Box>

        {/* Progress Indicator */}
        <Box>
          <Progress
            value={(activeStep / (steps.length - 1)) * 100}
            colorScheme="blue"
            size="sm"
            rounded="full"
            mb={4}
          />
          <Stepper index={activeStep} orientation="horizontal" size="sm">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Box>

        {errorMessage && (
          <Alert status="error" rounded="lg">
            <AlertIcon />
            <Text fontSize="sm">{errorMessage}</Text>
          </Alert>
        )}

        {/* Step Content */}
        <Box minH="400px">
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        {activeStep < steps.length - 1 && (
          <VStack spacing={4}>
            <Box w="full" display="flex" justifyContent="space-between">
              <Button
                onClick={prevStep}
                isDisabled={activeStep === 0}
                variant="outline"
                leftIcon={<ArrowLeft size={16} />}
                size="lg"
              >
                Previous
              </Button>
              
              {activeStep === steps.length - 2 ? (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isLoading}
                  isDisabled={!isStepValid(activeStep)}
                  loadingText="Creating account..."
                  leftIcon={<UserPlus size={18} />}
                  size="lg"
                  className="x-btn-primary"
                  bg="blue.500"
                  color="white"
                  _hover={{
                    bg: 'blue.600',
                    transform: 'translateY(-1px)',
                    shadow: 'lg',
                  }}
                >
                  Create Account
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  isDisabled={!isStepValid(activeStep)}
                  rightIcon={<ArrowRight size={16} />}
                  size="lg"
                  className="x-btn-primary"
                  bg="blue.500"
                  color="white"
                  _hover={{
                    bg: 'blue.600',
                    transform: 'translateY(-1px)',
                    shadow: 'lg',
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>

            <Box textAlign="center" pt={4}>
              <Text fontSize="sm" color="gray.500">
                Already have an account?{' '}
                <Button
                  variant="link"
                  size="sm"
                  color="blue.500"
                  fontWeight="semibold"
                  _hover={{ textDecoration: 'underline' }}
                  onClick={onLoginClick}
                >
                  Sign in
                </Button>
              </Text>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default RegisterForm;