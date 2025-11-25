import { useState, useEffect } from 'react';
import { authAPI, type DiscordLinkCodeResponse } from '../services/api';
import './DiscordLinkCard.scss';

interface DiscordLinkCardProps {
  onLinked?: () => void;
}

export const DiscordLinkCard = ({ onLinked }: DiscordLinkCardProps) => {
  const [linkCode, setLinkCode] = useState<DiscordLinkCodeResponse | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  const generateCode = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.generateLinkCode();
      setLinkCode(response);
      setExpiresIn(response.expiresIn);
      setPolling(true); // Iniciar polling para detectar vinculación automática
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al generar el código';
      setError(errorMessage);
      console.error('Error generating link code:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = async () => {
    if (linkCode) {
      try {
        await navigator.clipboard.writeText(linkCode.code);
      } catch (err) {
        console.error('Error copying code:', err);
      }
    }
  };

  // Countdown timer
  useEffect(() => {
    if (expiresIn === null || expiresIn <= 0) return;

    const interval = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          setLinkCode(null);
          setPolling(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [linkCode]);

  // Polling para detectar vinculación automática
  useEffect(() => {
    if (!polling) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await authAPI.getLinkStatus();
        if (status.hasBot) {
          setPolling(false);
          setLinkCode(null);
          onLinked?.();
        }
      } catch (err) {
        console.error('Error polling link status:', err);
      }
    }, 5000); // Cada 5 segundos

    return () => clearInterval(pollInterval);
  }, [polling, onLinked]);

  return (
    <div className="discord-link-card">
      <div className="card-header">
        <h3>Vincular Bot de Discord</h3>
        <p>Vincula tu cuenta para usar comandos del bot en Discord</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!linkCode ? (
        <div className="card-content">
          <div className="info-box">
            <h4>¿Por qué vincular el bot?</h4>
            <ul>
              <li>Usa comandos de trading desde Discord</li>
              <li>Recibe notificaciones de tus bots</li>
              <li>Gestiona estrategias con comandos simples</li>
            </ul>
          </div>

          <button
            className="btn btn-primary btn-large"
            onClick={generateCode}
            disabled={loading}
          >
            {loading ? 'Generando...' : 'Generar Código'}
          </button>
        </div>
      ) : (
        <div className="card-content">
          <div className="code-display">
            <div className="code-card">
              <h4>Tu Código de Vinculación</h4>
              <div className="code-value">{linkCode.code}</div>
              <button
                className="btn btn-secondary"
                onClick={handleCopyCode}
              >
                📋 Copiar Código
              </button>
              {expiresIn !== null && (
                <div className="expiry-time">
                  Expira en: <strong>{formatTime(expiresIn)}</strong>
                </div>
              )}
            </div>

            <div className="instructions-visual">
              <div className="step">
                <span className="step-number">1</span>
                <p>Abre Discord</p>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <p>Ve al servidor del bot</p>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <p>Escribe: <code>/link {linkCode.code}</code></p>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <p>¡Listo! Tu cuenta está vinculada</p>
              </div>
            </div>

            <div className="note-box">
              <p>
                💡 <strong>Nota:</strong> El código expira en 10 minutos.
                Si expira, genera uno nuevo.
              </p>
              {polling && (
                <p className="polling-indicator">
                  🔄 Esperando vinculación...
                </p>
              )}
            </div>

            <button
              className="btn btn-outline"
              onClick={generateCode}
              disabled={loading}
            >
              Generar Nuevo Código
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
