// src/components/SvgAnimationContainer.jsx

import React from 'react';

// Bileşen artık 'children' ve 'captionPosition' proplarını da alıyor.
// captionPosition için varsayılan değer 'bottom' (alt) olsun.
export const SvgAnimationContainer = ({ slides = [], children, captionPosition = 'bottom' }) => {
  
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
          <div className="svg-slide" data-slide={index} key={index}>
            <img src={slide.src} alt={slide.alt} className="svg-image" />
          </div>
        ))}
      </div>

      {/* Kontrol paneli (değişmedi) */}
      <div className="animation-controls-panel">
        <div className="progress-wrapper">
          <div className="slide-indicator">1 / {slides.length}</div>
          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
        </div>
        <div className="controls">
          <button className="btn play-btn">▶️ Başlat</button>
          <button className="btn pause-btn">⏸️ Duraklat</button>
          <button className="btn reset-btn">🔄 Sıfırla</button>
          <button className="btn next-btn">⏭️ İleri</button>
          <button className="btn prev-btn">⏮️ Geri</button>
        </div>
      </div>

      {/* Eğer konum 'bottom' ise, başlığı burada göster */}
      {captionPosition === 'bottom' && CaptionComponent}
      
    </div>
  );
};