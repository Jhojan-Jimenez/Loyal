'use client';

import React from 'react';

export function GranolaWordmark() {
  return (
    <div className="w-full max-w-[1200px] mx-auto select-none pt-10 pb-12 px-4 sm:px-6">
      <div className="w-full flex items-center justify-center">
        {/* Monumental Vector Wordmark (1200 x 220 viewBox) */}
        <svg
          viewBox="0 0 1200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-[180px] sm:max-h-[220px] text-[#292929] transition-opacity duration-300"
          aria-label="Loyal Wordmark Monumental"
        >
          {/* Artisanal Seal Symbol (Circle with ink stamp star / leaf motif) */}
          <g transform="translate(40, 20)">
            <circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke="#292929"
              strokeWidth="12"
            />
            <circle
              cx="90"
              cy="90"
              r="68"
              fill="none"
              stroke="#B2C248"
              strokeWidth="4"
              strokeDasharray="6 6"
            />
            {/* Center Star / Leaf insignia */}
            <path
              d="M90 35 L96 75 L135 75 L104 98 L116 138 L90 114 L64 138 L76 98 L45 75 L84 75 Z"
              fill="#5B6F00"
            />
            <circle cx="90" cy="90" r="12" fill="#FCFCF8" />
          </g>

          {/* Bold Lettering: L O Y A L */}
          <text
            x="300"
            y="152"
            fill="#292929"
            fontFamily="Georgia, 'Libre Baskerville', serif"
            fontSize="158"
            fontWeight="400"
            letterSpacing="-0.03em"
          >
            LOYAL
          </text>

          {/* Subtitle / Small Craft Stamp Text */}
          <text
            x="960"
            y="95"
            fill="#72726E"
            fontFamily="system-ui, sans-serif"
            fontSize="16"
            fontWeight="500"
            letterSpacing="0.25em"
          >
            HERRAMIENTAS DE PAPEL
          </text>
          <text
            x="960"
            y="125"
            fill="#5B6F00"
            fontFamily="system-ui, sans-serif"
            fontSize="14"
            fontWeight="600"
            letterSpacing="0.15em"
          >
            EDICIÓN DIGITAL 2026
          </text>
          <text
            x="960"
            y="150"
            fill="#72726E"
            fontFamily="system-ui, sans-serif"
            fontSize="13"
            letterSpacing="0.05em"
          >
            BOGOTÁ · COLOMBIA
          </text>
        </svg>
      </div>

      {/* Terminal Green Strip at bottom edge */}
      <div className="w-full h-1.5 rounded-full bg-[#5B6F00] mt-8 opacity-90" />
    </div>
  );
}
