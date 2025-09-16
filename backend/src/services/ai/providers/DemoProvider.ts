/**
 * Demo AI Provider Implementation
 *
 * Mock AI provider for development and testing without requiring API keys.
 * Implements T049d: Demo mode with mock AI responses
 */

import { BaseAIProvider } from './BaseProvider';
import {
  AIRequest,
  AIResponse,
  HealthStatus,
  ProviderCapabilities,
  PersonaConfiguration,
  SafetyResults,
  PoliticalContext
} from '../interfaces/IAIProvider';

export class DemoProvider extends BaseAIProvider {
  readonly name = 'Demo';
  readonly priority = 999; // Lowest priority (fallback only)

  private responses: Map<string, DemoResponseSet> = new Map();
  private reactionTemplates: Map<string, string[]> = new Map();

  constructor() {
    super();
    this.initializeDemoResponses();
    this.initializeReactionTemplates();
  }

  get isHealthy(): boolean {
    return true; // Demo provider is always healthy
  }

  // ============================================================================
  // PROVIDER-SPECIFIC IMPLEMENTATION
  // ============================================================================

  protected async callAPI(prompt: string, request: AIRequest): Promise<any> {
    // Simulate realistic API delay
    const baseDelay = 500;
    const variableDelay = Math.random() * 1500; // 0.5-2 seconds
    await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay));

    // Generate response based on persona and context
    const response = this.generateDemoResponse(request);

    return {
      content: response,
      model: 'demo-v1',
      usage: {
        input_tokens: Math.floor(prompt.length / 4),
        output_tokens: Math.floor(response.length / 4),
        total_tokens: Math.floor((prompt.length + response.length) / 4)
      }
    };
  }

  protected extractContent(rawResponse: any): string {
    return rawResponse.content;
  }

  protected extractTokenUsage(rawResponse: any): { input: number; output: number; total: number } {
    return {
      input: rawResponse.usage.input_tokens,
      output: rawResponse.usage.output_tokens,
      total: rawResponse.usage.total_tokens
    };
  }

  protected getModelName(rawResponse: any): string {
    return 'demo-v1';
  }

  protected calculateConfidence(rawResponse: any, request: AIRequest): number {
    // Demo responses have moderate confidence
    let confidence = 0.6;

    // Adjust based on political alignment clarity
    const politicalContext = this.buildPoliticalContext(request.persona.politicalAlignment);
    if (politicalContext.quadrant !== 'center') {
      confidence += 0.1;
    }

    // Adjust based on persona specificity
    if (request.persona.personalityTraits.length > 2) {
      confidence += 0.05;
    }

    return Math.min(confidence, 0.8); // Cap demo confidence at 0.8
  }

  // ============================================================================
  // DEMO RESPONSE GENERATION
  // ============================================================================

  private generateDemoResponse(request: AIRequest): string {
    const { persona, context, constraints, newsContext } = request;
    const politicalContext = this.buildPoliticalContext(persona.politicalAlignment);

    // Get base response set for political alignment
    const responseSet = this.getResponseSetForPersona(politicalContext);

    // Choose response type based on context
    let selectedResponse: string;

    if (newsContext) {
      selectedResponse = this.generateNewsReaction(newsContext, politicalContext, persona);
    } else if (context.includes('?')) {
      selectedResponse = this.selectRandomResponse(responseSet.questions);
    } else if (this.containsDebateKeywords(context)) {
      selectedResponse = this.selectRandomResponse(responseSet.debates);
    } else {
      selectedResponse = this.selectRandomResponse(responseSet.general);
    }

    // Apply persona modifications
    selectedResponse = this.applyPersonaModifications(selectedResponse, persona);

    // Ensure response meets length constraints
    if (selectedResponse.length > constraints.maxLength) {
      selectedResponse = selectedResponse.substring(0, constraints.maxLength - 3) + '...';
    }

    // Add demo mode indicator
    return `[Demo Mode] ${selectedResponse}`;
  }

  private generateNewsReaction(newsItem: any, politicalContext: PoliticalContext, persona: PersonaConfiguration): string {
    const templates = this.reactionTemplates.get(politicalContext.quadrant) || [];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders in template
    return template
      .replace('{topic}', newsItem.title.toLowerCase())
      .replace('{stance}', this.getPoliticalStance(politicalContext))
      .replace('{name}', persona.name)
      .replace('{handle}', persona.handle);
  }

  private selectRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private applyPersonaModifications(response: string, persona: PersonaConfiguration): string {
    let modified = response;

    // Apply tone style modifications
    switch (persona.toneStyle) {
      case 'AGGRESSIVE':
        modified = modified.replace('.', '!').replace(/\bi think\b/gi, 'I KNOW');
        break;
      case 'HUMOROUS':
        if (Math.random() > 0.7) {
          modified += ' 😄';
        }
        break;
      case 'SARCASTIC':
        modified = modified.replace(/\bgood\b/gi, '"good"').replace(/\bgreat\b/gi, '"great"');
        break;
      case 'PROFESSIONAL':
        modified = modified.replace(/!/g, '.').replace(/\byeah\b/gi, 'yes');
        break;
    }

    // Apply controversy tolerance
    if (persona.controversyTolerance > 75) {
      modified = modified.replace(/maybe/gi, 'definitely').replace(/might/gi, 'will');
    } else if (persona.controversyTolerance < 25) {
      modified = modified.replace(/!/g, '.').replace(/definitely/gi, 'perhaps');
    }

    return modified;
  }

  private containsDebateKeywords(context: string): boolean {
    const debateKeywords = [
      'disagree', 'wrong', 'oppose', 'against', 'debate', 'argue',
      'policy', 'election', 'vote', 'politics', 'government'
    ];
    const lowerContext = context.toLowerCase();
    return debateKeywords.some(keyword => lowerContext.includes(keyword));
  }

  private getPoliticalStance(context: PoliticalContext): string {
    const stances = {
      'lib-left': 'progressive',
      'lib-right': 'libertarian',
      'auth-left': 'socialist',
      'auth-right': 'conservative'
    };
    return stances[context.quadrant] || 'moderate';
  }

  // ============================================================================
  // RESPONSE INITIALIZATION
  // ============================================================================

  private initializeDemoResponses(): void {
    // Conservative responses
    this.responses.set('conservative', {
      general: [
        'We need to return to traditional values and fiscal responsibility.',
        'The free market will solve this problem more efficiently than government.',
        'This is exactly why we need smaller government and more individual freedom.',
        'Our founding principles are being undermined by these policies.',
        'Private sector solutions always outperform government programs.',
        'We must protect our constitutional rights and freedoms.',
        'This demonstrates the importance of law and order.',
        'Family values and personal responsibility are the foundation of society.'
      ],
      questions: [
        'The answer is simple: less government interference and more freedom.',
        'We should trust the market and individual choice, not bureaucrats.',
        'This goes back to constitutional principles and limited government.',
        'The solution is deregulation and empowering businesses to compete.',
        'We need to ask: what would our founders have done?'
      ],
      debates: [
        'Your big government approach has failed repeatedly throughout history.',
        'These socialist policies will destroy the economy and our freedoms.',
        'We need solutions based on merit, not identity politics.',
        'The data clearly shows conservative policies create more prosperity.',
        'This is just another example of the radical left agenda.'
      ]
    });

    // Liberal responses
    this.responses.set('liberal', {
      general: [
        'We need systemic change to address inequality and injustice.',
        'Government has a responsibility to help those who need it most.',
        'This is why we need comprehensive reform and social programs.',
        'Climate action and social justice must be our top priorities.',
        'Healthcare and education should be rights, not privileges.',
        'We must fight for marginalized communities and equal opportunity.',
        'Corporate greed is the root cause of many of our problems.',
        'Progress requires bold action, not incremental change.'
      ],
      questions: [
        'The solution requires addressing systemic inequalities and injustice.',
        'We need evidence-based policies that put people before profits.',
        'This is about human rights and creating a more equitable society.',
        'Government investment in public services is the answer.',
        'We should listen to experts and follow the science on this issue.'
      ],
      debates: [
        'Conservative policies have created the inequality we see today.',
        'Your trickle-down economics has been thoroughly debunked.',
        'We cannot ignore the voices of marginalized communities any longer.',
        'Climate change is an existential threat that requires immediate action.',
        'This is about basic human dignity and social justice.'
      ]
    });

    // Centrist responses
    this.responses.set('centrist', {
      general: [
        'We need pragmatic solutions that work for everyone.',
        'Both sides raise valid points that deserve consideration.',
        'The best approach combines elements from different perspectives.',
        'Evidence and data should guide our decision-making process.',
        'Compromise and bipartisan cooperation are essential.',
        'We should focus on practical outcomes, not ideological purity.',
        'Most issues are more complex than simple left-right divisions.',
        'Common ground exists if we listen to each other respectfully.'
      ],
      questions: [
        'The answer likely involves finding balance between competing priorities.',
        'We should examine what works in practice, not just theory.',
        'This requires careful analysis of trade-offs and unintended consequences.',
        'Multiple approaches could be tested through pilot programs.',
        'The evidence suggests a nuanced approach is needed.'
      ],
      debates: [
        'Both perspectives have merit, but the truth is probably somewhere in between.',
        'We should focus on shared values rather than partisan talking points.',
        'The data shows that extreme positions rarely produce good outcomes.',
        'Productive dialogue requires acknowledging the complexity of these issues.',
        'Most Americans want practical solutions, not political theater.'
      ]
    });

    // Libertarian responses
    this.responses.set('libertarian', {
      general: [
        'The government has no business regulating personal choices.',
        'Maximum freedom with minimum government is the ideal.',
        'Both major parties want to control your life in different ways.',
        'The market and voluntary cooperation solve problems better than force.',
        'Individual liberty should be the highest political value.',
        'Government intervention creates more problems than it solves.',
        'People should be free to make their own decisions and face the consequences.',
        'The Constitution limits government power for good reason.'
      ],
      questions: [
        'The government should stay out of it and let people choose freely.',
        'Markets and voluntary associations will find better solutions.',
        'This is not a legitimate role for government at any level.',
        'Individual rights and property rights are the foundation of any answer.',
        'The question assumes government should act, but that\'s the wrong premise.'
      ],
      debates: [
        'Both Republicans and Democrats want to expand government power.',
        'You\'re debating which form of authoritarianism is better.',
        'The real choice is between freedom and government control.',
        'Neither party respects individual liberty or constitutional limits.',
        'Government force is not the solution to social or economic problems.'
      ]
    });
  }

  private initializeReactionTemplates(): void {
    this.reactionTemplates.set('lib-left', [
      'This {topic} situation highlights exactly why we need {stance} policies.',
      'The {topic} story shows how systemic inequality affects real people.',
      'We can\'t ignore the {topic} crisis any longer - action is needed now.',
      'This {topic} development proves that corporate interests are harming society.'
    ]);

    this.reactionTemplates.set('lib-right', [
      'The {topic} issue demonstrates why we need more freedom, not more government.',
      'This {topic} situation could be solved by reducing regulations and barriers.',
      'The {topic} story shows how government interference makes things worse.',
      'Free markets would handle the {topic} problem more efficiently.'
    ]);

    this.reactionTemplates.set('auth-left', [
      'The {topic} crisis requires strong government action and public investment.',
      'This {topic} situation shows why we need comprehensive reform.',
      'The {topic} issue demonstrates the failure of market-based solutions.',
      'Only coordinated public policy can address the {topic} challenge.'
    ]);

    this.reactionTemplates.set('auth-right', [
      'The {topic} situation highlights the need for law, order, and traditional values.',
      'This {topic} crisis shows what happens when we abandon proven principles.',
      'The {topic} issue requires strong leadership and decisive action.',
      'We need to return to the time-tested solutions for the {topic} problem.'
    ]);
  }

  private getResponseSetForPersona(politicalContext: PoliticalContext): DemoResponseSet {
    // Map political quadrants to response sets
    const quadrantMapping = {
      'lib-left': 'liberal',
      'lib-right': 'libertarian',
      'auth-left': 'liberal',
      'auth-right': 'conservative'
    };

    const responseKey = quadrantMapping[politicalContext.quadrant] || 'centrist';
    return this.responses.get(responseKey) || this.responses.get('centrist')!;
  }

  // ============================================================================
  // HEALTH MONITORING
  // ============================================================================

  async checkHealth(): Promise<HealthStatus> {
    // Demo provider is always healthy
    return {
      isHealthy: true,
      responseTime: 100 + Math.random() * 50, // Simulated response time
      errorRate: 0,
      lastChecked: new Date(),
      consecutiveFailures: 0
    };
  }

  // ============================================================================
  // PROVIDER CAPABILITIES
  // ============================================================================

  getCapabilities(): ProviderCapabilities {
    return {
      maxTokens: 280, // Social media style responses
      supportsConversationHistory: false, // Demo mode doesn't track history
      supportsPoliticalAlignment: true,
      supportsPersonaInjection: true,
      supportsContentFiltering: false, // No external filtering
      supportedLanguages: ['en'],
      costPerToken: 0 // Demo mode is free
    };
  }

  // ============================================================================
  // SAFETY & VALIDATION
  // ============================================================================

  protected async checkContentSafety(content: string, persona: PersonaConfiguration): Promise<SafetyResults> {
    // Demo mode has basic safety checks
    const flags: string[] = [];

    // Simple keyword filtering
    const unsafeKeywords = ['violence', 'harm', 'hate', 'kill', 'death', 'terrorist'];
    const lowerContent = content.toLowerCase();

    unsafeKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        flags.push(`unsafe_keyword_${keyword}`);
      }
    });

    return {
      isAllowed: flags.length === 0,
      flags,
      confidence: flags.length === 0 ? 1.0 : 0.3
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async testConnection(): Promise<boolean> {
    return true; // Demo provider always connects
  }

  getEstimatedCost(request: AIRequest): number {
    return 0; // Demo mode is free
  }

  addCustomResponse(category: string, quadrant: string, response: string): void {
    if (!this.responses.has(quadrant)) {
      this.responses.set(quadrant, { general: [], questions: [], debates: [] });
    }

    const responseSet = this.responses.get(quadrant)!;
    if (category in responseSet) {
      (responseSet as any)[category].push(response);
    }
  }

  getAvailableResponseCategories(): string[] {
    return ['general', 'questions', 'debates'];
  }

  getResponseCount(): number {
    let total = 0;
    this.responses.forEach(responseSet => {
      total += responseSet.general.length + responseSet.questions.length + responseSet.debates.length;
    });
    return total;
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface DemoResponseSet {
  general: string[];
  questions: string[];
  debates: string[];
}