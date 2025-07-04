import React from 'react';

// --- CONFIGURATION (Wokwi Logic Analyzer Style) ---
const CONFIG = {
  Y_SCL: 100,
  Y_SDA: 200,
  SIGNAL_HEIGHT: 40,
  
  // --- Colors (Inspired by Wokwi & Modern Analyzers) ---
  BG_COLOR: '#1E1E1E',
  GRID_COLOR: 'rgba(200, 200, 220, 0.1)',
  SCL_COLOR: '#9CDCFE', // Light Blue
  SDA_COLOR: '#F4D03F', // Amber Yellow
  LABEL_BG_COLOR: '#252526',
  LABEL_TEXT_COLOR: '#D4D4D4',
  TIME_TEXT_COLOR: '#8A8A8A',
  
  // --- Decoder Bubble Colors (Semi-transparent) ---
  BUBBLE_DEFAULT_BG: 'rgba(100, 100, 180, 0.8)',
  BUBBLE_ACK_BG: 'rgba(40, 167, 69, 0.8)',     // Green
  BUBBLE_NACK_BG: 'rgba(220, 53, 69, 0.8)',    // Red
  BUBBLE_START_BG: 'rgba(111, 66, 193, 0.8)',  // Purple
  BUBBLE_CONNECTOR_COLOR: '#8A8A8A',
  BUBBLE_TEXT_COLOR: '#FFFFFF',

  // --- Timing & Spacing ---
  BIT_WIDTH: 50, // Increased width for clarity
  START_X: 60,
};

// --- HELPER COMPONENTS ---

const DecoderBubble = ({ x, width, text, type, connectorY }) => {
  let backgroundColor = CONFIG.BUBBLE_DEFAULT_BG;
  if (type === 'ack') backgroundColor = CONFIG.BUBBLE_ACK_BG;
  if (type === 'nack') backgroundColor = CONFIG.BUBBLE_NACK_BG;
  if (type === 'start' || type === 'stop') backgroundColor = CONFIG.BUBBLE_START_BG;

  const bubbleY = 30;
  const bubbleHeight = 25;

  return (
    <g transform={`translate(${x}, 0)`}>
      {/* Connector line from bubble to signal */}
      <line x1={width / 2} y1={bubbleY + bubbleHeight} x2={width / 2} y2={connectorY} stroke={CONFIG.BUBBLE_CONNECTOR_COLOR} strokeWidth="1" />
      
      {/* Bubble */}
      <rect x="0" y={bubbleY} width={width} height={bubbleHeight} rx="4" fill={backgroundColor} />
      <text x={width / 2} y={bubbleY + 17} fill={CONFIG.BUBBLE_TEXT_COLOR} fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        {text}
      </text>
    </g>
  );
};

const Channel = ({ y, label, color, path }) => (
    <g>
        <rect x="0" y={y - 25} width={50} height={50} fill={CONFIG.LABEL_BG_COLOR} />
        <text x="25" y={y + 5} fill={color} fontSize="14" fontWeight="bold" textAnchor="middle">
            {label}
        </text>
        <path d={path} stroke={color} strokeWidth="2.5" fill="none" />
    </g>
);

const TimeScale = ({ totalWidth }) => {
    const markers = [];
    for (let x = CONFIG.START_X; x < totalWidth; x += CONFIG.BIT_WIDTH * 2) {
        markers.push(
            <text key={x} x={x} y={15} fill={CONFIG.TIME_TEXT_COLOR} fontSize="10" textAnchor="middle">
                {`${Math.round((x / CONFIG.BIT_WIDTH) * 4)}µs`}
            </text>
        );
    }
    return <g>{markers}</g>;
};

// --- MAIN DIAGRAM COMPONENT ---

