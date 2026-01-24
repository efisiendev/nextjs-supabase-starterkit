/**
 * Event-related constants
 * Centralized configuration for event status labels and colors
 */

import { EventStatus } from '@/lib/api/events';

/**
 * Event status color mappings (Tailwind CSS classes)
 */
export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
} as const;

/**
 * Event status label translations (Indonesian)
 */
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: 'Akan Datang',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
} as const;
