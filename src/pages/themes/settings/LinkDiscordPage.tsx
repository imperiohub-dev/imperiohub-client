import { useState, useEffect } from 'react';
import { authAPI, type DiscordLinkCode, type DiscordLinkStatus } from '../../../services/api';
import './LinkDiscordPage.scss';

export function LinkDiscordPage() {
  const [linkStatus, setLinkStatus] = useState<DiscordLinkStatus | null>(null);
  const [linkCode, setLinkCode] = useState<DiscordLinkCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    loadLinkStatus();
  }, []);

  const loadLinkStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await authAPI.getLinkStatus();
      setLinkStatus(status);
    } catch (err) {
      setError('Error al cargar el estado de vinculación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setGenerating(true);
      setError(null);
      const response = await authAPI.generateLinkCode();
      setLinkCode(response.linkCode);
    } catch (err) {
      setError('Error al generar el código de vinculación');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUnlink = async () => {
    if (!confirm('¿Estás seguro de que deseas desvincular tu cuenta de Discord?')) {
      return;
    }

    try {
      setUnlinking(true);
      setError(null);
      await authAPI.unlinkDiscord();
      setLinkCode(null);
      await loadLinkStatus();
    } catch (err) {
      setError('Error al desvincular Discord');
      console.error(err);
    } finally {
      setUnlinking(false);
    }
  };

  const handleCopyCode = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode.code);
    }
  };

  const getRemainingTime = () => {
    if (!linkCode) return null;

    const now = new Date().getTime();
    const expiresAt = new Date(linkCode.expiresAt).getTime();
    const remaining = Math.max(0, expiresAt - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  useEffect(() => {
    if (linkCode) {
      const interval = setInterval(() => {
        const time = getRemainingTime();
        setRemainingTime(time);

        if (time === '0:00') {
          setLinkCode(null);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [linkCode]);

  if (loading) {
    return (
      <div className="link-discord-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="link-discord-page">
      <div className="page-header">
        <h1>Vincular Discord</h1>
        <p className="subtitle">
          Conecta tu cuenta de Discord para recibir notificaciones y usar comandos desde Discord
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {linkStatus?.isLinked ? (
        <div className="linked-section">
          <div className="status-card linked">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h2>Cuenta Vinculada</h2>
              <p>Tu cuenta de Discord está vinculada exitosamente</p>
              {linkStatus.discordUsername && (
                <div className="discord-info">
                  <strong>Discord:</strong> {linkStatus.discordUsername}
                  {linkStatus.discordId && (
                    <span className="discord-id"> (ID: {linkStatus.discordId})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="actions">
            <button
              className="btn btn-danger"
              onClick={handleUnlink}
              disabled={unlinking}
            >
              {unlinking ? 'Desvinculando...' : 'Desvincular Discord'}
            </button>
          </div>

          <div className="info-box">
            <h3>Comandos Disponibles</h3>
            <p>Ahora puedes usar estos comandos en Discord:</p>
            <ul>
              <li><code>/verify</code> - Verificar estado de vinculación</li>
              <li><code>/start &lt;bot_id&gt;</code> - Iniciar un bot de trading</li>
              <li><code>/stop &lt;bot_id&gt;</code> - Detener un bot</li>
              <li><code>/status &lt;bot_id&gt;</code> - Ver estado de un bot</li>
              <li><code>/my-bots</code> - Listar todos tus bots</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="unlinked-section">
          <div className="status-card unlinked">
            <div className="status-icon">❌</div>
            <div className="status-content">
              <h2>Cuenta No Vinculada</h2>
              <p>Tu cuenta de Discord no está vinculada a esta cuenta web</p>
            </div>
          </div>

          {!linkCode ? (
            <div className="instructions">
              <h3>Cómo vincular tu cuenta:</h3>
              <ol>
                <li>Haz clic en "Generar Código" abajo</li>
                <li>Copia el código de 6 dígitos</li>
                <li>Ve a Discord y usa el comando <code>/link &lt;código&gt;</code></li>
                <li>Tu cuenta quedará vinculada automáticamente</li>
              </ol>

              <button
                className="btn btn-primary btn-large"
                onClick={handleGenerateCode}
                disabled={generating}
              >
                {generating ? 'Generando...' : 'Generar Código'}
              </button>
            </div>
          ) : (
            <div className="code-display">
              <div className="code-card">
                <h3>Tu Código de Vinculación</h3>
                <div className="code-value">
                  {linkCode.code}
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handleCopyCode}
                >
                  📋 Copiar Código
                </button>
                {remainingTime && (
                  <div className="expiry-time">
                    Expira en: <strong>{remainingTime}</strong>
                  </div>
                )}
              </div>

              <div className="next-steps">
                <h4>Siguiente paso:</h4>
                <p>
                  Ve a Discord y ejecuta el comando:
                </p>
                <div className="command-example">
                  <code>/link {linkCode.code}</code>
                </div>
                <p className="note">
                  El código expira en 5 minutos. Si expira, genera uno nuevo.
                </p>
              </div>

              <button
                className="btn btn-outline"
                onClick={handleGenerateCode}
                disabled={generating}
              >
                Generar Nuevo Código
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
