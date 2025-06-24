import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { loginUser } from "../api/auth";
import { useAuth } from "../store/AuthStore";
import AuthForm from "../components/AuthForm";
import BackgroundLayout from "../components/BackgroundLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      login();
      navigate("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    mutation.mutate({ email, password });
  };

  const getErrorMessage = () => {
    if (mutation.isError) {
      return (
        mutation.error?.response?.data?.message ||
        mutation.error?.message ||
        "Login failed. Please try again."
      );
    }
    return "";
  };

  return (
    <BackgroundLayout>
      <AuthForm
        mode="login"
        fields={[
          {
            name: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Email",
          },
          {
            name: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "Password",
          },
        ]}
        onSubmit={handleLogin}
        error={getErrorMessage()}
        loading={mutation.isLoading}
        leftButton={
          <button
            onClick={() => navigate("/register")}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-white/10 transition duration-200"
            type="button"
          >
            <ChevronLeft size={20} />
            <span>Register</span>
          </button>
        }
        rightButton={
          <button
            type="submit"
            disabled={mutation.isLoading || !email || !password}
            className="w-full px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition transform hover:scale-105 disabled:opacity-50"
          >
            {mutation.isLoading ? "Logging in..." : "Login"}
          </button>
        }
      />
    </BackgroundLayout>
  );
};

export default Login;
