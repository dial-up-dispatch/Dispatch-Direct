import type { AppSettings } from '../types';

export const STORAGE_KEYS = {
  SETTINGS: 'circadian_settings',
  SESSIONS: 'circadian_sessions',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'last-call',
  timerDurationMinutes: 25,
  tags: [],
  muted: false,
  volume: 0.7,
};
