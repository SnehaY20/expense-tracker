import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); 

  // Check if token is expired
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    
    try {
      // Decode JWT token to check expiration
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
      // Clear expired/invalid token
      if (token) {
        localStorage.removeItem("token");
      }
      setIsLoggedIn(false);
      return false;
    }
    
    setIsLoggedIn(true);
    return true;
  }, [isTokenExpired]);

  const forceLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    checkAuthStatus();
    setAuthChecked(true); 
    
    // Check auth status every minute to catch expired tokens
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

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = '/login';
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
