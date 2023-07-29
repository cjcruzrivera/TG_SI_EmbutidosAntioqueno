// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useMaterialUIController } from "context";
import { Typography } from "@mui/material";

function CreateCompra() {
  let navigate = useNavigate();
  const { id_orden } = useParams();
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  const [formData, setFormData] = useState({
    orden_compra: id_orden,
    nombre_proveedor: "",
    valor: "",
    usuario: user.id,
  });

  const [ordenCompra, setOrdenCompra] = useState({});
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setErrors([]);

    if (!formData.nombre_proveedor)
      newErrors.nombre_proveedor = "El nombre del proveedor es obligatorio.";
    if (!formData.valor) newErrors.valor = "El valor de la compra es obligatorio.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post("http://localhost:8000/api/compras/", formData)
        .then((response) => {
          Swal.fire("¡Guardado!", "La compra ha sido registrada correctamente.", "success").then(
            (result) => {
              navigate("/compras");
            }
          );
        })
        .catch((ex) => {
          Object.keys(ex.response.data).map(function (objectKey, index) {
            var value = ex.response.data[objectKey];
            setErrors({ ...errors, [objectKey]: value[0] });
          });
          console.error("Error de conexion:", ex);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/ordenes-compra/" + id_orden + "/")
      .then((response) => {
        setOrdenCompra(response.data);
      })
      .catch((ex) => {
        console.error("Error al cargar la orden de compra", ex);
      });
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
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Registrando Nueva Compra
                </MDTypography>
                <Link
                  to="/ordenes-compra"
                  style={{
                    color: "#3c96ef",
                  }}
                >
                  <Icon
                    color="#fff"
                    fontSize="medium"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  >
                    undo
                  </Icon>
                </Link>
              </MDBox>
              <MDBox pt={3} pb={0} mb={0}>
                <Grid pl={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" color="text">
                      Materia Prima
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" color="text">
                      Cantidad
                    </Typography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={0} mt={0} mb={1}>
                <Grid pl={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="text"
                      fullWidth
                      name="nombre"
                      readOnly
                      value={
                        ordenCompra.materia_prima?.nombre ? ordenCompra.materia_prima.nombre : ""
                      }
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="number"
                      fullWidth
                      readOnly
                      name="cantidad"
                      value={ordenCompra.cantidad ? ordenCompra.cantidad : ""}
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3} mb={1}>
                <Grid p={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="text"
                      label="Nombre Proveedor"
                      fullWidth
                      name="nombre_proveedor"
                      value={formData.nombre_proveedor}
                      onChange={handleChange}
                      required
                    />
                    {errors.nombre_proveedor && (
                      <span className="formError">{errors.nombre_proveedor}</span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      label="Valor de la compra"
                      type="number"
                      fullWidth
                      required
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                    />
                    {errors.valor && <span className="formError">{errors.valor}</span>}
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <MDBox mt={2} mb={1}>
          <MDButton variant="gradient" color="info" onClick={handleSubmit}>
            Guardar
          </MDButton>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CreateCompra;
