/**
 * LeftSidebar - Left navigation panel showing subthemes
 * On mobile: Becomes an off-canvas drawer
 * On desktop: Fixed sidebar
 */

import { useNavigation } from '../../contexts/NavigationContext';
import { useViewportContext } from '../../contexts/ViewportContext';
import './LeftSidebar.scss';

export const LeftSidebar = () => {
  const { state, setSubTheme } = useNavigation();
  const { isMobile, isSidebarOpen, closeSidebar } = useViewportContext();

  if (!state.currentTheme) {
    return null;
  }

  const handleSubThemeClick = (subThemeId: string) => {
    setSubTheme(subThemeId);

    // Close drawer on mobile after selecting a subtheme
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Overlay backdrop - Mobile only */}
      {isMobile && isSidebarOpen && (
        <div
          className="left-sidebar__overlay visible"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside className={`left-sidebar ${isMobile && isSidebarOpen ? 'open' : ''}`}>
        {/* Close button - Mobile only */}
        {isMobile && (
          <button
            className="left-sidebar__close"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        )}

        <div className="left-sidebar__header">
          <h3>{state.currentTheme.label}</h3>
        </div>

        <nav className="left-sidebar__nav">
        {state.currentTheme.subThemes.map((subTheme) => {
          const isActive = state.currentSubTheme?.id === subTheme.id;

          return (
            <button
              key={subTheme.id}
              className={`left-sidebar__item ${isActive ? 'active' : ''}`}
              onClick={() => handleSubThemeClick(subTheme.id)}
            >
              {subTheme.icon && (
                <span className="left-sidebar__icon">{subTheme.icon}</span>
              )}
              <span className="left-sidebar__label">{subTheme.label}</span>
              {subTheme.badge && (
                <span className="left-sidebar__badge">{subTheme.badge}</span>
              )}
            </button>
          );
        })}
        </nav>
      </aside>
    </>
  );
};
