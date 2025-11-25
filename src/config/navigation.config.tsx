/**
 * Navigation Configuration
 * Defines all themes and subthemes for the application
 */

import type { NavigationConfig } from '../types/navigation';

// Sales Theme Components
import { SalesDashboard } from '../pages/themes/sales/SalesDashboard';
import { ClientsView } from '../pages/themes/sales/ClientsView';
import { OrdersView } from '../pages/themes/sales/OrdersView';

// Inventory Theme Components
import { InventoryDashboard } from '../pages/themes/inventory/InventoryDashboard';
import { ProductsView } from '../pages/themes/inventory/ProductsView';

// Reports Theme Components
import { ReportsOverview } from '../pages/themes/reports/ReportsOverview';

// Settings Theme Components
import { LinkDiscordPage } from '../pages/themes/settings/LinkDiscordPage';

export const navigationConfig: NavigationConfig = {
  defaultTheme: 'sales',
  themes: [
    {
      id: 'sales',
      label: 'Ventas',
      icon: '💰',
      defaultSubTheme: 'dashboard',
      subThemes: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/sales/dashboard',
          icon: '📊',
          description: 'Vista general de ventas',
          component: SalesDashboard,
        },
        {
          id: 'clients',
          label: 'Clientes',
          path: '/sales/clients',
          icon: '👥',
          description: 'Gestión de clientes',
          component: ClientsView,
        },
        {
          id: 'orders',
          label: 'Órdenes',
          path: '/sales/orders',
          icon: '📋',
          description: 'Gestión de órdenes',
          badge: '12',
          component: OrdersView,
        },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventario',
      icon: '📦',
      defaultSubTheme: 'dashboard',
      subThemes: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/inventory/dashboard',
          icon: '📊',
          description: 'Vista general del inventario',
          component: InventoryDashboard,
        },
        {
          id: 'products',
          label: 'Productos',
          path: '/inventory/products',
          icon: '🏷️',
          description: 'Gestión de productos',
          component: ProductsView,
        },
        {
          id: 'suppliers',
          label: 'Proveedores',
          path: '/inventory/suppliers',
          icon: '🚚',
          description: 'Gestión de proveedores',
          component: () => <div className="theme-page"><h2>Proveedores</h2><p>Próximamente...</p></div>,
        },
      ],
    },
    {
      id: 'finance',
      label: 'Finanzas',
      icon: '💵',
      defaultSubTheme: 'overview',
      subThemes: [
        {
          id: 'overview',
          label: 'Resumen',
          path: '/finance/overview',
          icon: '📈',
          description: 'Resumen financiero',
          component: () => <div className="theme-page"><h2>Resumen Financiero</h2><p>Próximamente...</p></div>,
        },
        {
          id: 'invoices',
          label: 'Facturas',
          path: '/finance/invoices',
          icon: '🧾',
          description: 'Gestión de facturas',
          component: () => <div className="theme-page"><h2>Facturas</h2><p>Próximamente...</p></div>,
        },
        {
          id: 'expenses',
          label: 'Gastos',
          path: '/finance/expenses',
          icon: '💸',
          description: 'Control de gastos',
          component: () => <div className="theme-page"><h2>Gastos</h2><p>Próximamente...</p></div>,
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: '📊',
      defaultSubTheme: 'overview',
      subThemes: [
        {
          id: 'overview',
          label: 'Todos los Reportes',
          path: '/reports/overview',
          icon: '📄',
          description: 'Ver todos los reportes',
          component: ReportsOverview,
        },
        {
          id: 'analytics',
          label: 'Analíticas',
          path: '/reports/analytics',
          icon: '📈',
          description: 'Analíticas avanzadas',
          component: () => <div className="theme-page"><h2>Analíticas</h2><p>Próximamente...</p></div>,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: '⚙️',
      defaultSubTheme: 'general',
      subThemes: [
        {
          id: 'general',
          label: 'General',
          path: '/settings/general',
          icon: '🔧',
          description: 'Configuración general',
          component: () => <div className="theme-page"><h2>Configuración General</h2><p>Próximamente...</p></div>,
        },
        {
          id: 'users',
          label: 'Usuarios',
          path: '/settings/users',
          icon: '👤',
          description: 'Gestión de usuarios',
          component: () => <div className="theme-page"><h2>Usuarios</h2><p>Próximamente...</p></div>,
        },
        {
          id: 'integrations',
          label: 'Integraciones',
          path: '/settings/integrations',
          icon: '🔌',
          description: 'Integraciones externas',
          component: () => <div className="theme-page"><h2>Integraciones</h2><p>Próximamente...</p></div>,
        },
        {
          id: 'discord',
          label: 'Link Discord',
          path: '/settings/discord',
          icon: '💬',
          description: 'Vincular cuenta de Discord',
          component: LinkDiscordPage,
        },
      ],
    },
  ],
};
