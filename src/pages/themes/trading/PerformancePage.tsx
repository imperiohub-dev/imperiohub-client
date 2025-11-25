import { useState, useEffect, useMemo } from "react";
import { useMyBots, useTradingInstances, useOperations } from "../../../hooks/useTradingBot";
import type { UserTraderBot, TradingInstance } from "../../../types/trading";
import "./PerformancePage.scss";

export function PerformancePage() {
  const { bots, loading: botsLoading } = useMyBots(true);
  const [selectedBot, setSelectedBot] = useState<UserTraderBot | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<TradingInstance | null>(null);

  const { instances, loading: instancesLoading } = useTradingInstances(selectedBot?.id || null);
  const {
    operations,
    loading: operationsLoading,
    error: operationsError,
  } = useOperations(selectedBot?.id || null, selectedInstance?.id || null);

  // Auto-select first bot and instance
  useEffect(() => {
    if (bots.length > 0 && !selectedBot) {
      setSelectedBot(bots[0]);
    }
  }, [bots, selectedBot]);

  useEffect(() => {
    if (instances.length > 0 && !selectedInstance) {
      setSelectedInstance(instances[0]);
    }
  }, [instances, selectedInstance]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalOperations = operations.length;
    const openOperations = operations.filter((op) => op.status === "OPEN").length;
    const closedOperations = operations.filter((op) => op.status === "CLOSE");

    const totalPnL = closedOperations.reduce((sum, op) => {
      const pnl = parseFloat(op.trade?.pnl || "0");
      return sum + pnl;
    }, 0);

    return {
      totalOperations,
      openOperations,
      closedOperations: closedOperations.length,
      totalPnL,
    };
  }, [operations]);

  const formatPnL = (pnl: string | undefined) => {
    if (!pnl) return "-";
    const value = parseFloat(pnl);
    const formatted = value.toFixed(2);
    return value >= 0 ? `+$${formatted}` : `-$${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (percent: string | undefined) => {
    if (!percent) return "-";
    const value = parseFloat(percent);
    const formatted = value.toFixed(2);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return "-";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="performance-page">
      <div className="page-header">
        <div>
          <h1>Rendimiento</h1>
          <p className="subtitle">Monitorea el rendimiento de tus bots de trading</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="selectors">
        <div className="selector-group">
          <label>Bot</label>
          <select
            value={selectedBot?.id || ""}
            onChange={(e) => {
              const bot = bots.find((b) => b.id === e.target.value);
              setSelectedBot(bot || null);
              setSelectedInstance(null);
            }}
            disabled={botsLoading}
          >
            {bots.length === 0 ? (
              <option value="">No tienes bots</option>
            ) : (
              bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.alias || bot.traderBot?.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="selector-group">
          <label>Par de Trading</label>
          <select
            value={selectedInstance?.id || ""}
            onChange={(e) => {
              const instance = instances.find((i) => i.id === e.target.value);
              setSelectedInstance(instance || null);
            }}
            disabled={instancesLoading || !selectedBot}
          >
            {instances.length === 0 ? (
              <option value="">No hay pares configurados</option>
            ) : (
              instances.map((instance) => (
                <option key={instance.id} value={instance.id}>
                  {instance.symbol} ({instance.intervals.join(", ")})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      {selectedBot && selectedInstance && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <span className="metric-label">Total Operaciones</span>
              <span className="metric-value">{metrics.totalOperations}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <span className="metric-label">Operaciones Abiertas</span>
              <span className="metric-value">{metrics.openOperations}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <span className="metric-label">Operaciones Cerradas</span>
              <span className="metric-value">{metrics.closedOperations}</span>
            </div>
          </div>

          <div className="metric-card highlight">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <span className="metric-label">PnL Total</span>
              <span className={`metric-value ${metrics.totalPnL >= 0 ? "positive" : "negative"}`}>
                {formatPnL(metrics.totalPnL.toString())}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Operations Table */}
      {operationsError && (
        <div className="alert alert-error">{operationsError}</div>
      )}

      {operationsLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando operaciones...</p>
        </div>
      ) : !selectedBot || !selectedInstance ? (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h3>Selecciona un bot y un par</h3>
          <p>Elige un bot y un par de trading para ver las operaciones</p>
        </div>
      ) : operations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No hay operaciones</h3>
          <p>Este par aún no tiene operaciones registradas</p>
        </div>
      ) : (
        <div className="operations-section">
          <h3>Historial de Operaciones</h3>
          <div className="table-container">
            <table className="operations-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Interval</th>
                  <th>Estado</th>
                  <th>Precio Entrada</th>
                  <th>Cantidad</th>
                  <th>Precio Salida</th>
                  <th>PnL</th>
                  <th>PnL %</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op.id} className={`status-${op.status.toLowerCase()}`}>
                    <td className="symbol">{op.symbol}</td>
                    <td>{op.interval}</td>
                    <td>
                      <span className={`status-badge ${op.status.toLowerCase()}`}>
                        {op.status === "OPEN" ? "Abierta" : "Cerrada"}
                      </span>
                    </td>
                    <td>{formatPrice(op.open?.price)}</td>
                    <td>{op.open?.quantity || "-"}</td>
                    <td>{op.trade ? formatPrice(op.trade.exitPrice) : "-"}</td>
                    <td className={op.trade && parseFloat(op.trade.pnl) >= 0 ? "positive" : "negative"}>
                      {formatPnL(op.trade?.pnl)}
                    </td>
                    <td className={op.trade && parseFloat(op.trade.pnlPercent) >= 0 ? "positive" : "negative"}>
                      {formatPercent(op.trade?.pnlPercent)}
                    </td>
                    <td className="date">{formatDate(op.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
