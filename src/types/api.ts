/**
 * MEANLY - API Types
 * Types for API requests and responses
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

// API Error
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

// API metadata (pagination, etc.)
export interface ApiMeta {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  hasMore?: boolean;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

// Common API error codes
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  OFFLINE: 'OFFLINE',
} as const;

// Word of the Day response
export interface WordOfDayResponse {
  word: import('./word').Word;
  date: string;
  previousWordId?: string;
}

// Words list response
export interface WordsListResponse {
  words: import('./word').Word[];
  totalCount: number;
  hasMore: boolean;
}

// User words response
export interface UserWordsResponse {
  words: import('./word').UserWord[];
  totalCount: number;
  hasMore: boolean;
}

// Categories response
export interface CategoriesResponse {
  categories: import('../constants/categories').Category[];
}

// Word packs response
export interface WordPacksResponse {
  packs: import('./word').WordPack[];
}

// Sync request (offline changes)
export interface SyncRequest {
  savedWords: SyncWordItem[];
  practiceResults: SyncPracticeItem[];
  lastSyncedAt: string;
}

export interface SyncWordItem {
  wordId: string;
  action: 'save' | 'unsave' | 'update_notes';
  data?: {
    notes?: string;
    isFavorite?: boolean;
  };
  timestamp: string;
}

export interface SyncPracticeItem {
  wordId: string;
  sentence: string;
  result: 'correct' | 'partial' | 'incorrect';
  timestamp: string;
}

// Sync response
export interface SyncResponse {
  synced: boolean;
  conflicts?: SyncConflict[];
  serverTime: string;
}

export interface SyncConflict {
  wordId: string;
  serverVersion: unknown;
  clientVersion: unknown;
  resolution: 'server_wins' | 'client_wins' | 'merged';
}

// Subscription verification request
export interface SubscriptionVerifyRequest {
  platform: 'ios' | 'android';
  receipt: string;
  productId: string;
}

// Subscription verification response
export interface SubscriptionVerifyResponse {
  valid: boolean;
  expiresAt?: string;
  productId?: string;
  status: import('./user').SubscriptionStatus;
}

// Push notification registration
export interface PushTokenRequest {
  token: string;
  platform: 'ios' | 'android';
  deviceId?: string;
}

// Analytics event
export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

// Health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  services: {
    database: boolean;
    llm: boolean;
    storage: boolean;
  };
}
