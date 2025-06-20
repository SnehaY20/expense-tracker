import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../auth/api";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      setLoading(false);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="register"
      fields={[
        {
          name: "name",
          type: "text",
          value: name,
          onChange: (e) => setName(e.target.value),
          placeholder: "Name",
        },
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
        {
          name: "confirmPassword",
          type: "password",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          placeholder: "Confirm Password",
        },
      ]}
      onSubmit={handleSubmit}
      error={error}
      success={success}
      loading={loading}
      leftButton={null}
      rightButton={
        <>
          <button
            type="submit"
            className="w-full px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="flex justify-end mt-4 w-full">
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white hover:bg-white/10 hover:scale-105"
              type="button"
              onClick={() => (window.location.href = "/login")}
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
  );
};

export default Register;
