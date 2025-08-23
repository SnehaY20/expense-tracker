import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); 

  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime + 300) {
        return true;
      }
      
      return false;
    } catch (error) {
      return true;
    }
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    
    if (!token || isTokenExpired(token)) {
      if (token) {
        localStorage.removeItem("token");
      }
      setIsLoggedIn(false);
      return false;
    }
    
    setIsLoggedIn(true);
    return true;
  }, [isTokenExpired]);

  const forceLogout = useCallback((navigate) => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    if (navigate) {
      navigate('/login', { replace: true });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
    setAuthChecked(true); 
    
    const interval = setInterval(checkAuthStatus, 60000);
    
    const onStorage = () => checkAuthStatus();
    window.addEventListener("storage", onStorage);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [checkAuthStatus]);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback((navigate) => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    if (navigate) {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout, 
      forceLogout,
      checkAuthStatus, 
      authChecked,
      isTokenExpired 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
