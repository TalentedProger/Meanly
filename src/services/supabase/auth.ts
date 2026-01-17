/**
 * MEANLY - Auth Service
 * Authentication operations using Supabase
 * All functions gracefully handle offline/local mode
 */

import { getSupabaseClient, isSupabaseConfigured } from './client';

export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail({
  email,
  password,
  displayName,
}: SignUpParams) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured. Please use guest mode.');
  }
  
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail({ email, password }: SignInParams) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured. Please use guest mode.');
  }
  
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with Google OAuth
 * Note: Requires expo-auth-session setup
 */
export async function signInWithGoogle(idToken: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured. Please use guest mode.');
  }
  
  const { data, error } = await client.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with Apple
 * Note: Requires expo-apple-authentication setup
 */
export async function signInWithApple(idToken: string, nonce: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured. Please use guest mode.');
  }
  
  const { data, error } = await client.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    nonce,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in as guest (anonymous) via Supabase
 * Note: For local guest mode, use authStore.signInAsGuest() instead
 */
export async function signInAsGuest() {
  const client = getSupabaseClient();
  if (!client) {
    // Return mock data for local mode
    return {
      user: null,
      session: null,
    };
  }
  
  const { data, error } = await client.auth.signInAnonymously();

  if (error) throw error;
  return data;
}

/**
 * Convert guest to permanent user
 */
export async function convertGuestToUser({
  email,
  password,
}: SignUpParams) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured.');
  }
  
  const { data, error } = await client.auth.updateUser({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const client = getSupabaseClient();
  if (!client) {
    return { error: { message: 'Supabase not configured' } };
  }
  
  return client.auth.resetPasswordForEmail(email, {
    redirectTo: 'meanly://reset-password',
  });
}

/**
 * Update password with reset token
 */
export async function updatePassword(newPassword: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase not configured.');
  }
  
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const client = getSupabaseClient();
  if (!client) return;
  
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data: { user }, error } = await client.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) return null;
  
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw error;
  return session;
}
