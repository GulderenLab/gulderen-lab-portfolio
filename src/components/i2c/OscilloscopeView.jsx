import React from 'react';

// --- CONFIGURATION (Enhanced Oscilloscope Aesthetic) ---
const CONFIG = {
  BG_COLOR: '#01041B', // Consistent dark blue background
  GRID_MAJOR_COLOR: 'rgba(88, 166, 255, 0.15)', // Subtle blue major grid
  GRID_MINOR_COLOR: 'rgba(88, 166, 255, 0.05)',  // Subtle blue minor grid
  SIGNAL_COLOR: '#58A6FF', // Vibrant blue for the signal
  SIGNAL_GLOW_ID: 'enhanced-signal-glow-filter',
  LABEL_COLOR: '#C9D1D9', // Soft off-white for labels
  ANNOTATION_COLOR: '#8B949E', // Muted gray for annotations
  THRESHOLD_COLOR: '#FF8C00', // Vibrant orange for thresholds
  SEPARATOR_COLOR: 'rgba(88, 166, 255, 0.3)', // Consistent blue separator
};

// --- HELPER COMPONENTS ---

const Grid = ({ width, height }) => {
  const lines = [];
  // Major grid (every 50px)
  for (let x = 0; x <= width; x += 50) lines.push(<path key={`v-maj-${x}`} d={`M ${x} 0 V ${height}`} stroke={CONFIG.GRID_MAJOR_COLOR} strokeWidth="1" />);
  for (let y = 0; y <= height; y += 50) lines.push(<path key={`h-maj-${y}`} d={`M 0 ${y} H ${width}`} stroke={CONFIG.GRID_MAJOR_COLOR} strokeWidth="1" />);
  // Minor grid (every 10px, for finer detail)
  for (let x = 10; x <= width; x += 10) lines.push(<path key={`v-min-${x}`} d={`M ${x} 0 V ${height}`} stroke={CONFIG.GRID_MINOR_COLOR} strokeWidth="0.5" />);
  for (let y = 10; y <= height; y += 10) lines.push(<path key={`h-min-${y}`} d={`M 0 ${y} H ${width}`} stroke={CONFIG.GRID_MINOR_COLOR} strokeWidth="0.5" />);
  return <g>{lines}</g>;
};

const ThresholdLine = ({ y, labelParts }) => (
  <g>
    <path d={`M 0 ${y} H 1000`} stroke={CONFIG.THRESHOLD_COLOR} strokeWidth="2" strokeDasharray="5 5" />
    <text x="10" y={y - 8} fill={CONFIG.THRESHOLD_COLOR} fontSize="13" fontWeight="bold" dominantBaseline="middle">
      {labelParts.map((part, index) => (
        <tspan
          key={index}
          fontSize={part.type === 'subscript' ? '9px' : '13px'} // Smaller font for subscript
          dy={part.type === 'subscript' ? '3px' : (index > 0 && labelParts[index-1].type === 'subscript' ? '-3px' : '0')} // Adjust vertical position in pixels
        >
          {part.text}
        </tspan>
      ))}
    </text>
  </g>
);

const Annotation = ({ x, y, children }) => (
    <g transform={`translate(${x}, ${y})`}>
        <path d="M 0 0 L -20 -20 H -120" stroke={CONFIG.ANNOTATION_COLOR} strokeWidth="1.5" fill="none" />
        <text x="-125" y="-25" fill={CONFIG.ANNOTATION_COLOR} fontSize="14" textAnchor="end">
            {children}
        </text>
    </g>
);

// --- MAIN DIAGRAM COMPONENT ---

export default function OscilloscopeView() {
    const width = 800;
    const height = 400;

    const signalYBase = height / 2 + 50;
    const signalHeight = 200;
    const lowY = signalYBase;
    const highY = signalYBase - signalHeight;

    // Logic level thresholds (as a percentage of signal height)
    const vihY = signalYBase - signalHeight * 0.7; // V_IH at 70%
    const vilY = signalYBase - signalHeight * 0.3; // V_IL at 30%

    // Define the signal path with a slow rise time
    const startX = 100;
    const fallX = startX + 100;
    const riseStartX = fallX + 200;
    const riseEndX = riseStartX + 250; // It takes a long time to rise

    const signalPath = `
        M 0 ${lowY}
        L ${startX} ${lowY}
        V ${highY} 
        H ${fallX}
        V ${lowY} 
        H ${riseStartX}
        C ${riseStartX + 80} ${lowY}, ${riseStartX + 120} ${highY * 1.1}, ${riseEndX} ${highY}
        H ${width}
    `;

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', backgroundColor: '#01041B', borderRadius: '16px', border: `1px solid ${CONFIG.SEPARATOR_COLOR}` }}>
            <div style={{ width: '100%', backgroundColor: CONFIG.BG_COLOR, borderRadius: '8px', padding: '1rem', overflowX: 'auto' }}>
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    <defs>
                        <filter id={CONFIG.SIGNAL_GLOW_ID} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <Grid width={width} height={height} />
                    
                    <ThresholdLine y={vihY} labelParts={[{ text: "V", type: "normal" }, { text: "_IH", type: "subscript" }, { text: " (High Threshold)", type: "normal" }]} />
                    <ThresholdLine y={vilY} labelParts={[{ text: "V", type: "normal" }, { text: "_IL", type: "subscript" }, { text: " (Low Threshold)", type: "normal" }]} />

                    <path d={signalPath} stroke={CONFIG.SIGNAL_COLOR} strokeWidth="3.5" fill="none" filter={`url(#${CONFIG.SIGNAL_GLOW_ID})`} />

                    <Annotation x={riseStartX + 150} y={signalYBase - signalHeight * 0.5}>
                        <tspan x="-125" dy="1.2em" fontWeight="bold">Slow Rise Time</tspan>
                        <tspan x="-125" dy="1.2em">Sinyal, V</tspan>
                        <tspan dy="0.3em" fontSize="9px">IH</tspan>
                        <tspan dy="-0.3em" fontSize="14px">'ye çok yavaş ulaşıyor.</tspan>
                        <tspan x="-125" dy="1.2em">(Zayıf Pull-up / Yüksek Kapasitans)</tspan>
                    </Annotation>

                </svg>
            </div>
            <div style={{
                width: 'calc(100% - 4rem)',
                margin: '0 auto',
                borderTop: `1px solid ${CONFIG.SEPARATOR_COLOR}`,
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                textAlign: 'center'
            }}>
                
                <p style={{ margin: '0', color: CONFIG.ANNOTATION_COLOR, fontSize: '14px', lineHeight: '1.6' }}>
                    Bu osiloskop görüntüsü, I²C hattındaki yaygın bir donanım sorununu gösterir. Sinyalin yükselen kenarı, kavisli bir RC şarj eğrisini andırır ve mantık '1' seviyesine (V<sub>IH</sub>) ulaşması çok uzun sürer. Bu durum, genellikle pull-up direncinin çok zayıf olmasından veya hattaki kapasitansın yüksek olmasından kaynaklanır ve veri hatalarına yol açabilir.
                </p>
                <h2 style={{
                    color: CONFIG.LABEL_COLOR,
                    margin: '1rem 0 1rem 0',
                    fontWeight: 500,
                    fontSize: '18px',
                }}>
                    Şekil 6.4: Osiloskopta Yavaş Yükselme Zamanı Problemi
                </h2>
            </div>
        </div>
    );
}