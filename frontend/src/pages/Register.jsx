import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import AuthForm from "../components/AuthForm";
import BackgroundLayout from "../components/BackgroundLayout";
import Button from "../components/Button";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      showSuccessToast("Registration successful! Please login.");
      navigate("/onboarding");
    } catch (err) {
      const errorMessage =
        err.message || "Something went wrong. Please try again.";
      showErrorToast(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <AuthForm
        mode="register"
        fields={[
          {
            name: "name",
            type: "text",
            value: form.name,
            onChange: handleChange,
            placeholder: "Name",
          },
          {
            name: "email",
            type: "email",
            value: form.email,
            onChange: handleChange,
            placeholder: "Email",
          },
          {
            name: "password",
            type: "password",
            value: form.password,
            onChange: handleChange,
            placeholder: "Password",
          },
          {
            name: "confirmPassword",
            type: "password",
            value: form.confirmPassword,
            onChange: handleChange,
            placeholder: "Confirm Password",
          },
        ]}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        leftButton={null}
        rightButton={
          <>
            <Button
              type="submit"
              className="w-full px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !form.name ||
                !form.email ||
                !form.password ||
                !form.confirmPassword ||
                loading
              }
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            <Button
              className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white hover:bg-white/10 hover:scale-105"
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              <span>Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Button>
          </>
        }
      />
    </BackgroundLayout>
  );
};

export default Register;
