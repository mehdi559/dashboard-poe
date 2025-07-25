import React from "react";

const FinanceLogo = ({ size = 40, className = "" }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Cercle de base */}
      <circle cx="20" cy="20" r="18" fill="url(#gradient1)" />
      {/* Graphique trending up */}
      <path
        d="M10 25 L15 20 L20 15 L25 10 L30 8"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Points sur la courbe */}
      <circle cx="15" cy="20" r="1.5" fill="white" />
      <circle cx="20" cy="15" r="1.5" fill="white" />
      <circle cx="25" cy="10" r="1.5" fill="white" />
      {/* Coin symbole € */}
      <text x="28" y="14" fontSize="8" fill="white" fontWeight="bold">€</text>
    </svg>
  </div>
);

export default FinanceLogo; 