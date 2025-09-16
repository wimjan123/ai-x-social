#!/usr/bin/env node

import { aiOrchestrator } from '../services/AIOrchestrator';
import { logger } from '../lib/logger';

async function initializeAI() {
  try {
    logger.info('Starting AI Orchestrator initialization...');

    // Get initial provider status
    const initialStatus = await aiOrchestrator.getProviderStatus();
    logger.info('Initial AI provider status:', initialStatus);

    // Test AI generation with a simple request
    const testRequest = {
      personaId: 'test-persona',
      prompt: 'Hello! Please respond as a test AI persona.',
      systemPrompt: 'You are a helpful AI assistant testing the multi-provider system.',
      temperature: 0.7,
      maxTokens: 100,
    };

    logger.info('Testing AI response generation...');
    const testResponse = await aiOrchestrator.generateResponse(testRequest);

    logger.info('AI test response generated successfully:', {
      provider: testResponse.provider,
      model: testResponse.model,
      contentLength: testResponse.content.length,
      usage: testResponse.usage,
      finishReason: testResponse.finishReason,
    });

    logger.info('AI response content preview:', testResponse.content.substring(0, 200));

    // Get updated provider status
    const updatedStatus = await aiOrchestrator.getProviderStatus();
    logger.info('Updated AI provider status:', updatedStatus);

    // Get metrics
    const metrics = aiOrchestrator.getMetrics();
    logger.info('AI Orchestrator metrics:', metrics);

    // Test provider priorities and fallback
    logger.info('Testing provider selection and fallback mechanisms...');

    // Generate multiple test responses to see provider distribution
    const responses = [];
    for (let i = 0; i < 3; i++) {
      try {
        const response = await aiOrchestrator.generateResponse({
          ...testRequest,
          prompt: `Test message ${i + 1}: How are you doing today?`,
        });
        responses.push({
          index: i + 1,
          provider: response.provider,
          model: response.model,
          length: response.content.length,
        });
      } catch (error) {
        logger.warn(`Test response ${i + 1} failed:`, error);
      }
    }

    logger.info('Multiple response test results:', responses);

    // Test custom provider configuration (if environment supports it)
    const customApiKey = process.env.CUSTOM_AI_API_KEY;
    const customBaseUrl = process.env.CUSTOM_AI_BASE_URL;

    if (customApiKey && customBaseUrl) {
      logger.info('Testing custom provider configuration...');
      const customConfigured = await aiOrchestrator.configureCustomProvider(customApiKey, customBaseUrl);

      if (customConfigured) {
        logger.info('Custom provider configured successfully');

        const customResponse = await aiOrchestrator.generateResponse({
          ...testRequest,
          prompt: 'Testing custom provider configuration.',
        });

        logger.info('Custom provider test response:', {
          provider: customResponse.provider,
          model: customResponse.model,
          contentLength: customResponse.content.length,
        });
      } else {
        logger.warn('Custom provider configuration failed');
      }
    } else {
      logger.info('No custom provider configuration found (CUSTOM_AI_API_KEY or CUSTOM_AI_BASE_URL not set)');
    }

    // Final status check
    const finalStatus = await aiOrchestrator.getProviderStatus();
    const availableProviders = Object.entries(finalStatus).filter(([, provider]) => provider.isAvailable);
    const unavailableProviders = Object.entries(finalStatus).filter(([, provider]) => !provider.isAvailable);

    logger.info(`AI Orchestrator initialization completed successfully!`);
    logger.info(`Available providers: ${availableProviders.map(([name]) => name).join(', ')}`);

    if (unavailableProviders.length > 0) {
      logger.warn(`Unavailable providers: ${unavailableProviders.map(([name, provider]) => `${name} (${provider.lastError || 'Unknown error'})`).join(', ')}`);
    }

    // Performance recommendations
    if (availableProviders.length === 0) {
      logger.warn('⚠️  No AI providers are available. The system will run in demo mode.');
      logger.warn('   Configure API keys for Claude, OpenAI, or Gemini for full functionality.');
    } else if (availableProviders.length === 1) {
      logger.info('ℹ️  Only one AI provider is available. Consider configuring additional providers for better reliability.');
    } else {
      logger.info('✅ Multiple AI providers configured. System has good failover capability.');
    }

  } catch (error) {
    logger.error('AI Orchestrator initialization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeAI().catch((error) => {
    logger.error('Unhandled error during AI initialization:', error);
    process.exit(1);
  });
}

export { initializeAI };