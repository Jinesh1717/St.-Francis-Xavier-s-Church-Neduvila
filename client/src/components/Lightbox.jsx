import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ images = [], currentIndex = 0, isOpen = false, onClose, onNavigate }) => {
  const currentImage = images[currentIndex];

  const handleNext = useCallback(() => {
    if (images.length > 1) {
      onNavigate((currentIndex + 1) % images.length);
    }
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (images.length > 1) {
      onNavigate((currentIndex - 1 + images.length) % images.length);
    }
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-slate-800/60 p-2.5 rounded-full backdrop-blur-xs transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-gold-400"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 sm:left-6 text-white/80 hover:text-white bg-slate-800/60 p-3 rounded-full backdrop-blur-xs transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image & Caption Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.image?.url || currentImage.url}
          alt={currentImage.caption || 'Church photo'}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
          loading="lazy"
        />

        {/* Caption bar */}
        {(currentImage.caption || currentImage.album) && (
          <div className="mt-4 text-center text-white px-4 py-2 bg-slate-900/70 rounded-full backdrop-blur-xs max-w-2xl">
            {currentImage.album && (
              <span className="inline-block text-xs uppercase tracking-wider text-gold-400 font-semibold mr-2">
                [{currentImage.album}]
              </span>
            )}
            <span className="text-sm font-medium">{currentImage.caption}</span>
          </div>
        )}

        <div className="mt-2 text-xs text-white/60">
          {currentIndex + 1} of {images.length}
        </div>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 sm:right-6 text-white/80 hover:text-white bg-slate-800/60 p-3 rounded-full backdrop-blur-xs transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Lightbox;

