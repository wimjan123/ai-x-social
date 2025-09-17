import { apiClient } from '@/services/api';
import { ApiResponse, ApiError, AIPersona } from '@/types';

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

// Types for persona operations
interface CreatePersonaForm {
  name: string;
  handle: string;
  bio: string;
  personaType: 'POLITICIAN' | 'INFLUENCER' | 'JOURNALIST' | 'ACTIVIST' | 'BUSINESS' | 'ENTERTAINER';
  personalityTraits?: string[];
  interests?: string[];
  expertise?: string[];
  toneStyle?: 'PROFESSIONAL' | 'CASUAL' | 'HUMOROUS' | 'SERIOUS' | 'SARCASTIC' | 'EMPATHETIC';
  controversyTolerance?: number;
  engagementFrequency?: number;
  debateAggression?: number;
}

interface UpdatePersonaForm {
  name?: string;
  bio?: string;
  personalityTraits?: string[];
  interests?: string[];
  expertise?: string[];
  toneStyle?: 'PROFESSIONAL' | 'CASUAL' | 'HUMOROUS' | 'SERIOUS' | 'SARCASTIC' | 'EMPATHETIC';
  controversyTolerance?: number;
  engagementFrequency?: number;
  debateAggression?: number;
  isActive?: boolean;
}

interface PersonaReplyRequest {
  context: string;
  postId?: string;
  newsItemId?: string;
}

// PersonaService class to test (this would normally be imported)
class PersonaService {
  private apiClient = apiClient;

  async getPersonas(params?: {
    type?: string;
    active?: boolean;
  }): Promise<ApiResponse<AIPersona[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const endpoint = queryString ? `/personas?${queryString}` : '/personas';
    return this.apiClient.get(endpoint);
  }

  async getPersona(personaId: string): Promise<ApiResponse<AIPersona>> {
    return this.apiClient.get(`/personas/${personaId}`);
  }

  async createPersona(personaData: CreatePersonaForm): Promise<ApiResponse<AIPersona>> {
    return this.apiClient.post('/personas', personaData);
  }

  async updatePersona(personaId: string, personaData: UpdatePersonaForm): Promise<ApiResponse<AIPersona>> {
    return this.apiClient.put(`/personas/${personaId}`, personaData);
  }

  async deletePersona(personaId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.delete(`/personas/${personaId}`);
  }

  async triggerPersonaReply(personaId: string, request: PersonaReplyRequest): Promise<ApiResponse<any>> {
    return this.apiClient.post(`/personas/${personaId}/reply`, request);
  }

  async getPersonaMetrics(personaId: string): Promise<ApiResponse<any>> {
    return this.apiClient.get(`/personas/${personaId}/metrics`);
  }

  async activatePersona(personaId: string): Promise<ApiResponse<AIPersona>> {
    return this.apiClient.patch(`/personas/${personaId}`, { isActive: true });
  }

  async deactivatePersona(personaId: string): Promise<ApiResponse<AIPersona>> {
    return this.apiClient.patch(`/personas/${personaId}`, { isActive: false });
  }

  async getPersonaPosts(personaId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const endpoint = queryString ? `/personas/${personaId}/posts?${queryString}` : `/personas/${personaId}/posts`;
    return this.apiClient.get(endpoint);
  }
}

const personaService = new PersonaService();

