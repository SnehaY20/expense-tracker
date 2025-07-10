import React from "react";

const Button = ({ children, className = "", variant, ...props }) => {
  let baseClass = "rounded-lg font-semibold transition ";
  if (variant === "gray") {
    baseClass += "bg-gray-600 hover:bg-gray-700 text-white ";
  } else {
    baseClass += "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 ";
  }
  return (
    <button
      className={`${baseClass}${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
