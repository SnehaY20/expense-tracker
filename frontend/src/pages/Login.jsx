import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { loginUser } from "../api/auth";
import { useAuth } from "../store/AuthStore";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import AuthForm from "../components/AuthForm";
import BackgroundLayout from "../components/BackgroundLayout";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

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
      showSuccessToast("Login successful! Welcome back!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
      showErrorToast(error.message || "Login failed. Please try again.");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showErrorToast("Please fill in all fields");
      return;
    }
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
          <Button
            type="submit"
            disabled={mutation.isPending || !email || !password}
            className="w-full px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105 disabled:opacity-50 flex items-center justify-center"
          >
            {mutation.isPending && <Spinner size="sm" className="mr-2" />}
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        }
      />
    </BackgroundLayout>
  );
};

export default Login;
