import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Diamond/Rhombus shaped paths */}
      <div className="absolute top-20 right-20 w-96 h-96">
        <div
          className="w-full h-full border border-white/5 transform rotate-45 animate-spin"
          style={{
            animationDuration: "20s",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        ></div>
        <div
          className="absolute top-8 left-8 w-80 h-80 border border-purple-500/10 transform rotate-45 animate-spin"
          style={{
            animationDuration: "15s",
            animationDirection: "reverse",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        ></div>
      </div>

      <div className="absolute bottom-32 left-32 w-80 h-80">
        <div
          className="w-full h-full border border-white/5 transform rotate-45 animate-spin"
          style={{
            animationDuration: "25s",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        ></div>
        <div
          className="absolute top-6 left-6 w-68 h-68 border border-blue-500/10 transform rotate-45 animate-spin"
          style={{
            animationDuration: "18s",
            animationDirection: "reverse",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        ></div>
      </div>

      {/* Floating diamond/rhombus shapes */}
      <div
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-purple-400/20 to-pink-400/20 transform rotate-45 animate-bounce"
        style={{ animationDuration: "3s", animationDelay: "0s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-6 h-6 bg-gradient-to-r from-blue-400/20 to-purple-400/20 transform rotate-45 animate-bounce"
        style={{ animationDuration: "3s", animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-3 h-3 bg-gradient-to-r from-pink-400/20 to-purple-400/20 transform rotate-45 animate-bounce"
        style={{ animationDuration: "3s", animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-gradient-to-r from-green-400/20 to-blue-400/20 transform rotate-45 animate-bounce"
        style={{ animationDuration: "3s", animationDelay: "0.5s" }}
      ></div>

      {/* Large diamond outlines */}
      <div
        className="absolute top-1/3 left-1/2 w-32 h-32 border border-purple-400/10 transform rotate-45 animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>
      <div
        className="absolute bottom-1/3 right-1/2 w-24 h-24 border border-pink-400/10 transform rotate-45 animate-pulse"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      ></div>

      {/* Subtle gradient overlays */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-500/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
    </div>
  );
};

export default AnimatedBackground;
