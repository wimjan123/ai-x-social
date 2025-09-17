/**
 * Content Moderation Service
 * Implements T083: Content moderation and safety filters
 *
 * Features:
 * - Profanity filtering
 * - Hate speech detection
 * - Spam detection
 * - Inappropriate content blocking
 * - User reporting system
 * - Automated escalation
 */

import { logger, logSecurityEvent } from '@/lib/logger';
import { prisma } from '@/lib/database';
import { Post, UserProfile } from '@/generated/prisma';

export interface ModerationResult {
  isBlocked: boolean;
  confidence: number;
  reasons: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: 'approve' | 'flag' | 'block' | 'escalate';
  categories: string[];
}

export interface ContentAnalysis {
  text: string;
  metadata?: {
    authorId: string;
    postType: string;
    timestamp: string;
  };
}

export class ContentModerationService {
  private profanityWords: Set<string>;
  private spamPatterns: RegExp[];
  private hateKeywords: Set<string>;
  private urlPattern: RegExp;
  private suspiciousPatterns: RegExp[];

  constructor() {
    this.initializeFilters();
  }

  private initializeFilters(): void {
    // Common profanity words (sample - would be expanded in production)
    this.profanityWords = new Set([
      'damn', 'hell', 'crap', 'stupid', 'idiot', 'moron',
      // Note: In production, this would be a comprehensive list
      // or integrated with external moderation APIs
    ]);

    // Hate speech keywords (sample)
    this.hateKeywords = new Set([
      'hate', 'nazi', 'terrorist', 'kill', 'die', 'murder',
      'violence', 'threat', 'bomb', 'shoot', 'attack',
      // Note: Production would use more sophisticated detection
    ]);

    // Spam detection patterns
    this.spamPatterns = [
      /(.)\1{10,}/g, // Repeated characters
      /(?:https?:\/\/[^\s]+){3,}/g, // Multiple URLs
      /(?:click here|buy now|limited time|act now)/gi,
      /(?:viagra|casino|lottery|winner|congratulations)/gi,
    ];

    // URL pattern for link detection
    this.urlPattern = /https?:\/\/[^\s]+/g;

    // Suspicious patterns
    this.suspiciousPatterns = [
      /(?:password|login|credit card|ssn|social security)/gi,
      /(?:\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})/g, // Credit card numbers
      /(?:\d{3}[-\s]?\d{2}[-\s]?\d{4})/g, // SSN pattern
    ];
  }

  /**
   * Main moderation method - analyzes content and returns moderation result
   */
  async moderateContent(analysis: ContentAnalysis): Promise<ModerationResult> {
    const text = analysis.text.toLowerCase();
    const reasons: string[] = [];
    const categories: string[] = [];
    let confidence = 0;
    let severity: ModerationResult['severity'] = 'low';

    // 1. Profanity check
    const profanityResult = this.checkProfanity(text);
    if (profanityResult.detected) {
      reasons.push('Contains profanity');
      categories.push('profanity');
      confidence += profanityResult.score;
    }

    // 2. Hate speech detection
    const hateResult = this.checkHateSpeech(text);
    if (hateResult.detected) {
      reasons.push('Potential hate speech detected');
      categories.push('hate_speech');
      confidence += hateResult.score;
      severity = 'high';
    }

    // 3. Spam detection
    const spamResult = this.checkSpam(text);
    if (spamResult.detected) {
      reasons.push('Spam content detected');
      categories.push('spam');
      confidence += spamResult.score;
    }

    // 4. Suspicious content (PII, financial info)
    const suspiciousResult = this.checkSuspiciousContent(text);
    if (suspiciousResult.detected) {
      reasons.push('Contains sensitive information');
      categories.push('sensitive_info');
      confidence += suspiciousResult.score;
      severity = 'medium';
    }

    // 5. Link analysis
    const linkResult = this.analyzeLinkSafety(analysis.text);
    if (linkResult.risky) {
      reasons.push('Contains suspicious links');
      categories.push('suspicious_links');
      confidence += linkResult.score;
    }

    // 6. Context-based analysis (user history, frequency)
    if (analysis.metadata) {
      const contextResult = await this.analyzeUserContext(analysis.metadata.authorId);
      if (contextResult.suspicious) {
        reasons.push('User activity patterns suggest abuse');
        categories.push('user_behavior');
        confidence += contextResult.score;
      }
    }

    // Determine final confidence and action
    confidence = Math.min(confidence, 1.0);
    const isBlocked = confidence > 0.7 || severity === 'critical';

    let suggestedAction: ModerationResult['suggestedAction'] = 'approve';
    if (confidence > 0.9 || severity === 'critical') {
      suggestedAction = 'block';
    } else if (confidence > 0.7 || severity === 'high') {
      suggestedAction = 'escalate';
    } else if (confidence > 0.4 || severity === 'medium') {
      suggestedAction = 'flag';
    }

    const result: ModerationResult = {
      isBlocked,
      confidence,
      reasons,
      severity,
      suggestedAction,
      categories
    };

    // Log moderation decision
    if (isBlocked || confidence > 0.5) {
      logger.warn('Content Moderation', {
        action: suggestedAction,
        confidence,
        reasons,
        categories,
        authorId: analysis.metadata?.authorId,
        textLength: analysis.text.length,
        timestamp: new Date().toISOString(),
      });

      if (severity === 'high' || severity === 'critical') {
        logSecurityEvent('HIGH_RISK_CONTENT_DETECTED', {
          authorId: analysis.metadata?.authorId,
          confidence,
          reasons,
          severity,
        });
      }
    }

    return result;
  }

  /**
   * Check for profanity in text
   */
  private checkProfanity(text: string): { detected: boolean; score: number; words: string[] } {
    const words = text.split(/\s+/);
    const foundWords: string[] = [];

    for (const word of words) {
      const cleanWord = word.replace(/[^a-z]/g, '');
      if (this.profanityWords.has(cleanWord)) {
        foundWords.push(cleanWord);
      }
    }

    return {
      detected: foundWords.length > 0,
      score: Math.min(foundWords.length * 0.1, 0.3),
      words: foundWords
    };
  }

  /**
   * Check for hate speech keywords
   */
  private checkHateSpeech(text: string): { detected: boolean; score: number; keywords: string[] } {
    const foundKeywords: string[] = [];

    for (const keyword of this.hateKeywords) {
      if (text.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    }

    // Context analysis for hate speech
    const violentContext = /(?:kill|murder|die|attack|destroy).{0,20}(?:them|you|people|group)/g;
    const hasViolentContext = violentContext.test(text);

    return {
      detected: foundKeywords.length > 0 || hasViolentContext,
      score: hasViolentContext ? 0.8 : Math.min(foundKeywords.length * 0.2, 0.6),
      keywords: foundKeywords
    };
  }

  /**
   * Check for spam patterns
   */
  private checkSpam(text: string): { detected: boolean; score: number; patterns: string[] } {
    const foundPatterns: string[] = [];

    for (const pattern of this.spamPatterns) {
      if (pattern.test(text)) {
        foundPatterns.push(pattern.source);
      }
    }

    // Additional spam indicators
    const urlCount = (text.match(this.urlPattern) || []).length;
    const hasExcessiveUrls = urlCount > 3;
    const hasExcessiveEmojis = (text.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/gu) || []).length > 10;

    if (hasExcessiveUrls) foundPatterns.push('excessive_urls');
    if (hasExcessiveEmojis) foundPatterns.push('excessive_emojis');

    return {
      detected: foundPatterns.length > 0,
      score: Math.min(foundPatterns.length * 0.15 + (hasExcessiveUrls ? 0.3 : 0), 0.5),
      patterns: foundPatterns
    };
  }

  /**
   * Check for suspicious content (PII, financial info)
   */
  private checkSuspiciousContent(text: string): { detected: boolean; score: number; types: string[] } {
    const foundTypes: string[] = [];

    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(text)) {
        foundTypes.push('sensitive_data');
      }
    }

    return {
      detected: foundTypes.length > 0,
      score: foundTypes.length > 0 ? 0.6 : 0,
      types: foundTypes
    };
  }

  /**
   * Analyze link safety
   */
  private analyzeLinkSafety(text: string): { risky: boolean; score: number; urls: string[] } {
    const urls = text.match(this.urlPattern) || [];

    // Simple suspicious domain check (would be enhanced with real URL analysis)
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'shorturl.at'];
    const riskyUrls = urls.filter(url =>
      suspiciousDomains.some(domain => url.includes(domain)) ||
      url.includes('malware') ||
      url.includes('phishing')
    );

    return {
      risky: riskyUrls.length > 0,
      score: riskyUrls.length > 0 ? 0.4 : 0,
      urls: riskyUrls
    };
  }

  /**
   * Analyze user context and behavior patterns
   */
  private async analyzeUserContext(authorId: string): Promise<{ suspicious: boolean; score: number; reasons: string[] }> {
    try {
      // Get recent user activity
      const recentPosts = await prisma.post.findMany({
        where: {
          authorId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      const reasons: string[] = [];
      let score = 0;

      // Check posting frequency (possible spam bot)
      if (recentPosts.length > 20) {
        reasons.push('High posting frequency');
        score += 0.3;
      }

      // Check for duplicate content
      const contents = recentPosts.map(p => p.content);
      const duplicates = contents.filter((content, index) =>
        contents.indexOf(content) !== index
      );

      if (duplicates.length > 3) {
        reasons.push('Duplicate content detected');
        score += 0.4;
      }

      // Check account age (new accounts are more suspicious)
      const user = await prisma.userProfile.findUnique({
        where: { id: authorId },
        select: { createdAt: true }
      });

      if (user) {
        const accountAge = Date.now() - user.createdAt.getTime();
        const isNewAccount = accountAge < 7 * 24 * 60 * 60 * 1000; // Less than 7 days

        if (isNewAccount && recentPosts.length > 10) {
          reasons.push('New account with high activity');
          score += 0.3;
        }
      }

      return {
        suspicious: score > 0.4,
        score: Math.min(score, 0.6),
        reasons
      };
    } catch (error) {
      logger.error('Failed to analyze user context:', error);
      return { suspicious: false, score: 0, reasons: [] };
    }
  }

  /**
   * Report content for human review
   */
  async reportContent(
    contentId: string,
    reporterId: string,
    reason: string,
    category: string
  ): Promise<void> {
    try {
      // Store the report in database
      await prisma.contentReport.create({
        data: {
          contentId,
          reporterId,
          reason,
          category,
          status: 'pending',
          createdAt: new Date()
        }
      });

      logger.info('Content reported', {
        contentId,
        reporterId,
        reason,
        category,
        timestamp: new Date().toISOString(),
      });

      // Log security event for potential abuse
      logSecurityEvent('CONTENT_REPORTED', {
        contentId,
        reporterId,
        category,
        reason
      });

    } catch (error) {
      logger.error('Failed to save content report:', error);
      throw new Error('Failed to submit report');
    }
  }

  /**
   * Auto-moderate a post and take action
   */
  async moderatePost(post: Post): Promise<ModerationResult> {
    const analysis: ContentAnalysis = {
      text: post.content,
      metadata: {
        authorId: post.authorId,
        postType: 'post',
        timestamp: post.createdAt.toISOString()
      }
    };

    const result = await this.moderateContent(analysis);

    // Take automatic action based on result
    if (result.suggestedAction === 'block') {
      await this.blockContent(post.id, result);
    } else if (result.suggestedAction === 'flag') {
      await this.flagContent(post.id, result);
    }

    return result;
  }

  /**
   * Block content automatically
   */
  private async blockContent(postId: string, moderationResult: ModerationResult): Promise<void> {
    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          isBlocked: true,
          moderationReason: moderationResult.reasons.join(', '),
          moderatedAt: new Date()
        }
      });

      logger.warn('Content automatically blocked', {
        postId,
        reasons: moderationResult.reasons,
        confidence: moderationResult.confidence,
      });

    } catch (error) {
      logger.error('Failed to block content:', error);
    }
  }

  /**
   * Flag content for human review
   */
  private async flagContent(postId: string, moderationResult: ModerationResult): Promise<void> {
    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          isFlagged: true,
          moderationReason: moderationResult.reasons.join(', '),
          moderatedAt: new Date()
        }
      });

      logger.info('Content flagged for review', {
        postId,
        reasons: moderationResult.reasons,
        confidence: moderationResult.confidence,
      });

    } catch (error) {
      logger.error('Failed to flag content:', error);
    }
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(): Promise<{
    totalReports: number;
    pendingReports: number;
    blockedContent: number;
    flaggedContent: number;
  }> {
    try {
      const [totalReports, pendingReports, blockedContent, flaggedContent] = await Promise.all([
        prisma.contentReport.count(),
        prisma.contentReport.count({ where: { status: 'pending' } }),
        prisma.post.count({ where: { isBlocked: true } }),
        prisma.post.count({ where: { isFlagged: true } })
      ]);

      return {
        totalReports,
        pendingReports,
        blockedContent,
        flaggedContent
      };
    } catch (error) {
      logger.error('Failed to get moderation stats:', error);
      throw new Error('Failed to retrieve moderation statistics');
    }
  }
}

// Export singleton instance
export const contentModerationService = new ContentModerationService();