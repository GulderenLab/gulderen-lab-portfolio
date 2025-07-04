import React from 'react';

// --- CONFIGURATION (Clear, Standard Timing Diagram) ---
const CONFIG = {
  Y_SCL: 60,         // Y position for SCL line
  Y_SDA: 160,        // Y position for SDA line
  SIGNAL_HEIGHT: 35,   // Height of the signal transition
  
  BG_COLOR: '#0D1117',
  SCL_COLOR: '#58A6FF', // Blue
  SDA_COLOR: '#FFFF00', // Yellow
  LABEL_COLOR: '#C9D1D9',
  ANNOTATION_COLOR: '#8B949E',
  SEPARATOR_COLOR: 'rgba(139, 148, 158, 0.2)',
  SLAVE_ACK_COLOR: '#00F2FF', // Cyan for Slave ACK

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

const BitAnnotation = ({ x, y, bit, color = CONFIG.SDA_COLOR }) => (
    <text x={x} y={y - 15} fill={color} fontSize="14" textAnchor="middle" fontWeight="bold">
        {bit}
    </text>
);

// --- MAIN DIAGRAM COMPONENT ---

export default function MasterToSlaveWriteFinal() {
    const sclHigh = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
    const sclLow = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
    const sdaHigh = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
    const sdaLow = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;

    let x = CONFIG.START_X;
    let sclPath = `M 0 ${sclHigh} L ${x} ${sclHigh}`;
    let sdaPath = `M 0 ${sdaHigh} L ${x} ${sdaHigh}`;
    const elements = [];

    // 1. START
    const startX = x;
    sdaPath += ` L ${x + CONFIG.SLOPE} ${sdaHigh} L ${x + CONFIG.SLOPE * 2} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPath += ` L ${x} ${sdaLow}`;
    elements.push(<PhaseZone key="start" x={startX} width={CONFIG.BIT_WIDTH} label="Start" />);

    // Function to generate a byte + ACK
    const renderByteAndAck = (bits, label, ackBySlave) => {
        const byteStartX = x;
        // 8 Data Bits
        for (const bit of bits) {
            const sdaY = bit === 1 ? sdaHigh : sdaLow;
            sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
            sdaPath += ` L ${x} ${sdaY}`;
            elements.push(<BitAnnotation key={`bit-${x}`} x={x + CONFIG.BIT_WIDTH / 2} y={sdaY} bit={bit} />);
            x += CONFIG.BIT_WIDTH;
            sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
            sdaPath += ` L ${x} ${sdaY}`;
        }

        // ACK Bit
        const ackStartX = x;
        const ackSdaY = ackBySlave ? sdaLow : sdaHigh; // Slave pulls low for ACK
        const ackColor = ackBySlave ? CONFIG.SLAVE_ACK_COLOR : CONFIG.SDA_COLOR;
        sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
        sdaPath += ` L ${x} ${ackSdaY}`;
        elements.push(<BitAnnotation key={`ack-${x}`} x={x + CONFIG.BIT_WIDTH / 2} y={ackSdaY} bit={0} color={ackColor} />);
        x += CONFIG.BIT_WIDTH;
        sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
        sdaPath += ` L ${x} ${ackSdaY}`;
        
        elements.push(<PhaseZone key={label} x={byteStartX} width={9 * CONFIG.BIT_WIDTH} label={label} />);
    };

    // 2. Slave Address + W
    renderByteAndAck([0, 1, 1, 0, 1, 0, 1, 0], "Slave Address + W(0)", true);

    // 3. Register Address
    renderByteAndAck([0, 0, 1, 0, 1, 1, 0, 1], "Register Address", true);

    // 4. Data
    renderByteAndAck([1, 1, 0, 0, 0, 1, 0, 1], "Data Byte", true);

    // 5. STOP
    const stopX = x;
    sdaPath += ` L ${x + CONFIG.SLOPE} ${sdaLow} L ${x + CONFIG.SLOPE * 2} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPath += ` L ${x} ${sdaHigh}`;
    elements.push(<PhaseZone key="stop" x={stopX} width={CONFIG.BIT_WIDTH} label="Stop" />);

    const totalWidth = x + 40;
    sclPath += ` L ${totalWidth} ${sclHigh}`;
    sdaPath += ` L ${totalWidth} ${sdaHigh}`;

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', backgroundColor: '#01041B', borderRadius: '16px', border: `1px solid ${CONFIG.SEPARATOR_COLOR}` }}>
            <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
                <svg width={totalWidth} height={270} viewBox={`0 0 ${totalWidth} 270`}>
                    {elements}
                    <path d={sclPath} stroke={CONFIG.SCL_COLOR} strokeWidth="2" fill="none" />
                    <path d={sdaPath} stroke={CONFIG.SDA_COLOR} strokeWidth="2" fill="none" />
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
                    Bu diyagram, bir I²C master cihazının, bir slave cihazdaki belirli bir register'a nasıl veri yazdığını gösterir.
                </p>
                <h2 style={{
                    color: CONFIG.LABEL_COLOR,
                    margin: '0 0 1rem 0',
                    fontWeight: 500,
                    fontSize: '18px',
                }}>
                    Şekil 6.1: Master'dan Slave'e Yazma Protokolü
                </h2>
            </div>
        </div>
    );
}
