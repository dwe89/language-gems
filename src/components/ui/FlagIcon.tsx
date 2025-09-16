'use client';

import React, { useState } from 'react';

interface FlagIconProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallback?: boolean;
}

const sizeMap = {
  sm: { width: '1rem', height: '1rem' },
  md: { width: '1.5rem', height: '1.5rem' },
  lg: { width: '2rem', height: '2rem' },
  xl: { width: '4rem', height: '4rem' }
};

const fallbackColors = {
  ES: 'bg-gradient-to-r from-red-500 to-yellow-500',
  FR: 'bg-gradient-to-r from-blue-500 via-white to-red-500',
  DE: 'bg-gradient-to-r from-black via-red-500 to-yellow-500'
};

const countryNames = {
  ES: 'Spanish',
  FR: 'French',
  DE: 'German'
};

export default function FlagIcon({
  countryCode,
  size = 'lg',
  className = '',
  showFallback = true
}: FlagIconProps) {
  const [flagError, setFlagError] = useState(false);
  const dimensions = sizeMap[size];

  // Convert country code to lowercase for flag-icons
  const flagCode = countryCode.toLowerCase();

  // If flag fails to load, show fallback
  if (flagError && showFallback) {
    return (
      <div
        className={`
          ${fallbackColors[countryCode as keyof typeof fallbackColors] || 'bg-gray-400'}
          rounded-full flex items-center justify-center text-white font-bold shadow-lg
          ${className}
        `}
        style={dimensions}
        title={`${countryNames[countryCode as keyof typeof countryNames] || countryCode} flag`}
      >
        <span className="text-xs font-semibold">
          {countryCode}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-full shadow-lg overflow-hidden flex justify-center items-center ${className}`}
      style={dimensions}
    >
      <img
        src={`/flags/${flagCode}.svg`}
        alt={`${countryNames[countryCode as keyof typeof countryNames] || countryCode} flag`}
        title={`${countryNames[countryCode as keyof typeof countryNames] || countryCode} flag`}
        className="w-full h-full object-cover"
        onError={() => setFlagError(true)}
        onLoad={() => {/* Flag loaded successfully */}}
      />
      {/* Hidden fallback for screen readers */}
      <span className="sr-only">{countryNames[countryCode as keyof typeof countryNames] || countryCode} flag</span>
    </div>
  );
}
