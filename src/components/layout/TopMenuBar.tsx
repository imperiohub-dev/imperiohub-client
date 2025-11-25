/**
 * TopMenuBar - Top navigation menu with dropdown submenus
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import './TopMenuBar.scss';

export const TopMenuBar = () => {
  const { config, state, setTheme } = useNavigation();
  const [openThemeId, setOpenThemeId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenThemeId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeClick = (themeId: string) => {
    if (openThemeId === themeId) {
      setOpenThemeId(null);
    } else {
      setOpenThemeId(themeId);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setOpenThemeId(null);
  };

  const handleMouseEnter = (themeId: string) => {
    setOpenThemeId(themeId);
  };

  return (
    <div className="top-menu-bar" ref={dropdownRef}>
      <div className="top-menu-bar__container">
        <div className="top-menu-bar__brand">
          <h1>ImperioHub</h1>
        </div>

        <nav className="top-menu-bar__nav">
          {config.themes.map((theme) => {
            const isActive = state.currentTheme?.id === theme.id;
            const isOpen = openThemeId === theme.id;

            return (
              <div
                key={theme.id}
                className={`top-menu-bar__item ${isActive ? 'active' : ''}`}
                onMouseEnter={() => handleMouseEnter(theme.id)}
              >
                <button
                  className="top-menu-bar__button"
                  onClick={() => handleThemeClick(theme.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {theme.icon && <span className="icon">{theme.icon}</span>}
                  <span>{theme.label}</span>
                  <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
                </button>

                {isOpen && (
                  <div className="top-menu-bar__dropdown">
                    {theme.subThemes.map((subTheme) => (
                      <button
                        key={subTheme.id}
                        className="top-menu-bar__dropdown-item"
                        onClick={() => handleThemeSelect(theme.id)}
                      >
                        {subTheme.icon && <span className="icon">{subTheme.icon}</span>}
                        <div className="content">
                          <span className="label">{subTheme.label}</span>
                          {subTheme.description && (
                            <span className="description">{subTheme.description}</span>
                          )}
                        </div>
                        {subTheme.badge && (
                          <span className="badge">{subTheme.badge}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="top-menu-bar__actions">
          <button className="top-menu-bar__action-button">
            <span>⚙️</span>
          </button>
          <button className="top-menu-bar__action-button">
            <span>👤</span>
          </button>
        </div>
      </div>
    </div>
  );
};
