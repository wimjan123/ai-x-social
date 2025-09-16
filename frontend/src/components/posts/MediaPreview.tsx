'use client';

import { useState } from 'react';
import { cn } from '@/lib/design-system';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface MediaPreviewProps {
  images: string[];
  videos?: string[];
  alt?: string;
  onMediaClick?: (mediaUrl: string, index: number) => void;
  className?: string;
}

interface MediaItemProps {
  src: string;
  alt?: string;
  index: number;
  total: number;
  onClick?: (src: string, index: number) => void;
  className?: string;
}

function ImagePreview({ src, alt, index, onClick, className }: MediaItemProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(src, index);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-x-border',
        'hover:opacity-95 transition-opacity cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-x-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="aspect-video flex items-center justify-center text-x-text-secondary dark:text-x-text-secondary-dark">
          <span className="text-sm">Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt || `Image ${index + 1}`}
          className={cn(
            'w-full h-full object-cover transition-opacity',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
}

function VideoPreview({ src, alt, index, onClick, className }: MediaItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(src, index);
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-x-border',
        'hover:opacity-95 transition-opacity cursor-pointer group',
        className
      )}
      onClick={handleClick}
    >
      {hasError ? (
        <div className="aspect-video flex items-center justify-center text-x-text-secondary dark:text-x-text-secondary-dark">
          <span className="text-sm">Failed to load video</span>
        </div>
      ) : (
        <video
          src={src}
          className="w-full h-full object-cover"
          muted={isMuted}
          onError={() => setHasError(true)}
          poster={`${src}#t=0.5`} // Show frame at 0.5s as poster
        />
      )}

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            <Play className="w-6 h-6 text-white ml-0.5" />
          </button>

          <button
            onClick={handleMuteToggle}
            className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Video indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Video
      </div>
    </div>
  );
}

export function MediaPreview({
  images,
  videos = [],
  alt,
  onMediaClick,
  className,
}: MediaPreviewProps) {
  const allMedia = [...images, ...videos];
  const mediaCount = allMedia.length;

  if (mediaCount === 0) return null;

  const getGridClasses = () => {
    switch (mediaCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 grid-rows-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  const getItemClasses = (index: number) => {
    if (mediaCount === 3 && index === 0) {
      return 'row-span-2';
    }
    return '';
  };

  const getAspectRatio = () => {
    if (mediaCount === 1) {
      return 'aspect-video max-h-96';
    }
    return 'aspect-square';
  };

  // Show max 4 media items, with count indicator for more
  const displayMedia = allMedia.slice(0, 4);
  const remainingCount = Math.max(0, mediaCount - 4);

  return (
    <div className={cn('relative', className)}>
      <div className={cn('grid gap-1', getGridClasses())}>
        {displayMedia.map((src, index) => {
          const isVideo = videos.includes(src);
          const itemClasses = cn(
            getAspectRatio(),
            getItemClasses(index),
            'min-h-0'
          );

          if (isVideo) {
            return (
              <VideoPreview
                key={`video-${index}`}
                src={src}
                alt={alt}
                index={index}
                total={mediaCount}
                onClick={onMediaClick}
                className={itemClasses}
              />
            );
          }

          return (
            <div key={`image-${index}`} className="relative">
              <ImagePreview
                src={src}
                alt={alt}
                index={index}
                total={mediaCount}
                onClick={onMediaClick}
                className={itemClasses}
              />

              {/* Remaining count overlay for last item */}
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                  <span className="text-white text-2xl font-semibold">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Accessibility info */}
      <div className="sr-only">
        {mediaCount === 1 ? '1 image' : `${mediaCount} images`}
        {alt && `. ${alt}`}
      </div>
    </div>
  );
}