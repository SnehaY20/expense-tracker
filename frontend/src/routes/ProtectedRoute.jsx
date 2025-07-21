import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authChecked } = useAuth();
  if (!authChecked) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
