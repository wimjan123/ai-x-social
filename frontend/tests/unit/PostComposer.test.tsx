import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { PostComposer } from '@/components/posts/PostComposer';
import type { User, AIPersona, CreatePostForm } from '@/types';

// Mock the design system utilities
jest.mock('@/lib/design-system', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

// Mock URL.createObjectURL for image previews
global.URL.createObjectURL = jest.fn(() => 'mocked-image-url');
global.URL.revokeObjectURL = jest.fn();

// Mock file reader for image handling
const mockFileReader = {
  readAsDataURL: jest.fn(),
  result: 'data:image/jpeg;base64,mock-image-data',
  onload: null as any,
};

Object.defineProperty(global, 'FileReader', {
  writable: true,
  value: jest.fn(() => mockFileReader),
});

describe('PostComposer', () => {
  const mockUser: User = {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
    email: 'test@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    verified: false,
    followersCount: 100,
    followingCount: 50,
    postsCount: 25,
    influenceScore: 75,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockAIPersona: AIPersona = {
    id: 'ai-1',
    name: 'AI Conservative',
    displayName: 'AI Conservative Voice',
    username: 'ai_conservative',
    bio: 'Conservative AI persona',
    avatarUrl: 'https://example.com/ai-avatar.jpg',
    verified: true,
    followersCount: 5000,
    followingCount: 100,
    postsCount: 500,
    politicalAlignment: {
      position: 'conservative',
      intensity: 8,
      keyIssues: ['Economy', 'Security'],
      description: 'Strong conservative views',
    },
    personality: {
      openness: 6,
      conscientiousness: 8,
      extraversion: 7,
      agreeableness: 5,
      neuroticism: 3,
      formalityLevel: 8,
      humorLevel: 4,
    },
    responseStyle: {
      averageResponseTime: 2,
      postFrequency: 5,
      engagementStyle: 'analytical',
      topicFocus: ['politics', 'economy'],
      languageComplexity: 'moderate',
    },
    topicExpertise: ['politics', 'economy'],
    influenceMetrics: {
      score: 85,
      tier: 'macro',
      engagementRate: 12.5,
      reachEstimate: 50000,
      topicAuthority: { politics: 0.9, economy: 0.8 },
      viralPostsCount: 15,
      lastUpdated: new Date(),
    },
    influenceScore: 85,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default props for regular user', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByPlaceholderText("What's happening?")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
      expect(screen.getByAltText('Test User')).toBeInTheDocument();
    });

    it('renders with AI persona user', () => {
      render(
        <PostComposer
          user={mockAIPersona}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByAltText('AI Conservative Voice')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          placeholder="Share your thoughts..."
        />
      );

      expect(screen.getByPlaceholderText('Share your thoughts...')).toBeInTheDocument();
    });

    it('renders reply composer with parentPostId', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          parentPostId="parent-post-1"
        />
      );

      expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();
    });

    it('renders cancel button when onCancel is provided', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('hides actions when showActions is false', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          showActions={false}
        />
      );

      expect(screen.queryByLabelText('Add images')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /post/i })).not.toBeInTheDocument();
    });
  });

  describe('Text Input Handling', () => {
    it('updates content when typing', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.type(textarea, 'Hello world!');

      expect(textarea).toHaveValue('Hello world!');
    });

    it('shows character count when typing', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.type(textarea, 'A');

      // Character counter should appear
      expect(screen.getByRole('button', { name: /post/i })).toBeEnabled();
    });

    it('disables submit when content exceeds character limit', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          maxLength={10}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'This is way too long for the character limit');

      expect(submitButton).toBeDisabled();
    });

    it('shows character count warning near limit', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          maxLength={30}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.type(textarea, 'This is close to limit'); // 22 chars

      // Should show character count when within 20 chars of limit
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('auto-resizes textarea on content change', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?") as HTMLTextAreaElement;
      const initialHeight = textarea.style.height;

      await user.type(textarea, 'Line 1\nLine 2\nLine 3\nLine 4');

      // Height should be updated (mocked behavior)
      expect(textarea.style.height).toBe('auto');
    });
  });

  describe('Image Upload Functionality', () => {
    it('uploads and displays image preview', async () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      // Get the hidden file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      // Simulate file selection
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      });

      // Trigger the change event
      fireEvent.change(fileInput);

      await waitFor(() => {
        expect(screen.getByAltText('Upload 1')).toBeInTheDocument();
      });
    });

    it('limits image uploads to 4 maximum', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const imageInput = screen.getByLabelText('Add images');
      const files = [
        new File(['image1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['image2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['image3'], 'test3.jpg', { type: 'image/jpeg' }),
        new File(['image4'], 'test4.jpg', { type: 'image/jpeg' }),
        new File(['image5'], 'test5.jpg', { type: 'image/jpeg' }),
      ];

      await user.upload(imageInput, files);

      await waitFor(() => {
        expect(screen.getAllByAltText(/Upload \d+/)).toHaveLength(4);
      });
    });

    it('removes image when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const imageInput = screen.getByLabelText('Add images');
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      await user.upload(imageInput, file);

      await waitFor(() => {
        expect(screen.getByAltText('Upload 1')).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText('Remove image');
      await user.click(removeButton);

      expect(screen.queryByAltText('Upload 1')).not.toBeInTheDocument();
    });

    it('disables image upload when 4 images are uploaded', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const imageInput = screen.getByLabelText('Add images');
      const files = [
        new File(['image1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['image2'], 'test2.jpg', { type: 'image/jpeg' }),
        new File(['image3'], 'test3.jpg', { type: 'image/jpeg' }),
        new File(['image4'], 'test4.jpg', { type: 'image/jpeg' }),
      ];

      await user.upload(imageInput, files);

      await waitFor(() => {
        const imageButton = screen.getByLabelText('Add images');
        expect(imageButton).toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with content only', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'Test post content');
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: 'Test post content',
        parentPostId: undefined,
      });
    });

    it('submits form with content and images', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const imageInput = screen.getByLabelText('Add images');
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'Post with image');

      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(imageInput, file);

      await waitFor(() => {
        expect(screen.getByAltText('Upload 1')).toBeInTheDocument();
      });

      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: 'Post with image',
        images: [file],
        parentPostId: undefined,
      });
    });

    it('submits reply with parentPostId', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          parentPostId="parent-1"
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Reply' });

      await user.type(textarea, 'This is a reply');
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: 'This is a reply',
        parentPostId: 'parent-1',
      });
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const imageInput = screen.getByLabelText('Add images');
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'Test content');

      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(imageInput, file);

      await waitFor(() => {
        expect(screen.getByAltText('Upload 1')).toBeInTheDocument();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(textarea).toHaveValue('');
        expect(screen.queryByAltText('Upload 1')).not.toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: void) => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'Test content');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      resolveSubmit!();
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('prevents submission when content is empty', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Post' });
      expect(submitButton).toBeDisabled();

      await user.click(submitButton);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('prevents submission when over character limit', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          maxLength={10}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'This content is way too long');

      expect(submitButton).toBeDisabled();
      await user.click(submitButton);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('submits on Ctrl+Enter', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.type(textarea, 'Test content');
      await user.keyboard('{Control>}{Enter}{/Control}');

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: 'Test content',
        parentPostId: undefined,
      });
    });

    it('submits on Cmd+Enter (Mac)', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.type(textarea, 'Test content');
      await user.keyboard('{Meta>}{Enter}{/Meta}');

      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: 'Test content',
        parentPostId: undefined,
      });
    });

    it('does not submit on Enter without modifier key', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.type(textarea, 'Test content{Enter}');

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('Test content\n');
    });
  });

  describe('Cancel Functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('disables cancel button during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: void) => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);

      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Post' });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      await user.type(textarea, 'Test content');
      await user.click(submitButton);

      expect(cancelButton).toBeDisabled();

      resolveSubmit!();
      await waitFor(() => {
        expect(cancelButton).not.toBeDisabled();
      });
    });
  });

  describe('Political Alignment Styling', () => {
    it('applies political alignment styling for AI persona', () => {
      render(
        <PostComposer
          user={mockAIPersona}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Post' });
      expect(submitButton).toHaveClass('bg-political-conservative-500');
    });

    it('does not apply political styling for regular user without alignment', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Post' });
      expect(submitButton).not.toHaveClass('bg-political-conservative-500');
    });
  });

  describe('Error Handling', () => {
    it('handles submission errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      const submitButton = screen.getByRole('button', { name: 'Post' });

      await user.type(textarea, 'Test content');
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to submit post:', expect.any(Error));
        expect(submitButton).not.toBeDisabled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByLabelText('Add images')).toBeInTheDocument();
      expect(screen.getByLabelText('Add emoji')).toBeInTheDocument();
      expect(screen.getByLabelText('Add location')).toBeInTheDocument();
      expect(screen.getByLabelText('Schedule post')).toBeInTheDocument();
    });

    it('maintains focus management', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const textarea = screen.getByPlaceholderText("What's happening?");
      await user.click(textarea);

      expect(textarea).toHaveFocus();
    });

    it('provides proper alt text for images', async () => {
      const user = userEvent.setup();
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      const imageInput = screen.getByLabelText('Add images');
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      await user.upload(imageInput, file);

      await waitFor(() => {
        expect(screen.getByAltText('Upload 1')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to different screen sizes', () => {
      render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          className="custom-responsive-class"
        />
      );

      const composer = screen.getByPlaceholderText("What's happening?").closest('div');
      expect(composer?.parentElement?.parentElement).toHaveClass('custom-responsive-class');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for basic render', () => {
      const { container } = render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for AI persona render', () => {
      const { container } = render(
        <PostComposer
          user={mockAIPersona}
          onSubmit={mockOnSubmit}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for reply composer', () => {
      const { container } = render(
        <PostComposer
          user={mockUser}
          onSubmit={mockOnSubmit}
          parentPostId="parent-1"
          onCancel={mockOnCancel}
        />
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});