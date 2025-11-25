import { useForm } from "react-hook-form";
import type { ApiKeyFormData, Broker, ApiKeyType } from "../../types/trading";
import "./index.module.scss";

interface ApiKeyFormProps {
  onSubmit: (data: ApiKeyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ApiKeyForm = ({ onSubmit, onCancel, loading }: ApiKeyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApiKeyFormData>({
    defaultValues: {
      broker: "BINANCE",
      type: "FUTURES",
      apiKey: "",
      apiSecret: "",
    },
  });

  const brokers: Broker[] = ["BINANCE"];
  const types: ApiKeyType[] = ["SPOT", "MARGIN", "FUTURES", "COPY_TRADING_SPOT", "COPY_TRADING_FUTURES"];

  const getTypeLabel = (type: ApiKeyType) => {
    const labels: Record<ApiKeyType, string> = {
      SPOT: "Spot",
      MARGIN: "Margin",
      FUTURES: "Futuros",
      COPY_TRADING_SPOT: "Copy Trading Spot",
      COPY_TRADING_FUTURES: "Copy Trading Futuros",
    };
    return labels[type];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="api-key-form">
      <div className="form-group">
        <label htmlFor="broker">Broker</label>
        <select
          id="broker"
          {...register("broker", { required: "Broker es requerido" })}
          disabled={loading}
        >
          {brokers.map((broker) => (
            <option key={broker} value={broker}>
              {broker}
            </option>
          ))}
        </select>
        {errors.broker && <span className="error">{errors.broker.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="type">Tipo de API Key</label>
        <select
          id="type"
          {...register("type", { required: "Tipo es requerido" })}
          disabled={loading}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {getTypeLabel(type)}
            </option>
          ))}
        </select>
        {errors.type && <span className="error">{errors.type.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <input
          id="apiKey"
          type="text"
          {...register("apiKey", {
            required: "API Key es requerida",
            minLength: { value: 10, message: "API Key muy corta" },
          })}
          placeholder="Ingresa tu API Key"
          disabled={loading}
        />
        {errors.apiKey && <span className="error">{errors.apiKey.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="apiSecret">API Secret</label>
        <input
          id="apiSecret"
          type="password"
          {...register("apiSecret", {
            required: "API Secret es requerido",
            minLength: { value: 10, message: "API Secret muy corto" },
          })}
          placeholder="Ingresa tu API Secret"
          disabled={loading}
        />
        {errors.apiSecret && <span className="error">{errors.apiSecret.message}</span>}
        <p className="helper-text">
          El secret se almacenará de forma segura y encriptada
        </p>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar API Key"}
        </button>
      </div>
    </form>
  );
};
