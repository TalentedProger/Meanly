/**
 * MEANLY - Services Index
 */

// Supabase Services
export { supabase } from './supabase/client';
export * from './supabase/auth';
export * from './supabase/words';
export * from './supabase/userWords';

// LLM Service
export { evaluateSentence, getWritingSuggestions, generateMnemonic } from './llm';
