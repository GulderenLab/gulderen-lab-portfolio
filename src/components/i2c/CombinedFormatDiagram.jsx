import React from 'react';

// --- CONFIGURATION (Clear, Standard Timing Diagram) ---
const CONFIG = {
  Y_SCL: 60,         // Y position for SCL line
  Y_SDA: 160,        // Y position for SDA line
  SIGNAL_HEIGHT: 35,   // Height of the signal transition
  
  BG_COLOR: '#0D1117',
  SCL_COLOR: '#58A6FF', // Blue
  SDA_COLOR: '#FFFF00', // Yellow (Master Driven)
  SDA_SLAVE_COLOR: '#00F2FF', // Cyan (Slave Driven)
  LABEL_COLOR: '#C9D1D9',
  ANNOTATION_COLOR: '#8B949E',
  SEPARATOR_COLOR: 'rgba(139, 148, 158, 0.2)',

  // --- Timing & Spacing ---
  BIT_WIDTH: 40,       // Width of a single bit slot
  SLOPE: 8,          // Width of the rise/fall slope
  START_X: 40,         // Initial X position
};

// --- HELPER COMPONENTS ---

const SignalLabel = ({ y, color, label }) => (
    <text x={15} y={y} fill={color} fontSize="18" fontWeight="bold" textAnchor="start">
        {label}
    </text>
);

const PhaseZone = ({ x, width, label }) => (
    <>
        <rect 
            x={x} y={10} 
            width={width} height={220} 
            fill={`rgba(139, 148, 158, 0.1)`} 
            rx="6" 
        />
        <text x={x + width / 2} y={250} fill={CONFIG.LABEL_COLOR} fontSize="14" fontWeight="600" textAnchor="middle">
            {label}
        </text>
    </>
);

const BitAnnotation = ({ x, y, bit, color }) => (
    <text x={x} y={y - 15} fill={color} fontSize="14" textAnchor="middle" fontWeight="bold">
        {bit}
    </text>
);

// --- MAIN DIAGRAM COMPONENT ---

