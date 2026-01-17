/**
 * MEANLY - LLM Service
 * AI-powered sentence evaluation using Supabase Edge Functions
 */

import { supabase } from './supabase/client';
import type { SentenceEvaluation } from '../types/practice';
import type { Word } from '../types/word';

interface WordForEvaluation {
  word: string;
  definition: string;
  partOfSpeech: string;
  level: string;
  contexts?: string[];
  goodExample?: string;
  badExample?: string;
}

interface EvaluationRequest {
  sentence: string;
  word: WordForEvaluation;
  userId?: string;
}

interface EvaluationResponse {
  score: number;
  isCorrect: boolean;
  feedback: string;
  suggestions: string[];
  grammarErrors: string[];
  contextScore: number;
  improvedVersion?: string;
}

/**
 * Evaluate user's sentence using LLM
 */
export async function evaluateSentence(
  sentence: string,
  word: Word,
  userId?: string
): Promise<SentenceEvaluation> {
  try {
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke<EvaluationResponse>(
      'evaluate-sentence',
      {
        body: {
          sentence,
          word: {
            word: word.word,
            definition: word.definition,
            partOfSpeech: word.partOfSpeech,
            level: word.level,
            contexts: word.contextProfiles?.map(c => c.situation),
            goodExample: word.goodExample?.sentence,
            badExample: word.badExample?.sentence,
          } as WordForEvaluation,
          userId,
        } as EvaluationRequest,
      }
    );

    if (error) {
      console.error('LLM evaluation error:', error);
      return createFallbackEvaluation(sentence, word);
    }

    if (!data) {
      return createFallbackEvaluation(sentence, word);
    }

    return {
      score: data.score,
      isCorrect: data.isCorrect,
      feedback: data.feedback,
      suggestions: data.suggestions || [],
      grammarErrors: data.grammarErrors || [],
      contextScore: data.contextScore,
      originalSentence: sentence,
      improvedVersion: data.improvedVersion,
    };
  } catch (error) {
    console.error('LLM service error:', error);
    return createFallbackEvaluation(sentence, word);
  }
}

/**
 * Create fallback evaluation when LLM is unavailable
 */
function createFallbackEvaluation(
  sentence: string,
  word: Word
): SentenceEvaluation {
  const wordLower = word.word.toLowerCase();
  const sentenceLower = sentence.toLowerCase();
  const containsWord = sentenceLower.includes(wordLower);
  const wordCount = sentence.split(/\s+/).filter(Boolean).length;
  
  // Basic scoring
  let score = 0;
  const feedback: string[] = [];
  const suggestions: string[] = [];

  // Check if word is present
  if (containsWord) {
    score += 40;
    feedback.push('Слово использовано в предложении.');
  } else {
    feedback.push('Слово не найдено в предложении.');
    suggestions.push(`Добавьте слово "${word.word}" в ваше предложение.`);
  }

  // Check sentence length
  if (wordCount >= 5) {
    score += 20;
    feedback.push('Предложение достаточной длины.');
  } else {
    suggestions.push('Попробуйте написать более развернутое предложение.');
  }

  // Check punctuation
  if (/[.!?]$/.test(sentence.trim())) {
    score += 10;
  } else {
    suggestions.push('Добавьте знак препинания в конце предложения.');
  }

  // Check capitalization
  if (/^[А-ЯA-Z]/.test(sentence.trim())) {
    score += 10;
  } else {
    suggestions.push('Начните предложение с заглавной буквы.');
  }

  // Context bonus (if word is surrounded by other words)
  const wordIndex = sentenceLower.indexOf(wordLower);
  if (wordIndex > 0 && wordIndex < sentence.length - word.word.length) {
    score += 20;
    feedback.push('Слово интегрировано в контекст.');
  }

  return {
    score: Math.min(100, score),
    isCorrect: score >= 60,
    feedback: feedback.join(' ') || 'Предложение проверено.',
    suggestions,
    grammarErrors: [],
    contextScore: containsWord ? 70 : 30,
    originalSentence: sentence,
  };
}

/**
 * Get writing suggestions for a word
 */
export async function getWritingSuggestions(
  word: Word,
  partialSentence: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke<{ suggestions: string[] }>(
      'writing-suggestions',
      {
        body: {
          word: word.word,
          partialSentence,
          context: word.contextProfiles,
        },
      }
    );

    if (error || !data) {
      return getDefaultSuggestions(word);
    }

    return data.suggestions;
  } catch (error) {
    console.error('Suggestions error:', error);
    return getDefaultSuggestions(word);
  }
}

/**
 * Default suggestions when LLM is unavailable
 */
function getDefaultSuggestions(word: Word): string[] {
  return [
    `Попробуйте использовать "${word.word}" в начале предложения.`,
    `Опишите ситуацию, где уместно сказать "${word.word}".`,
    `Используйте "${word.word}" вместе с прилагательным или наречием.`,
  ];
}

/**
 * Generate mnemonic for a word
 */
export async function generateMnemonic(word: Word): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke<{ mnemonic: string }>(
      'generate-mnemonic',
      {
        body: {
          word: word.word,
          definition: word.definition,
          partOfSpeech: word.partOfSpeech,
        },
      }
    );

    if (error || !data) {
      return null;
    }

    return data.mnemonic;
  } catch (error) {
    console.error('Mnemonic generation error:', error);
    return null;
  }
}

/**
 * Evaluate sentence locally (offline mode)
 * Simple but effective validation for word usage
 */
export async function evaluateSentenceLocal(
  sentence: string,
  word: Word
): Promise<{
  score: number;
  isCorrect: boolean;
  feedback: string;
  suggestions: string[];
}> {
  // Simulate network delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const result = createFallbackEvaluation(sentence, word);
  
  return {
    score: result.score,
    isCorrect: result.isCorrect,
    feedback: result.feedback,
    suggestions: result.suggestions,
  };
}

export default {
  evaluateSentence,
  evaluateSentenceLocal,
  getWritingSuggestions,
  generateMnemonic,
};
