import React from 'react';

// --- CONFIGURATION V5 (Arrow & Text Position Fix) ---
const CONFIG = {
  Y_SCL: 100,
  Y_SDA: 250,
  SIGNAL_HEIGHT: 50,
  
  // --- Color Palette: Vibrant Blue & Yellow ---
  BG_COLOR: '#01041B', 
  SCL_COLOR: '#58A6FF', 
  SDA_COLOR: '#FFFF00', 
  LABEL_COLOR: '#FFFFFF', 
  ANNOTATION_COLOR: '#9E9E9E', 
  TIMING_COLOR: '#39FF14', 
  BORDER_COLOR: 'rgba(88, 166, 255, 0.3)',

  // --- Educational Background Tints ---
  BUS_IDLE_BG: 'rgba(1, 4, 27, 0.5)',
  DATA_VALID_BG: 'rgba(255, 255, 0, 0.1)',
  DATA_CHANGE_BG: 'rgba(88, 166, 255, 0.1)',
  
  // --- SVG Filters & Gradients ---
  GLOW_FILTER_ID: 'blue-yellow-glow-v5',
  BG_GRADIENT_ID: 'dark-bg-v5',
};

/**
 * Renders a timing annotation with arrows and labels, now with corrected arrow direction and text positioning.
 */
const TimingAnnotation = ({ x1, x2, y, tickY1, tickY2, label, subLabel, placement = 'above' }) => {
  // Position text above or below the timing line based on the 'placement' prop
  const mainLabelY = placement === 'above' ? y - 15 : y + 20;
  const subLabelY = mainLabelY + (placement === 'above' ? -16 : 16);

  return (
    <g>
      <path d={`M ${x1} ${tickY1} L ${x1} ${y + (placement === 'above' ? 5 : -5)}`} stroke={CONFIG.TIMING_COLOR} strokeWidth="1" strokeDasharray="2 2" opacity="0.7"/>
      <path d={`M ${x2} ${tickY2} L ${x2} ${y + (placement === 'above' ? 5 : -5)}`} stroke={CONFIG.TIMING_COLOR} strokeWidth="1" strokeDasharray="2 2" opacity="0.7"/>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={CONFIG.TIMING_COLOR} strokeWidth="1.5" markerStart="url(#arrow-start-timing)" markerEnd="url(#arrow-end-timing)" />
      <text x={(x1 + x2) / 2} y={mainLabelY} fill={CONFIG.LABEL_COLOR} fontSize="15" fontWeight="bold" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 6px #000)' }}>
        {label}
      </text>
      <text x={(x1 + x2) / 2} y={subLabelY} fill={CONFIG.ANNOTATION_COLOR} fontSize="12" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 6px #000)' }}>
        {subLabel}
      </text>
    </g>
  );
};

/**
 * Renders a colored background zone with a descriptive label.
 */
const EducationalZone = ({ x, width, color, label, y = 400 }) => (
  <>
    <rect x={x} y={20} width={width} height={410} fill={color} rx="8" />
    <text x={x + width / 2} y={y} fill={CONFIG.LABEL_COLOR} fontSize="14" fontWeight="500" textAnchor="middle" opacity="0.5" letterSpacing="1px">
      {label}
    </text>
  </>
);


