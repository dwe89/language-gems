import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  title?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onPrevious,
  onNext,
  title = "Preview"
}: ImageModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrevious();
    if (e.key === 'ArrowRight') onNext();
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`${title} ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-50 text-white rounded-full text-sm">
            {currentIndex + 1} of {images.length}
          </div>
        )}
      </div>
    </div>
  );
} 