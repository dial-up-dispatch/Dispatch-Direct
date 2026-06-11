/**
 * Dispatch Direct — dispatch-utils.ts
 * Small, high-performance, stateless atmospheric utility helpers.
 * 
 * Excludes any app-specific schema structures or side-effects.
 */

/**
 * Clamps a numerical value within bounds.
 * 
 * @param value Target value.
 * @param min Floor limit.
 * @param max Ceiling limit.
 * @returns Bound value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Check if the host operating system has activated reduced motion parameters.
 * Safe to run in environments lacking a global window context.
 * 
 * @returns True if reduced motion is requested.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Formats an ISO Date, Timestamp, or Date object into a localized long date representation.
 * Output is fully lowercased to match the Dispatch typography guidelines.
 * 
 * @param dateVal Date input.
 * @returns Lowercased formatted date string (e.g., "may 25, 2026").
 */
export function formatFullDate(dateVal: string | Date | number): string {
  if (!dateVal) return '—';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toLowerCase();
}

/**
 * Formats a date relatively if it belongs to today or yesterday,
 * otherwise falls back to a long-formatted date.
 * 
 * @param dateVal Date input.
 * @returns Relative string description ("today", "yesterday", or date).
 */
export function formatRelativeDate(dateVal: string | Date | number): string {
  if (!dateVal) return '—';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '—';

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return 'today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'yesterday';
  }

  return formatFullDate(date);
}

/**
 * Converts a text label into a URL-friendly, lowercase slug.
 * 
 * @param text Text to convert.
 * @returns URL-safe slug.
 */
export function generateSlug(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_]+/g, '-')   // convert spaces/underscores to hyphens
    .replace(/-+/g, '-');      // remove duplicate hyphens
}

/**
 * Evaluates whether a keyboard event key represents a system key
 * (like controls, arrows, shifts, etc.) rather than a literal typing character.
 * Helpful for typewriter clicking synthesizer filters.
 * 
 * @param key KeyboardEvent key string.
 * @returns True if the key represents a system control structure.
 */
export function isSystemKey(key: string): boolean {
  return [
    'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Tab', 'Home', 'End', 'PageUp', 'PageDown',
    'Insert', 'Delete', 'Pause', 'ScrollLock', 'PrintScreen',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ].includes(key);
}
