import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersonaIndicator } from '@/components/profile/PersonaIndicator';
import type { User, AIPersona } from '@/types';

// Mock the design system utilities
jest.mock('@/lib/design-system', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
  getPoliticalColorClasses: (position: string, shade: number) => `political-${position}-${shade}`,
  getPoliticalDisplayName: (position: string) => {
    const names: Record<string, string> = {
      conservative: 'Conservative',
      liberal: 'Liberal',
      progressive: 'Progressive',
      libertarian: 'Libertarian',
      independent: 'Independent',
    };
    return names[position] || position;
  },
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Bot: ({ className, ...props }: any) => <div data-testid="bot-icon" className={className} {...props} />,
  User: ({ className, ...props }: any) => <div data-testid="user-icon" className={className} {...props} />,
  Shield: ({ className, ...props }: any) => <div data-testid="shield-icon" className={className} {...props} />,
  Zap: ({ className, ...props }: any) => <div data-testid="zap-icon" className={className} {...props} />,
}));

describe('PersonaCard (PersonaIndicator)', () => {
  const mockRegularUser: User = {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
    email: 'test@example.com',
    verified: false,
    followersCount: 500,
    followingCount: 200,
    postsCount: 50,
    influenceScore: 45,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockVerifiedUser: User = {
    ...mockRegularUser,
    id: 'user-2',
    username: 'verifieduser',
    displayName: 'Verified User',
    verified: true,
    followersCount: 50000,
    influenceScore: 80,
  };

  const mockMegaInfluencer: User = {
    ...mockRegularUser,
    id: 'user-3',
    username: 'megainfluencer',
    displayName: 'Mega Influencer',
    verified: true,
    followersCount: 250000,
    influenceScore: 95,
  };

  const mockCelebrity: User = {
    ...mockRegularUser,
    id: 'user-4',
    username: 'celebrity',
    displayName: 'Celebrity User',
    verified: true,
    followersCount: 2000000,
    influenceScore: 100,
  };

  const mockUserWithPoliticalAlignment: User = {
    ...mockRegularUser,
    id: 'user-5',
    username: 'politicaluser',
    displayName: 'Political User',
    politicalAlignment: {
      position: 'conservative',
      intensity: 8,
      keyIssues: ['Economy', 'Security'],
      description: 'Strong conservative values',
    },
  };

  const mockAIPersona: AIPersona = {
    id: 'ai-1',
    name: 'AI Liberal Voice',
    displayName: 'Progressive AI',
    username: 'ai_progressive',
    bio: 'AI with progressive political views',
    avatarUrl: 'https://example.com/ai-avatar.jpg',
    verified: true,
    followersCount: 75000,
    followingCount: 150,
    postsCount: 800,
    politicalAlignment: {
      position: 'progressive',
      intensity: 9,
      keyIssues: ['Climate Change', 'Social Justice', 'Healthcare'],
      description: 'Strong progressive advocacy',
    },
    personality: {
      openness: 9,
      conscientiousness: 7,
      extraversion: 8,
      agreeableness: 8,
      neuroticism: 3,
      formalityLevel: 6,
      humorLevel: 7,
    },
    responseStyle: {
      averageResponseTime: 1.5,
      postFrequency: 8,
      engagementStyle: 'emotional',
      topicFocus: ['politics', 'social-justice', 'environment'],
      languageComplexity: 'complex',
    },
    topicExpertise: ['politics', 'environment', 'social-issues'],
    influenceMetrics: {
      score: 88,
      tier: 'mega',
      engagementRate: 15.2,
      reachEstimate: 85000,
      topicAuthority: {
        politics: 0.95,
        environment: 0.87,
        'social-justice': 0.92,
      },
      viralPostsCount: 25,
      lastUpdated: new Date(),
    },
    influenceScore: 88,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockAIPersonaWithCelebrity: AIPersona = {
    ...mockAIPersona,
    id: 'ai-2',
    username: 'ai_celebrity',
    displayName: 'Celebrity AI',
    followersCount: 5000000,
    influenceMetrics: {
      ...mockAIPersona.influenceMetrics,
      tier: 'celebrity',
      score: 98,
    },
  };

  describe('Basic Rendering', () => {
    it('renders regular user with default size', () => {
      render(<PersonaIndicator user={mockRegularUser} />);

      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByTestId('user-icon')).toHaveClass('w-4', 'h-4', 'text-x-light-gray');
    });

    it('renders verified user with shield icon', () => {
      render(<PersonaIndicator user={mockVerifiedUser} />);

      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
      expect(screen.getByTestId('shield-icon')).toHaveClass('w-4', 'h-4', 'text-x-blue');
    });

    it('renders AI persona with bot icon', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      expect(screen.getByTestId('bot-icon')).toBeInTheDocument();
      expect(screen.getByTestId('bot-icon')).toHaveClass('w-4', 'h-4', 'text-x-blue');
    });

    it('renders with small size', () => {
      render(<PersonaIndicator user={mockRegularUser} size="sm" />);

      expect(screen.getByTestId('user-icon')).toHaveClass('w-3', 'h-3');
      const container = screen.getByTestId('user-icon').closest('div');
      expect(container).toHaveClass('text-xs');
    });

    it('renders with large size', () => {
      render(<PersonaIndicator user={mockRegularUser} size="lg" />);

      expect(screen.getByTestId('user-icon')).toHaveClass('w-5', 'h-5');
      const container = screen.getByTestId('user-icon').closest('div');
      expect(container).toHaveClass('text-base');
    });

    it('applies custom className', () => {
      render(<PersonaIndicator user={mockRegularUser} className="custom-class" />);

      const container = screen.getByTestId('user-icon').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Political Alignment Badge', () => {
    it('renders political alignment badge for user with alignment', () => {
      render(<PersonaIndicator user={mockUserWithPoliticalAlignment} />);

      const badge = screen.getByTitle('Political alignment: Conservative');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-political-conservative-500');
      expect(badge).toHaveTextContent('C'); // First letter when showLabel is false
    });

    it('renders full political alignment label when showLabel is true', () => {
      render(<PersonaIndicator user={mockUserWithPoliticalAlignment} showLabel />);

      const badge = screen.getByTitle('Political alignment: Conservative');
      expect(badge).toHaveTextContent('Conservative');
    });

    it('renders political alignment for AI persona', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      const badge = screen.getByTitle('Political alignment: Progressive');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-political-progressive-500');
      expect(badge).toHaveTextContent('P');
    });

    it('does not render political badge for user without alignment', () => {
      render(<PersonaIndicator user={mockRegularUser} />);

      expect(screen.queryByTitle(/Political alignment:/)).not.toBeInTheDocument();
    });

    it('applies correct badge size for different component sizes', () => {
      const { rerender } = render(
        <PersonaIndicator user={mockUserWithPoliticalAlignment} size="sm" />
      );

      let badge = screen.getByTitle('Political alignment: Conservative');
      expect(badge).toHaveClass('px-1.5', 'py-0.5', 'text-xs');

      rerender(<PersonaIndicator user={mockUserWithPoliticalAlignment} size="lg" />);

      badge = screen.getByTitle('Political alignment: Conservative');
      expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
    });
  });

  describe('Influence Level Indicators', () => {
    it('does not show influence indicator for micro influencers', () => {
      render(<PersonaIndicator user={mockRegularUser} />); // 500 followers = micro

      expect(screen.queryByTestId('zap-icon')).not.toBeInTheDocument();
    });

    it('shows macro influence indicator for 10k+ followers', () => {
      render(<PersonaIndicator user={mockVerifiedUser} />); // 50k followers = macro

      const indicator = screen.getByTitle('Influence level: macro');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('from-purple-400', 'to-pink-500');
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('shows mega influence indicator for 100k+ followers', () => {
      render(<PersonaIndicator user={mockMegaInfluencer} />); // 250k followers = mega

      const indicator = screen.getByTitle('Influence level: mega');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('from-yellow-400', 'to-yellow-600');
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('shows celebrity influence indicator for 1M+ followers', () => {
      render(<PersonaIndicator user={mockCelebrity} />); // 2M followers = celebrity

      const indicator = screen.getByTitle('Influence level: celebrity');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('from-orange-400', 'to-red-500');
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('uses AI persona influence metrics when available', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      const indicator = screen.getByTitle('Influence level: mega');
      expect(indicator).toBeInTheDocument();
    });

    it('shows celebrity tier for AI persona with celebrity metrics', () => {
      render(<PersonaIndicator user={mockAIPersonaWithCelebrity} />);

      const indicator = screen.getByTitle('Influence level: celebrity');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('from-orange-400', 'to-red-500');
    });

    it('shows influence level label when showLabel is true', () => {
      render(<PersonaIndicator user={mockMegaInfluencer} showLabel />);

      const indicator = screen.getByTitle('Influence level: mega');
      expect(indicator).toHaveTextContent('Mega');
    });

    it('applies correct influence indicator size for different component sizes', () => {
      const { rerender } = render(
        <PersonaIndicator user={mockMegaInfluencer} size="sm" />
      );

      let zapIcon = screen.getByTestId('zap-icon');
      expect(zapIcon).toHaveClass('w-2', 'h-2');

      rerender(<PersonaIndicator user={mockMegaInfluencer} size="lg" />);

      zapIcon = screen.getByTestId('zap-icon');
      expect(zapIcon).toHaveClass('w-3.5', 'h-3.5');
    });
  });

  describe('AI Specific Indicators', () => {
    it('shows AI response style indicator for AI persona', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      const indicator = screen.getByTitle('Response style: emotional');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('bg-x-blue');
      expect(indicator).toHaveTextContent('AI');
    });

    it('shows response style label when showLabel is true for AI', () => {
      render(<PersonaIndicator user={mockAIPersona} showLabel />);

      const indicator = screen.getByTitle('Response style: emotional');
      expect(indicator).toHaveTextContent('emotional');
    });

    it('does not show AI indicator for regular users', () => {
      render(<PersonaIndicator user={mockRegularUser} />);

      expect(screen.queryByTitle(/Response style:/)).not.toBeInTheDocument();
    });

    it('applies correct AI indicator size for different component sizes', () => {
      const { rerender } = render(<PersonaIndicator user={mockAIPersona} size="sm" />);

      let aiIndicator = screen.getByTitle('Response style: emotional');
      expect(aiIndicator).toHaveClass('px-1.5', 'py-0.5', 'text-xs');

      rerender(<PersonaIndicator user={mockAIPersona} size="lg" />);

      aiIndicator = screen.getByTitle('Response style: emotional');
      expect(aiIndicator).toHaveClass('px-2.5', 'py-1', 'text-sm');
    });
  });

  describe('Icon Tooltips and Accessibility', () => {
    it('provides proper tooltips for persona type icons', () => {
      render(<PersonaIndicator user={mockRegularUser} />);

      const iconContainer = screen.getByTestId('user-icon').parentElement;
      expect(iconContainer).toHaveAttribute('title', 'User');
    });

    it('provides proper tooltip for verified user', () => {
      render(<PersonaIndicator user={mockVerifiedUser} />);

      const iconContainer = screen.getByTestId('shield-icon').parentElement;
      expect(iconContainer).toHaveAttribute('title', 'Verified User');
    });

    it('provides proper tooltip for AI persona', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      const iconContainer = screen.getByTestId('bot-icon').parentElement;
      expect(iconContainer).toHaveAttribute('title', 'AI Persona');
    });

    it('provides accessible titles for all indicators', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      expect(screen.getByTitle('AI Persona')).toBeInTheDocument();
      expect(screen.getByTitle('Political alignment: Progressive')).toBeInTheDocument();
      expect(screen.getByTitle('Influence level: mega')).toBeInTheDocument();
      expect(screen.getByTitle('Response style: emotional')).toBeInTheDocument();
    });
  });

  describe('Layout and Spacing', () => {
    it('arranges indicators with proper spacing', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      const container = screen.getByTestId('bot-icon').closest('div');
      expect(container).toHaveClass('flex', 'items-center', 'space-x-1.5');
    });

    it('maintains proper spacing with different sizes', () => {
      const { rerender } = render(<PersonaIndicator user={mockAIPersona} size="sm" />);

      let container = screen.getByTestId('bot-icon').closest('div');
      expect(container).toHaveClass('text-xs');

      rerender(<PersonaIndicator user={mockAIPersona} size="lg" />);

      container = screen.getByTestId('bot-icon').closest('div');
      expect(container).toHaveClass('text-base');
    });
  });

  describe('Conditional Rendering', () => {
    it('only renders applicable indicators', () => {
      render(<PersonaIndicator user={mockRegularUser} />);

      // Should only show user icon, no other indicators
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('bot-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('shield-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('zap-icon')).not.toBeInTheDocument();
      expect(screen.queryByTitle(/Political alignment:/)).not.toBeInTheDocument();
      expect(screen.queryByTitle(/Response style:/)).not.toBeInTheDocument();
    });

    it('renders all applicable indicators for complex AI persona', () => {
      render(<PersonaIndicator user={mockAIPersona} />);

      // Should show all indicators for AI persona
      expect(screen.getByTestId('bot-icon')).toBeInTheDocument();
      expect(screen.getByTitle('Political alignment: Progressive')).toBeInTheDocument();
      expect(screen.getByTitle('Influence level: mega')).toBeInTheDocument();
      expect(screen.getByTitle('Response style: emotional')).toBeInTheDocument();
    });

    it('renders partial indicators based on available data', () => {
      const partialAI: AIPersona = {
        ...mockAIPersona,
        influenceMetrics: {
          ...mockAIPersona.influenceMetrics,
          tier: 'micro', // This should not show influence indicator
        },
      };

      render(<PersonaIndicator user={partialAI} />);

      expect(screen.getByTestId('bot-icon')).toBeInTheDocument();
      expect(screen.getByTitle('Political alignment: Progressive')).toBeInTheDocument();
      expect(screen.queryByTitle(/Influence level:/)).not.toBeInTheDocument();
      expect(screen.getByTitle('Response style: emotional')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles user without response style in AI persona', () => {
      const aiWithoutResponseStyle = {
        ...mockAIPersona,
        responseStyle: undefined as any,
      };

      render(<PersonaIndicator user={aiWithoutResponseStyle} />);

      expect(screen.getByTestId('bot-icon')).toBeInTheDocument();
      expect(screen.queryByTitle(/Response style:/)).not.toBeInTheDocument();
    });

    it('handles extreme follower counts', () => {
      const extremeUser: User = {
        ...mockRegularUser,
        followersCount: 100000000, // 100M followers
      };

      render(<PersonaIndicator user={extremeUser} />);

      const indicator = screen.getByTitle('Influence level: celebrity');
      expect(indicator).toBeInTheDocument();
    });

    it('handles zero followers', () => {
      const zeroFollowerUser: User = {
        ...mockRegularUser,
        followersCount: 0,
      };

      render(<PersonaIndicator user={zeroFollowerUser} />);

      expect(screen.queryByTestId('zap-icon')).not.toBeInTheDocument();
    });

    it('handles invalid political alignment gracefully', () => {
      const userWithInvalidAlignment: User = {
        ...mockRegularUser,
        politicalAlignment: {
          position: 'invalid' as any,
          intensity: 5,
          keyIssues: [],
          description: '',
        },
      };

      render(<PersonaIndicator user={userWithInvalidAlignment} />);

      // Should still render but with fallback styling
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for regular user', () => {
      const { container } = render(<PersonaIndicator user={mockRegularUser} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for verified user', () => {
      const { container } = render(<PersonaIndicator user={mockVerifiedUser} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for AI persona with all indicators', () => {
      const { container } = render(<PersonaIndicator user={mockAIPersona} showLabel />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for different sizes', () => {
      const { container } = render(<PersonaIndicator user={mockAIPersona} size="lg" showLabel />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for user with political alignment', () => {
      const { container } = render(<PersonaIndicator user={mockUserWithPoliticalAlignment} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for celebrity influencer', () => {
      const { container } = render(<PersonaIndicator user={mockCelebrity} showLabel />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});