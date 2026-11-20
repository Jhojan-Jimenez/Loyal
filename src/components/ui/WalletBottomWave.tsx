import React from 'react';

interface WalletBottomWaveProps {
  isLight?: boolean;
}

/**
 * Subtle layered organic wave rendered at the bottom edge of digital wallet cards.
 */
export function WalletBottomWave({ isLight = true }: WalletBottomWaveProps) {
  return (
    <svg
      viewBox="0 0 400 44"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 w-full h-9 select-none z-0"
    >
      <path
        d="M0,26 C80,6 150,42 230,22 C300,5 350,30 400,16 L400,44 L0,44 Z"
        fill={isLight ? 'rgba(91, 111, 0, 0.10)' : 'rgba(255, 255, 255, 0.10)'}
      />
      <path
        d="M0,34 C95,18 180,46 270,28 C335,15 375,34 400,26 L400,44 L0,44 Z"
        fill={isLight ? 'rgba(91, 111, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)'}
      />
    </svg>
  );
}
