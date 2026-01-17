/**
 * MEANLY - LLM Types
 * Types for LLM API integration
 */

// Prompt template context
export interface LLMPromptContext {
  word: string;
  definition: string;
  userSentence: string;
  goodExample?: string;
  badExample?: string;
  contexts?: string[];
}

// System prompt configuration
export interface LLMSystemPrompt {
  role: 'system';
  content: string;
}

// User message
export interface LLMUserMessage {
  role: 'user';
  content: string;
}

// Chat completion request
export interface LLMChatRequest {
  messages: (LLMSystemPrompt | LLMUserMessage)[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

// Raw LLM response
export interface LLMRawResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finishReason: string;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Parsed LLM response for sentence check
export interface LLMParsedResponse {
  verdict: 'excellent' | 'good' | 'partial' | 'needs_work';
  comment: string;
  suggestedVersion?: string;
  tips?: string[];
}

// LLM request options
export interface LLMRequestOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

// LLM configuration for different models
export interface LLMModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'custom';
  temperature: number;
  maxTokens: number;
  costPerToken: number;
}

// Default LLM models
export const LLM_MODELS: Record<string, LLMModelConfig> = {
  default: {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 500,
    costPerToken: 0.00001,
  },
  premium: {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    temperature: 0.7,
    maxTokens: 800,
    costPerToken: 0.00003,
  },
} as const;

// Prompt template for sentence check
export const SENTENCE_CHECK_PROMPT = `
Ты — мягкий и поддерживающий преподаватель русского языка. 
Твоя задача — оценить, насколько уместно пользователь использовал слово в предложении.

Слово: {word}
Определение: {definition}
Предложение пользователя: {sentence}

Правила оценки:
1. Будь поддерживающим и мягким в обратной связи
2. Не используй цифровые оценки, только словесную характеристику
3. Укажи, что получилось хорошо
4. Если есть ошибки, объясни их доброжелательно
5. Предложи улучшенный вариант, если это уместно

Ответь в формате JSON:
{
  "verdict": "excellent" | "good" | "partial" | "needs_work",
  "comment": "Твой мягкий комментарий",
  "suggestedVersion": "Улучшенный вариант (если нужен)",
  "tips": ["Совет 1", "Совет 2"]
}
`;

// Content filter check result
export interface ContentFilterResult {
  isClean: boolean;
  flaggedCategories?: string[];
  message?: string;
}
