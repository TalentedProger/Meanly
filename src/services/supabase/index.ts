/**
 * MEANLY - Supabase Services Index
 * Re-exports all Supabase services
 */

export { 
  supabase, 
  getSupabaseClient,
  isSupabaseConfigured, 
  getCurrentUser, 
  getCurrentSession, 
  signOut 
} from './client';

export * from './auth';
export * from './words';
export * from './userWords';
export type { Database } from './database.types';

// Named export for authService (for backward compatibility)
import * as authFunctions from './auth';
export const authService = {
  ...authFunctions,
};
