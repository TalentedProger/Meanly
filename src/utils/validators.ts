/**
 * MEANLY - Validators
 * Input validation utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * - Minimum 8 characters
 * - At least one letter and one number
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Минимум 8 символов');
  }
  
  if (!/[a-zA-Zа-яА-Я]/.test(password)) {
    errors.push('Должна быть хотя бы одна буква');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Должна быть хотя бы одна цифра');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate display name
 */
export function isValidDisplayName(name: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Имя слишком короткое' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Имя слишком длинное' };
  }
  
  // Check for prohibited characters
  if (/[<>{}[\]\\]/.test(trimmed)) {
    return { valid: false, error: 'Имя содержит недопустимые символы' };
  }
  
  return { valid: true };
}

/**
 * Validate practice sentence
 */
export function isValidPracticeSentence(sentence: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = sentence.trim();
  
  if (trimmed.length < 10) {
    return { valid: false, error: 'Предложение слишком короткое' };
  }
  
  if (trimmed.length > 500) {
    return { valid: false, error: 'Предложение слишком длинное' };
  }
  
  // Check if sentence contains at least 2 words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3) {
    return { valid: false, error: 'Напиши полноценное предложение' };
  }
  
  return { valid: true };
}

/**
 * Check for profanity (basic filter)
 * NOTE: This is a basic filter. For production, use a proper moderation API.
 */
export function containsProfanity(text: string): boolean {
  // Basic list - should be expanded for production
  const profanityPatterns: RegExp[] = [
    // Add patterns here in production
  ];
  
  const lowerText = text.toLowerCase();
  return profanityPatterns.some(pattern => 
    pattern.test(lowerText)
  );
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Limit consecutive punctuation
    .replace(/([!?.,])\1{2,}/g, '$1$1');
}

/**
 * Validate phone number (Russian format)
 */
export function isValidRussianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Russian phone: 11 digits starting with 7 or 8
  return /^[78]\d{10}$/.test(cleaned);
}

/**
 * Validate email with error message (for forms)
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Введите email' };
  }
  
  if (!isValidEmail(trimmed)) {
    return { valid: false, error: 'Неверный формат email' };
  }
  
  return { valid: true };
}

/**
 * Validate password with error message (for forms)
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Введите пароль' };
  }
  
  const result = isValidPassword(password);
  
  if (!result.valid) {
    return { valid: false, error: result.errors[0] };
  }
  
  return { valid: true };
}

/**
 * Validate display name with error message (for forms)
 */
export function validateDisplayName(name: string): { valid: boolean; error?: string } {
  return isValidDisplayName(name);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 11) return phone;
  
  return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Check if string has minimum length (after trim)
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
