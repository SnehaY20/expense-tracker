import React from "react";
import { Routes, Route } from "react-router-dom";
import useAuthInterceptor from "../hooks/useAuthInterceptor";

import Home from "../pages/Home";
import Expenses from "../pages/Expenses";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

import SettingsLayout from "../pages/SettingsLayout";

import AppLayout from "../layouts/AppLayout";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  useAuthInterceptor();

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
       
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
              <SettingsLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AppLayout>
  );
};

export default AppRoutes;
