# Trading Bot Configuration - MVP Documentation

## 📋 Resumen

Sistema completo de gestión de bots de trading con interfaz de usuario moderna y funcional.

## 🎯 Características Implementadas

### 1. Marketplace de Bots (`/trading/marketplace`)
- Grid de bots disponibles con información detallada
- Stats de backtesting (Win Rate, Profit Factor, Sharpe Ratio)
- Modal de compra con selección de API Key
- Badges para Market Type y Position Side

### 2. Gestión de API Keys (`/trading/api-keys`)
- CRUD completo de API Keys
- Soporte para múltiples brokers (Binance)
- Tipos: SPOT, MARGIN, FUTURES, COPY_TRADING
- Verificación de conexión con botón "Probar Conexión"
- Máscareo de API Keys por seguridad

### 3. Mis Bots (`/trading/my-bots`)
- Lista de bots comprados
- Stepper de 3 pasos para configuración completa:
  - **Paso 1**: Configuración básica (alias, API key, activar)
  - **Paso 2**: Parámetros de trading (portfolio, leverage, etc.)
  - **Paso 3**: Trading Instances (pares de trading)
- Activar/desactivar bots
- Eliminar bots

### 4. Performance Dashboard (`/trading/performance`)
- Selector de bot y par de trading
- Métricas en tiempo real:
  - Total operaciones
  - Operaciones abiertas/cerradas
  - PnL total
- Tabla de historial de operaciones
- Color coding para ganancias/pérdidas

## 🛠️ Componentes Reutilizables

### UI Components
- `BotMarketplaceCard` - Card de bot en marketplace
- `PurchaseModal` - Modal de confirmación de compra
- `ApiKeyForm` - Formulario de API Keys
- `BotConfigStepper` - Stepper de 3 pasos
- `Toast` - Notificaciones toast
- `Breadcrumbs` - Navegación breadcrumb
- `LoadingSpinner` - Spinner de carga
- `ErrorBoundary` - Manejo de errores React

### Custom Hooks
- `useMarketplaceBots()` - Gestiona bots del marketplace
- `useMyBots()` - Gestiona bots del usuario
- `useApiKeys()` - Gestiona API keys
- `useTradingInstances()` - Gestiona instances de trading
- `useOperations()` - Gestiona operaciones
- `useToast()` - Gestiona notificaciones toast

### API Service
- `tradingAPI` - 20+ métodos para interactuar con el backend
- Todos los endpoints documentados en la API

## 📦 Dependencias Agregadas

```json
{
  "react-hook-form": "^7.x.x"
}
```

## 🎨 Estilos

Todos los estilos usan el sistema de diseño existente:

```scss
@use '../../../styles/abstracts' as *;

.component {
  @include card-base;
  @include button-primary;
  @include flex-column($spacing-lg);
}
```

## 🚀 Uso Básico

### 1. Setup de API Keys

```typescript
import { ApiKeyForm } from "../components/ApiKeyForm";
import { tradingAPI } from "../services/api";

const handleSubmit = async (data) => {
  await tradingAPI.createApiKey(data);
};

<ApiKeyForm onSubmit={handleSubmit} onCancel={onCancel} />
```

### 2. Compra de Bot

```typescript
import { BotMarketplaceCard } from "../components/BotMarketplaceCard";

<BotMarketplaceCard
  bot={bot}
  onBuy={handleBuy}
  loading={purchasing}
/>
```

### 3. Configuración de Bot

```typescript
import { BotConfigStepper } from "../components/BotConfigStepper";

<BotConfigStepper
  bot={selectedBot}
  apiKeys={apiKeys}
  onClose={onClose}
  onSuccess={onSuccess}
/>
```

### 4. Notificaciones

```typescript
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";

const { toasts, success, error, removeToast } = useToast();

// Mostrar toast
success("Bot configurado exitosamente");
error("Error al guardar configuración");

// Renderizar toasts
{toasts.map((toast) => (
  <Toast
    key={toast.id}
    message={toast.message}
    type={toast.type}
    onClose={() => removeToast(toast.id)}
  />
))}
```

## 📊 TypeScript Types

Todos los tipos están definidos en `src/types/trading.ts`:

```typescript
import type {
  TradingBot,
  UserTraderBot,
  ApiKey,
  TradingInstance,
  UserTraderBotOperation,
  BotConfigurationFormData,
  // ... más tipos
} from "../types/trading";
```

## 🔒 Seguridad

- API Keys encriptadas en backend
- Máscareo de claves en frontend
- Validaciones en formularios con react-hook-form
- Confirmaciones para acciones destructivas
- Manejo seguro de errores

## 🎯 Estados de UI

Todas las páginas manejan:
- ✅ Loading states
- ✅ Empty states
- ✅ Error states
- ✅ Success messages

## 🧪 Validaciones

Según la documentación del API:

- Portfolio > 0
- PerTradePercent: 0-100%
- MaxDrawdownPercent: 0-100%
- MaxLeverage: 1-125x
- API Keys: longitud mínima 10 caracteres

## 🔄 Flujo Completo de Usuario

1. **Setup**: Usuario agrega API Key → Verifica conexión
2. **Compra**: Explora marketplace → Compra bot
3. **Configuración**: Completa 3 pasos del stepper
4. **Activación**: Activa el bot
5. **Monitoreo**: Ve rendimiento en dashboard

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── ApiKeyForm/
│   ├── BotConfigStepper/
│   ├── BotMarketplaceCard/
│   ├── Breadcrumbs/
│   ├── ErrorBoundary/
│   ├── LoadingSpinner/
│   ├── PurchaseModal/
│   └── Toast/
├── hooks/
│   ├── useTradingBot.ts
│   └── useToast.ts
├── pages/themes/trading/
│   ├── ApiKeysPage.tsx
│   ├── MarketplacePage.tsx
│   ├── MyBotsPage.tsx
│   └── PerformancePage.tsx
├── services/
│   └── api.ts (tradingAPI)
└── types/
    └── trading.ts
```

## 🐛 Troubleshooting

### API Keys no aparecen
- Verificar que el endpoint `/api/v1/users/me/api-keys` esté funcionando
- Revisar consola de errores

### Bot no se activa
- Verificar que tenga API Key asignada
- Verificar que tenga configuración de trading
- Verificar que tenga al menos 1 trading instance

### Operaciones no cargan
- Verificar que el bot esté seleccionado
- Verificar que el par tenga operaciones
- Revisar endpoint `/operations`

## 📝 Notas para Desarrollo

- Todos los componentes usan TypeScript estricto
- Estilos SCSS con sistema de diseño modular
- React Hooks + Context (sin Redux)
- Código limpio y bien documentado
- Listo para producción MVP

## 🔮 Próximas Mejoras (Post-MVP)

- [ ] WebSocket para updates en tiempo real
- [ ] Gráficas de rendimiento (Chart.js)
- [ ] Filtros avanzados en tabla
- [ ] Paginación en operaciones
- [ ] Notificaciones push
- [ ] Export de datos (CSV/Excel)
- [ ] Modo oscuro/claro
- [ ] Tests unitarios
