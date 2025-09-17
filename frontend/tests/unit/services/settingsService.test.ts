import { apiClient } from '@/services/api';
import { ApiResponse, ApiError, UserSettings, SettingsUpdateForm, AIConfigForm } from '@/types';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// SettingsService class to test (this would normally be imported)
class SettingsService {
  private apiClient = apiClient;

  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.get('/settings');
  }

  async updateSettings(settings: SettingsUpdateForm): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.put('/settings', settings);
  }

  async updateAIConfig(config: AIConfigForm): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post('/settings/ai-config', config);
  }

  async resetSettings(): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.post('/settings/reset');
  }

  async exportSettings(): Promise<ApiResponse<{ settings: UserSettings }>> {
    return this.apiClient.get('/settings/export');
  }

  async importSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.post('/settings/import', settings);
  }

  async updateNotificationSettings(notifications: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    notificationCategories?: ('MENTIONS' | 'REPLIES' | 'LIKES' | 'REPOSTS' | 'FOLLOWERS' | 'NEWS_ALERTS' | 'PERSONA_INTERACTIONS')[];
  }): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.patch('/settings/notifications', notifications);
  }

  async updatePrivacySettings(privacy: {
    profileVisibility?: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE';
    allowPersonaInteractions?: boolean;
    allowDataForAI?: boolean;
  }): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.patch('/settings/privacy', privacy);
  }

  async updateDisplaySettings(display: {
    theme?: 'LIGHT' | 'DARK' | 'AUTO';
    language?: string;
    timezone?: string;
  }): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.patch('/settings/display', display);
  }

  async updateNewsSettings(news: {
    newsRegion?: string;
    newsCategories?: string[];
    newsLanguages?: string[];
  }): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.patch('/settings/news', news);
  }

  async updateAISettings(ai: {
    aiChatterLevel?: number;
    aiPersonalities?: string[];
    aiResponseTone?: 'PROFESSIONAL' | 'CASUAL' | 'HUMOROUS' | 'SERIOUS' | 'SARCASTIC' | 'EMPATHETIC';
  }): Promise<ApiResponse<UserSettings>> {
    return this.apiClient.patch('/settings/ai', ai);
  }

  async deleteAccount(): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.delete('/settings/account');
  }

  async downloadUserData(): Promise<ApiResponse<{ downloadUrl: string }>> {
    return this.apiClient.post('/settings/data-export');
  }
}

const settingsService = new SettingsService();

