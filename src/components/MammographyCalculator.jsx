import React, { useState } from 'react';

const MammographyCalculator = ({ embedded = false }) => {
  const [assessment, setAssessment] = useState({
    massShape: '',
    massMargin: '',
    massDensity: '',
    calcificationType: '',
    calcificationDistribution: '',
    architecturalDistortion: false,
    asymmetry: '',
    skinThickening: false,
    nippleRetraction: false,
    axillaryNodes: false
  });

  const [patientInfo, setPatientInfo] = useState({
    age: '',
    parenchymalDensity: 'a',
    familyHistory: false,
    priorMammograms: false,
    symptoms: ''
  });

  const [result, setResult] = useState(null);

  const massShapeOptions = [
    { value: '', label: 'Kitle yok', risk: 0 },
    { value: 'oval', label: 'Oval', risk: 1 },
    { value: 'round', label: 'Yuvarlak', risk: 1 },
    { value: 'irregular', label: 'İrregüler', risk: 3 }
  ];

  const massMarginOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'circumscribed', label: 'Düzgün sınırlı', risk: 1 },
    { value: 'obscured', label: 'Örtülü', risk: 2 },
    { value: 'microlobulated', label: 'Mikrolobüle', risk: 3 },
    { value: 'indistinct', label: 'Belirsiz', risk: 3 },
    { value: 'spiculated', label: 'Spiküle', risk: 4 }
  ];

  const massDensityOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'fat', label: 'Yağ eş-dansite', risk: 0 },
    { value: 'low', label: 'Düşük dansite', risk: 1 },
    { value: 'equal', label: 'Eşit dansite', risk: 2 },
    { value: 'high', label: 'Yüksek dansite', risk: 3 }
  ];

  const calcificationOptions = [
    { value: '', label: 'Kalsifikasyon yok', risk: 0 },
    { value: 'skin', label: 'Deri kalsifikasyonu', risk: 0 },
    { value: 'vascular', label: 'Vasküler', risk: 0 },
    { value: 'coarse', label: 'Kaba heterojen', risk: 0 },
    { value: 'large_rodlike', label: 'Büyük çubuk şeklinde', risk: 0 },
    { value: 'round', label: 'Yuvarlak', risk: 1 },
    { value: 'rim', label: 'Rim (çevre)', risk: 1 },
    { value: 'dystrophic', label: 'Distrofik', risk: 1 },
    { value: 'milk_of_calcium', label: 'Süt kalsifikasyonu', risk: 1 },
    { value: 'amorphous', label: 'Amorf', risk: 2 },
    { value: 'coarse_heterogeneous', label: 'Kaba heterogen şüpheli', risk: 3 },
    { value: 'fine_pleomorphic', label: 'İnce pleomorfik', risk: 4 },
    { value: 'fine_linear', label: 'İnce linear/dallanma', risk: 5 }
  ];

  const distributionOptions = [
    { value: '', label: 'Uygulanamaz', risk: 0 },
    { value: 'clustered', label: 'Kümelenme', risk: 1 },
    { value: 'regional', label: 'Bölgesel', risk: 2 },
    { value: 'segmental', label: 'Segmental', risk: 3 },
    { value: 'linear', label: 'Linear', risk: 4 },
    { value: 'diffuse', label: 'Yaygın', risk: 1 }
  ];

  const densityCategories = [
    { value: 'a', label: 'A - Neredeyse tamamen yağlı' },
    { value: 'b', label: 'B - Dağınık fibroglandüler' },
    { value: 'c', label: 'C - Heterojen yoğun' },
    { value: 'd', label: 'D - Aşırı yoğun' }
  ];

  const calculateBIRADS = () => {
    let riskScore = 0;
    let reasons = [];

    // Mass assessment
    const shapeRisk = massShapeOptions.find(opt => opt.value === assessment.massShape)?.risk || 0;
    const marginRisk = massMarginOptions.find(opt => opt.value === assessment.massMargin)?.risk || 0;
    const densityRisk = massDensityOptions.find(opt => opt.value === assessment.massDensity)?.risk || 0;

    if (assessment.massShape) {
      riskScore += Math.max(shapeRisk, marginRisk, densityRisk);
      reasons.push(`Kitle özellikleri: ${massShapeOptions.find(opt => opt.value === assessment.massShape)?.label} + ${massMarginOptions.find(opt => opt.value === assessment.massMargin)?.label}`);
    }

    // Calcification assessment
    const calcRisk = calcificationOptions.find(opt => opt.value === assessment.calcificationType)?.risk || 0;
    const distRisk = distributionOptions.find(opt => opt.value === assessment.calcificationDistribution)?.risk || 0;
    
    if (assessment.calcificationType) {
      const calcTotalRisk = Math.max(calcRisk + (distRisk > 0 ? distRisk - 1 : 0), calcRisk);
      riskScore = Math.max(riskScore, calcTotalRisk);
      reasons.push(`Kalsifikasyon: ${calcificationOptions.find(opt => opt.value === assessment.calcificationType)?.label}`);
      
      if (assessment.calcificationDistribution) {
        reasons.push(`Dağılım: ${distributionOptions.find(opt => opt.value === assessment.calcificationDistribution)?.label}`);
      }
    }

    // Associated features
    if (assessment.architecturalDistortion) {
      riskScore = Math.max(riskScore, 4);
      reasons.push('Architectural distortion mevcut');
    }

    if (assessment.asymmetry === 'developing') {
      riskScore = Math.max(riskScore, 3);
      reasons.push('Gelişmekte olan asimetri');
    } else if (assessment.asymmetry === 'focal') {
      riskScore = Math.max(riskScore, 2);
      reasons.push('Fokal asimetri');
    }

    // Associated features that increase suspicion
    if (assessment.skinThickening || assessment.nippleRetraction || assessment.axillaryNodes) {
      riskScore = Math.max(riskScore, 3);
      if (assessment.skinThickening) reasons.push('Cilt kalınlaşması');
      if (assessment.nippleRetraction) reasons.push('Nipple retraksiyonu');
      if (assessment.axillaryNodes) reasons.push('Şüpheli aksiller nodül');
    }

    // Determine BI-RADS category
    let category = 'BI-RADS 1';
    let recommendation = 'Rutin tarama';
    let malignancyRisk = '%0';
    let followUp = 'Yaş grubu için önerilen rutin tarama';
    let color = 'text-green-400';
    let bgColor = 'bg-green-500/20';
    let borderColor = 'border-green-500/30';

    if (riskScore === 0) {
      category = 'BI-RADS 1';
      // Already set above
    } else if (riskScore === 1) {
      category = 'BI-RADS 2';
      recommendation = 'Rutin tarama';
      followUp = 'Yaş grubu için önerilen rutin tarama';
    } else if (riskScore === 2) {
      category = 'BI-RADS 3';
      recommendation = '6 aylık kısa dönem takip';
      malignancyRisk = '&lt;2%';
      followUp = '6 ay, 12 ay, 24 ay takip mammografi';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-500/20';
      borderColor = 'border-yellow-500/30';
    } else if (riskScore === 3) {
      category = 'BI-RADS 4A';
      recommendation = 'Çekirdek iğne biyopsisi';
      malignancyRisk = '%2-10';
      followUp = 'Histopatolojik değerlendirme sonrası karar';
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/20';
      borderColor = 'border-orange-500/30';
    } else if (riskScore === 4) {
      category = 'BI-RADS 4B';
      recommendation = 'Çekirdek iğne biyopsisi';
      malignancyRisk = '%10-50';
      followUp = 'Histopatolojik değerlendirme sonrası karar';
      color = 'text-orange-500';
      bgColor = 'bg-orange-500/20';
      borderColor = 'border-orange-500/30';
    } else if (riskScore >= 5) {
      category = 'BI-RADS 5';
      recommendation = 'Çekirdek iğne biyopsisi';
      malignancyRisk = '&gt;95%';
      followUp = 'Histopatolojik doğrulama sonrası cerrahi konsültasyon';
      color = 'text-red-500';
      bgColor = 'bg-red-500/20';
      borderColor = 'border-red-500/30';
    }

    // Consider patient factors
    if (patientInfo.age && parseInt(patientInfo.age) < 40 && riskScore >= 2) {
      reasons.push('Genç yaş - dikkatli değerlendirme');
    }

    if (patientInfo.familyHistory && riskScore >= 2) {
      reasons.push('Pozitif aile hikayesi');
    }

    setResult({
      category,
      recommendation,
      malignancyRisk,
      followUp,
      color,
      bgColor,
      borderColor,
      reasons,
      riskScore,
      patientFactors: {
        age: patientInfo.age,
        density: patientInfo.parenchymalDensity,
        familyHistory: patientInfo.familyHistory
      }
    });
  };

  const resetCalculator = () => {
    setAssessment({
      massShape: '',
      massMargin: '',
      massDensity: '',
      calcificationType: '',
      calcificationDistribution: '',
      architecturalDistortion: false,
      asymmetry: '',
      skinThickening: false,
      nippleRetraction: false,
      axillaryNodes: false
    });
    setPatientInfo({
      age: '',
      parenchymalDensity: 'a',
      familyHistory: false,
      priorMammograms: false,
      symptoms: ''
    });
    setResult(null);
  };

  const containerClass = embedded 
    ? "bg-slate-800/40 border border-slate-700/50 rounded-xl p-6" 
    : "calculator-container";

  return (
    <div className={containerClass}>
      <div className="calculator-header">
        <h3 className="calculator-title text-xl font-bold mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {embedded ? 'Mammografi BI-RADS' : 'Mammografi BI-RADS Değerlendirmesi'}
        </h3>
        <p className="calculator-description text-gray-400 text-sm mb-6">
          Digital mammografi bulgularını ACR BI-RADS kriterlerine göre değerlendirin
        </p>
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Hasta Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Yaş</label>
              <input
                type="number"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                placeholder="Yaş"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Meme Yoğunluğu</label>
              <select
                value={patientInfo.parenchymalDensity}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, parenchymalDensity: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {densityCategories.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={patientInfo.familyHistory}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, familyHistory: e.target.checked }))}
                className="w-4 h-4 text-blue-500"
              />
              <span className="text-gray-300 text-sm">Meme/over kanseri aile hikayesi</span>
            </label>
          </div>
        </div>

        {/* Mass Assessment */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Kitle Değerlendirmesi</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Şekil</label>
              <select
                value={assessment.massShape}
                onChange={(e) => setAssessment(prev => ({ ...prev, massShape: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {massShapeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Kenar</label>
              <select
                value={assessment.massMargin}
                onChange={(e) => setAssessment(prev => ({ ...prev, massMargin: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                disabled={!assessment.massShape}
              >
                {massMarginOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Dansite</label>
              <select
                value={assessment.massDensity}
                onChange={(e) => setAssessment(prev => ({ ...prev, massDensity: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                disabled={!assessment.massShape}
              >
                {massDensityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calcification Assessment */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Kalsifikasyon Değerlendirmesi</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Kalsifikasyon Tipi</label>
              <select
                value={assessment.calcificationType}
                onChange={(e) => setAssessment(prev => ({ ...prev, calcificationType: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {calcificationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Dağılım</label>
              <select
                value={assessment.calcificationDistribution}
                onChange={(e) => setAssessment(prev => ({ ...prev, calcificationDistribution: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                disabled={!assessment.calcificationType || assessment.calcificationType === ''}
              >
                {distributionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Associated Features */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Eşlik Eden Bulgular</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={assessment.architecturalDistortion}
                  onChange={(e) => setAssessment(prev => ({ ...prev, architecturalDistortion: e.target.checked }))}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-gray-300">Architectural distortion</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={assessment.skinThickening}
                  onChange={(e) => setAssessment(prev => ({ ...prev, skinThickening: e.target.checked }))}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-gray-300">Cilt kalınlaşması</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={assessment.nippleRetraction}
                  onChange={(e) => setAssessment(prev => ({ ...prev, nippleRetraction: e.target.checked }))}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-gray-300">Nipple retraksiyonu</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={assessment.axillaryNodes}
                  onChange={(e) => setAssessment(prev => ({ ...prev, axillaryNodes: e.target.checked }))}
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-gray-300">Şüpheli aksiller nodül</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-300 mb-2">Asimetri</label>
            <select
              value={assessment.asymmetry}
              onChange={(e) => setAssessment(prev => ({ ...prev, asymmetry: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
            >
              <option value="">Asimetri yok</option>
              <option value="global">Global asimetri</option>
              <option value="focal">Fokal asimetri</option>
              <option value="developing">Gelişmekte olan asimetri</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={calculateBIRADS}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            BI-RADS Değerlendir
          </button>
          <button
            onClick={resetCalculator}
            className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold rounded-lg transition-colors duration-200"
          >
            Sıfırla
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`border rounded-xl p-6 space-y-4 ${result.bgColor} ${result.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>Mammografi BI-RADS</span>
                </div>
                <div className={`text-3xl font-bold ${result.color} mb-2`}>
                  {result.category}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${result.bgColor} border ${result.borderColor}`}>
                Risk: <span dangerouslySetInnerHTML={{ __html: result.malignancyRisk }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Önerilen Yaklaşım</h4>
                <p className="text-white font-medium text-sm">{result.recommendation}</p>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Takip Protokolü</h4>
                <p className="text-white text-sm">{result.followUp}</p>
              </div>
            </div>

            {result.reasons.length > 0 && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Değerlendirme Kriterleri</h4>
                <ul className="text-white text-sm space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MammographyCalculator;