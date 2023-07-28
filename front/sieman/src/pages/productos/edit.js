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

function EditProductos() {
  let navigate = useNavigate();
  const { id } = useParams();

  const tiposOptions = ["Unidad", "Paquete", "Peso"];
  const [materiasPrimasOptions, setMateriasPrimasOptions] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    stock_minimo: "",
    peso: "",
    precio: "",
    tipo: "",
    composicion: [],
  });
  const [errors, setErrors] = useState([]);
  const [newComposicion, setNewComposicion] = useState({
    materia_prima_id: "",
    cantidad: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleComposicionChange = (e) => {
    const { name, value } = e.target;
    setNewComposicion({
      ...newComposicion,
      [name]: value,
    });
  };

  const getLabelMateriaPrimabyId = (id) => {
    let label = "";
    materiasPrimasOptions.map((item) => {
      if (item.id === id) {
        label = item.label;
      }
    });
    return label;
  };

  const handleAddComposicion = () => {
    if (newComposicion.materia_prima_id && newComposicion.cantidad) {
      newComposicion.materia_prima_id = newComposicion.materia_prima_id.id;
      setFormData({
        ...formData,
        composicion: [...formData.composicion, newComposicion],
      });
      setNewComposicion({
        materia_prima_id: "",
        cantidad: "",
      });
    }
  };

  const handleDeleteComposicion = (index) => {
    const updatedComposicion = formData.composicion.filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      composicion: updatedComposicion,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setErrors([]);

    if (!formData.nombre) newErrors.nombre = "El nombre del producto es obligatorio.";
    if (!formData.peso) newErrors.peso = "El peso del producto es obligatorio.";
    if (!formData.precio) newErrors.precio = "El precio del producto es obligatorio.";
    if (!formData.stock_minimo) newErrors.stock_minimo = "El stock minimo es obligatorio.";
    if (!formData.tipo) newErrors.tipo = "El tipo de producto es obligatorio.";
    if (!formData.composicion || formData.composicion.length === 0) {
      newErrors.composicion = "Debe seleccionar al menos una materia prima.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .put("http://localhost:8000/api/productos/" + id + "/", formData)
        .then((response) => {
          Swal.fire("¡Guardado!", "El producto ha sido editado correctamente.", "success").then(
            (result) => {
              navigate("/productos");
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
    const fetchData = async () => {
      try {
        const materiasPrimasResponse = await axios.get(
          "http://localhost:8000/api/materias-primas/"
        );
        const materiasPrimasToOptions = materiasPrimasResponse.data.map((materiaPrima) => ({
          label: materiaPrima.nombre,
          id: materiaPrima.id,
        }));
        setMateriasPrimasOptions(materiasPrimasToOptions);

        const productoResponse = await axios.get("http://localhost:8000/api/productos/" + id + "/");
        setFormData({
          nombre: productoResponse.data.nombre,
          stock_minimo: productoResponse.data.stock_minimo,
          peso: productoResponse.data.peso,
          precio: productoResponse.data.precio,
          tipo: productoResponse.data.tipo,
          composicion: productoResponse.data.composicion.map((item) => {
            return {
              materia_prima_id: item.id,
              cantidad: item.cantidad,
            };
          }),
        });
      } catch (ex) {
        console.error("Error al cargar las materias primas o el producto:", ex);
      }
    };

    fetchData();
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
                  Editando Producto &apos;{formData.nombre}&apos;
                </MDTypography>
                <Link
                  to="/productos"
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
                      label="Nombre Producto"
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
                    <MDInput
                      label="Peso"
                      type="number"
                      fullWidth
                      name="peso"
                      required
                      value={formData.peso}
                      onChange={handleChange}
                    />
                    {errors.peso && <span className="formError">{errors.peso}</span>}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      label="Precio"
                      type="number"
                      fullWidth
                      required
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                    />
                    {errors.precio && <span className="formError">{errors.precio}</span>}
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
                        <MDInput type="text" {...params} label="Tipo Producto *" />
                      )}
                    />
                    {errors.tipo && <span className="formError">{errors.tipo}</span>}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={0} mb={1}>
                <Grid p={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={12} md={12}>
                    <MDTypography variant="h5">Materias primas del producto *</MDTypography>
                    {errors.composicion && <span className="formError">{errors.composicion}</span>}
                    {formData.composicion.map((item, index) => (
                      <Grid container alignItems="center" key={index}>
                        <Grid item xs={5}>
                          <MDTypography variant="subtitle2">{`Materia Prima: ${getLabelMateriaPrimabyId(
                            item.materia_prima_id
                          )}, Cantidad: ${item.cantidad}`}</MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          <MDButton
                            variant="gradient"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteComposicion(index)}
                          >
                            <Icon> delete </Icon>
                          </MDButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Autocomplete
                      value={newComposicion.materia_prima_id}
                      options={materiasPrimasOptions}
                      onChange={(event, newValue) =>
                        setNewComposicion({
                          ...newComposicion,
                          materia_prima_id: newValue,
                        })
                      }
                      renderInput={(params) => (
                        <MDInput {...params} type="text" label="Materia Prima" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="number"
                      label="Cantidad"
                      fullWidth
                      name="cantidad"
                      value={newComposicion.cantidad}
                      onChange={handleComposicionChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDButton variant="gradient" color="info" onClick={handleAddComposicion}>
                      Agregar Composición
                    </MDButton>
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

export default EditProductos;
