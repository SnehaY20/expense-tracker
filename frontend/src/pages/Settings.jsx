import React, { useState } from "react";
import Profile from "./Profile";

const ProfileIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Settings = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="w-80 bg-white/10 backdrop-blur-md p-6 flex flex-col gap-4 rounded-2xl h-[calc(100vh-4rem)] shadow-2xl">
        <div className="text-xs text-gray-400 mb-2 font-bold tracking-widest">
          USER SETTINGS
        </div>
        <button
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-semibold text-base ${
            selected === "profile"
              ? "bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300 text-white"
              : "text-gray-300 hover:bg-white/20"
          }`}
          onClick={() => setSelected("profile")}
        >
          <span className="w-6 h-6 flex items-center justify-center">
            <ProfileIcon />
          </span>
          My Profile
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-8 h-[calc(100vh-4rem)]">
        {selected === "profile" && <Profile />}
      </div>
    </div>
  );
};

export default Settings;
