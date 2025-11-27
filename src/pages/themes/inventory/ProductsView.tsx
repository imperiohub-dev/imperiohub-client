/**
 * ProductsView - Manage products with responsive table
 */

export const ProductsView = () => {
  const mockProducts = [
    { id: 1, name: 'Producto A', sku: 'SKU-001', stock: 45, price: 29.99 },
    { id: 2, name: 'Producto B', sku: 'SKU-002', stock: 12, price: 49.99 },
    { id: 3, name: 'Producto C', sku: 'SKU-003', stock: 78, price: 19.99 },
  ];

  const getStockStatus = (stock: number) => {
    if (stock < 20) return 'status-warning';
    if (stock < 50) return 'status-success';
    return 'status-success';
  };

  return (
    <div className="theme-page">
      <div className="flex-between mb-lg">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-primary">+ Nuevo Producto</button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr key={product.id}>
                  <td data-label="Producto">{product.name}</td>
                  <td data-label="SKU">{product.sku}</td>
                  <td data-label="Stock">
                    <span className={`table-status ${getStockStatus(product.stock)}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td data-label="Precio">${product.price.toFixed(2)}</td>
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
