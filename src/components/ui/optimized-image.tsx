"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "blur",
  blurDataURL,
  sizes,
  fill = false,
  quality = 85,
  loading = "lazy",
  onLoad,
  onError,
  fallbackSrc = "/images/placeholder.svg",
  aspectRatio,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoading, setIsLoading] = React.useState(true);

  // When priority is true, loading should not be set to avoid conflicts
  const imageLoading = priority ? undefined : loading;

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = React.useMemo(() => {
    if (blurDataURL) return blurDataURL;

    // Generate a simple blur placeholder
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjNmNGY2O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlNWU3ZWI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmFkaWVudCkiIC8+Cjwvc3ZnPg==";
  }, [blurDataURL]);

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setImageSrc(fallbackSrc);
    onError?.();
  };

  // Reset state when src changes
  React.useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
  }, [src]);

  const containerClassName = cn(
    "relative overflow-hidden",
    aspectRatio && aspectRatio in aspectRatioClasses 
      ? aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses]
      : aspectRatio,
    className
  );

  const imageClassName = cn(
    "transition-opacity duration-300",
    isLoading && "opacity-0",
    !isLoading && "opacity-100"
  );

  if (fill) {
    return (
      <div className={containerClassName}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={imageClassName}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          sizes={sizes}
          quality={quality}
          loading={imageLoading}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        sizes={sizes}
        quality={quality}
        loading={imageLoading}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

// Progressive image component with multiple sources
interface ProgressiveImageProps extends OptimizedImageProps {
  sources?: Array<{
    srcSet: string;
    media?: string;
    type?: string;
  }>;
}

export function ProgressiveImage({ sources, ...props }: ProgressiveImageProps) {
  if (!sources || sources.length === 0) {
    return <OptimizedImage {...props} />;
  }

  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      <OptimizedImage {...props} />
    </picture>
  );
}

// Image gallery component
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  aspectRatio?: string;
  columns?: number;
}

export function ImageGallery({ 
  images, 
  className, 
  aspectRatio = "square",
  columns = 3 
}: ImageGalleryProps) {
  const gridClassName = cn(
    "grid gap-4",
    {
      "grid-cols-1": columns === 1,
      "grid-cols-2": columns === 2,
      "grid-cols-3": columns === 3,
      "grid-cols-4": columns === 4,
    },
    className
  );

  return (
    <div className={gridClassName}>
      {images.map((image, index) => (
        <div key={index} className="group">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            aspectRatio={aspectRatio}
            className="rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
          {image.caption && (
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