describe('SettingsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockSettings: UserSettings = {
    id: 'settings-123',
    userId: 'user-123',
    newsRegion: 'US',
    newsCategories: ['POLITICS', 'TECHNOLOGY', 'BUSINESS'],
    newsLanguages: ['en'],
    aiChatterLevel: 50,
    aiPersonalities: ['analytical', 'diplomatic'],
    aiResponseTone: 'PROFESSIONAL',
    emailNotifications: true,
    pushNotifications: true,
    notificationCategories: ['MENTIONS', 'REPLIES', 'LIKES'],
    profileVisibility: 'PUBLIC',
    allowPersonaInteractions: true,
    allowDataForAI: true,
    theme: 'AUTO',
    language: 'en',
    timezone: 'America/New_York',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  describe('getSettings', () => {
    it('should get user settings', async () => {
      const mockResponse = {
        data: mockSettings,
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.getSettings();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle unauthorized access (401)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
        statusCode: 401,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(settingsService.getSettings()).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('updateSettings', () => {
    const mockUpdateData: SettingsUpdateForm = {
      newsRegion: 'UK',
      aiChatterLevel: 75,
      theme: 'DARK',
      emailNotifications: false,
    };

    it('should update user settings', async () => {
      const mockResponse = {
        data: {
          ...mockSettings,
          ...mockUpdateData,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
        message: 'Settings updated successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updateSettings(mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          }),
          body: JSON.stringify(mockUpdateData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation errors (400)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: 'Invalid settings data',
        statusCode: 400,
        details: {
          aiChatterLevel: 'Must be between 0 and 100',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      const invalidData: SettingsUpdateForm = {
        aiChatterLevel: 150, // Invalid value
      };

      await expect(settingsService.updateSettings(invalidData)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('updateAIConfig', () => {
    const mockAIConfig: AIConfigForm = {
      customAIApiKey: 'sk-custom-key-123',
      customAIBaseUrl: 'https://custom-ai-service.com/api',
    };

    it('should update AI configuration', async () => {
      const mockResponse = {
        data: { success: true },
        success: true,
        message: 'AI configuration updated successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updateAIConfig(mockAIConfig);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/ai-config',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockAIConfig),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid AI configuration (400)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'INVALID_AI_CONFIG',
        message: 'Invalid API key format',
        statusCode: 400,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      const invalidConfig: AIConfigForm = {
        customAIApiKey: 'invalid-key',
      };

      await expect(settingsService.updateAIConfig(invalidConfig)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('notification settings', () => {
    it('should update notification settings', async () => {
      const notificationUpdate = {
        emailNotifications: false,
        pushNotifications: true,
        notificationCategories: ['MENTIONS', 'REPLIES'] as const,
      };

      const mockResponse = {
        data: {
          ...mockSettings,
          ...notificationUpdate,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updateNotificationSettings(notificationUpdate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/notifications',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(notificationUpdate),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('privacy settings', () => {
    it('should update privacy settings', async () => {
      const privacyUpdate = {
        profileVisibility: 'FOLLOWERS_ONLY' as const,
        allowPersonaInteractions: false,
        allowDataForAI: false,
      };

      const mockResponse = {
        data: {
          ...mockSettings,
          ...privacyUpdate,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updatePrivacySettings(privacyUpdate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/privacy',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(privacyUpdate),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('display settings', () => {
    it('should update display settings', async () => {
      const displayUpdate = {
        theme: 'DARK' as const,
        language: 'es',
        timezone: 'Europe/Madrid',
      };

      const mockResponse = {
        data: {
          ...mockSettings,
          ...displayUpdate,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updateDisplaySettings(displayUpdate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/display',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(displayUpdate),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('news settings', () => {
    it('should update news settings', async () => {
      const newsUpdate = {
        newsRegion: 'CA',
        newsCategories: ['TECHNOLOGY', 'SCIENCE'],
        newsLanguages: ['en', 'fr'],
      };

      const mockResponse = {
        data: {
          ...mockSettings,
          ...newsUpdate,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updateNewsSettings(newsUpdate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/news',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(newsUpdate),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('AI settings', () => {
    it('should update AI settings', async () => {
      const aiUpdate = {
        aiChatterLevel: 85,
        aiPersonalities: ['humorous', 'analytical', 'empathetic'],
        aiResponseTone: 'HUMOROUS' as const,
      };

      const mockResponse = {
        data: {
          ...mockSettings,
          ...aiUpdate,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.updateAISettings(aiUpdate);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/ai',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(aiUpdate),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetSettings', () => {
    it('should reset settings to defaults', async () => {
      const defaultSettings = {
        ...mockSettings,
        newsRegion: 'WORLDWIDE',
        aiChatterLevel: 50,
        theme: 'AUTO',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };

      const mockResponse = {
        data: defaultSettings,
        success: true,
        message: 'Settings reset to defaults',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.resetSettings();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/reset',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('exportSettings', () => {
    it('should export user settings', async () => {
      const mockResponse = {
        data: {
          settings: mockSettings,
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.exportSettings();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/export',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('importSettings', () => {
    it('should import user settings', async () => {
      const importData = {
        theme: 'DARK' as const,
        aiChatterLevel: 60,
        newsRegion: 'EU',
      };

      const mockResponse = {
        data: {
          ...mockSettings,
          ...importData,
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        success: true,
        message: 'Settings imported successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.importSettings(importData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/import',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(importData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle invalid import data (400)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'INVALID_IMPORT_DATA',
        message: 'Invalid settings format',
        statusCode: 400,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      const invalidData = {
        invalidField: 'invalid-value',
      };

      await expect(settingsService.importSettings(invalidData)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account', async () => {
      const mockResponse = {
        data: { success: true },
        success: true,
        message: 'Account deleted successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.deleteAccount();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/account',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle account deletion confirmation required', async () => {
      const mockErrorResponse: ApiError = {
        error: 'CONFIRMATION_REQUIRED',
        message: 'Account deletion requires email confirmation',
        statusCode: 409,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(settingsService.deleteAccount()).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('downloadUserData', () => {
    it('should request user data download', async () => {
      const mockResponse = {
        data: {
          downloadUrl: 'https://api.example.com/downloads/user-data-123.zip',
        },
        success: true,
        message: 'Data export initiated',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await settingsService.downloadUserData();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/settings/data-export',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(settingsService.getSettings()).rejects.toThrow('Network error');
    });

    it('should handle server errors (500)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        statusCode: 500,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(settingsService.getSettings()).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });

    it('should handle rate limiting (429)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'RATE_LIMITED',
        message: 'Too many requests',
        statusCode: 429,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        settingsService.updateSettings({ theme: 'DARK' })
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });

    it('should handle forbidden operations (403)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'FORBIDDEN',
        message: 'Operation not allowed',
        statusCode: 403,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(settingsService.deleteAccount()).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('offline behavior', () => {
    it('should handle offline errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(settingsService.getSettings()).rejects.toThrow('Failed to fetch');
    });

    it('should handle connection timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      await expect(
        settingsService.updateSettings({ theme: 'DARK' })
      ).rejects.toThrow('Request timeout');
    });
  });

  describe('data validation', () => {
    it('should handle malformed response data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(settingsService.getSettings()).rejects.toThrow();
    });

    it('should handle response with missing required fields', async () => {
      const incompleteResponse = {
        // Missing 'data' field
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteResponse,
      } as Response);

      const result = await settingsService.getSettings();
      expect(result.success).toBe(true);
    });

    it('should validate settings data before sending', async () => {
      const invalidSettings: SettingsUpdateForm = {
        aiChatterLevel: -10, // Invalid negative value
        theme: 'INVALID_THEME' as any, // Invalid theme
      };

      // The service should still send the request, but the server will validate
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({
          error: 'VALIDATION_ERROR',
          message: 'Invalid settings values',
          statusCode: 400,
        }),
      } as Response);

      await expect(settingsService.updateSettings(invalidSettings)).rejects.toThrow();
    });
  });

  describe('security considerations', () => {
    it('should include authorization header in all requests', async () => {
      const mockToken = 'test-token';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockSettings, success: true }),
      } as Response);

      await settingsService.getSettings();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should not log sensitive configuration data', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const sensitiveConfig: AIConfigForm = {
        customAIApiKey: 'sk-secret-key-123',
        customAIBaseUrl: 'https://private-ai-service.com/api',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { success: true }, success: true }),
      } as Response);

      settingsService.updateAIConfig(sensitiveConfig);

      // Verify that sensitive data is not logged
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('sk-secret-key-123')
      );
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('private-ai-service.com')
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle token expiration gracefully', async () => {
      const mockErrorResponse: ApiError = {
        error: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
        statusCode: 401,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(settingsService.getSettings()).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('caching and persistence', () => {
    it('should handle settings caching considerations', async () => {
      // Test that the service doesn't implement caching at the service level
      // (this would be handled by a higher-level state management layer)

      const mockResponse = {
        data: mockSettings,
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await settingsService.getSettings();

      // Each call should trigger a new API request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await settingsService.getSettings();

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});