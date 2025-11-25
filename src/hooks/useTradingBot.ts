import { useState, useEffect } from "react";
import { tradingAPI } from "../services/api";
import type {
  TradingBot,
  UserTraderBot,
  ApiKey,
  TradingInstance,
  UserTraderBotOperation,
} from "../types/trading";

/**
 * Hook para gestionar bots disponibles en el marketplace
 */
export function useMarketplaceBots() {
  const [bots, setBots] = useState<TradingBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradingAPI.getBots();
      if (response.success && response.data) {
        setBots(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar bots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  return { bots, loading, error, refetch: fetchBots };
}

/**
 * Hook para gestionar los bots del usuario
 */
export function useMyBots(includeConfig = false) {
  const [bots, setBots] = useState<UserTraderBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradingAPI.getMyBots(includeConfig);
      if (response.success && response.data) {
        setBots(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar mis bots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, [includeConfig]);

  return { bots, loading, error, refetch: fetchBots };
}

/**
 * Hook para gestionar API Keys
 */
export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradingAPI.getApiKeys();
      if (response.success && response.data) {
        setApiKeys(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return { apiKeys, loading, error, refetch: fetchApiKeys };
}

/**
 * Hook para gestionar Trading Instances de un bot
 */
export function useTradingInstances(userBotId: string | null) {
  const [instances, setInstances] = useState<TradingInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstances = async () => {
    if (!userBotId) {
      setInstances([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tradingAPI.getTradingInstances(userBotId);
      if (response.success && response.data) {
        setInstances(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar instancias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, [userBotId]);

  return { instances, loading, error, refetch: fetchInstances };
}

/**
 * Hook para gestionar operaciones de una instancia
 */
export function useOperations(
  userBotId: string | null,
  instanceId: string | null,
  status?: "OPEN" | "CLOSE"
) {
  const [operations, setOperations] = useState<UserTraderBotOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  const fetchOperations = async (offset = 0) => {
    if (!userBotId || !instanceId) {
      setOperations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tradingAPI.getInstanceOperations(userBotId, instanceId, {
        status,
        limit: 50,
        offset,
      });

      if (response.success && response.data) {
        setOperations(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar operaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, [userBotId, instanceId, status]);

  return {
    operations,
    loading,
    error,
    pagination,
    refetch: fetchOperations,
  };
}
