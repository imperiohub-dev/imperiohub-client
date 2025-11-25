/**
 * AppLayout - Main layout component for the application
 * Structure: TopMenuBar + (LeftSidebar + MainContent)
 */

import type { ReactNode } from 'react';
import './AppLayout.scss';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="app-layout">
      {children}
    </div>
  );
};

interface AppLayoutBodyProps {
  children: ReactNode;
}

export const AppLayoutBody = ({ children }: AppLayoutBodyProps) => {
  return (
    <div className="app-layout__body">
      {children}
    </div>
  );
};
