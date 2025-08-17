import React, { useState, useEffect } from 'react';
import { Calculator, Zap, Settings } from 'lucide-react';

const VoltageDividerCalculator = () => {
  const [vout, setVout] = useState('');
  const [knownResistor, setKnownResistor] = useState('R1');
  const [knownValue, setKnownValue] = useState('');
  const [knownUnit, setKnownUnit] = useState('kohm');
  const [vPgfbMin, setVPgfbMin] = useState('');
  const [vPgfbMax, setVPgfbMax] = useState('');
  const [results, setResults] = useState(null);

  // Standart direnç değerleri (E24 serisi)
  const standardResistors = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
    3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
  ];

  // Birim çevrim fonksiyonu
  const convertToOhms = (value, unit) => {
    const multipliers = {
      'ohm': 1,
      'kohm': 1000,
      'Mohm': 1000000
    };
    return value * multipliers[unit];
  };

  const convertFromOhms = (value, unit) => {
    const multipliers = {
      'ohm': 1,
      'kohm': 1000,
      'Mohm': 1000000
    };
    return value / multipliers[unit];
  };

  // En yakın standart direnç bulma
  const findNearestStandardResistor = (targetValue, unit) => {
    const targetInOhms = convertToOhms(targetValue, unit);
    let bestMatch = null;
    let minDifference = Infinity;

    // Farklı on'luk katları için kontrol et
    for (let decade = 0.1; decade <= 10000000; decade *= 10) {
      standardResistors.forEach(base => {
        const candidate = base * decade;
        const difference = Math.abs(candidate - targetInOhms);
        if (difference < minDifference) {
          minDifference = difference;
          bestMatch = candidate;
        }
      });
    }

    return {
      value: convertFromOhms(bestMatch, unit),
      ohms: bestMatch,
      difference: minDifference,
      percentError: ((bestMatch - targetInOhms) / targetInOhms * 100)
    };
  };

  // Hesaplama fonksiyonu
  const calculate = () => {
    const voutVal = parseFloat(vout);
    const knownVal = parseFloat(knownValue);
    const vPgfbMinVal = parseFloat(vPgfbMin);
    const vPgfbMaxVal = parseFloat(vPgfbMax);

    if (!voutVal || !knownVal || !vPgfbMinVal || !vPgfbMaxVal) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const knownInOhms = convertToOhms(knownVal, knownUnit);
    
    // Min ve max durumlar için hesaplama
    let r1Min, r2Min, r1Max, r2Max;
    
    if (knownResistor === 'R1') {
      // R1 biliniyor, R2 hesaplanacak
      // V_PGFB = Vout * R2 / (R1 + R2)
      // R2 = V_PGFB * R1 / (Vout - V_PGFB)
      r1Min = r1Max = knownInOhms;
      r2Min = (vPgfbMinVal * knownInOhms) / (voutVal - vPgfbMinVal);
      r2Max = (vPgfbMaxVal * knownInOhms) / (voutVal - vPgfbMaxVal);
    } else {
      // R2 biliniyor, R1 hesaplanacak
      // R1 = R2 * (Vout - V_PGFB) / V_PGFB
      r2Min = r2Max = knownInOhms;
      r1Min = knownInOhms * (voutVal - vPgfbMinVal) / vPgfbMinVal;
      r1Max = knownInOhms * (voutVal - vPgfbMaxVal) / vPgfbMaxVal;
    }

    // Standart direnç önerileri
    const r1MinStd = findNearestStandardResistor(convertFromOhms(r1Min, knownUnit), knownUnit);
    const r1MaxStd = findNearestStandardResistor(convertFromOhms(r1Max, knownUnit), knownUnit);
    const r2MinStd = findNearestStandardResistor(convertFromOhms(r2Min, knownUnit), knownUnit);
    const r2MaxStd = findNearestStandardResistor(convertFromOhms(r2Max, knownUnit), knownUnit);

    // Standart dirençlerle gerçek voltaj hesaplama
    const actualVPgfbMin = voutVal * r2MinStd.ohms / (r1MinStd.ohms + r2MinStd.ohms);
    const actualVPgfbMax = voutVal * r2MaxStd.ohms / (r1MaxStd.ohms + r2MaxStd.ohms);

    setResults({
      calculated: {
        r1Min: convertFromOhms(r1Min, knownUnit),
        r1Max: convertFromOhms(r1Max, knownUnit),
        r2Min: convertFromOhms(r2Min, knownUnit),
        r2Max: convertFromOhms(r2Max, knownUnit),
      },
      standard: {
        r1Min: r1MinStd,
        r1Max: r1MaxStd,
        r2Min: r2MinStd,
        r2Max: r2MaxStd,
      },
      actualVoltages: {
        min: actualVPgfbMin,
        max: actualVPgfbMax,
      },
      unit: knownUnit
    });
  };

  const formatValue = (value, unit) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} MΩ`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} kΩ`;
    } else {
      return `${value.toFixed(2)} Ω`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gerilim Bölücü Hesaplayıcısı
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Profesyonel elektronik tasarım aracı</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Giriş Parametreleri</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sol taraf */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çıkış Gerilimi (Vout) [V]
                </label>
                <input
                  type="number"
                  value={vout}
                  onChange={(e) => setVout(e.target.value)}
                  placeholder="örn: 12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bilinen Direnç
                </label>
                <div className="flex gap-2">
                  <select
                    value={knownResistor}
                    onChange={(e) => setKnownResistor(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="R1">R1</option>
                    <option value="R2">R2</option>
                  </select>
                  <input
                    type="number"
                    value={knownValue}
                    onChange={(e) => setKnownValue(e.target.value)}
                    placeholder="Değer"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={knownUnit}
                    onChange={(e) => setKnownUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ohm">Ω</option>
                    <option value="kohm">kΩ</option>
                    <option value="Mohm">MΩ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sağ taraf */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  V<sub>PGFB</sub> Minimum [V]
                </label>
                <input
                  type="number"
                  value={vPgfbMin}
                  onChange={(e) => setVPgfbMin(e.target.value)}
                  placeholder="örn: 0.8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  V<sub>PGFB</sub> Maksimum [V]
                </label>
                <input
                  type="number"
                  value={vPgfbMax}
                  onChange={(e) => setVPgfbMax(e.target.value)}
                  placeholder="örn: 1.2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg"
          >
            Hesapla
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Hesaplama Sonuçları</h2>
            </div>

            {/* Teorik Sonuçlar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Teorik Değerler</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Minimum Durum (V<sub>PGFB</sub> = {vPgfbMin}V)</h4>
                  <p className="text-sm text-blue-700">
                    R1 = {results.calculated.r1Min.toFixed(3)} {results.unit}
                  </p>
                  <p className="text-sm text-blue-700">
                    R2 = {results.calculated.r2Min.toFixed(3)} {results.unit}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Maksimum Durum (V<sub>PGFB</sub> = {vPgfbMax}V)</h4>
                  <p className="text-sm text-purple-700">
                    R1 = {results.calculated.r1Max.toFixed(3)} {results.unit}
                  </p>
                  <p className="text-sm text-purple-700">
                    R2 = {results.calculated.r2Max.toFixed(3)} {results.unit}
                  </p>
                </div>
              </div>
            </div>

            {/* Standart Direnç Önerileri */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Standart Direnç Önerileri (E24 Serisi)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800 mb-3">Minimum Konfigürasyon</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">R1:</span> {formatValue(results.standard.r1Min.ohms)} 
                      <span className="text-green-600 ml-2">
                        ({results.standard.r1Min.percentError > 0 ? '+' : ''}{results.standard.r1Min.percentError.toFixed(1)}%)
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">R2:</span> {formatValue(results.standard.r2Min.ohms)}
                      <span className="text-green-600 ml-2">
                        ({results.standard.r2Min.percentError > 0 ? '+' : ''}{results.standard.r2Min.percentError.toFixed(1)}%)
                      </span>
                    </p>
                    <p className="text-xs text-green-700 font-medium mt-2">
                      Gerçek V<sub>PGFB</sub>: {results.actualVoltages.min.toFixed(3)}V
                    </p>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-medium text-orange-800 mb-3">Maksimum Konfigürasyon</h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">R1:</span> {formatValue(results.standard.r1Max.ohms)}
                      <span className="text-orange-600 ml-2">
                        ({results.standard.r1Max.percentError > 0 ? '+' : ''}{results.standard.r1Max.percentError.toFixed(1)}%)
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">R2:</span> {formatValue(results.standard.r2Max.ohms)}
                      <span className="text-orange-600 ml-2">
                        ({results.standard.r2Max.percentError > 0 ? '+' : ''}{results.standard.r2Max.percentError.toFixed(1)}%)
                      </span>
                    </p>
                    <p className="text-xs text-orange-700 font-medium mt-2">
                      Gerçek V<sub>PGFB</sub>: {results.actualVoltages.max.toFixed(3)}V
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Devre Şeması */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Devre Şeması</h3>
              <div className="text-center">
                <div className="inline-block bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-gray-300">
                  <div className="text-sm font-mono space-y-2">
                    <div>Vout ({vout}V) ──┬──── (+)</div>
                    <div className="ml-16">│</div>
                    <div className="ml-16">R1</div>
                    <div className="ml-16">│</div>
                    <div className="ml-12">├──── V<sub>PGFB</sub></div>
                    <div className="ml-16">│</div>
                    <div className="ml-16">R2</div>
                    <div className="ml-16">│</div>
                    <div className="ml-12">└──── GND</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoltageDividerCalculator;