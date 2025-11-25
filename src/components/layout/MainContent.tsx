/**
 * MainContent - Main content area with breadcrumbs and outlet
 */

import { Outlet } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import './MainContent.scss';

export const MainContent = () => {
  const { state } = useNavigation();

  if (state.isLoading) {
    return (
      <main className="main-content">
        <div className="main-content__loading">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      {state.currentTheme && state.currentSubTheme && (
        <div className="main-content__breadcrumbs">
          <span className="breadcrumb">{state.currentTheme.label}</span>
          <span className="separator">/</span>
          <span className="breadcrumb active">{state.currentSubTheme.label}</span>
        </div>
      )}

      <div className="main-content__body">
        <Outlet />
      </div>
    </main>
  );
};
