// src/components/SvgAnimationContainer.jsx

import React, { useState, useEffect, useRef } from 'react';

// Bileşen artık 'children' ve 'captionPosition' proplarını da alıyor.
// captionPosition için varsayılan değer 'bottom' (alt) olsun.
export const SvgAnimationContainer = ({ slides = [], children, captionPosition = 'bottom' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  
  const animationDuration = 2000; // 2 seconds per slide
  
  // Animation controls
  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentSlide(cur => (cur + 1) % slides.length);
          return 0;
        }
        return prev + (100 / (animationDuration / 100));
      });
    }, 100);
  };
  
  const pauseAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  };
  
  const resetAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentSlide(0);
    setProgress(0);
  };
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setProgress(0);
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  if (!slides || slides.length === 0) {
    return <div>Animasyon için slayt bulunamadı.</div>;
  }

  // Başlığı render etmek için bir JSX elemanı oluşturalım.
  const CaptionComponent = children ? (
    <div className="animation-caption">
      {children}
    </div>
  ) : null;

  return (
    // Ana kapsayıcının içindeki sırayı değiştirerek başlığın konumunu ayarlıyoruz.
    <div className="animation-wrapper">
      
      {/* Eğer konum 'top' ise, başlığı burada göster */}
      {captionPosition === 'top' && CaptionComponent}

      {/* Animasyonun kendisi (değişmedi) */}
      <div className="svg-animation-container">
        {slides.map((slide, index) => (
          <div 
            className={`svg-slide ${index === currentSlide ? 'active' : ''}`} 
            data-slide={index} 
            key={index}
            style={{display: index === currentSlide ? 'block' : 'none'}}
          >
            <img src={slide.src} alt={slide.alt} className="svg-image" />
          </div>
        ))}
      </div>

      {/* Kontrol paneli (değişmedi) */}
      <div className="animation-controls-panel">
        <div className="progress-wrapper">
          <div className="slide-indicator">{currentSlide + 1} / {slides.length}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{width: `${progress}%`}}></div>
          </div>
        </div>
        <div className="controls">
          <button className="btn play-btn" onClick={startAnimation} disabled={isPlaying}>▶️ Başlat</button>
          <button className="btn pause-btn" onClick={pauseAnimation} disabled={!isPlaying}>⏸️ Duraklat</button>
          <button className="btn reset-btn" onClick={resetAnimation}>🔄 Sıfırla</button>
          <button className="btn next-btn" onClick={nextSlide}>⏭️ İleri</button>
          <button className="btn prev-btn" onClick={prevSlide}>⏮️ Geri</button>
        </div>
      </div>

      {/* Eğer konum 'bottom' ise, başlığı burada göster */}
      {captionPosition === 'bottom' && CaptionComponent}
      
    </div>
  );
};