export default function CombinedFormatDiagram() {
    const sclHigh = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
    const sclLow = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
    const sdaHigh = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
    const sdaLow = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;

    let x = CONFIG.START_X;
    let sclPath = `M 0 ${sclHigh} L ${x} ${sclHigh}`;
    const elements = [];
    const sdaSegments = []; // To draw SDA with different colors

    // Function to add a segment to the SDA path
    const addSdaSegment = (path, color) => {
        sdaSegments.push({ d: path, color });
    };

    // 1. START
    const startX = x;
    // This is the first segment, driven by the Master. It includes the initial idle line.
    let currentSdaPath = `M 0 ${sdaHigh} L ${x} ${sdaHigh}`;
    currentSdaPath += ` L ${x + CONFIG.SLOPE} ${sdaHigh} L ${x + CONFIG.SLOPE * 2} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x} ${sdaLow}`;
    elements.push(<PhaseZone key="start" x={startX} width={CONFIG.BIT_WIDTH} label="Start (S)" />);

    // Function to generate a byte transfer
    const renderByte = (bits, sdaColor) => {
        for (const bit of bits) {
            const sdaY = bit === 1 ? sdaHigh : sdaLow;
            sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
            currentSdaPath += ` L ${x} ${sdaY}`;
            elements.push(<BitAnnotation key={`bit-${x}`} x={x + CONFIG.BIT_WIDTH / 2} y={sdaY} bit={bit} color={sdaColor} />);
            x += CONFIG.BIT_WIDTH;
            sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
            currentSdaPath += ` L ${x} ${sdaY}`;
        }
    };
    
    // Function for ACK/NACK bit
    const renderAckNack = (isAck, drivenBySlave) => {
        const sdaY = isAck ? sdaLow : sdaHigh;
        const sdaColor = drivenBySlave ? CONFIG.SDA_SLAVE_COLOR : CONFIG.SDA_COLOR;
        sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
        currentSdaPath += ` L ${x} ${sdaY}`;
        elements.push(<BitAnnotation key={`ack-${x}`} x={x + CONFIG.BIT_WIDTH / 2} y={sdaY} bit={isAck ? 0:1} color={sdaColor} />);
        x += CONFIG.BIT_WIDTH;
        sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
        currentSdaPath += ` L ${x} ${sdaY}`;
    };

    // 2. Slave Address + W -> ACK
    elements.push(<PhaseZone key="addr-w" x={x} width={9 * CONFIG.BIT_WIDTH} label="Slave Addr + W -> ACK" />);
    renderByte([0, 1, 1, 0, 1, 0, 1, 0], CONFIG.SDA_COLOR); // Example address, last bit is 0 for Write
    renderAckNack(true, true);

    // 3. Register Address (0x2A) -> ACK
    elements.push(<PhaseZone key="reg-addr" x={x} width={9 * CONFIG.BIT_WIDTH} label="Register Addr (0x2A) -> ACK" />);
    renderByte([0, 0, 1, 0, 1, 0, 1, 0], CONFIG.SDA_COLOR); // 0x2A = 00101010
    renderAckNack(true, true);
    addSdaSegment(currentSdaPath, CONFIG.SDA_COLOR);

    // 4. REPEATED START (Sr)
    const srX = x;
    currentSdaPath = `M ${x} ${sdaLow}`;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x} ${sdaLow} L ${x + CONFIG.SLOPE} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x} ${sdaHigh} L ${x + CONFIG.SLOPE} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x} ${sdaLow}`;
    elements.push(<PhaseZone key="sr" x={srX} width={CONFIG.BIT_WIDTH} label="Repeat Start (Sr)" />);

    // 5. Slave Address + R -> ACK
    elements.push(<PhaseZone key="addr-r" x={x} width={9 * CONFIG.BIT_WIDTH} label="Slave Addr + R -> ACK" />);
    renderByte([0, 1, 1, 0, 1, 0, 1, 1], CONFIG.SDA_COLOR); // Same address, last bit is 1 for Read
    renderAckNack(true, true);
    addSdaSegment(currentSdaPath, CONFIG.SDA_COLOR);

    // 6. Data from Slave -> NACK
    elements.push(<PhaseZone key="data-read" x={x} width={9 * CONFIG.BIT_WIDTH} label="Data from Slave -> NACK" />);
    currentSdaPath = `M ${x} ${sdaHigh}`;
    renderByte([1, 1, 0, 0, 0, 1, 0, 1], CONFIG.SDA_SLAVE_COLOR); // Example data read from sensor
    addSdaSegment(currentSdaPath, CONFIG.SDA_SLAVE_COLOR);
    currentSdaPath = `M ${x} ${sdaHigh}`;
    renderAckNack(false, false); // NACK by Master to end read
    addSdaSegment(currentSdaPath, CONFIG.SDA_COLOR);

    // 8. STOP
    const stopX = x;
    currentSdaPath = `M ${x} ${sdaHigh}`;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x + CONFIG.SLOPE} ${sdaHigh} L ${x + CONFIG.SLOPE * 2} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x} ${sdaHigh} L ${x + CONFIG.SLOPE} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    currentSdaPath += ` L ${x} ${sdaHigh}`;
    elements.push(<PhaseZone key="stop" x={stopX} width={CONFIG.BIT_WIDTH} label="Stop (P)" />);
    addSdaSegment(currentSdaPath, CONFIG.SDA_COLOR);

    const totalWidth = x + 40;
    sclPath += ` L ${totalWidth} ${sclHigh}`;

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', backgroundColor: '#01041B', borderRadius: '16px', border: `1px solid ${CONFIG.SEPARATOR_COLOR}` }}>
            <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
                <svg width={totalWidth} height={270} viewBox={`0 0 ${totalWidth} 270`}>
                    {elements}
                    <path d={sclPath} stroke={CONFIG.SCL_COLOR} strokeWidth="2" fill="none" />
                    {sdaSegments.map((seg, i) => <path key={i} d={seg.d} stroke={seg.color} strokeWidth="2" fill="none" />)}
                    <SignalLabel y={CONFIG.Y_SCL} color={CONFIG.SCL_COLOR} label="SCL" />
                    <SignalLabel y={CONFIG.Y_SDA} color={CONFIG.SDA_COLOR} label="SDA" />
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
                    Bu diyagram, bir sensörün 0x2A register'ından veri okuma işlemini gösterir. Master önce yazma modunda register adresini belirtir, ardından "Repeated Start" ile okuma moduna geçer ve veriyi okur.
                </p>
                <h2 style={{
                    color: CONFIG.LABEL_COLOR,
                    margin: '1rem 0 1rem 0',
                    fontWeight: 500,
                    fontSize: '18px',
                }}>
                    Şekil 6.2: Sensör Okuma Senaryosu (Combined Format)
                </h2>
            </div>
        </div>
    );
}