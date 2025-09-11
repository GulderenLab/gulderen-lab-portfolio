import React, { useState } from 'react';

const TiRADSCalculator = ({ embedded = false }) => {
  const [scores, setScores] = useState({
    composition: 0,
    echogenicity: 0,
    shape: 0,
    margin: 0,
    echogenicFoci: 0
  });

  const [noduleSize, setNoduleSize] = useState('');
  const [result, setResult] = useState(null);

  const scoringCriteria = {
    composition: [
      { value: 0, label: 'Kistik veya neredeyse tamamen kistik', description: 'Nodülün >%90\'ı kistik' },
      { value: 0, label: 'Süngerimsi', description: 'Mikrokistik agregasyon paterni' },
      { value: 1, label: 'Miks kistik-solid', description: 'Hem kistik hem solid komponentler' },
      { value: 2, label: 'Solid veya neredeyse tamamen solid', description: 'Nodülün >%90\'ı solid' }
    ],
    echogenicity: [
      { value: 0, label: 'Anekoik', description: 'Ekoları bulunmayan' },
      { value: 1, label: 'Hiperekoik/İzoekoik', description: 'Komşu tiroid parankimasına eşit veya daha ekojen' },
      { value: 2, label: 'Hipoekoik', description: 'Komşu tiroid parankimasından daha az ekojen' },
      { value: 3, label: 'Çok hipoekoik', description: 'Komşu strap kaslardan daha az ekojen' }
    ],
    shape: [
      { value: 0, label: 'Genişlik > Boy', description: 'Transvers çap anteroposterior çaptan büyük' },
      { value: 3, label: 'Boy > Genişlik', description: 'Anteroposterior çap transvers çaptan büyük' }
    ],
    margin: [
      { value: 0, label: 'Düz', description: 'Düzgün, iyi tanımlanmış kenarlar' },
      { value: 0, label: 'Kötü tanımlanmış', description: 'Belirsiz kenarlar' },
      { value: 2, label: 'Lobule/İrregüler', description: 'Düzensiz, lobule kenarlar' },
      { value: 3, label: 'Ekstratiroidal uzanım', description: 'Tiroid kapsülünü aşan uzanım' }
    ],
    echogenicFoci: [
      { value: 0, label: 'Yok/Büyük kuyruklu yıldız artefaktları', description: 'Ekojen odak bulunmayan veya >1mm kuyruklu yıldız' },
      { value: 1, label: 'Makrokalsifikasyonlar', description: 'Büyük (≥1mm) kaba kalsifikasyonlar' },
      { value: 2, label: 'Periferik kalsifikasyonlar', description: 'Kenar kalsifikasyonları' },
      { value: 3, label: 'Punktat ekojen odaklar', description: 'Mikrokalsifikasyonlar (<1mm)' }
    ]
  };

  const riskLevels = {
    'TR1': { range: [0, 0], risk: '%2\'den az', category: 'Benign', color: 'text-green-400', fnaTreshold: 'İİAB yok', followUp: 'Takip yok' },
    'TR2': { range: [2, 2], risk: '%2\'den az', category: 'Şüpheli değil', color: 'text-green-400', fnaTreshold: 'İİAB yok', followUp: 'Takip yok' },
    'TR3': { range: [3, 3], risk: '%5', category: 'Hafif şüpheli', color: 'text-yellow-400', fnaTreshold: '≥2.5 cm', followUp: '>1.5 cm: yıllık x 5 yıl' },
    'TR4': { range: [4, 6], risk: '%5-20', category: 'Orta şüpheli', color: 'text-orange-400', fnaTreshold: '≥1.5 cm', followUp: '>1 cm: yıllık x 3-5 yıl' },
    'TR5': { range: [7, Infinity], risk: '%20\'üzerinde', category: 'Yüksek şüpheli', color: 'text-red-400', fnaTreshold: '≥1.0 cm', followUp: '>0.5 cm: yıllık x 5 yıl' }
  };

  const calculateTIRADS = () => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    let category = 'TR1';
    for (const [key, level] of Object.entries(riskLevels)) {
      if (totalScore >= level.range[0] && totalScore <= level.range[1]) {
        category = key;
        break;
      }
    }

    const riskLevel = riskLevels[category];
    const needsFNA = noduleSize && parseFloat(noduleSize) >= getRequiredSizeForFNA(category);
    
    setResult({
      totalScore,
      category,
      riskLevel,
      needsFNA,
      noduleSize: parseFloat(noduleSize) || 0
    });
  };

  const getRequiredSizeForFNA = (category) => {
    const thresholds = {
      'TR3': 2.5,
      'TR4': 1.5,
      'TR5': 1.0
    };
    return thresholds[category] || Infinity;
  };

  const handleScoreChange = (category, value) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const resetCalculator = () => {
    setScores({
      composition: 0,
      echogenicity: 0,
      shape: 0,
      margin: 0,
      echogenicFoci: 0
    });
    setNoduleSize('');
    setResult(null);
  };

  const containerClass = embedded 
    ? "bg-slate-800/40 border border-slate-700/50 rounded-xl p-6" 
    : "calculator-container";

  return (
    <div className={containerClass}>
      <div className="calculator-header">
        <h3 className="calculator-title text-xl font-bold mb-2">
          {embedded ? 'TI-RADS Hesaplayıcı' : 'ACR TI-RADS Hesaplayıcı'}
        </h3>
        <p className="calculator-description text-gray-400 text-sm mb-6">
          Tiroid nodül risk değerlendirmesi için ACR TI-RADS skorlama sistemi
        </p>
      </div>

      <div className="space-y-6">
        {/* Scoring Sections */}
        {Object.entries(scoringCriteria).map(([category, options]) => (
          <div key={category} className="calculator-input-group">
            <label className="calculator-label block text-sm font-medium text-gray-300 mb-3 capitalize">
              {category === 'echogenicFoci' ? 'Ekojen Odaklar' : 
               category === 'composition' ? 'Kompozisyon' :
               category === 'echogenicity' ? 'Ekojenite' :
               category === 'shape' ? 'Şekil' : 'Kenar'}
              <span className="text-purple-400 ml-1">({scores[category]} puan)</span>
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <label key={index} className="flex items-start p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name={category}
                    value={option.value}
                    checked={scores[category] === option.value}
                    onChange={(e) => handleScoreChange(category, parseInt(e.target.value))}
                    className="mt-1 mr-3 text-purple-500 focus:ring-purple-500 focus:ring-2"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{option.label}</span>
                      <span className="calculator-badge-primary text-xs px-2 py-1 rounded-full">
                        {option.value} puan
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Nodule Size Input */}
        <div className="calculator-input-group">
          <label className="calculator-label block text-sm font-medium text-gray-300 mb-3">
            Nodül Boyutu (cm) <span className="text-gray-500">- İsteğe bağlı</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Örn: 1.5"
            value={noduleSize}
            onChange={(e) => setNoduleSize(e.target.value)}
            className="calculator-input w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="calculator-button-container flex gap-3">
          <button
            onClick={calculateTIRADS}
            className="calculator-button flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Hesapla
          </button>
          <button
            onClick={resetCalculator}
            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="calculator-result bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="calculator-result-title flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>TI-RADS Sonucu</span>
                </div>
                <div className={`text-3xl font-bold ${result.riskLevel.color} mb-2`}>
                  {result.category}
                </div>
                <div className="text-sm text-gray-400">
                  Toplam Puan: <span className="text-white font-medium">{result.totalScore}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="calculator-badge-primary px-3 py-1 rounded-full text-sm font-medium">
                  {result.riskLevel.category}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Malignite Riski</h4>
                <div className={`text-xl font-bold ${result.riskLevel.color}`}>
                  {result.riskLevel.risk}
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">İİAB Eşiği</h4>
                <div className="text-white font-medium">
                  {result.riskLevel.fnaTreshold}
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Takip Önerisi</h4>
                <div className="text-white font-medium text-sm">
                  {result.riskLevel.followUp}
                </div>
              </div>
              
              {result.noduleSize > 0 && (
                <div className={`rounded-lg p-4 ${result.needsFNA ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-green-500/20 border border-green-500/30'}`}>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Bu Nodül için</h4>
                  <div className={`font-bold ${result.needsFNA ? 'text-orange-400' : 'text-green-400'}`}>
                    {result.needsFNA ? 'İİAB Gerekli' : 'İİAB Gerekli Değil'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Nodül boyutu: {result.noduleSize} cm
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h4 className="text-blue-400 font-medium text-sm mb-1">Önemli Not</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Bu hesaplayıcı sadece ACR TI-RADS skorlaması için bir araçtır. Kesin tanı ve tedavi kararları 
                    mutlaka klinisyen tarafından, klinik bulgular ve diğer görüntüleme modaliteleri ile birlikte değerlendirilmelidir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiRADSCalculator;
