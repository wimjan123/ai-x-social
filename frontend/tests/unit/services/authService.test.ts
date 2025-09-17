import { apiClient } from '@/services/api';
import { ApiResponse, ApiError, LoginForm, RegisterForm, User } from '@/types';

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

// AuthService class to test (this would normally be imported)
class AuthService {
  private apiClient = apiClient;

  async login(credentials: LoginForm): Promise<ApiResponse<{ accessToken: string; user: User }>> {
    return this.apiClient.post('/auth/login', credentials);
  }

  async register(userData: RegisterForm): Promise<ApiResponse<{ accessToken: string; user: User }>> {
    return this.apiClient.post('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post('/auth/logout');
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return this.apiClient.post('/auth/refresh');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.apiClient.get('/users/profile');
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post('/auth/reset-password', { token, password });
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.apiClient.put('/users/profile', data);
  }

  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

const authService = new AuthService();

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    const mockCredentials: LoginForm = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockLoginResponse = {
      data: {
        accessToken: 'mock-jwt-token',
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          displayName: 'Test User',
          verified: false,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          influenceScore: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      success: true,
      message: 'Login successful',
    };

    it('should login successfully with valid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginResponse,
      } as Response);

      const result = await authService.login(mockCredentials);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(mockCredentials),
        })
      );
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle 401 unauthorized error', async () => {
      const mockErrorResponse: ApiError = {
        error: 'UNAUTHORIZED',
        message: 'Invalid credentials',
        statusCode: 401,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(authService.login(mockCredentials)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.login(mockCredentials)).rejects.toThrow('Network error');
    });

    it('should handle malformed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(authService.login(mockCredentials)).rejects.toThrow();
    });

    it('should include authorization header when token exists', async () => {
      const mockToken = 'existing-token';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginResponse,
      } as Response);

      await authService.login(mockCredentials);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should handle rate limiting (429 error)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'RATE_LIMITED',
        message: 'Too many login attempts',
        statusCode: 429,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(authService.login(mockCredentials)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('register', () => {
    const mockRegisterData: RegisterForm = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securePassword123',
      displayName: 'New User',
      agreeToTerms: true,
    };

    const mockRegisterResponse = {
      data: {
        accessToken: 'new-jwt-token',
        user: {
          id: 'user-456',
          username: 'newuser',
          email: 'newuser@example.com',
          displayName: 'New User',
          verified: false,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          influenceScore: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      success: true,
      message: 'Registration successful',
    };

    it('should register successfully with valid data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRegisterResponse,
      } as Response);

      const result = await authService.register(mockRegisterData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockRegisterData),
        })
      );
      expect(result).toEqual(mockRegisterResponse);
    });

    it('should handle validation errors (400)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: 'Username already exists',
        statusCode: 400,
        details: {
          username: 'This username is already taken',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(authService.register(mockRegisterData)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });

    it('should handle conflict errors (409)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'CONFLICT',
        message: 'Email already registered',
        statusCode: 409,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(authService.register(mockRegisterData)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockToken = 'valid-token';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      const mockLogoutResponse = {
        data: { success: true },
        success: true,
        message: 'Logout successful',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogoutResponse,
      } as Response);

      const result = await authService.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
      expect(result).toEqual(mockLogoutResponse);
    });

    it('should handle logout without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const mockLogoutResponse = {
        data: { success: true },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLogoutResponse,
      } as Response);

      await authService.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/logout',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String),
          }),
        })
      );
    });
  });

  describe('getCurrentUser', () => {
    const mockUser: User = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      verified: true,
      followersCount: 150,
      followingCount: 75,
      postsCount: 42,
      influenceScore: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get current user successfully', async () => {
      const mockToken = 'valid-token';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      const mockResponse = {
        data: mockUser,
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await authService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/users/profile',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle unauthorized access (401)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'UNAUTHORIZED',
        message: 'Token expired',
        statusCode: 401,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(authService.getCurrentUser()).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('token management', () => {
    describe('setAuthToken', () => {
      it('should store token in localStorage', () => {
        const token = 'new-token';
        authService.setAuthToken(token);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', token);
      });
    });

    describe('removeAuthToken', () => {
      it('should remove token from localStorage', () => {
        authService.removeAuthToken();

        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
      });
    });

    describe('getAuthToken', () => {
      it('should retrieve token from localStorage', () => {
        const mockToken = 'stored-token';
        mockLocalStorage.getItem.mockReturnValue(mockToken);

        const result = authService.getAuthToken();

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(result).toBe(mockToken);
      });

      it('should return null when no token exists', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = authService.getAuthToken();

        expect(result).toBeNull();
      });
    });
  });

  describe('offline behavior', () => {
    it('should handle offline network error', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const credentials: LoginForm = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Failed to fetch');
    });

    it('should handle connection timeout', async () => {
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      const credentials: LoginForm = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.login(credentials)).rejects.toThrow('Network timeout');
    });
  });

  describe('retry mechanism', () => {
    // Note: This would be implemented if the API client had retry logic
    it('should not retry on 4xx errors', async () => {
      const mockErrorResponse: ApiError = {
        error: 'BAD_REQUEST',
        message: 'Invalid data',
        statusCode: 400,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      const credentials: LoginForm = {
        email: 'invalid-email',
        password: 'pass',
      };

      await expect(authService.login(credentials)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('data transformation', () => {
    it('should handle request data transformation', async () => {
      const credentials: LoginForm = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
        rememberMe: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { accessToken: 'token', user: {} },
          success: true,
        }),
      } as Response);

      await authService.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(credentials),
        })
      );
    });

    it('should handle response data transformation', async () => {
      const mockResponse = {
        data: {
          accessToken: 'token-123',
          user: {
            id: 'user-123',
            username: 'testuser',
            email: 'test@example.com',
            displayName: 'Test User',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.data.user.createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(result.success).toBe(true);
    });
  });

  describe('security considerations', () => {
    it('should not log sensitive data', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const credentials: LoginForm = {
        email: 'test@example.com',
        password: 'secretPassword123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { accessToken: 'token', user: {} },
          success: true,
        }),
      } as Response);

      authService.login(credentials);

      // Verify that password is not logged
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('secretPassword123')
      );
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('secretPassword123')
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should handle token storage securely', () => {
      const token = 'sensitive-jwt-token';
      authService.setAuthToken(token);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', token);
      // In a real app, you might want to use more secure storage
    });
  });
});