'use client';

import { useState, useEffect } from 'react';
import { Box, useToast, Skeleton, VStack } from '@chakra-ui/react';
import {
  SettingsLayout,
  GeneralSettings,
  PrivacySettings,
  NotificationSettings,
  AISettings,
  DisplaySettings,
  SecuritySettings,
  type SettingsTab,
} from '@/components/settings';
import { cn, getAnimationClasses } from '@/lib/design-system';
import type { UserSettings } from '@/types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const animations = getAnimationClasses();

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load settings');
        }

        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error loading settings',
          description: 'Please try refreshing the page',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });

        // Set default settings as fallback
        setSettings({
          id: 'default',
          userId: 'user',
          newsRegion: 'WORLDWIDE',
          newsCategories: ['POLITICS', 'WORLD'],
          newsLanguages: ['en'],
          aiChatterLevel: 5,
          aiPersonalities: ['moderate'],
          aiResponseTone: 'PROFESSIONAL',
          emailNotifications: true,
          pushNotifications: true,
          notificationCategories: ['MENTIONS', 'REPLIES', 'FOLLOWERS'],
          profileVisibility: 'PUBLIC',
          allowPersonaInteractions: true,
          allowDataForAI: false,
          theme: 'AUTO',
          timezone: 'UTC',
          language: 'en',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  // Handle settings update
  const handleSettingsUpdate = async (newSettings: UserSettings) => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSettings(newSettings);
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <VStack spacing={6} className={cn(animations.fadeIn)}>
          <Skeleton height="60px" width="100%" />
          <Skeleton height="400px" width="100%" />
        </VStack>
      </SettingsLayout>
    );
  }

  // Render active settings component
  const renderActiveSettings = () => {
    if (!settings) return null;

    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettings
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        );
      case 'ai':
        return (
          <AISettings
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        );
      case 'display':
        return (
          <DisplaySettings
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Box className={cn('min-h-full', animations.fadeIn)}>
        {renderActiveSettings()}
      </Box>
    </SettingsLayout>
  );
}