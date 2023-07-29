// react modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

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
import { Checkbox, FormControlLabel, Typography, Autocomplete } from "@mui/material";

function CreateRecepcion() {
  let navigate = useNavigate();
  const { id_compra } = useParams();
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  const [formData, setFormData] = useState({
    compra: id_compra,
    usuario: user.id,
    estado: "",
    olor: false,
    color: false,
    operario: false,
    vehiculo: false,
    lote: "",
    motivo_devolucion: "",
  });

  const [compra, setCompra] = useState({});
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const registerRecepcion = async () => {
    const accion = formData.estado === "Recibida" ? "recepción" : "devolución";
    axios
      .post("http://localhost:8000/api/recepciones/", formData)
      .then((response) => {
        Swal.fire(
          "¡Guardado!",
          "La " + accion + " ha sido registrada correctamente.",
          "success"
        ).then((result) => {
          navigate("/recepciones");
        });
      })
      .catch((ex) => {
        Object.keys(ex.response.data).map(function (objectKey, index) {
          var value = ex.response.data[objectKey];
          setErrors({ ...errors, [objectKey]: value[0] });
        });
        console.error("Error de conexion:", ex);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setErrors([]);

    if (!formData.estado || formData.estado === "") {
      newErrors.estado = "Debe seleccionar un estado.";
    }

    if (!formData.lote || formData.lote === "") {
      newErrors.lote = "Debe ingresar el lote.";
    }

    if (
      formData.estado === "Devuelta" &&
      (!formData.motivo_devolucion || formData.motivo_devolucion === "")
    ) {
      newErrors.motivo_devolucion = "Debe ingresar el motivo de la devolución.";
    }

    if (formData.estado === "Recibida") {
      if (!formData.olor) {
        newErrors.olor = "Debe seleccionar que el olor es correcto.";
      }
      if (!formData.color) {
        newErrors.color = "Debe seleccionar que el color es correcto.";
      }
      if (!formData.operario) {
        newErrors.operario = "Debe seleccionar que el operario es correcto.";
      }
      if (!formData.vehiculo) {
        newErrors.vehiculo = "Debe seleccionar que el vehiculo es correcto.";
      }
    }

    //si estado es recibida, remover motivo de devolucion de formData
    if (formData.estado === "Recibida") {
      delete formData.motivo_devolucion;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      registerRecepcion();
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/compras/" + id_compra + "/")
      .then((response) => {
        setCompra(response.data);
      })
      .catch((ex) => {
        console.error("Error al cargar la compra", ex);
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
                  Registrando Nueva Recepcion
                </MDTypography>
                <Link
                  to="/compras"
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
                      value={
                        compra.orden_compra?.materia_prima?.nombre
                          ? compra.orden_compra?.materia_prima?.nombre
                          : ""
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
                      value={compra.orden_compra?.cantidad ? compra.orden_compra?.cantidad : ""}
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3} mb={1}>
                <Grid p={2} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={4} md={3}>
                    <Autocomplete
                      value={formData.estado}
                      options={["Recibida", "Devuelta"]}
                      onChange={(event, newValue) =>
                        setFormData({
                          ...formData,
                          estado: newValue,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} type="text" label="Estado Recepción" />
                      )}
                    />
                    {errors.estado && <span className="formError">{errors.estado}</span>}
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <MDInput
                      label="Lote de la compra"
                      type="text"
                      fullWidth
                      name="lote"
                      value={formData.lote}
                      onChange={handleChange}
                    />
                    {errors.lote && <span className="formError">{errors.lote}</span>}
                  </Grid>
                  {formData.estado === "Devuelta" && (
                    <Grid item xs={12} sm={12} md={12}>
                      <MDInput
                        value={formData.motivo_devolucion}
                        onChange={handleChange}
                        label="Motivo de la devolucion"
                        multiline
                        name="motivo_devolucion"
                        rows={5}
                      />
                      {errors.motivo_devolucion && (
                        <span className="formError">{errors.motivo_devolucion}</span>
                      )}
                    </Grid>
                  )}
                </Grid>
                <Grid p={1} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={1} md={1}>
                    <FormControlLabel
                      label="Olor - ok"
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={formData.olor}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              olor: e.target.checked,
                            });
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} md={1}>
                    <FormControlLabel
                      label="Color ok"
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={formData.color}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              color: e.target.checked,
                            });
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} md={1}>
                    <FormControlLabel
                      label="Operario ok"
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={formData.operario}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              operario: e.target.checked,
                            });
                          }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} md={1}>
                    <FormControlLabel
                      label="Vehiculo ok"
                      labelPlacement="top"
                      control={
                        <Checkbox
                          checked={formData.vehiculo}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              vehiculo: e.target.checked,
                            });
                          }}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                {(errors.olor || errors.color || errors.operario || errors.vehiculo) && (
                  <MDBox pt={0} mb={1}>
                    <Grid pl={3} pt={0} container columnSpacing={1} rowSpacing={4}>
                      {errors.olor && (
                        <Grid p={0} item xs={12} sm={12} md={12}>
                          <span className="formError">{errors.olor}</span>
                        </Grid>
                      )}
                      {errors.color && (
                        <Grid p={0} item xs={12} sm={12} md={12}>
                          <span className="formError">{errors.color}</span>
                        </Grid>
                      )}
                      {errors.operario && (
                        <Grid item xs={12} sm={12} md={12}>
                          <span className="formError">{errors.operario}</span>
                        </Grid>
                      )}
                      {errors.vehiculo && (
                        <Grid item xs={12} sm={12} md={12}>
                          <span className="formError">{errors.vehiculo}</span>
                        </Grid>
                      )}
                    </Grid>
                  </MDBox>
                )}
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

export default CreateRecepcion;
