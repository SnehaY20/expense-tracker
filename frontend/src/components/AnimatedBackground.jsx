import React from "react";

const DiamondOutline = ({ size, borderColor, opacity, borderWidth }) => (
  <div
    className={`absolute ${borderWidth} ${borderColor}`}
    style={{
      width: size,
      height: size,
      opacity,
      transform: "rotate(45deg)",
    }}
  ></div>
);

const ShinyDiamond = ({ size }) => (
  <div
    className="absolute animate-spin-slow"
    style={{
      width: size,
      height: size,
      transform: "rotate(45deg)",
      background:
        "conic-gradient(from 0deg, #f2f2f2 0%, #ffffff 25%, #d0d0d0 50%, #ffffff 75%, #f2f2f2 100%)",
      WebkitMaskImage:
        "linear-gradient(white, white) border-box, linear-gradient(white, white)",
      WebkitMaskComposite: "destination-in",
      maskComposite: "intersect",
      border: "1.5px solid rgba(255,255,255,0.3)", 
      borderRadius: "0%",
      opacity: 0.35, 
      boxShadow: "0 0 12px rgba(255,255,255,0.2)", 
    }}
  ></div>
);


const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      {/* Static diamond outlines */}
      <DiamondOutline
        size="70vw"
        borderColor="border-white/10"
        borderWidth="border-[1.5px]"
        opacity={0.08}
        delay="0s"
      />
      <DiamondOutline
        size="55vw"
        borderColor="border-white/15"
        borderWidth="border-[1.5px]"
        opacity={0.1}
        delay="0.5s"
      />
      <DiamondOutline
        size="40vw"
        borderColor="border-white/20"
        borderWidth="border-[1.5px]"
        opacity={0.12}
      />
      <DiamondOutline
        size="25vw"
        borderColor="border-white/25"
        borderWidth="border-[1.5px]"
        opacity={0.14}
      />
      <DiamondOutline
        size="15vw"
        borderColor="border-white/30"
        borderWidth="border-[2px]"
        opacity={0.2}
      />

      {/* Matching animated diamond */}
      <ShinyDiamond size="15vw" />
    </div>
  );
};

export default AnimatedBackground;
