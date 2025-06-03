"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw, Download, Share2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { PinchToZoomImage } from "@/components/ui/touch-gestures";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  columns?: number;
  gap?: number;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  showThumbnails?: boolean;
  enableLightbox?: boolean;
  enableZoom?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ImageGallery({
  images,
  className,
  columns = 3,
  gap = 4,
  aspectRatio = "auto",
  showThumbnails = true,
  enableLightbox = true,
  enableZoom = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayState, setAutoPlayState] = useState<boolean>(autoPlay);
  const intervalRef = useRef<number | undefined>(undefined);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlayState && selectedIndex !== null) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval) as unknown as number;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlayState, selectedIndex, images.length, autoPlayInterval]);

  const openLightbox = useCallback((index: number) => {
    if (enableLightbox) {
      setSelectedIndex(index);
      setCurrentIndex(index);
      setAutoPlayState(autoPlay);
    }
  }, [enableLightbox, autoPlay]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setAutoPlayState(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case ' ':
        e.preventDefault();
        setAutoPlayState(!autoPlayState);
        break;
    }
  }, [selectedIndex, autoPlayState, goToPrevious, goToNext, closeLightbox, setAutoPlayState]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return "";
    }
  };

  const getGridColumnsClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
      case 6:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={cn(
          "grid gap-4",
          getGridColumnsClass(),
          className
        )}
        style={{ gap: `${gap * 0.25}rem` }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "relative overflow-hidden rounded-lg bg-muted cursor-pointer group",
              getAspectRatioClass()
            )}
            onClick={() => openLightbox(index)}
          >
            <OptimizedImage
              src={image.thumbnail || image.src}
              alt={image.alt}
              fill={aspectRatio !== "auto"}
              width={aspectRatio === "auto" ? image.width : undefined}
              height={aspectRatio === "auto" ? image.height : undefined}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* Zoom indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/50 rounded-full p-1">
                <ZoomIn className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Image info */}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <h3 className="text-white text-sm font-medium">{image.title}</h3>
                {image.description && (
                  <p className="text-white/80 text-xs mt-1 line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
          showThumbnails={showThumbnails}
          enableZoom={enableZoom}
          isPlaying={autoPlayState}
          onTogglePlay={() => setAutoPlayState(!autoPlayState)}
          onThumbnailClick={setCurrentIndex}
        />
      )}
    </>
  );
}

// Lightbox component
interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  showThumbnails: boolean;
  enableZoom: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onThumbnailClick: (index: number) => void;
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  showThumbnails,
  enableZoom,
  isPlaying,
  onTogglePlay,
  onThumbnailClick,
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const currentImage = images[currentIndex];

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentImage.title || `image-${currentIndex + 1}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title || 'Image',
          text: currentImage.description || '',
          url: currentImage.src,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentImage.src);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="text-white">
            <h2 className="font-medium">{currentImage.title}</h2>
            <p className="text-sm text-white/80">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {enableZoom && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="text-white hover:bg-white/20"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRotation((prev) => prev + 90)}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Play/Pause button for autoplay */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex items-center justify-center h-full p-4 pt-20 pb-20">
        {enableZoom ? (
          <PinchToZoomImage
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full"
          />
        ) : (
          <div
            className="max-w-full max-h-full"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease',
            }}
          >
            <OptimizedImage
              src={currentImage.src}
              alt={currentImage.alt}
              width={800}
              height={600}
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="lg"
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Thumbnails */}
      {showThumbnails && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center space-x-2 p-4 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => onThumbnailClick(index)}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent hover:border-white/50"
                )}
              >
                <OptimizedImage
                  src={image.thumbnail || image.src}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


