/**
 * Safe UI Components
 * 
 * This module exports UI components that are designed to work safely during
 * the transition from shadcn/ui to Once UI System.
 * 
 * These components handle React DOM property warnings by properly managing props
 * that would otherwise be incorrectly passed to DOM elements.
 */

export { SafeFade } from './SafeFade';
export { SafeCard } from './SafeCard';
export { SafeRow } from './SafeRow';

// Add CSS import instruction to be used in layout or global CSS
export const SAFE_UI_CSS_IMPORT = `@import url('./components/ui/safe-components.css');`;
