import React from 'react';

// --- STYLES ---
const styles = {
    container: {
        margin: '2rem auto',
        padding: '1.5rem',
        backgroundColor: '#0D1117',
        borderRadius: '16px',
        border: '1px solid #30363d',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
    },
    title: {
        color: '#C9D1D9',
        margin: '0 0 1.5rem 0',
        fontWeight: 600,
        fontSize: '22px',
        textAlign: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#C9D1D9',
    },
    th: {
        backgroundColor: '#161b22',
        padding: '12px 15px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        borderBottom: '2px solid #30363d',
    },
    td: {
        padding: '10px 15px',
        borderBottom: '1px solid #30363d',
        fontSize: '14px',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    tdAddress: { fontFamily: 'monospace', color: '#58A6FF', fontWeight: 'bold' },
    tdContent: { textAlign: 'left', fontWeight: '500' },
    bitContainer: {
        display: 'flex',
        width: '100%',
        height: '40px',
        border: '1px solid #444c56',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    bitSegment: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        fontSize: '11px',
        fontWeight: 'bold',
        borderLeft: '1px solid #444c56',
    },
    bitLabel: { fontSize: '10px', opacity: 0.7, marginTop: '2px' },
    notesContainer: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #30363d' },
    notesTitle: { color: '#C9D1D9', fontSize: '16px', fontWeight: '600', marginBottom: '1rem' },
    notesList: { listStyle: 'disc', paddingLeft: '20px', margin: 0, color: '#8B949E', fontSize: '14px' },
};

const bitTypeStyles = {
    control: { backgroundColor: 'rgba(248, 81, 73, 0.2)', color: '#ff7b72' },
    bcd_high: { backgroundColor: 'rgba(88, 166, 255, 0.2)', color: '#79c0ff' },
    bcd_low: { backgroundColor: 'rgba(88, 166, 255, 0.1)', color: '#79c0ff' },
    value: { backgroundColor: 'rgba(63, 185, 80, 0.2)', color: '#56d364' },
    unused: { backgroundColor: 'rgba(139, 148, 158, 0.1)', color: '#8B949E' },
};

// --- DATA ---
const memoryMapData = [
    { address: '0x00', content: 'Saniye', format: 'BCD', bits: [{ l: 'CH', s: 1, t: 'control' }, { l: '10s', s: 3, t: 'bcd_high' }, { l: '1s', s: 4, t: 'bcd_low' }] },
    { address: '0x01', content: 'Dakika', format: 'BCD', bits: [{ l: '0', s: 1, t: 'unused' }, { l: '10m', s: 3, t: 'bcd_high' }, { l: '1m', s: 4, t: 'bcd_low' }] },
    { address: '0x02', content: 'Saat', format: 'BCD', bits: [{ l: '0', s: 1, t: 'unused' }, { l: '12/24', s: 1, t: 'control' }, { l: '10h/AP', s: 2, t: 'bcd_high' }, { l: '1h', s: 4, t: 'bcd_low' }] },
    { address: '0x03', content: 'Gün (haftanın)', format: 'Sayısal', bits: [{ l: '0', s: 5, t: 'unused' }, { l: 'Gün', s: 3, t: 'value' }] },
    { address: '0x04', content: 'Tarih (ayın)', format: 'BCD', bits: [{ l: '0', s: 2, t: 'unused' }, { l: '10d', s: 2, t: 'bcd_high' }, { l: '1d', s: 4, t: 'bcd_low' }] },
    { address: '0x05', content: 'Ay & Yüzyıl', format: 'BCD', bits: [{ l: 'C', s: 1, t: 'control' }, { l: '0', s: 2, t: 'unused' }, { l: '10M', s: 1, t: 'bcd_high' }, { l: '1M', s: 4, t: 'bcd_low' }] },
    { address: '0x06', content: 'Yıl', format: 'BCD', bits: [{ l: '10y', s: 4, t: 'bcd_high' }, { l: '1y', s: 4, t: 'bcd_low' }] },
];

// --- HELPER COMPONENT for BITS ---
const BitDisplay = ({ bits }) => (
    <div style={styles.bitContainer}>
        {bits.map((bit, index) => (
            <div key={index} style={{
                ...styles.bitSegment,
                ...bitTypeStyles[bit.t],
                flexGrow: bit.s,
                borderLeft: index === 0 ? 'none' : styles.bitSegment.borderLeft,
            }}>
                <span>{bit.l}</span>
            </div>
        ))}
    </div>
);

// --- MAIN COMPONENT ---
export default function RTCMemoryMapEnhanced() {
    return (
        <div style={styles.container}>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '15%'}}>Register</th>
                            <th style={{...styles.th, width: '20%', textAlign: 'left'}}>İçerik</th>
                            <th style={{...styles.th, width: '50%'}}>Bit Dağılımı (7 → 0)</th>
                            <th style={{...styles.th, width: '15%'}}>Format</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memoryMapData.map((item) => (
                            <tr key={item.address}>
                                <td style={{...styles.td, ...styles.tdAddress}}>{item.address}</td>
                                <td style={{...styles.td, ...styles.tdContent}}>{item.content}</td>
                                <td style={styles.td}><BitDisplay bits={item.bits} /></td>
                                <td style={styles.td}>{item.format}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.notesContainer}>
                <h3 style={styles.notesTitle}>Açıklamalar</h3>
                <ul style={styles.notesList}>
                    <li><b>Bit Dağılımı:</b> Bu sütun, her bir 8-bitlik register'ın iç yapısını gösterir. Renkler bitlerin işlevini belirtir: <span style={bitTypeStyles.control}>Kontrol</span>, <span style={bitTypeStyles.bcd_high}>BCD (Yüksek)</span>, <span style={bitTypeStyles.bcd_low}>BCD (Düşük)</span>, <span style={bitTypeStyles.value}>Sayısal</span>, ve <span style={bitTypeStyles.unused}>Kullanılmayan</span>.</li>
                    <li><b>BCD (Binary-Coded Decimal):</b> Her 4 bitlik grup (nibble), bir ondalık basamağı temsil eder. Örneğin, `35` sayısı BCD'de `0011 0101` olarak kodlanır. Bu, mikrokontrolcülerin insan tarafından okunabilir sayılarla doğrudan çalışmasını kolaylaştırır.</li>
                    <li><b>Kontrol Bitleri:</b> `CH` (Clock Halt) osilatörü durdurur, `12/24` saat modunu değiştirir ve `C` (Century) yüzyıl değişikliğini işaret eder. Bu bitleri değiştirmek için bit maskeleme işlemleri gerekir.</li>
                </ul>
                <h4 style={{...styles.title, fontSize: '16px', marginTop: '2rem', marginBottom: '0'}}>Şekil 9.2: RTC Register ve Bit Dağılımı</h4>
            </div>
        </div>
    );
}
