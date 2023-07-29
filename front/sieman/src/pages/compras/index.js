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
import formatMoney from "utils/formatMoney";

function Compras() {
  const columns = [
    { Header: "", accessor: "accion", width: "5%", align: "center" },
    { Header: "N° de Compra", accessor: "id", width: "10%", align: "left" },
    { Header: "fecha", accessor: "fecha", width: "10%", align: "center" },
    { Header: "orden", accessor: "orden_info", width: "10%", align: "center" },
    { Header: "valor", accessor: "valor", width: "10%", align: "center" },
    { Header: "estado", accessor: "estado", align: "center" },
    { Header: "proveedor", accessor: "nombre_proveedor", align: "center" },
    { Header: "usuario", accessor: "usuario.nombre", align: "center" },
    { Header: "Cierre", accessor: "cierre", align: "center" },
  ];

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleDevolucion = (registro) => {
    // se pide el valor de la nota credito con un swal
    Swal.fire({
      title: "Ingrese el código de la Nota Credito",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (nota_credito) => {
        return axios
          .patch("http://localhost:8000/api/compras/" + registro.id + "/", {
            estado: "Cerrada",
            nota_credito: nota_credito,
            fecha_cierre: new Date(),
          })
          .then((response) => {
            setIsUpdated(true);
            Swal.fire("¡Actualizado!", "Compra actualizada correctamente.", "success");
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("¡Error!", "La compra no ha podido ser actualizada.", "error");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleCierre = (registro) => {
    //se confirma el cierre de la compra
    Swal.fire({
      title: "¿Estás seguro de cerrar la compra N°" + registro.id + "?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch("http://localhost:8000/api/compras/" + registro.id + "/", {
            estado: "Cerrada",
            fecha_cierre: new Date(),
          })
          .then((response) => {
            setIsUpdated(true);
            Swal.fire("¡Actualizado!", "Compra actualizada correctamente.", "success");
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("¡Error!", "La compra no ha podido ser actualizada.", "error");
          });
      }
    });
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        setIsUpdated(false);

        const response = await axios.get("http://localhost:8000/api/compras/");

        let data = response.data;
        data.forEach((registro) => {
          let url = "/recepciones/crear/" + registro.id;
          registro.fecha = formatDate(registro.fecha);
          registro.valor = formatMoney(registro.valor);
          let fecha_cierre = registro.fecha_cierre ? formatDate(registro.fecha_cierre) : "";
          registro.orden_info =
            registro.orden_compra.materia_prima.nombre + " - x" + registro.orden_compra.cantidad;
          registro.cierre = registro.nota_credito
            ? "Nota Credito: '" + registro.nota_credito + "' - "
            : "";
          registro.cierre += fecha_cierre;

          let acciones = {
            Realizada: (
              <div>
                <Link
                  to={url}
                  style={{
                    color: "#3c96ef",
                  }}
                >
                  <Icon
                    title="REGISTRAR RECEPCIÓN"
                    fontSize="large"
                    style={{
                      color: "rgb(48 92 223)",
                    }}
                    className="fake-link"
                  >
                    rv_hookup
                  </Icon>
                </Link>
              </div>
            ),
            Devuelta: (
              <div>
                <RemoveShoppingCartIcon
                  title="CERRAR COMPRA CON DEVOLUCION"
                  fontSize="medium"
                  style={{
                    color: "rgb(203 28 28)",
                  }}
                  className="fake-link"
                  onClick={() => handleDevolucion(registro)}
                />
              </div>
            ),
            Recibida: (
              <div>
                <Icon
                  title="CERRAR COMPRA"
                  fontSize="small"
                  style={{
                    color: "rgb(110 203 28)",
                  }}
                  className="fake-link"
                  onClick={() => handleCierre(registro)}
                >
                  thumb_up
                </Icon>
              </div>
            ),
            Cerrada: "",
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
                  Compras Registradas
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

export default Compras;
