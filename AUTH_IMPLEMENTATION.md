# Implementación de Autenticación

## Estructura de Archivos

```
src/
├── api/
│   └── auth.ts              # Cliente API para endpoints de autenticación
├── components/
│   └── ProtectedRoute.tsx   # Componente para proteger rutas
├── config/
│   └── api.ts               # Configuración de URLs de API
├── hooks/
│   └── useAuth.ts           # Hook para manejar autenticación
├── pages/
│   ├── LoginPage.tsx        # Página de login
│   └── DashboardPage.tsx    # Página principal (protegida)
├── store/
│   └── AuthContext.tsx      # Context de React para autenticación
└── types/
    └── auth.ts              # Tipos TypeScript para autenticación
```

## Configuración

### Variables de Entorno

Asegúrate de tener el archivo `.env` configurado:

```env
VITE_API_URL=http://localhost:3000
```

Para producción, cambia la URL al backend de producción.

## Flujo de Autenticación

1. **Usuario accede a la aplicación** → Si no está autenticado, redirige a `/login`
2. **Usuario hace clic en "Login with Discord"** → Redirige a `/api/v1/auth/discord`
3. **Backend maneja OAuth con Discord** → Establece cookie de sesión
4. **Backend redirige de vuelta al frontend** → Usuario autenticado
5. **Frontend verifica autenticación** → Muestra dashboard

## Cómo Usar

### Proteger una Ruta

```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Usar el Context de Autenticación

```tsx
import { useAuthContext } from './store/AuthContext';

function MyComponent() {
  const { user, authenticated, loading, login, logout } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {authenticated ? (
        <>
          <p>Hello {user?.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

## API Disponible

### authAPI

```typescript
import { authAPI } from './api/auth';

// Verificar estado de autenticación
await authAPI.checkStatus();

// Obtener información del usuario
await authAPI.getMe();

// Cerrar sesión
await authAPI.logout();

// Cerrar todas las sesiones
await authAPI.logoutAll();

// Obtener sesiones activas
await authAPI.getSessions();

// Revocar una sesión específica
await authAPI.revokeSession(sessionId);

// Obtener URL de login
const loginUrl = authAPI.getLoginUrl();
```

## Endpoints del Backend

- `GET /api/v1/auth/discord` - Inicia OAuth con Discord
- `GET /api/v1/auth/discord/callback` - Callback de Discord
- `GET /api/v1/auth/status` - Verifica si está autenticado
- `GET /api/v1/auth/me` - Obtiene información del usuario
- `POST /api/v1/auth/logout` - Cierra sesión actual
- `POST /api/v1/auth/logout-all` - Cierra todas las sesiones
- `GET /api/v1/auth/sessions` - Lista sesiones activas
- `DELETE /api/v1/auth/sessions/:id` - Revoca una sesión

## Notas Importantes

1. **Cookies**: La autenticación usa cookies HttpOnly. Todas las peticiones deben incluir `credentials: 'include'`

2. **CORS**: El backend debe tener CORS configurado para aceptar solicitudes desde el dominio del frontend

3. **HTTPS**: En producción, asegúrate de usar HTTPS

4. **Redirección**: Después del login, el backend redirige a la URL configurada en `FRONTEND_URL`

## Testing Local

1. Asegúrate de que el backend esté corriendo en `http://localhost:3000`
2. Ejecuta el frontend: `npm run dev`
3. Accede a `http://localhost:5173`
4. Haz clic en "Login with Discord"
5. Autoriza la aplicación en Discord
6. Serás redirigido de vuelta al dashboard

## Solución de Problemas

### Las cookies no se envían

- Verifica que estés usando `credentials: 'include'` en todas las peticiones
- Revisa la configuración CORS del backend

### Error 401 después del login

- Verifica que las cookies se estén estableciendo correctamente
- Revisa la configuración de `sameSite` en las cookies del backend
- Asegúrate de que frontend y backend estén en dominios compatibles

### No redirige después del login

- Verifica la variable `FRONTEND_URL` en el backend
- Revisa los logs del backend
