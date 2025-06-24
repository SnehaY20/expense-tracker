import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./store/AuthStore";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnboardingPage from "./pages/OnboardingPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route
              path="/"
              element={
                <AppLayout>
                  <Home />
                </AppLayout>
              }
            />
            <Route
              path="/category"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Category />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Expenses />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AppLayout>
                  <Login />
                </AppLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AppLayout>
                  <Register />
                </AppLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
