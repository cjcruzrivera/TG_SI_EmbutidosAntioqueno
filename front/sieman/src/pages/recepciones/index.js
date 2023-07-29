// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

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

function Recepciones() {
  const columns = [
    { Header: "", accessor: "accion", width: "5%", align: "center" },
    { Header: "N° de Compra", accessor: "compra.id", width: "10%", align: "left" },
    { Header: "fecha", accessor: "fecha", width: "10%", align: "center" },
    { Header: "estado", accessor: "estado", align: "center" },
    {
      Header: "Materia Prima",
      accessor: "compra.orden_compra.materia_prima.nombre",
      align: "center",
    },
    { Header: "lote", accessor: "lote", width: "10%", align: "center" },
    { Header: "olor", accessor: "olor", align: "center" },
    { Header: "color", accessor: "color", align: "center" },
    { Header: "operario", accessor: "operario", align: "center" },
    { Header: "vehiculo", accessor: "vehiculo", align: "center" },
    { Header: "motivo devolucion", accessor: "motivo_devolucion", align: "center" },
  ];

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const fetchBoodegas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bodegas/");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAlistamiento = async (registro) => {
    // se pide el valor de la bodega con un swal con un select
    const fetchedBodegas = await fetchBoodegas();
    let bodegasOptions = {};
    fetchedBodegas.forEach((bodega) => {
      bodegasOptions[bodega.id] = bodega.nombre;
    });

    Swal.fire({
      title: "Seleccione la bodega",
      input: "select",
      inputOptions: bodegasOptions,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (bodega) => {
        return axios
          .post("http://localhost:8000/api/registrar-alistamiento/", {
            recepcion_id: registro.id,
            bodega_id: bodega,
          })
          .then((response) => {
            setIsUpdated(true);
            Swal.fire(
              "¡Actualizado!",
              "La materia prima en inventario ha sido actualizada correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire(
              "¡Error!",
              "La materia prima en inventario no ha podido ser actualizada.",
              "error"
            );
          });
      },
    });
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        setIsUpdated(false);

        const response = await axios.get("http://localhost:8000/api/recepciones/");

        let data = response.data;
        data.forEach((registro) => {
          registro.fecha = formatDate(registro.fecha);
          registro.olor = registro.olor ? "OK" : "NO OK";
          registro.color = registro.color ? "OK" : "NO OK";
          registro.vehiculo = registro.vehiculo ? "OK" : "NO OK";
          registro.operario = registro.operario ? "OK" : "NO OK";
          registro.motivo_devolucion = registro.motivo_devolucion
            ? registro.motivo_devolucion
            : "-";

          let acciones = {
            Devuelta: "",
            Recibida: (
              <div>
                <Icon
                  title="REGISTRAR ALISTAMIENTO"
                  fontSize="small"
                  style={{
                    color: "rgb(48 92 223)",
                  }}
                  className="fake-link"
                  onClick={() => handleAlistamiento(registro)}
                >
                  drive_file_move
                </Icon>
              </div>
            ),
          };

          registro.accion = acciones[registro.estado];
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
                  Recepciones Registradas
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
                    isSorted={false}
                    entriesPerPage={{ defaultValue: 5, entries: [5, 10, 25] }}
                    showTotalEntries={true}
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

export default Recepciones;