describe('PersonaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockPersona: AIPersona = {
    id: 'persona-123',
    name: 'Political Pete',
    displayName: 'Political Pete',
    username: 'political_pete',
    bio: 'AI persona focused on political discourse and policy analysis',
    avatarUrl: 'https://example.com/avatar.jpg',
    verified: false,
    followersCount: 2500,
    followingCount: 150,
    postsCount: 342,
    politicalAlignment: {
      position: 'liberal',
      intensity: 7,
      keyIssues: ['healthcare', 'education', 'climate'],
      description: 'Progressive stance on social issues',
    },
    personality: {
      openness: 8,
      conscientiousness: 7,
      extraversion: 9,
      agreeableness: 6,
      neuroticism: 3,
      formalityLevel: 6,
      humorLevel: 7,
    },
    responseStyle: {
      averageResponseTime: 15,
      postFrequency: 3,
      engagementStyle: 'analytical',
      topicFocus: ['politics', 'policy', 'economics'],
      languageComplexity: 'moderate',
    },
    topicExpertise: ['politics', 'policy', 'economics'],
    influenceMetrics: {
      score: 75,
      tier: 'macro',
      engagementRate: 4.2,
      reachEstimate: 50000,
      topicAuthority: {
        politics: 85,
        economics: 70,
        healthcare: 65,
      },
      viralPostsCount: 12,
      lastUpdated: new Date(),
    },
    influenceScore: 75,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getPersonas', () => {
    const mockPersonasResponse = {
      data: [mockPersona],
      success: true,
    };

    it('should get all personas without parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonasResponse,
      } as Response);

      const result = await personaService.getPersonas();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
      expect(result).toEqual(mockPersonasResponse);
    });

    it('should get personas with type filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonasResponse,
      } as Response);

      await personaService.getPersonas({ type: 'POLITICIAN' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas?type=POLITICIAN',
        expect.any(Object)
      );
    });

    it('should get active personas only', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonasResponse,
      } as Response);

      await personaService.getPersonas({ active: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas?active=true',
        expect.any(Object)
      );
    });

    it('should handle empty personas response', async () => {
      const emptyResponse = {
        data: [],
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response);

      const result = await personaService.getPersonas();

      expect(result.data).toHaveLength(0);
    });
  });

  describe('getPersona', () => {
    it('should get a single persona by ID', async () => {
      const mockPersonaResponse = {
        data: mockPersona,
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonaResponse,
      } as Response);

      const result = await personaService.getPersona('persona-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockPersonaResponse);
    });

    it('should handle persona not found (404)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'NOT_FOUND',
        message: 'Persona not found',
        statusCode: 404,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(personaService.getPersona('nonexistent-persona')).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('createPersona', () => {
    const mockCreatePersonaData: CreatePersonaForm = {
      name: 'Tech Innovator',
      handle: 'tech_innovator',
      bio: 'AI persona focused on technology and innovation',
      personaType: 'BUSINESS',
      personalityTraits: ['innovative', 'analytical', 'forward-thinking'],
      interests: ['technology', 'startups', 'AI'],
      expertise: ['tech', 'business', 'innovation'],
      toneStyle: 'PROFESSIONAL',
      controversyTolerance: 30,
      engagementFrequency: 70,
      debateAggression: 40,
    };

    const mockCreatePersonaResponse = {
      data: {
        ...mockPersona,
        name: 'Tech Innovator',
        username: 'tech_innovator',
        bio: 'AI persona focused on technology and innovation',
      },
      success: true,
      message: 'Persona created successfully',
    };

    it('should create a new persona', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatePersonaResponse,
      } as Response);

      const result = await personaService.createPersona(mockCreatePersonaData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          }),
          body: JSON.stringify(mockCreatePersonaData),
        })
      );
      expect(result).toEqual(mockCreatePersonaResponse);
    });

    it('should handle validation errors (400)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: 'Handle already exists',
        statusCode: 400,
        details: {
          handle: 'This handle is already taken',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        personaService.createPersona(mockCreatePersonaData)
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });

    it('should handle unauthorized errors (401)', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

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

      await expect(
        personaService.createPersona(mockCreatePersonaData)
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });
  });

  describe('updatePersona', () => {
    const mockUpdateData: UpdatePersonaForm = {
      bio: 'Updated bio for the persona',
      toneStyle: 'HUMOROUS',
      controversyTolerance: 60,
    };

    it('should update a persona', async () => {
      const mockUpdateResponse = {
        data: {
          ...mockPersona,
          bio: 'Updated bio for the persona',
          updatedAt: new Date(),
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdateResponse,
      } as Response);

      const result = await personaService.updatePersona('persona-123', mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockUpdateData),
        })
      );
      expect(result).toEqual(mockUpdateResponse);
    });

    it('should handle forbidden errors (403)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'FORBIDDEN',
        message: 'Not authorized to edit this persona',
        statusCode: 403,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        personaService.updatePersona('other-user-persona', mockUpdateData)
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });
  });

  describe('deletePersona', () => {
    it('should delete a persona', async () => {
      const mockDeleteResponse = {
        data: { success: true },
        success: true,
        message: 'Persona deleted successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeleteResponse,
      } as Response);

      const result = await personaService.deletePersona('persona-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockDeleteResponse);
    });
  });

  describe('triggerPersonaReply', () => {
    const mockReplyRequest: PersonaReplyRequest = {
      context: 'What do you think about the new climate policy?',
      postId: 'post-123',
    };

    it('should trigger AI persona reply', async () => {
      const mockReplyResponse = {
        data: {
          id: 'ai-post-123',
          content: 'As an AI focused on policy analysis, I think this climate policy...',
          authorId: 'persona-123',
          isAIGenerated: true,
          createdAt: new Date(),
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReplyResponse,
      } as Response);

      const result = await personaService.triggerPersonaReply('persona-123', mockReplyRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123/reply',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockReplyRequest),
        })
      );
      expect(result).toEqual(mockReplyResponse);
    });

    it('should handle AI service unavailable (503)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'SERVICE_UNAVAILABLE',
        message: 'AI service is currently unavailable',
        statusCode: 503,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        personaService.triggerPersonaReply('persona-123', mockReplyRequest)
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });

    it('should trigger reply to news item', async () => {
      const newsReplyRequest: PersonaReplyRequest = {
        context: 'Latest political development in healthcare policy',
        newsItemId: 'news-456',
      };

      const mockReplyResponse = {
        data: {
          id: 'ai-post-456',
          content: 'This healthcare policy development represents...',
          authorId: 'persona-123',
          isAIGenerated: true,
          newsItemId: 'news-456',
          createdAt: new Date(),
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReplyResponse,
      } as Response);

      const result = await personaService.triggerPersonaReply('persona-123', newsReplyRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123/reply',
        expect.objectContaining({
          body: JSON.stringify(newsReplyRequest),
        })
      );
      expect(result).toEqual(mockReplyResponse);
    });
  });

  describe('persona activation', () => {
    describe('activatePersona', () => {
      it('should activate a persona', async () => {
        const mockActivateResponse = {
          data: {
            ...mockPersona,
            isActive: true,
            updatedAt: new Date(),
          },
          success: true,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockActivateResponse,
        } as Response);

        const result = await personaService.activatePersona('persona-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/personas/persona-123',
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ isActive: true }),
          })
        );
        expect(result).toEqual(mockActivateResponse);
      });
    });

    describe('deactivatePersona', () => {
      it('should deactivate a persona', async () => {
        const mockDeactivateResponse = {
          data: {
            ...mockPersona,
            isActive: false,
            updatedAt: new Date(),
          },
          success: true,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockDeactivateResponse,
        } as Response);

        const result = await personaService.deactivatePersona('persona-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/personas/persona-123',
          expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ isActive: false }),
          })
        );
        expect(result).toEqual(mockDeactivateResponse);
      });
    });
  });

  describe('getPersonaMetrics', () => {
    it('should get persona metrics', async () => {
      const mockMetricsResponse = {
        data: {
          influenceScore: 75,
          engagementRate: 4.2,
          averageResponseTime: 15,
          totalPosts: 342,
          totalInteractions: 12580,
          topTopics: ['politics', 'policy', 'economics'],
          sentimentAnalysis: {
            positive: 65,
            neutral: 25,
            negative: 10,
          },
          performanceMetrics: {
            likesPerPost: 23.5,
            repliesPerPost: 8.2,
            repostsPerPost: 4.1,
          },
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetricsResponse,
      } as Response);

      const result = await personaService.getPersonaMetrics('persona-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123/metrics',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockMetricsResponse);
    });
  });

  describe('getPersonaPosts', () => {
    it('should get persona posts', async () => {
      const mockPostsResponse = {
        data: {
          posts: [
            {
              id: 'post-123',
              content: 'AI-generated post about politics',
              authorId: 'persona-123',
              isAIGenerated: true,
              likesCount: 45,
              repliesCount: 12,
              repostsCount: 8,
              createdAt: new Date(),
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 342,
            totalPages: 18,
          },
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsResponse,
      } as Response);

      const result = await personaService.getPersonaPosts('persona-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123/posts',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockPostsResponse);
    });

    it('should get persona posts with pagination', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { posts: [], pagination: {} }, success: true }),
      } as Response);

      await personaService.getPersonaPosts('persona-123', { page: 2, limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/personas/persona-123/posts?page=2&limit=10',
        expect.any(Object)
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(personaService.getPersonas()).rejects.toThrow('Network error');
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

      await expect(personaService.getPersonas()).rejects.toThrow(
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

      const createData: CreatePersonaForm = {
        name: 'Test',
        handle: 'test',
        bio: 'Test bio',
        personaType: 'POLITICIAN',
      };

      await expect(personaService.createPersona(createData)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('offline behavior', () => {
    it('should handle offline errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(personaService.getPersonas()).rejects.toThrow('Failed to fetch');
    });

    it('should handle connection timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      const createData: CreatePersonaForm = {
        name: 'Test',
        handle: 'test',
        bio: 'Test bio',
        personaType: 'POLITICIAN',
      };

      await expect(personaService.createPersona(createData)).rejects.toThrow(
        'Request timeout'
      );
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

      await expect(personaService.getPersonas()).rejects.toThrow();
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

      const result = await personaService.getPersonas();
      expect(result.success).toBe(true);
    });
  });

  describe('security considerations', () => {
    it('should include authorization header in all requests', async () => {
      const mockToken = 'test-token';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], success: true }),
      } as Response);

      await personaService.getPersonas();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
          }),
        })
      );
    });

    it('should not log sensitive persona data', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const sensitiveData: CreatePersonaForm = {
        name: 'Secret Agent',
        handle: 'secret_agent',
        bio: 'Classified information',
        personaType: 'BUSINESS',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPersona, success: true }),
      } as Response);

      personaService.createPersona(sensitiveData);

      // Verify that sensitive data is not logged
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Classified information')
      );
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('secret_agent')
      );

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});