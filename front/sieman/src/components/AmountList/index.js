// src/components/AmountList.js

import React from "react";
import "./AmountList.css";
import PropTypes from "prop-types";

const AmountList = ({ items }) => {
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
// Setting default values for the props of AmountList
AmountList.defaultProps = {
  items: [],
};

// Typechecking props for the AmountList
AmountList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ),
};
export default AmountList;
