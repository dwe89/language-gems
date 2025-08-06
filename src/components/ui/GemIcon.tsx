import React from 'react';

export type GemType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface GemIconProps {
  type: GemType;
  size?: 'small' | 'medium' | 'large' | 'xl';
  animated?: boolean;
  collected?: boolean;
  className?: string;
}

const GemIcon: React.FC<GemIconProps> = ({
  type,
  size = 'medium',
  animated = false,
  collected = false,
  className = ''
}) => {
  const sizeMap = {
    small: 32,
    medium: 64,
    large: 96,
    xl: 140
  };

  const dimension = sizeMap[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 140 140"
        className={`transition-all duration-500 ${animated && type === 'legendary' ? 'animate-pulse' : ''}`}
        style={{
          filter: `drop-shadow(0 0 20px ${
            type === 'common' ? 'rgba(30, 58, 138, 0.6)' :
            type === 'uncommon' ? 'rgba(8, 145, 178, 0.6)' :
            type === 'rare' ? 'rgba(103, 232, 249, 0.6)' :
            type === 'epic' ? 'rgba(165, 243, 252, 0.6)' :
            'rgba(240, 171, 252, 0.8)'
          })`
        }}
      >
        <defs>
          <linearGradient id={`gemGradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {type === 'common' ? (
              <>
                <stop offset="0%" style={{ stopColor: '#1E3A8A', stopOpacity: 1 }} />
                <stop offset="30%" style={{ stopColor: '#1E40AF', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: '#1D4ED8', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
              </>
            ) : type === 'uncommon' ? (
              <>
                <stop offset="0%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                <stop offset="30%" style={{ stopColor: '#0E7490', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: '#155E75', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#164E63', stopOpacity: 1 }} />
              </>
            ) : type === 'rare' ? (
              <>
                <stop offset="0%" style={{ stopColor: '#67E8F9', stopOpacity: 1 }} />
                <stop offset="30%" style={{ stopColor: '#22D3EE', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
              </>
            ) : type === 'epic' ? (
              <>
                <stop offset="0%" style={{ stopColor: '#A5F3FC', stopOpacity: 1 }} />
                <stop offset="30%" style={{ stopColor: '#67E8F9', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: '#22D3EE', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
              </>
            ) : (
              <>
                <stop offset="0%" style={{ stopColor: '#F0ABFC', stopOpacity: 1 }} />
                <stop offset="30%" style={{ stopColor: '#E879F9', stopOpacity: 1 }} />
                <stop offset="70%" style={{ stopColor: '#D946EF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#C026D3', stopOpacity: 1 }} />
              </>
            )}
          </linearGradient>

          <radialGradient id={`gemHighlight-${type}`} cx="30%" cy="30%" r="40%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
          </radialGradient>

          <radialGradient id={`gemShadow-${type}`} cx="70%" cy="70%" r="60%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0 }} />
            <stop offset="70%" style={{ stopColor: '#000000', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.3 }} />
          </radialGradient>

          {/* Top surface gradient */}
          <linearGradient id={`topSurface-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
          </linearGradient>

          {/* Left facet gradient */}
          <linearGradient id={`leftFacet-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.05 }} />
          </linearGradient>

          {/* Right facet gradient */}
          <linearGradient id={`rightFacet-${type}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.1 }} />
          </linearGradient>

          {/* Bottom facet gradient */}
          <linearGradient id={`bottomFacet-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.4 }} />
          </linearGradient>
        </defs>

        {/* Main gem body - Rounded 3D gem shape */}
        <path
          d="M70 20 Q95 25 100 50 Q95 75 85 90 Q70 110 70 110 Q70 110 55 90 Q45 75 40 50 Q45 25 70 20 Z"
          fill={`url(#gemGradient-${type})`}
          stroke="none"
        />

        {/* Top flat surface */}
        <ellipse
          cx="70" cy="30"
          rx="22" ry="6"
          fill={`url(#topSurface-${type})`}
        />

        {/* Left curved facet */}
        <path
          d="M48 30 Q40 50 48 85 Q58 75 58 50 Q58 35 48 30 Z"
          fill={`url(#leftFacet-${type})`}
        />

        {/* Right curved facet */}
        <path
          d="M92 30 Q100 50 92 85 Q82 75 82 50 Q82 35 92 30 Z"
          fill={`url(#rightFacet-${type})`}
        />

        {/* Bottom curved surface */}
        <path
          d="M48 85 Q70 110 92 85 Q82 95 70 105 Q58 95 48 85 Z"
          fill={`url(#bottomFacet-${type})`}
        />

        {/* Highlight overlay */}
        <path
          d="M70 10 L110 50 L70 130 L30 50 Z"
          fill={`url(#gemHighlight-${type})`}
        />

        {/* Inner shadow overlay */}
        <path
          d="M70 10 L110 50 L70 130 L30 50 Z"
          fill={`url(#gemShadow-${type})`}
        />

        {/* Main highlight - bright spot like in reference */}
        <ellipse
          cx="60" cy="45"
          rx="6" ry="10"
          fill="rgba(255,255,255,0.9)"
          className={animated ? "animate-pulse" : ""}
        />
        <ellipse
          cx="58" cy="42"
          rx="3" ry="5"
          fill="rgba(255,255,255,1)"
        />
      </svg>
    </div>
  );
};

export default GemIcon;