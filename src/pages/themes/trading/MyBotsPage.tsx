import { useState } from "react";
import { useMyBots, useApiKeys } from "../../../hooks/useTradingBot";
import { tradingAPI } from "../../../services/api";
import { BotConfigStepper } from "../../../components/BotConfigStepper";
import type { UserTraderBot } from "../../../types/trading";
import "./MyBotsPage.scss";

export function MyBotsPage() {
  const { bots, loading, error, refetch } = useMyBots(true);
  const { apiKeys } = useApiKeys();
  const [selectedBot, setSelectedBot] = useState<UserTraderBot | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleToggleBot = async (bot: UserTraderBot) => {
    setToggling(bot.id);

    try {
      await tradingAPI.toggleBot(bot.id, !bot.isActive);
      setSuccessMessage(`Bot ${!bot.isActive ? "activado" : "desactivado"} correctamente`);
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al cambiar estado del bot");
    } finally {
      setToggling(null);
    }
  };

  const handleDeleteBot = async (bot: UserTraderBot) => {
    if (!confirm(`¿Eliminar el bot "${bot.alias || bot.traderBot?.name}"?`)) return;

    try {
      await tradingAPI.deleteUserBot(bot.id);
      setSuccessMessage("Bot eliminado correctamente");
      refetch();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al eliminar bot");
    }
  };

  const getMarketTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SPOT: "Spot",
      MARGIN: "Margin",
      FUTURES: "Futuros",
      COPY_TRADING_SPOT: "Copy Trading Spot",
      COPY_TRADING_FUTURES: "Copy Trading Futuros",
    };
    return labels[type] || type;
  };

  return (
    <div className="my-bots-page">
      <div className="page-header">
        <div>
          <h1>Mis Bots</h1>
          <p className="subtitle">Gestiona tus bots de trading</p>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
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
          <p>Cargando tus bots...</p>
        </div>
      ) : bots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>No tienes bots activos</h3>
          <p>Ve al Marketplace para adquirir tu primer bot de trading</p>
        </div>
      ) : (
        <div className="bots-list">
          {bots.map((bot) => (
            <div key={bot.id} className="bot-card">
              <div className="bot-header">
                <div className="bot-title">
                  <h3>{bot.alias || bot.traderBot?.name}</h3>
                  <div className="badges">
                    <span className={`status-badge ${bot.isActive ? "active" : "inactive"}`}>
                      {bot.isActive ? "Activo" : "Inactivo"}
                    </span>
                    {bot.traderBot && (
                      <>
                        <span className="badge">{getMarketTypeLabel(bot.traderBot.marketType)}</span>
                        <span className={`badge position-${bot.traderBot.positionSide.toLowerCase()}`}>
                          {bot.traderBot.positionSide}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bot-info">
                {bot.apiKey && (
                  <div className="info-item">
                    <span className="label">API Key:</span>
                    <span className="value">{bot.apiKey.broker} - {bot.apiKey.type}</span>
                  </div>
                )}
                {bot.traderBotConfiguration && (
                  <>
                    <div className="info-item">
                      <span className="label">Portfolio:</span>
                      <span className="value">{bot.traderBotConfiguration.portfolio}%</span>
                      <span className="sublabel">del balance total</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Riesgo/Trade:</span>
                      <span className="value">{bot.traderBotConfiguration.perTradePercent}%</span>
                      <span className="sublabel">del portfolio</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Máx. por Trade:</span>
                      <span className="value">{bot.traderBotConfiguration.maxAmountPerTrade} USDT</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Leverage:</span>
                      <span className="value">{bot.traderBotConfiguration.maxLeverage}x</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Pares:</span>
                      <span className="value">
                        {bot.traderBotConfiguration.tradingInstances?.length || 0}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="bot-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedBot(bot)}
                >
                  Configurar
                </button>
                <button
                  className={`btn ${bot.isActive ? "btn-warning" : "btn-success"}`}
                  onClick={() => handleToggleBot(bot)}
                  disabled={toggling === bot.id}
                >
                  {toggling === bot.id ? "..." : (bot.isActive ? "Desactivar" : "Activar")}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteBot(bot)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBot && (
        <div className="modal-overlay" onClick={() => setSelectedBot(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <BotConfigStepper
              bot={selectedBot}
              apiKeys={apiKeys}
              onClose={() => setSelectedBot(null)}
              onSuccess={() => {
                refetch();
                setSuccessMessage("Configuración guardada exitosamente");
                setTimeout(() => setSuccessMessage(null), 5000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
