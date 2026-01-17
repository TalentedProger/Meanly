/**
 * MEANLY - Words Service
 * Word-related API operations
 * All functions gracefully handle offline/local mode
 */

import { getSupabaseClient } from './client';
import type { Word, WordOfTheDay, WordFilters } from '../../types/word';

// Database row types
interface DbWordOfDay {
  id: string;
  word_id: string;
  date: string;
  is_active: boolean;
  words: DbWord | null;
}

interface DbWord {
  id: string;
  word: string;
  base_word: string;
  definition: string;
  pronunciation: string | null;
  part_of_speech: string;
  level: string;
  category_id: string;
  good_example: unknown;
  bad_example: unknown;
  before_sentence: string;
  after_sentence: string;
  contexts: unknown;
  is_pro: boolean;
  is_pack_word: boolean;
  pack_id: string | null;
  created_at: string;
  updated_at: string;
}

interface DbUserWordRef {
  word_id: string;
}

/**
 * Get Word of the Day
 */
export async function getWordOfTheDay(): Promise<WordOfTheDay | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await client
    .from('word_of_day')
    .select(`
      id,
      word_id,
      date,
      is_active,
      words (
        id,
        word,
        base_word,
        definition,
        pronunciation,
        part_of_speech,
        level,
        category_id,
        good_example,
        bad_example,
        before_sentence,
        after_sentence,
        contexts,
        is_pro,
        is_pack_word,
        pack_id,
        created_at,
        updated_at
      )
    `)
    .eq('date', today)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const typedData = data as unknown as DbWordOfDay;

  return {
    id: typedData.id,
    wordId: typedData.word_id,
    word: transformWord(typedData.words),
    date: typedData.date,
    isActive: typedData.is_active,
  };
}

/**
 * Get word by ID
 */
export async function getWordById(id: string): Promise<Word | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('words')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return transformWord(data);
}

/**
 * Get words with filters
 */
export async function getWords(filters?: WordFilters): Promise<Word[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  let query = client.from('words').select('*');

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.level) {
    query = query.eq('level', filters.level);
  }

  if (filters?.isPro !== undefined) {
    query = query.eq('is_pro', filters.isPro);
  }

  if (filters?.searchQuery) {
    query = query.or(
      `word.ilike.%${filters.searchQuery}%,base_word.ilike.%${filters.searchQuery}%,definition.ilike.%${filters.searchQuery}%`
    );
  }

  const { data, error } = await query.order('word', { ascending: true });

  if (error) throw error;

  return (data || []).map(transformWord);
}

/**
 * Get words by category
 */
export async function getWordsByCategory(categoryId: string): Promise<Word[]> {
  return getWords({ categoryId });
}

/**
 * Get words by level
 */
export async function getWordsByLevel(
  level: 'beginner' | 'intermediate' | 'advanced'
): Promise<Word[]> {
  return getWords({ level });
}

/**
 * Search words
 */
export async function searchWords(query: string): Promise<Word[]> {
  return getWords({ searchQuery: query });
}

/**
 * Get recommended words for user
 */
export async function getRecommendedWords(
  userId: string,
  limit = 5
): Promise<Word[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  // Get user's saved word IDs to exclude
  const { data: userWords } = await client
    .from('user_words')
    .select('word_id')
    .eq('user_id', userId);

  const typedUserWords = (userWords || []) as unknown as DbUserWordRef[];
  const savedWordIds = typedUserWords.map((uw) => uw.word_id);

  let query = client.from('words').select('*').eq('is_pro', false);

  if (savedWordIds.length > 0) {
    query = query.not('id', 'in', `(${savedWordIds.join(',')})`);
  }

  const { data, error } = await query.limit(limit);

  if (error) throw error;

  return (data || []).map(transformWord);
}

/**
 * Transform database word to app Word type
 */
function transformWord(dbWord: unknown): Word {
  const word = dbWord as Record<string, unknown>;
  
  return {
    id: word.id as string,
    word: word.word as string,
    baseWord: word.base_word as string,
    definition: word.definition as string,
    pronunciation: word.pronunciation as string | undefined,
    partOfSpeech: word.part_of_speech as Word['partOfSpeech'],
    level: word.level as Word['level'],
    categoryId: word.category_id as string,
    goodExample: word.good_example as Word['goodExample'],
    badExample: word.bad_example as Word['badExample'],
    beforeSentence: word.before_sentence as string,
    afterSentence: word.after_sentence as string,
    contexts: word.contexts as Word['contexts'],
    isPro: word.is_pro as boolean,
    isPackWord: word.is_pack_word as boolean,
    packId: word.pack_id as string | undefined,
    createdAt: word.created_at as string,
    updatedAt: word.updated_at as string,
  };
}
