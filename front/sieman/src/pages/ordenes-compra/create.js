// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

function CreateOrdenCompra() {
  let navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  const [materiasPrimasOptions, setMateriasPrimasOptions] = useState([]);
  const [formData, setFormData] = useState({
    cantidad: "",
    materia_prima: "",
    usuario: user.id,
  });
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

    if (!formData.materia_prima || formData.materia_prima.length === 0) {
      newErrors.materia_prima = "Debe seleccionar una materia prima.";
    }
    if (!formData.cantidad) newErrors.cantidad = "Debe ingresar la cantidad a comprar.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post("http://localhost:8000/api/ordenes-compra/", formData)
        .then((response) => {
          Swal.fire(
            "¡Guardado!",
            "La Orden de Compra ha sido registrada correctamente.",
            "success"
          ).then((result) => {
            navigate("/ordenes-compra");
          });
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
      .get("http://localhost:8000/api/materias-primas/")
      .then((response) => {
        let materiasPrimasToOptions = response.data.map((materiaPrima) => ({
          label: materiaPrima.nombre,
          id: materiaPrima.id,
        }));

        setMateriasPrimasOptions(materiasPrimasToOptions);
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
                  Registrando Nueva Orden de Compra
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
              <MDBox pt={3} mb={1}>
                <Grid p={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      value={formData.materia_prima_id}
                      options={materiasPrimasOptions}
                      onChange={(event, newValue) =>
                        setFormData({
                          ...formData,
                          materia_prima: newValue?.id,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} type="text" label="Materia Prima" />
                      )}
                    />
                    {errors.materia_prima && (
                      <span className="formError">{errors.materia_prima}</span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      label="Cantidad a Comprar"
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

export default CreateOrdenCompra;
