# 🔧 Guía de Debugging - Autenticación con Cookies

## ✅ Configuración Actual

El frontend ya está configurado correctamente con:
- ✅ Axios con `withCredentials: true`
- ✅ BaseURL apuntando a `http://localhost:3000/api/v1`
- ✅ Interceptores con logging detallado
- ✅ Rutas correctamente mapeadas al backend

## 🚨 ¿Por qué sigo recibiendo 401?

El error 401 significa que **no tienes una sesión activa** (no tienes la cookie `sessionId`).

### Paso 1: Verifica si tienes la cookie

1. Abre DevTools (F12)
2. Ve a la pestaña **Application** (o **Almacenamiento**)
3. En el menú lateral, selecciona **Cookies** → `http://localhost:3000`
4. Busca una cookie llamada `sessionId`

#### ✅ Si ves la cookie `sessionId`:
- **Name:** `sessionId`
- **Value:** Un UUID largo (ej: `cm123abc-1234-5678-...`)
- **Domain:** `localhost`
- **Path:** `/`
- **HttpOnly:** ✓
- **SameSite:** `Lax`

**Entonces el problema puede ser:**
- El dominio de la cookie está mal configurado
- Estás usando `http://localhost:5173` pero la cookie está en `http://localhost:3000`

#### ❌ Si NO ves la cookie `sessionId`:
**Necesitas hacer login primero.** Ve al Paso 2.

---

### Paso 2: Completa el flujo de login OAuth

**IMPORTANTE:** Para tener la cookie, debes completar el flujo de autenticación OAuth de Discord.

#### Opción A: Login desde el navegador
1. Abre una pestaña nueva
2. Visita: `http://localhost:3000/api/v1/auth/discord`
3. Autoriza la aplicación en Discord
4. Discord te redirigirá de vuelta a `http://localhost:5173`
5. Ahora ya tienes la cookie `sessionId`

#### Opción B: Crear un botón de login en tu app
```tsx
// En tu LoginPage.tsx o componente de login
function LoginButton() {
  const handleLogin = () => {
    // Redirige al endpoint de OAuth
    window.location.href = 'http://localhost:3000/api/v1/auth/discord';
  };

  return (
    <button onClick={handleLogin}>
      Iniciar sesión con Discord
    </button>
  );
}
```

---

### Paso 3: Verifica que las peticiones envían las cookies

Después de hacer login:

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Intenta hacer una petición (ej: generar código de vinculación)
4. Verás logs como:
   ```
   [HTTP] POST /auth/link/generate { withCredentials: true, baseURL: '...' }
   [HTTP] ✅ 200 /auth/link/generate
   ```

5. Ve a la pestaña **Network**
6. Selecciona la petición a `/auth/link/generate`
7. En **Headers**, busca la sección **Request Headers**
8. Verifica que aparezca:
   ```
   Cookie: sessionId=cm123abc-1234-5678-...
   ```

#### ✅ Si ves el header `Cookie`:
¡Las cookies se están enviando correctamente!

#### ❌ Si NO ves el header `Cookie`:
El navegador no está enviando las cookies. Posibles causas:
- CORS mal configurado en el backend
- Configuración de `sameSite` incorrecta
- Dominio de la cookie no coincide

---

## 🔍 Debugging Paso a Paso

### 1. Verifica las variables de entorno

Archivo: `.env` o `.env.local`
```bash
VITE_API_URL=http://localhost:3000
```

### 2. Verifica la configuración de la API

