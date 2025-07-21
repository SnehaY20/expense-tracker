import React from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import Navbar from "../components/Navbar";
import { useAuth } from "../store/AuthStore";
import { Sidebar, SidebarContent, SidebarProvider } from "../components/Sidebar";
import { useLocation } from "react-router-dom";

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <BackgroundLayout>
      <div className="flex flex-col h-screen">
        <Navbar />
        {isLoggedIn && !hideNav ? (
          <SidebarProvider>
            <div className="flex flex-1 min-h-0 mt-16">
              <Sidebar>
                <SidebarContent />
              </Sidebar>
              <main className="flex-1 transition-all duration-300">
                {children}
              </main>
            </div>
          </SidebarProvider>
        ) : (
          children
        )}
      </div>
    </BackgroundLayout>
  );
};

export default AppLayout;
