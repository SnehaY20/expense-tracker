import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full h-16 flex items-center px-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent select-none">
          Expense
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
