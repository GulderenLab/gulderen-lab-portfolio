import React, { useState } from 'react';
import MammographyCalculator from './MammographyCalculator.jsx';
import UltrasonographyCalculator from './UltrasonographyCalculator.jsx';
import MRICalculator from './MRICalculator.jsx';

const ModalityBIRADSCalculator = ({ embedded = true, initialModality = '' }) => {
  const [selectedModality, setSelectedModality] = useState(initialModality);

  const modalityOptions = [
    {
      value: 'mammography',
      label: 'Mamografi',
      description: 'Digital mammografi BI-RADS değerlendirmesi',
      icon: '🩻',
      color: 'blue',
      features: ['Kitle değerlendirmesi', 'Kalsifikasyon analizi', 'Architectural distortion', 'ACR yoğunluk kategorileri']
    },
    {
      value: 'ultrasonography',
      label: 'Ultrasonografi',
      description: 'Meme ultrasonografi BI-RADS değerlendirmesi',
      icon: '📡',
      color: 'cyan',
      features: ['Solid/kistik ayırım', 'Doppler değerlendirmesi', 'Elastografi', 'Gerçek zamanlı değerlendirme']
    },
    {
      value: 'mri',
      label: 'Manyetik Rezonans (MRG)',
      description: 'Kontrastlı dinamik meme MRG BI-RADS değerlendirmesi',
      icon: '🧲',
      color: 'purple',
      features: ['Enhancement kinetikleri', 'Difüzyon ağırlıklı', 'T2 sinyal özellikleri', 'Multiplanar değerlendirme']
    }
  ];

  const getColorClasses = (color, variant = 'primary') => {
    const colorMap = {
      blue: {
        primary: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
        light: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
        text: 'text-blue-400'
      },
      cyan: {
        primary: 'from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600',
        light: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
        text: 'text-cyan-400'
      },
      purple: {
        primary: 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
        light: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
        text: 'text-purple-400'
      }
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  const renderModalityCalculator = () => {
    switch (selectedModality) {
      case 'mammography':
        return <MammographyCalculator embedded={true} />;
      case 'ultrasonography':
        return <UltrasonographyCalculator embedded={true} />;
      case 'mri':
        return <MRICalculator embedded={true} />;
      default:
        return null;
    }
  };

  const containerClass = embedded 
    ? "bg-slate-800/40 border border-slate-700/50 rounded-xl p-6" 
    : "calculator-container";

  if (selectedModality) {
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {modalityOptions.find(m => m.value === selectedModality)?.icon}
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">
                {modalityOptions.find(m => m.value === selectedModality)?.label} BI-RADS
              </h3>
              <p className="text-gray-400 text-sm">
                {modalityOptions.find(m => m.value === selectedModality)?.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedModality('')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors duration-200 text-sm"
          >
            ← Modalite Seç
          </button>
        </div>
        {renderModalityCalculator()}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="calculator-header text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-pink-400/30">
            <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Modaliteye Özel BI-RADS Hesaplayıcıları
        </h3>
        <p className="text-gray-400 mb-6">
          Görüntüleme modalitesini seçerek özel BI-RADS değerlendirme aracını kullanın
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modalityOptions.map((modality) => (
          <div
            key={modality.value}
            onClick={() => setSelectedModality(modality.value)}
            className="group cursor-pointer bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(modality.color, 'light')} backdrop-blur-sm border rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {modality.icon}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                  {modality.label}
                </h4>
                <p className="text-gray-400 text-sm">
                  BI-RADS Değerlendirmesi
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {modality.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <h5 className="text-sm font-semibold text-gray-300">Özellikler:</h5>
              <div className="grid grid-cols-1 gap-2">
                {modality.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 ${getColorClasses(modality.color, 'light')} rounded-full flex-shrink-0`}></div>
                    <span className="text-gray-400 text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button className={`w-full bg-gradient-to-r ${getColorClasses(modality.color, 'primary')} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 group-hover:shadow-lg`}>
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Hesaplayıcıyı Aç
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h4 className="text-blue-400 font-medium text-sm mb-1">Modalite Seçimi Hakkında</h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              Her görüntüleme modalitesi için özelleştirilmiş BI-RADS değerlendirme araçları hazırlanmıştır. 
              Mamografi kalsifikasyon analizi, ultrasonografi Doppler değerlendirmesi, MRG kinetik analizi gibi 
              modaliteye özgü özellikler dahil edilmiştir. Doğru modaliteyi seçerek daha hassas değerlendirme yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalityBIRADSCalculator;