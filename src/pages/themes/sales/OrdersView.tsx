/**
 * OrdersView - Manage orders with responsive table
 */

export const OrdersView = () => {
  const mockOrders = [
    { id: 1, client: 'Juan Pérez', total: 1234.50, status: 'completed' },
    { id: 2, client: 'María García', total: 890.00, status: 'pending' },
    { id: 3, client: 'Carlos López', total: 2150.75, status: 'processing' },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-success';
      case 'pending':
        return 'status-warning';
      case 'processing':
        return 'status-info';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      default:
        return status;
    }
  };

  return (
    <div className="theme-page">
      <div className="flex-between mb-lg">
        <h2>Órdenes de Venta</h2>
        <button className="btn btn-primary">+ Nueva Orden</button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id}>
                  <td data-label="ID">#{order.id}</td>
                  <td data-label="Cliente">{order.client}</td>
                  <td data-label="Total">${order.total.toFixed(2)}</td>
                  <td data-label="Estado">
                    <span className={`table-status ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
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
