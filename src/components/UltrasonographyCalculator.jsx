import React, { useState } from 'react';

const UltrasonographyCalculator = ({ embedded = false }) => {
  const [assessment, setAssessment] = useState({
    massShape: '',
    massMargin: '',
    massEcho: '',
    posteriorFeatures: '',
    orientation: '',
    vascularityPD: '',
    vascularityRI: '',
    elastography: '',
    skinChanges: false,
    ductalChanges: false,
    lymphNodes: false
  });

  const [patientInfo, setPatientInfo] = useState({
    age: '',
    symptoms: '',
    palpable: false,
    familyHistory: false,
    priorUS: false
  });

  const [result, setResult] = useState(null);

  const massShapeOptions = [
    { value: '', label: 'Kitle yok', risk: 0 },
    { value: 'oval', label: 'Oval', risk: 1 },
    { value: 'round', label: 'Yuvarlak', risk: 1 },
    { value: 'irregular', label: 'İrregüler', risk: 4 }
  ];

  const massMarginOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'circumscribed', label: 'Düzgün sınırlı', risk: 1 },
    { value: 'not_circumscribed', label: 'Düzgün sınırlı değil', risk: 3 },
    { value: 'indistinct', label: 'Belirsiz', risk: 3 },
    { value: 'angular', label: 'Köşeli', risk: 4 },
    { value: 'microlobulated', label: 'Mikrolobüle', risk: 4 },
    { value: 'spiculated', label: 'Spiküle', risk: 5 }
  ];

  const echoPatternOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'anechoic', label: 'Anekoik', risk: 0 },
    { value: 'hyperechoic', label: 'Hiperekoik', risk: 1 },
    { value: 'isoechoic', label: 'İzoekoik', risk: 2 },
    { value: 'hypoechoic', label: 'Hipoekoik', risk: 2 },
    { value: 'markedly_hypoechoic', label: 'Belirgin hipoekoik', risk: 4 },
    { value: 'complex', label: 'Kompleks kistik-solid', risk: 3 }
  ];

  const posteriorOptions = [
    { value: '', label: 'Posterior özellik yok', risk: 0 },
    { value: 'enhancement', label: 'Posterior enhancement', risk: 1 },
    { value: 'shadowing', label: 'Posterior gölgelenme', risk: 3 },
    { value: 'combined', label: 'Kombine pattern', risk: 2 }
  ];

  const orientationOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'parallel', label: 'Paralel (wider than tall)', risk: 1 },
    { value: 'not_parallel', label: 'Non-paralel (taller than wide)', risk: 3 }
  ];

  const vascularityOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'absent', label: 'Vaskülarite yok', risk: 1 },
    { value: 'minimal', label: 'Minimal vaskülarite', risk: 1 },
    { value: 'moderate', label: 'Orta düzeyde vaskülarite', risk: 2 },
    { value: 'marked', label: 'Belirgin vaskülarite', risk: 3 }
  ];

  const elastographyOptions = [
    { value: '', label: 'Elastografi yapılmadı', risk: 0 },
    { value: 'soft', label: 'Yumuşak (skor 1-2)', risk: 1 },
    { value: 'intermediate', label: 'Orta (skor 3)', risk: 2 },
    { value: 'hard', label: 'Sert (skor 4-5)', risk: 3 }
  ];

  const calculateBIRADS = () => {
    let riskScore = 0;
    let reasons = [];

    // Cystic lesion check first
    if (assessment.massEcho === 'anechoic') {
      setResult({
        category: 'BI-RADS 2',
        recommendation: 'Rutin takip',
        malignancyRisk: '%0',
        followUp: 'Basit kist - takip gerekmez',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        reasons: ['Basit kist - anekoik lezyon'],
        riskScore: 0
      });
      return;
    }

    // Solid mass assessment
    const shapeRisk = massShapeOptions.find(opt => opt.value === assessment.massShape)?.risk || 0;
    const marginRisk = massMarginOptions.find(opt => opt.value === assessment.massMargin)?.risk || 0;
    const echoRisk = echoPatternOptions.find(opt => opt.value === assessment.massEcho)?.risk || 0;
    const posteriorRisk = posteriorOptions.find(opt => opt.value === assessment.posteriorFeatures)?.risk || 0;
    const orientationRisk = orientationOptions.find(opt => opt.value === assessment.orientation)?.risk || 0;

    if (assessment.massShape) {
      // Calculate composite risk for solid mass
      const morphologyRisk = Math.max(shapeRisk, marginRisk);
      const echoAndPosterior = Math.max(echoRisk, posteriorRisk);
      riskScore = Math.max(morphologyRisk, echoAndPosterior, orientationRisk);
      
      reasons.push(`Kitle şekli: ${massShapeOptions.find(opt => opt.value === assessment.massShape)?.label}`);
      reasons.push(`Kitle kenarları: ${massMarginOptions.find(opt => opt.value === assessment.massMargin)?.label}`);
      reasons.push(`Eko pattern: ${echoPatternOptions.find(opt => opt.value === assessment.massEcho)?.label}`);
    }

    // Vascularity assessment
    const vascularityRisk = vascularityOptions.find(opt => opt.value === assessment.vascularityPD)?.risk || 0;
    if (assessment.vascularityPD && vascularityRisk > 1) {
      riskScore = Math.max(riskScore, vascularityRisk);
      reasons.push(`Doppler vaskülarite: ${vascularityOptions.find(opt => opt.value === assessment.vascularityPD)?.label}`);
    }

    // Elastography
    const elastoRisk = elastographyOptions.find(opt => opt.value === assessment.elastography)?.risk || 0;
    if (assessment.elastography && elastoRisk > 1) {
      riskScore = Math.max(riskScore, elastoRisk);
      reasons.push(`Elastografi: ${elastographyOptions.find(opt => opt.value === assessment.elastography)?.label}`);
    }

    // Associated features
    if (assessment.skinChanges) {
      riskScore = Math.max(riskScore, 4);
      reasons.push('Cilt değişiklikleri mevcut');
    }

    if (assessment.ductalChanges) {
      riskScore = Math.max(riskScore, 3);
      reasons.push('Duktus değişiklikleri mevcut');
    }

    if (assessment.lymphNodes) {
      riskScore = Math.max(riskScore, 3);
      reasons.push('Şüpheli lenf nodları mevcut');
    }

    // Special considerations for US
    if (assessment.orientation === 'not_parallel' && assessment.massEcho === 'markedly_hypoechoic') {
      riskScore = Math.max(riskScore, 4);
      reasons.push('Taller-than-wide + belirgin hipoekoik pattern');
    }

    // Determine BI-RADS category
    let category = 'BI-RADS 1';
    let recommendation = 'Rutin takip';
    let malignancyRisk = '%0';
    let followUp = 'Rutin izlem';
    let color = 'text-green-400';
    let bgColor = 'bg-green-500/20';
    let borderColor = 'border-green-500/30';

    if (riskScore === 0) {
      category = 'BI-RADS 1';
      // Already set above
    } else if (riskScore === 1) {
      category = 'BI-RADS 2';
      recommendation = 'Rutin takip';
      followUp = 'Benign lezyon - rutin izlem';
    } else if (riskScore === 2) {
      category = 'BI-RADS 3';
      recommendation = '6 aylık kısa dönem takip';
      malignancyRisk = '&lt;2%';
      followUp = '6 ay, 12 ay, 24 ay takip US';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-500/20';
      borderColor = 'border-yellow-500/30';
    } else if (riskScore === 3) {
      category = 'BI-RADS 4A';
      recommendation = 'US eşliğinde çekirdek iğne biyopsisi';
      malignancyRisk = '%2-10';
      followUp = 'Histopatolojik değerlendirme sonrası karar';
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/20';
      borderColor = 'border-orange-500/30';
    } else if (riskScore === 4) {
      category = 'BI-RADS 4B';
      recommendation = 'US eşliğinde çekirdek iğne biyopsisi';
      malignancyRisk = '%10-50';
      followUp = 'Histopatolojik değerlendirme sonrası karar';
      color = 'text-orange-500';
      bgColor = 'bg-orange-500/20';
      borderColor = 'border-orange-500/30';
    } else if (riskScore >= 5) {
      category = 'BI-RADS 5';
      recommendation = 'US eşliğinde çekirdek iğne biyopsisi';
      malignancyRisk = '&gt;95%';
      followUp = 'Histopatolojik doğrulama sonrası cerrahi konsültasyon';
      color = 'text-red-500';
      bgColor = 'bg-red-500/20';
      borderColor = 'border-red-500/30';
    }

    // Patient factors
    if (patientInfo.age && parseInt(patientInfo.age) < 30 && riskScore >= 3) {
      reasons.push('Genç yaş - dikkatli değerlendirme');
    }

    if (patientInfo.familyHistory && riskScore >= 2) {
      reasons.push('Pozitif aile hikayesi');
    }

    if (patientInfo.palpable && riskScore >= 2) {
      reasons.push('Palpabl kitle');
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
        palpable: patientInfo.palpable,
        familyHistory: patientInfo.familyHistory
      }
    });
  };

  const resetCalculator = () => {
    setAssessment({
      massShape: '',
      massMargin: '',
      massEcho: '',
      posteriorFeatures: '',
      orientation: '',
      vascularityPD: '',
      vascularityRI: '',
      elastography: '',
      skinChanges: false,
      ductalChanges: false,
      lymphNodes: false
    });
    setPatientInfo({
      age: '',
      symptoms: '',
      palpable: false,
      familyHistory: false,
      priorUS: false
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
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          {embedded ? 'Ultrasonografi BI-RADS' : 'Ultrasonografi BI-RADS Değerlendirmesi'}
        </h3>
        <p className="calculator-description text-gray-400 text-sm mb-6">
          Meme ultrasonografi bulgularını ACR BI-RADS kriterlerine göre değerlendirin
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
              <label className="block text-sm text-gray-300 mb-2">Semptomlar</label>
              <input
                type="text"
                value={patientInfo.symptoms}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                placeholder="Örn: ele gelen kitle, ağrı"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={patientInfo.palpable}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, palpable: e.target.checked }))}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-gray-300 text-sm">Palpabl lezyon</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={patientInfo.familyHistory}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, familyHistory: e.target.checked }))}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-gray-300 text-sm">Meme/over kanseri aile hikayesi</span>
            </label>
          </div>
        </div>

        {/* Mass Morphology */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Kitle Morfolojisi</h4>
          
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
              <label className="block text-sm text-gray-300 mb-2">Ekojenite</label>
              <select
                value={assessment.massEcho}
                onChange={(e) => setAssessment(prev => ({ ...prev, massEcho: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                disabled={!assessment.massShape}
              >
                {echoPatternOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Posterior Akustik</label>
              <select
                value={assessment.posteriorFeatures}
                onChange={(e) => setAssessment(prev => ({ ...prev, posteriorFeatures: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                disabled={!assessment.massShape}
              >
                {posteriorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Oryantasyon</label>
              <select
                value={assessment.orientation}
                onChange={(e) => setAssessment(prev => ({ ...prev, orientation: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                disabled={!assessment.massShape}
              >
                {orientationOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Advanced US Features */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">İleri US Özellikleri</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Power Doppler</label>
              <select
                value={assessment.vascularityPD}
                onChange={(e) => setAssessment(prev => ({ ...prev, vascularityPD: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {vascularityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Elastografi</label>
              <select
                value={assessment.elastography}
                onChange={(e) => setAssessment(prev => ({ ...prev, elastography: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {elastographyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Associated Features */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Eşlik Eden Bulgular</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={assessment.skinChanges}
                onChange={(e) => setAssessment(prev => ({ ...prev, skinChanges: e.target.checked }))}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-gray-300">Cilt değişiklikleri</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={assessment.ductalChanges}
                onChange={(e) => setAssessment(prev => ({ ...prev, ductalChanges: e.target.checked }))}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-gray-300">Duktus değişiklikleri</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={assessment.lymphNodes}
                onChange={(e) => setAssessment(prev => ({ ...prev, lymphNodes: e.target.checked }))}
                className="w-4 h-4 text-cyan-500"
              />
              <span className="text-gray-300">Şüpheli lenf nodları</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={calculateBIRADS}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Ultrasonografi BI-RADS</span>
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
                      <span className="text-cyan-400">•</span>
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

export default UltrasonographyCalculator;