/**
 * useViewport Hook
 *
 * Custom hook for viewport detection and responsive behavior management.
 * Handles:
 * - Viewport width detection with debounce
 * - Breakpoint categorization (mobile/tablet/desktop)
 * - Drawer state management for mobile navigation
 * - Auto-close drawer on desktop resize
 */

import { useState, useEffect, useCallback } from 'react';

// Breakpoints matching _variables.scss
const BREAKPOINTS = {
  mobile: 768,   // < 768px = mobile
  tablet: 1024,  // >= 768px && < 1024px = tablet
} as const;

export interface ViewportState {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSidebarOpen: boolean;
}

export interface ViewportActions {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export type UseViewportReturn = ViewportState & ViewportActions;

/**
 * Debounce utility for resize events
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export const useViewport = (): UseViewportReturn => {
  // Initialize state with current window dimensions
  const [state, setState] = useState<ViewportState>(() => {
    const width = window.innerWidth;
    const isMobile = width < BREAKPOINTS.mobile;
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
    const isDesktop = width >= BREAKPOINTS.tablet;

    return {
      width,
      isMobile,
      isTablet,
      isDesktop,
      isSidebarOpen: false, // Drawer closed by default
    };
  });

  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
      const isDesktop = width >= BREAKPOINTS.tablet;

      setState((prevState) => ({
        width,
        isMobile,
        isTablet,
        isDesktop,
        // Auto-close drawer when resizing to desktop
        isSidebarOpen: isDesktop ? false : prevState.isSidebarOpen,
      }));
    }, 150); // 150ms debounce delay

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sidebar control actions
  const toggleSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSidebarOpen: !prev.isSidebarOpen,
    }));
  }, []);

  const openSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSidebarOpen: true,
    }));
  }, []);

  const closeSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSidebarOpen: false,
    }));
  }, []);

  return {
    ...state,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  };
};
