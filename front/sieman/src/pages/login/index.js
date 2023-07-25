/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import axios from "axios";

import { useState, useEffect } from "react";

// react-router-dom components
import { useMaterialUIController, loginUser } from "context";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import MDAlert from "components/MDAlert";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-profile.jpeg";
import logo from "assets/images/logo.jpg";

function Login() {
  const [controller, dispatch] = useMaterialUIController();

  const [formData, setFormData] = useState({
    cedula: "",
    password: "",
  });

  useEffect(() => {
    // Aquí verificamos si el usuario ya está loggeado
    const userData = localStorage.getItem("userData");
    if (userData && userData != "{}") {
      navigate("/dashboard");
    }
  }, []);

  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  let navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleLogin = () => {
    setMensaje(null);
    setError(null);
    if (!formData.cedula || !formData.password) {
      setError("Por favor ingrese cédula y contraseña.");
      return;
    }

    axios
      .post("http://localhost:8000/api/login/", formData)
      .then((response) => {
        const userData = response.data.usuario_info;
        const msg = response.data.mensaje;
        setMensaje(msg);
        loginUser(dispatch, userData);
        navigate("/dashboard");
      })
      .catch((ex) => {
        setError("Cédula o contraseña incorrecta.");
        console.error("Error de conexion:", ex);
      });
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography
            variant="h4"
            fontWeight="medium"
            color="white"
            mt={1}
            textAlign="center"
            display="inline-block"
          >
            <MDAvatar src={logo} alt="profile-image" size="xxl" shadow="xl" />
          </MDTypography>
          <MDTypography variant="h4" fontWeight="medium" color="white">
            EMBUTIDOS ANTIOQUEÑO
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Cedula"
                fullWidth
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                placeholder="Cedula"
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Contraseña"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                required
              />
            </MDBox>
            {error && <MDAlert color="error">{error}</MDAlert>}
            {mensaje && <MDAlert color="info">{mensaje}</MDAlert>}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                Ingresar
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Login;
