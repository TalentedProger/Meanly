/**
 * MEANLY - Formatters
 * Text, date, and number formatting utilities
 */

/**
 * Format date to Russian locale string
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    ...options,
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 часа назад")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'только что';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${pluralize(diffMinutes, 'минуту', 'минуты', 'минут')} назад`;
  } else if (diffHours < 24) {
    return `${diffHours} ${pluralize(diffHours, 'час', 'часа', 'часов')} назад`;
  } else if (diffDays < 7) {
    return `${diffDays} ${pluralize(diffDays, 'день', 'дня', 'дней')} назад`;
  } else {
    return formatDate(d);
  }
}

/**
 * Russian pluralization helper
 */
export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 19) {
    return many;
  } else if (mod10 === 1) {
    return one;
  } else if (mod10 >= 2 && mod10 <= 4) {
    return few;
  } else {
    return many;
  }
}

/**
 * Format number with Russian locale
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU');
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format practice time (seconds to "X мин Y сек")
 */
export function formatPracticeTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} сек`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} мин`;
  }
  return `${minutes} мин ${remainingSeconds} сек`;
}

/**
 * Format streak count with proper wording
 */
export function formatStreak(days: number): string {
  return `${days} ${pluralize(days, 'день', 'дня', 'дней')} подряд`;
}

/**
 * Format word count
 */
export function formatWordCount(count: number): string {
  return `${count} ${pluralize(count, 'слово', 'слова', 'слов')}`;
}

/**
 * Format practice verdict to Russian
 */
export function formatVerdict(
  verdict: 'excellent' | 'good' | 'partial' | 'needs_work'
): string {
  const verdicts = {
    excellent: 'Отлично!',
    good: 'Хорошо!',
    partial: 'Почти!',
    needs_work: 'Попробуй ещё',
  };
  return verdicts[verdict];
}

/**
 * Format level name to Russian
 */
export function formatLevel(level: 'beginner' | 'intermediate' | 'advanced'): string {
  const levels = {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  };
  return levels[level];
}

/**
 * Format word strength to Russian
 */
export function formatStrength(
  strength: 'new' | 'learning' | 'familiar' | 'mastered'
): string {
  const strengths = {
    new: 'Новое',
    learning: 'Изучаю',
    familiar: 'Знакомо',
    mastered: 'Освоено',
  };
  return strengths[strength];
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
