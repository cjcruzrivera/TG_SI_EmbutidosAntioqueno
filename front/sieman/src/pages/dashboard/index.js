/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMaterialUIController } from "context";
import roles from "./roles";
import formatMoney from "utils/formatMoney";

function Dashboard() {
  const [data, setData] = useState({});
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  useEffect(() => {
    axios
      .post("http://localhost:8000/api/dashboards/", {
        dashboards: roles[user.rol],
      })
      .then((data) => setData(data.data))
      .catch((err) => console.log(err));
    console.log(data);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {data.dashboardVentasMes && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/reporte-ventas">
                  <ComplexStatisticsCard
                    color="success"
                    icon="paid"
                    title="Ventas del Mes"
                    count={formatMoney(data.dashboardVentasMes.total_ventas)}
                    percentage={{
                      color: "info",
                      amount: data.dashboardVentasMes.cantidad_ventas,
                      label: " ventas registradas",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardComprasMes && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/compras">
                  <ComplexStatisticsCard
                    icon="receipt_long"
                    color="info"
                    title="Compras del Mes"
                    count={formatMoney(data.dashboardComprasMes.total_compras)}
                    percentage={{
                      color: "info",
                      amount: data.dashboardComprasMes.cantidad_compras,
                      label: " compras registradas",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardVentasDia && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/ventas">
                  <ComplexStatisticsCard
                    color="success"
                    icon="attach_money"
                    title="Ventas del Día"
                    count={formatMoney(data.dashboardVentasDia.total_ventas_hoy)}
                    percentage={{
                      color: "info",
                      amount: data.dashboardVentasDia.cantidad_ventas_hoy,
                      label: " ventas registradas",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardProducciones && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/producciones">
                  <ComplexStatisticsCard
                    color="warning"
                    icon="engineering"
                    title="Producciones"
                    count={data.dashboardProducciones.producciones_en_curso}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "En Curso",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardOrdenesCompra && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/ordenes-compra">
                  <ComplexStatisticsCard
                    color="info"
                    icon="shopping_cart"
                    title="Ordenes de Compra"
                    count={data.dashboardOrdenesCompra.ordenes_totales}
                    percentage={{
                      color:
                        data.dashboardOrdenesCompra.ordenes_pendientes != 0 ? "error" : "success",
                      amount: data.dashboardOrdenesCompra.ordenes_pendientes,
                      label: "Pendientes ",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardOrdenesTrabajo && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/ordenes-trabajo">
                  <ComplexStatisticsCard
                    icon="assignment"
                    color="warning"
                    title="Ordenes de Trabajo"
                    count={data.dashboardOrdenesTrabajo.ordenes_totales}
                    percentage={{
                      color:
                        data.dashboardOrdenesTrabajo.ordenes_pendientes != 0 ? "error" : "success",
                      amount: data.dashboardOrdenesTrabajo.ordenes_pendientes,
                      label: "Pendientes",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardRemisiones && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/remisiones">
                  <ComplexStatisticsCard
                    color="primary"
                    icon="assignment_turned_in"
                    title="Remisiones del Día"
                    count={data.dashboardRemisiones.remisiones_hoy}
                    percentage={{
                      color:
                        data.dashboardRemisiones.remisiones_pendientes_totales != 0
                          ? "error"
                          : "success",
                      amount: data.dashboardRemisiones.remisiones_pendientes_totales,
                      label: "Pendientes",
                    }}
                  />{" "}
                </Link>
              </MDBox>
            </Grid>
          )}
          {data.dashboardComprasPendientes && (
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <Link to="/compras">
                  <ComplexStatisticsCard
                    color="info"
                    icon="receipt_long"
                    title="Compras"
                    count={data.dashboardComprasPendientes.compras_pendientes}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "Por Recibir",
                    }}
                  />
                </Link>
              </MDBox>
            </Grid>
          )}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
