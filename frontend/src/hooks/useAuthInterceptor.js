import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";

const useAuthInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Don't redirect for password update endpoints (401 is expected for wrong current password)
      const url = args[0];
      const method = args[1]?.method || "GET";
      const isPasswordUpdate =
        typeof url === "string" &&
        url.includes("/api/v1/auth/") &&
        method === "PUT" &&
        !url.includes("/login") &&
        !url.includes("/register");

      if (response.status === 401 && !isPasswordUpdate) {
        logout();
        navigate("/login");
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [logout, navigate]);
};

export default useAuthInterceptor;
