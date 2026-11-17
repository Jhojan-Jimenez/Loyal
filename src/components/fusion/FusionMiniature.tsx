'use client';

import React from 'react';

interface MiniatureProps {
  type: 'stamp' | 'wallet' | 'bell' | 'scanner' | 'analytics' | 'coffee' | 'scissors' | 'gift';
  size?: number;
  className?: string;
}

export function FusionMiniature({ type, size = 96, className = '' }: MiniatureProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ground Contact Shadow (soft warm blurred ellipse) */}
      <svg
        className="absolute bottom-1 w-[80%] h-[18px] pointer-events-none"
        viewBox="0 0 100 24"
        fill="none"
      >
        <ellipse
          cx="50"
          cy="12"
          rx="42"
          ry="7"
          fill="rgba(40, 30, 15, 0.14)"
          filter="blur(3px)"
        />
      </svg>

      {/* 3D Tactile Object SVG with Granola Warm Organic Palette */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Granola Warm Gradients: Olive, Clay, Warm Wood, Brass */}
          <linearGradient id="fusionOliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7E9600" />
            <stop offset="50%" stopColor="#5B6F00" />
            <stop offset="100%" stopColor="#455500" />
          </linearGradient>

          <linearGradient id="fusionClayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97757" />
            <stop offset="50%" stopColor="#C26748" />
            <stop offset="100%" stopColor="#A34F33" />
          </linearGradient>

          <linearGradient id="fusionLimeAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4E470" />
            <stop offset="60%" stopColor="#B2C248" />
            <stop offset="100%" stopColor="#8C9C28" />
          </linearGradient>

          <linearGradient id="woodLight" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#F5E6D3" />
            <stop offset="40%" stopColor="#E2CDB5" />
            <stop offset="100%" stopColor="#BE9D7E" />
          </linearGradient>

          <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#EAE5DA" />
            <stop offset="100%" stopColor="#A89F91" />
          </linearGradient>

          <linearGradient id="goldBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="50%" stopColor="#D89A1B" />
            <stop offset="100%" stopColor="#9C6B0D" />
          </linearGradient>

          <linearGradient id="paperWarm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FBF7EE" />
            <stop offset="100%" stopColor="#EDE5D5" />
          </linearGradient>

          <linearGradient id="darkInk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E3832" />
            <stop offset="50%" stopColor="#292524" />
            <stop offset="100%" stopColor="#1C1917" />
          </linearGradient>

          <filter id="fusionSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#292524" floodOpacity="0.18" />
          </filter>
        </defs>

        {type === 'stamp' && (
          <g>
            {/* Wooden artisan stamp with Granola Olive stamp base */}
            <path
              d="M20 64C20 60 28 58 48 58C68 58 76 60 76 64L73 74C73 78 65 80 48 80C31 80 23 78 23 74L20 64Z"
              fill="url(#fusionOliveGrad)"
            />
            {/* Rubber pad accent in deep forest olive */}
            <path
              d="M23 74C23 78 31 80 48 80C65 80 73 78 73 74L71 78C71 82 63 84 48 84C33 84 25 82 25 78L23 74Z"
              fill="#374400"
            />
            {/* Turned Wood Handle Stem */}
            <path
              d="M40 58C40 48 43 38 41 28C41 24 44 22 48 22C52 22 55 24 55 28C53 38 56 48 56 58Z"
              fill="url(#woodLight)"
            />
            {/* Turned Wood Knob Top */}
            <circle cx="48" cy="22" r="14" fill="url(#woodLight)" filter="url(#fusionSoftGlow)" />
            {/* Specular highlight on knob */}
            <ellipse cx="44" cy="18" rx="5" ry="3" fill="#FFFFFF" fillOpacity="0.75" transform="rotate(-20 44 18)" />
            {/* Brass neck ring */}
            <rect x="42" y="36" width="12" height="4" rx="2" fill="url(#goldBrass)" />
            {/* Delicate carved groove */}
            <path d="M42 46C44 47 52 47 54 46" stroke="#8C6E4A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {type === 'wallet' && (
          <g>
            {/* Phone with Warm Olive Loyalty Pass */}
            <rect x="22" y="16" width="52" height="66" rx="12" fill="url(#darkInk)" filter="url(#fusionSoftGlow)" />
            <rect x="24" y="18" width="48" height="62" rx="10" fill="#2E2822" />
            <rect x="26" y="22" width="44" height="54" rx="8" fill="#FBF8F2" />
            <rect x="29" y="27" width="38" height="38" rx="6" fill="url(#fusionOliveGrad)" />
            <circle cx="29" cy="46" r="3" fill="#FBF8F2" />
            <circle cx="67" cy="46" r="3" fill="#FBF8F2" />
            <line x1="33" y1="46" x2="63" y2="46" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.7" />
            <rect x="33" y="32" width="16" height="3" rx="1.5" fill="#FFFFFF" />
            <rect x="33" y="37" width="22" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.85" />
            <circle cx="58" cy="35" r="4" fill="#FFFFFF" />
            <path d="M56 35L57.5 36.5L60 34" stroke="#5B6F00" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="42" y="19" width="12" height="1.5" rx="0.75" fill="#78716C" />
          </g>
        )}

        {type === 'bell' && (
          <g>
            {/* Polished Warm Brass Reception Bell */}
            <ellipse cx="48" cy="74" rx="34" ry="8" fill="url(#metalSilver)" filter="url(#fusionSoftGlow)" />
            <ellipse cx="48" cy="73" rx="32" ry="6" fill="#292524" />
            <path
              d="M18 70C18 48 30 36 48 36C66 36 78 48 78 70Z"
              fill="url(#goldBrass)"
              filter="url(#fusionSoftGlow)"
            />
            <ellipse cx="48" cy="70" rx="30" ry="5" fill="#9C6B0D" />
            <rect x="46" y="26" width="4" height="12" rx="2" fill="url(#metalSilver)" />
            <ellipse cx="48" cy="24" rx="8" ry="4" fill="url(#metalSilver)" />
            <path
              d="M26 62C26 48 34 40 45 38"
              stroke="#FFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </g>
        )}

        {type === 'scanner' && (
          <g>
            {/* Optical QR Scanner Terminal in Cream & Olive */}
            <path d="M38 78L44 60L52 60L58 78Z" fill="url(#metalSilver)" />
            <ellipse cx="48" cy="78" rx="22" ry="5" fill="#292524" />
            <rect x="22" y="20" width="52" height="40" rx="8" fill="url(#paperWarm)" filter="url(#fusionSoftGlow)" />
            <rect x="25" y="23" width="46" height="34" rx="6" fill="#1C1917" />
            <rect x="29" y="38" width="38" height="2" fill="#B2C248" />
            <path d="M32 29L36 29M32 29L32 33M64 29L60 29M64 29L64 33M32 51L36 51M32 51L32 47M64 51L60 51M64 51L64 47" stroke="#B2C248" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="48" cy="40" r="5" fill="#5B6F00" />
            <path d="M46 40L47.5 41.5L50.5 38.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {type === 'analytics' && (
          <g>
            {/* 3D Bar Columns with Growth Star in Olive & Terracotta */}
            <path d="M22 74V56L30 52V70L22 74Z" fill="#D6CFBF" />
            <path d="M30 52L38 55V73L30 70V52Z" fill="#ADA391" />
            <polygon points="22,56 30,52 38,55 30,59" fill="#EAE4D5" />

            {/* Column 2 (Warm Terracotta Clay) */}
            <path d="M40 73V44L48 40V69L40 73Z" fill="#D97757" />
            <path d="M48 40L56 43V72L48 69V40Z" fill="#A34F33" />
            <polygon points="40,44 48,40 56,43 48,47" fill="#E89B80" />

            {/* Column 3 (Tall Olive) */}
            <path d="M58 72V28L66 24V68L58 72Z" fill="#7E9600" />
            <path d="M66 24L74 27V71L66 68V24Z" fill="#455500" />
            <polygon points="58,28 66,24 74,27 66,31" fill="#B2C248" />

            {/* Brass sparkle on top */}
            <path
              d="M66 14L67.5 19.5L73 21L67.5 22.5L66 28L64.5 22.5L59 21L64.5 19.5L66 14Z"
              fill="url(#goldBrass)"
            />
          </g>
        )}

        {type === 'coffee' && (
          <g>
            {/* Ceramic Warm Clay Coffee Cup */}
            <ellipse cx="48" cy="74" rx="26" ry="7" fill="url(#paperWarm)" filter="url(#fusionSoftGlow)" />
            <path
              d="M26 44C26 62 36 70 48 70C60 70 70 62 70 44Z"
              fill="url(#paperWarm)"
            />
            <path
              d="M68 48C76 48 78 58 68 62"
              stroke="url(#paperWarm)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <ellipse cx="48" cy="44" rx="22" ry="8" fill="#5F3B2C" />
            <path
              d="M48 48C45 44 41 44 41 46.5C41 49 48 51.5 48 51.5C48 51.5 55 49 55 46.5C55 44 51 44 48 48Z"
              fill="#FFF7ED"
            />
          </g>
        )}

        {type === 'scissors' && (
          <g>
            <circle cx="34" cy="70" r="10" stroke="url(#metalSilver)" strokeWidth="4" fill="none" />
            <circle cx="62" cy="70" r="10" stroke="url(#metalSilver)" strokeWidth="4" fill="none" />
            <line x1="38" y1="63" x2="58" y2="24" stroke="url(#metalSilver)" strokeWidth="4" strokeLinecap="round" />
            <line x1="58" y1="63" x2="38" y2="24" stroke="url(#metalSilver)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="48" cy="44" r="3" fill="url(#goldBrass)" />
          </g>
        )}

        {type === 'gift' && (
          <g>
            {/* Gift Box in Granola Olive with Warm Brass Ribbon */}
            <rect x="26" y="44" width="44" height="34" rx="4" fill="url(#fusionOliveGrad)" filter="url(#fusionSoftGlow)" />
            <rect x="22" y="36" width="52" height="10" rx="3" fill="#7E9600" />
            <rect x="44" y="36" width="8" height="42" fill="url(#goldBrass)" />
            <ellipse cx="42" cy="32" rx="7" ry="5" fill="url(#goldBrass)" transform="rotate(-25 42 32)" />
            <ellipse cx="54" cy="32" rx="7" ry="5" fill="url(#goldBrass)" transform="rotate(25 54 32)" />
            <circle cx="48" cy="34" r="3" fill="#A16207" />
          </g>
        )}
      </svg>
    </div>
  );
}
