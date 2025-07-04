
import React from 'react';

// --- CONFIGURATION ---
const CONFIG = {
  Y_SCL: 50,
  Y_SDA: 150,
  SIGNAL_HEIGHT: 30,
  BIT_WIDTH: 35,
  SLOPE: 6,
  START_X: 50,
  
  // Colors
  BG_COLOR: '#0D1117',
  SCL_COLOR: '#58A6FF',      // Blue
  SDA_MASTER_COLOR: '#FFFF00', // Yellow
  SDA_SLAVE_COLOR: '#00F2FF', // Cyan
  LABEL_COLOR: '#C9D1D9',
  ANNOTATION_COLOR: '#8B949E',
  SEPARATOR_COLOR: 'rgba(139, 148, 158, 0.2)',
  ARROW_COLOR: '#F85149',     // Red
  ACK_COLOR: '#3FB950',       // Green
  NACK_COLOR: '#F85149',      // Red
  BIT_BOX_COLOR: 'rgba(201, 209, 217, 0.3)',
  FRAME_BG_COLOR: 'rgba(88, 166, 255, 0.1)',
  FRAME_BORDER_COLOR: 'rgba(88, 166, 255, 0.4)',
};

// --- HELPER COMPONENTS ---

const SignalLabel = ({ y, color, label }) => (
    <text x={15} y={y} fill={color} fontSize="16" fontWeight="bold" textAnchor="start">{label}</text>
);

const SpecialConditionArrow = ({ x, y, label }) => (
    <>
        <path d={`M ${x} ${y+20} L ${x} ${y-5}`} stroke={CONFIG.ARROW_COLOR} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x={x} y={y+35} fill={CONFIG.ARROW_COLOR} fontSize="12" textAnchor="middle">{label}</text>
    </>
);

const Bit = ({ x, y, value, color }) => (
    <>
        <rect x={x} y={y - 10} width={CONFIG.BIT_WIDTH} height={20} fill={CONFIG.BIT_BOX_COLOR} rx="3" />
        <text x={x + CONFIG.BIT_WIDTH / 2} y={y + 5} fill={color} fontSize="14" fontWeight="bold" textAnchor="middle">{value}</text>
    </>
);

const AckNack = ({ x, y, isAck, driver }) => {
    const color = isAck ? CONFIG.ACK_COLOR : CONFIG.NACK_COLOR;
    const label = isAck ? 'ACK' : 'NACK';
    const direction = driver === 'slave' ? '← EEPROM' : '← Master';
    return (
        <>
            <rect x={x} y={y - 10} width={CONFIG.BIT_WIDTH} height={20} fill={color} rx="3" />
            <text x={x + CONFIG.BIT_WIDTH / 2} y={y + 5} fill={'#FFFFFF'} fontSize="12" fontWeight="bold" textAnchor="middle">{label}</text>
            <text x={x + CONFIG.BIT_WIDTH / 2} y={y + 25} fill={CONFIG.ANNOTATION_COLOR} fontSize="10" textAnchor="middle">{direction}</text>
        </>
    );
};

const ByteFrame = ({ x, width, label }) => (
    <>
        <rect x={x} y={CONFIG.Y_SDA + 40} width={width} height={30} fill="none" stroke={CONFIG.FRAME_BORDER_COLOR} strokeDasharray="4 2" />
        <text x={x + width / 2} y={CONFIG.Y_SDA + 60} fill={CONFIG.LABEL_COLOR} fontSize="12" textAnchor="middle">{label}</text>
    </>
);

const PhaseRegion = ({ x, width, label }) => (
     <>
        <rect x={x} y={10} width={width} height={265} fill={CONFIG.FRAME_BG_COLOR} rx="8" />
        <text x={x + width / 2} y={290} fill={CONFIG.SCL_COLOR} fontSize="16" fontWeight="600" textAnchor="middle">{label}</text>
    </>
);


// --- MAIN DIAGRAM ---

