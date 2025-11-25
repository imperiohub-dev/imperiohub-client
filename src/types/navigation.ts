/**
 * Navigation System Types
 * Defines the structure for multi-level navigation system
 */

import type { ReactNode, ComponentType } from 'react';

/**
 * SubTheme - Represents a sub-menu item within a theme
 */
export interface SubTheme {
  id: string;
  label: string;
  path: string;
  icon?: string;
  component: ComponentType;
  badge?: string | number;
  description?: string;
}

/**
 * Theme - Represents a top-level menu item
 */
export interface Theme {
  id: string;
  label: string;
  icon?: string;
  subThemes: SubTheme[];
  defaultSubTheme?: string; // ID of default subtheme to show
}

/**
 * NavigationConfig - Complete navigation configuration
 */
export interface NavigationConfig {
  themes: Theme[];
  defaultTheme?: string; // ID of default theme to show
}

/**
 * NavigationState - Current navigation state
 */
export interface NavigationState {
  currentTheme: Theme | null;
  currentSubTheme: SubTheme | null;
  isLoading: boolean;
}

/**
 * NavigationContextValue - Context value shape
 */
export interface NavigationContextValue {
  // State
  state: NavigationState;
  config: NavigationConfig;

  // Actions
  setTheme: (themeId: string) => void;
  setSubTheme: (subThemeId: string) => void;
  navigateTo: (themeId: string, subThemeId: string) => void;

  // Helpers
  getCurrentPath: () => string;
  getThemeById: (themeId: string) => Theme | undefined;
  getSubThemeById: (themeId: string, subThemeId: string) => SubTheme | undefined;
}

/**
 * NavigationProviderProps - Provider component props
 */
export interface NavigationProviderProps {
  children: ReactNode;
  config: NavigationConfig;
}
