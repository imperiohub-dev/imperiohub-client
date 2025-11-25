# Sistema de Navegación Multi-nivel

Sistema modular de navegación con 3 capas para plataforma empresarial.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│  TopMenuBar - Menú superior con dropdown           │
│  [Ventas] [Inventario] [Finanzas] [Reportes]       │
└─────────────────────────────────────────────────────┘
┌─────────────┬───────────────────────────────────────┐
│             │                                       │
│ LeftSidebar │        MainContent                    │
│ (Subtemas)  │        (Vista renderizada)            │
│             │                                       │
│ • Dashboard │                                       │
│ • Clientes  │    Renderizado dinámico según         │
│ • Productos │    tema + subtema seleccionado        │
│ • Órdenes   │                                       │
│             │                                       │
└─────────────┴───────────────────────────────────────┘
```

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── navigation.ts              # Tipos TypeScript
├── contexts/
│   └── NavigationContext.tsx      # Context + Provider
├── components/
│   └── layout/
│       ├── AppLayout.tsx          # Layout principal
│       ├── TopMenuBar.tsx         # Menú superior
│       ├── LeftSidebar.tsx        # Panel izquierdo
│       ├── MainContent.tsx        # Área de contenido
│       └── *.scss                 # Estilos SASS
├── config/
│   └── navigation.config.tsx      # Configuración de navegación
├── pages/
│   └── themes/
│       ├── sales/                 # Tema: Ventas
│       ├── inventory/             # Tema: Inventario
│       └── reports/               # Tema: Reportes
└── App.tsx                        # Routing principal
```

## 🚀 Cómo Agregar un Nuevo Tema

### 1. Crear los componentes del tema

```tsx
// src/pages/themes/miTema/MiDashboard.tsx
export const MiDashboard = () => {
  return (
    <div className="theme-page">
      <h2>Mi Dashboard</h2>
      <p>Contenido de mi dashboard...</p>
    </div>
  );
};
```

### 2. Agregar configuración al navigation.config.tsx

```tsx
// src/config/navigation.config.tsx
import { MiDashboard } from '../pages/themes/miTema/MiDashboard';

export const navigationConfig: NavigationConfig = {
  themes: [
    // ... temas existentes
    {
      id: 'mi-tema',
      label: 'Mi Tema',
      icon: '🎯',
      defaultSubTheme: 'dashboard',
      subThemes: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/mi-tema/dashboard',
          icon: '📊',
          description: 'Vista general',
          component: MiDashboard,
        },
        {
          id: 'detalle',
          label: 'Detalle',
          path: '/mi-tema/detalle',
          icon: '📋',
          description: 'Vista detallada',
          badge: '3', // Opcional
          component: MiDetalle,
        },
      ],
    },
  ],
};
```

### 3. ¡Listo! 🎉

El sistema automáticamente:
- ✅ Genera las rutas en React Router
- ✅ Muestra el tema en el menú superior
- ✅ Renderiza los subtemas en el sidebar izquierdo
- ✅ Maneja la navegación y el estado activo
- ✅ Sincroniza con la URL del navegador

## 📝 Configuración de Tema

### Propiedades del Theme

```typescript
interface Theme {
  id: string;              // ID único del tema
  label: string;           // Texto mostrado en el menú
  icon?: string;           // Emoji o icono (opcional)
  subThemes: SubTheme[];   // Array de subtemas
  defaultSubTheme?: string; // ID del subtema por defecto
}
```

### Propiedades del SubTheme

```typescript
interface SubTheme {
  id: string;              // ID único del subtema
  label: string;           // Texto mostrado en el sidebar
  path: string;            // Ruta URL (debe ser única)
  icon?: string;           // Emoji o icono (opcional)
  component: ComponentType; // Componente React a renderizar
  badge?: string | number; // Badge de notificación (opcional)
  description?: string;    // Descripción mostrada en dropdown (opcional)
}
```

## 🎨 Ejemplo Completo

