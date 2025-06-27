import React from "react";
import { Routes, Route } from "react-router-dom";
import useAuthInterceptor from "../hooks/useAuthIterceptor"

import Home from "../pages/Home";
import Category from "../pages/Category";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

import AppLayout from "../layouts/AppLayout";
import BackgroundLayout from "../components/BackgroundLayout";
import ProtectedRoute from "./ProtectedRoute"

const AppRoutes = () => {
  useAuthInterceptor(); 

  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/category" element={<ProtectedRoute><AppLayout><Category /></AppLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/expense" element={<ProtectedRoute><AppLayout><Expenses /></AppLayout></ProtectedRoute>} />
      <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
      <Route path="/profile" element={<ProtectedRoute><BackgroundLayout><Profile /></BackgroundLayout></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
