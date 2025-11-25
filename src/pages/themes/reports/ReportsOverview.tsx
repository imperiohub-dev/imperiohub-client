/**
 * ReportsOverview - Reports overview page
 */

export const ReportsOverview = () => {
  const reports = [
    { name: 'Reporte de Ventas', description: 'Análisis detallado de ventas', icon: '📊' },
    { name: 'Reporte de Inventario', description: 'Estado del inventario', icon: '📦' },
    { name: 'Reporte Financiero', description: 'Información financiera', icon: '💰' },
    { name: 'Reporte de Clientes', description: 'Análisis de clientes', icon: '👥' },
  ];

  return (
    <div className="theme-page">
      <h2>Reportes</h2>
      <p className="mb-lg">Genera y visualiza reportes de tu negocio.</p>

      <div className="grid-2">
        {reports.map((report, index) => (
          <div key={index} className="card card-interactive">
            <div className="flex-between">
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>{report.icon}</div>
                <h3 className="h4">{report.name}</h3>
                <p className="text-secondary text-small">{report.description}</p>
              </div>
              <button className="btn btn-outline">Ver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
