// src/components/MateriasPrimasList.js

import React from "react";
import "./MateriasPrimasList.css";
import PropTypes from "prop-types";

const MateriasPrimasList = ({ items }) => {
  return (
    <div className="list-container">
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            {item.nombre} - x({item.cantidad})
          </li>
        ))}
      </ul>
    </div>
  );
};
// Setting default values for the props of MateriasPrimasList
MateriasPrimasList.defaultProps = {
  items: [],
};

// Typechecking props for the MateriasPrimasList
MateriasPrimasList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ),
};
export default MateriasPrimasList;
