import { useState } from "react";
import { useApiKeys } from "../../../hooks/useTradingBot";
import { tradingAPI } from "../../../services/api";
import { ApiKeyForm } from "../../../components/ApiKeyForm";
import type { ApiKeyFormData } from "../../../types/trading";
import "./ApiKeysPage.scss";

export function ApiKeysPage() {
  const { apiKeys, loading, error, refetch } = useApiKeys();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: ApiKeyFormData) => {
    setSaving(true);
    setErrorMessage(null);

    try {
      const response = await tradingAPI.createApiKey(data);
      if (response.success) {
        setSuccessMessage("API Key creada exitosamente");
        setShowForm(false);
        refetch();
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Error al crear API Key");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta API Key?")) return;

    try {
      await tradingAPI.deleteApiKey(id);
      setSuccessMessage("API Key eliminada");
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Error al eliminar API Key");
    }
  };

  const handleVerify = async (id: string) => {
    setVerifying(id);
    setErrorMessage(null);

    try {
      const response = await tradingAPI.verifyApiKey(id);
      if (response.success && response.data) {
        const { isValid, permissions } = response.data;
        if (isValid) {
          const perms = Object.entries(permissions)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(", ");
          setSuccessMessage(`✓ API Key válida. Permisos: ${perms}`);
        } else {
          setErrorMessage("✗ API Key inválida o sin permisos");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Error al verificar API Key");
    } finally {
      setVerifying(null);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SPOT: "Spot",
      MARGIN: "Margin",
      FUTURES: "Futuros",
      COPY_TRADING_SPOT: "Copy Trading Spot",
      COPY_TRADING_FUTURES: "Copy Trading Futuros",
    };
    return labels[type] || type;
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return key.slice(0, 8) + "...";
    return key.slice(0, 8) + "..." + key.slice(-4);
  };

  return (
    <div className="api-keys-page">
      <div className="page-header">
        <div>
          <h1>API Keys</h1>
          <p className="subtitle">Gestiona las claves de API de tus exchanges</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Agregar API Key
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
          <button className="close-btn" onClick={() => setErrorMessage(null)}>✕</button>
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <h3>Nueva API Key</h3>
          <ApiKeyForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            loading={saving}
          />
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="retry-btn" onClick={refetch}>Reintentar</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando API Keys...</p>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔑</div>
          <h3>No tienes API Keys configuradas</h3>
          <p>Agrega una API Key para comenzar a usar los bots de trading</p>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Agregar Primera API Key
            </button>
          )}
        </div>
      ) : (
        <div className="api-keys-list">
          {apiKeys.map((key) => (
            <div key={key.id} className="api-key-card">
              <div className="key-info">
                <div className="key-header">
                  <span className="broker-badge">{key.broker}</span>
                  <span className="type-badge">{getTypeLabel(key.type)}</span>
                </div>
                <div className="key-value">
                  <code>{maskApiKey(key.apiKey)}</code>
                </div>
                <div className="key-meta">
                  <span>Creada: {new Date(key.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="key-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleVerify(key.id)}
                  disabled={verifying === key.id}
                >
                  {verifying === key.id ? "Verificando..." : "Probar Conexión"}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(key.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
