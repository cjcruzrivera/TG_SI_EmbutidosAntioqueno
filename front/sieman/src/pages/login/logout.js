// Componente Logout.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("userData");
    navigate("/login");
  }, [navigate]);

  return <div>Cerrando sesión...</div>;
};

export default Logout;
