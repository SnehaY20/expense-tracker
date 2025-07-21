import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthStore";

const useAuthInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggedIn } = useAuth();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const url = args[0];
      const method = args[1]?.method || "GET";
      const isPasswordUpdate =
        typeof url === "string" &&
        url.includes("/api/v1/auth/") &&
        method === "PUT" &&
        !url.includes("/login") &&
        !url.includes("/register");

      if (response.status === 401 && !isPasswordUpdate) {
        if (isLoggedIn) {
          logout();
          navigate("/login", { replace: true });
        } 
        else if (location.pathname === "/" && document.querySelector('[data-overview]')) {
          logout();
          navigate("/login", { replace: true });
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [logout, navigate, isLoggedIn, location.pathname]);
};

export default useAuthInterceptor;