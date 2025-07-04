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

const StepLabel = ({ x, width, label }) => (
    <text x={x + width / 2} y={225} fill={CONFIG.LABEL_COLOR} fontSize="12" textAnchor="middle">
        {label}
    </text>
);

const PhaseLabel = ({ x, width, label }) => (
    <>
        <rect 
            x={x} y={240} 
            width={width} height={30} 
            fill={`rgba(88, 166, 255, 0.15)`} 
            rx="5"
            stroke={`rgba(88, 166, 255, 0.4)`}
            strokeWidth="1"
        />
        <text x={x + width / 2} y={260} fill={CONFIG.SCL_COLOR} fontSize="14" fontWeight="600" textAnchor="middle">
            {label}
        </text>
    </>
);


// --- MAIN DIAGRAM COMPONENT ---

export default function EEPROMRandomReadDiagram() {
    const sclHigh = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
    const sclLow = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
    const sdaHigh = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
    const sdaLow = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;

    let x = CONFIG.START_X;
    let sclPath = `M 0 ${sclHigh} L ${x} ${sclHigh}`;
    const elements = [];
    const sdaSegments = [];

    const addSdaSegment = (path, color) => {
        sdaSegments.push({ d: path, color });
    };

    // Helper to draw a generic byte on SDA, returning the path string
    const getBytePath = (startX) => {
        let path = '';
        let currentX = startX;
        // We assume a generic "busy" line for the byte, as bits are not shown
        path += ` L ${currentX} ${sdaLow}`;
        currentX += 8 * CONFIG.BIT_WIDTH;
        path += ` L ${currentX} ${sdaLow}`;
        return path;
    };
    
    // --- Build Path Step-by-Step ---
    
    const addressPhaseStartX = x;
    let masterSdaPath = `M 0 ${sdaHigh} L ${x} ${sdaHigh}`;

    // 1. Start (S)
    const startX = x;
    masterSdaPath += ` L ${x + CONFIG.SLOPE} ${sdaHigh} L ${x + CONFIG.SLOPE * 2} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaLow}`;
    elements.push(<StepLabel key="start" x={startX} width={CONFIG.BIT_WIDTH} label="Start (S)" />);

    // 2. Device Addr + W
    const devAddrX = x;
    masterSdaPath += getBytePath(x);
    x += 8 * CONFIG.BIT_WIDTH;
    elements.push(<StepLabel key="devAddr" x={devAddrX} width={8 * CONFIG.BIT_WIDTH} label="Device Addr + W" />)
    
    // End of Master segment before ACK
    addSdaSegment(masterSdaPath, CONFIG.SDA_COLOR);
    
    // ACK by Slave
    let slaveSdaPath = `M ${x} ${sdaLow}`;
    sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
    slaveSdaPath += ` L ${x} ${sdaLow}`;
    addSdaSegment(slaveSdaPath, CONFIG.SDA_SLAVE_COLOR);
    elements.push(<StepLabel key="ack1" x={x - CONFIG.BIT_WIDTH} width={CONFIG.BIT_WIDTH} label="ACK" />);
    
    // 3. Mem Addr High
    masterSdaPath = `M ${x} ${sdaLow}`;
    const memHighX = x;
    masterSdaPath += getBytePath(x);
    x += 8 * CONFIG.BIT_WIDTH;
    elements.push(<StepLabel key="memHigh" x={memHighX} width={8 * CONFIG.BIT_WIDTH} label="Mem Addr High" />)
    addSdaSegment(masterSdaPath, CONFIG.SDA_COLOR);

    // ACK by Slave
    slaveSdaPath = `M ${x} ${sdaLow}`;
    sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
    slaveSdaPath += ` L ${x} ${sdaLow}`;
    addSdaSegment(slaveSdaPath, CONFIG.SDA_SLAVE_COLOR);
    elements.push(<StepLabel key="ack2" x={x - CONFIG.BIT_WIDTH} width={CONFIG.BIT_WIDTH} label="ACK" />);

    // 4. Mem Addr Low
    masterSdaPath = `M ${x} ${sdaLow}`;
    const memLowX = x;
    masterSdaPath += getBytePath(x);
    x += 8 * CONFIG.BIT_WIDTH;
    elements.push(<StepLabel key="memLow" x={memLowX} width={8 * CONFIG.BIT_WIDTH} label="Mem Addr Low" />)
    addSdaSegment(masterSdaPath, CONFIG.SDA_COLOR);

    // ACK by Slave
    slaveSdaPath = `M ${x} ${sdaLow}`;
    sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
    slaveSdaPath += ` L ${x} ${sdaLow}`;
    addSdaSegment(slaveSdaPath, CONFIG.SDA_SLAVE_COLOR);
    elements.push(<StepLabel key="ack3" x={x - CONFIG.BIT_WIDTH} width={CONFIG.BIT_WIDTH} label="ACK" />);
    
    const addressPhaseWidth = x - addressPhaseStartX;
    const readPhaseStartX = x;

    // 5. Repeated Start (Sr)
    masterSdaPath = `M ${x} ${sdaLow}`;
    const srX = x;
    sclPath += ` L ${x} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaLow} L ${x + CONFIG.SLOPE} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaHigh} L ${x + CONFIG.SLOPE} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaLow}`;
    elements.push(<StepLabel key="sr" x={srX} width={CONFIG.BIT_WIDTH} label="Repeat Start (Sr)" />);

    // 6. Device Addr + R
    const devAddrRX = x;
    masterSdaPath += getBytePath(x);
    x += 8 * CONFIG.BIT_WIDTH;
    elements.push(<StepLabel key="devAddrR" x={devAddrRX} width={8 * CONFIG.BIT_WIDTH} label="Device Addr + R" />)
    addSdaSegment(masterSdaPath, CONFIG.SDA_COLOR);

    // ACK by Slave
    slaveSdaPath = `M ${x} ${sdaLow}`;
    sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
    slaveSdaPath += ` L ${x} ${sdaLow}`;
    addSdaSegment(slaveSdaPath, CONFIG.SDA_SLAVE_COLOR);
    elements.push(<StepLabel key="ack4" x={x - CONFIG.BIT_WIDTH} width={CONFIG.BIT_WIDTH} label="ACK" />);

    // 7. Data from EEPROM
    slaveSdaPath = `M ${x} ${sdaLow}`;
    const dataX = x;
    // As slave drives the line, we just show a generic low line for data
    slaveSdaPath += ` L ${x + 8 * CONFIG.BIT_WIDTH} ${sdaLow}`;
    x += 8 * CONFIG.BIT_WIDTH;
    addSdaSegment(slaveSdaPath, CONFIG.SDA_SLAVE_COLOR);
    elements.push(<StepLabel key="data" x={dataX} width={8 * CONFIG.BIT_WIDTH} label="Data from EEPROM" />)

    // NACK by Master
    masterSdaPath = `M ${x} ${sdaLow} L ${x} ${sdaHigh}`; // Master pulls high for NACK
    sclPath += ` L ${x + CONFIG.SLOPE} ${sclHigh} L ${x + CONFIG.SLOPE * 2} ${sclLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x - CONFIG.SLOPE * 2} ${sclLow} L ${x - CONFIG.SLOPE} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaHigh}`;
    addSdaSegment(masterSdaPath, CONFIG.SDA_COLOR);
    elements.push(<StepLabel key="nack" x={x - CONFIG.BIT_WIDTH} width={CONFIG.BIT_WIDTH} label="NACK" />);

    // 8. Stop (P)
    masterSdaPath = `M ${x} ${sdaHigh} L ${x} ${sdaLow}`;
    const stopX = x;
    sclPath += ` L ${x} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaLow} L ${x + CONFIG.SLOPE} ${sdaLow} L ${x + CONFIG.SLOPE*2} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x} ${sclHigh}`;
    masterSdaPath += ` L ${x} ${sdaHigh}`;
    addSdaSegment(masterSdaPath, CONFIG.SDA_COLOR);
    elements.push(<StepLabel key="stop" x={stopX} width={CONFIG.BIT_WIDTH} label="Stop (P)" />);

    const readPhaseWidth = x - readPhaseStartX;
    const totalWidth = x + 40;
    sclPath += ` L ${totalWidth} ${sclHigh}`;

    elements.push(<PhaseLabel key="phase-addr" x={addressPhaseStartX} width={addressPhaseWidth} label="Adres Ayarlama" />);
    elements.push(<PhaseLabel key="phase-read" x={readPhaseStartX} width={readPhaseWidth} label="Veri Okuma" />);

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', backgroundColor: '#01041B', borderRadius: '16px', border: `1px solid ${CONFIG.SEPARATOR_COLOR}` }}>
            <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
                <svg width={totalWidth} height={290} viewBox={`0 0 ${totalWidth} 290`}>
                    <rect width={totalWidth} height={290} fill={CONFIG.BG_COLOR} />
                    <SignalLabel y={CONFIG.Y_SCL} color={CONFIG.SCL_COLOR} label="SCL" />
                    <SignalLabel y={CONFIG.Y_SDA} color={CONFIG.SDA_COLOR} label="SDA" />
                    <path d={sclPath} stroke={CONFIG.SCL_COLOR} strokeWidth="2" fill="none" />
                    {sdaSegments.map((seg, i) => <path key={i} d={seg.d} stroke={seg.color} strokeWidth="2" fill="none" />)}
                    {elements}
                </svg>
            </div>
             <div style={{
                width: 'calc(100% - 4rem)',
                margin: '0 auto',
                borderTop: `1px solid ${CONFIG.SEPARATOR_COLOR}`,
                marginTop: '1rem',
                paddingTop: '1.5rem',
                textAlign: 'center'
            }}>
                <h2 style={{
                    color: CONFIG.LABEL_COLOR,
                    margin: '0 0 1rem 0',
                    fontWeight: 500,
                    fontSize: '18px',
                }}>
                    İmaj 9.1: EEPROM Rastgele Okuma Sekansı
                </h2>
                <p style={{ margin: '0', color: CONFIG.ANNOTATION_COLOR, fontSize: '14px', lineHeight: '1.6' }}>
                    Bu diyagram, bir I2C EEPROM'dan rastgele bir adresten veri okuma sürecini gösterir. İlk fazda ("Adres Ayarlama"), master cihazı ve okunacak hafıza adresini belirtir. İkinci fazda ("Veri Okuma"), "Repeated Start" koşuluyla okuma moduna geçilir ve EEPROM belirtilen adresteki veriyi gönderir. Master, okumayı sonlandırmak için NACK sinyali yollar.
                </p>
            </div>
        </div>
    );
}
