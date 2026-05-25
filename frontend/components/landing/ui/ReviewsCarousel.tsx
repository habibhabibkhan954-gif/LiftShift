import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { FANCY_FONT } from '../../../utils/ui/uiConstants';
import { assetPath } from '../../../constants';

interface ReviewsCarouselProps {
  className?: string;
}

const REVIEW_IMAGES = [
  assetPath('/carousel/1.avif'),
  assetPath('/carousel/2.avif'),
  assetPath('/carousel/3.avif'),
  assetPath('/carousel/4.avif'),
  assetPath('/carousel/5.avif'),
  assetPath('/carousel/6.avif'),
  assetPath('/carousel/7.avif'),
  assetPath('/carousel/8.avif'),
  assetPath('/carousel/9.avif'),
];

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ className = '' }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % REVIEW_IMAGES.length);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + REVIEW_IMAGES.length) % REVIEW_IMAGES.length);
  }, [currentIndex, goToSlide]);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prev) => (prev + 1) % REVIEW_IMAGES.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isTransitioning]);

  const handleManualNav = (index: number) => {
    goToSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 15 seconds
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-9">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <Quote className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">Community Feedback</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${isLight ? 'text-slate-900' : ''}`}>
          Loved by <span className="text-emerald-400" style={FANCY_FONT}>Lifters</span> Worldwide
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          See what the fitness community is saying about LiftShift on Reddit
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className={`relative overflow-hidden rounded-2xl border ${isLight ? 'bg-slate-100/50 border-slate-300/50' : 'bg-slate-900/20 border-slate-800/50'}`}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Main Image Display */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
          {REVIEW_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 flex items-center justify-center p-4 sm:p-8 transition-all duration-500 ease-out ${
                index === currentIndex 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-95 z-0'
              }`}
              style={{ 
                transform: index === currentIndex ? 'scale(1)' : 'scale(0.95)',
                pointerEvents: index === currentIndex ? 'auto' : 'none'
              }}
            >
              <img
                src={src}
                alt={`Reddit user review ${index + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl shadow-black/50"
                loading={index < 3 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
          
          {/* Gradient Overlays */}
          <div className={`absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r to-transparent pointer-events-none z-20 ${isLight ? 'from-white/70' : 'from-slate-950/70'}`} />
          <div className={`absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l to-transparent pointer-events-none z-20 ${isLight ? 'from-white/70' : 'from-slate-950/70'}`} />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => handleManualNav((currentIndex - 1 + REVIEW_IMAGES.length) % REVIEW_IMAGES.length)}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full backdrop-blur-md border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all ${isLight ? 'bg-white/70' : 'bg-slate-950/70'}`}
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => handleManualNav((currentIndex + 1) % REVIEW_IMAGES.length)}
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full backdrop-blur-md border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all ${isLight ? 'bg-white/70' : 'bg-slate-950/70'}`}
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6 ">
        {REVIEW_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualNav(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-emerald-400' 
                : `w-2 h-2 ${isLight ? 'bg-slate-400 hover:bg-slate-500' : 'bg-slate-600 hover:bg-slate-500'}`
            }`}
            aria-label={`Go to review ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>

     
    </div>
  );
};

export default ReviewsCarousel;
