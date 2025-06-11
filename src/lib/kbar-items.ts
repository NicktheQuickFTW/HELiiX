import { ReactNode } from 'react';

interface KbarItem {
  id: string;          // Unique identifier for the item
  name: string;        // Display name in the command palette
  section: string;     // Group name for organizing items
  shortcut: string[];  // Keyboard shortcut keys
  keywords: string;    // Search keywords
  href?: string;       // Navigation URL (optional)
  perform?: () => void; // Action to perform when selected (optional)
  icon?: string;       // Icon name from Once UI icon set (optional)
  description?: ReactNode; // Additional description (optional)
}

export const kbarItems: KbarItem[] = [
  // Navigation
  {
    id: 'home',
    name: 'Home',
    section: 'Navigation',
    shortcut: ['H'],
    keywords: 'home main start dashboard',
    href: '/',
    icon: 'home'
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    section: 'Navigation',
    shortcut: ['D'],
    keywords: 'dashboard analytics overview',
    href: '/dashboard',
    icon: 'computer'
  },
  {
    id: 'awards',
    name: 'Awards',
    section: 'Navigation',
    shortcut: ['A'],
    keywords: 'awards recognition ceremony',
    href: '/awards',
    icon: 'sparkle'
  },
  {
    id: 'championships',
    name: 'Championships',
    section: 'Navigation',
    shortcut: ['C'],
    keywords: 'championships tournaments credentials',
    href: '/championships',
    icon: 'check'
  },
  {
    id: 'teams',
    name: 'Teams',
    section: 'Navigation',
    shortcut: ['T'],
    keywords: 'teams schools big12 conference',
    href: '/teams/schools',
    icon: 'person'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    section: 'Navigation',
    shortcut: ['Ctrl', 'K'],
    keywords: 'contacts directory people',
    href: '/contacts',
    icon: 'person'
  },
  
  // Sports
  {
    id: 'football',
    name: 'Football',
    section: 'Sports',
    shortcut: ['F'],
    keywords: 'football sports schedule',
    href: '/sports/football',
    icon: 'sparkle'
  },
  {
    id: 'basketball-men',
    name: 'Men\'s Basketball',
    section: 'Sports',
    shortcut: ['B', 'M'],
    keywords: 'basketball men sports schedule',
    href: '/sports/mens-basketball',
    icon: 'sparkle'
  },
  {
    id: 'basketball-women',
    name: 'Women\'s Basketball',
    section: 'Sports',
    shortcut: ['B', 'W'],
    keywords: 'basketball women sports schedule',
    href: '/sports/womens-basketball',
    icon: 'sparkle'
  },
  {
    id: 'baseball',
    name: 'Baseball',
    section: 'Sports',
    shortcut: ['Shift', 'B'],
    keywords: 'baseball sports schedule',
    href: '/sports/baseball',
    icon: 'sparkle'
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    section: 'Sports',
    shortcut: ['V'],
    keywords: 'volleyball sports schedule',
    href: '/sports/volleyball',
    icon: 'sparkle'
  },
  
  // Administrative
  {
    id: 'finance',
    name: 'Finance',
    section: 'Administrative',
    shortcut: ['$'],
    keywords: 'finance budget distributions',
    href: '/finance/distributions',
    icon: 'document'
  },
  {
    id: 'operations',
    name: 'Operations',
    section: 'Administrative',
    shortcut: ['O'],
    keywords: 'operations management',
    href: '/operations',
    icon: 'computer'
  },
  {
    id: 'scheduling',
    name: 'Scheduling',
    section: 'Administrative',
    shortcut: ['S'],
    keywords: 'scheduling calendar events',
    href: '/scheduling',
    icon: 'calendar'
  },
  {
    id: 'travel',
    name: 'Travel',
    section: 'Administrative',
    shortcut: ['Ctrl', 'T'],
    keywords: 'travel arrangements flights',
    href: '/travel',
    icon: 'arrowUpRight'
  },
  
  // Settings & Tools
  {
    id: 'settings',
    name: 'Settings',
    section: 'Settings',
    shortcut: ['Ctrl', ','],
    keywords: 'settings preferences config',
    href: '/settings',
    icon: 'security'
  },
  {
    id: 'help',
    name: 'Help',
    section: 'Settings',
    shortcut: ['?'],
    keywords: 'help support documentation',
    href: '/help',
    icon: 'help'
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    section: 'Tools',
    shortcut: ['Ctrl', 'I'],
    keywords: 'ai assistant chatbot help',
    href: '/ai-assistant',
    icon: 'sparkle'
  },
  {
    id: 'search',
    name: 'Search',
    section: 'Tools',
    shortcut: ['Ctrl', 'F'],
    keywords: 'search find lookup',
    href: '/search',
    icon: 'search'
  }
];

export type { KbarItem };