import React from 'react';

const CONFIG = {
    BG_COLOR: '#0D1117',
    BORDER_COLOR: '#30363d',
    TEXT_COLOR: '#C9D1D9',
    ACCENT_COLOR: '#58A6FF',
    ARROW_COLOR: '#F85149',
    BOX_FILL: '#161b22',
    INNER_BOX_FILL: '#21262d',
    REGISTER_BOX_FILL: '#2d333b',
};

const styles = {
    container: {
        margin: '2rem auto',
        padding: '1.5rem',
        backgroundColor: CONFIG.BG_COLOR,
        borderRadius: '16px',
        border: `1px solid ${CONFIG.BORDER_COLOR}`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
    },
    title: {
        color: CONFIG.TEXT_COLOR,
        margin: '0 0 1.5rem 0',
        fontWeight: 600,
        fontSize: '16px',
        textAlign: 'center',
    },
    description: {
        color: CONFIG.TEXT_COLOR,
        fontSize: '14px',
        lineHeight: '1.6',
        textAlign: 'center',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: `1px solid ${CONFIG.BORDER_COLOR}`,
    },
    svgText: {
        fill: CONFIG.TEXT_COLOR,
        fontSize: '13px',
        fontWeight: 'bold',
        textAnchor: 'middle',
    },
    smallText: {
        fill: CONFIG.TEXT_COLOR,
        fontSize: '10px',
        textAnchor: 'middle',
    },
    arrowText: {
        fill: CONFIG.ACCENT_COLOR,
        fontSize: '11px',
        fontWeight: 'bold',
        textAnchor: 'middle',
    },
    boxStyle: {
        fill: CONFIG.BOX_FILL,
        stroke: CONFIG.ACCENT_COLOR,
        strokeWidth: 2,
        rx: 8,
    },
    innerBoxStyle: {
        fill: CONFIG.INNER_BOX_FILL,
        stroke: CONFIG.BORDER_COLOR,
        strokeWidth: 1,
        rx: 4,
    },
    registerBoxStyle: {
        fill: CONFIG.REGISTER_BOX_FILL,
        stroke: CONFIG.ARROW_COLOR,
        strokeWidth: 1.5,
        rx: 6,
    },
    lineStyle: {
        stroke: '#F85149',
        strokeWidth: 1,
        fill: 'none',
    },
    dataFlowArrow: {
        stroke: CONFIG.ACCENT_COLOR,
        strokeWidth: 1.5,
        markerEnd: 'url(#dataArrowhead)',
        fill: 'none',
    },
    controlFlowArrow: {
        stroke: '#F85149',
        strokeWidth: 1.5,
        markerEnd: 'url(#controlArrowhead)',
        fill: 'none',
    },
    analogLine: {
        stroke: '#58A6FF',
        strokeWidth: 1.5,
        fill: 'none',
    },
};

