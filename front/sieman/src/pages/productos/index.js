// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Loader from "components/Loader";
import AmountList from "components/AmountList";

// material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import formatMoney from "utils/formatMoney";

function Productos() {
  const columns = [
    { Header: "", accessor: "accion", width: "5%", align: "center" },
    { Header: "nombre", accessor: "nombre", align: "left" },
    { Header: "tipo", accessor: "tipo", align: "center" },
    { Header: "precio", accessor: "precio", align: "center" },
    { Header: "peso", accessor: "peso", align: "center" },
    { Header: "stock minimo", accessor: "stock_minimo", align: "center" },
    { Header: "Materias Primas - x(Cantidad)", accessor: "composicion", align: "center" },
  ];

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = (producto) => {
    Swal.fire({
      title: "¿Estás seguro de inhabilitar el producto '" + producto.nombre + "'?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProducto(producto);
      }
    });
  };

  const deleteProducto = async (producto) => {
    try {
      await axios.delete("http://localhost:8000/api/productos/" + producto.id + "/");
      setIsDeleted(true);
      Swal.fire("¡Eliminado!", "El producto ha sido inhabilitado correctamente.", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("¡Error!", "El producto no ha podido ser inhabilitado.", "error");
    }
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        setIsDeleted(false);

        const response = await axios.get("http://localhost:8000/api/productos/");

        let data = response.data;
        data.forEach((registro) => {
          registro.precio = formatMoney(registro.precio);
          registro.peso = registro.peso + " gr";
          registro.composicion = <AmountList items={registro.composicion} />;
          let url = "/productos/editar/" + registro.id;
          registro.accion = (
            <div>
              <Link
                to={url}
                style={{
                  color: "#3c96ef",
                }}
              >
                <Icon color="#49a3f1">edit</Icon>
              </Link>
              <Icon
                style={{
                  color: "rgb(220 48 44)",
                }}
                className="fake-link"
                onClick={() => handleDelete(registro)}
              >
                delete
              </Icon>
            </div>
          );
        });

        setRows(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchDataFromAPI();
  }, [isDeleted]);

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
                  Productos Registrados
                </MDTypography>
                <Link
                  to="/productos/crear"
                  style={{
                    color: "#3c96ef",
                  }}
                >
                  <Icon
                    color="#fff"
                    fontSize="large"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  >
                    add_circle
                  </Icon>
                </Link>
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
                    isSorted={false}
                    entriesPerPage={{ defaultValue: 5, entries: [5, 10, 25] }}
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

export default Productos;
