'use client';

import { useState, useEffect } from 'react';
import { Spinner, Box, Alert, AlertIcon, Text } from '@chakra-ui/react';
import {
  SettingsLayout,
  GeneralSettings,
  PrivacySettings,
  NotificationSettings,
  AISettings,
  DisplaySettings,
  SecuritySettings,
  type SettingsTab
} from './index';
import { apiClient } from '@/services/api';
import type { UserSettings } from '@/types';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.get<UserSettings>('/settings');

      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        setError('Failed to load settings');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load settings';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsUpdate = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="50vh"
      >
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Alert status="error" rounded="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Failed to Load Settings</Text>
            <Text fontSize="sm" mt={1}>{error}</Text>
          </Box>
        </Alert>
      </Box>
    );
  }

  const renderTabContent = () => {
    const commonProps = {
      settings,
      onSettingsUpdate: handleSettingsUpdate,
    };

    switch (activeTab) {
      case 'general':
        return <GeneralSettings {...commonProps} />;
      case 'privacy':
        return <PrivacySettings {...commonProps} />;
      case 'notifications':
        return <NotificationSettings {...commonProps} />;
      case 'ai':
        return <AISettings {...commonProps} />;
      case 'display':
        return <DisplaySettings {...commonProps} />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <GeneralSettings {...commonProps} />;
    }
  };

  return (
    <SettingsLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
    </SettingsLayout>
  );
}

export default SettingsPage;