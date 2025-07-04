import React from 'react';

// --- CONFIGURATION (Değişiklik yok) ---
const CONFIG = {
  Y_SCL: 90,
  Y_SDA: 170,
  SIGNAL_HEIGHT: 40,
  BIT_CELL_WIDTH: 120,
  START_OFFSET: 80,
  BG_COLOR: '#121212',
  LINE_BG_COLOR: 'rgba(255, 255, 255, 0.1)',
  SCL_COLOR: '#00a8ff',
  SDA_COLOR: '#fbc531',
  LABEL_COLOR: '#dcdcdc',
  ANNOTATION_COLOR: '#aaaaaa',
  VALID_DATA_BG_START: 'rgba(0, 168, 255, 0.15)',
  VALID_DATA_BG_END: 'rgba(0, 168, 255, 0)',
  SAMPLE_DOT_COLOR: '#ffffff',
  GLOW_FILTER_ID: 'glow-effect',
};

// --- YARDIMCI FONKSİYONLAR (Değişiklik yok) ---
const generateSclPath = (bitsCount, config) => {
    // ...
    const { Y_SCL, SIGNAL_HEIGHT, BIT_CELL_WIDTH, START_OFFSET } = config;
    const sclHighY = Y_SCL - SIGNAL_HEIGHT / 2;
    const sclLowY = Y_SCL + SIGNAL_HEIGHT / 2;
    const curveAmount = 4;
  
    let pathData = `M 0,${sclLowY} L ${START_OFFSET},${sclLowY}`;
  
    for (let i = 0; i < bitsCount; i++) {
      const x = START_OFFSET + i * BIT_CELL_WIDTH;
      pathData += `
        L ${x + BIT_CELL_WIDTH * 0.2 - curveAmount},${sclLowY}
        Q ${x + BIT_CELL_WIDTH * 0.2},${sclLowY} ${x + BIT_CELL_WIDTH * 0.2},${sclLowY - curveAmount}
        L ${x + BIT_CELL_WIDTH * 0.2},${sclHighY + curveAmount}
        Q ${x + BIT_CELL_WIDTH * 0.2},${sclHighY} ${x + BIT_CELL_WIDTH * 0.2 + curveAmount},${sclHighY}
        L ${x + BIT_CELL_WIDTH * 0.8 - curveAmount},${sclHighY}
        Q ${x + BIT_CELL_WIDTH * 0.8},${sclHighY} ${x + BIT_CELL_WIDTH * 0.8},${sclHighY + curveAmount}
        L ${x + BIT_CELL_WIDTH * 0.8},${sclLowY - curveAmount}
        Q ${x + BIT_CELL_WIDTH * 0.8},${sclLowY} ${x + BIT_CELL_WIDTH * 0.8 + curveAmount},${sclLowY}
        L ${x + BIT_CELL_WIDTH},${sclLowY}
      `;
    }
    return pathData;
};

const generateSdaPath = (bits, config) => {
    // ...
    const { Y_SDA, SIGNAL_HEIGHT, BIT_CELL_WIDTH, START_OFFSET } = config;
    const sdaHighY = Y_SDA - SIGNAL_HEIGHT / 2;
    const sdaLowY = Y_SDA + SIGNAL_HEIGHT / 2;
    const curveAmount = 4;
  
    const initialSdaY = sdaHighY;
    let pathData = `M 0,${initialSdaY} L ${START_OFFSET},${initialSdaY}`;
    
    let prevSdaY = initialSdaY;
  
    for (let i = 0; i < bits.length; i++) {
      const x = START_OFFSET + i * BIT_CELL_WIDTH;
      const currentBit = bits[i];
      const sdaY = currentBit === '1' ? sdaHighY : sdaLowY;
  
      if (sdaY === prevSdaY) {
        pathData += ` L ${x + BIT_CELL_WIDTH},${sdaY}`;
      } else {
        pathData += `
          L ${x + BIT_CELL_WIDTH * 0.1 - curveAmount},${prevSdaY}
          Q ${x + BIT_CELL_WIDTH * 0.1},${prevSdaY} ${x + BIT_CELL_WIDTH * 0.1},${prevSdaY + (sdaY - prevSdaY) / 2}
          Q ${x + BIT_CELL_WIDTH * 0.1},${sdaY} ${x + BIT_CELL_WIDTH * 0.1 + curveAmount},${sdaY}
          L ${x + BIT_CELL_WIDTH},${sdaY}
        `;
      }
      prevSdaY = sdaY;
    }
    return pathData;
};

// --- ANNOTATION COMPONENT (Değişiklik yok) ---
const Annotation = ({ x, y, number, label, sublabel, arrowTarget, direction = 'down' }) => {
    // ...
    const isDown = direction === 'down';
    const startY = isDown ? y - 45 : y + 45;
    const labelY = isDown ? startY + 20 : startY - 20;
    const sublabelY = isDown ? startY + 35 : startY - 35;
  
    return (
      <g style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))' }}>
        <line x1={x} y1={startY} x2={arrowTarget.x} y2={arrowTarget.y} stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx={x} cy={startY} r="10" fill={CONFIG.BG_COLOR} stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1.5" />
        <text x={x} y={startY} fill={CONFIG.LABEL_COLOR} fontSize="12" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">{number}</text>
        <text x={x} y={labelY} fill={CONFIG.LABEL_COLOR} fontSize="14" fontWeight="bold" textAnchor="middle">{label}</text>
        <text x={x} y={sublabelY} fill={CONFIG.ANNOTATION_COLOR} fontSize="12" textAnchor="middle">{sublabel}</text>
      </g>
    );
};

