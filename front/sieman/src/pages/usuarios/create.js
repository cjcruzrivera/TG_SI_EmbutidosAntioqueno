// react modules
import React, { useState } from "react";
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

function CreateUsuarios() {
  let navigate = useNavigate();

  const rolesOptions = [
    "Administrador",
    "Secretaria Administrativa",
    "Auxiliar Contable",
    "Operario de Produccion",
    "Operario de Alistamiento",
    "Operario de Ventas",
  ];
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    rol: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePass = (pass) => {
    if (pass.length < 8) {
      return [false, "La contraseña debe tener al menos 8 caracteres."];
    }
    return [true, ""];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setErrors([]);

    if (!formData.cedula) newErrors.cedula = "La cédula es obligatoria.";
    if (!formData.nombre) newErrors.nombre = "El nombre completo es obligatorio.";
    if (!formData.rol) newErrors.rol = "El rol es obligatorio.";
    if (!formData.email) newErrors.email = "El email es obligatorio.";
    const [validPass, errors] = validatePass(formData.password);
    if (!validPass) newErrors.password = errors;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post("http://localhost:8000/api/usuarios/", formData)
        .then((response) => {
          Swal.fire("¡Guardado!", "El usuario ha sido registrado correctamente.", "success").then(
            (result) => {
              navigate("/usuarios");
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
                  Registrando Nuevo Usuario
                </MDTypography>
                <Link
                  to="/usuarios"
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
                    <MDInput
                      type="text"
                      label="Cedula"
                      name="cedula"
                      fullWidth
                      value={formData.cedula}
                      required
                      onChange={handleChange}
                    />
                    {errors.cedula && <span className="formError">{errors.cedula}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="text"
                      label="Nombre Completo"
                      fullWidth
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    {errors.nombre && <span className="formError">{errors.nombre}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      label="Email"
                      type="email"
                      fullWidth
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <span className="formError">{errors.email}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      value={formData.rol}
                      required
                      options={rolesOptions}
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          ["rol"]: newValue,
                        });
                      }}
                      renderInput={(params) => <MDInput type="text" {...params} label="Rol *" />}
                    />
                    {errors.rol && <span className="formError">{errors.rol}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="password"
                      label="Contraseña"
                      name="password"
                      required
                      value={formData.password}
                      fullWidth
                      onChange={handleChange}
                    />
                    {errors.password && <span className="formError">{errors.password}</span>}
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

export default CreateUsuarios;
