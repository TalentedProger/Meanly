/**
 * MEANLY - Word Types
 * Types for words, examples, and learning flow
 */

// Base Word structure
export interface Word {
  id: string;
  word: string; // The expressive word (e.g., "Великолепный")
  baseWord: string; // Simple word it replaces (e.g., "Хороший")
  definition: string; // Clear definition
  pronunciation?: string; // IPA or phonetic guide
  partOfSpeech: WordPartOfSpeech;
  level: WordLevel;
  categoryId: string;
  
  // Examples
  goodExample: WordExample;
  badExample: WordExample;
  
  // Sentence transformation
  beforeSentence: string; // Original sentence with simple word
  afterSentence: string; // Transformed sentence with expressive word
  
  // Context profiles
  contexts: ContextProfile[];
  contextProfiles?: ContextProfile[]; // Alias for contexts
  
  // Learning helpers
  mnemonic?: string; // Memory aid
  synonyms?: string[];
  antonyms?: string[];
  
  // Metadata
  isPro: boolean;
  isPackWord: boolean; // Part of a paid word pack
  packId?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Word example (good or bad usage)
export interface WordExample {
  sentence: string;
  isCorrect: boolean;
  explanation: string; // Why it's good or bad
  highlightWord?: string; // Word to highlight in the sentence
  contextProfile?: string; // Context for this example
  translation?: string; // Translation for language learners
}

// Context profile showing word usage in different situations
export interface ContextProfile {
  id: string;
  situation: string; // e.g., "В деловом письме"
  example: string; // Example usage in this context
  tone: ContextTone;
}

export type ContextTone = 'formal' | 'informal' | 'neutral' | 'creative';

export type WordPartOfSpeech = 
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'expression';

export type WordLevel = 'beginner' | 'intermediate' | 'advanced';

// Word of the Day
export interface WordOfTheDay {
  id: string;
  wordId: string;
  word: Word;
  date: string; // ISO date string (YYYY-MM-DD)
  isActive: boolean;
}

// Word Pack (purchasable collection)
export interface WordPack {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  price: string; // Formatted price
  priceId: string; // App Store / Play Store product ID
  categoryId: string;
  coverImage?: string;
  words: Word[];
  isPurchased: boolean;
}

// User's saved word with learning progress
export interface UserWord {
  id: string;
  userId: string;
  wordId: string;
  word: Word;
  
  // Learning progress
  strength: WordStrength;
  practiceCount: number;
  correctCount: number;
  lastPracticedAt?: string;
  nextPracticeAt?: string; // Spaced repetition
  
  // User data
  savedAt: string;
  notes?: string;
  isFavorite: boolean;
  
  // Offline
  isOfflineCached: boolean;
  localChanges?: boolean; // Has unsynced changes
}

export type WordStrength = 'new' | 'learning' | 'familiar' | 'mastered';

// Learning flow step (8-step word learning)
export interface LearningStep {
  step: number;
  type: LearningStepType;
  completed: boolean;
  data?: unknown;
}

export type LearningStepType =
  | 'base_word' // Step 0: Show familiar word
  | 'new_word' // Step 1: Introduce new word + definition
  | 'examples' // Step 2: Good/bad examples
  | 'sentence_swap' // Step 3: Before/after sentence
  | 'contexts' // Step 4: Context profiles
  | 'micro_quiz' // Step 5: Optional quick quiz
  | 'practice' // Step 6: User writes sentence
  | 'llm_result' // Step 7: LLM evaluation
  | 'save'; // Step 8: Save word option

// Word list filters
export interface WordFilters {
  categoryId?: string;
  level?: WordLevel;
  strength?: WordStrength;
  isPro?: boolean;
  searchQuery?: string;
  offlineOnly?: boolean;
}

// Word list sort options
export type WordSortOption = 
  | 'savedAt_desc'
  | 'savedAt_asc'
  | 'alphabetical'
  | 'strength'
  | 'lastPracticed';
