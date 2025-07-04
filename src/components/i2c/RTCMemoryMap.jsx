import React from 'react';

// --- STYLES --- 
const styles = {
    container: {
        margin: '2rem auto',
        padding: '1.5rem',
        backgroundColor: '#01041B',
        borderRadius: '16px',
        border: '1px solid rgba(139, 148, 158, 0.2)',
        fontFamily: 'sans-serif',
    },
    title: {
        color: '#C9D1D9',
        margin: '0 0 1.5rem 0',
        fontWeight: 500,
        fontSize: '20px',
        textAlign: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#C9D1D9',
    },
    th: {
        backgroundColor: 'rgba(88, 166, 255, 0.2)',
        padding: '12px 15px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        borderBottom: '2px solid rgba(88, 166, 255, 0.4)',
    },
    td: {
        padding: '10px 15px',
        borderBottom: '1px solid rgba(139, 148, 158, 0.2)',
        fontSize: '14px',
    },
    tdAddress: {
        fontFamily: 'monospace',
        color: '#58A6FF',
        fontWeight: 'bold',
    },
    tdFormat: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#8B949E',
    },
    groupTime: { backgroundColor: 'rgba(0, 242, 255, 0.05)' },
    groupDay: { backgroundColor: 'rgba(255, 255, 0, 0.05)' },
    groupDate: { backgroundColor: 'rgba(63, 185, 80, 0.05)' },
    notesContainer: {
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(139, 148, 158, 0.2)',
    },
    notesTitle: {
        color: '#C9D1D9',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '1rem',
    },
    notesList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        color: '#8B949E',
        fontSize: '14px',
    },
    noteItem: {
        marginBottom: '0.5rem',
    },
    noteAddress: {
        fontFamily: 'monospace',
        color: '#58A6FF',
        fontWeight: 'bold',
    }
};

// --- DATA ---
const memoryMapData = [
    { address: '0x00', content: 'Saniye', format: '00–59 (BCD)', group: 'groupTime' },
    { address: '0x01', content: 'Dakika', format: '00–59 (BCD)', group: 'groupTime' },
    { address: '0x02', content: 'Saat', format: '00–23 veya 01–12 (BCD)', group: 'groupTime' },
    { address: '0x03', content: 'Gün (haftanın)', format: '1–7 (BCD)', group: 'groupDay' },
    { address: '0x04', content: 'Tarih (ayın)', format: '01–31 (BCD)', group: 'groupDate' },
    { address: '0x05', content: 'Ay & Yüzyıl', format: '01–12 (BCD) + Century Flag', group: 'groupDate' },
    { address: '0x06', content: 'Yıl', format: '00–99 (BCD)', group: 'groupDate' },
];

// --- COMPONENT ---
export default function RTCMemoryMap() {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>İmaj 9.2: RTC Register Haritası</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Register Adresi</th>
                            <th style={styles.th}>İçerik</th>
                            <th style={{...styles.th, textAlign: 'center'}}>Format</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memoryMapData.map((item, index) => (
                            <tr key={index} style={styles[item.group]}>
                                <td style={{...styles.td, ...styles.tdAddress}}>{item.address}</td>
                                <td style={styles.td}>{item.content}</td>
                                <td style={{...styles.td, ...styles.tdFormat}}>{item.format}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.notesContainer}>
                <h3 style={styles.notesTitle}>Register Notları</h3>
                <ul style={styles.notesList}>
                    <li style={styles.noteItem}><b style={{color: '#58A6FF'}}>Format:</b> Tüm veriler, donanım seviyesinde verimli olan BCD (Binary-Coded Decimal) formatında saklanır.</li>
                    <li style={styles.noteItem}><b style={{color: '#58A6FF'}}>Özel Bitler:</b> Register'lar sadece zaman/tarih verisini değil, aynı zamanda kontrol bitlerini de (örneğin `0x05` adresindeki Yüzyıl bayrağı veya `0x00` adresindeki Clock Halt biti) içerebilir.</li>
                </ul>
            </div>
        </div>
    );
}
