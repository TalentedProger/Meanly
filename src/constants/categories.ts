/**
 * MEANLY - Word Categories
 * Categories for organizing vocabulary words
 */

export interface Category {
  id: string;
  name: string;
  nameRu: string; // Russian name (MVP language)
  description: string;
  descriptionRu: string;
  icon: string; // Expo vector icon name
  color: string;
  isPro: boolean; // Requires PRO subscription
}

export const CATEGORIES: Category[] = [
  {
    id: 'everyday',
    name: 'Everyday',
    nameRu: 'Повседневные',
    description: 'Words for daily conversations',
    descriptionRu: 'Слова для повседневных разговоров',
    icon: 'chatbubbles-outline',
    color: '#EC5E27',
    isPro: false,
  },
  {
    id: 'business',
    name: 'Business',
    nameRu: 'Бизнес',
    description: 'Professional and workplace vocabulary',
    descriptionRu: 'Профессиональная и рабочая лексика',
    icon: 'briefcase-outline',
    color: '#26538D',
    isPro: false,
  },
  {
    id: 'academic',
    name: 'Academic',
    nameRu: 'Академические',
    description: 'Formal and scholarly expressions',
    descriptionRu: 'Формальные и научные выражения',
    icon: 'school-outline',
    color: '#6366F1',
    isPro: false,
  },
  {
    id: 'emotions',
    name: 'Emotions',
    nameRu: 'Эмоции',
    description: 'Express feelings with precision',
    descriptionRu: 'Точное выражение чувств',
    icon: 'heart-outline',
    color: '#EC4899',
    isPro: false,
  },
  {
    id: 'art',
    name: 'Art & Culture',
    nameRu: 'Искусство и культура',
    description: 'Creative and cultural vocabulary',
    descriptionRu: 'Творческая и культурная лексика',
    icon: 'color-palette-outline',
    color: '#8B5CF6',
    isPro: true,
  },
  {
    id: 'social',
    name: 'Social',
    nameRu: 'Социальные',
    description: 'Words for social interactions',
    descriptionRu: 'Слова для социальных взаимодействий',
    icon: 'people-outline',
    color: '#10B981',
    isPro: false,
  },
  {
    id: 'persuasion',
    name: 'Persuasion',
    nameRu: 'Убеждение',
    description: 'Convincing and influential language',
    descriptionRu: 'Убедительный и влиятельный язык',
    icon: 'megaphone-outline',
    color: '#F59E0B',
    isPro: true,
  },
  {
    id: 'humor',
    name: 'Humor & Wit',
    nameRu: 'Юмор и остроумие',
    description: 'Clever and funny expressions',
    descriptionRu: 'Остроумные и забавные выражения',
    icon: 'happy-outline',
    color: '#EF4444',
    isPro: true,
  },
];

// User levels (as object for lookups)
export const LEVELS_MAP = {
  beginner: {
    id: 'beginner' as const,
    name: 'Beginner',
    nameRu: 'Начинающий',
    labelRu: 'Начинающий',
    description: 'Just starting to improve speech',
    descriptionRu: 'Только начинаю улучшать речь',
    wordsPerDay: 3,
    practiceTime: 5, // minutes
    icon: '🌱',
  },
  intermediate: {
    id: 'intermediate' as const,
    name: 'Intermediate',
    nameRu: 'Средний',
    labelRu: 'Средний',
    description: 'Want to sound more confident',
    descriptionRu: 'Хочу звучать увереннее',
    wordsPerDay: 5,
    practiceTime: 10,
    icon: '🌿',
  },
  advanced: {
    id: 'advanced' as const,
    name: 'Advanced',
    nameRu: 'Продвинутый',
    labelRu: 'Продвинутый',
    description: 'Refining eloquent speech',
    descriptionRu: 'Совершенствую красноречие',
    wordsPerDay: 7,
    practiceTime: 15,
    icon: '🌳',
  },
};

// User levels as array for iteration
export const LEVELS = Object.values(LEVELS_MAP);

// User goals (as object for lookups)
export const GOALS_MAP = {
  confident: {
    id: 'confident' as const,
    name: 'Speak More Confidently',
    nameRu: 'Говорить увереннее',
    labelRu: 'Говорить увереннее',
    description: 'Express yourself with confidence',
    descriptionRu: 'Выражай себя с уверенностью',
    icon: '💪',
    color: '#EC5E27',
  },
  beautiful: {
    id: 'beautiful' as const,
    name: 'Speak More Beautifully',
    nameRu: 'Говорить красивее',
    labelRu: 'Говорить красивее',
    description: 'Make your speech elegant',
    descriptionRu: 'Сделай свою речь элегантной',
    icon: '✨',
    color: '#8B5CF6',
  },
  vocabulary: {
    id: 'vocabulary' as const,
    name: 'Expand Vocabulary',
    nameRu: 'Расширить словарный запас',
    labelRu: 'Расширить словарный запас',
    description: 'Learn new expressive words',
    descriptionRu: 'Изучи новые выразительные слова',
    icon: '📚',
    color: '#10B981',
  },
};

// User goals as array for iteration
export const GOALS = Object.values(GOALS_MAP);

// Daily time commitment options
export const TIME_COMMITMENTS = [
  { id: '2min' as const, minutes: 2, label: '2 мин', labelRu: '2 минуты', labelEn: '2 min', descriptionRu: 'Быстрый урок', icon: '⚡' },
  { id: '5min' as const, minutes: 5, label: '5 мин', labelRu: '5 минут', labelEn: '5 min', descriptionRu: 'Оптимальный баланс', icon: '🎯' },
  { id: '10min' as const, minutes: 10, label: '10 мин', labelRu: '10 минут', labelEn: '10 min', descriptionRu: 'Серьёзный подход', icon: '📖' },
  { id: '15min' as const, minutes: 15, label: '15+ мин', labelRu: '15+ минут', labelEn: '15+ min', descriptionRu: 'Максимальный прогресс', icon: '🚀' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type LevelId = keyof typeof LEVELS_MAP;
export type GoalId = keyof typeof GOALS_MAP;
export type TimeCommitmentId = (typeof TIME_COMMITMENTS)[number]['id'];
