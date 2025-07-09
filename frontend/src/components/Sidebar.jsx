import React, { useState, createContext, useContext } from "react";
import SidebarBody from "./SidebarBody";

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

export const SidebarContent = (props) => {
  const { open } = useSidebar();
  return (
    <>
      <DesktopSidebar {...props}>
        <SidebarBody open={open} />
        {props.children}
      </DesktopSidebar>
      <MobileSidebar {...props}>
        <SidebarBody open={open} />
        {props.children}
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <div
      className={cn(
        "relative h-full px-2 py-4 hidden md:flex md:flex-col transition-all duration-300",
        open ? "w-[190px]" : "w-[80px]",
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
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between w-full z-[1000]",
          className
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
              "fixed h-full w-full inset-0 p-10 z-[1000] flex flex-col justify-between transition-all duration-300",
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
