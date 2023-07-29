// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Loader from "components/Loader";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import formatDate from "utils/formatDate";

function OrdenesCompra() {
  const columns = [
    { Header: "", accessor: "accion", width: "5%", align: "center" },
    { Header: "N° de Orden", accessor: "id", width: "15%", align: "left" },
    { Header: "fecha", accessor: "fecha", align: "center" },
    { Header: "Materia Prima", accessor: "materia_prima.nombre", align: "center" },
    { Header: "cantidad", accessor: "cantidad", align: "center" },
    { Header: "Usuario Registra", accessor: "usuario.nombre", align: "center" },
    { Header: "estado", accessor: "estado", align: "center" },
  ];

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const updateStatus = async (orden, estado) => {
    try {
      await axios.patch("http://localhost:8000/api/ordenes-compra/" + orden.id + "/", {
        estado: estado,
      });
      setIsUpdated(true);
      Swal.fire(
        "¡Actualizado!",
        "El estado de la orden de compra ha sido actualizado correctamente.",
        "success"
      );
    } catch (error) {
      console.log(error);
      Swal.fire(
        "¡Error!",
        "El estado de la orden de compra no ha podido ser actualizado.",
        "error"
      );
    }
  };

  const handleClick = (registro, act) => {
    const actions = {
      Aprobar: {
        action: "aprobar",
        method: () => updateStatus(registro, "Aprobada"),
      },
      Rechazar: {
        action: "rechazar",
        method: () => updateStatus(registro, "Rechazada"),
      },
    };
    Swal.fire({
      title:
        "¿Estás seguro de " + actions[act].action + " la orden de compra N°" + registro.id + "?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        actions[act].method();
      }
    });
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        setIsUpdated(false);

        const response = await axios.get("http://localhost:8000/api/ordenes-compra/");

        let data = response.data;
        data.forEach((registro) => {
          let url = "/compras/crear/" + registro.id;
          registro.fecha = formatDate(registro.fecha);
          registro.usuario = registro.usuario
            ? registro.usuario
            : { nombre: "Sistema (Automático)" };
          let btns =
            registro.estado == "Pendiente" ? (
              <div>
                <Icon
                  title="APROBAR ORDEN DE COMPRA"
                  fontSize="small"
                  style={{
                    color: "rgb(110 203 28)",
                  }}
                  className="fake-link"
                  onClick={() => handleClick(registro, "Aprobar")}
                >
                  check_circle
                </Icon>
                <Icon
                  title="RECHAZAR ORDEN DE COMPRA"
                  fontSize="small"
                  style={{
                    color: "rgb(220 48 44)",
                  }}
                  className="fake-link"
                  onClick={() => handleClick(registro, "Rechazar")}
                >
                  cancel
                </Icon>
              </div>
            ) : (
              <div>
                <Link
                  to={url}
                  style={{
                    color: "#3c96ef",
                  }}
                >
                  <Icon
                    title="REGISTRAR COMPRA"
                    fontSize="small"
                    style={{
                      color: "rgb(48 92 223)",
                    }}
                    className="fake-link"
                  >
                    add_shopping_cart
                  </Icon>
                </Link>
              </div>
            );
          registro.accion =
            registro.estado != "Rechazada" && registro.estado != "Realizada" ? btns : "";
        });

        setRows(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchDataFromAPI();
  }, [isUpdated]);

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
                  Ordenes de Compra Registradas
                </MDTypography>
                <Link
                  to="/ordenes-compra/crear"
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

export default OrdenesCompra;
