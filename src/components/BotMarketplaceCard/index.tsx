import type { TradingBot } from "../../types/trading";
import "./index.module.scss";

interface BotMarketplaceCardProps {
  bot: TradingBot;
  onBuy: (bot: TradingBot) => void;
  loading?: boolean;
}

export const BotMarketplaceCard = ({ bot, onBuy, loading }: BotMarketplaceCardProps) => {
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

  const getPositionSideLabel = (side: string) => {
    return side === "LONG" ? "Long" : "Short";
  };

  const formatPrice = (price?: string) => {
    if (!price) return "Gratis";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bot-marketplace-card">
      <div className="card-header">
        <h3>{bot.name}</h3>
        <div className="badges">
          <span className="badge badge-market">{getMarketTypeLabel(bot.marketType)}</span>
          <span className={`badge badge-position ${bot.positionSide.toLowerCase()}`}>
            {getPositionSideLabel(bot.positionSide)}
          </span>
        </div>
      </div>

      <div className="card-body">
        <p className="description">{bot.description}</p>

        {bot.backtesting && (
          <div className="backtesting-stats">
            <h4>Backtesting</h4>
            <div className="stats-grid">
              {bot.backtesting.winRate !== undefined && (
                <div className="stat">
                  <span className="stat-label">Win Rate</span>
                  <span className="stat-value">{bot.backtesting.winRate.toFixed(1)}%</span>
                </div>
              )}
              {bot.backtesting.profitFactor !== undefined && (
                <div className="stat">
                  <span className="stat-label">Profit Factor</span>
                  <span className="stat-value">{bot.backtesting.profitFactor.toFixed(2)}</span>
                </div>
              )}
              {bot.backtesting.sharpeRatio !== undefined && (
                <div className="stat">
                  <span className="stat-label">Sharpe Ratio</span>
                  <span className="stat-value">{bot.backtesting.sharpeRatio.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="pricing">
          <span className="price">{formatPrice(bot.product?.price)}</span>
          {bot.product?.vipPrice && (
            <span className="vip-price">VIP: {formatPrice(bot.product.vipPrice)}</span>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => onBuy(bot)}
          disabled={loading}
        >
          {loading ? "Comprando..." : "Comprar Bot"}
        </button>
      </div>
    </div>
  );
};