Archivo: `src/config/api.ts`
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_BASE_URL = `${API_URL}/api/v1`;
```

### 3. Comprueba que axios esté configurado

Archivo: `src/api/httpClient.ts`
```typescript
this.client = axios.create({
  baseURL: API_BASE_URL, // http://localhost:3000/api/v1
  withCredentials: true,  // ← CRUCIAL
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 4. Prueba manualmente en la consola

Abre DevTools → Console y ejecuta:

```javascript
// Prueba 1: Verifica que tienes la cookie
document.cookie

// Prueba 2: Haz una petición manual con fetch
fetch('http://localhost:3000/api/v1/auth/me', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Prueba 3: Haz una petición manual con axios
axios.get('http://localhost:3000/api/v1/auth/me', {
  withCredentials: true
})
  .then(r => console.log(r.data))
  .catch(console.error)
```

---

## 🛠️ Soluciones Comunes

### Problema 1: La cookie se establece pero no se envía

**Causa:** El dominio de la cookie no coincide.

**Solución:** Asegúrate de que:
- Frontend corre en: `http://localhost:5173`
- Backend corre en: `http://localhost:3000`
- La cookie tiene `Domain: localhost` (sin puerto)

### Problema 2: Error CORS

**Síntoma:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución:** Verifica que el backend tenga:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

### Problema 3: Cookie con SameSite=Strict

**Causa:** Si la cookie tiene `SameSite: Strict`, no se enviará en peticiones cross-origin.

**Solución:** El backend debe configurar:
```typescript
cookie: {
  httpOnly: true,
  sameSite: 'lax', // ← Debe ser 'lax' en desarrollo
  secure: false,   // ← false en desarrollo (http)
}
```

---

## 📊 Checklist de Verificación

- [ ] ¿Completaste el flujo OAuth visitando `/auth/discord`?
- [ ] ¿Ves la cookie `sessionId` en DevTools → Application → Cookies?
- [ ] ¿La cookie tiene `Domain: localhost` (sin puerto)?
- [ ] ¿Axios está configurado con `withCredentials: true`?
- [ ] ¿El backend está corriendo en `http://localhost:3000`?
- [ ] ¿El frontend está corriendo en `http://localhost:5173`?
- [ ] ¿Ves el header `Cookie` en las peticiones (DevTools → Network)?
- [ ] ¿El backend tiene CORS habilitado para `http://localhost:5173`?

---

## 🎯 Testing Rápido

1. **Hacer login:**
   ```
   http://localhost:3000/api/v1/auth/discord
   ```

2. **Verificar que estás autenticado:**
   ```javascript
   // En la consola del navegador
   fetch('http://localhost:3000/api/v1/auth/me', {
     credentials: 'include'
   }).then(r => r.json()).then(console.log)
   ```

3. **Si el paso 2 funciona, tu configuración es correcta** ✅

4. **Si el paso 2 falla con 401, revisa la cookie** ❌

---

## 📞 Soporte Adicional

Si después de seguir todos los pasos aún tienes problemas:

1. Abre DevTools → Console
2. Copia todos los logs que empiezan con `[HTTP]`
3. Abre DevTools → Network
4. Intenta la petición que falla
5. Click derecho en la petición → Copy → Copy as cURL
6. Comparte ambos outputs para debugging

---

## 🔗 Flujo Completo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario visita: http://localhost:5173                    │
│    ↓                                                         │
│ 2. Frontend detecta que no hay sesión (no hay cookie)       │
│    ↓                                                         │
│ 3. Usuario hace click en "Login con Discord"                │
│    ↓                                                         │
│ 4. Frontend redirige a:                                     │
│    http://localhost:3000/api/v1/auth/discord                │
│    ↓                                                         │
│ 5. Backend redirige a Discord OAuth                         │
│    https://discord.com/oauth2/authorize?...                 │
│    ↓                                                         │
│ 6. Usuario autoriza en Discord                              │
│    ↓                                                         │
│ 7. Discord redirige a callback:                             │
│    http://localhost:3000/api/v1/auth/discord/callback?code= │
│    ↓                                                         │
│ 8. Backend:                                                  │
│    - Valida el code con Discord                             │
│    - Crea/actualiza usuario en DB                           │
│    - Crea sesión en Redis                                   │
│    - Establece cookie 'sessionId' con httpOnly=true         │
│    ↓                                                         │
│ 9. Backend redirige a: http://localhost:5173                │
│    ↓                                                         │
│ 10. Frontend ahora tiene la cookie 'sessionId'              │
│     ↓                                                        │
│ 11. Frontend puede llamar a endpoints protegidos:           │
│     - GET /auth/me (con withCredentials: true)              │
│     - POST /auth/link/generate                              │
│     - etc.                                                   │
│     ↓                                                        │
│ 12. Backend valida la cookie en cada petición               │
│     ↓                                                        │
│ 13. ✅ Usuario autenticado                                   │
└─────────────────────────────────────────────────────────────┘
```
