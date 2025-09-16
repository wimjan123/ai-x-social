'use client';

import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
  useToast,
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
  Switch,
  Divider,
  Badge,
  Progress,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Lock, Eye, EyeOff, Shield, Smartphone, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { apiClient } from '@/services/api';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const twoFactorSchema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
});

interface SecuritySettingsProps {
  // In a real app, this would come from user context
  user?: {
    email: string;
    twoFactorEnabled?: boolean;
    lastPasswordChange?: string;
  };
}

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface TwoFactorForm {
  verificationCode: string;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isDirty: isPasswordDirty },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const {
    register: register2FA,
    handleSubmit: handle2FASubmit,
    formState: { errors: twoFactorErrors },
    reset: reset2FA,
  } = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
  });

  const newPassword = watchPassword('newPassword');

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'gray' };

    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 15;
    if (/[@$!%*?&]/.test(password)) score += 15;

    if (score < 40) return { score, label: 'Weak', color: 'red' };
    if (score < 70) return { score, label: 'Fair', color: 'orange' };
    if (score < 90) return { score, label: 'Good', color: 'yellow' };
    return { score, label: 'Strong', color: 'green' };
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  const onPasswordSubmit = async (data: PasswordChangeForm) => {
    setIsPasswordLoading(true);
    setError('');

    try {
      const response = await apiClient.put('/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        resetPassword();
        toast({
          title: 'Password Updated',
          description: 'Your password has been changed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update password';
      setError(errorMsg);
      toast({
        title: 'Password Update Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const setup2FA = async () => {
    setIs2FALoading(true);
    setError('');

    try {
      const response = await apiClient.post<{ qrCode: string; secret: string }>('/auth/2fa/setup');

      if (response.success && response.data) {
        setQrCodeUrl(response.data.qrCode);
        setShow2FASetup(true);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to setup 2FA';
      setError(errorMsg);
      toast({
        title: '2FA Setup Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIs2FALoading(false);
    }
  };

  const verify2FA = async (data: TwoFactorForm) => {
    setIs2FALoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/2fa/verify', {
        code: data.verificationCode,
      });

      if (response.success) {
        setShow2FASetup(false);
        reset2FA();
        toast({
          title: '2FA Enabled',
          description: 'Two-factor authentication has been enabled for your account.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Invalid verification code';
      setError(errorMsg);
      toast({
        title: '2FA Verification Failed',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIs2FALoading(false);
    }
  };

  const disable2FA = async () => {
    setIs2FALoading(true);

    try {
      const response = await apiClient.delete('/auth/2fa');

      if (response.success) {
        toast({
          title: '2FA Disabled',
          description: 'Two-factor authentication has been disabled.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to Disable 2FA',
        description: 'Please contact support if you continue to have issues.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIs2FALoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <SettingsSection
        title="Password Security"
        description="Change your password and manage account security"
      >
        <VStack spacing={6} align="stretch">
          {error && (
            <Alert status="error" rounded="lg">
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          )}

          {/* Current Security Status */}
          <Box
            p={4}
            rounded="xl"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <HStack spacing={3} mb={3}>
              <Shield size={18} />
              <Text fontWeight="semibold" fontSize="sm">
                Security Status
              </Text>
            </HStack>
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="xs">Last password change:</Text>
                <Text fontSize="xs" color="gray.600">
                  {user?.lastPasswordChange || '30 days ago'}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="xs">Two-factor authentication:</Text>
                <Badge colorScheme={user?.twoFactorEnabled ? 'green' : 'red'} size="sm">
                  {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </HStack>
            </VStack>
          </Box>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!passwordErrors.currentPassword}>
                <FormLabel fontSize="sm">Current Password</FormLabel>
                <InputGroup>
                  <Input
                    {...registerPassword('currentPassword')}
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
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
                      aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      icon={showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                {passwordErrors.currentPassword && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {passwordErrors.currentPassword.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!passwordErrors.newPassword}>
                <FormLabel fontSize="sm">New Password</FormLabel>
                <InputGroup>
                  <Input
                    {...registerPassword('newPassword')}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
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
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      icon={showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                {newPassword && (
                  <Box mt={2}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="xs">Password strength:</Text>
                      <Text fontSize="xs" color={`${passwordStrength.color}.500`}>
                        {passwordStrength.label}
                      </Text>
                    </HStack>
                    <Progress
                      value={passwordStrength.score}
                      size="sm"
                      colorScheme={passwordStrength.color}
                      rounded="md"
                    />
                  </Box>
                )}
                {passwordErrors.newPassword && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {passwordErrors.newPassword.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!passwordErrors.confirmPassword}>
                <FormLabel fontSize="sm">Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    {...registerPassword('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
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
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                {passwordErrors.confirmPassword && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {passwordErrors.confirmPassword.message}
                  </Text>
                )}
              </FormControl>

              <HStack justify="flex-end" pt={2}>
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isPasswordLoading}
                  isDisabled={!isPasswordDirty}
                  loadingText="Updating..."
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
                  Update Password
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </SettingsSection>

      <SettingsSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <VStack spacing={6} align="stretch">
          {!user?.twoFactorEnabled && !show2FASetup && (
            <Box>
              <Alert status="warning" rounded="lg" mb={4}>
                <AlertTriangle size={16} />
                <Box ml={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Two-factor authentication is disabled
                  </Text>
                  <Text fontSize="xs" mt={1}>
                    Enable 2FA to protect your account with an additional security layer.
                  </Text>
                </Box>
              </Alert>

              <Button
                onClick={setup2FA}
                isLoading={is2FALoading}
                loadingText="Setting up..."
                leftIcon={<Smartphone size={18} />}
                bg="green.500"
                color="white"
                _hover={{
                  bg: 'green.600',
                  transform: 'translateY(-1px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
                rounded="xl"
              >
                Enable Two-Factor Authentication
              </Button>
            </Box>
          )}

          {show2FASetup && (
            <Box>
              <Alert status="info" rounded="lg" mb={4}>
                <AlertTriangle size={16} />
                <Box ml={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Setup Two-Factor Authentication
                  </Text>
                  <Text fontSize="xs" mt={1}>
                    Scan the QR code with your authenticator app and enter the verification code.
                  </Text>
                </Box>
              </Alert>

              {qrCodeUrl && (
                <Box textAlign="center" mb={4}>
                  <img src={qrCodeUrl} alt="QR Code for 2FA setup" style={{ margin: '0 auto' }} />
                </Box>
              )}

              <form onSubmit={handle2FASubmit(verify2FA)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!twoFactorErrors.verificationCode}>
                    <FormLabel fontSize="sm">Verification Code</FormLabel>
                    <Input
                      {...register2FA('verificationCode')}
                      placeholder="Enter 6-digit code"
                      textAlign="center"
                      fontSize="lg"
                      letterSpacing="0.5em"
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
                    {twoFactorErrors.verificationCode && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        {twoFactorErrors.verificationCode.message}
                      </Text>
                    )}
                  </FormControl>

                  <HStack spacing={3}>
                    <Button
                      variant="ghost"
                      onClick={() => setShow2FASetup(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={is2FALoading}
                      loadingText="Verifying..."
                      leftIcon={<CheckCircle size={18} />}
                      bg="green.500"
                      color="white"
                      _hover={{
                        bg: 'green.600',
                        transform: 'translateY(-1px)',
                        shadow: 'lg',
                      }}
                      _active={{
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.2s"
                      rounded="xl"
                    >
                      Verify & Enable
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </Box>
          )}

          {user?.twoFactorEnabled && (
            <Box>
              <Alert status="success" rounded="lg" mb={4}>
                <CheckCircle size={16} />
                <Box ml={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Two-factor authentication is enabled
                  </Text>
                  <Text fontSize="xs" mt={1}>
                    Your account is protected with an additional security layer.
                  </Text>
                </Box>
              </Alert>

              <Button
                onClick={disable2FA}
                isLoading={is2FALoading}
                loadingText="Disabling..."
                variant="outline"
                colorScheme="red"
                leftIcon={<AlertTriangle size={18} />}
                _hover={{
                  bg: 'red.50',
                  transform: 'translateY(-1px)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
                rounded="xl"
              >
                Disable Two-Factor Authentication
              </Button>
            </Box>
          )}
        </VStack>
      </SettingsSection>
    </VStack>
  );
}

export default SecuritySettings;