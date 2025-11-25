/**
 * SalesDashboard - Sales overview page
 */

export const SalesDashboard = () => {
  return (
    <div className="theme-page">
      <h2>Dashboard de Ventas</h2>
      <p>Vista general de ventas y métricas clave.</p>

      <div className="grid-3 mt-lg">
        <div className="card">
          <h3 className="h4">Ventas Totales</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem', fontWeight: 600 }}>$45,231</p>
          <span className="badge badge-success">+12.5%</span>
        </div>

        <div className="card">
          <h3 className="h4">Órdenes</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem', fontWeight: 600 }}>1,234</p>
          <span className="badge badge-info">+8.2%</span>
        </div>

        <div className="card">
          <h3 className="h4">Clientes</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem', fontWeight: 600 }}>567</p>
          <span className="badge badge-warning">+5.1%</span>
        </div>
      </div>
    </div>
  );
};