export default function SensorBlockDiagram() {
    const width = 750; // Increased width
    const height = 500; // Increased height

    return (
        <div style={styles.container}>
            <div style={{ overflowX: 'auto' }}>
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    <defs>
                        {/* Data Flow Arrowhead */}
                        <marker id="dataArrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIG.ACCENT_COLOR} />
                        </marker>
                        {/* Control Flow Arrowhead */}
                        <marker id="controlArrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill={CONFIG.ARROW_COLOR} />
                        </marker>
                        {/* Left Arrowhead for Doğrudan Erişim başlangıcı */}
                        <marker id="leftArrowhead" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 10 0 L 0 5 L 10 10 z" fill={CONFIG.ACCENT_COLOR} />
                        </marker>
                    </defs>

                    {/* Main BME280 Box */}
                    <rect x="30" y="50" width="670" height="400" style={styles.boxStyle} />
                    <text x="365" y="80" style={styles.svgText}>BME280</text>

                    {/* SDA/SCL Inputs */}
                    <line x1="0" y1="120" x2="80" y2="120" style={styles.dataFlowArrow} />
                    <text x="55" y="110" style={styles.arrowText}>SDA</text>
                    <line x1="0" y1="140" x2="80" y2="140" style={styles.dataFlowArrow} />
                    <text x="55" y="130" style={styles.arrowText}>SCL</text>

                    {/* External Interface (I2C/SPI) */}
                    <rect x="80" y="100" width="120" height="60" style={styles.innerBoxStyle} />
                    <text x="140" y="125" style={styles.svgText}>Dijital</text>
                    <text x="140" y="145" style={styles.svgText}>Arayüz</text>

                    {/* Control Logic */}
                    <rect x="250" y="100" width="120" height="60" style={styles.innerBoxStyle} />
                    <text x="310" y="125" style={styles.svgText}>Kontrol</text>
                    <text x="310" y="145" style={styles.svgText}>Lojigi</text>

                    {/* Sensor Cores */}
                    <rect x="80" y="220" width="120" height="40" style={styles.innerBoxStyle} />
                    <text x="140" y="245" style={styles.svgText}>Sıcaklık Sensörü</text>

                    <rect x="80" y="280" width="120" height="40" style={styles.innerBoxStyle} />
                    <text x="140" y="305" style={styles.svgText}>Basınç Sensörü</text>

                    <rect x="80" y="340" width="120" height="40" style={styles.innerBoxStyle} />
                    <text x="140" y="365" style={styles.svgText}>Nem Sensörü</text>

                    {/* ADC */}
                    <rect x="250" y="280" width="120" height="60" style={styles.innerBoxStyle} />
                    <text x="310" y="305" style={styles.svgText}>ADC</text>
                    <text x="310" y="325" style={styles.smallText}>(Analog-Dijital Dönüştürücü)</text>

                    {/* Register Map */}
                    <rect x="450" y="100" width="220" height="280" style={styles.registerBoxStyle} />
                    <text x="560" y="125" style={styles.svgText}>Register Haritası</text>
                    <text x="560" y="145" style={styles.smallText}>(Veri & Konfigürasyon)</text>
                    {/* Register Map içi görselleştirme - BME280 datasheet'e uygun */}
                    {/* 1. satır: ID (0xD0) */}
                    <rect x="460" y="160" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="170" x2="660" y2="170" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="180" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>ID (0xD0)</text>
                    {/* 2. satır: RESET (0xE0) */}
                    <rect x="460" y="190" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="200" x2="660" y2="200" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="210" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>RESET (0xE0)</text>
                    {/* 3. satır: ctrl_hum (0xF2) */}
                    <rect x="460" y="220" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="230" x2="660" y2="230" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="240" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>ctrl_hum (0xF2)</text>
                    {/* 4. satır: status (0xF3) */}
                    <rect x="460" y="250" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="260" x2="660" y2="260" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="270" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>status (0xF3)</text>
                    {/* 5. satır: ctrl_meas (0xF4) */}
                    <rect x="460" y="280" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="290" x2="660" y2="290" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="300" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>ctrl_meas (0xF4)</text>
                    {/* 6. satır: config (0xF5) */}
                    <rect x="460" y="310" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="320" x2="660" y2="320" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="330" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>config (0xF5)</text>
                    {/* 7. satır: data (0xF7-0xFE) */}
                    <rect x="460" y="340" width="32" height="20" fill="#21262d" stroke="#58A6FF" strokeWidth="1" rx="3" />
                    <line x1="492" y1="350" x2="660" y2="350" stroke="#58A6FF" strokeWidth="1" />
                    <text x="500" y="360" style={{...styles.smallText, fontSize: '11px', textAnchor: 'start'}}>data (0xF7-0xFE)</text>

                    {/* Connections and Data Flow */}

                    {/* Digital Interface <-> Control Logic (Tek yönlü, veri/komut) */}
                    <line x1="200" y1="110" x2="250" y2="110" style={styles.dataFlowArrow} markerStart="url(#leftArrowhead)" />
                    <text x="225" y="100" style={styles.smallText}>Veri/Komut</text>

                    {/* Control Logic -> Sensor Cores (Kontrol) */}
                    {/* Kontrol Lojigi kutusunun alt kenarının ortasından çıkış */}
                    <line x1="310" y1="160" x2="310" y2="200" style={styles.lineStyle} />
                    {/* Sola yatay ana hat */}
                    <line x1="310" y1="200" x2="50" y2="200" style={styles.lineStyle} />
                    {/* Dikey ana hat (yeni boşlukta) */}
                    <line x1="50" y1="200" x2="50" y2="360" style={styles.lineStyle} />
                    {/* Yatay dallar: Sıcaklık, Basınç, Nem sensörlerinin sol kenarına (ok ucu ile) */}
                    <line x1="50" y1="240" x2="80" y2="240" style={styles.controlFlowArrow} />
                    <line x1="50" y1="300" x2="80" y2="300" style={styles.controlFlowArrow} />
                    <line x1="50" y1="360" x2="80" y2="360" style={styles.controlFlowArrow} />
                    {/* Kontrol etiketi */}
                    <text x="65" y="215" style={styles.smallText}>Kontrol</text>

                    {/* Sensor Cores -> ADC (Analog Veri) */}
                    {/* Sıcaklık Sensörü çıkışı */}
                    <line x1="200" y1="245" x2="230" y2="245" style={styles.analogLine} />
                    {/* Basınç Sensörü çıkışı */}
                    <line x1="200" y1="305" x2="230" y2="305" style={styles.analogLine} />
                    {/* Nem Sensörü çıkışı */}
                    <line x1="200" y1="365" x2="230" y2="365" style={styles.analogLine} />
                    {/* Üç çizginin birleştiği nokta ve oradan yukarıdan aşağıya ana hat */}
                    <line x1="230" y1="245" x2="230" y2="365" style={styles.analogLine} />
                    {/* Birleşim noktasından ADC'ye giden ana hat (ok ucu ile) */}
                    <line x1="230" y1="305" x2="250" y2="305" style={{...styles.analogLine, markerEnd: 'url(#dataArrowhead)'}} />
                    <text x="225" y="235" style={styles.smallText}>Analog Veri</text>

                    {/* ADC -> Register Map (Dijital Veri) */}
                    <line x1="370" y1="310" x2="450" y2="310" style={styles.dataFlowArrow} />
                    <text x="410" y="300" style={styles.smallText}>Dijital Veri</text>

                    {/* Control Logic <-> Register Map (Konfig./Durum) */}
                    <line x1="370" y1="130" x2="450" y2="130" style={styles.dataFlowArrow} markerEnd="url(#dataArrowhead)" markerStart="url(#leftArrowhead)" />
                    <text x="410" y="120" style={styles.smallText}>Konfig./Durum</text>

                    {/* Digital Interface <-> Register Map (Doğrudan Erişim) */}
                    <polyline points="200,150 210,150 210,170 40,170 40,430 560,430 560,380" style={{...styles.dataFlowArrow, markerEnd: 'url(#dataArrowhead)', markerStart: 'url(#leftArrowhead)'}} />
                    <text x="300" y="420" style={styles.smallText}>Doğrudan Erişim</text>

                </svg>
            </div>
            <p style={styles.description}>
                Bu diyagram, bir BME280 sensörünün iç yapısını ve I2C/SPI arayüzünün sensörün farklı fonksiyonel bloklarına nasıl eriştiğini görselleştirir. Sensör çekirdeklerinden gelen analog veriler ADC tarafından dijitale dönüştürülür ve Register Haritası üzerinden erişilebilir hale gelir. Kontrol Lojigi, tüm işlemleri yönetir ve Dijital Arayüz üzerinden dış dünya ile iletişim kurar.
            </p>
            <h2 style={styles.title}>Şekil 9.3 : Sensör Blok Diyagramı</h2>
        </div>
    );
}