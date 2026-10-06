import React from "react";
import logoWhite from "../assets/images/logo white.jpg";
import logoBlack from "../assets/images/logo black.jpg";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function Logo({ className = "h-14", variant = "light" }: LogoProps) {
  // variant === "light" is for light backgrounds (renders logoBlack)
  // variant === "dark" is for dark backgrounds (renders logoWhite)
  const logoSrc = variant === "light" ? logoBlack : logoWhite;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt="Cool J Expeditions Logo"
        className="h-12 w-auto object-contain transition-all duration-300 hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="flex flex-col text-left">
        <span className="font-serif font-black text-base sm:text-lg text-[#0b3d2e] leading-tight tracking-tight uppercase">
          Cool J
        </span>
        <span className="font-sans font-bold text-[10px] sm:text-xs text-[#C9A24A] tracking-wider uppercase -mt-0.5">
          Expeditions
        </span>
      </div>
    </div>
  );
}
