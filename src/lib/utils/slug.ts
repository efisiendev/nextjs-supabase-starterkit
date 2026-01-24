/**
 * Slug Generation Utilities
 *
 * Generate URL-friendly slugs from titles.
 * Used in articles, events, and other content with URLs.
 */

/**
 * Generate a URL-friendly slug from a title
 *
 * @param title - The title to convert to a slug
 * @returns URL-friendly slug (lowercase, hyphenated, no special chars)
 *
 * @example
 * generateSlug('Hello World!') // 'hello-world'
 * generateSlug('Café & Restaurant') // 'cafe-restaurant'
 * generateSlug('   Multiple   Spaces   ') // 'multiple-spaces'
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace accented characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special characters with spaces
    .replace(/[^a-z0-9\s-]/g, ' ')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate if a string is a valid slug
 *
 * @param slug - The slug to validate
 * @returns True if valid slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Generate unique slug by appending number if needed
 *
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug (may have -2, -3, etc. appended)
 *
 * @example
 * makeUniqueSlug('my-post', ['my-post']) // 'my-post-2'
 * makeUniqueSlug('my-post', ['my-post', 'my-post-2']) // 'my-post-3'
 */
export function makeUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}
