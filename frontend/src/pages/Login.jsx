import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      setLoggedIn(true);
    },
  });

  const handleLogin = () => {
    mutation.mutate({ email, password });
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500 mb-4">
            Logged in successfully
          </h1>
        </div>
      </div>
    );
  }

  return (
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
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      error={mutation.isError ? "Please fill in all fields." : ""}
      loading={mutation.isLoading}
      leftButton={
        <button
          onClick={() => navigate("/register")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white hover:bg-white/10 hover:scale-105`}
          type="button"
        >
          <ChevronLeft size={20} />
          <span>Register</span>
        </button>
      }
      rightButton={
        <button
          type="submit"
          className="w-full px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Logging in..." : "Login"}
        </button>
      }
    />
  );
};

export default Login;
