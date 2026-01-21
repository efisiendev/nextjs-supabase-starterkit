/**
 * SegmentedControl Component
 * Reusable pill-style filter/tab navigation component
 *
 * Usage:
 * <SegmentedControl
 *   basePath="/events"
 *   paramName="status"
 *   currentValue={status}
 *   allLabel="Semua Event"
 *   options={[
 *     { value: 'upcoming', label: 'Akan Datang' },
 *     { value: 'ongoing', label: 'Berlangsung' }
 *   ]}
 * />
 */

'use client';

import Link from 'next/link';
import { cn } from '@/shared/utils/cn';

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  /**
   * Base path for the links (e.g., '/events', '/articles')
   */
  basePath: string;

  /**
   * Query parameter name (e.g., 'status', 'category', 'batch')
   */
  paramName: string;

  /**
   * Current active value
   */
  currentValue?: string;

  /**
   * Label for "all items" option
   */
  allLabel: string;

  /**
   * Array of filter options
   */
  options: SegmentedControlOption[];

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Whether to use sticky positioning
   * @default true
   */
  sticky?: boolean;
}

export function SegmentedControl({
  basePath,
  paramName,
  currentValue,
  allLabel,
  options,
  className,
  sticky = true,
}: SegmentedControlProps) {
  const isActive = (value?: string) => {
    if (!value) return !currentValue;
    return currentValue === value;
  };

  const getHref = (value?: string) => {
    if (!value) return basePath;
    return `${basePath}?${paramName}=${value}`;
  };

  const pillClasses = (active: boolean) =>
    cn(
      'px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300',
      active
        ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
        : 'text-gray-500 hover:text-gray-900'
    );

  return (
    <section
      className={cn(
        'py-4 transition-all duration-300 pointer-events-none',
        sticky && 'sticky top-0 md:top-32 z-40',
        className
      )}
    >
      <div className="container-custom flex justify-center pointer-events-auto">
        <div className="inline-flex items-center p-1.5 bg-gray-100/80 rounded-full border border-gray-200 shadow-inner overflow-x-auto max-w-full scrollbar-hide">
          {/* "All" option */}
          <Link href={getHref()} className={pillClasses(isActive())}>
            {allLabel}
          </Link>

          {/* Dynamic options */}
          {options.map((option) => (
            <Link
              key={option.value}
              href={getHref(option.value)}
              className={pillClasses(isActive(option.value))}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
