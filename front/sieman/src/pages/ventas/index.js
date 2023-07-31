// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Loader from "components/Loader";
import AmountList from "components/AmountList";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import formatMoney from "utils/formatMoney";
import formatDate from "utils/formatDate";

function Ventas() {
  const columns = [
    { Header: "fecha", accessor: "fecha", align: "center" },
    { Header: "usuario", accessor: "usuario.nombre", align: "center" },
    { Header: "cliente", accessor: "remision.nombre_cliente", align: "center" },
    { Header: "productos", accessor: "productos", align: "center" },
    { Header: "total venta", accessor: "remision.total", align: "center" },
    { Header: "metodo pago", accessor: "metodo_pago", align: "center" },
  ];

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/ventas");

        let data = response.data;
        data.forEach((registro) => {
          registro.remision.total = formatMoney(registro.remision.total);
          registro.fecha = formatDate(registro.fecha);
          let productosList = [];
          registro.remision.pedido.forEach((producto) => {
            productosList.push({
              id: producto.id,
              nombre: producto.producto.nombre,
              cantidad: producto.cantidad,
            });
          });
          registro.productos = <AmountList items={productosList} />;
        });
        setRows(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchDataFromAPI();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex" /* Add display flex */
                justifyContent="space-between" /* Add justify content */
              >
                <MDTypography variant="h6" color="white">
                  Ventas
                </MDTypography>
              </MDBox>
              <MDBox pt={3} mb={6} pl={2}>
                {isLoading ? (
                  <MDBox display="flex" justifyContent="center">
                    <MDTypography variant="h4" fontWeight="medium" color="text">
                      <Loader />
                    </MDTypography>
                  </MDBox>
                ) : error ? (
                  <MDBox display="flex" justifyContent="center">
                    <MDTypography variant="h4" fontWeight="medium" color="text">
                      {error}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    isSorted={true}
                    entriesPerPage={{ defaultValue: 25, entries: [5, 10, 25] }}
                    showTotalEntries={true}
                    noEndBorder
                    canSearch
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Ventas;
