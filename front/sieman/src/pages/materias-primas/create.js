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

function CreateMateriasPrimas() {
  let navigate = useNavigate();

  const tiposOptions = ["Carnico", "Insumos", "Empaques"];
  const [formData, setFormData] = useState({
    nombre: "",
    stock_minimo: "",
    tipo: "",
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

    if (!formData.nombre) newErrors.nombre = "El nombre de la materia prima es obligatorio.";
    if (!formData.stock_minimo) newErrors.stock_minimo = "El stock minimo es obligatorio.";
    if (!formData.tipo) newErrors.tipo = "El tipo de materia prima es obligatorio.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post("http://localhost:8000/api/materias-primas/", formData)
        .then((response) => {
          Swal.fire(
            "¡Guardado!",
            "La materia prima ha sido registrada correctamente.",
            "success"
          ).then((result) => {
            navigate("/materias-primas");
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
                  Registrando Nueva Materia Prima
                </MDTypography>
                <Link
                  to="/materias-primas"
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
                      label="Nombre Materia Prima"
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
                      label="Stock Minimo"
                      type="number"
                      fullWidth
                      required
                      name="stock_minimo"
                      value={formData.stock_minimo}
                      onChange={handleChange}
                    />
                    {errors.stock_minimo && (
                      <span className="formError">{errors.stock_minimo}</span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      value={formData.tipo}
                      options={tiposOptions}
                      onChange={(event, newValue) => {
                        setFormData({
                          ...formData,
                          ["tipo"]: newValue,
                        });
                      }}
                      renderInput={(params) => (
                        <MDInput type="text" {...params} label="Tipo Materia Prima *" />
                      )}
                    />
                    {errors.tipo && <span className="formError">{errors.tipo}</span>}
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

export default CreateMateriasPrimas;
