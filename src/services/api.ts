import axios from "axios";

// Configuración de la API - Backend URL base (sin /api)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// En desarrollo con proxy, usar ruta relativa
// En producción o desarrollo local, usar URL completa
const getBaseURL = () => {
  const isProduction = import.meta.env.PROD;
  const isDevelopmentWithProxy = !isProduction && API_URL.startsWith("https");

  // Si estamos en desarrollo y el API_URL es HTTPS, usar proxy relativo
  if (isDevelopmentWithProxy) {
    return "/api/v1";
  }

  // Agregar /api/v1 según la estructura del backend
  return `${API_URL}/api/v1`;
};

// Crear instancia de axios configurada
export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // ← IMPORTANTE: permite enviar/recibir cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores de autenticación
// Nota: No redirigimos aquí porque ProtectedRoute ya maneja la redirección
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo logueamos el error, la redirección la maneja ProtectedRoute
    if (error.response?.status === 401) {
      console.log("Error 401: Usuario no autenticado");
    }
    return Promise.reject(error);
  }
);

// ========================================
// TIPOS
// ========================================
export interface User {
  id: string;
  discordId: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface AuthStatus {
  authenticated: boolean;
}

export interface AuthMeResponse {
  user: User;
}

export interface Session {
  id: string;
  userAgent: string;
  ip: string;
  createdAt: string;
  lastActivity: string;
  current: boolean;
}

export interface SessionsResponse {
  sessions: Session[];
}

export interface DiscordLinkCode {
  code: string;
  expiresAt: string;
}

export interface DiscordLinkCodeResponse {
  linkCode: DiscordLinkCode;
}

export interface DiscordLinkRequest {
  code: string;
}

export interface DiscordLinkResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface DiscordLinkStatus {
  isLinked: boolean;
  discordUsername?: string;
  discordId?: string;
}

// ========================================
// SERVICIO DE AUTENTICACIÓN (authAPI)
// ========================================
export const authAPI = {
  /**
   * Obtiene la URL para iniciar el flujo de OAuth con Discord
   */
  getLoginUrl(): string {
    const baseURL = getBaseURL();
    return `${baseURL}/auth/discord`;
  },

  /**
   * Verifica el estado de autenticación
   */
  async checkStatus(): Promise<AuthStatus> {
    const { data } = await axiosInstance.get<AuthStatus>("/auth/status");
    return data;
  },

  /**
   * Obtiene la información del usuario autenticado
   */
  async getMe(): Promise<AuthMeResponse> {
    const { data } = await axiosInstance.get<AuthMeResponse>("/auth/me");
    return data;
  },

  /**
   * Cierra la sesión actual
   */
  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },

  /**
   * Cierra todas las sesiones del usuario
   */
  async logoutAll(): Promise<void> {
    await axiosInstance.post("/auth/logout-all");
  },

  /**
   * Obtiene todas las sesiones activas del usuario
   */
  async getSessions(): Promise<SessionsResponse> {
    const { data } = await axiosInstance.get<SessionsResponse>(
      "/auth/sessions"
    );
    return data;
  },

  /**
   * Revoca una sesión específica
   */
  async revokeSession(sessionId: string): Promise<void> {
    await axiosInstance.delete(`/auth/sessions/${sessionId}`);
  },

  /**
   * Genera un código de vinculación de Discord
   */
  async generateLinkCode(): Promise<DiscordLinkCodeResponse> {
    const { data } = await axiosInstance.post<DiscordLinkCodeResponse>(
      "/auth/discord/link/generate"
    );
    return data;
  },

  /**
   * Verifica el estado de vinculación de Discord
   */
  async checkDiscordLinkStatus(): Promise<DiscordLinkStatus> {
    const { data } = await axiosInstance.get<DiscordLinkStatus>(
      "/auth/discord/link-status"
    );
    return data;
  },

  /**
   * Alias para checkDiscordLinkStatus (retrocompatibilidad)
   */
  async getLinkStatus(): Promise<DiscordLinkStatus> {
    return this.checkDiscordLinkStatus();
  },

  /**
   * Desvincula la cuenta de Discord
   */
  async unlinkDiscord(): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>("/auth/discord/unlink");
    return data;
  },
};

// ========================================
// SERVICIO DE API GENERAL
// ========================================
export const api = {
  // Métodos genéricos para llamadas HTTP protegidas

  async get<T>(endpoint: string): Promise<T> {
    const { data } = await axiosInstance.get<T>(endpoint);
    return data;
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const { data } = await axiosInstance.post<T>(endpoint, body);
    return data;
  },

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const { data } = await axiosInstance.put<T>(endpoint, body);
    return data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const { data } = await axiosInstance.delete<T>(endpoint);
    return data;
  },

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const { data } = await axiosInstance.patch<T>(endpoint, body);
    return data;
  },
};
