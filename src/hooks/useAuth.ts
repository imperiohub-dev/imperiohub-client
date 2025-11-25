import { useState, useEffect } from 'react';
import { authAPI, type User } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.user);
      setAuthenticated(true);
    } catch (error) {
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    window.location.href = authAPI.getLoginUrl();
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    user,
    authenticated,
    loading,
    login,
    logout,
    checkAuth,
  };
}
