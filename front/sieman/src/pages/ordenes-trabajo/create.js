// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function CreateOrdenTrabajo() {
  let navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  const [ProductosOptions, setProductosOptions] = useState([]);
  const [formData, setFormData] = useState({
    cantidad: "",
    producto: "",
    usuario: user.id,
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setErrors([]);
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

    if (!formData.producto || formData.producto.length === 0) {
      newErrors.producto = "Debe seleccionar un producto.";
    }
    if (!formData.cantidad) newErrors.cantidad = "Debe ingresar la cantidad a producir.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post("http://localhost:8000/api/ordenes-trabajo/", formData)
        .then((response) => {
          Swal.fire(
            "¡Guardado!",
            "La Orden de Produccion ha sido registrada correctamente.",
            "success"
          ).then((result) => {
            navigate("/ordenes-trabajo");
          });
        })
        .catch((ex) => {
          Object.keys(ex.response.data).map(function (objectKey, index) {
            var value = ex.response.data[objectKey];
            setErrors({ ...errors, [objectKey]: value });
          });
          console.error("Error de conexion:", ex);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/productos/")
      .then((response) => {
        let productosToOptions = response.data.map((producto) => ({
          label: producto.nombre,
          id: producto.id,
        }));

        setProductosOptions(productosToOptions);
      })
      .catch((ex) => {
        console.error("Error al cargar las materias primas:", ex);
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
                  Registrando Nueva Orden de Produccion
                </MDTypography>
                <Link
                  to="/ordenes-trabajo"
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
              {errors.detail &&
                errors.detail.map((error) => (
                  <MDBox key={error} pl={2} pt={2} mb={1}>
                    <MDTypography variant="h6" color="error">
                      {error}
                    </MDTypography>
                  </MDBox>
                ))}

              <MDBox pt={2} mb={1}>
                <Grid p={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      value={formData.materia_prima_id}
                      options={ProductosOptions}
                      onChange={(event, newValue) =>
                        setFormData({
                          ...formData,
                          producto: newValue?.id,
                        })
                      }
                      renderInput={(params) => <MDInput {...params} type="text" label="Producto" />}
                    />
                    {errors.producto && <span className="formError">{errors.producto}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      label="Cantidad a Producir"
                      type="number"
                      min={1}
                      size="large"
                      fullWidth
                      required
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleChange}
                    />
                    {errors.cantidad && <span className="formError">{errors.cantidad}</span>}
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

export default CreateOrdenTrabajo;
