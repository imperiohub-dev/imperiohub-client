import { useLocation } from "react-router-dom";
import "./index.module.scss";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) return null;

  const breadcrumbLabels: Record<string, string> = {
    trading: "Trading",
    marketplace: "Marketplace",
    "my-bots": "Mis Bots",
    "api-keys": "API Keys",
    performance: "Rendimiento",
    sales: "Ventas",
    inventory: "Inventario",
    finance: "Finanzas",
    reports: "Reportes",
    settings: "Configuración",
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: { label: string; path: string }[] = [];
    let currentPath = "";

    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: breadcrumbLabels[segment] || segment,
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="breadcrumbs">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} className="breadcrumb-item">
          {index > 0 && <span className="separator">/</span>}
          <span className={index === breadcrumbs.length - 1 ? "active" : ""}>
            {crumb.label}
          </span>
        </span>
      ))}
    </nav>
  );
};
