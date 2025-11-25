import { useEffect, useState } from 'react';
import { authAPI, type LinkStatus } from '../services/api';

export const useDiscordLink = () => {
  const [linkStatus, setLinkStatus] = useState<LinkStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkLinkStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await authAPI.getLinkStatus();
      setLinkStatus(status);
    } catch (err) {
      console.error('Error checking link status:', err);
      setError('Error al verificar el estado de vinculación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLinkStatus();
  }, []);

  return { linkStatus, loading, error, refetch: checkLinkStatus };
};
