/**
 * Icon Mapping Utility
 * 
 * Maps legacy icon names (from shadcn/ui/lucide) to Once UI System icon names
 * Based on Context7 documentation for Once UI System
 */

export type IconName = string;

// Available icons in Once UI System library
// IMPORTANT: This list MUST match what's actually available in the library
const ONCE_UI_ICONS = [
  // Icons available through our IconProvider setup
  "chevronUp", "chevronDown", "chevronRight", "chevronLeft",
  "refresh", "light", "dark", "help", "info", "warning", "danger",
  "checkbox", "check", "copy", "eyeDropper", "clipboard", "person",
  "close", "openLink", "arrowUpRight", "minus", "plus", "calendar",
  "eye", "eyeOff", "search", "security", "sparkle", "computer",
  "minimize", "maximize", "home", "document", "command",
  "rocket", "users", "user", "like", "chat", "pages", "email",
  "download", "settings", "menu", "send", "globe", "brain",
  "chartBar", "zap", "trophy", "target", "mapPin", "building2",
  "clock", "cloud", "database", "fileText", "palette", "trash",
  "magic", "shield", "activity", "bell", "share2", "tv", "plane",
  "externalLink", "heart", "messageSquare", "mail"
];

// For debugging - use this to check if icon exists
export const getAvailableIcons = () => [...ONCE_UI_ICONS];

// Map of shadcn/lucide icon names to Once UI System equivalents
const iconMap: Record<string, IconName | undefined> = {
  // Navigation icons
  "arrowRight": "chevronRight",
  "arrowLeft": "chevronLeft",
  "arrowUp": "chevronUp",
  "arrowDown": "chevronDown",
  "arrowUpRight": "chevronUp",
  "arrowUpLeft": "chevronUp",
  "arrowDownRight": "chevronDown",
  "arrowDownLeft": "chevronDown",
  "chevronRight": "chevronRight",
  "chevronLeft": "chevronLeft",
  "chevronUp": "chevronUp",
  "chevronDown": "chevronDown",
  
  // Status/UI
  "check": "check",
  "x": "close",
  "info": "info",
  "warning": "warning",
  "danger": "danger",
  "alertTriangle": "warning",
  "plus": "plus",
  "download": "download",
  "refresh": "refresh",
  "refreshCw": "refresh",
  
  // Specifically addressing console warning icons
  "magic": "magic",          // Innovation/features -> magic (now available)
  "brain": "brain",          // Intelligence/AI -> brain (now available)
  "chartBar": "chartBar",    // Analytics/reports -> chartBar (now available)
  "users": "users",          // Team/users -> users (now available)
  "shield": "shield",        // Security/protection -> shield (now available)
  "zap": "zap",              // Speed/performance -> zap (now available)
  "globe": "globe",          // Global/website -> globe (now available)
  
  // Additional common icons
  "eye": "info",             // Visibility/view -> info
  "eyeOff": "info",          // Hide/invisible -> info
  "activity": "info",        // Activity/metrics -> info
  "bell": "info",            // Notifications -> info
  "share2": "chat",          // Sharing -> chat
  "tv": "pages",             // Display/screen -> pages
  "plane": "plane",          // Travel/send -> plane (now available)
  "calendar": "calendar",     // Direct equivalent
  "trophy": "trophy",        // Achievement -> trophy (now available)
  "target": "info",          // Goals/targeting -> info
  "mapPin": "info",          // Location -> info
  "building2": "pages",      // Buildings/company -> pages
  "clock": "info",           // Time -> info
  "cloud": "info",           // Cloud services -> info
  "database": "pages",       // Data storage -> pages
  "externalLink": "chevronRight", // External links -> right nav
  "fileText": "pages",       // Documents -> pages
  "palette": "info",         // Design/colors -> info
  "trash": "close",          // Delete -> close
  "search": "info",          // Search -> info
  "settings": "info",        // Settings/gear -> info
  "mail": "email",           // Mail -> email
  "home": "info",            // Home -> info
  "user": "person",          // Direct equivalent
  "menu": "info",            // Menu/hamburger -> info
  "heart": "like",           // Heart/favorite -> like
  "messageSquare": "chat",   // Message -> chat
  "send": "send"             // Send -> send (now available)
};

/**
 * Maps an old icon name to its Once UI System equivalent
 * @param name - The original icon name from shadcn/lucide
 * @param fallback - Optional fallback icon if no mapping exists (defaults to "info")
 * @returns The mapped icon name or fallback
 */
export const mapIconName = (name: string, fallback: IconName = "info"): IconName => {
  const mapped = iconMap[name];
  return mapped !== undefined ? mapped : fallback;
};

/**
 * Determines if an icon name is available in the Once UI System
 * @param name - The icon name to check
 * @returns true if the icon is available, false otherwise
 */
export const isIconAvailable = (name: string): boolean => {
  // This is critical - the check must be case-sensitive and exact
  return ONCE_UI_ICONS.includes(name);
};

/**
 * Get a semantic replacement for missing icons based on their context
 * @param name - Original icon name
 * @param context - Optional context describing the icon's purpose
 * @returns The best semantic replacement icon name
 */
export const getSemanticReplacement = (name: string, context?: string): IconName => {
  // If the icon exists directly in Once UI, use it
  if (isIconAvailable(name)) return name;
  
  // If we have a direct mapping, use it
  const mapped = iconMap[name];
  if (mapped) return mapped;
  
  // Otherwise fall back based on context
  if (context) {
    if (context.includes('nav') || context.includes('link')) return 'chevronRight';
    if (context.includes('action') || context.includes('button')) return 'plus';
    if (context.includes('alert') || context.includes('warning')) return 'warning';
    if (context.includes('success')) return 'check';
    if (context.includes('error') || context.includes('danger')) return 'danger';
  }
  
  // Default fallback
  return 'info';
};
