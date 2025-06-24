import React from "react";
import AnimatedBackground from "./AnimatedBackground";

const BackgroundLayout = ({ children }) => (
  <div className="relative w-full min-h-screen h-screen overflow-hidden bg-gradient-to-br from-[#223769] via-[#3C3976] via-50% to-[#1C1C2B]">
    {/* Glass base effect (cloudy circles removed) */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-full h-full blur-sm backdrop-blur-sm"></div>
    </div>

    {/* Droplets (static scatter) */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute w-[10px] h-[10px] top-[20%] left-[30%] bg-white/40 rounded-full blur-sm"></div>
      <div className="absolute w-[6px] h-[6px] top-[45%] left-[15%] bg-white/30 rounded-full blur-sm"></div>
      <div className="absolute w-[8px] h-[8px] top-[75%] left-[55%] bg-white/30 rounded-full blur-sm"></div>
      <div className="absolute w-[6px] h-[6px] top-[30%] left-[75%] bg-white/30 rounded-full blur-sm"></div>
      <div className="absolute w-[7px] h-[7px] top-[80%] left-[65%] bg-white/30 rounded-full blur-sm"></div>
    </div>

    {/* Glass shimmer */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent animate-[subtleShimmer_10s_ease-in-out_infinite_alternate] pointer-events-none"></div>

    {/* Animated shapes overlay */}
    <div className="absolute inset-0 z-10 pointer-events-none">
      <AnimatedBackground />
    </div>

    <div className="relative z-20 min-h-screen">{children}</div>
  </div>
);

export default BackgroundLayout;
