import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
  UserTraderBot,
  ApiKey,
  BotConfigurationFormData,
  TradingInstanceFormData,
  TradingInstance,
  UserTraderBotConfiguration,
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
  const [fullConfig, setFullConfig] = useState<UserTraderBotConfiguration | null>(null);

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

  const loadFullConfiguration = async () => {
    if (!bot.traderBotConfiguration?.id) return;

    try {
      const response = await tradingAPI.getBotConfiguration(bot.id);
      if (response.success && response.data) {
        setFullConfig(response.data);
      }
    } catch (err: any) {
      console.error("Error loading full configuration:", err);
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

      // Reload configuration with processed values
      await loadFullConfiguration();

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

  // Load full configuration when entering step 2
  useEffect(() => {
    if (currentStep === 2 && bot.traderBotConfiguration?.id) {
      loadFullConfiguration();
    }
  }, [currentStep, bot.traderBotConfiguration?.id]);

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

            {bot.traderBot && (
              <div className="bot-type-info">
                <p className="info-label">Tipo de Mercado del Bot:</p>
                <span className="bot-market-type">{bot.traderBot.marketType}</span>
                <p className="info-hint">Asegúrate de seleccionar una API Key del mismo tipo</p>
              </div>
            )}

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
                    {bot.traderBot && key.type !== bot.traderBot.marketType && " ⚠️ Tipo no coincide"}
                  </option>
                ))}
              </select>
              {bot.traderBot && step1Form.watch("apiKeyId") && (() => {
                const selectedKey = apiKeys.find(k => k.id === step1Form.watch("apiKeyId"));
                return selectedKey && selectedKey.type !== bot.traderBot.marketType && (
                  <div className="api-key-mismatch-warning">
                    ⚠️ La API Key seleccionada es de tipo <strong>{selectedKey.type}</strong>,
                    pero este bot requiere <strong>{bot.traderBot.marketType}</strong>
                  </div>
                );
              })()}
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
            <h3>Configuración de Gestión de Riesgo</h3>

            <div className="config-explanation">
              <p className="info-text">
                Configura cómo el bot gestionará tu capital. Estos valores son porcentajes y límites que se aplicarán sobre tu balance real de Binance.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Portfolio (% del Balance)
                  <span className="tooltip-icon" title="Porcentaje de tu balance total de Binance que quieres usar para trading">ⓘ</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("portfolio", {
                    required: true,
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  placeholder="10"
                  disabled={loading}
                />
                <small className="field-help">
                  Ejemplo: Si tienes 100,000 USDT y pones 10%, el bot operará con 10,000 USDT
                </small>
              </div>

              <div className="form-group">
                <label>
                  Riesgo por Operación (%)
                  <span className="tooltip-icon" title="Porcentaje del portfolio que arriesgarás en cada trade">ⓘ</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("perTradePercent", {
                    required: true,
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  placeholder="1"
                  disabled={loading}
                />
                <small className="field-help">
                  Ejemplo: Con portfolio de 10,000 USDT y 1%, arriesgarás 100 USDT por trade
                </small>
              </div>

              <div className="form-group">
                <label>
                  Monto Máximo por Trade (USDT)
                  <span className="tooltip-icon" title="Límite absoluto en USDT que el bot puede invertir en una sola operación">ⓘ</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("maxAmountPerTrade", { required: true, min: { value: 1, message: "Debe ser mayor a 0" } })}
                  placeholder="500"
                  disabled={loading}
                />
                <small className="field-help">
                  Protección: El bot nunca invertirá más de este monto por operación, sin importar el cálculo de riesgo
                </small>
              </div>

              <div className="form-group">
                <label>
                  Drawdown Máximo (%)
                  <span className="tooltip-icon" title="Pérdida máxima tolerada antes de que el bot se detenga automáticamente">ⓘ</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...step2Form.register("maxDrawdownPercent", {
                    required: true,
                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                    max: { value: 100, message: "Máximo 100%" },
                  })}
                  placeholder="10"
                  disabled={loading}
                />
                <small className="field-help">
                  Ejemplo: Con 100,000 USDT y 10%, el bot se detendrá si pierdes 10,000 USDT
                </small>
              </div>

              <div className="form-group">
                <label>
                  Ratio Ganancia/Riesgo
                  <span className="tooltip-icon" title="Cuánto quieres ganar por cada unidad que arriesgas">ⓘ</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...step2Form.register("profitTargetRatio", { required: true, min: { value: 0.1, message: "Debe ser mayor a 0" } })}
                  placeholder="2"
                  disabled={loading}
                />
                <small className="field-help">
                  Ejemplo: Con ratio 2, si arriesgas 100 USDT, buscarás ganar 200 USDT
                </small>
              </div>

              <div className="form-group">
                <label>
                  Apalancamiento Máximo
                  <span className="tooltip-icon" title="Multiplicador máximo del capital (solo para futuros)">ⓘ</span>
                </label>
                <input
                  type="number"
                  step="1"
                  {...step2Form.register("maxLeverage", {
                    required: true,
                    min: { value: 1, message: "Mínimo 1x" },
                    max: { value: 125, message: "Máximo 125x" },
                  })}
                  placeholder="5"
                  disabled={loading}
                />
                <small className="field-help">
                  Recomendado: 5x-10x para principiantes. Mayor apalancamiento = mayor riesgo
                </small>
              </div>
            </div>

            <div className="config-summary">
              <h4>Resumen de Configuración</h4>
              <p className="summary-text">
                Los valores se calcularán automáticamente cuando conectes tu API de Binance.
                El bot consultará tu balance real y aplicará estos porcentajes para determinar:
              </p>
              <ul className="summary-list">
                <li>Capital asignado al bot (Portfolio)</li>
                <li>Riesgo efectivo por operación</li>
                <li>Límite de pérdidas totales (Drawdown)</li>
              </ul>
            </div>

            {fullConfig?.processed && (
              <div className="processed-values">
                <h4>Valores Calculados (Con tu Balance Real)</h4>
                <div className="processed-grid">
                  <div className="processed-item">
                    <span className="processed-label">Balance USDT:</span>
                    <span className="processed-value">
                      {fullConfig.processed.usdtBalance.toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="processed-item">
                    <span className="processed-label">Capital del Bot:</span>
                    <span className="processed-value">
                      {fullConfig.processed.portfolio.toFixed(2)} USDT
                    </span>
                    {fullConfig.formulas?.portfolioCalculation && (
                      <small className="formula-text">{fullConfig.formulas.portfolioCalculation}</small>
                    )}
                  </div>
                  <div className="processed-item">
                    <span className="processed-label">Riesgo por Trade:</span>
                    <span className="processed-value">
                      {fullConfig.processed.riskPerTrade.toFixed(2)} USDT
                    </span>
                    {fullConfig.formulas?.riskPerTradeCalculation && (
                      <small className="formula-text">{fullConfig.formulas.riskPerTradeCalculation}</small>
                    )}
                  </div>
                  <div className="processed-item">
                    <span className="processed-label">Riesgo Efectivo:</span>
                    <span className="processed-value">
                      {fullConfig.processed.effectiveRiskPerTrade.toFixed(2)} USDT
                    </span>
                    <small className="formula-text">
                      Limitado por máximo {fullConfig.processed.maxAmountPerTrade.toFixed(2)} USDT
                    </small>
                  </div>
                  <div className="processed-item">
                    <span className="processed-label">Drawdown Máximo:</span>
                    <span className="processed-value">
                      {fullConfig.processed.maxDrawdownPercent.toFixed(2)} USDT
                    </span>
                    {fullConfig.formulas?.maxDrawdownCalculation && (
                      <small className="formula-text">{fullConfig.formulas.maxDrawdownCalculation}</small>
                    )}
                  </div>
                </div>
              </div>
            )}

            {fullConfig?.processedError && (
              <div className="processed-error">
                <h4>⚠️ Error en Configuración</h4>
                <p className="error-message">{fullConfig.processedError.message}</p>
                {fullConfig.processedError.code === "API_KEY_NOT_CONFIGURED" && (
                  <p className="error-hint">
                    Por favor, configura una API Key de Binance en el Paso 1 para ver los valores calculados.
                  </p>
                )}
                {fullConfig.processedError.message.includes("No se encontraron credenciales") && bot.traderBot && (
                  <div className="error-hint">
                    <p><strong>Este bot requiere una API Key de tipo: {bot.traderBot.marketType}</strong></p>
                    <p>Ve al Paso 1 y asegúrate de seleccionar una API Key que coincida con el tipo de mercado del bot.</p>
                    {bot.apiKey && bot.apiKey.type !== bot.traderBot.marketType && (
                      <p className="mismatch-warning">
                        ⚠️ Actualmente tienes seleccionada una API Key de tipo <strong>{bot.apiKey.type}</strong>,
                        pero este bot necesita una de tipo <strong>{bot.traderBot.marketType}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

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
