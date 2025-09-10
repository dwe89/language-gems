'use client';

import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';

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

export default function FlagIcon({ 
  countryCode, 
  size = 'lg', 
  className = '', 
  showFallback = true 
}: FlagIconProps) {
  const [flagError, setFlagError] = useState(false);
  const dimensions = sizeMap[size];
  
  // If flag fails to load or we're on a system that doesn't support SVG flags well
  if (flagError && showFallback) {
    return (
      <div 
        className={`
          ${fallbackColors[countryCode as keyof typeof fallbackColors] || 'bg-gray-400'} 
          rounded-full flex items-center justify-center text-white font-bold text-xs
          ${className}
        `}
        style={dimensions}
        title={`${countryCode} flag`}
      >
        {countryCode}
      </div>
    );
  }

  return (
    <div className="relative">
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={dimensions}
        className={`rounded-full shadow-lg ${className}`}
        title={`${countryCode} flag`}
        onError={() => setFlagError(true)}
      />
      {/* Hidden fallback for screen readers */}
      <span className="sr-only">{countryCode} flag</span>
    </div>
  );
}