export default function I2CTimingDiagramPerfectedV5() {
  const sclHighY = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
  const sclLowY = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
  const sdaHighY = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
  const sdaLowY = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;
  const slope = 12;

  const X = {
    start: 60, 
    startCond_SDA_Fall: 140,
    startCond_SCL_Fall: 210,
    dataBit_SCL_Rise: 350,
    dataBit_SCL_Fall: 470,
    ackBit_SCL_Rise: 590,
    ackBit_SCL_Fall: 710,
    stopCond_SCL_Rise: 830,
    stopCond_SDA_Rise: 900,
    busFree_Start: 960,
    end: 1100,
  };

  const sclPath = `
    M ${X.start},${sclHighY}
    L ${X.startCond_SCL_Fall - slope},${sclHighY} L ${X.startCond_SCL_Fall + slope},${sclLowY}
    L ${X.dataBit_SCL_Rise - slope},${sclLowY} L ${X.dataBit_SCL_Rise + slope},${sclHighY}
    L ${X.dataBit_SCL_Fall - slope},${sclHighY} L ${X.dataBit_SCL_Fall + slope},${sclLowY}
    L ${X.ackBit_SCL_Rise - slope},${sclLowY} L ${X.ackBit_SCL_Rise + slope},${sclHighY}
    L ${X.ackBit_SCL_Fall - slope},${sclHighY} L ${X.ackBit_SCL_Fall + slope},${sclLowY}
    L ${X.stopCond_SCL_Rise - slope},${sclLowY} L ${X.stopCond_SCL_Rise + slope},${sclHighY}
    L ${X.end},${sclHighY}
  `;

  const sdaPath = `
    M ${X.start},${sdaHighY}
    L ${X.startCond_SDA_Fall - slope},${sdaHighY} L ${X.startCond_SDA_Fall + slope},${sdaLowY}
    L ${X.stopCond_SDA_Rise - slope},${sdaLowY} L ${X.stopCond_SDA_Rise + slope},${sdaHighY}
    L ${X.end},${sdaHighY}
  `;

  return (
    <div style={{
      margin: '2rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: '100%', maxWidth: '1200px', backgroundColor: CONFIG.BG_COLOR,
      borderRadius: '16px', padding: '2rem 1rem', border: `1px solid ${CONFIG.BORDER_COLOR}`,
    }}>
      <div style={{ width: '100%' }}>
        <svg width="100%" viewBox={`0 0 ${X.end} 450`}>
          <defs>
            {/* Corrected Arrow Markers: Both now point outwards */}
            <marker id="arrow-end-timing" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIG.TIMING_COLOR} /></marker>
            <marker id="arrow-start-timing" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIG.TIMING_COLOR} /></marker>
            
            <radialGradient id={CONFIG.BG_GRADIENT_ID} cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#10122D" />
              <stop offset="100%" stopColor={CONFIG.BG_COLOR} />
            </radialGradient>
            <filter id={CONFIG.GLOW_FILTER_ID} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background & Educational Zones */}
          <rect x="0" y="0" width={X.end} height="450" fill={`url(#${CONFIG.BG_GRADIENT_ID})`} />
          <EducationalZone x="0" width={X.startCond_SDA_Fall} color={CONFIG.BUS_IDLE_BG} label="HAT BOŞTA" />
          <EducationalZone x={X.startCond_SDA_Fall} width={X.dataBit_SCL_Rise - X.startCond_SDA_Fall} color={CONFIG.DATA_CHANGE_BG} label="VERİ DEĞİŞEBİLİR" />
          <EducationalZone x={X.dataBit_SCL_Rise} width={X.dataBit_SCL_Fall - X.dataBit_SCL_Rise} color={CONFIG.DATA_VALID_BG} label="VERİ GEÇERLİ" />
          <EducationalZone x={X.dataBit_SCL_Fall} width={X.ackBit_SCL_Rise - X.dataBit_SCL_Fall} color={CONFIG.DATA_CHANGE_BG} label="VERİ DEĞİŞEBİLİR" />
          <EducationalZone x={X.ackBit_SCL_Rise} width={X.ackBit_SCL_Fall - X.ackBit_SCL_Rise} color={CONFIG.DATA_VALID_BG} label="VERİ GEÇERLİ" />
          <EducationalZone x={X.ackBit_SCL_Fall} width={X.stopCond_SDA_Rise - X.ackBit_SCL_Fall} color={CONFIG.DATA_CHANGE_BG} label="VERİ DEĞİŞEBİLİR" />
          <EducationalZone x={X.stopCond_SDA_Rise} width={X.end - X.stopCond_SDA_Rise} color={CONFIG.BUS_IDLE_BG} label="HAT BOŞTA" />

          {/* Signal Paths */}
          <path d={sclPath} stroke={CONFIG.SCL_COLOR} strokeWidth="4" fill="none" filter={`url(#${CONFIG.GLOW_FILTER_ID})`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={sdaPath} stroke={CONFIG.SDA_COLOR} strokeWidth="4" fill="none" filter={`url(#${CONFIG.GLOW_FILTER_ID})`} strokeLinecap="round" strokeLinejoin="round" />

          {/* Signal Labels */}
          <text x={X.start - 25} y={CONFIG.Y_SCL + 6} fill={CONFIG.SCL_COLOR} fontSize="20" fontWeight="700" textAnchor="end" style={{filter: `drop-shadow(0 0 5px ${CONFIG.SCL_COLOR})`}}>SCL</text>
          <text x={X.start - 25} y={CONFIG.Y_SDA + 6} fill={CONFIG.SDA_COLOR} fontSize="20" fontWeight="700" textAnchor="end" style={{filter: `drop-shadow(0 0 5px ${CONFIG.SDA_COLOR})`}}>SDA</text>
          
          {/* Ownership Labels */}
          <text x={(X.dataBit_SCL_Rise + X.dataBit_SCL_Fall)/2} y={sdaLowY + 30} fill={CONFIG.ANNOTATION_COLOR} fontSize="12" textAnchor="middle" >Master Sürer (Data='0')</text>
          <text x={(X.ackBit_SCL_Rise + X.ackBit_SCL_Fall)/2} y={sdaLowY + 30} fill={CONFIG.ANNOTATION_COLOR} fontSize="12" textAnchor="middle" >Slave Sürer (ACK='0')</text>

          {/* === TIMING PARAMETERS (Repositioned with correct arrows) === */}
          <TimingAnnotation x1={X.dataBit_SCL_Rise} x2={X.dataBit_SCL_Fall} y={sclHighY - 25} tickY1={sclHighY} tickY2={sclHighY} label="tHIGH" subLabel="SCL High Period" placement="above" />
          <TimingAnnotation x1={X.dataBit_SCL_Fall} x2={X.ackBit_SCL_Rise} y={sclLowY + 25} tickY1={sclLowY} tickY2={sclLowY} label="tLOW" subLabel="SCL Low Period" placement="below" />
          <TimingAnnotation x1={X.startCond_SDA_Fall} x2={X.startCond_SCL_Fall} y={CONFIG.Y_SDA + 65} tickY1={sdaHighY} tickY2={sclHighY} label="tHD;STA" subLabel="START Hold Time" placement="below" />
          <TimingAnnotation x1={X.startCond_SCL_Fall + 2*slope} x2={X.dataBit_SCL_Rise} y={CONFIG.Y_SDA - 75} tickY1={sdaLowY} tickY2={sclLowY} label="tSU;DAT" subLabel="DATA Setup Time" placement="above" />
          <TimingAnnotation x1={X.stopCond_SCL_Rise} x2={X.stopCond_SDA_Rise} y={CONFIG.Y_SCL + 75} tickY1={sclLowY} tickY2={sdaLowY} label="tSU;STO" subLabel="STOP Setup Time" placement="below" />
          <TimingAnnotation x1={X.stopCond_SDA_Rise} x2={X.busFree_Start} y={CONFIG.Y_SCL + 110} tickY1={sdaHighY} tickY2={sdaHighY} label="tBUF" subLabel="Bus Free Time" placement="below" />
          
          {/* Event Markers */}
          <text x={X.startCond_SDA_Fall - 10} y={sdaHighY-20} fill={CONFIG.ANNOTATION_COLOR} fontSize="13" textAnchor="middle">START</text>
          <path d={`M ${X.startCond_SDA_Fall-10} ${sdaHighY-15} L ${X.startCond_SDA_Fall} ${sdaHighY-5}`} stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1"/>
          
          <text x={X.stopCond_SDA_Rise + 10} y={sdaLowY+35} fill={CONFIG.ANNOTATION_COLOR} fontSize="13" textAnchor="middle">STOP</text>
          <path d={`M ${X.stopCond_SDA_Rise+10} ${sdaLowY+30} L ${X.stopCond_SDA_Rise} ${sdaLowY+5}`} stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1"/>
        </svg>
      </div>
      <div style={{
        width: 'calc(100% - 4rem)', borderTop: `1px solid ${CONFIG.BORDER_COLOR}`,
        marginTop: '1.5rem', paddingTop: '1.5rem', textAlign: 'center', color: CONFIG.ANNOTATION_COLOR
      }}>
        <p style={{ margin: '0.5rem auto', lineHeight: '1.7', fontSize: '14px', maxWidth: '85ch', textAlign: 'left' }}>
          <strong>t<sub>SU</sub> (Setup Time):</strong> Referans olaydan (genellikle SCL yükselişi) <em>önce</em>, veri sinyalinin (SDA) stabil kalması gereken minimum süredir. Verinin güvenle okunabilmesini sağlar.
          <br/>
          <strong>t<sub>HD</sub> (Hold Time):</strong> Referans olaydan (genellikle SCL düşüşü) <em>sonra</em>, veri sinyalinin stabil kalması gereken minimum süredir. Sinyal geçişlerinin çakışmasını engeller.
        </p>
        <h2 style={{
          color: CONFIG.LABEL_COLOR, margin: '2rem 0 0.5rem 0', fontWeight: 500, letterSpacing: '1px',
          textAlign: 'center', fontSize: '18px', borderTop: `1px solid ${CONFIG.BORDER_COLOR}`, paddingTop: '1rem'
        }}>
          Şekil 5.6: Gelişmiş I²C Kritik Zamanlama ve Sinyal Sahipliği Diyagramı
        </h2>
      </div>
    </div>
  );
}