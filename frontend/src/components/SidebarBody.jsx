import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { Home, ClipboardList, User, Settings, Power, Receipt } from "lucide-react";

// Icon components from lucide-react
const HomeIcon = () => <Home size={20} />;
const CategoryIcon = () => <ClipboardList size={20} />;
const ExpenseIcon = () => <Receipt size={20} />;
const SettingsIcon = () => <Settings size={20} />;
const PowerIcon = () => <Power size={20} />;

const SidebarBody = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const activeSection =
    location.pathname === "/" ? "home" : location.pathname.substring(1);

  const navLinkSpanClass =
    "transition-all duration-300 group-hover/sidebar:bg-gradient-to-r group-hover/sidebar:from-purple-400 group-hover/sidebar:via-pink-400 group-hover/sidebar:to-orange-300 group-hover/sidebar:bg-clip-text group-hover/sidebar:text-transparent";

  const navLinks = [
    { label: "HOME", path: "/", icon: <HomeIcon /> },
    { label: "CATEGORY", path: "/category", icon: <CategoryIcon /> },
    { label: "EXPENSE", path: "/expense", icon: <ExpenseIcon /> },
  ];

  const NavLink = ({ link, isActive }) => (
    <button
      onClick={() => navigate(link.path)}
      className={`group/sidebar flex items-center transition-all duration-200 mb-2 relative
        ${isActive ? "text-white" : "text-gray-400"}`}
    >
      <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
        <div
          className={`
            absolute inset-0 rounded-xl transition-all duration-200 flex items-center justify-center
            ${
              isActive
                ? "bg-gradient-to-br from-purple-500 via-pink-400 to-orange-300 opacity-100"
                : "opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:bg-white/20"
            }
          `}
        />
        <div className="relative z-10 flex items-center justify-center">
          {link.icon}
        </div>
      </div>
      <span
        className={`ml-4 text-base font-semibold uppercase tracking-wide whitespace-nowrap transition-all duration-200
        ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        ${navLinkSpanClass}
      `}
      >
        {link.label}
      </span>
    </button>
  );

  const SettingsLink = () => {
    const isActive = location.pathname === "/settings";
    return (
      <button
        className={`group/sidebar flex items-center transition-all duration-200 text-gray-400 relative ${
          isActive ? "text-white" : ""
        }`}
        onClick={() => navigate("/settings")}
      >
        <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
          <div
            className={`
              absolute inset-0 rounded-xl transition-all duration-200 flex items-center justify-center
              ${
                isActive
                  ? "bg-gradient-to-br from-purple-500 via-pink-400 to-orange-300 opacity-100"
                  : "opacity-0 group-hover/sidebar:opacity-100 group-hover/sidebar:bg-white/20"
              }
            `}
          />
          <div className="relative z-10 flex items-center justify-center">
            <SettingsIcon />
          </div>
        </div>
        <span
          className={`ml-4 text-base font-semibold uppercase tracking-wide whitespace-nowrap transition-all duration-200 ${
            open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          } ${navLinkSpanClass}`}
        >
          SETTINGS
        </span>
      </button>
    );
  };

  const LogoutButton = () => (
    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      className="group/sidebar flex items-center transition-all duration-200 relative text-gray-400 w-full mt-2"
    >
      <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
        <div
          className={`
            absolute inset-0 rounded-xl transition-all duration-200 flex items-center justify-center
            group-hover/sidebar:bg-white/20 group-hover/sidebar:opacity-100
          `}
        />
        <div className="relative z-10 flex items-center justify-center">
          <PowerIcon />
        </div>
      </div>
      <span
        className={`ml-4 text-base font-semibold uppercase tracking-wide whitespace-nowrap transition-all duration-200 ${
          open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        } ${navLinkSpanClass}`}
      >
        Logout
      </span>
    </button>
  );

  return (
    <>
      <div className="flex flex-col gap-2 items-start mt-2 flex-1">
        {navLinks.map((link) => {
          const isActive =
            activeSection === link.label.toLowerCase() ||
            location.pathname === link.path;
          return <NavLink key={link.label} link={link} isActive={isActive} />;
        })}
        <SettingsLink />
      </div>
      <div className="flex flex-col items-start mb-2">
        <LogoutButton />
      </div>
    </>
  );
};

export default SidebarBody;
