-- ============================================
-- MEANLY Database Schema
-- Run this migration in Supabase SQL Editor
-- Version: 1.0.0
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Profile Table
-- Extends Supabase auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  goal TEXT DEFAULT 'speak_confidently',
  daily_time_minutes INTEGER DEFAULT 5,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'lifetime')),
  subscription_expires_at TIMESTAMPTZ,
  streak_count INTEGER DEFAULT 0,
  last_practice_date DATE,
  words_learned INTEGER DEFAULT 0,
  practice_sessions INTEGER DEFAULT 0,
  total_practice_time INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  notification_token TEXT,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Words Table
-- Master list of all vocabulary words
-- ============================================
CREATE TABLE IF NOT EXISTS public.words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  base_word TEXT NOT NULL,
  definition TEXT NOT NULL,
  part_of_speech TEXT,
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT DEFAULT 'everyday',
  is_pro BOOLEAN DEFAULT false,
  is_word_of_day BOOLEAN DEFAULT false,
  word_of_day_date DATE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Examples Table
-- Good and bad usage examples for words
-- ============================================
CREATE TABLE IF NOT EXISTS public.examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id UUID NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('good', 'bad', 'before', 'after', 'context')),
  sentence TEXT NOT NULL,
  context_name TEXT,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- User Words Table
-- User's saved/learned words with progress
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  strength TEXT DEFAULT 'new' CHECK (strength IN ('new', 'learning', 'familiar', 'mastered')),
  is_favorite BOOLEAN DEFAULT false,
  is_offline BOOLEAN DEFAULT false,
  practice_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- ============================================
-- Practice Sessions Table
-- Track user practice sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  user_sentence TEXT,
  llm_verdict TEXT CHECK (llm_verdict IN ('correct', 'acceptable', 'needs_improvement')),
  llm_comment TEXT,
  llm_suggestion TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Word Packs Table
-- Collections of words (free or paid)
-- ============================================
CREATE TABLE IF NOT EXISTS public.word_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description TEXT,
  description_ru TEXT,
  cover_image_url TEXT,
  price_tier TEXT DEFAULT 'free' CHECK (price_tier IN ('free', 'pro', 'paid')),
  price_cents INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Word Pack Items Table
-- Many-to-many for words in packs
-- ============================================
CREATE TABLE IF NOT EXISTS public.word_pack_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pack_id UUID NOT NULL REFERENCES public.word_packs(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  UNIQUE(pack_id, word_id)
);

-- ============================================
-- User Purchases Table
-- Track word pack purchases
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES public.word_packs(id) ON DELETE SET NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('subscription', 'pack')),
  store TEXT CHECK (store IN ('ios', 'android')),
  transaction_id TEXT,
  receipt_data TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_words_level ON public.words(level);
CREATE INDEX IF NOT EXISTS idx_words_category ON public.words(category);
CREATE INDEX IF NOT EXISTS idx_words_word_of_day ON public.words(is_word_of_day, word_of_day_date);
CREATE INDEX IF NOT EXISTS idx_user_words_user ON public.user_words(user_id);
CREATE INDEX IF NOT EXISTS idx_user_words_strength ON public.user_words(user_id, strength);
CREATE INDEX IF NOT EXISTS idx_examples_word ON public.examples(word_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user ON public.practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles(subscription_status);

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_words_updated_at ON public.words;
CREATE TRIGGER update_words_updated_at
  BEFORE UPDATE ON public.words
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_words_updated_at ON public.user_words;
CREATE TRIGGER update_user_words_updated_at
  BEFORE UPDATE ON public.user_words
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_pack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Words: Everyone can read words
CREATE POLICY "Anyone can view words" 
  ON public.words FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Examples: Everyone can read examples
CREATE POLICY "Anyone can view examples" 
  ON public.examples FOR SELECT 
  TO authenticated, anon
  USING (true);

-- User Words: Users can manage their own saved words
CREATE POLICY "Users can view own saved words" 
  ON public.user_words FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved words" 
  ON public.user_words FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved words" 
  ON public.user_words FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved words" 
  ON public.user_words FOR DELETE 
  USING (auth.uid() = user_id);

-- Practice Sessions: Users can manage their own sessions
CREATE POLICY "Users can view own practice sessions" 
  ON public.practice_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions" 
  ON public.practice_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Word Packs: Everyone can read packs
CREATE POLICY "Anyone can view word packs" 
  ON public.word_packs FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Word Pack Items: Everyone can read pack items
CREATE POLICY "Anyone can view word pack items" 
  ON public.word_pack_items FOR SELECT 
  TO authenticated, anon
  USING (true);

-- User Purchases: Users can view their own purchases
CREATE POLICY "Users can view own purchases" 
  ON public.user_purchases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" 
  ON public.user_purchases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
