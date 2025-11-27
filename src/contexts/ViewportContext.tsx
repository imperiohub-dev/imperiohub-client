/**
 * ViewportContext
 *
 * React Context for sharing viewport state and drawer controls across the application.
 * Wraps the useViewport hook to provide centralized viewport management.
 */

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useViewport } from '../hooks/useViewport';
import type { UseViewportReturn } from '../hooks/useViewport';

// Create context with undefined as initial value
const ViewportContext = createContext<UseViewportReturn | undefined>(undefined);

/**
 * ViewportProvider Props
 */
interface ViewportProviderProps {
  children: ReactNode;
}

/**
 * ViewportProvider Component
 *
 * Provides viewport state and actions to all child components.
 * Should be placed high in the component tree (e.g., in AppLayout).
 */
export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const viewport = useViewport();

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
};

/**
 * useViewportContext Hook
 *
 * Custom hook to consume ViewportContext.
 * Throws an error if used outside of ViewportProvider.
 *
 * @returns ViewportState and control actions
 *
 * @example
 * const { isMobile, toggleSidebar } = useViewportContext();
 */
export const useViewportContext = (): UseViewportReturn => {
  const context = useContext(ViewportContext);

  if (!context) {
    throw new Error(
      'useViewportContext must be used within a ViewportProvider. ' +
      'Make sure to wrap your component tree with <ViewportProvider>.'
    );
  }

  return context;
};
