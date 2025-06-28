import React from "react";
import { Routes, Route } from "react-router-dom";
import useAuthInterceptor from "../hooks/useAuthInterceptor";

import Home from "../pages/Home";
import Category from "../pages/Category";
import Dashboard from "../pages/Dashboard";
import Expenses from "../pages/Expenses";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

import AppLayout from "../layouts/AppLayout";
import BackgroundLayout from "../components/BackgroundLayout";
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
          path="/profile"
          element={
            <ProtectedRoute>
              <BackgroundLayout>
                <Profile />
              </BackgroundLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppLayout>
  );
};

export default AppRoutes;
