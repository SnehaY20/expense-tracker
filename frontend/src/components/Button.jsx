import React from "react";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
