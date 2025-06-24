import React from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import Navbar from "../components/Navbar";
import { useAuth } from "../store/AuthStore";

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return (
    <BackgroundLayout>
      {isLoggedIn && <Navbar />}
      {children}
    </BackgroundLayout>
  );
};

export default AppLayout;
