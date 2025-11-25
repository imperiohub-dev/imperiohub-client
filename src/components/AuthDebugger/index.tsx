import { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

/**
 * Componente de debugging para verificar el estado de autenticación
 * Solo debe usarse en desarrollo
 */
export function AuthDebugger() {
  const [hasCookie, setHasCookie] = useState(false);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'not-authenticated'>('checking');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Verificar si hay cookies
    const cookies = document.cookie;
    setHasCookie(cookies.includes('sessionId'));

    // Intentar obtener datos del usuario
    try {
      const data = await authAPI.getMe();
      setAuthStatus('authenticated');
      setUserData(data.user);
    } catch (error) {
      setAuthStatus('not-authenticated');
      console.error('Error al verificar autenticación:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = authAPI.getLoginUrl();
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setAuthStatus('not-authenticated');
      setUserData(null);
      setHasCookie(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // No renderizar en producción
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px',
        backgroundColor: '#1a1a1a',
        border: '2px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#4CAF50' }}>
        🔧 Auth Debugger
      </h3>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ marginBottom: '5px' }}>
          <strong>Cookie sessionId:</strong>{' '}
          {hasCookie ? (
            <span style={{ color: '#4CAF50' }}>✅ Presente</span>
          ) : (
            <span style={{ color: '#f44336' }}>❌ No encontrada</span>
          )}
        </div>

        <div style={{ marginBottom: '5px' }}>
          <strong>Estado:</strong>{' '}
          {authStatus === 'checking' && <span>⏳ Verificando...</span>}
          {authStatus === 'authenticated' && (
            <span style={{ color: '#4CAF50' }}>✅ Autenticado</span>
          )}
          {authStatus === 'not-authenticated' && (
            <span style={{ color: '#f44336' }}>❌ No autenticado</span>
          )}
        </div>

        {userData && (
          <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#2a2a2a', borderRadius: '4px' }}>
            <div><strong>Usuario:</strong> {userData.username}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Discord ID:</strong> {userData.discordId}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        {authStatus === 'not-authenticated' ? (
          <button
            onClick={handleLogin}
            style={{
              padding: '8px 12px',
              backgroundColor: '#5865F2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            🔐 Login con Discord
          </button>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            🚪 Logout
          </button>
        )}

        <button
          onClick={checkAuthStatus}
          style={{
            padding: '8px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          🔄 Recargar Estado
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#888' }}>
        💡 Abre DevTools para ver logs detallados
      </div>
    </div>
  );
}
