import { useAuthContext } from '../store/AuthContext';

export function DashboardPage() {
  const { user, logout } = useAuthContext();

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '1.5rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          margin: 0,
          color: '#1a202c'
        }}>
          ImperioHub Trading
        </h1>
        <button
          onClick={logout}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            background: '#e53e3e',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#c53030';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#e53e3e';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '2rem',
          color: '#1a202c',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '1rem'
        }}>
          Welcome, {user.username}!
        </h2>

        {/* User Profile Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
          background: '#f7fafc',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <img
            src={user.avatar}
            alt={user.username}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid #667eea',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              color: '#1a202c'
            }}>
              {user.username}
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <p style={{ margin: 0, color: '#4a5568' }}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={{ margin: 0, color: '#4a5568' }}>
                <strong>Discord ID:</strong> {user.discordId}
              </p>
              <p style={{ margin: 0, color: '#4a5568' }}>
                <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div style={{
          padding: '1.5rem',
          background: '#edf2f7',
          borderLeft: '4px solid #667eea',
          borderRadius: '4px'
        }}>
          <p style={{
            margin: 0,
            color: '#2d3748',
            fontSize: '0.95rem'
          }}>
            You are successfully authenticated with Discord OAuth2. Your session is secure and will remain active for 7 days.
          </p>
        </div>
      </div>
    </div>
  );
}
