import React from 'react';
import { Icon as OnceIcon } from '@once-ui-system/core';
import {
  mapIconName,
  isIconAvailable,
  getSemanticReplacement,
} from '@/utils/icon-mapping';

// Valid background types from Once UI System
type OnceUIBackground =
  | 'info-medium'
  | 'info-weak'
  | 'info-strong'
  | 'neutral-medium'
  | 'neutral-weak'
  | 'neutral-strong'
  | 'brand-medium'
  | 'brand-weak'
  | 'brand-strong'
  | 'accent-medium'
  | 'accent-weak'
  | 'accent-strong'
  | 'success-medium'
  | 'success-weak'
  | 'success-strong'
  | 'warning-medium'
  | 'warning-weak'
  | 'warning-strong'
  | 'danger-medium'
  | 'danger-weak'
  | 'danger-strong';

interface EnhancedIconProps {
  name: string;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  onBackground?: OnceUIBackground;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  context?: string; // Optional context hint for better semantic replacement
  fallback?: string; // Optional custom fallback icon
  // Allow additional props without using 'any' type
  [key: string]: unknown;
}

/**
 * Enhanced Icon Component
 *
 * Wraps the Once UI System Icon component with automatic mapping for
 * icon names from shadcn/lucide to Once UI System equivalents.
 *
 * Features:
 * - Automatically maps icon names based on Context7 documentation
 * - Provides semantic fallbacks for missing icons
 * - Supports context hints for better icon selection
 * - Preserves all other props like size, color, etc.
 *
 * Use this component during the migration to prevent console warnings.
 */
export const EnhancedIcon = ({
  name,
  size = 'm',
  onBackground,
  color,
  style,
  className,
  context,
  fallback,
  ...props
}: EnhancedIconProps) => {
  // Always map the icon name regardless of whether it exists in Once UI
  // This ensures we're always using the mapped version
  const iconName = fallback
    ? mapIconName(name, fallback)
    : getSemanticReplacement(name, context);

  // Log any remaining icon issues during development
  if (process.env.NODE_ENV !== 'production' && !isIconAvailable(iconName)) {
    console.warn(
      `[EnhancedIcon] Mapped icon "${iconName}" (from "${name}") still not found in Once UI System.`
    );
  }

  // Create a combined style object
  const combinedStyle = {
    ...(color ? { color } : {}),
    ...(style || {}),
  };

  return (
    <OnceIcon
      name={iconName}
      size={size}
      onBackground={onBackground}
      style={combinedStyle}
      className={className}
      {...props}
    />
  );
};

/**
 * Helper component to debug icon mappings during development
 */
export const IconDebug = ({ name }: { name: string }) => {
  if (process.env.NODE_ENV === 'production') return null;

  const mappedName = mapIconName(name);
  const exists = isIconAvailable(name);

  return (
    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
      Icon: {name} → {mappedName} {!exists && '(mapped)'}
    </div>
  );
};

// Export both named and default export for flexibility
export default EnhancedIcon;
