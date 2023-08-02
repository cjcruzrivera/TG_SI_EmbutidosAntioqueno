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
import formatMoney from "utils/formatMoney";

import { useMaterialUIController } from "context";

function CreateRemisiones() {
  let navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const user = controller.user;

  const tiposOptions = ["Despacho", "POS", "RemisionNF"];
  const [productosOptions, setProductosOptions] = useState([]);
  const [productos, setProductos] = useState([]);

  const today = new Date();
  let todayString = today.toLocaleString().split(",")[0];
  const todayStringArr = todayString.split("/");
  todayString =
    todayStringArr[2] +
    "-" +
    (parseInt(todayStringArr[1]) < 10 ? "0" + todayStringArr[1] : todayStringArr[1]) +
    "-" +
    (parseInt(todayStringArr[0]) < 10 ? "0" + todayStringArr[0] : todayStringArr[0]);
  const [formData, setFormData] = useState({
    usuario: user.id,
    nombre_cliente: "",
    fecha_entrega: todayString,
    total: 0,
    tipo: "",
    pedido: [],
  });
  const [errors, setErrors] = useState([]);
  const [newPedido, setNewPedido] = useState({
    producto: "",
    cantidad: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePedidoChange = (e) => {
    const { name, value } = e.target;
    let max = 100;
    if (newPedido.producto) {
      max = getProductobyId(newPedido.producto.id).cantidad;
    }
    if (name === "cantidad") {
      if ((value <= 0 || value > max) && value !== "") {
        return;
      }
    }
    setNewPedido({
      ...newPedido,
      [name]: parseInt(value),
    });
  };

  const getProductobyId = (id) => {
    let product = productos.filter((item) => {
      return item?.producto.id === id;
    });
    return product ? product[0] : {};
  };

  const handleAddPedido = () => {
    if (newPedido.producto && newPedido.cantidad) {
      newPedido.producto = newPedido.producto.id;
      newPedido.precio_unitario = getProductobyId(newPedido.producto).producto.precio;

      let new_productos = productos.map((item) => {
        if (item?.producto.id === newPedido.producto) {
          item.cantidad = item.cantidad - newPedido.cantidad;
        }
        return item;
      });
      setProductos(new_productos);

      setFormData({
        ...formData,
        pedido: [...formData.pedido, newPedido],
        total: formData.total + newPedido.cantidad * newPedido.precio_unitario,
      });
      setNewPedido({
        producto: null,
        cantidad: "",
      });
      setErrors({ ...errors, ["pedido_agregar"]: "" });
    } else {
      setErrors({ ...errors, ["pedido_agregar"]: "Debe seleccionar un producto y una cantidad." });
    }
  };

  const handleDeletePedido = (index) => {
    let prod_id = formData.pedido[index].producto;
    let new_total =
      formData.total - formData.pedido[index].cantidad * formData.pedido[index].precio_unitario;
    console.log("formData", formData);
    let new_productos = productos.map((item) => {
      console.log("item", item);
      if (item?.producto.id === prod_id) {
        item.cantidad = item.cantidad + formData.pedido[index].cantidad;
      }
      return item;
    });

    setProductos(new_productos);
    const updatedPedido = formData.pedido.filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      pedido: updatedPedido,
      total: new_total,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setErrors([]);
    if (!formData.tipo) newErrors.tipo = "El tipo de remision es obligatorio.";
    if (!formData.pedido || formData.pedido.length === 0) {
      newErrors.pedido = "Debe seleccionar al menos un producto.";
    }
    if (!formData.fecha_entrega) newErrors.fecha_entrega = "La fecha de entrega es obligatoria.";
    if (!formData.nombre_cliente) delete formData.nombre_cliente;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post("http://localhost:8000/api/remisiones/", formData)
        .then((response) => {
          Swal.fire("¡Guardado!", "La remision ha sido registrado correctamente.", "success").then(
            (result) => {
              navigate("/remisiones");
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
    let productosToOptions = productos
      .filter((el) => el.cantidad > 0)
      .map((el) => {
        return {
          label:
            el.producto.nombre +
            " (disponible: " +
            el.cantidad +
            "). " +
            formatMoney(el.producto.precio) +
            " " +
            el.producto.tipo,
          id: el.producto.id,
        };
      });
    setProductosOptions(productosToOptions);
  }, [productos]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/inventario/productos/venta")
      .then((response) => {
        setProductos(response.data);
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
                  Registrando Nueva Remisión
                </MDTypography>
                <Link
                  to="/remisiones"
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
              <MDBox pt={3} mb={0}>
                <Grid p={3} pb={0} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="text"
                      label="Nombre Cliente"
                      fullWidth
                      name="nombre_cliente"
                      value={formData.nombre_cliente}
                      onChange={handleChange}
                    />
                    {errors.nombre_cliente && (
                      <span className="formError">{errors.nombre_cliente}</span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      label="Fecha de Entrega"
                      type="date"
                      fullWidth
                      placeholder="Fecha de Entrega"
                      name="fecha_entrega"
                      value={formData.fecha_entrega}
                      onChange={handleChange}
                    />
                    {errors.fecha_entrega && (
                      <span className="formError">{errors.fecha_entrega}</span>
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
                        <MDInput type="text" {...params} label="Tipo Remisión *" />
                      )}
                    />
                    {errors.tipo && <span className="formError">{errors.tipo}</span>}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={0} mb={1}>
                <Grid p={3} container columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} sm={12} md={12}>
                    {errors.detail && <span className="formError">{errors.detail}</span>}
                    <Grid container columnSpacing={2} rowSpacing={1}>
                      <Grid item xs={12} sm={12} md={6}>
                        <MDTypography variant="h5">Productos Seleccionados: *</MDTypography>
                      </Grid>
                      {formData.total !== 0 && (
                        <Grid item xs={12} sm={12} md={6}>
                          <MDTypography variant="h5">
                            Total {formatMoney(formData.total)}
                          </MDTypography>
                        </Grid>
                      )}
                    </Grid>
                    {errors.pedido && <span className="formError">{errors.pedido}</span>}
                    {formData.pedido.map((item, index) => (
                      <Grid container alignItems="center" key={index}>
                        <Grid item xs={5}>
                          <MDTypography variant="subtitle2">{`Producto: ${
                            getProductobyId(item?.producto)?.producto.nombre
                          }, Cantidad: ${item.cantidad}`}</MDTypography>
                        </Grid>
                        <Grid item xs={3}>
                          <MDTypography variant="subtitle2">{`${formatMoney(
                            item.precio_unitario
                          )} ${getProductobyId(item?.producto)?.producto.tipo}  `}</MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <MDTypography variant="subtitle2">{`${formatMoney(
                            item.cantidad * item.precio_unitario
                          )}`}</MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          <MDButton
                            variant="gradient"
                            color="error"
                            size="small"
                            className="fake-link"
                            onClick={() => handleDeletePedido(index)}
                          >
                            <Icon> delete </Icon>
                          </MDButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item xs={12} sm={8} md={5}>
                    <Autocomplete
                      value={newPedido.producto}
                      options={productosOptions}
                      onChange={(event, newValue) => {
                        if (!newValue) {
                          setNewPedido({
                            ...newPedido,
                            producto: null,
                          });
                          return;
                        }
                        const prodObj = getProductobyId(newValue.id);
                        if (newPedido.cantidad > prodObj.cantidad) {
                          setNewPedido({
                            producto: newValue,
                            cantidad: prodObj.cantidad,
                          });
                        } else {
                          setNewPedido({
                            ...newPedido,
                            producto: newValue,
                          });
                        }
                      }}
                      renderInput={(params) => <MDInput {...params} type="text" label="Producto" />}
                    />
                    {errors.pedido_agregar && (
                      <span className="formError">{errors.pedido_agregar}</span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <MDInput
                      type="number"
                      label="Cantidad"
                      fullWidth
                      name="cantidad"
                      value={newPedido.cantidad}
                      onChange={handlePedidoChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MDButton variant="gradient" color="info" onClick={handleAddPedido}>
                      Agregar a Pedido
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

export default CreateRemisiones;
