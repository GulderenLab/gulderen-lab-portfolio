import React from 'react';

// --- CONFIGURATION (Aynı ayarlar kullanılabilir) ---
const CONFIG = {
  Y_SCL: 90,
  Y_SDA: 170,
  SIGNAL_HEIGHT: 40,
  BIT_CELL_WIDTH: 100, // Biraz daraltarak daha fazla darbe sığdıralım
  START_OFFSET: 80,
  BG_COLOR: '#121212',
  LINE_BG_COLOR: 'rgba(255, 255, 255, 0.1)',
  SCL_COLOR: '#00a8ff',
  SDA_COLOR: '#fbc531',
  LABEL_COLOR: '#dcdcdc',
  ANNOTATION_COLOR: '#aaaaaa',
  STRETCH_BG_COLOR: 'rgba(255, 0, 80, 0.15)',
  SAMPLE_DOT_COLOR: '#ffffff',
  GLOW_FILTER_ID: 'glow-effect-stretch', // Farklı bir ID
};

// --- Annotation Component (Değişiklik yok) ---
const Annotation = ({ x, y, number, label, sublabel, arrowTarget, direction = 'down' }) => {
    const isDown = direction === 'down';
    const startY = isDown ? y - 45 : y + 45;
    const labelY = isDown ? y - 60 : y + 65;
    const sublabelY = isDown ? y - 45 : y + 80;
    const numberY = isDown ? startY : startY;

    return (
      <g style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }}>
        <line x1={x} y1={startY} x2={arrowTarget.x} y2={arrowTarget.y} stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1.5" strokeDasharray="3 3" />
        {number && <circle cx={x} cy={numberY} r="10" fill={CONFIG.BG_COLOR} stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1.5" />}
        {number && <text x={x} y={numberY} fill={CONFIG.LABEL_COLOR} fontSize="12" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">{number}</text>}
        <text x={x} y={labelY} fill={CONFIG.LABEL_COLOR} fontSize="14" fontWeight="bold" textAnchor="middle">{label}</text>
        <text x={x} y={sublabelY} fill={CONFIG.ANNOTATION_COLOR} fontSize="12" textAnchor="middle">{sublabel}</text>
      </g>
    );
};


