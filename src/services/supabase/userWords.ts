/**
 * MEANLY - User Words Service
 * User's saved words operations
 * All functions gracefully handle offline/local mode
 */

import { getSupabaseClient } from './client';
import type { UserWord, WordStrength } from '../../types/word';

// Spaced repetition intervals in hours
const SPACED_REPETITION_INTERVALS: Record<WordStrength, number> = {
  new: 4,
  learning: 24,
  familiar: 72,
  mastered: 168,
};

// Database row types for type assertions
interface DbUserWord {
  id: string;
  user_id: string;
  word_id: string;
  strength: string;
  practice_count: number;
  correct_count: number;
  last_practiced_at: string | null;
  next_practice_at: string | null;
  saved_at: string;
  notes: string | null;
  is_favorite: boolean;
  is_offline_cached: boolean;
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

interface DbUserWordPartial {
  strength: string;
  practice_count: number;
  correct_count: number;
}

/**
 * Get user's saved words
 */
export async function getUserWords(userId: string): Promise<UserWord[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const { data, error } = await client
    .from('user_words')
    .select(`
      id,
      user_id,
      word_id,
      strength,
      practice_count,
      correct_count,
      last_practiced_at,
      next_practice_at,
      saved_at,
      notes,
      is_favorite,
      is_offline_cached,
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
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) throw error;

  const typedData = (data || []) as unknown as DbUserWord[];
  return typedData.map(transformUserWord);
}

/**
 * Save a word for user
 */
export async function saveWord(userId: string, wordId: string): Promise<UserWord | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data, error } = await client
    .from('user_words')
    .insert({
      user_id: userId,
      word_id: wordId,
      strength: 'new',
      practice_count: 0,
      correct_count: 0,
      saved_at: new Date().toISOString(),
      is_favorite: false,
      is_offline_cached: false,
    } as any)
    .select(`
      *,
      words (*)
    `)
    .single();

  if (error) throw error;

  return transformUserWord(data as unknown as DbUserWord);
}

/**
 * Remove saved word
 */
export async function unsaveWord(userId: string, wordId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  
  const { error } = await client
    .from('user_words')
    .delete()
    .eq('user_id', userId)
    .eq('word_id', wordId);

  if (error) throw error;
}

/**
 * Check if word is saved
 */
export async function isWordSaved(userId: string, wordId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  
  const { data, error } = await client
    .from('user_words')
    .select('id')
    .eq('user_id', userId)
    .eq('word_id', wordId)
    .single();

  if (error) return false;
  return !!data;
}

/**
 * Update word strength after practice
 */
export async function updateWordStrength(
  userId: string,
  wordId: string,
  isCorrect: boolean
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  
  // First get current state
  const { data: current, error: getError } = await client
    .from('user_words')
    .select('strength, practice_count, correct_count')
    .eq('user_id', userId)
    .eq('word_id', wordId)
    .single();

  if (getError) throw getError;

  const typedCurrent = current as unknown as DbUserWordPartial | null;
  const practiceCount = (typedCurrent?.practice_count || 0) + 1;
  const correctCount = (typedCurrent?.correct_count || 0) + (isCorrect ? 1 : 0);
  
  // Calculate new strength based on performance
  const newStrength = calculateNewStrength(
    (typedCurrent?.strength as WordStrength) || 'new',
    isCorrect,
    correctCount,
    practiceCount
  );

  // Calculate next practice time
  const nextPracticeAt = calculateNextPracticeTime(newStrength);

  const { error } = await client
    .from('user_words')
    // @ts-ignore - Database types incomplete for update operations
    .update({
      strength: newStrength,
      practice_count: practiceCount,
      correct_count: correctCount,
      last_practiced_at: new Date().toISOString(),
      next_practice_at: nextPracticeAt,
    })
    .eq('user_id', userId)
    .eq('word_id', wordId);

  if (error) throw error;
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  userId: string,
  wordId: string,
  isFavorite: boolean
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  
  const { error } = await client
    .from('user_words')
    // @ts-ignore - Database types incomplete for update operations
    .update({ is_favorite: isFavorite })
    .eq('user_id', userId)
    .eq('word_id', wordId);

  if (error) throw error;
}

/**
 * Update notes for a word
 */
export async function updateWordNotes(
  userId: string,
  wordId: string,
  notes: string
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  
  const { error } = await client
    .from('user_words')
    // @ts-ignore - Database types incomplete for update operations
    .update({ notes })
    .eq('user_id', userId)
    .eq('word_id', wordId);

  if (error) throw error;
}

/**
 * Get words due for practice (spaced repetition)
 */
export async function getWordsDueForPractice(userId: string): Promise<UserWord[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const now = new Date().toISOString();

  const { data, error } = await client
    .from('user_words')
    .select(`
      *,
      words (*)
    `)
    .eq('user_id', userId)
    .or(`next_practice_at.is.null,next_practice_at.lte.${now}`)
    .order('next_practice_at', { ascending: true, nullsFirst: true })
    .limit(10);

  if (error) throw error;

  return (data || []).map(transformUserWord);
}

/**
 * Get weak words (low strength)
 */
export async function getWeakWords(userId: string): Promise<UserWord[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  
  const { data, error } = await client
    .from('user_words')
    .select(`
      *,
      words (*)
    `)
    .eq('user_id', userId)
    .in('strength', ['new', 'learning'])
    .order('practice_count', { ascending: true })
    .limit(10);

  if (error) throw error;

  return (data || []).map(transformUserWord);
}

/**
 * Calculate new strength based on practice performance
 */
function calculateNewStrength(
  currentStrength: WordStrength,
  isCorrect: boolean,
  correctCount: number,
  practiceCount: number
): WordStrength {
  const successRate = practiceCount > 0 ? correctCount / practiceCount : 0;

  if (!isCorrect) {
    // Move down on incorrect
    if (currentStrength === 'mastered') return 'familiar';
    if (currentStrength === 'familiar') return 'learning';
    return currentStrength;
  }

  // Move up on correct with good track record
  if (currentStrength === 'new' && practiceCount >= 1) return 'learning';
  if (currentStrength === 'learning' && practiceCount >= 3 && successRate >= 0.7) return 'familiar';
  if (currentStrength === 'familiar' && practiceCount >= 5 && successRate >= 0.8) return 'mastered';

  return currentStrength;
}

/**
 * Calculate next practice time based on spaced repetition
 */
function calculateNextPracticeTime(strength: WordStrength): string {
  const hours = SPACED_REPETITION_INTERVALS[strength];
  const nextTime = new Date();
  nextTime.setHours(nextTime.getHours() + hours);
  return nextTime.toISOString();
}

/**
 * Transform database user_word to app UserWord type
 */
function transformUserWord(dbUserWord: unknown): UserWord {
  const uw = dbUserWord as Record<string, unknown>;
  const word = uw.words as Record<string, unknown>;

  return {
    id: uw.id as string,
    userId: uw.user_id as string,
    wordId: uw.word_id as string,
    word: {
      id: word.id as string,
      word: word.word as string,
      baseWord: word.base_word as string,
      definition: word.definition as string,
      pronunciation: word.pronunciation as string | undefined,
      partOfSpeech: word.part_of_speech as UserWord['word']['partOfSpeech'],
      level: word.level as UserWord['word']['level'],
      categoryId: word.category_id as string,
      goodExample: word.good_example as UserWord['word']['goodExample'],
      badExample: word.bad_example as UserWord['word']['badExample'],
      beforeSentence: word.before_sentence as string,
      afterSentence: word.after_sentence as string,
      contexts: word.contexts as UserWord['word']['contexts'],
      isPro: word.is_pro as boolean,
      isPackWord: word.is_pack_word as boolean,
      packId: word.pack_id as string | undefined,
      createdAt: word.created_at as string,
      updatedAt: word.updated_at as string,
    },
    strength: uw.strength as WordStrength,
    practiceCount: uw.practice_count as number,
    correctCount: uw.correct_count as number,
    lastPracticedAt: uw.last_practiced_at as string | undefined,
    nextPracticeAt: uw.next_practice_at as string | undefined,
    savedAt: uw.saved_at as string,
    notes: uw.notes as string | undefined,
    isFavorite: uw.is_favorite as boolean,
    isOfflineCached: uw.is_offline_cached as boolean,
  };
}
