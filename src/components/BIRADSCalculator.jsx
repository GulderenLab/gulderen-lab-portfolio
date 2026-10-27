import React, { useState } from 'react';

const BIRADSCalculator = ({ embedded = false }) => {
  const [assessment, setAssessment] = useState({
    modality: 'mammography',
    findings: '',
    morphology: '',
    size: '',
    location: '',
    density: 'a'
  });

  const [clinicalInfo, setClinicalInfo] = useState({
    age: '',
    familyHistory: false,
    priorBiopsyHistory: false,
    currentSymptoms: '',
    hormonalStatus: ''
  });

  const [result, setResult] = useState(null);

  const modalityOptions = [
    { value: 'mammography', label: 'Mamografi', description: 'Digital mamografi değerlendirmesi' },
    { value: 'ultrasound', label: 'Ultrasonografi', description: 'Meme ultrasonografi değerlendirmesi' },
    { value: 'mri', label: 'MRG', description: 'Manyetik rezonans görüntüleme' },
    { value: 'tomosynthesis', label: 'Tomosyntez', description: '3D mamografi değerlendirmesi' }
  ];

  const densityCategories = [
    { value: 'a', label: 'A - Neredeyse tamamen yağlı', description: '<25% glandüler doku' },
    { value: 'b', label: 'B - Dağınık fibroglandüler yoğunluk', description: '25-50% glandüler doku' },
    { value: 'c', label: 'C - Heterojen yoğun', description: '50-75% glandüler doku' },
    { value: 'd', label: 'D - Aşırı yoğun', description: '>75% glandüler doku' }
  ];

  const biRadsCategories = {
    0: {
      category: 'BI-RADS 0',
      title: 'Değerlendirme Tamamlanamadı',
      malignancyRisk: 'N/A',
      recommendation: 'İlave görüntüleme gerekli',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30',
      followUp: 'Mamografi, US, MRG veya önceki görüntülerle karşılaştırma',
      description: 'Mevcut görüntüleme yetersiz veya karşılaştırmalı görüntü gerekli'
    },
    1: {
      category: 'BI-RADS 1',
      title: 'Negatif',
      malignancyRisk: '%0',
      recommendation: 'Rutin tarama',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      followUp: 'Yaş grubu için önerilen rutin tarama programı',
      description: 'Anormal bulgu yok, normal meme dokusu'
    },
    2: {
      category: 'BI-RADS 2',
      title: 'Benign Bulgu',
      malignancyRisk: '%0',
      recommendation: 'Rutin tarama',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      followUp: 'Yaş grubu için önerilen rutin tarama programı',
      description: 'Kesin benign bulgular: basit kist, lipom, kalsifiye fibroadenom'
    },
    3: {
      category: 'BI-RADS 3',
      title: 'Muhtemelen Benign',
      malignancyRisk: '<2%',
      recommendation: '6 aylık kısa dönem takip',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      followUp: '6 ay, 12 ay, 24 ay takip görüntüleme',
      description: 'Düşük şüphe düzeyi, takip ile kararlılık değerlendirmesi'
    },
    '4a': {
      category: 'BI-RADS 4A',
      title: 'Düşük Şüphe',
      malignancyRisk: '2-10%',
      recommendation: 'Çekirdek iğne biyopsisi',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      followUp: 'Histopatolojik değerlendirme sonrası karar',
      description: 'Düşük derecede şüpheli bulgular'
    },
    '4b': {
      category: 'BI-RADS 4B',
      title: 'Orta Şüphe',
      malignancyRisk: '10-50%',
      recommendation: 'Çekirdek iğne biyopsisi',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      followUp: 'Histopatolojik değerlendirme sonrası karar',
      description: 'Orta derecede şüpheli bulgular'
    },
    '4c': {
      category: 'BI-RADS 4C',
      title: 'Yüksek Şüphe',
      malignancyRisk: '50-95%',
      recommendation: 'Çekirdek iğne biyopsisi',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      followUp: 'Histopatolojik değerlendirme, muhtemel cerrahi konsültasyon',
      description: 'Yüksek derecede şüpheli bulgular'
    },
    5: {
      category: 'BI-RADS 5',
      title: 'Yüksek Malignite Şüphesi',
      malignancyRisk: '>95%',
      recommendation: 'Çekirdek iğne biyopsisi',
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      followUp: 'Histopatolojik doğrulama sonrası cerrahi konsültasyon',
      description: 'Malignite için tipik bulgular'
    },
    6: {
      category: 'BI-RADS 6',
      title: 'Bilinen Malignite',
      malignancyRisk: '%100',
      recommendation: 'Uygun tedavi',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      followUp: 'Onkoloji, cerrahi, radyasyon onkolojisi konsültasyonu',
      description: 'Biyopsi ile kanıtlanmış meme kanseri'
    }
  };

  const assessBIRADS = () => {
    // Bu fonksiyon gerçek bir BI-RADS değerlendirme algoritması değil
    // Gerçek uygulamada daha karmaşık kriterlere dayalı olacaktır
    
    let suggestedCategory = 1;
    let reasoning = [];

    // Basit değerlendirme mantığı (demo amaçlı)
    if (!assessment.findings || assessment.findings.toLowerCase().includes('normal')) {
      suggestedCategory = 1;
      reasoning.push('Normal bulgular');
    } else if (assessment.findings.toLowerCase().includes('kist') || 
               assessment.findings.toLowerCase().includes('lipom') ||
               assessment.findings.toLowerCase().includes('kalsifiye fibroadenom')) {
      suggestedCategory = 2;
      reasoning.push('Kesin benign bulgular');
    } else if (assessment.findings.toLowerCase().includes('solid kitle') &&
               assessment.findings.toLowerCase().includes('oval')) {
      suggestedCategory = 3;
      reasoning.push('Oval solid kitle - muhtemelen benign');
    } else if (assessment.findings.toLowerCase().includes('mikrokalsifikasyon')) {
      suggestedCategory = '4a';
      reasoning.push('Mikrokalsifikasyonlar - biyopsi gerekli');
    } else if (assessment.findings.toLowerCase().includes('irregüler') ||
               assessment.findings.toLowerCase().includes('spikülasyon')) {
      suggestedCategory = '4c';
      reasoning.push('İrregüler kenarlar/spikülasyon - yüksek şüphe');
    } else if (assessment.findings.toLowerCase().includes('architectural distortion')) {
      suggestedCategory = 5;
      reasoning.push('Architectural distortion - malignite şüphesi');
    }

    // Yaş faktörü
    if (clinicalInfo.age && parseInt(clinicalInfo.age) < 40 && suggestedCategory >= 3) {
      reasoning.push('Genç yaş - ek dikkat gerekli');
    }

    // Aile hikayesi
    if (clinicalInfo.familyHistory && suggestedCategory >= 3) {
      reasoning.push('Pozitif aile hikayesi - artmış risk');
    }

    const finalResult = biRadsCategories[suggestedCategory];
    
    setResult({
      ...finalResult,
      reasoning,
      clinicalFactors: {
        age: clinicalInfo.age,
        familyHistory: clinicalInfo.familyHistory,
        priorBiopsy: clinicalInfo.priorBiopsyHistory
      },
      imagingDetails: {
        modality: assessment.modality,
        density: assessment.density,
        findings: assessment.findings
      }
    });
  };

  const resetCalculator = () => {
    setAssessment({
      modality: 'mammography',
      findings: '',
      morphology: '',
      size: '',
      location: '',
      density: 'a'
    });
    setClinicalInfo({
      age: '',
      familyHistory: false,
      priorBiopsyHistory: false,
      currentSymptoms: '',
      hormonalStatus: ''
    });
    setResult(null);
  };

  const containerClass = embedded 
    ? "bg-slate-800/40 border border-slate-700/50 rounded-xl p-6" 
    : "calculator-container";

  return (
    <div className={containerClass}>
      <div className="calculator-header">
        <h3 className="calculator-title text-xl font-bold mb-2">
          {embedded ? 'BI-RADS Hesaplayıcı' : 'BI-RADS Değerlendirme Sistemi'}
        </h3>
        <p className="calculator-description text-gray-400 text-sm mb-6">
          Meme görüntüleme bulgularınızı değerlendirin ve uygun BI-RADS kategorisini belirleyin
        </p>
      </div>

      <div className="space-y-6">
        {/* Görüntüleme Modalitesi */}
        <div className="calculator-input-group">
          <label className="calculator-label block text-sm font-medium text-gray-300 mb-3">
            Görüntüleme Modalitesi
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modalityOptions.map((option) => (
              <label key={option.value} className="flex items-start p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg cursor-pointer transition-all duration-200">
                <input
                  type="radio"
                  name="modality"
                  value={option.value}
                  checked={assessment.modality === option.value}
                  onChange={(e) => setAssessment(prev => ({ ...prev, modality: e.target.value }))}
                  className="mt-1 mr-3 text-purple-500 focus:ring-purple-500 focus:ring-2"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium">{option.label}</span>
                  <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Meme Yoğunluğu (Sadece Mamografi için) */}
        {assessment.modality === 'mammography' && (
          <div className="calculator-input-group">
            <label className="calculator-label block text-sm font-medium text-gray-300 mb-3">
              Meme Yoğunluğu (ACR Kategorisi)
            </label>
            <div className="space-y-2">
              {densityCategories.map((option) => (
                <label key={option.value} className="flex items-start p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg cursor-pointer transition-all duration-200">
                  <input
                    type="radio"
                    name="density"
                    value={option.value}
                    checked={assessment.density === option.value}
                    onChange={(e) => setAssessment(prev => ({ ...prev, density: e.target.value }))}
                    className="mt-1 mr-3 text-purple-500 focus:ring-purple-500 focus:ring-2"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium">{option.label}</span>
                    <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Bulgular */}
        <div className="calculator-input-group">
          <label className="calculator-label block text-sm font-medium text-gray-300 mb-3">
            Görüntüleme Bulguları
          </label>
          <textarea
            placeholder="Önemli bulguları detaylı olarak açıklayın (örn: 'Sağ meme üst dış kadranda 1.2 cm oval solid kitle, düzgün kenarlar')"
            value={assessment.findings}
            onChange={(e) => setAssessment(prev => ({ ...prev, findings: e.target.value }))}
            rows={4}
            className="calculator-input w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
          />
        </div>

        {/* Klinik Bilgiler */}
        <div className="calculator-input-group">
          <label className="calculator-label block text-sm font-medium text-gray-300 mb-3">
            Klinik Bilgiler
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Yaş</label>
              <input
                type="number"
                placeholder="Yaş"
                value={clinicalInfo.age}
                onChange={(e) => setClinicalInfo(prev => ({ ...prev, age: e.target.value }))}
                className="calculator-input w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Mevcut Semptomlar</label>
              <input
                type="text"
                placeholder="Örn: ele gelen kitle, nipple akıntısı"
                value={clinicalInfo.currentSymptoms}
                onChange={(e) => setClinicalInfo(prev => ({ ...prev, currentSymptoms: e.target.value }))}
                className="calculator-input w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={clinicalInfo.familyHistory}
                onChange={(e) => setClinicalInfo(prev => ({ ...prev, familyHistory: e.target.checked }))}
                className="w-4 h-4 text-purple-500 focus:ring-purple-500 focus:ring-2 bg-slate-700 border-slate-600 rounded"
              />
              <span className="text-gray-300 text-sm">Meme/over kanseri aile hikayesi</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={clinicalInfo.priorBiopsyHistory}
                onChange={(e) => setClinicalInfo(prev => ({ ...prev, priorBiopsyHistory: e.target.checked }))}
                className="w-4 h-4 text-purple-500 focus:ring-purple-500 focus:ring-2 bg-slate-700 border-slate-600 rounded"
              />
              <span className="text-gray-300 text-sm">Önceki biyopsi hikayesi</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="calculator-button-container flex gap-3">
          <button
            onClick={assessBIRADS}
            disabled={!assessment.findings.trim()}
            className="calculator-button flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Değerlendir
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
          <div className={`calculator-result border rounded-xl p-6 space-y-4 ${result.bgColor} ${result.borderColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="calculator-result-title flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>BI-RADS Değerlendirmesi</span>
                </div>
                <div className={`text-3xl font-bold ${result.color} mb-2`}>
                  {result.category}
                </div>
                <div className="text-sm text-gray-400">
                  {result.title}
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${result.bgColor} border ${result.borderColor}`}>
                  {result.malignancyRisk} Risk
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Malignite Riski</h4>
                <div className={`text-xl font-bold ${result.color}`}>
                  {result.malignancyRisk}
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Önerilen Yaklaşım</h4>
                <div className="text-white font-medium text-sm">
                  {result.recommendation}
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Takip Protokolü</h4>
              <p className="text-white text-sm">
                {result.followUp}
              </p>
            </div>

            {result.reasoning.length > 0 && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Değerlendirme Kriterleri</h4>
                <ul className="text-white text-sm space-y-1">
                  {result.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h4 className="text-blue-400 font-medium text-sm mb-1">Önemli Uyarı</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Bu hesaplayıcı eğitim amaçlıdır ve kesin tanı aracı değildir. 
                    BI-RADS kategorisi deneyimli radyolog tarafından, tüm klinik ve görüntüleme bulgularının 
                    entegrasyonu ile belirlenir. Kesin tanı ve tedavi kararları için mutlaka uzman doktor ile konsülte olun.
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

export default BIRADSCalculator;