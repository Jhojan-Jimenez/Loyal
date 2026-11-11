'use client';

import React from 'react';

export function YogaPigeonIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[500px] aspect-[500/520] select-none ${className}`}>
      <svg
        viewBox="0 0 500 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          {/* Subtle skin gradient */}
          <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DE8D54" />
            <stop offset="100%" stopColor="#C9753B" />
          </linearGradient>

          {/* Leggings gradient */}
          <linearGradient id="leggingsGrad" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#EDE9FE" />
            <stop offset="100%" stopColor="#DDD6FE" />
          </linearGradient>

          {/* Top gradient */}
          <linearGradient id="topGrad" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#C026D3" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ─── BACKGROUND FLOWING CURVES (Behind Character) ─── */}
        <path
          d="M 40,460 C 180,430 260,510 380,380 C 470,270 460,160 380,80"
          stroke="#C4B5FD"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 120,40 C 260,120 330,30 430,160 C 490,260 480,420 420,500"
          stroke="#DDD6FE"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Decorative beads behind */}
        <circle cx="390" cy="115" r="9" fill="#F59E0B" />
        <circle cx="435" cy="460" r="8" fill="#FBCFE8" />

        {/* ─── YOGI CHARACTER GEOMETRY (King Pigeon Pose) ─── */}
        <g className="transition-transform duration-500 hover:scale-[1.01] origin-bottom">
          {/* 1. Ponytail Hair (Arching backward behind neck) */}
          <path
            d="M 330,225 C 335,260 338,320 355,370 C 358,380 348,375 342,350 C 330,300 326,260 320,230 Z"
            fill="#18181B"
          />

          {/* 2. Folded Front Leg (Seated on Ground) */}
          <path
            d="M 140,410 C 140,410 190,390 270,395 C 330,398 380,415 390,445 C 395,465 375,475 330,475 C 240,475 160,465 140,445 C 130,435 130,420 140,410 Z"
            fill="url(#leggingsGrad)"
          />

          {/* Front Foot tucked */}
          <path
            d="M 280,445 C 300,445 320,460 315,475 C 305,480 275,475 270,465 Z"
            fill="url(#skinGrad)"
          />

          {/* 3. Raised Back Leg (Arched upwards in Pigeon) */}
          <path
            d="M 340,410 C 370,400 410,415 425,445 C 440,475 440,430 435,390 C 430,345 420,310 415,290 C 410,270 422,260 428,275 C 438,300 450,350 450,400 C 450,455 435,485 395,485 C 355,485 330,445 340,410 Z"
            fill="url(#leggingsGrad)"
          />

          {/* Raised Back Foot held overhead */}
          <path
            d="M 408,280 C 400,265 405,245 418,245 C 428,245 435,260 430,285 C 425,290 415,290 408,280 Z"
            fill="url(#skinGrad)"
          />

          {/* 4. Torso & Backbend Arch */}
          <path
            d="M 270,395 C 265,360 260,320 270,280 C 275,260 288,240 305,225 C 320,240 335,265 338,305 C 342,345 345,385 340,410 C 310,415 285,410 270,395 Z"
            fill="url(#skinGrad)"
          />

          {/* High-waist Leggings waistband */}
          <path
            d="M 268,365 C 290,360 320,362 342,370 C 340,395 335,415 330,420 C 300,420 275,415 268,390 Z"
            fill="url(#leggingsGrad)"
          />

          {/* 5. Crop Athletic Top (Vibrant Magenta) */}
          <path
            d="M 268,285 C 275,275 295,270 320,280 C 330,285 338,295 335,335 C 315,340 290,340 270,335 C 265,315 265,300 268,285 Z"
            fill="url(#topGrad)"
          />

          {/* 6. Head & Facial Profile (Turned back in ecstasy/focus) */}
          <g>
            {/* Neck */}
            <path
              d="M 305,230 C 310,215 315,200 320,185 C 332,190 342,205 345,225 Z"
              fill="url(#skinGrad)"
            />

            {/* Head oval tilted back */}
            <path
              d="M 315,185 C 312,165 325,145 345,145 C 365,145 378,160 375,185 C 372,205 355,220 335,215 C 320,210 316,198 315,185 Z"
              fill="url(#skinGrad)"
            />

            {/* Hair Cap & Ponytail Base */}
            <path
              d="M 335,145 C 355,145 378,155 376,185 C 370,175 360,165 342,165 C 330,165 322,175 320,185 C 322,165 328,145 335,145 Z"
              fill="#18181B"
            />
            {/* Bun / tie knot */}
            <circle cx="365" cy="195" r="14" fill="#18181B" />

            {/* Closed eye curve */}
            <path
              d="M 335,178 C 338,181 343,181 346,178"
              stroke="#5A2E14"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Cheerful blush circle */}
            <circle cx="340" cy="190" r="7" fill="#C2410C" opacity="0.3" />

            {/* Serene mouth curve */}
            <path
              d="M 345,198 C 348,200 352,199 354,196"
              stroke="#5A2E14"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* 7. Overhead Clasping Arm (Reaching back to foot) */}
          <path
            d="M 320,230 C 325,195 340,140 370,120 C 390,105 410,130 405,160 C 400,180 380,210 365,225 C 355,210 345,215 335,225 Z"
            fill="url(#skinGrad)"
          />
          {/* Hand clasping toes */}
          <path
            d="M 395,140 C 405,150 415,170 418,200 C 412,205 402,195 400,180 C 398,165 392,150 395,140 Z"
            fill="url(#skinGrad)"
          />

          {/* 8. Front Graceful Arm (Chin Mudra overhead) */}
          <path
            d="M 285,260 C 270,220 255,160 260,110 C 265,85 285,85 288,105 C 290,135 295,185 305,230 Z"
            fill="url(#skinGrad)"
          />

          {/* Hand in Chin Mudra (Index finger + Thumb circle, three fingers extended) */}
          <g transform="translate(255, 70)">
            {/* Wrist */}
            <path d="M 12,35 C 10,25 15,15 22,12" stroke="#C9753B" strokeWidth="6" strokeLinecap="round" />
            {/* Mudra circle (thumb + index) */}
            <ellipse cx="24" cy="20" rx="6" ry="7" stroke="url(#skinGrad)" strokeWidth="4.5" fill="none" />
            {/* Middle, ring, pinky fingers pointing gracefully */}
            <path d="M 26,13 C 27,6 30,2 35,0" stroke="url(#skinGrad)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 29,18 C 32,12 36,9 41,8" stroke="url(#skinGrad)" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </g>

        {/* ─── FOREGROUND FLOATING ELEMENTS (In Front of Character) ─── */}
        {/* Curving loop crossing front */}
        <path
          d="M 220,330 C 240,300 270,300 295,335 C 325,375 390,360 440,320"
          stroke="#C4B5FD"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Floating Beads in front */}
        <circle cx="230" cy="315" r="7" fill="#F59E0B" />
        <circle cx="440" cy="320" r="8" fill="#F59E0B" />
      </svg>
    </div>
  );
}
