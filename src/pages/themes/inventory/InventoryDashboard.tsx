/**
 * InventoryDashboard - Inventory overview page
 */

export const InventoryDashboard = () => {
  return (
    <div className="theme-page">
      <h2>Dashboard de Inventario</h2>
      <p>Vista general del inventario y stock disponible.</p>

      <div className="grid-3 mt-lg">
        <div className="card">
          <h3 className="h4">Productos Totales</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem', fontWeight: 600 }}>342</p>
          <span className="badge badge-info">Activos</span>
        </div>

        <div className="card">
          <h3 className="h4">Bajo Stock</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem', fontWeight: 600 }}>23</p>
          <span className="badge badge-warning">Atención</span>
        </div>

        <div className="card">
          <h3 className="h4">Valor Total</h3>
          <p className="text-accent" style={{ fontSize: '2.4rem', fontWeight: 600 }}>$89,421</p>
          <span className="badge badge-success">+4.2%</span>
        </div>
      </div>
    </div>
  );
};
