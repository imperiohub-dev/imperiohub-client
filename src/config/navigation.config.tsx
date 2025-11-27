/**
 * Navigation Configuration
 * Defines all themes and subthemes for the application
 */

import type { NavigationConfig } from "../types/navigation";

// Settings Theme Components
import { LinkDiscordPage } from "../pages/themes/settings/LinkDiscordPage";

// Trading Theme Components
import { MarketplacePage } from "../pages/themes/trading/MarketplacePage";
import { MyBotsPage } from "../pages/themes/trading/MyBotsPage";
import { ApiKeysPage } from "../pages/themes/trading/ApiKeysPage";
import { PerformancePage } from "../pages/themes/trading/PerformancePage";

export const navigationConfig: NavigationConfig = {
  defaultTheme: "Trading",
  themes: [
    {
      id: "Trading",
      label: "Trading",
      icon: "🏪",
      defaultSubTheme: "marketplace",
      subThemes: [
        {
          id: "marketplace",
          label: "Marketplace",
          path: "/trading/marketplace",
          icon: "🛒",
          component: MarketplacePage,
          description: "Ver bots disponibles",
        },
        {
          id: "my-bots",
          label: "Mis Bots",
          path: "/trading/my-bots",
          icon: "🤖",
          component: MyBotsPage,
          description: "Gestionar mis bots",
        },
        {
          id: "api-keys",
          label: "API Keys",
          path: "/trading/api-keys",
          icon: "🔑",
          component: ApiKeysPage,
          description: "Configurar API keys",
        },
        {
          id: "performance",
          label: "Rendimiento",
          path: "/trading/performance",
          icon: "📊",
          component: PerformancePage,
          description: "Ver rendimiento de bots",
        },
      ],
    },
    {
      id: "settings",
      label: "Configuración",
      icon: "⚙️",
      defaultSubTheme: "general",
      subThemes: [
        {
          id: "general",
          label: "General",
          path: "/settings/general",
          icon: "🔧",
          description: "Configuración general",
          component: () => (
            <div className="theme-page">
              <h2>Configuración General</h2>
              <p>Próximamente...</p>
            </div>
          ),
        },
        {
          id: "users",
          label: "Usuarios",
          path: "/settings/users",
          icon: "👤",
          description: "Gestión de usuarios",
          component: () => (
            <div className="theme-page">
              <h2>Usuarios</h2>
              <p>Próximamente...</p>
            </div>
          ),
        },
        {
          id: "integrations",
          label: "Integraciones",
          path: "/settings/integrations",
          icon: "🔌",
          description: "Integraciones externas",
          component: () => (
            <div className="theme-page">
              <h2>Integraciones</h2>
              <p>Próximamente...</p>
            </div>
          ),
        },
        {
          id: "discord",
          label: "Link Discord",
          path: "/settings/discord",
          icon: "💬",
          description: "Vincular cuenta de Discord",
          component: LinkDiscordPage,
        },
      ],
    },
  ],
};
