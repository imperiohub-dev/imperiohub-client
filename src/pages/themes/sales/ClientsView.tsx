/**
 * ClientsView - Manage clients
 */

export const ClientsView = () => {
  const mockClients = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', orders: 12 },
    { id: 2, name: 'María García', email: 'maria@example.com', orders: 8 },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', orders: 15 },
  ];

  return (
    <div className="theme-page">
      <div className="flex-between mb-lg">
        <h2>Gestión de Clientes</h2>
        <button className="btn btn-primary">+ Nuevo Cliente</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Órdenes</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map((client) => (
              <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{client.name}</td>
                <td style={{ padding: '1rem' }}>{client.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-info">{client.orders}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn btn-sm btn-ghost">Ver</button>
                  <button className="btn btn-sm btn-ghost ml-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
