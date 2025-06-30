import React from "react";
import { Routes, Route } from "react-router-dom";
import useAuthInterceptor from "../hooks/useAuthInterceptor";

import Home from "../pages/Home";
import Category from "../pages/Category";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Settings from "../pages/Settings";

import AppLayout from "../layouts/AppLayout";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  useAuthInterceptor();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
};

export default AppRoutes;
