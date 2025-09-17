import { apiClient } from '@/services/api';
import { ApiResponse, ApiError, Post, CreatePostForm } from '@/types';

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

// PostService class to test (this would normally be imported)
class PostService {
  private apiClient = apiClient;

  async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<ApiResponse<{ posts: Post[]; pagination: any }>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    return this.apiClient.get(endpoint);
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return this.apiClient.get(`/posts/${postId}`);
  }

  async createPost(postData: CreatePostForm): Promise<ApiResponse<Post>> {
    return this.apiClient.post('/posts', postData);
  }

  async updatePost(postId: string, postData: Partial<CreatePostForm>): Promise<ApiResponse<Post>> {
    return this.apiClient.put(`/posts/${postId}`, postData);
  }

  async deletePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.delete(`/posts/${postId}`);
  }

  async likePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post(`/posts/${postId}/reactions`, { type: 'LIKE' });
  }

  async unlikePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.delete(`/posts/${postId}/reactions?type=LIKE`);
  }

  async repostPost(postId: string): Promise<ApiResponse<Post>> {
    return this.apiClient.post(`/posts/${postId}/reactions`, { type: 'REPOST' });
  }

  async unrepostPost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.delete(`/posts/${postId}/reactions?type=REPOST`);
  }

  async bookmarkPost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.post(`/posts/${postId}/reactions`, { type: 'BOOKMARK' });
  }

  async unbookmarkPost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.apiClient.delete(`/posts/${postId}/reactions?type=BOOKMARK`);
  }

  async getReplies(postId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ posts: Post[]; pagination: any }>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const endpoint = queryString ? `/posts/${postId}/replies?${queryString}` : `/posts/${postId}/replies`;
    return this.apiClient.get(endpoint);
  }

  async replyToPost(postId: string, content: string): Promise<ApiResponse<Post>> {
    return this.apiClient.post(`/posts/${postId}/replies`, { content });
  }

  async uploadMedia(files: File[]): Promise<ApiResponse<{ mediaUrls: string[] }>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });
    return this.apiClient.upload('/posts/media', formData);
  }
}

