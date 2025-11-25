import { useState } from "react";
import { useMarketplaceBots, useApiKeys } from "../../../hooks/useTradingBot";
import { tradingAPI } from "../../../services/api";
import { BotMarketplaceCard } from "../../../components/BotMarketplaceCard";
import { PurchaseModal } from "../../../components/PurchaseModal";
import type { TradingBot } from "../../../types/trading";
import "./MarketplacePage.scss";

export function MarketplacePage() {
  const { bots, loading, error, refetch } = useMarketplaceBots();
  const { apiKeys } = useApiKeys();
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleBuyClick = (bot: TradingBot) => {
    setSelectedBot(bot);
    setPurchaseError(null);
    setSuccessMessage(null);
  };

  const handlePurchaseConfirm = async (botId: string, apiKeyId: string, alias: string) => {
    setPurchasing(true);
    setPurchaseError(null);

    try {
      const response = await tradingAPI.subscribeToBot({
        traderBotId: botId,
        apiKeyId,
        alias,
      });

      if (response.success) {
        setSuccessMessage(`¡Bot "${alias}" comprado exitosamente!`);
        setSelectedBot(null);
        refetch();

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (err: any) {
      setPurchaseError(
        err.response?.data?.message || "Error al comprar el bot. Intenta nuevamente."
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleModalCancel = () => {
    setSelectedBot(null);
    setPurchaseError(null);
  };

  return (
    <div className="marketplace-page">
      <div className="page-header">
        <h1>Marketplace de Bots</h1>
        <p className="subtitle">Descubre y adquiere bots de trading profesionales</p>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="retry-btn" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando bots disponibles...</p>
        </div>
      ) : bots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>No hay bots disponibles</h3>
          <p>Actualmente no hay bots de trading disponibles en el marketplace.</p>
        </div>
      ) : (
        <div className="bots-grid">
          {bots.map((bot) => (
            <BotMarketplaceCard
              key={bot.id}
              bot={bot}
              onBuy={handleBuyClick}
              loading={purchasing}
            />
          ))}
        </div>
      )}

      {selectedBot && (
        <PurchaseModal
          bot={selectedBot}
          apiKeys={apiKeys}
          onConfirm={handlePurchaseConfirm}
          onCancel={handleModalCancel}
          loading={purchasing}
        />
      )}

      {purchaseError && selectedBot && (
        <div className="modal-overlay" onClick={handleModalCancel}>
          <div className="error-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Error en la compra</h3>
            <p>{purchaseError}</p>
            <button className="btn btn-primary" onClick={handleModalCancel}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
