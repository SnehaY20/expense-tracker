import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthStore";

// Icon components
const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
);

const CategoryIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
  </svg>
);

const ExpenseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const DashboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PowerIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2v10" />
    <path d="M6.2 17.8A7 7 0 1 0 17.8 6.2" />
  </svg>
);

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
    { label: "DASHBOARD", path: "/dashboard", icon: <DashboardIcon /> },
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
        className={`group/sidebar flex items-center transition-all duration-200 mt-8 text-gray-400 relative ${
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
            <UserIcon />
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
