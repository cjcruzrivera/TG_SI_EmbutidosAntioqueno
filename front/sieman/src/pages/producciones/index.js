// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

function Producciones() {
  const columns = [
    { Header: "", accessor: "accion", width: "5%", align: "center" },
    { Header: "N° de Orden", accessor: "orden.id", width: "15%", align: "left" },
    { Header: "fecha", accessor: "fecha", align: "center" },
    { Header: "Producto", accessor: "orden.producto.nombre", align: "center" },
    { Header: "cantidad", accessor: "orden.cantidad", align: "center" },
    { Header: "Usuario Registra", accessor: "usuario.nombre", align: "center" },
    { Header: "estado", accessor: "estado", align: "center" },
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

  const updateStatus = async (produccion, estado) => {
    try {
      await axios.patch("http://localhost:8000/api/producciones/" + produccion.id + "/", {
        estado: estado,
      });
      setIsUpdated(true);
      Swal.fire(
        "¡Actualizado!",
        "El estado de la produccion ha sido actualizado correctamente.",
        "success"
      );
    } catch (error) {
      console.log(error);
      Swal.fire("¡Error!", "El estado de la produccion no ha podido ser actualizado.", "error");
    }
  };

  const handleCierre = async (registro) => {
    // se pide el valor de la bodega con un swal con un select
    const fetchedBodegas = await fetchBoodegas();
    let bodegasOptions = {};
    fetchedBodegas.forEach((bodega) => {
      bodegasOptions[bodega.id] = bodega.nombre;
    });

    Swal.fire({
      title: "Seleccione la bodega destino",
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
          .patch("http://localhost:8000/api/producciones/" + registro.id + "/", {
            estado: "Finalizado",
            bodega_id: parseInt(bodega),
          })
          .then((response) => {
            setIsUpdated(true);
            Swal.fire(
              "¡Actualizado!",
              "El producto listo para venta se ha registrado en inventario correctamente.",
              "success"
            );
          })
          .catch((error) => {
            console.log(error);
            Swal.fire(
              "¡Error!",
              "El producto en inventario no ha podido ser actualizado.",
              "error"
            );
          });
      },
    });
  };

  const handleClick = (registro, act) => {
    const actions = {
      Preparado: {
        action: "registrar el proceso de preparación",
      },
      Cocinado: {
        action: "registrar el proceso de cocción",
      },
    };
    Swal.fire({
      title:
        "¿Estás seguro de " +
        actions[act].action +
        " de la orden de producción N°" +
        registro.orden.id +
        "?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(registro, act);
      }
    });
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        setIsUpdated(false);

        const response = await axios.get("http://localhost:8000/api/producciones/");

        let data = response.data;
        data.forEach((registro) => {
          registro.fecha = formatDate(registro.fecha);

          let btns = {
            "En Proceso": (
              <div>
                <Icon
                  title="REGISTRAR PROCESO DE PREPARACIÓN"
                  fontSize="small"
                  style={{
                    color: "rgb(255 153 0)",
                  }}
                  className="fake-link"
                  onClick={() => handleClick(registro, "Preparado")}
                >
                  kebab_dining
                </Icon>
              </div>
            ),
            Preparado: (
              <div>
                <Icon
                  title="REGISTRAR PROCESO DE COCCIÓN"
                  fontSize="small"
                  style={{
                    color: "rgb(104 103 104)",
                  }}
                  className="fake-link"
                  onClick={() => handleClick(registro, "Cocinado")}
                >
                  outdoor_grill
                </Icon>
              </div>
            ),
            Cocinado: (
              <div>
                <Icon
                  title="REGISTRAR PROCESO DE CIERRE DE PREPARACIÓN"
                  fontSize="small"
                  style={{
                    color: "rgb(110 203 28)",
                  }}
                  className="fake-link"
                  onClick={() => handleCierre(registro)}
                >
                  task_alt
                </Icon>
              </div>
            ),
            Finalizado: "",
          };

          registro.accion = btns[registro.estado];
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
                  Producciones Registradas
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
                    entriesPerPage={{ defaultValue: 10, entries: [5, 10, 25] }}
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

export default Producciones;
