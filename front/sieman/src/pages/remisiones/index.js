// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
import { Icon } from "@mui/material";

import { useMaterialUIController } from "context";
import { Link, useNavigate } from "react-router-dom";

function Remisiones() {
  let navigate = useNavigate();

  const columns = [
    { Header: "", accessor: "accion", align: "center" },
    { Header: "N° Remision", accessor: "id", align: "center" },
    { Header: "estado", accessor: "estado", align: "center" },
    { Header: "fecha", accessor: "fecha_generacion", align: "center" },
    { Header: "usuario", accessor: "usuario.nombre", align: "center" },
    { Header: "tipo", accessor: "tipo", align: "center" },
    { Header: "cliente", accessor: "nombre_cliente", align: "center" },
    { Header: "fecha entrega", accessor: "fecha_entrega", align: "center" },
    { Header: "total", accessor: "total", align: "center" },
    { Header: "productos", accessor: "productos", align: "center" },
  ];
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCancel = (remision) => {
    Swal.fire({
      title: "¿Estás seguro de cancelar la remision N° " + remision.id + "?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar Remision",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelRemision(remision);
      }
    });
  };

  const cancelRemision = async (remision) => {
    try {
      await axios.patch("http://localhost:8000/api/remisiones/" + remision.id + "/", {
        estado: "Cancelada",
      });
      setIsLoading(true);
      Swal.fire("¡Cancelado!", "La remision ha sido cancelada correctamente.", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("¡Error!", "La remision no ha podido ser cancelada.", "error");
    }
  };

  const handleVenta = (remision) => {
    Swal.fire({
      title: "Seleccione el metodo de pago",
      input: "select",
      inputOptions: {
        Efectivo: "Efectivo",
        Tarjeta: "Tarjeta",
        Transferencia: "Transferencia",
      },
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (metodo) => {
        return axios
          .post("http://localhost:8000/api/ventas/", {
            metodo_pago: metodo,
            remision: remision.id,
            usuario: user.id,
          })
          .then((response) => {
            setIsLoading(true);
            Swal.fire(
              "¡Actualizado!",
              "El producto listo para venta se ha registrado en inventario correctamente.",
              "success"
            ).then((result) => {
              navigate("/ventas");
            });
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

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/remisiones");

        let data = response.data;
        data.forEach((registro) => {
          registro.accion =
            registro.estado === "Pendiente" ? (
              <div>
                <Icon
                  title="Registrar Venta"
                  fontSize="small"
                  style={{
                    color: "rgb(110 203 28)",
                  }}
                  className="fake-link"
                  onClick={() => handleVenta(registro)}
                >
                  check_circle
                </Icon>
                <Icon
                  title="Cancelar Remision"
                  fontSize="small"
                  style={{
                    color: "rgb(220 48 44)",
                  }}
                  className="fake-link"
                  onClick={() => handleCancel(registro)}
                >
                  cancel
                </Icon>
              </div>
            ) : (
              ""
            );

          registro.total = formatMoney(registro.total);
          registro.fecha_generacion = formatDate(registro.fecha_generacion);
          registro.fecha_entrega = registro.fecha_entrega
            ? formatDate(registro.fecha_entrega, false)
            : "";
          let productosList = [];
          registro.pedido.forEach((producto) => {
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
  }, [isLoading]);

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
                  Remisiones
                </MDTypography>
                <Link
                  to="/remisiones/crear"
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

export default Remisiones;