### Crear estructura de archivos

```bash
# Crear carpeta del tema
mkdir -p src/pages/themes/crm

# Crear componentes
touch src/pages/themes/crm/CrmDashboard.tsx
touch src/pages/themes/crm/ContactsView.tsx
touch src/pages/themes/crm/DealsView.tsx
```

### Implementar componentes

```tsx
// src/pages/themes/crm/CrmDashboard.tsx
export const CrmDashboard = () => {
  return (
    <div className="theme-page">
      <h2>CRM Dashboard</h2>

      <div className="grid-3 mt-lg">
        <div className="card">
          <h3 className="h4">Contactos</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem' }}>1,234</p>
          <span className="badge badge-success">+12.5%</span>
        </div>

        <div className="card">
          <h3 className="h4">Deals Abiertos</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem' }}>45</p>
          <span className="badge badge-info">En progreso</span>
        </div>

        <div className="card">
          <h3 className="h4">Valor Pipeline</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem' }}>$156K</p>
          <span className="badge badge-warning">+8.2%</span>
        </div>
      </div>
    </div>
  );
};

// src/pages/themes/crm/ContactsView.tsx
export const ContactsView = () => {
  return (
    <div className="theme-page">
      <div className="flex-between mb-lg">
        <h2>Contactos</h2>
        <button className="btn btn-primary">+ Nuevo Contacto</button>
      </div>

      <div className="card">
        <p>Lista de contactos aquí...</p>
      </div>
    </div>
  );
};

// src/pages/themes/crm/DealsView.tsx
export const DealsView = () => {
  return (
    <div className="theme-page">
      <h2>Deals</h2>
      <p>Pipeline de ventas aquí...</p>
    </div>
  );
};
```

### Agregar a la configuración

```tsx
// src/config/navigation.config.tsx
import { CrmDashboard } from '../pages/themes/crm/CrmDashboard';
import { ContactsView } from '../pages/themes/crm/ContactsView';
import { DealsView } from '../pages/themes/crm/DealsView';

export const navigationConfig: NavigationConfig = {
  defaultTheme: 'sales',
  themes: [
    // ... temas existentes (sales, inventory, etc.)

    // Nuevo tema CRM
    {
      id: 'crm',
      label: 'CRM',
      icon: '👥',
      defaultSubTheme: 'dashboard',
      subThemes: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/crm/dashboard',
          icon: '📊',
          description: 'Vista general del CRM',
          component: CrmDashboard,
        },
        {
          id: 'contacts',
          label: 'Contactos',
          path: '/crm/contacts',
          icon: '📇',
          description: 'Gestión de contactos',
          badge: '1,234',
          component: ContactsView,
        },
        {
          id: 'deals',
          label: 'Deals',
          path: '/crm/deals',
          icon: '💼',
          description: 'Pipeline de ventas',
          badge: '45',
          component: DealsView,
        },
      ],
    },
  ],
};
```

## 🎯 Hook useNavigation()

Accede al contexto de navegación desde cualquier componente:

```tsx
import { useNavigation } from '../contexts/NavigationContext';

function MiComponente() {
  const {
    state,           // Estado actual { currentTheme, currentSubTheme, isLoading }
    config,          // Configuración completa
    setTheme,        // Cambiar tema
    setSubTheme,     // Cambiar subtema
    navigateTo,      // Navegar a tema + subtema específico
    getCurrentPath,  // Obtener path actual
  } = useNavigation();

  // Cambiar a otro tema
  const irAInventario = () => {
    setTheme('inventory');
  };

  // Cambiar subtema dentro del tema actual
  const irAClientes = () => {
    setSubTheme('clients');
  };

  // Navegar a tema + subtema específico
  const irAReportes = () => {
    navigateTo('reports', 'analytics');
  };

  return (
    <div>
      <p>Tema actual: {state.currentTheme?.label}</p>
      <p>Subtema actual: {state.currentSubTheme?.label}</p>
      <button onClick={irAInventario}>Ir a Inventario</button>
    </div>
  );
}
```

