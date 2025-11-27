/**
 * BottomNavBar - Mobile bottom navigation bar
 *
 * Displays the 6 main themes in a fixed bottom navigation bar.
 * Only visible on mobile devices (<768px).
 * Touch-optimized with proper target sizes.
 */

import { useNavigation } from '../../contexts/NavigationContext';
import { useViewportContext } from '../../contexts/ViewportContext';
import './BottomNavBar.scss';

export const BottomNavBar = () => {
  const { config, state, setTheme } = useNavigation();
  const { isMobile } = useViewportContext();

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <nav className="bottom-nav-bar" role="navigation" aria-label="Main navigation">
      {config.themes.map((theme) => {
        const isActive = state.currentTheme?.id === theme.id;

        return (
          <button
            key={theme.id}
            className={`bottom-nav-bar__item ${isActive ? 'active' : ''}`}
            onClick={() => setTheme(theme.id)}
            aria-label={theme.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bottom-nav-bar__icon" aria-hidden="true">
              {theme.icon}
            </span>
            <span className="bottom-nav-bar__label">{theme.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