const postService = new PostService();

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockPost: Post = {
    id: 'post-123',
    content: 'This is a test post',
    authorId: 'user-123',
    author: {
      id: 'user-123',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
      verified: false,
      followersCount: 100,
      followingCount: 50,
      postsCount: 25,
      influenceScore: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    likesCount: 5,
    repliesCount: 2,
    repostsCount: 1,
    isLiked: false,
    isReposted: false,
    isBookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('getPosts', () => {
    const mockPostsResponse = {
      data: {
        posts: [mockPost],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
      success: true,
    };

    it('should get posts without parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsResponse,
      } as Response);

      const result = await postService.getPosts();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );
      expect(result).toEqual(mockPostsResponse);
    });

    it('should get posts with pagination parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsResponse,
      } as Response);

      const params = { page: 2, limit: 10, category: 'politics' };
      await postService.getPosts(params);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts?page=2&limit=10&category=politics',
        expect.any(Object)
      );
    });

    it('should handle empty posts response', async () => {
      const emptyResponse = {
        data: {
          posts: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      } as Response);

      const result = await postService.getPosts();

      expect(result.data.posts).toHaveLength(0);
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(postService.getPosts()).rejects.toThrow('Network error');
    });
  });

  describe('getPost', () => {
    const mockPostDetailResponse = {
      data: {
        ...mockPost,
        replies: [
          {
            ...mockPost,
            id: 'reply-123',
            content: 'This is a reply',
            parentPostId: 'post-123',
          },
        ],
      },
      success: true,
    };

    it('should get a single post by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostDetailResponse,
      } as Response);

      const result = await postService.getPost('post-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts/post-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockPostDetailResponse);
    });

    it('should handle post not found (404)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'NOT_FOUND',
        message: 'Post not found',
        statusCode: 404,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(postService.getPost('nonexistent-post')).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('createPost', () => {
    const mockCreatePostData: CreatePostForm = {
      content: 'This is a new post about politics!',
    };

    const mockCreatePostResponse = {
      data: {
        ...mockPost,
        content: 'This is a new post about politics!',
      },
      success: true,
      message: 'Post created successfully',
    };

    it('should create a new post', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatePostResponse,
      } as Response);

      const result = await postService.createPost(mockCreatePostData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          }),
          body: JSON.stringify(mockCreatePostData),
        })
      );
      expect(result).toEqual(mockCreatePostResponse);
    });

    it('should create a post with images', async () => {
      const postWithImages: CreatePostForm = {
        content: 'Post with media',
        images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatePostResponse,
      } as Response);

      await postService.createPost(postWithImages);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts',
        expect.objectContaining({
          body: JSON.stringify(postWithImages),
        })
      );
    });

    it('should create a reply post', async () => {
      const replyData: CreatePostForm = {
        content: 'This is a reply',
        parentPostId: 'parent-post-123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCreatePostResponse,
      } as Response);

      await postService.createPost(replyData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts',
        expect.objectContaining({
          body: JSON.stringify(replyData),
        })
      );
    });

    it('should handle validation errors (400)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'VALIDATION_ERROR',
        message: 'Content is too long',
        statusCode: 400,
        details: {
          content: 'Content must be 280 characters or less',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => mockErrorResponse,
      } as Response);

      const longContent = 'a'.repeat(300);
      await expect(
        postService.createPost({ content: longContent })
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
        postService.createPost(mockCreatePostData)
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });
  });

  describe('updatePost', () => {
    const mockUpdateData = {
      content: 'Updated post content',
    };

    it('should update a post', async () => {
      const mockUpdateResponse = {
        data: {
          ...mockPost,
          content: 'Updated post content',
          updatedAt: new Date(),
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdateResponse,
      } as Response);

      const result = await postService.updatePost('post-123', mockUpdateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts/post-123',
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
        message: 'Not authorized to edit this post',
        statusCode: 403,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        postService.updatePost('other-user-post', mockUpdateData)
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const mockDeleteResponse = {
        data: { success: true },
        success: true,
        message: 'Post deleted successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeleteResponse,
      } as Response);

      const result = await postService.deletePost('post-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts/post-123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockDeleteResponse);
    });

    it('should handle forbidden deletion (403)', async () => {
      const mockErrorResponse: ApiError = {
        error: 'FORBIDDEN',
        message: 'Not authorized to delete this post',
        statusCode: 403,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(
        postService.deletePost('other-user-post')
      ).rejects.toThrow(JSON.stringify(mockErrorResponse));
    });
  });

  describe('reactions', () => {
    const mockReactionResponse = {
      data: { success: true },
      success: true,
      message: 'Reaction added successfully',
    };

    describe('likePost', () => {
      it('should like a post', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReactionResponse,
        } as Response);

        const result = await postService.likePost('post-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/reactions',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ type: 'LIKE' }),
          })
        );
        expect(result).toEqual(mockReactionResponse);
      });
    });

    describe('unlikePost', () => {
      it('should unlike a post', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReactionResponse,
        } as Response);

        const result = await postService.unlikePost('post-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/reactions?type=LIKE',
          expect.objectContaining({
            method: 'DELETE',
          })
        );
        expect(result).toEqual(mockReactionResponse);
      });
    });

    describe('repostPost', () => {
      it('should repost a post', async () => {
        const mockRepostResponse = {
          data: {
            ...mockPost,
            id: 'repost-123',
            repostOfId: 'post-123',
          },
          success: true,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepostResponse,
        } as Response);

        const result = await postService.repostPost('post-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/reactions',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ type: 'REPOST' }),
          })
        );
        expect(result).toEqual(mockRepostResponse);
      });
    });

    describe('bookmarkPost', () => {
      it('should bookmark a post', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReactionResponse,
        } as Response);

        const result = await postService.bookmarkPost('post-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/reactions',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ type: 'BOOKMARK' }),
          })
        );
        expect(result).toEqual(mockReactionResponse);
      });
    });
  });

  describe('replies', () => {
    const mockRepliesResponse = {
      data: {
        posts: [
          {
            ...mockPost,
            id: 'reply-123',
            content: 'This is a reply',
            parentPostId: 'post-123',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
      success: true,
    };

    describe('getReplies', () => {
      it('should get replies for a post', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepliesResponse,
        } as Response);

        const result = await postService.getReplies('post-123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/replies',
          expect.objectContaining({
            method: 'GET',
          })
        );
        expect(result).toEqual(mockRepliesResponse);
      });

      it('should get replies with pagination', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepliesResponse,
        } as Response);

        await postService.getReplies('post-123', { page: 2, limit: 10 });

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/replies?page=2&limit=10',
          expect.any(Object)
        );
      });
    });

    describe('replyToPost', () => {
      it('should create a reply to a post', async () => {
        const mockReplyResponse = {
          data: {
            ...mockPost,
            id: 'reply-456',
            content: 'This is my reply',
            parentPostId: 'post-123',
          },
          success: true,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReplyResponse,
        } as Response);

        const result = await postService.replyToPost('post-123', 'This is my reply');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/posts/post-123/replies',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ content: 'This is my reply' }),
          })
        );
        expect(result).toEqual(mockReplyResponse);
      });
    });
  });

  describe('uploadMedia', () => {
    it('should upload media files', async () => {
      const mockFiles = [
        new File(['image1'], 'image1.jpg', { type: 'image/jpeg' }),
        new File(['image2'], 'image2.jpg', { type: 'image/jpeg' }),
      ];

      const mockUploadResponse = {
        data: {
          mediaUrls: [
            'http://example.com/image1.jpg',
            'http://example.com/image2.jpg',
          ],
        },
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUploadResponse,
      } as Response);

      const result = await postService.uploadMedia(mockFiles);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/posts/media',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
          body: expect.any(FormData),
        })
      );
      expect(result).toEqual(mockUploadResponse);
    });

    it('should handle file upload errors', async () => {
      const mockFiles = [
        new File(['too-large-file'], 'large.jpg', { type: 'image/jpeg' }),
      ];

      const mockErrorResponse: ApiError = {
        error: 'FILE_TOO_LARGE',
        message: 'File size exceeds limit',
        statusCode: 413,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        statusText: 'Payload Too Large',
        json: async () => mockErrorResponse,
      } as Response);

      await expect(postService.uploadMedia(mockFiles)).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });

  describe('offline behavior', () => {
    it('should handle offline errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(postService.getPosts()).rejects.toThrow('Failed to fetch');
    });

    it('should handle connection timeout', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      mockFetch.mockRejectedValueOnce(timeoutError);

      await expect(postService.createPost({ content: 'test' })).rejects.toThrow(
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

      await expect(postService.getPosts()).rejects.toThrow();
    });

    it('should handle missing required fields in response', async () => {
      const incompleteResponse = {
        // Missing 'data' field
        success: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteResponse,
      } as Response);

      const result = await postService.getPosts();
      expect(result.success).toBe(true);
      // The service should handle missing data gracefully
    });
  });

  describe('error handling', () => {
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

      await expect(postService.getPosts()).rejects.toThrow(
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

      await expect(postService.createPost({ content: 'test' })).rejects.toThrow(
        JSON.stringify(mockErrorResponse)
      );
    });
  });
});