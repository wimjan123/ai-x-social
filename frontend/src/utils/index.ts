import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display in posts and UI
 */
export function formatPostDate(date: Date | string): string {
  const postDate = new Date(date);
  const now = new Date();

  if (isToday(postDate)) {
    return formatDistanceToNow(postDate, { addSuffix: true });
  }

  if (isYesterday(postDate)) {
    return 'Yesterday';
  }

  // If within this year, show month and day
  if (postDate.getFullYear() === now.getFullYear()) {
    return format(postDate, 'MMM d');
  }

  // Otherwise show full date
  return format(postDate, 'MMM d, yyyy');
}

/**
 * Format large numbers for display (e.g., 1.2K, 1.5M)
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
  return `${(num / 1000000000).toFixed(1)}B`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Extract hashtags from text
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  return text.match(hashtagRegex) || [];
}

/**
 * Extract mentions from text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@[a-zA-Z0-9_]+/g;
  return text.match(mentionRegex) || [];
}

/**
 * Generate avatar URL with fallback
 */
export function getAvatarUrl(url?: string, username?: string): string {
  if (url) return url;
  if (username) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`;
  }
  return 'https://api.dicebear.com/7.x/initials/svg?seed=Anonymous';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Calculate influence tier based on score
 */
export function getInfluenceTier(
  score: number
): 'micro' | 'macro' | 'mega' | 'celebrity' {
  if (score >= 90) return 'celebrity';
  if (score >= 70) return 'mega';
  if (score >= 50) return 'macro';
  return 'micro';
}

/**
 * Get political alignment color class
 */
export function getPoliticalColor(alignment: string): string {
  switch (alignment.toLowerCase()) {
    case 'conservative':
      return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/20';
    case 'liberal':
      return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/20';
    case 'progressive':
      return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/20';
    case 'libertarian':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20';
    case 'independent':
      return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900/20';
  }
}

/**
 * Generate a random delay for AI response simulation
 */
export function getAIResponseDelay(): number {
  // Random delay between 30 seconds and 2 minutes
  return Math.floor(Math.random() * 90000) + 30000;
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll and resize events
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate a random ID for client-side use
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth < 768;
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};
