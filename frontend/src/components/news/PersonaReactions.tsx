'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, getAnimationClasses, getPoliticalColorClasses, getPoliticalTextColor } from '@/lib/design-system';
import { formatDistanceToNow } from 'date-fns';
import {
  Bot,
  MessageCircle,
  Heart,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { NewsArticle, AIPersona, PoliticalAlignment } from '@/types';

interface PersonaReactionsProps {
  article: NewsArticle;
  variant?: 'preview' | 'detailed' | 'compact';
  className?: string;
  maxReactions?: number;
  onPersonaClick?: (persona: AIPersona) => void;
  onReactionClick?: (persona: AIPersona, reaction: PersonaReaction) => void;
}

interface PersonaReaction {
  id: string;
  persona: AIPersona;
  type: 'comment' | 'like' | 'share' | 'analysis';
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: Date;
  engagementCount: number;
  isVisible: boolean;
}

// Mock AI personas for demonstration
const mockPersonas: AIPersona[] = [
  {
    id: 'persona-1',
    name: 'ConservativeVoice',
    displayName: 'Traditional Values',
    username: 'conservative_voice',
    bio: 'Promoting traditional American values and fiscal responsibility',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=conservative',
    verified: true,
    followersCount: 45000,
    followingCount: 1200,
    postsCount: 3400,
    politicalAlignment: {
      position: 'conservative',
      intensity: 8,
      keyIssues: ['fiscal policy', 'traditional values', 'limited government'],
      description: 'Strong conservative stance on most issues',
    },
    personality: {
      openness: 4,
      conscientiousness: 8,
      extraversion: 7,
      agreeableness: 5,
      neuroticism: 3,
      formalityLevel: 8,
      humorLevel: 4,
    },
    responseStyle: {
      averageResponseTime: 15,
      postFrequency: 8,
      engagementStyle: 'analytical',
      topicFocus: ['politics', 'economics', 'policy'],
      languageComplexity: 'moderate',
    },
    topicExpertise: ['economics', 'policy', 'history'],
    influenceMetrics: {
      score: 78,
      tier: 'influential',
      engagementRate: 6.2,
      reachEstimate: 180000,
      topicAuthority: { politics: 85, economics: 72 },
      viralPostsCount: 12,
      lastUpdated: new Date(),
    },
    influenceScore: 78,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'persona-2',
    name: 'ProgressiveAdvocate',
    displayName: 'Climate & Justice',
    username: 'progressive_advocate',
    bio: 'Fighting for climate action and social justice',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=progressive',
    verified: true,
    followersCount: 62000,
    followingCount: 890,
    postsCount: 2800,
    politicalAlignment: {
      position: 'progressive',
      intensity: 9,
      keyIssues: ['climate change', 'social justice', 'healthcare'],
      description: 'Strong progressive stance on environmental and social issues',
    },
    personality: {
      openness: 9,
      conscientiousness: 7,
      extraversion: 8,
      agreeableness: 8,
      neuroticism: 5,
      formalityLevel: 5,
      humorLevel: 7,
    },
    responseStyle: {
      averageResponseTime: 8,
      postFrequency: 12,
      engagementStyle: 'emotional',
      topicFocus: ['environment', 'social justice', 'technology'],
      languageComplexity: 'moderate',
    },
    topicExpertise: ['climate science', 'social policy', 'technology'],
    influenceMetrics: {
      score: 85,
      tier: 'influential',
      engagementRate: 7.8,
      reachEstimate: 245000,
      topicAuthority: { environment: 92, social: 78 },
      viralPostsCount: 18,
      lastUpdated: new Date(),
    },
    influenceScore: 85,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'persona-3',
    name: 'ModerateAnalyst',
    displayName: 'Balanced Perspective',
    username: 'moderate_analyst',
    bio: 'Providing balanced analysis and bridging political divides',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderate',
    verified: true,
    followersCount: 38000,
    followingCount: 1500,
    postsCount: 1900,
    politicalAlignment: {
      position: 'independent',
      intensity: 5,
      keyIssues: ['bipartisan solutions', 'evidence-based policy', 'compromise'],
      description: 'Seeks common ground and evidence-based solutions',
    },
    personality: {
      openness: 7,
      conscientiousness: 9,
      extraversion: 6,
      agreeableness: 8,
      neuroticism: 2,
      formalityLevel: 7,
      humorLevel: 5,
    },
    responseStyle: {
      averageResponseTime: 25,
      postFrequency: 5,
      engagementStyle: 'analytical',
      topicFocus: ['policy analysis', 'data', 'compromise'],
      languageComplexity: 'complex',
    },
    topicExpertise: ['data analysis', 'policy research', 'statistics'],
    influenceMetrics: {
      score: 65,
      tier: 'rising',
      engagementRate: 5.4,
      reachEstimate: 125000,
      topicAuthority: { analysis: 88, policy: 72 },
      viralPostsCount: 6,
      lastUpdated: new Date(),
    },
    influenceScore: 65,
    isActive: true,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Generate mock reactions based on article and persona
function generateMockReactions(article: NewsArticle, personas: AIPersona[]): PersonaReaction[] {
  const reactions: PersonaReaction[] = [];
  
  personas.forEach((persona, index) => {
    const alignment = persona.politicalAlignment.position;
    const isClimateArticle = article.title.toLowerCase().includes('climate');
    const isEconomicArticle = article.category === 'BUSINESS' || article.category === 'POLITICS';
    
    // Determine reaction based on persona's political alignment and article content
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let content = '';
    
    if (isClimateArticle) {
      if (alignment === 'progressive') {
        sentiment = 'positive';
        content = `This is exactly the kind of urgent action we need on climate change. The science is clear, and we must act now to protect our planet for future generations. 🌍`;
      } else if (alignment === 'conservative') {
        sentiment = 'negative';
        content = `While environmental concerns are valid, we must ensure these policies don't harm our economy or burden hardworking families with excessive regulations.`;
      } else {
        sentiment = 'neutral';
        content = `Important to analyze both the environmental benefits and economic implications of these climate policies. Data-driven solutions are key.`;
      }
    } else if (isEconomicArticle) {
      if (alignment === 'conservative') {
        sentiment = 'positive';
        content = `Market-based solutions and fiscal responsibility should be our guiding principles. Government intervention often creates more problems than it solves.`;
      } else if (alignment === 'progressive') {
        sentiment = 'negative';
        content = `We need to consider how these economic policies impact working families and marginalized communities. Growth without equity isn't real progress.`;
      } else {
        sentiment = 'neutral';
        content = `Interesting economic analysis. Would be helpful to see more data on long-term impacts across different demographic groups.`;
      }
    } else {
      // Generic reactions
      const genericReactions = [
        { sentiment: 'positive' as const, content: 'Thought-provoking article that raises important questions about our society.' },
        { sentiment: 'neutral' as const, content: 'This deserves more attention and deeper analysis from multiple perspectives.' },
        { sentiment: 'negative' as const, content: 'While I appreciate the coverage, I think there are some important counterpoints to consider.' },
      ];
      const reaction = genericReactions[index % genericReactions.length];
      sentiment = reaction.sentiment;
      content = reaction.content;
    }
    
    reactions.push({
      id: `reaction-${persona.id}-${article.id}`,
      persona,
      type: index === 0 ? 'analysis' : index === 1 ? 'comment' : 'like',
      content,
      sentiment,
      confidence: 0.7 + Math.random() * 0.3,
      timestamp: new Date(Date.now() - (index + 1) * 30 * 60 * 1000), // Stagger timestamps
      engagementCount: Math.floor(Math.random() * 100) + 20,
      isVisible: true,
    });
  });
  
  return reactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function ReactionIcon({ type, sentiment }: { type: string; sentiment: string }) {
  const getIconColor = () => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };
  
  switch (type) {
    case 'like':
      return <Heart className={cn('w-4 h-4', getIconColor())} />;
    case 'share':
      return <Share2 className={cn('w-4 h-4', getIconColor())} />;
    case 'analysis':
      return <Sparkles className={cn('w-4 h-4', getIconColor())} />;
    default:
      return <MessageCircle className={cn('w-4 h-4', getIconColor())} />;
  }
}

function PersonaReactionCard({
  reaction,
  variant,
  onPersonaClick,
  onReactionClick,
}: {
  reaction: PersonaReaction;
  variant: string;
  onPersonaClick?: (persona: AIPersona) => void;
  onReactionClick?: (persona: AIPersona, reaction: PersonaReaction) => void;
}) {
  const timeAgo = formatDistanceToNow(reaction.timestamp, { addSuffix: true });
  const animations = getAnimationClasses();
  
  const politicalColor = getPoliticalColorClasses(reaction.persona.politicalAlignment.position);
  const politicalText = getPoliticalTextColor(reaction.persona.politicalAlignment.position);
  
  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-start space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors',
        animations.fadeIn
      )}>
        <button
          onClick={() => onPersonaClick?.(reaction.persona)}
          className="flex-shrink-0"
        >
          <img
            src={reaction.persona.avatarUrl}
            alt={reaction.persona.displayName}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
          />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <button
              onClick={() => onPersonaClick?.(reaction.persona)}
              className="font-medium text-x-text dark:text-x-text-dark hover:underline truncate"
            >
              {reaction.persona.displayName}
            </button>
            <div className={cn(
              'w-2 h-2 rounded-full',
              `bg-${politicalColor}`
            )} />
            <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
              {timeAgo}
            </span>
          </div>
          
          <p className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark line-clamp-2">
            {reaction.content}
          </p>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          <ReactionIcon type={reaction.type} sentiment={reaction.sentiment} />
          <span className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
            {reaction.engagementCount}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      'bg-white dark:bg-x-dark border border-x-border rounded-lg p-4 space-y-3',
      'hover:shadow-md dark:hover:shadow-xl transition-all duration-200',
      animations.fadeIn
    )}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onPersonaClick?.(reaction.persona)}
            className="flex-shrink-0"
          >
            <img
              src={reaction.persona.avatarUrl}
              alt={reaction.persona.displayName}
              className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <button
                onClick={() => onPersonaClick?.(reaction.persona)}
                className="font-semibold text-x-text dark:text-x-text-dark hover:underline"
              >
                {reaction.persona.displayName}
              </button>
              <Bot className="w-4 h-4 text-x-blue" />
              <div className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                `bg-${politicalColor} ${politicalText}`
              )}>
                {reaction.persona.politicalAlignment.position}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
              <span>@{reaction.persona.username}</span>
              <span>•</span>
              <span>{timeAgo}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span>Confidence:</span>
                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${reaction.confidence * 100}%` }}
                  />
                </div>
                <span>{(reaction.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <ReactionIcon type={reaction.type} sentiment={reaction.sentiment} />
          <span className="text-sm font-medium text-x-text dark:text-x-text-dark">
            {reaction.engagementCount}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <p className="text-x-text dark:text-x-text-dark leading-relaxed">
          {reaction.content}
        </p>
        
        {reaction.type === 'analysis' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI Analysis
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              This reaction was generated based on {reaction.persona.displayName}'s political alignment 
              and expertise in {reaction.persona.topicExpertise.join(', ')}.
            </p>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-x-border">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-x-text-secondary dark:text-x-text-secondary-dark hover:text-x-blue transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">Agree</span>
          </button>
          <button className="flex items-center space-x-1 text-x-text-secondary dark:text-x-text-secondary-dark hover:text-x-blue transition-colors">
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm">Disagree</span>
          </button>
          <button className="flex items-center space-x-1 text-x-text-secondary dark:text-x-text-secondary-dark hover:text-x-blue transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Reply</span>
          </button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReactionClick?.(reaction.persona, reaction)}
          className="text-xs"
        >
          View Discussion
        </Button>
      </div>
    </div>
  );
}

export function PersonaReactions({
  article,
  variant = 'preview',
  className,
  maxReactions = 3,
  onPersonaClick,
  onReactionClick,
}: PersonaReactionsProps) {
  const [reactions, setReactions] = useState<PersonaReaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const animations = getAnimationClasses();
  
  const fetchReactions = useCallback(async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockReactions = generateMockReactions(article, mockPersonas);
    setReactions(mockReactions);
    setLoading(false);
  }, [article]);
  
  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);
  
  const displayedReactions = expanded ? reactions : reactions.slice(0, maxReactions);
  const hasMoreReactions = reactions.length > maxReactions;
  
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-x-blue" />
          <h3 className="font-bold text-x-text dark:text-x-text-dark">
            AI Persona Reactions
          </h3>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (reactions.length === 0) {
    return (
      <div className={cn(
        'text-center py-6 space-y-2',
        variant !== 'preview' && 'bg-gray-50 dark:bg-gray-900/50 rounded-lg',
        className
      )}>
        <Bot className="w-8 h-8 text-gray-400 mx-auto" />
        <p className="text-x-text-secondary dark:text-x-text-secondary-dark">
          No AI reactions yet. Check back soon!
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn('space-y-4', animations.fadeIn, className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-x-blue" />
          <h3 className="font-bold text-x-text dark:text-x-text-dark">
            AI Persona Reactions
          </h3>
          <span className="text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            ({reactions.length})
          </span>
        </div>
        
        {variant !== 'preview' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchReactions}
            className="text-xs"
          >
            <Zap className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        )}
      </div>
      
      <div className={cn(
        'space-y-3',
        variant === 'detailed' && 'space-y-4'
      )}>
        {displayedReactions.map((reaction, index) => (
          <div
            key={reaction.id}
            style={{
              animationDelay: `${index * 150}ms`,
            }}
          >
            <PersonaReactionCard
              reaction={reaction}
              variant={variant}
              onPersonaClick={onPersonaClick}
              onReactionClick={onReactionClick}
            />
          </div>
        ))}
      </div>
      
      {hasMoreReactions && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-2"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show {reactions.length - maxReactions} More Reactions</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}