import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-4/3", "aspect-16/9"
  loading?: 'lazy' | 'eager';
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
  onClick?: () => void;
  priority?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-square',
  loading = 'lazy',
  fallbackIcon,
  fallbackText,
  onClick,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!src);

  return (
    <div
      className={`relative overflow-hidden bg-[#EAE7DE] dark:bg-[#1C2522] ${aspectRatio} ${containerClassName}`}
      onClick={onClick}
    >
      {/* Loading Skeleton Shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-pulse" />
      )}

      {/* Actual Image */}
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        /* Fallback Container */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-radial from-white/30 to-transparent">
          {fallbackIcon || <ImageIcon className="w-7 h-7 text-[#788682] dark:text-[#A0AEA9] opacity-70 mb-1" />}
          {fallbackText && (
            <span className="text-[10px] text-muted font-medium line-clamp-1 max-w-[90%]">
              {fallbackText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
