import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = ["HOME", "CATEGORY", "EXPENSE", "DASHBOARD"];

const navLinkSpanClass =
  "transition-all duration-300 group-hover/navlink:bg-gradient-to-r group-hover/navlink:from-purple-400 group-hover/navlink:via-pink-400 group-hover/navlink:to-orange-300 group-hover/navlink:bg-clip-text group-hover/navlink:text-transparent";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveSection = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    return path.substring(1);
  };

  const activeSection = getActiveSection();

  const handleNavClick = (section) => {
    const route = section === "home" ? "/" : `/${section}`;
    setMobileMenuOpen(false);
    navigate(route);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const isProfilePage = location.pathname === "/profile";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full max-w-full px-0 flex items-center justify-center mt-4">
      <div
        className="absolute left-6 inset-y-0 flex items-center text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent select-none cursor-pointer"
        onClick={() => navigate("/")}
      >
        Expense
      </div>
      <div className="mx-auto px-4 py-3 flex items-center justify-between rounded-xl bg-white/5 shadow-md backdrop-blur-md border border-white/10 max-w-fit lg:px-6 lg:py-3 space-x-10 transition-all duration-300">
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((section) => (
            <button
              key={section}
              onClick={() => handleNavClick(section.toLowerCase())}
              className={`relative flex items-center text-base font-semibold tracking-wide uppercase text-gray-400 transition-all duration-300 group/navlink ${
                activeSection === section.toLowerCase() ? "text-white" : ""
              }`}
              style={{ letterSpacing: "0.08em" }}
            >
              <span className={navLinkSpanClass}>{section}</span>
            </button>
          ))}
        </div>
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {!isProfilePage && (
        <div className="absolute right-6 inset-y-0 flex items-center">
          <button
            className="flex items-center text-base font-semibold tracking-wide uppercase text-gray-400 transition-all duration-300 group/navlink cursor-pointer bg-none border-none shadow-none px-0 py-0"
            style={{ letterSpacing: "0.08em", background: "none" }}
            onClick={handleProfile}
          >
            <span className={navLinkSpanClass}>PROFILE</span>
          </button>
        </div>
      )}
      <div
        className={`lg:hidden absolute left-0 right-0 mt-2 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 rounded-2xl transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="px-6 py-4 space-y-4">
          {navLinks.map((section) => (
            <button
              key={section}
              onClick={() => handleNavClick(section.toLowerCase())}
              className={`block w-full text-left text-base font-semibold tracking-wide uppercase transition-colors duration-300 group/navlink ${
                activeSection === section.toLowerCase()
                  ? "text-white"
                  : "text-gray-400"
              }`}
              style={{ letterSpacing: "0.08em" }}
            >
              <span className={navLinkSpanClass}>{section}</span>
            </button>
          ))}
          {!isProfilePage && (
            <button
              className="block w-full text-left text-base font-semibold tracking-wide uppercase transition-colors duration-300 group/navlink cursor-pointer bg-none border-none shadow-none px-0 py-0 text-gray-400"
              style={{ letterSpacing: "0.08em", background: "none" }}
              onClick={handleProfile}
            >
              <span className={navLinkSpanClass}>PROFILE</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
