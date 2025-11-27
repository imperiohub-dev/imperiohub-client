import { useState } from "react";
import { useForm } from "react-hook-form";
import type {
  UserTraderBot,
  ApiKey,
  BotConfigurationFormData,
  TradingInstanceFormData,
  TradingInstance,
} from "../../types/trading";
import { tradingAPI } from "../../services/api";
import "./index.scss";

interface BotConfigStepperProps {
  bot: UserTraderBot;
  apiKeys: ApiKey[];
  onClose: () => void;
  onSuccess: () => void;
}

export const BotConfigStepper = ({ bot, apiKeys, onClose, onSuccess }: BotConfigStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instances, setInstances] = useState<TradingInstance[]>([]);

  // Step 1: Basic Config
  const step1Form = useForm({
    defaultValues: {
      alias: bot.alias || bot.traderBot?.name || "",
      apiKeyId: bot.apiKeyId || "",
      isActive: bot.isActive || false,
    },
  });

  // Step 2: Trading Config
  const step2Form = useForm<BotConfigurationFormData>({
    defaultValues: {
      portfolio: bot.traderBotConfiguration?.portfolio || "1000",
      perTradePercent: bot.traderBotConfiguration?.perTradePercent || "2",
      maxAmountPerTrade: bot.traderBotConfiguration?.maxAmountPerTrade || "100",
      maxDrawdownPercent: bot.traderBotConfiguration?.maxDrawdownPercent || "10",
      profitTargetRatio: bot.traderBotConfiguration?.profitTargetRatio || "2.5",
      maxLeverage: bot.traderBotConfiguration?.maxLeverage || "10",
    },
  });

  // Step 3: Trading Instances
  const step3Form = useForm<TradingInstanceFormData>({
    defaultValues: {
      coin: "BTC",
      stableCoin: "USDT",
      intervals: [],
    },
  });

  const handleStep1Submit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      await tradingAPI.updateUserBot(bot.id, {
        alias: data.alias,
        apiKeyId: data.apiKeyId,
        isActive: data.isActive,
      });
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar configuración básica");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (data: BotConfigurationFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (bot.traderBotConfiguration) {
        await tradingAPI.updateBotConfiguration(bot.id, data);
      } else {
        await tradingAPI.createBotConfiguration(bot.id, data);
      }

      // Load existing instances
      const response = await tradingAPI.getTradingInstances(bot.id);
      if (response.success && response.data) {
        setInstances(response.data);
      }

      setCurrentStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar configuración de trading");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3AddInstance = async (data: TradingInstanceFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await tradingAPI.createTradingInstance(bot.id, data);
      if (response.success && response.data) {
        setInstances([...instances, response.data]);
        step3Form.reset();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al agregar instancia de trading");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    if (!confirm("¿Eliminar esta instancia de trading?")) return;

    try {
      await tradingAPI.deleteTradingInstance(bot.id, instanceId);
      setInstances(instances.filter((i) => i.id !== instanceId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar instancia");
    }
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  const intervals = ["1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"];

  return (
    <div className="bot-config-stepper">
      <div className="stepper-header">
        <h2>Configurar Bot: {bot.alias || bot.traderBot?.name}</h2>
        <button className="close-btn" onClick={onClose} disabled={loading}>
          ✕
        </button>
      </div>

      <div className="stepper-progress">
        <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Básico</span>
        </div>
        <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Trading</span>
        </div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Pares</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="stepper-content">
        {currentStep === 1 && (
          <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="step-form">
            <h3>Configuración Básica</h3>

            <div className="form-group">
              <label>Alias del Bot</label>
              <input
                type="text"
                {...step1Form.register("alias", { required: true })}
                placeholder="Mi Bot BTC"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>API Key</label>
              <select {...step1Form.register("apiKeyId", { required: true })} disabled={loading}>
                <option value="">Seleccionar API Key</option>
                {apiKeys.map((key) => (
                  <option key={key.id} value={key.id}>
                    {key.broker} - {key.type} ({key.apiKey.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" {...step1Form.register("isActive")} disabled={loading} />
                <span>Activar bot</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Siguiente"}
              </button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="step-form">
            <h3>Configuración de Trading</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Portfolio (Capital)</label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("portfolio", {
                    required: true,
                    min: { value: 0, message: "Debe ser mayor a 0" },
                  })}
                  placeholder="1000.00"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>% por Operación</label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("perTradePercent", {
                    required: true,
                    min: 0,
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  placeholder="2.00"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Monto Máximo por Trade</label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("maxAmountPerTrade", { required: true, min: 0 })}
                  placeholder="100.00"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Drawdown Máximo (%)</label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("maxDrawdownPercent", {
                    required: true,
                    min: 0,
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  placeholder="10.00"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Profit Target Ratio</label>
                <input
                  type="number"
                  step="0.1"
                  {...step2Form.register("profitTargetRatio", { required: true, min: 0 })}
                  placeholder="2.5"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Apalancamiento Máximo</label>
                <input
                  type="number"
                  step="1"
                  {...step2Form.register("maxLeverage", {
                    required: true,
                    min: { value: 1, message: "Mínimo 1x" },
                    max: { value: 125, message: "Máximo 125x" },
                  })}
                  placeholder="10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCurrentStep(1)}
                disabled={loading}
              >
                Atrás
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Siguiente"}
              </button>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <div className="step-form">
            <h3>Pares de Trading</h3>

            <form onSubmit={step3Form.handleSubmit(handleStep3AddInstance)} className="instance-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Moneda</label>
                  <input
                    type="text"
                    {...step3Form.register("coin", { required: true })}
                    placeholder="BTC"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Stablecoin</label>
                  <input
                    type="text"
                    {...step3Form.register("stableCoin")}
                    placeholder="USDT"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Intervalos</label>
                <div className="intervals-grid">
                  {intervals.map((interval) => (
                    <label key={interval} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={interval}
                        {...step3Form.register("intervals", { required: true })}
                        disabled={loading}
                      />
                      <span>{interval}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-secondary" disabled={loading}>
                {loading ? "Agregando..." : "+ Agregar Par"}
              </button>
            </form>

            {instances.length > 0 && (
              <div className="instances-list">
                <h4>Pares Configurados</h4>
                {instances.map((instance) => (
                  <div key={instance.id} className="instance-item">
                    <div className="instance-info">
                      <strong>{instance.symbol}</strong>
                      <span className="intervals">{instance.intervals.join(", ")}</span>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteInstance(instance.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCurrentStep(2)}
                disabled={loading}
              >
                Atrás
              </button>
              <button type="button" className="btn btn-primary" onClick={handleFinish}>
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
