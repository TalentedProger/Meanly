/**
 * MEANLY - Supabase Database Types
 * Generated from schema in supabase/migrations/001_initial_schema.sql
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Level = 'beginner' | 'intermediate' | 'advanced';
export type SubscriptionStatus = 'free' | 'pro' | 'lifetime';
export type WordStrength = 'new' | 'learning' | 'familiar' | 'mastered';
export type ExampleType = 'good' | 'bad' | 'before' | 'after' | 'context';
export type LLMVerdict = 'correct' | 'acceptable' | 'needs_improvement';
export type PriceTier = 'free' | 'pro' | 'paid';
export type PurchaseType = 'subscription' | 'pack';
export type Store = 'ios' | 'android';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          level: Level;
          goal: string | null;
          daily_time_minutes: number;
          subscription_status: SubscriptionStatus;
          subscription_expires_at: string | null;
          streak_count: number;
          last_practice_date: string | null;
          words_learned: number;
          practice_sessions: number;
          total_practice_time: number;
          onboarding_completed: boolean;
          notification_token: string | null;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: Level;
          goal?: string | null;
          daily_time_minutes?: number;
          subscription_status?: SubscriptionStatus;
          subscription_expires_at?: string | null;
          streak_count?: number;
          last_practice_date?: string | null;
          words_learned?: number;
          practice_sessions?: number;
          total_practice_time?: number;
          onboarding_completed?: boolean;
          notification_token?: string | null;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: Level;
          goal?: string | null;
          daily_time_minutes?: number;
          subscription_status?: SubscriptionStatus;
          subscription_expires_at?: string | null;
          streak_count?: number;
          last_practice_date?: string | null;
          words_learned?: number;
          practice_sessions?: number;
          total_practice_time?: number;
          onboarding_completed?: boolean;
          notification_token?: string | null;
          notifications_enabled?: boolean;
          updated_at?: string;
        };
      };
      words: {
        Row: {
          id: string;
          word: string;
          base_word: string;
          definition: string;
          part_of_speech: string | null;
          level: Level;
          category: string;
          is_pro: boolean;
          is_word_of_day: boolean;
          word_of_day_date: string | null;
          usage_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          word: string;
          base_word: string;
          definition: string;
          part_of_speech?: string | null;
          level?: Level;
          category?: string;
          is_pro?: boolean;
          is_word_of_day?: boolean;
          word_of_day_date?: string | null;
          usage_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          word?: string;
          base_word?: string;
          definition?: string;
          part_of_speech?: string | null;
          level?: Level;
          category?: string;
          is_pro?: boolean;
          is_word_of_day?: boolean;
          word_of_day_date?: string | null;
          usage_count?: number;
          updated_at?: string;
        };
      };
      examples: {
        Row: {
          id: string;
          word_id: string;
          type: ExampleType;
          sentence: string;
          context_name: string | null;
          explanation: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          word_id: string;
          type: ExampleType;
          sentence: string;
          context_name?: string | null;
          explanation?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          word_id?: string;
          type?: ExampleType;
          sentence?: string;
          context_name?: string | null;
          explanation?: string | null;
          order_index?: number;
        };
      };
      user_words: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          strength: WordStrength;
          is_favorite: boolean;
          is_offline: boolean;
          practice_count: number;
          correct_count: number;
          last_practiced_at: string | null;
          next_review_at: string | null;
          saved_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word_id: string;
          strength?: WordStrength;
          is_favorite?: boolean;
          is_offline?: boolean;
          practice_count?: number;
          correct_count?: number;
          last_practiced_at?: string | null;
          next_review_at?: string | null;
          saved_at?: string;
          updated_at?: string;
        };
        Update: {
          strength?: WordStrength;
          is_favorite?: boolean;
          is_offline?: boolean;
          practice_count?: number;
          correct_count?: number;
          last_practiced_at?: string | null;
          next_review_at?: string | null;
          updated_at?: string;
        };
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          user_sentence: string | null;
          llm_verdict: LLMVerdict | null;
          llm_comment: string | null;
          llm_suggestion: string | null;
          duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word_id: string;
          user_sentence?: string | null;
          llm_verdict?: LLMVerdict | null;
          llm_comment?: string | null;
          llm_suggestion?: string | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          user_sentence?: string | null;
          llm_verdict?: LLMVerdict | null;
          llm_comment?: string | null;
          llm_suggestion?: string | null;
          duration_seconds?: number | null;
        };
      };
      word_packs: {
        Row: {
          id: string;
          name: string;
          name_ru: string;
          description: string | null;
          description_ru: string | null;
          cover_image_url: string | null;
          price_tier: PriceTier;
          price_cents: number;
          word_count: number;
          is_featured: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ru: string;
          description?: string | null;
          description_ru?: string | null;
          cover_image_url?: string | null;
          price_tier?: PriceTier;
          price_cents?: number;
          word_count?: number;
          is_featured?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          name_ru?: string;
          description?: string | null;
          description_ru?: string | null;
          cover_image_url?: string | null;
          price_tier?: PriceTier;
          price_cents?: number;
          word_count?: number;
          is_featured?: boolean;
          order_index?: number;
        };
      };
      word_pack_items: {
        Row: {
          id: string;
          pack_id: string;
          word_id: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          pack_id: string;
          word_id: string;
          order_index?: number;
        };
        Update: {
          pack_id?: string;
          word_id?: string;
          order_index?: number;
        };
      };
      user_purchases: {
        Row: {
          id: string;
          user_id: string;
          pack_id: string | null;
          purchase_type: PurchaseType;
          store: Store | null;
          transaction_id: string | null;
          receipt_data: string | null;
          purchased_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pack_id?: string | null;
          purchase_type: PurchaseType;
          store?: Store | null;
          transaction_id?: string | null;
          receipt_data?: string | null;
          purchased_at?: string;
        };
        Update: {
          pack_id?: string | null;
          purchase_type?: PurchaseType;
          store?: Store | null;
          transaction_id?: string | null;
          receipt_data?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      level: Level;
      subscription_status: SubscriptionStatus;
      word_strength: WordStrength;
      example_type: ExampleType;
      llm_verdict: LLMVerdict;
      price_tier: PriceTier;
      purchase_type: PurchaseType;
      store: Store;
    };
  };
}

// Helper types for easier access
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Word = Database['public']['Tables']['words']['Row'];
export type WordInsert = Database['public']['Tables']['words']['Insert'];
export type WordUpdate = Database['public']['Tables']['words']['Update'];

export type Example = Database['public']['Tables']['examples']['Row'];
export type ExampleInsert = Database['public']['Tables']['examples']['Insert'];

export type UserWord = Database['public']['Tables']['user_words']['Row'];
export type UserWordInsert = Database['public']['Tables']['user_words']['Insert'];
export type UserWordUpdate = Database['public']['Tables']['user_words']['Update'];

export type PracticeSession = Database['public']['Tables']['practice_sessions']['Row'];
export type PracticeSessionInsert = Database['public']['Tables']['practice_sessions']['Insert'];

export type WordPack = Database['public']['Tables']['word_packs']['Row'];
export type WordPackItem = Database['public']['Tables']['word_pack_items']['Row'];
export type UserPurchase = Database['public']['Tables']['user_purchases']['Row'];

// Extended types with relations
export interface WordWithExamples extends Word {
  examples: Example[];
}

export interface UserWordWithWord extends UserWord {
  word: WordWithExamples;
}