export default function I2CClockStretchingDiagram() {
  // Olay akışını tanımlayalım
  const sequence = [
    { type: 'normal_pulse', sda: '1' },
    { type: 'normal_pulse', sda: '0' },
    { type: 'stretched_pulse', sda: '1', stretchFactor: 1.8 }, // Bu darbe 1.8 kat daha uzun sürecek
    { type: 'normal_pulse', sda: '1' },
  ];

  // --- Path ve Toplam Genişlik Hesaplaması ---
  let sclPathData = `M 0,${CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2} L ${CONFIG.START_OFFSET},${CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2}`;
  let sdaPathData = `M 0,${CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2} L ${CONFIG.START_OFFSET},${CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2}`;
  
  const visualElements = []; // Örnekleme noktaları, bit değerleri vb. için
  let currentX = CONFIG.START_OFFSET;
  let prevSdaY = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;

  const sclHighY = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
  const sclLowY = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
  const sdaHighY = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
  const sdaLowY = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;
  const curveAmount = 4;

  sequence.forEach((item, i) => {
    const width = CONFIG.BIT_CELL_WIDTH * (item.stretchFactor || 1);
    const sdaY = item.sda === '1' ? sdaHighY : sdaLowY;
    
    // --- SCL Yolu ---
    if (item.type === 'normal_pulse') {
        sclPathData += ` L ${currentX + width * 0.2 - curveAmount},${sclLowY} Q ${currentX + width * 0.2},${sclLowY} ${currentX + width * 0.2},${sclLowY - curveAmount} L ${currentX + width * 0.2},${sclHighY + curveAmount} Q ${currentX + width * 0.2},${sclHighY} ${currentX + width * 0.2 + curveAmount},${sclHighY} L ${currentX + width * 0.8 - curveAmount},${sclHighY} Q ${currentX + width * 0.8},${sclHighY} ${currentX + width * 0.8},${sclHighY + curveAmount} L ${currentX + width * 0.8},${sclLowY - curveAmount} Q ${currentX + width * 0.8},${sclLowY} ${currentX + width * 0.8 + curveAmount},${sclLowY} L ${currentX + width},${sclLowY}`;
    } else if (item.type === 'stretched_pulse') {
        const stretchLowWidth = width * 0.6; // Uzatılmış alçak seviye periyodunun genişliği
        sclPathData += ` L ${currentX + stretchLowWidth},${sclLowY} L ${currentX + stretchLowWidth + width * 0.2 - curveAmount},${sclLowY} Q ${currentX + stretchLowWidth + width * 0.2},${sclLowY} ${currentX + stretchLowWidth + width * 0.2},${sclLowY - curveAmount} L ${currentX + stretchLowWidth + width * 0.2},${sclHighY + curveAmount} Q ${currentX + stretchLowWidth + width * 0.2},${sclHighY} ${currentX + stretchLowWidth + width * 0.2 + curveAmount},${sclHighY} L ${currentX + width - curveAmount},${sclHighY} Q ${currentX + width},${sclHighY} ${currentX + width},${sclHighY + curveAmount} L ${currentX + width},${sclLowY}`; // Darbenin sonunu tamamla
        // Bu özel eleman için arkaplan ekle
        visualElements.push({ type: 'stretch_bg', x: currentX, width: stretchLowWidth });
    }

    // --- SDA Yolu ---
    if (sdaY !== prevSdaY) {
        sdaPathData += ` L ${currentX + width * 0.1 - curveAmount},${prevSdaY} Q ${currentX + width * 0.1},${prevSdaY} ${currentX + width * 0.1},${prevSdaY + (sdaY - prevSdaY) / 2} Q ${currentX + width * 0.1},${sdaY} ${currentX + width * 0.1 + curveAmount},${sdaY} L ${currentX + width},${sdaY}`;
    } else {
        sdaPathData += ` L ${currentX + width},${sdaY}`;
    }

    // Örnekleme noktası ve bit değeri için veri ekle
    const sampleX = item.type === 'normal_pulse' 
        ? currentX + width * 0.5 
        : currentX + width * 0.8; // stretched pulse için örnekleme daha sonda
    visualElements.push({ type: 'bit_info', x: sampleX, y: sdaY, bit: item.sda });
    
    prevSdaY = sdaY;
    currentX += width;
  });

  const totalWidth = currentX + 50;

  return (
    <div style={{
      margin: '2rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: '100%', maxWidth: '1000px', backgroundColor: CONFIG.BG_COLOR,
      borderRadius: '16px', padding: '2rem', border: `1px solid ${CONFIG.LINE_BG_COLOR}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ width: '100%' }}>
        <svg width="100%" viewBox={`0 0 ${totalWidth} 350`}>
          <defs>
            <filter id={CONFIG.GLOW_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Arkaplan referans çizgileri */}
          <line x1="0" y1={CONFIG.Y_SCL} x2={totalWidth} y2={CONFIG.Y_SCL} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" />
          <line x1="0" y1={CONFIG.Y_SDA} x2={totalWidth} y2={CONFIG.Y_SDA} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" />
          
          {/* Sinyal Yolları */}
          <path d={sclPathData} stroke={CONFIG.SCL_COLOR} strokeWidth="3" fill="none" filter={`url(#${CONFIG.GLOW_FILTER_ID})`} />
          <path d={sdaPathData} stroke={CONFIG.SDA_COLOR} strokeWidth="3" fill="none" filter={`url(#${CONFIG.GLOW_FILTER_ID})`} />
          
          {/* Yardımcı Görseller (Örnekleme noktaları, arkaplanlar) */}
          {visualElements.map((el, i) => {
            if (el.type === 'bit_info') {
              return (
                <g key={`vis-${i}`}>
                  <circle cx={el.x} cy={el.y} r="4" fill={CONFIG.SAMPLE_DOT_COLOR} />
                  <circle cx={el.x} cy={el.y} r="8" fill={CONFIG.SAMPLE_DOT_COLOR} fillOpacity="0.3" />
                  <text x={el.x} y={el.y - 15} fill={CONFIG.LABEL_COLOR} fontSize="14" fontWeight="bold" textAnchor="middle">{el.bit}</text>
                </g>
              );
            }
            if (el.type === 'stretch_bg') {
                return (
                    <rect key={`vis-${i}`} x={el.x} y={CONFIG.Y_SCL + 5} width={el.width} height={CONFIG.SIGNAL_HEIGHT - 10} fill={CONFIG.STRETCH_BG_COLOR} rx="4" />
                );
            }
            return null;
          })}

          {/* --- AÇIKLAMALAR --- */}
          <Annotation
            x={CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 2.8}
            y={290}
            label="Slave SCL'i Düşük Tutuyor"
            sublabel="(Clock Stretching)"
            arrowTarget={{ x: CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 2.8, y: CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2 }}
          />
           <Annotation
            x={CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.5}
            y={35}
            direction="up"
            label="Normal SCL Darbesi"
            sublabel="Master kontrolünde"
            arrowTarget={{ x: CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.5, y: CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2 }}
          />

          {/* Sinyal etiketleri */}
          <g>
            <rect x="8" y={CONFIG.Y_SCL - 14} width="35" height="28" fill={CONFIG.BG_COLOR} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" rx="4" />
            <text x="25" y={CONFIG.Y_SCL + 5} fill={CONFIG.LABEL_COLOR} fontSize="16" fontWeight="bold" textAnchor="middle">SCL</text>
          </g>
          <g>
            <rect x="8" y={CONFIG.Y_SDA - 14} width="35" height="28" fill={CONFIG.BG_COLOR} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" rx="4" />
            <text x="25" y={CONFIG.Y_SDA + 5} fill={CONFIG.LABEL_COLOR} fontSize="16" fontWeight="bold" textAnchor="middle">SDA</text>
          </g>
        </svg>
      </div>

      {/* --- DEĞİŞİKLİK BURADA YAPILDI --- */}
      {/* Başlık (h2) ve açıklama (p) yer değiştirdi ve margin'ler ayarlandı. */}
      <div style={{
        width: '100%', borderTop: `1px solid ${CONFIG.LINE_BG_COLOR}`, marginTop: '1.5rem',
        paddingTop: '1.5rem', textAlign: 'center', color: CONFIG.ANNOTATION_COLOR
      }}>

        <p style={{ 
          margin: '-0.5rem 0 0 0', // Negatif üst margin ile yukarı kaydırma
          lineHeight: '1.6', 
          fontSize: '14px' 
        }}>
          <strong>Clock Stretching:</strong> Slave cihaz, veriyi hazırlamak veya bir işlemi tamamlamak için ek süreye ihtiyaç duyduğunda SCL hattını kasıtlı olarak <strong>düşük</strong> seviyede tutar.
          <br />Master, SCL hattının serbest bırakılmasını (yükselmesini) bekleyerek iletişimi güvenli bir şekilde duraklatır.
        </p>

        <h2 style={{ 
          color: CONFIG.LABEL_COLOR, 
          margin: '1rem 0 1rem 0', // Üst boşluk eklendi, alt boşluk korundu
          fontWeight: '500', 
          letterSpacing: '0.5px', 
          textAlign: 'center', 
          fontSize: '16px' 
        }}>
          Şekil 5.5: Clock Stretching Mekanizması
        </h2>

      </div>
      
    </div>
  );
}