import { useState } from 'react';
import { useDiscordLink } from '../../../hooks/useDiscordLink';
import { DiscordLinkCard } from '../../../components/DiscordLinkCard';
import { authAPI } from '../../../services/api';
import './LinkDiscordPage.scss';

export function LinkDiscordPage() {
  const { linkStatus, loading, error, refetch } = useDiscordLink();
  const [unlinking, setUnlinking] = useState(false);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);

  const handleUnlink = async () => {
    if (!confirm('¿Estás seguro de que deseas desvincular tu cuenta de Discord?')) {
      return;
    }

    try {
      setUnlinking(true);
      setUnlinkError(null);
      await authAPI.unlinkDiscord();
      await refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al desvincular Discord';
      setUnlinkError(errorMessage);
      console.error('Error unlinking Discord:', err);
    } finally {
      setUnlinking(false);
    }
  };

  const handleLinked = () => {
    refetch();
  };

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
        <h1>Cuenta de Discord</h1>
        <p className="subtitle">
          Gestiona la vinculación de tu cuenta de Discord para login web y comandos del bot
        </p>
      </div>

      {(error || unlinkError) && (
        <div className="alert alert-error">
          {error || unlinkError}
        </div>
      )}

      <div className="status-cards">
        {/* OAuth Status */}
        <div className="status-card">
          <div className="status-header">
            <h3>Login Web</h3>
            <div className={`status-badge ${linkStatus?.hasOAuth ? 'active' : 'inactive'}`}>
              {linkStatus?.hasOAuth ? '✅ Conectado' : '❌ No conectado'}
            </div>
          </div>
          <div className="status-content">
            {linkStatus?.hasOAuth ? (
              <div className="discord-info">
                <p><strong>Usuario:</strong> {linkStatus.discordUsername}</p>
                {linkStatus.discordDiscriminator && (
                  <p className="discriminator">#{linkStatus.discordDiscriminator}</p>
                )}
              </div>
            ) : (
              <p className="text-secondary">
                No has iniciado sesión con Discord OAuth.
                Usa el botón de login para conectar.
              </p>
            )}
          </div>
        </div>

        {/* Bot Status */}
        <div className="status-card">
          <div className="status-header">
            <h3>Discord Bot</h3>
            <div className={`status-badge ${linkStatus?.hasBot ? 'active' : 'inactive'}`}>
              {linkStatus?.hasBot ? '✅ Vinculado' : '❌ No vinculado'}
            </div>
          </div>
          <div className="status-content">
            {linkStatus?.hasBot ? (
              <div className="bot-info">
                <p className="success-text">
                  Tu cuenta está vinculada con el bot de Discord.
                  Puedes usar comandos en Discord.
                </p>
              </div>
            ) : (
              <p className="text-secondary">
                El bot de Discord no está vinculado a tu cuenta.
                Vincula el bot para usar comandos.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Show link card if bot is not linked */}
      {!linkStatus?.hasBot && <DiscordLinkCard onLinked={handleLinked} />}

      {/* Show unlink button and commands if bot is linked */}
      {linkStatus?.hasBot && (
        <>
          <div className="actions">
            <button
              className="btn btn-danger"
              onClick={handleUnlink}
              disabled={unlinking}
            >
              {unlinking ? 'Desvinculando...' : 'Desvincular Bot'}
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
        </>
      )}
    </div>
  );
}
