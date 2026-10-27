import React, { useState } from 'react';

const MRICalculator = ({ embedded = false }) => {
  const [assessment, setAssessment] = useState({
    enhancementType: '',
    massShape: '',
    massMargin: '',
    internalEnhancement: '',
    kineticsType: '',
    initialEnhancement: '',
    delayedEnhancement: '',
    t2Signal: '',
    diffusionADC: '',
    nonMassType: '',
    nonMassDistribution: '',
    skinEnhancement: false,
    nippleEnhancement: false,
    lymphNodes: false
  });

  const [patientInfo, setPatientInfo] = useState({
    age: '',
    riskFactors: '',
    indication: '',
    contrastAllergy: false,
    priorMRI: false,
    menstrualPhase: ''
  });

  const [result, setResult] = useState(null);

  const enhancementTypeOptions = [
    { value: '', label: 'Enhancement yok', risk: 0 },
    { value: 'focus', label: 'Focus (<5mm)', risk: 1 },
    { value: 'mass', label: 'Mass (≥5mm)', risk: 2 },
    { value: 'non_mass', label: 'Non-mass enhancement', risk: 2 }
  ];

  const massShapeOptions = [
    { value: '', label: 'Uygulanamaz', risk: 0 },
    { value: 'oval', label: 'Oval', risk: 1 },
    { value: 'round', label: 'Yuvarlak', risk: 1 },
    { value: 'irregular', label: 'İrregüler', risk: 4 }
  ];

  const massMarginOptions = [
    { value: '', label: 'Uygulanamaz', risk: 0 },
    { value: 'circumscribed', label: 'Düzgün sınırlı', risk: 1 },
    { value: 'not_circumscribed', label: 'Düzgün sınırlı değil', risk: 3 },
    { value: 'irregular', label: 'İrregüler', risk: 4 },
    { value: 'spiculated', label: 'Spiküle', risk: 5 }
  ];

  const internalEnhancementOptions = [
    { value: '', label: 'Uygulanamaz', risk: 0 },
    { value: 'homogeneous', label: 'Homojen', risk: 1 },
    { value: 'heterogeneous', label: 'Heterojen', risk: 2 },
    { value: 'rim', label: 'Rim enhancement', risk: 4 },
    { value: 'dark_septations', label: 'Karanlık septasyonlar', risk: 1 }
  ];

  const kineticsOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'type1', label: 'Type I (Progressive)', risk: 1 },
    { value: 'type2', label: 'Type II (Plateau)', risk: 2 },
    { value: 'type3', label: 'Type III (Washout)', risk: 4 }
  ];

  const initialEnhancementOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'slow', label: 'Yavaş (<50%)', risk: 1 },
    { value: 'medium', label: 'Orta (50-100%)', risk: 2 },
    { value: 'fast', label: 'Hızlı (>100%)', risk: 3 }
  ];

  const delayedOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'persistent', label: 'Persistent (devam eden)', risk: 1 },
    { value: 'plateau', label: 'Plateau (düz)', risk: 2 },
    { value: 'washout', label: 'Washout (>10% azalma)', risk: 4 }
  ];

  const t2SignalOptions = [
    { value: '', label: 'Değerlendirilemez', risk: 0 },
    { value: 'hyperintense', label: 'Hiperintens', risk: 1 },
    { value: 'isointense', label: 'İzointens', risk: 2 },
    { value: 'hypointense', label: 'Hipointens', risk: 3 },
    { value: 'mixed', label: 'Mikst sinyal', risk: 2 }
  ];

  const adcOptions = [
    { value: '', label: 'DWI yapılmadı', risk: 0 },
    { value: 'high', label: 'Yüksek ADC (>1.3)', risk: 1 },
    { value: 'intermediate', label: 'Orta ADC (1.0-1.3)', risk: 2 },
    { value: 'low', label: 'Düşük ADC (<1.0)', risk: 4 }
  ];

  const nonMassTypeOptions = [
    { value: '', label: 'Uygulanamaz', risk: 0 },
    { value: 'homogeneous', label: 'Homojen', risk: 1 },
    { value: 'heterogeneous', label: 'Heterojen', risk: 2 },
    { value: 'stippled', label: 'Punktat/stippled', risk: 2 },
    { value: 'clumped', label: 'Clumped/kümelenme', risk: 3 },
    { value: 'clustered', label: 'Clustered ring', risk: 4 }
  ];

  const nonMassDistributionOptions = [
    { value: '', label: 'Uygulanamaz', risk: 0 },
    { value: 'focal', label: 'Fokal', risk: 1 },
    { value: 'linear', label: 'Linear', risk: 3 },
    { value: 'segmental', label: 'Segmental', risk: 4 },
    { value: 'regional', label: 'Bölgesel', risk: 2 },
    { value: 'multiple', label: 'Multiple bölgeler', risk: 2 },
    { value: 'diffuse', label: 'Yaygın', risk: 2 }
  ];

  const calculateBIRADS = () => {
    let riskScore = 0;
    let reasons = [];

    // No enhancement
    if (assessment.enhancementType === '') {
      setResult({
        category: 'BI-RADS 1',
        recommendation: 'Rutin tarama',
        malignancyRisk: '%0',
        followUp: 'Rutin MRG izlemi',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        reasons: ['Enhancement görülmedi'],
        riskScore: 0
      });
      return;
    }

    // Focus assessment
    if (assessment.enhancementType === 'focus') {
      riskScore = 1;
      reasons.push('Focus (<5mm) enhancement');
    }

    // Mass assessment
    else if (assessment.enhancementType === 'mass') {
      const shapeRisk = massShapeOptions.find(opt => opt.value === assessment.massShape)?.risk || 0;
      const marginRisk = massMarginOptions.find(opt => opt.value === assessment.massMargin)?.risk || 0;
      const internalRisk = internalEnhancementOptions.find(opt => opt.value === assessment.internalEnhancement)?.risk || 0;
      
      riskScore = Math.max(shapeRisk, marginRisk, internalRisk);
      
      if (assessment.massShape) reasons.push(`Mass şekli: ${massShapeOptions.find(opt => opt.value === assessment.massShape)?.label}`);
      if (assessment.massMargin) reasons.push(`Mass kenarları: ${massMarginOptions.find(opt => opt.value === assessment.massMargin)?.label}`);
      if (assessment.internalEnhancement) reasons.push(`İnternal enhancement: ${internalEnhancementOptions.find(opt => opt.value === assessment.internalEnhancement)?.label}`);
    }

    // Non-mass enhancement
    else if (assessment.enhancementType === 'non_mass') {
      const typeRisk = nonMassTypeOptions.find(opt => opt.value === assessment.nonMassType)?.risk || 0;
      const distRisk = nonMassDistributionOptions.find(opt => opt.value === assessment.nonMassDistribution)?.risk || 0;
      
      riskScore = Math.max(typeRisk, distRisk);
      
      if (assessment.nonMassType) reasons.push(`Non-mass tipi: ${nonMassTypeOptions.find(opt => opt.value === assessment.nonMassType)?.label}`);
      if (assessment.nonMassDistribution) reasons.push(`Dağılım: ${nonMassDistributionOptions.find(opt => opt.value === assessment.nonMassDistribution)?.label}`);
    }

    // Kinetics assessment - very important for MRI
    const kineticsRisk = kineticsOptions.find(opt => opt.value === assessment.kineticsType)?.risk || 0;
    const delayedRisk = delayedOptions.find(opt => opt.value === assessment.delayedEnhancement)?.risk || 0;
    
    if (assessment.kineticsType || assessment.delayedEnhancement) {
      riskScore = Math.max(riskScore, Math.max(kineticsRisk, delayedRisk));
      if (assessment.kineticsType) reasons.push(`Kinetik pattern: ${kineticsOptions.find(opt => opt.value === assessment.kineticsType)?.label}`);
      if (assessment.delayedEnhancement) reasons.push(`Delayed faz: ${delayedOptions.find(opt => opt.value === assessment.delayedEnhancement)?.label}`);
    }

    // Diffusion/ADC - modern MRI feature
    const adcRisk = adcOptions.find(opt => opt.value === assessment.diffusionADC)?.risk || 0;
    if (assessment.diffusionADC && adcRisk > riskScore * 0.5) {
      riskScore = Math.max(riskScore, adcRisk);
      reasons.push(`Difüzyon: ${adcOptions.find(opt => opt.value === assessment.diffusionADC)?.label}`);
    }

    // T2 signal characteristics
    const t2Risk = t2SignalOptions.find(opt => opt.value === assessment.t2Signal)?.risk || 0;
    if (assessment.t2Signal === 'hypointense' && riskScore >= 2) {
      riskScore = Math.max(riskScore, 3);
      reasons.push('T2 hipointens sinyal (şüpheli)');
    } else if (assessment.t2Signal === 'hyperintense' && riskScore <= 1) {
      reasons.push('T2 hiperintens sinyal (genellikle benign)');
    }

    // Associated features
    if (assessment.skinEnhancement) {
      riskScore = Math.max(riskScore, 4);
      reasons.push('Cilt enhancement (inflammatory signs)');
    }

    if (assessment.nippleEnhancement) {
      riskScore = Math.max(riskScore, 3);
      reasons.push('Nipple enhancement');
    }

    if (assessment.lymphNodes) {
      riskScore = Math.max(riskScore, 3);
      reasons.push('Şüpheli lenf nodları');
    }

    // Special MRI considerations
    if (assessment.kineticsType === 'type3' && (assessment.massShape === 'irregular' || assessment.nonMassDistribution === 'segmental')) {
      riskScore = Math.max(riskScore, 4);
      reasons.push('Washout kinetik + yüksek şüphe morfolojisi');
    }

    // Determine BI-RADS category
    let category = 'BI-RADS 1';
    let recommendation = 'Rutin tarama';
    let malignancyRisk = '%0';
    let followUp = 'Rutin MRG izlemi';
    let color = 'text-green-400';
    let bgColor = 'bg-green-500/20';
    let borderColor = 'border-green-500/30';

    if (riskScore === 0) {
      category = 'BI-RADS 1';
      // Already set above
    } else if (riskScore === 1) {
      category = 'BI-RADS 2';
      recommendation = 'Rutin takip';
      followUp = 'Benign bulgular - rutin MRG izlemi';
    } else if (riskScore === 2) {
      category = 'BI-RADS 3';
      recommendation = '6 aylık kısa dönem MRG takip';
      malignancyRisk = '&lt;2%';
      followUp = '6 ay MRG, sonra yıllık';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-500/20';
      borderColor = 'border-yellow-500/30';
    } else if (riskScore === 3) {
      category = 'BI-RADS 4A';
      recommendation = 'MRG eşliğinde biyopsi veya Second-look US';
      malignancyRisk = '%2-10';
      followUp = 'Histopatolojik değerlendirme sonrası karar';
      color = 'text-orange-400';
      bgColor = 'bg-orange-500/20';
      borderColor = 'border-orange-500/30';
    } else if (riskScore === 4) {
      category = 'BI-RADS 4B';
      recommendation = 'MRG eşliğinde biyopsi';
      malignancyRisk = '%10-50';
      followUp = 'Histopatolojik değerlendirme sonrası karar';
      color = 'text-orange-500';
      bgColor = 'bg-orange-500/20';
      borderColor = 'border-orange-500/30';
    } else if (riskScore >= 5) {
      category = 'BI-RADS 5';
      recommendation = 'MRG eşliğinde biyopsi';
      malignancyRisk = '&gt;95%';
      followUp = 'Histopatolojik doğrulama sonrası multidisipliner yaklaşım';
      color = 'text-red-500';
      bgColor = 'bg-red-500/20';
      borderColor = 'border-red-500/30';
    }

    // Patient factors for MRI
    if (patientInfo.age && parseInt(patientInfo.age) < 25 && riskScore >= 2) {
      reasons.push('Çok genç yaş - dikkatli değerlendirme');
    }

    if (patientInfo.riskFactors && riskScore >= 2) {
      reasons.push('Yüksek risk faktörleri mevcut');
    }

    if (patientInfo.menstrualPhase === 'luteal' && riskScore <= 2) {
      reasons.push('Luteal faz - hormonal enhancement olabilir');
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
        riskFactors: patientInfo.riskFactors,
        menstrualPhase: patientInfo.menstrualPhase
      }
    });
  };

  const resetCalculator = () => {
    setAssessment({
      enhancementType: '',
      massShape: '',
      massMargin: '',
      internalEnhancement: '',
      kineticsType: '',
      initialEnhancement: '',
      delayedEnhancement: '',
      t2Signal: '',
      diffusionADC: '',
      nonMassType: '',
      nonMassDistribution: '',
      skinEnhancement: false,
      nippleEnhancement: false,
      lymphNodes: false
    });
    setPatientInfo({
      age: '',
      riskFactors: '',
      indication: '',
      contrastAllergy: false,
      priorMRI: false,
      menstrualPhase: ''
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
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
          </svg>
          {embedded ? 'MRG BI-RADS' : 'MRG BI-RADS Değerlendirmesi'}
        </h3>
        <p className="calculator-description text-gray-400 text-sm mb-6">
          Kontrastlı dinamik meme MRG bulgularını ACR BI-RADS kriterlerine göre değerlendirin
        </p>
      </div>

      <div className="space-y-6">
        {/* Patient Information */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Hasta Bilgileri</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm text-gray-300 mb-2">Endikasyon</label>
              <input
                type="text"
                value={patientInfo.indication}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, indication: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                placeholder="Örn: yüksek risk, preoperatif"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Menstrual Faz</label>
              <select
                value={patientInfo.menstrualPhase}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, menstrualPhase: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                <option value="">Bilinmiyor</option>
                <option value="follicular">Foliküler faz (1-14. gün)</option>
                <option value="luteal">Luteal faz (15-28. gün)</option>
                <option value="postmenopausal">Postmenopozal</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm text-gray-300 mb-2">Risk Faktörleri</label>
            <input
              type="text"
              value={patientInfo.riskFactors}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, riskFactors: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              placeholder="Örn: BRCA mutasyonu, güçlü aile hikayesi, önceki atipik lezyon"
            />
          </div>
        </div>

        {/* Enhancement Pattern */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">Enhancement Paterni</h4>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Enhancement Tipi</label>
            <select
              value={assessment.enhancementType}
              onChange={(e) => setAssessment(prev => ({ ...prev, enhancementType: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
            >
              {enhancementTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Mass-specific fields */}
          {assessment.enhancementType === 'mass' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Mass Şekli</label>
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
                <label className="block text-sm text-gray-300 mb-2">Mass Kenarları</label>
                <select
                  value={assessment.massMargin}
                  onChange={(e) => setAssessment(prev => ({ ...prev, massMargin: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {massMarginOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">İnternal Enhancement</label>
                <select
                  value={assessment.internalEnhancement}
                  onChange={(e) => setAssessment(prev => ({ ...prev, internalEnhancement: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {internalEnhancementOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Non-mass enhancement fields */}
          {assessment.enhancementType === 'non_mass' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Non-mass Enhancement Tipi</label>
                <select
                  value={assessment.nonMassType}
                  onChange={(e) => setAssessment(prev => ({ ...prev, nonMassType: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {nonMassTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Dağılım</label>
                <select
                  value={assessment.nonMassDistribution}
                  onChange={(e) => setAssessment(prev => ({ ...prev, nonMassDistribution: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {nonMassDistributionOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Kinetics Assessment */}
        {(assessment.enhancementType === 'mass' || assessment.enhancementType === 'non_mass') && (
          <div className="calculator-input-group">
            <h4 className="text-lg font-semibold text-white mb-3">Kinetik Değerlendirme</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Kinetik Curve Tipi</label>
                <select
                  value={assessment.kineticsType}
                  onChange={(e) => setAssessment(prev => ({ ...prev, kineticsType: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {kineticsOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">İnitial Enhancement</label>
                <select
                  value={assessment.initialEnhancement}
                  onChange={(e) => setAssessment(prev => ({ ...prev, initialEnhancement: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {initialEnhancementOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Delayed Enhancement</label>
                <select
                  value={assessment.delayedEnhancement}
                  onChange={(e) => setAssessment(prev => ({ ...prev, delayedEnhancement: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                >
                  {delayedOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Advanced MRI Features */}
        <div className="calculator-input-group">
          <h4 className="text-lg font-semibold text-white mb-3">İleri MRG Özellikleri</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">T2 Sinyal Intensitesi</label>
              <select
                value={assessment.t2Signal}
                onChange={(e) => setAssessment(prev => ({ ...prev, t2Signal: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {t2SignalOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Difüzyon (ADC)</label>
              <select
                value={assessment.diffusionADC}
                onChange={(e) => setAssessment(prev => ({ ...prev, diffusionADC: e.target.value }))}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
              >
                {adcOptions.map(option => (
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
                checked={assessment.skinEnhancement}
                onChange={(e) => setAssessment(prev => ({ ...prev, skinEnhancement: e.target.checked }))}
                className="w-4 h-4 text-purple-500"
              />
              <span className="text-gray-300">Cilt enhancement</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={assessment.nippleEnhancement}
                onChange={(e) => setAssessment(prev => ({ ...prev, nippleEnhancement: e.target.checked }))}
                className="w-4 h-4 text-purple-500"
              />
              <span className="text-gray-300">Nipple enhancement</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={assessment.lymphNodes}
                onChange={(e) => setAssessment(prev => ({ ...prev, lymphNodes: e.target.checked }))}
                className="w-4 h-4 text-purple-500"
              />
              <span className="text-gray-300">Şüpheli lenf nodları</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={calculateBIRADS}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                  </svg>
                  <span>MRG BI-RADS</span>
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
                      <span className="text-purple-400">•</span>
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

export default MRICalculator;