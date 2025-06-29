import React from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import Navbar from "../components/Navbar";
import { useAuth } from "../store/AuthStore";
import { Sidebar, SidebarBody } from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <BackgroundLayout>
      {isLoggedIn && !hideNav && <Navbar />}
      {isLoggedIn && !hideNav ? (
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarBody />
          </Sidebar>
          <main className="flex-1">{children}</main>
        </div>
      ) : (
        children
      )}
    </BackgroundLayout>
  );
};

export default AppLayout;