export default function EEPROMRandomReadDiagramEnhanced() {
    const sclHigh = CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT / 2;
    const sclLow = CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT / 2;
    const sdaHigh = CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT / 2;
    const sdaLow = CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT / 2;

    const elements = [];
    let sdaPathMaster = '';
    let sdaPathSlave = '';
    let sclPath = '';
    let x = CONFIG.START_X;

    const drawClock = (clockX) => {
        const quarterBit = CONFIG.BIT_WIDTH / 4;
        sclPath += ` L ${clockX + quarterBit} ${sclHigh}`;
        sclPath += ` L ${clockX + quarterBit} ${sclLow}`;
        sclPath += ` L ${clockX + CONFIG.BIT_WIDTH - quarterBit} ${sclLow}`;
        sclPath += ` L ${clockX + CONFIG.BIT_WIDTH - quarterBit} ${sclHigh}`;
        sclPath += ` L ${clockX + CONFIG.BIT_WIDTH} ${sclHigh}`;
    };

    const drawByte = (startX, bits, frameLabel) => {
        let currentX = startX;
        let sdaPath = `M ${currentX} ${sdaLow}`;
        
        for(const bit of bits) {
            const sdaY = bit === 1 ? sdaHigh : sdaLow;
            sdaPath += ` L ${currentX} ${sdaY}`;
            drawClock(currentX);
            elements.push(<Bit key={`bit-${currentX}`} x={currentX} y={CONFIG.Y_SDA} value={bit} color={CONFIG.SDA_MASTER_COLOR} />);
            currentX += CONFIG.BIT_WIDTH;
            sdaPath += ` L ${currentX} ${sdaY}`;
        }
        elements.push(<ByteFrame key={`frame-${startX}`} x={startX} width={8 * CONFIG.BIT_WIDTH} label={frameLabel} />);
        return sdaPath;
    };
    
    const drawAckNack = (startX, isAck, isSlaveDriven) => {
        const sdaY = isAck ? sdaLow : sdaHigh;
        let sdaPath = `M ${startX} ${sdaY}`;
        drawClock(startX);
        sdaPath += ` L ${startX + CONFIG.BIT_WIDTH} ${sdaY}`;
        elements.push(<AckNack key={`ack-${startX}`} x={startX} y={CONFIG.Y_SDA} isAck={isAck} driver={isSlaveDriven ? 'slave' : 'master'} />)
        return sdaPath;
    };

    // --- RENDER SEQUENCE ---
    sclPath = `M 0 ${sclHigh} L ${x} ${sclHigh}`;
    sdaPathMaster = `M 0 ${sdaHigh} L ${x} ${sdaHigh}`;
    
    // === PHASE 1: ADDRESS SETUP ===
    const phase1Start = x;

    // 1. Start Condition
    elements.push(<SpecialConditionArrow key="start" x={x + CONFIG.BIT_WIDTH/2} y={CONFIG.Y_SDA} label="START" />);
    sdaPathMaster += ` L ${x} ${sdaHigh} L ${x + CONFIG.SLOPE} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH;
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPathMaster += ` L ${x} ${sdaLow}`;

    // 2. Device Address + W
    sdaPathMaster += drawByte(x, ['A','D','D','R','+','W',' '], 'Cihaz Adresi + W').substring(1);
    x += 8 * CONFIG.BIT_WIDTH;
    
    // ACK from Slave
    sdaPathSlave += drawAckNack(x, true, true);
    x += CONFIG.BIT_WIDTH;

    // 3. Memory Address High
    sdaPathMaster += ` M ${x} ${sdaLow}`;
    sdaPathMaster += drawByte(x, ['M','E','M',' ','H','I','G','H'], 'Bellek Adresi (Yüksek)').substring(1);
    x += 8 * CONFIG.BIT_WIDTH;
    
    // ACK from Slave
    sdaPathSlave += drawAckNack(x, true, true);
    x += CONFIG.BIT_WIDTH;

    // 4. Memory Address Low
    sdaPathMaster += ` M ${x} ${sdaLow}`;
    sdaPathMaster += drawByte(x, ['M','E','M',' ','L','O','W',' '], 'Bellek Adresi (Düşük)').substring(1);
    x += 8 * CONFIG.BIT_WIDTH;

    // ACK from Slave
    sdaPathSlave += drawAckNack(x, true, true);
    x += CONFIG.BIT_WIDTH;
    
    const phase1Width = x - phase1Start;
    elements.push(<PhaseRegion key="phase1" x={phase1Start - 10} width={phase1Width + 20} label="Faz 1: Adres Ayarlama" />);

    // === PHASE 2: DATA READ ===
    const phase2Start = x;

    // 5. Repeated Start
    elements.push(<SpecialConditionArrow key="sr" x={x + CONFIG.BIT_WIDTH/2} y={CONFIG.Y_SDA} label="Sr" />);
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPathMaster += ` M ${x} ${sdaLow} L ${x} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPathMaster += ` L ${x} ${sdaHigh} L ${x} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH / 2;
    
    // 6. Device Address + R
    sdaPathMaster += drawByte(x, ['A','D','D','R','+','R',' '], 'Cihaz Adresi + R').substring(1);
    x += 8 * CONFIG.BIT_WIDTH;

    // ACK from Slave
    sdaPathSlave += drawAckNack(x, true, true);
    x += CONFIG.BIT_WIDTH;

    // 7. Data from EEPROM (0xA5 = 10100101)
    const dataBits = [1,0,1,0,0,1,0,1];
    let dataPath = `M ${x} ${sdaHigh}`;
    let currentX = x;
    for(const bit of dataBits) {
        const sdaY = bit === 1 ? sdaHigh : sdaLow;
        dataPath += ` L ${currentX} ${sdaY}`;
        drawClock(currentX);
        elements.push(<Bit key={`bit-${currentX}`} x={currentX} y={CONFIG.Y_SDA} value={bit} color={CONFIG.SDA_SLAVE_COLOR} />);
        currentX += CONFIG.BIT_WIDTH;
        dataPath += ` L ${currentX} ${sdaY}`;
    }
    sdaPathSlave += dataPath;
    elements.push(<ByteFrame key="frame-data" x={x} width={8 * CONFIG.BIT_WIDTH} label="Veri Byte (0xA5)" />);
    x += 8 * CONFIG.BIT_WIDTH;

    // NACK from Master
    sdaPathMaster += drawAckNack(x, false, false);
    x += CONFIG.BIT_WIDTH;

    // 8. Stop Condition
    elements.push(<SpecialConditionArrow key="stop" x={x + CONFIG.BIT_WIDTH/2} y={CONFIG.Y_SDA} label="STOP" />);
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPathMaster += ` M ${x} ${sdaHigh} L ${x} ${sdaLow}`;
    x += CONFIG.BIT_WIDTH / 2;
    sclPath += ` L ${x} ${sclHigh}`;
    sdaPathMaster += ` L ${x} ${sdaLow} L ${x} ${sdaHigh}`;
    x += CONFIG.BIT_WIDTH;
    
    const phase2Width = x - phase2Start;
    elements.push(<PhaseRegion key="phase2" x={phase2Start - 10} width={phase2Width + 10} label="Faz 2: Veri Okuma" />);

    const totalWidth = x + 40;
    sclPath += ` L ${totalWidth} ${sclHigh}`;
    sdaPathMaster += ` L ${totalWidth} ${sdaHigh}`;

    return (
        <div style={{ margin: '2rem auto', padding: '1rem', backgroundColor: '#01041B', borderRadius: '16px', border: `1px solid ${CONFIG.SEPARATOR_COLOR}` }}>
            <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
                <svg width={totalWidth} height={320} viewBox={`0 0 ${totalWidth} 320`}>
                    <defs>
                        <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIG.ARROW_COLOR} />
                        </marker>
                    </defs>
                    
                    {/* Background and Phase Regions */}
                    <rect width={totalWidth} height={320} fill={CONFIG.BG_COLOR} />
                    {elements.filter(e => e.type === PhaseRegion)}

                    {/* Signals and Labels */}
                    <SignalLabel y={CONFIG.Y_SCL} color={CONFIG.SCL_COLOR} label="SCL" />
                    <SignalLabel y={CONFIG.Y_SDA} color={CONFIG.SDA_MASTER_COLOR} label="SDA" />
                    <path d={sclPath} stroke={CONFIG.SCL_COLOR} strokeWidth="2" fill="none" />
                    <path d={sdaPathMaster} stroke={CONFIG.SDA_MASTER_COLOR} strokeWidth="2" fill="none" />
                    <path d={sdaPathSlave} stroke={CONFIG.SDA_SLAVE_COLOR} strokeWidth="2" fill="none" />
                    
                    {/* All other annotations */}
                    {elements.filter(e => e.type !== PhaseRegion)}
                </svg>
            </div>
            <div style={{ width: 'calc(100% - 4rem)', margin: '0 auto', borderTop: `1px solid ${CONFIG.SEPARATOR_COLOR}`, marginTop: '1rem', paddingTop: '1.5rem', textAlign: 'center' }}>
                <h2 style={{ color: CONFIG.LABEL_COLOR, margin: '0 0 1rem 0', fontWeight: 500, fontSize: '18px' }}>
                    Şekil 9.1: EEPROM Rastgele Okuma Sekansı
                </h2>
                <p style={{ margin: '0', color: CONFIG.ANNOTATION_COLOR, fontSize: '14px', lineHeight: '1.6' }}>
                    Bu diyagram, bir I2C EEPROM'dan rastgele okuma işleminin ayrıntılı adımlarını gösterir. Master, önce yazma işlemiyle adresleri ayarlar, ardından "Repeated Start" ile okuma moduna geçer ve EEPROM'un gönderdiği veriyi (örnek: 0xA5) alır.
                </p>
            </div>
        </div>
    );
}
