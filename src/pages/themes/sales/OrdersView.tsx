/**
 * OrdersView - Manage orders
 */

export const OrdersView = () => {
  const mockOrders = [
    { id: 1, client: 'Juan Pérez', total: 1234.50, status: 'completed' },
    { id: 2, client: 'María García', total: 890.00, status: 'pending' },
    { id: 3, client: 'Carlos López', total: 2150.75, status: 'processing' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Completado</span>;
      case 'pending':
        return <span className="badge badge-warning">Pendiente</span>;
      case 'processing':
        return <span className="badge badge-info">Procesando</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="theme-page">
      <div className="flex-between mb-lg">
        <h2>Órdenes de Venta</h2>
        <button className="btn btn-primary">+ Nueva Orden</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Cliente</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>#{order.id}</td>
                <td style={{ padding: '1rem' }}>{order.client}</td>
                <td style={{ padding: '1rem' }}>${order.total.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>{getStatusBadge(order.status)}</td>
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