// --- MAIN COMPONENT ---
export default function I2CBitLevelDiagramPerfected() {
  const exampleBits = ['1', '0', '1'];
  const totalWidth = (exampleBits.length * CONFIG.BIT_CELL_WIDTH) + CONFIG.START_OFFSET + 50;
  
  const sclPathData = generateSclPath(exampleBits.length, CONFIG);
  const sdaPathData = generateSdaPath(exampleBits, CONFIG);

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
            {/* Defs içeriği aynı */}
            <filter id={CONFIG.GLOW_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="valid-data-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CONFIG.VALID_DATA_BG_START} />
              <stop offset="100%" stopColor={CONFIG.VALID_DATA_BG_END} />
            </linearGradient>
          </defs>

          {/* Arkaplan referans çizgileri ve Sinyal Yolları (Değişiklik yok) */}
          <line x1="0" y1={CONFIG.Y_SCL} x2={totalWidth} y2={CONFIG.Y_SCL} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" />
          <line x1="0" y1={CONFIG.Y_SDA} x2={totalWidth} y2={CONFIG.Y_SDA} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" />
          <path d={sclPathData} stroke={CONFIG.SCL_COLOR} strokeWidth="3" fill="none" filter={`url(#${CONFIG.GLOW_FILTER_ID})`} />
          <path d={sdaPathData} stroke={CONFIG.SDA_COLOR} strokeWidth="3" fill="none" filter={`url(#${CONFIG.GLOW_FILTER_ID})`} />
          
          {/* Bit bazlı yardımcı görseller (Değişiklik yok) */}
          {exampleBits.map((bit, i) => {
            const x = CONFIG.START_OFFSET + (i * CONFIG.BIT_CELL_WIDTH);
            const sdaY = bit === '1' ? CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2 : CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;
            return (
              <g key={i}>
                <rect x={x + CONFIG.BIT_CELL_WIDTH * 0.2} y={40} width={CONFIG.BIT_CELL_WIDTH * 0.6} height={200} fill="url(#valid-data-gradient)" rx="6" />
                <circle cx={x + CONFIG.BIT_CELL_WIDTH * 0.5} cy={sdaY} r="4" fill={CONFIG.SAMPLE_DOT_COLOR} />
                <circle cx={x + CONFIG.BIT_CELL_WIDTH * 0.5} cy={sdaY} r="8" fill={CONFIG.SAMPLE_DOT_COLOR} fillOpacity="0.3" />
                <text x={x + CONFIG.BIT_CELL_WIDTH * 0.5} y={sdaY - 15} fill={CONFIG.LABEL_COLOR} fontSize="14" fontWeight="bold" textAnchor="middle">{bit}</text>
              </g>
            );
          })}
          
          {/* --- YENİDEN KONUMLANDIRILMIŞ AÇIKLAMALAR --- */}
          <Annotation
            x={CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 0.1} y={315}
            number="1" label="SCL Alçak" sublabel="Veri değişimi başlar"
            arrowTarget={{x: CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 0.1, y: CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT/2}}
          />
          <Annotation
            x={CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.1} y={320}
            number="2" label="SDA Değişir" sublabel="Yeni bit hatta yerleşir"
            arrowTarget={{x: CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.1, y: CONFIG.Y_SDA}}
          />
          <Annotation
            x={CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.5} y={25} direction="up"
            number="3" label="SCL Yüksek" sublabel="Veri artık kararlı"
            arrowTarget={{x: CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.5, y: CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT/2}}
          />
          <Annotation
            x={CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 2.5} y={315}
            number="4" label="Veri Örneklenir" sublabel="Alıcı biti okur"
            arrowTarget={{x: CONFIG.START_OFFSET + CONFIG.BIT_CELL_WIDTH * 1.5, y: CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2}}
          />

          {/* Sinyal etiketleri (Değişiklik yok) */}
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

      <div style={{
        width: '100%', borderTop: `1px solid ${CONFIG.LINE_BG_COLOR}`, marginTop: '1.5rem',
        paddingTop: '1.5rem', textAlign: 'center', color: CONFIG.ANNOTATION_COLOR
      }}>
        <p style={{ margin: '0.5rem 0', lineHeight: '1.6', fontSize: '14px' }}>
          Veri (SDA), yalnızca Saat (SCL) <strong>düşük</strong> seviyedeyken değişebilir. <br/>
          Alıcı cihaz, veriyi SCL <strong>yüksek</strong> seviyedeyken, sinyal kararlı hale geldiğinde okur.
        </p>
      </div>
      <h2 style={{ color: CONFIG.LABEL_COLOR, margin: '2.5rem 0 0.5rem 0', fontWeight: '500', letterSpacing: '0.5px', textAlign: 'center', fontSize: '18px' }}>
        Şekil 5.4: I²C Bit Düzeyinde Veri Aktarımı
      </h2>
    </div>
  );
}