## 🎨 Estilos Disponibles

Todos los componentes tienen acceso al design system completo:

### Clases de Layout
```jsx
<div className="container">
  <div className="grid-3">...</div>
</div>
```

### Botones
```jsx
<button className="btn btn-primary">Guardar</button>
<button className="btn btn-secondary">Cancelar</button>
<button className="btn btn-outline">Ver más</button>
<button className="btn btn-ghost">Editar</button>
```

### Cards
```jsx
<div className="card">
  <div className="card-header">...</div>
  <div className="card-body">...</div>
  <div className="card-footer">...</div>
</div>

<div className="card-interactive">Card con hover</div>
<div className="card-glass">Card con efecto glass</div>
```

### Badges
```jsx
<span className="badge badge-success">Activo</span>
<span className="badge badge-warning">Pendiente</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-info">Info</span>
```

### Utilidades
```jsx
<div className="flex-between gap-md p-lg">
  <span className="text-accent">Texto con acento</span>
  <span className="text-secondary">Texto secundario</span>
</div>
```

## 📱 Navegación Programática

### Desde el código
```tsx
// Usando el hook
const { navigateTo } = useNavigation();
navigateTo('sales', 'clients');

// Usando React Router
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/sales/clients');
```

### Desde links
```tsx
import { Link } from 'react-router-dom';

<Link to="/sales/clients">Ver Clientes</Link>
```

## 🔄 Flujo de Navegación

1. **Usuario hace clic en tema** (TopMenuBar)
   - Se abre dropdown con subtemas
   - Usuario selecciona tema
   - Se ejecuta `setTheme(themeId)`

2. **NavigationContext actualiza estado**
   - Busca el tema por ID
   - Obtiene el subtema por defecto
   - Actualiza `currentTheme` y `currentSubTheme`
   - Navega a la ruta del subtema

3. **React Router renderiza**
   - Matchea la ruta con el componente
   - Renderiza el componente en `<Outlet />`

4. **UI se actualiza**
   - TopMenuBar muestra tema activo
   - LeftSidebar muestra subtemas del tema
   - MainContent renderiza el componente

## 🛠️ Tips de Desarrollo

### 1. Placeholder rápido
Para agregar temas sin componentes completos:

```tsx
{
  id: 'nuevo-tema',
  label: 'Nuevo Tema',
  icon: '🚀',
  subThemes: [
    {
      id: 'vista1',
      label: 'Vista 1',
      path: '/nuevo-tema/vista1',
      component: () => (
        <div className="theme-page">
          <h2>Vista 1</h2>
          <p>Próximamente...</p>
        </div>
      ),
    },
  ],
}
```

### 2. Reutilizar componentes
Puedes usar el mismo componente en múltiples subtemas:

```tsx
import { GenericDashboard } from '../components/GenericDashboard';

{
  subThemes: [
    {
      id: 'dashboard1',
      path: '/tema1/dashboard',
      component: () => <GenericDashboard tipo="ventas" />,
    },
    {
      id: 'dashboard2',
      path: '/tema2/dashboard',
      component: () => <GenericDashboard tipo="inventario" />,
    },
  ],
}
```

### 3. Lazy loading (futuro)
Para optimizar carga, puedes usar React.lazy:

```tsx
import { lazy } from 'react';

const CrmDashboard = lazy(() => import('../pages/themes/crm/CrmDashboard'));
```

## 📊 Temas Actuales

El sistema viene con 5 temas de ejemplo:

1. **Ventas** 💰 - Dashboard, Clientes, Órdenes
2. **Inventario** 📦 - Dashboard, Productos, Proveedores
3. **Finanzas** 💵 - Resumen, Facturas, Gastos
4. **Reportes** 📊 - Todos, Analíticas
5. **Configuración** ⚙️ - General, Usuarios, Integraciones

¡Puedes modificarlos o agregar los que necesites!
