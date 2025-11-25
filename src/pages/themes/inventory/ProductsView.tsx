/**
 * ProductsView - Manage products
 */

export const ProductsView = () => {
  const mockProducts = [
    { id: 1, name: 'Producto A', sku: 'SKU-001', stock: 45, price: 29.99 },
    { id: 2, name: 'Producto B', sku: 'SKU-002', stock: 12, price: 49.99 },
    { id: 3, name: 'Producto C', sku: 'SKU-003', stock: 78, price: 19.99 },
  ];

  return (
    <div className="theme-page">
      <div className="flex-between mb-lg">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-primary">+ Nuevo Producto</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Producto</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>SKU</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Precio</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>{product.sku}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${product.stock < 20 ? 'badge-warning' : 'badge-success'}`}>
                    {product.stock}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
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
