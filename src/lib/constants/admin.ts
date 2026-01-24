/**
 * Admin Panel Constants
 *
 * Centralized constants for admin panel configuration.
 * Used across all admin CRUD pages for consistency.
 */

/**
 * Pagination
 */
export const ITEMS_PER_PAGE = 20;

/**
 * Leadership Positions
 * Used in leadership form and display
 */
export const LEADERSHIP_POSITIONS = [
  'Ketua Umum',
  'Wakil Ketua Umum',
  'Sekretaris Umum',
  'Wakil Sekretaris Umum',
  'Bendahara Umum',
  'Wakil Bendahara Umum',
  'Ketua Departemen',
  'Wakil Ketua Departemen',
  'Koordinator Divisi',
  'Staff Divisi',
] as const;

/**
 * User Roles
 * Matches app_role enum in database
 */
export const USER_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'kontributor', label: 'Kontributor' },
] as const;

/**
 * Member Statuses
 */
export const MEMBER_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'alumni', label: 'Alumni' },
] as const;

/**
 * Article Statuses
 */
export const ARTICLE_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
] as const;

/**
 * Event Statuses
 */
export const EVENT_STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

/**
 * Gallery Statuses
 */
export const GALLERY_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
] as const;

/**
 * Status Colors for Badges
 * Tailwind CSS classes for status indicators
 */
export const STATUS_COLORS = {
  // Article statuses
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',

  // Event statuses
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',

  // Member/Gallery statuses
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  alumni: 'bg-blue-100 text-blue-700',
} as const;

/**
 * Type helpers
 */
export type LeadershipPosition = (typeof LEADERSHIP_POSITIONS)[number];
export type UserRole = (typeof USER_ROLES)[number]['value'];
export type MemberStatus = (typeof MEMBER_STATUSES)[number]['value'];
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number]['value'];
export type EventStatus = (typeof EVENT_STATUSES)[number]['value'];
export type GalleryStatus = (typeof GALLERY_STATUSES)[number]['value'];
