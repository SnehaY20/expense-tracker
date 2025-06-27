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

      if (response.status === 401) {
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
