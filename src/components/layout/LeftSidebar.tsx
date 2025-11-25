/**
 * LeftSidebar - Left navigation panel showing subthemes
 */

import { useNavigation } from '../../contexts/NavigationContext';
import './LeftSidebar.scss';

export const LeftSidebar = () => {
  const { state, setSubTheme } = useNavigation();

  if (!state.currentTheme) {
    return null;
  }

  const handleSubThemeClick = (subThemeId: string) => {
    setSubTheme(subThemeId);
  };

  return (
    <aside className="left-sidebar">
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
  );
};
