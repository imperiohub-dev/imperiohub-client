/**
 * ClientsView - Manage clients with responsive table
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
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Órdenes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map((client) => (
                <tr key={client.id}>
                  <td data-label="Nombre">{client.name}</td>
                  <td data-label="Email">{client.email}</td>
                  <td data-label="Órdenes">
                    <span className="table-status status-info">{client.orders}</span>
                  </td>
                  <td data-label="Acciones">
                    <div className="table-actions">
                      <button className="btn btn-sm btn-ghost">Ver</button>
                      <button className="btn btn-sm btn-ghost">Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
