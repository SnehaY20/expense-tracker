import React, { useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthStore";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
const IconMenu2 = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconX = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

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

const SettingsIcon = () => (
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

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const activeSection =
    location.pathname === "/" ? "home" : location.pathname.substring(1);
  const navLinkSpanClass =
    "transition-all duration-300 group-hover/sidebar:bg-gradient-to-r group-hover/sidebar:from-purple-400 group-hover/sidebar:via-pink-400 group-hover/sidebar:to-orange-300 group-hover/sidebar:bg-clip-text group-hover/sidebar:text-transparent";
  const { open } = useSidebar();

  const navLinks = [
    { label: "HOME", path: "/", icon: <HomeIcon /> },
    { label: "CATEGORY", path: "/category", icon: <SettingsIcon /> },
    { label: "EXPENSE", path: "/expense", icon: <UserIcon /> },
    { label: "DASHBOARD", path: "/dashboard", icon: <IconMenu2 /> },
  ];

  return (
    <>
      <DesktopSidebar {...props}>
        <div className="flex flex-col gap-2 items-start mt-2 flex-1">
          {navLinks.map((link) => {
            const isActive =
              activeSection === link.label.toLowerCase() ||
              location.pathname === link.path;
            return (
              <button
                key={link.label}
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
                  ${
                    open
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }
                  ${navLinkSpanClass}
                `}
                >
                  {link.label}
                </span>
              </button>
            );
          })}
          <button
            className={`group/sidebar flex items-center transition-all duration-200 mt-8 text-gray-400 relative ${
              location.pathname === "/profile" ? "text-white" : ""
            }`}
            onClick={() => navigate("/profile")}
          >
            <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
              <div
                className={`
                  absolute inset-0 rounded-xl transition-all duration-200 flex items-center justify-center
                  ${
                    location.pathname === "/profile"
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
              PROFILE
            </span>
          </button>
        </div>
        <div className="flex flex-col items-start mb-2">
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
        </div>
        {props.children}
      </DesktopSidebar>
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <div
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] px-2 py-4 hidden md:flex md:flex-col bg-white/10 w-[80px] hover:w-[260px] transition-all duration-300 border-r border-white/10 z-50",
        open && "w-[260px]",
        className
      )}
      onMouseEnter={() => animate && setOpen(true)}
      onMouseLeave={() => animate && setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-900 border-b border-white/10 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <button
            onClick={() => setOpen(!open)}
            className="text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors"
          >
            <IconMenu2 />
          </button>
        </div>
        {open && (
          <div
            className={cn(
              "fixed h-full w-full inset-0 bg-neutral-900 p-10 z-[100] flex flex-col justify-between transition-all duration-300",
              className
            )}
          >
            <button
              className="absolute right-10 top-10 z-50 text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </button>
            {children}
          </div>
        )}
      </div>
    </>
  );
};