export default function LogicAnalyzerViewFinal() {
    const sclHigh = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
    const sclLow = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
    const sdaHigh = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
    const sdaLow = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;

    let x = CONFIG.START_X;
    let sclPath = `M 0 ${sclHigh} L ${x} ${sclHigh}`;
    let sdaPath = `M 0 ${sdaHigh} L ${x} ${sdaHigh}`;
    const bubbles = [];

    const processSequence = (sequence) => {
        sequence.forEach(item => {
            const startX = x;
            bubbles.push(<DecoderBubble key={item.text} x={startX} width={item.bits.length * CONFIG.BIT_WIDTH} text={item.text} type={item.type} connectorY={sclHigh} />);

            item.bits.forEach(bit => {
                const sdaY = bit === 1 ? sdaHigh : sdaLow;
                const lowTimeX = x + (CONFIG.BIT_WIDTH * 0.3); // SCL is low for 30% of the time

                // SCL drops, stays low for 30%, then rises and stays high for 70%
                sclPath += ` V ${sclLow} H ${lowTimeX} V ${sclHigh} H ${x + CONFIG.BIT_WIDTH}`;
                
                // SDA changes value to the correct level, then holds for the bit duration
                sdaPath += ` V ${sdaY} H ${x + CONFIG.BIT_WIDTH}`;
                
                x += CONFIG.BIT_WIDTH;
            });
        });
    };

    // --- Build the I2C Sequence ---
    // 1. Start
    bubbles.push(<DecoderBubble key="start" x={x} width={CONFIG.BIT_WIDTH} text="Start" type="start" connectorY={sdaHigh} />);
    sclPath += ` H ${x + CONFIG.BIT_WIDTH}`;
    sdaPath += ` V ${sdaLow} H ${x + CONFIG.BIT_WIDTH}`;
    x += CONFIG.BIT_WIDTH;

    // 2. Main sequence
    const sequence = [
        { text: 'Addr: 0x68 (W)', bits: [1, 1, 0, 1, 0, 0, 0, 0], type: 'data' },
        { text: 'ACK', bits: [0], type: 'ack' },
        { text: 'Data: 0x0F', bits: [0, 0, 0, 0, 1, 1, 1, 1], type: 'data' },
        { text: 'ACK', bits: [0], type: 'ack' },
        { text: 'Data: 0x80', bits: [1, 0, 0, 0, 0, 0, 0, 0], type: 'data' },
        { text: 'NACK', bits: [1], type: 'nack' },
    ];
    processSequence(sequence);

    // 8. Stop
    bubbles.push(<DecoderBubble key="stop" x={x} width={CONFIG.BIT_WIDTH} text="Stop" type="stop" connectorY={sdaLow} />);
    sclPath += ` H ${x + CONFIG.BIT_WIDTH}`;
    sdaPath += ` V ${sdaHigh} H ${x + CONFIG.BIT_WIDTH}`;
    x += CONFIG.BIT_WIDTH;

    const totalWidth = x + 40;
    sclPath += ` H ${totalWidth}`;
    sdaPath += ` H ${totalWidth}`;

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', backgroundColor: '#01041B', borderRadius: '16px', border: `1px solid ${CONFIG.SEPARATOR_COLOR}` }}>
            <div style={{ width: '100%', backgroundColor: CONFIG.BG_COLOR, borderRadius: '8px', padding: '1rem', overflowX: 'auto' }}>
                <svg width={totalWidth} height={250} viewBox={`0 0 ${totalWidth} 250`}>
                    <defs>
                        <pattern id="grid-v" width={CONFIG.BIT_WIDTH} height="100%" patternUnits="userSpaceOnUse">
                            <path d={`M ${CONFIG.BIT_WIDTH} 0 L ${CONFIG.BIT_WIDTH} 250`} stroke={CONFIG.GRID_COLOR} strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-v)" />
                    
                    <TimeScale totalWidth={totalWidth} />
                    {bubbles}

                    <Channel y={CONFIG.Y_SCL} label="SCL" color={CONFIG.SCL_COLOR} path={sclPath} />
                    <Channel y={CONFIG.Y_SDA} label="SDA" color={CONFIG.SDA_COLOR} path={sdaPath} />
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
                    Bu görüntü, modern bir logic analyzer'ın I²C iletişimini nasıl çözdüğünü gösterir. Kırmızı <b style={{color: '#FF7B7B'}}>NACK</b> balonu, alıcı cihazın veriyi onaylamadığını net bir şekilde belirtir.
                </p>
                <h2 style={{
                    color: CONFIG.LABEL_TEXT_COLOR,
                    margin: '1rem 0 1rem 0',
                    fontWeight: 500,
                    fontSize: '18px',
                }}>
                    Şekil 6.3: Logic Analyzer Görüntüsü
                </h2>
            </div>
        </div>
    );
}