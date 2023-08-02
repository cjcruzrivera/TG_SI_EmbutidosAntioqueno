const roles = {
  Administrador: [
    "dashboardVentasMes",
    "dashboardComprasMes",
    "dashboardVentasDia",
    "dashboardProducciones",
    "dashboardOrdenesCompra",
    "dashboardOrdenesTrabajo",
    "dashboardRemisiones",
    "dashboardComprasPendientes",
  ],
  "Secretaria Administrativa": [
    "dashboardVentasDia",
    "dashboardOrdenesCompra",
    "dashboardComprasPendientes",
  ],
  "Auxiliar Contable": [
    "dashboardVentasMes",
    "dashboardComprasMes",
    "dashboardVentasDia",
    "dashboardComprasPendientes",
  ],
  "Operario de Produccion": ["dashboardProducciones", "dashboardOrdenesTrabajo"],
  "Operario de Alistamiento": ["dashboardComprasPendientes"],
  "Operario de Ventas": ["dashboardVentasDia", "dashboardRemisiones"],
};

export default roles;
