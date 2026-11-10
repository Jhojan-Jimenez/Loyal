import React from 'react';

export function MandalaBackground({ className = '', opacity = 'opacity-20' }: { className?: string; opacity?: string }) {
  return (
    <div className={`pointer-events-none absolute select-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className={`w-full h-full text-purple-400 ${opacity}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="200" cy="200" r="180" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="150" />
        <circle cx="200" cy="200" r="120" strokeDasharray="2 4" />
        <circle cx="200" cy="200" r="90" />
        <circle cx="200" cy="200" r="60" strokeDasharray="3 3" />
        <circle cx="200" cy="200" r="30" />
        
        {/* 8-Petal Radial Rosette */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M 200,80 C 180,120 180,160 200,200 C 220,160 220,120 200,80 Z"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <path d="M 200,40 C 170,90 170,150 200,200 C 230,150 230,90 200,40 Z" />
            <circle cx="200" cy="50" r="3" fill="currentColor" />
            <circle cx="200" cy="95" r="2.5" fill="currentColor" />
          </g>
        ))}

        {/* 16-Ray Sacred Geometry Outer Ring */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
          <line
            key={i}
            x1="200"
            y1="20"
            x2="200"
            y2="35"
            transform={`rotate(${angle} 200 200)`}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
}

export function LotusIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Central Petal */}
      <path d="M12 3C10.5 7 10.5 13 12 18C13.5 13 13.5 7 12 3Z" fill="currentColor" fillOpacity="0.25" />
      {/* Left Petal */}
      <path d="M12 18C7.5 16 4 11 6 7C8.5 10 10.5 14 12 18Z" fill="currentColor" fillOpacity="0.15" />
      {/* Right Petal */}
      <path d="M12 18C16.5 16 20 11 18 7C15.5 10 13.5 14 12 18Z" fill="currentColor" fillOpacity="0.15" />
      {/* Bottom Leaf Support */}
      <path d="M4 18C8 20 16 20 20 18" />
      <path d="M8 18C10 21 14 21 16 18" />
    </svg>
  );
}
