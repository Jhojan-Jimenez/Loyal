'use client';

import React from 'react';

interface GranolaCollageProps {
  className?: string;
  variant?: 'hero' | 'closing';
}

export function GranolaCollage({ className = '', variant = 'hero' }: GranolaCollageProps) {
  if (variant === 'closing') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
        {/* Scrap 1: Chartreuse Printed Paper Scrap */}
        <div className="absolute -top-12 -left-16 w-80 h-96 bg-[#B2C248] rounded-xl transform -rotate-6 opacity-35 blur-[0.5px]">
          <svg className="w-full h-full opacity-40 mix-blend-multiply" viewBox="0 0 200 200">
            <defs>
              <pattern id="closing-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#292929" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#closing-dots)" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#292929" strokeWidth="1" strokeDasharray="3 3" />
            <text x="20" y="180" fontFamily="serif" fontSize="42" fill="#292929" opacity="0.3">
              PRINT
            </text>
          </svg>
        </div>

        {/* Scrap 2: Charcoal Ink Diagram Paper */}
        <div className="absolute -bottom-10 -right-12 w-96 h-80 bg-[#292929] rounded-2xl transform rotate-3 opacity-25">
          <svg className="w-full h-full opacity-60" viewBox="0 0 240 200">
            <line x1="20" y1="20" x2="220" y2="20" stroke="#FCFCF8" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="20" y1="60" x2="220" y2="60" stroke="#FCFCF8" strokeWidth="0.5" />
            <line x1="20" y1="100" x2="220" y2="100" stroke="#FCFCF8" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="20" y1="140" x2="220" y2="140" stroke="#FCFCF8" strokeWidth="0.5" />
            <circle cx="180" cy="100" r="45" fill="none" stroke="#B2C248" strokeWidth="1" />
            <text x="30" y="50" fontFamily="sans-serif" fontSize="10" fill="#FCFCF8" letterSpacing="2">
              FIG. 04 — REGISTRO VÁLIDO
            </text>
          </svg>
        </div>

        {/* Scrap 3: Warm halftone sunburst */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[440px] bg-[#E5EACD] rounded-3xl transform rotate-1 opacity-45 -z-10" />
      </div>
    );
  }

  // Hero Asymmetric Stage Collage
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {/* 1. Underlying Chartreuse Printed Paper Scrap (#B2C248) */}
      <div className="absolute -top-8 -right-10 w-[380px] sm:w-[480px] h-[340px] sm:h-[420px] bg-[#B2C248] rounded-2xl transform rotate-3 shadow-sm opacity-90 transition-transform duration-700">
        <svg className="w-full h-full" viewBox="0 0 400 350">
          <defs>
            <pattern id="halftone-hero" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.2" fill="#292929" fillOpacity="0.18" />
            </pattern>
          </defs>
          <rect width="400" height="350" fill="url(#halftone-hero)" />
          {/* Faint diagram curves & marks */}
          <path
            d="M 40 40 Q 200 120 360 80 T 380 320"
            fill="none"
            stroke="#292929"
            strokeWidth="0.75"
            strokeOpacity="0.25"
          />
          <circle cx="280" cy="180" r="60" fill="none" stroke="#292929" strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity="0.3" />
          <text
            x="30"
            y="310"
            fontFamily="Georgia, serif"
            fontSize="54"
            fill="#292929"
            fillOpacity="0.14"
            letterSpacing="-0.03em"
          >
            LOYAL·01
          </text>
        </svg>
      </div>

      {/* 2. Charcoal Ink Diagram Scrap (#292929) overlapping at bottom-left of stage */}
      <div className="absolute -bottom-10 -left-6 w-[280px] sm:w-[340px] h-[220px] sm:h-[260px] bg-[#292929] rounded-xl transform -rotate-4 shadow-md opacity-85">
        <svg className="w-full h-full p-4" viewBox="0 0 300 220">
          {/* Fine technical millimeter registration marks */}
          <line x1="20" y1="30" x2="280" y2="30" stroke="#FCFCF8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.3" />
          <line x1="20" y1="80" x2="280" y2="80" stroke="#FCFCF8" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="20" y1="130" x2="280" y2="130" stroke="#FCFCF8" strokeWidth="0.5" strokeDasharray="2 4" strokeOpacity="0.3" />
          <line x1="20" y1="180" x2="280" y2="180" stroke="#FCFCF8" strokeWidth="0.5" strokeOpacity="0.2" />
          <circle cx="210" cy="100" r="32" fill="none" stroke="#E5EACD" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="210" cy="100" r="4" fill="#E5EACD" strokeOpacity="0.8" />
          <text x="24" y="60" fontFamily="sans-serif" fontSize="10" fill="#FCFCF8" letterSpacing="1.5" opacity="0.6">
            REF: 757B-GRANOLA
          </text>
          <text x="24" y="165" fontFamily="sans-serif" fontSize="9" fill="#E5EACD" opacity="0.7">
            ESTAMPA DIGITAL EN 0.8S
          </text>
        </svg>
      </div>

      {/* 3. Pale Olive craft note sheet (#E5EACD) */}
      <div className="absolute top-28 -right-8 w-48 h-56 bg-[#E5EACD] rounded-lg transform -rotate-2 opacity-75 border border-[#D5D5D2]/40" />
    </div>
  );
}
