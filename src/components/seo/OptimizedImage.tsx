import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Fallback image for errors
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    priority,
    loading,
    quality,
    placeholder,
    blurDataURL,
    sizes,
    style,
    onLoad: handleLoad,
    onError: handleError,
    ...(fill ? { fill: true } : { width, height })
  };

  return <Image {...imageProps} />;
}

// Predefined image configurations for common use cases
export const ImageConfigs = {
  hero: {
    quality: 90,
    priority: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  },
  gameIcon: {
    quality: 85,
    loading: 'lazy' as const,
    sizes: '(max-width: 768px) 100px, 150px'
  },
  thumbnail: {
    quality: 80,
    loading: 'lazy' as const,
    placeholder: 'blur' as const,
    sizes: '(max-width: 768px) 50vw, 25vw'
  },
  avatar: {
    quality: 85,
    loading: 'lazy' as const,
    sizes: '(max-width: 768px) 80px, 120px'
  }
};

// Helper function to generate blur data URL
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
}

// SEO-optimized image component with automatic alt text validation
export function SEOImage({
  src,
  alt,
  width,
  height,
  gameId,
  type = 'general',
  ...props
}: OptimizedImageProps & {
  gameId?: string;
  type?: 'hero' | 'game-icon' | 'thumbnail' | 'avatar' | 'general';
}) {
  // Validate alt text for SEO
  const validateAltText = (altText: string): string => {
    if (!altText || altText.trim().length === 0) {
      console.warn(`Missing alt text for image: ${src}`);
      return 'Image'; // Fallback alt text
    }
    
    if (altText.length < 10) {
      console.warn(`Alt text too short for image: ${src}. Consider adding more descriptive text.`);
    }
    
    if (altText.length > 125) {
      console.warn(`Alt text too long for image: ${src}. Consider shortening to under 125 characters.`);
    }
    
    return altText;
  };

  // Generate contextual alt text for games
  const generateGameAltText = (gameId: string, type: string): string => {
    const gameNames: Record<string, string> = {
      'vocabulary-mining': 'Vocabulary Mining',
      'hangman': 'Hangman',
      'memory-match': 'Memory Match',
      'conjugation-duel': 'Conjugation Duel',
      'detective-listening': 'Detective Listening',
      'word-scramble': 'Word Scramble'
    };
    
    const gameName = gameNames[gameId] || gameId.replace('-', ' ');
    
    switch (type) {
      case 'game-icon':
        return `${gameName} language learning game icon`;
      case 'thumbnail':
        return `${gameName} game screenshot showing interactive vocabulary practice`;
      case 'hero':
        return `Students playing ${gameName} language learning game on tablets and computers`;
      default:
        return `${gameName} language learning game`;
    }
  };

  // Use game-specific alt text if gameId is provided
  const optimizedAlt = gameId && !alt 
    ? generateGameAltText(gameId, type)
    : validateAltText(alt);

  // Apply type-specific configurations
  const config = ImageConfigs[type as keyof typeof ImageConfigs] || {};

  return (
    <OptimizedImage
      src={src}
      alt={optimizedAlt}
      width={width}
      height={height}
      {...config}
      {...props}
    />
  );
}
