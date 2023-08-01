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

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/producciones">
                <ComplexStatisticsCard
                  color="success"
                  icon="attach_money"
                  title="Ventas del Mes"
                  count="$230.000"
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "que el mes pasado",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="shopping_cart"
                color="info"
                title="Compras del Mes"
                count="23"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "que el mes pasado",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="assignment"
                title="Ventas del Dia"
                count="34"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "que el dia anterior",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="assignment_turned_in"
                title="Producciones"
                count="91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "En Curso",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="attach_money"
                title="Ordenes de Compra"
                count="15"
                percentage={{
                  color: "warning",
                  amount: "10",
                  label: "Pendientes ",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="shopping_cart"
                color="warning"
                title="Ordenes de Trabajo"
                count="23"
                percentage={{
                  color: "success",
                  amount: "15",
                  label: "Pendientes",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="assignment_turned_in"
                title="Remisiones"
                count="91"
                percentage={{
                  color: "success",
                  amount: "17",
                  label: "Pendientes",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="assignment"
                title="Compras"
                count="34"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Por Recibir",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
