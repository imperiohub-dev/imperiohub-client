/**
 * NavigationContext - Manages navigation state for multi-level menu system
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type {
  NavigationContextValue,
  NavigationProviderProps,
  NavigationState,
  Theme,
  SubTheme,
} from '../types/navigation';

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider = ({ children, config }: NavigationProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<NavigationState>({
    currentTheme: null,
    currentSubTheme: null,
    isLoading: true,
  });

  // Helper: Get theme by ID
  const getThemeById = useCallback(
    (themeId: string): Theme | undefined => {
      return config.themes.find((theme) => theme.id === themeId);
    },
    [config.themes]
  );

  // Helper: Get subtheme by IDs
  const getSubThemeById = useCallback(
    (themeId: string, subThemeId: string): SubTheme | undefined => {
      const theme = getThemeById(themeId);
      return theme?.subThemes.find((sub) => sub.id === subThemeId);
    },
    [getThemeById]
  );

  // Helper: Get current path
  const getCurrentPath = useCallback((): string => {
    if (!state.currentTheme || !state.currentSubTheme) return '/';
    return state.currentSubTheme.path;
  }, [state.currentTheme, state.currentSubTheme]);

  // Action: Set theme
  const setTheme = useCallback(
    (themeId: string) => {
      const theme = getThemeById(themeId);
      if (!theme) {
        console.warn(`Theme with id "${themeId}" not found`);
        return;
      }

      // Get default subtheme or first subtheme
      const defaultSubThemeId = theme.defaultSubTheme || theme.subThemes[0]?.id;
      const subTheme = theme.subThemes.find((sub) => sub.id === defaultSubThemeId);

      if (!subTheme) {
        console.warn(`No subthemes found for theme "${themeId}"`);
        return;
      }

      setState({
        currentTheme: theme,
        currentSubTheme: subTheme,
        isLoading: false,
      });

      navigate(subTheme.path);
    },
    [getThemeById, navigate]
  );

  // Action: Set subtheme
  const setSubTheme = useCallback(
    (subThemeId: string) => {
      if (!state.currentTheme) {
        console.warn('Cannot set subtheme: no theme is currently selected');
        return;
      }

      const subTheme = getSubThemeById(state.currentTheme.id, subThemeId);
      if (!subTheme) {
        console.warn(`SubTheme with id "${subThemeId}" not found in theme "${state.currentTheme.id}"`);
        return;
      }

      setState((prev) => ({
        ...prev,
        currentSubTheme: subTheme,
        isLoading: false,
      }));

      navigate(subTheme.path);
    },
    [state.currentTheme, getSubThemeById, navigate]
  );

  // Action: Navigate to specific theme + subtheme
  const navigateTo = useCallback(
    (themeId: string, subThemeId: string) => {
      const theme = getThemeById(themeId);
      const subTheme = getSubThemeById(themeId, subThemeId);

      if (!theme || !subTheme) {
        console.warn(`Invalid navigation: theme="${themeId}", subTheme="${subThemeId}"`);
        return;
      }

      setState({
        currentTheme: theme,
        currentSubTheme: subTheme,
        isLoading: false,
      });

      navigate(subTheme.path);
    },
    [getThemeById, getSubThemeById, navigate]
  );

  // Effect: Initialize from URL or defaults
  useEffect(() => {
    // Try to match current URL to a subtheme
    const currentPath = location.pathname;

    let foundTheme: Theme | null = null;
    let foundSubTheme: SubTheme | null = null;

    // Search through all themes and subthemes to find matching path
    for (const theme of config.themes) {
      for (const subTheme of theme.subThemes) {
        if (subTheme.path === currentPath) {
          foundTheme = theme;
          foundSubTheme = subTheme;
          break;
        }
      }
      if (foundTheme) break;
    }

    // If match found, set state
    if (foundTheme && foundSubTheme) {
      setState({
        currentTheme: foundTheme,
        currentSubTheme: foundSubTheme,
        isLoading: false,
      });
    } else {
      // No match: use defaults
      const defaultThemeId = config.defaultTheme || config.themes[0]?.id;
      if (defaultThemeId) {
        const defaultTheme = getThemeById(defaultThemeId);
        if (defaultTheme) {
          const defaultSubThemeId = defaultTheme.defaultSubTheme || defaultTheme.subThemes[0]?.id;
          const defaultSubTheme = defaultTheme.subThemes.find((sub) => sub.id === defaultSubThemeId);

          if (defaultSubTheme) {
            setState({
              currentTheme: defaultTheme,
              currentSubTheme: defaultSubTheme,
              isLoading: false,
            });
            navigate(defaultSubTheme.path, { replace: true });
          }
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  }, [config, location.pathname, getThemeById, navigate]);

  const value: NavigationContextValue = {
    state,
    config,
    setTheme,
    setSubTheme,
    navigateTo,
    getCurrentPath,
    getThemeById,
    getSubThemeById,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook to access navigation context
 */
export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
