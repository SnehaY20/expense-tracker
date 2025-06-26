import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 ${className}`}
  >
    {children}
  </div>
);

export default Card;
