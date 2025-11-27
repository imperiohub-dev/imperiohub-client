import { useState } from "react";
import type { TradingBot, ApiKey } from "../../types/trading";
import "./index.scss";

interface PurchaseModalProps {
  bot: TradingBot;
  apiKeys: ApiKey[];
  onConfirm: (botId: string, apiKeyId: string, alias: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PurchaseModal = ({
  bot,
  apiKeys,
  onConfirm,
  onCancel,
  loading,
}: PurchaseModalProps) => {
  const [selectedApiKey, setSelectedApiKey] = useState<string>("");
  const [alias, setAlias] = useState<string>(bot.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApiKey) return;
    onConfirm(bot.id, selectedApiKey, alias);
  };

  const formatPrice = (price?: string) => {
    if (!price) return "Gratis";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirmar Compra</h2>
          <button className="close-btn" onClick={onCancel} disabled={loading}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="bot-info">
            <h3>{bot.name}</h3>
            <p>{bot.description}</p>
            <div className="price-display">
              <span className="price">{formatPrice(bot.product?.price)}</span>
              {bot.product?.billingModel && (
                <span className="billing-model">({bot.product.billingModel})</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="purchase-form">
            <div className="form-group">
              <label htmlFor="alias">Nombre del Bot (Alias)</label>
              <input
                id="alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej: Mi Bot BTC"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apiKey">Seleccionar API Key</label>
              <select
                id="apiKey"
                value={selectedApiKey}
                onChange={(e) => setSelectedApiKey(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">-- Selecciona una API Key --</option>
                {apiKeys.map((key) => (
                  <option key={key.id} value={key.id}>
                    {key.broker} - {key.type} ({key.apiKey.slice(0, 8)}...)
                  </option>
                ))}
              </select>
              {apiKeys.length === 0 && (
                <p className="helper-text">
                  No tienes API Keys configuradas. Ve a la sección de API Keys para agregar una.
                </p>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !selectedApiKey}
              >
                {loading ? "Procesando..." : "Confirmar Compra"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
