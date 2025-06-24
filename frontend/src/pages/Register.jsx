import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import AuthForm from "../components/AuthForm";
import BackgroundLayout from "../components/BackgroundLayout";

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
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
            <button
              type="submit"
              className="w-full px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !form.name ||
                !form.email ||
                !form.password ||
                !form.confirmPassword ||
                loading
              }
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <div className="flex justify-end mt-4 w-full">
              <button
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
              </button>
            </div>
          </>
        }
      />
    </BackgroundLayout>
  );
};

export default Register;
