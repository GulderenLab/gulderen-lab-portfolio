// src/components/I2CRepeatedStartDiagram.jsx
import React, { useState, useEffect, useCallback } from 'react';

// --- CONFIGURATION ---
const CONFIG = {
  Y_SCL: 50,
  Y_SDA: 130,
  SIGNAL_HEIGHT: 35,
  BIT_WIDTH: 35,
  PULSE_WIDTH: 25,
  START_STOP_WIDTH: 45,
  ACK_WIDTH: 40,
  // Colors
  BG_COLOR: '#1a1a2e',
  LINE_COLOR: 'rgba(255, 255, 255, 0.8)',
  LINE_BG_COLOR: 'rgba(255, 255, 255, 0.15)',
  SCL_COLOR: '#4a90e2', // Blue for Clock
  SDA_COLOR: '#50e3c2', // Teal for Data
  LABEL_COLOR: '#e0e0e0',
  HIGHLIGHT_COLOR: '#f8e71c', // Yellow for highlight
  ARROW_COLOR: '#e94560',   // Reddish for attention
};

// --- HELPER COMPONENTS ---

// Generic component for animating visibility
const AnimatedG = ({ isActive, onComplete, animationDuration, children, ...props }) => {
  useEffect(() => {
    if (isActive && onComplete) {
      const timer = setTimeout(onComplete, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete, animationDuration]);

  return (
    <g style={{ opacity: isActive ? 1 : 0, transition: `opacity 0.4s ease-in-out` }} {...props}>
      {children}
    </g>
  );
};

// Component for descriptive text above the diagram
const SignalText = ({ text }) => (
  <p style={{ 
    color: CONFIG.LABEL_COLOR, 
    fontSize: '1.1rem', 
    height: '40px',
    marginBottom: '1rem', 
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  }}>
    {text}
  </p>
);

// --- I2C EVENT COMPONENTS ---

const StartCondition = ({ ...props }) => (
  <AnimatedG {...props}>
    <path d={`M 0 ${CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH}`} stroke={CONFIG.SCL_COLOR} strokeWidth="2.5" fill="none" />
    <path d={`M 0 ${CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH/2} V ${CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH}`} stroke={CONFIG.SDA_COLOR} strokeWidth="2.5" fill="none" />
    <text x={CONFIG.START_STOP_WIDTH/2} y="20" fill={CONFIG.LABEL_COLOR} textAnchor="middle" fontSize="18">BAŞLA</text>
  </AnimatedG>
);

const StopCondition = ({ ...props }) => (
  <AnimatedG {...props}>
    <path d={`M 0 ${CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH}`} stroke={CONFIG.SCL_COLOR} strokeWidth="2.5" fill="none" />
    <path d={`M 0 ${CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH/2} V ${CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH}`} stroke={CONFIG.SDA_COLOR} strokeWidth="2.5" fill="none" />
    <text x={CONFIG.START_STOP_WIDTH/2} y="20" fill={CONFIG.LABEL_COLOR} textAnchor="middle" fontSize="18">DUR</text>
  </AnimatedG>
);

const RepeatedStartCondition = ({ ...props }) => (
    <AnimatedG {...props}>
        {/* Arrow and Highlight */}
        <path d={`M ${CONFIG.START_STOP_WIDTH/2},205 V 175 L ${CONFIG.START_STOP_WIDTH/2 - 5},185 M ${CONFIG.START_STOP_WIDTH/2},175 L ${CONFIG.START_STOP_WIDTH/2 + 5},185`} stroke={CONFIG.ARROW_COLOR} strokeWidth="2" fill="none" />
        <rect x={-10} y={15} width={CONFIG.START_STOP_WIDTH + 20} height={160} fill={CONFIG.ARROW_COLOR} fillOpacity="0.1" rx="8" />

        {/* Signal drawing (same as StartCondition) */}
        <path d={`M 0 ${CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH}`} stroke={CONFIG.SCL_COLOR} strokeWidth="2.5" fill="none" />
        <path d={`M 0 ${CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH/2} V ${CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.START_STOP_WIDTH}`} stroke={CONFIG.SDA_COLOR} strokeWidth="2.5" fill="none" />
        
        {/* Label */}
        <text x={CONFIG.START_STOP_WIDTH/2} y="210" fill={CONFIG.HIGHLIGHT_COLOR} textAnchor="middle" fontSize="20" fontWeight="bold">Tekrarlanan</text>
        <text x={CONFIG.START_STOP_WIDTH/2} y="235" fill={CONFIG.HIGHLIGHT_COLOR} textAnchor="middle" fontSize="20" fontWeight="bold">BAŞLAMA</text>
  </AnimatedG>
);

const AckNack = ({ type, ...props }) => {
  const isAck = type === 'ack';
  const sdaY = isAck ? CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT/2 : CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT/2;
  const label = isAck ? 'ACK' : 'NACK';
  
  return (
    <AnimatedG {...props}>
      <rect x={-5} y={CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT} width={CONFIG.ACK_WIDTH + 10} height={CONFIG.SIGNAL_HEIGHT * 4} fill="rgba(255,255,255,0.05)" rx="5" />
      
      {/* SCL Pulse */}
      <path d={`M 0 ${CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.PULSE_WIDTH/2} V ${CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT/2} H ${CONFIG.PULSE_WIDTH}`} stroke={CONFIG.SCL_COLOR} strokeWidth="2.5" fill="none" transform={`translate(${(CONFIG.ACK_WIDTH - CONFIG.PULSE_WIDTH)/2}, 0)`}/>
      
      {/* SDA Line */}
      <path d={`M 0 ${sdaY} H ${CONFIG.ACK_WIDTH}`} stroke={CONFIG.SDA_COLOR} strokeWidth="2.5" fill="none" />
      
      <text x={CONFIG.ACK_WIDTH/2} y="20" fill={CONFIG.LABEL_COLOR} textAnchor="middle" fontSize="18">{label}</text>
    </AnimatedG>
  );
};

const Byte = ({ bits, label, ...props }) => {
  const totalWidth = 8 * CONFIG.BIT_WIDTH;
  
  return (
    <AnimatedG {...props}>
      <rect x={-5} y={CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT - 10} width={totalWidth + 10} height={150} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" rx="8" />
      
      {[...bits].map((bit, i) => {
        const x = i * CONFIG.BIT_WIDTH;
        const sdaY = bit === '1' ? CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT/2 : CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT/2;
        const sdaPrevY = i === 0 
          ? sdaY 
          : (bits[i-1] === '1' ? CONFIG.Y_SDA - CONFIG.SIGNAL_HEIGHT/2 : CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT/2);

        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            {/* SCL Pulse: Yükselen ve inen kenar */}
            <path d={`M 0 ${CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT/2}
              H ${CONFIG.BIT_WIDTH/4}
              V ${CONFIG.Y_SCL - CONFIG.SIGNAL_HEIGHT/2}
              H ${3*CONFIG.BIT_WIDTH/4}
              V ${CONFIG.Y_SCL + CONFIG.SIGNAL_HEIGHT/2}
              H ${CONFIG.BIT_WIDTH}`}
              stroke={CONFIG.SCL_COLOR} strokeWidth="2.5" fill="none" />
            {/* SDA Bit */}
            <path d={`M 0 ${sdaPrevY} V ${sdaY} H ${CONFIG.BIT_WIDTH}`} stroke={CONFIG.SDA_COLOR} strokeWidth="2.5" fill="none" />

            {/* Bit Value Text */}
            <text x={CONFIG.BIT_WIDTH/2} y={CONFIG.Y_SDA + CONFIG.SIGNAL_HEIGHT + 15} fill={CONFIG.LABEL_COLOR} textAnchor="middle" fontSize="18">{bit}</text>
          </g>
        );
      })}

      <text x={totalWidth / 2} y="20" fill={CONFIG.LABEL_COLOR} textAnchor="middle" fontSize="18" fontWeight="bold">{label}</text>
    </AnimatedG>
  );
};


// --- MAIN COMPONENT ---
export default function I2CRepeatedStartDiagram() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const sequence = [
    { id: 1, Component: StartCondition, width: CONFIG.START_STOP_WIDTH, duration: 2000, description: "1. İletişim BAŞLA koşulu ile başlar." },
    { id: 2, Component: Byte, props: { bits: '01101000', label: 'Adres + R/W=0 (Yazma)' }, width: 8 * CONFIG.BIT_WIDTH, duration: 2500, description: "2. Master, Slave adresini ve Yazma bitini (0) gönderir." },
    { id: 3, Component: AckNack, props: { type: 'ack' }, width: CONFIG.ACK_WIDTH, duration: 2000, description: "3. Slave, adresi aldığını ACK ile onaylar." },
    { id: 4, Component: Byte, props: { bits: '00011101', label: 'Veri Baytı (Register Adresi)' }, width: 8 * CONFIG.BIT_WIDTH, duration: 2500, description: "4. Master, okunacak Register'ın adresini gönderir." },
    { id: 5, Component: AckNack, props: { type: 'ack' }, width: CONFIG.ACK_WIDTH, duration: 2000, description: "5. Slave, Register adresini aldığını ACK ile onaylar." },
    { id: 6, Component: RepeatedStartCondition, width: CONFIG.START_STOP_WIDTH, duration: 2500, description: "6. Master, DURMA göndermeden Tekrarlanan BAŞLAMA koşulu oluşturur." },
    { id: 7, Component: Byte, props: { bits: '01101001', label: 'Adres + R/W=1 (Okuma)' }, width: 8 * CONFIG.BIT_WIDTH, duration: 2500, description: "7. Master, aynı Slave adresini ve Okuma bitini (1) gönderir." },
    { id: 8, Component: AckNack, props: { type: 'ack' }, width: CONFIG.ACK_WIDTH, duration: 2000, description: "8. Slave, okuma isteğini aldığını ACK ile onaylar." },
    { id: 9, Component: Byte, props: { bits: '10110101', label: "Veri Baytı (Slave'den)" }, width: 8 * CONFIG.BIT_WIDTH, duration: 2500, description: "9. Slave, istenen Register'daki veriyi Master'a gönderir." },
    { id: 10, Component: AckNack, props: { type: 'nack' }, width: CONFIG.ACK_WIDTH, duration: 2000, description: "10. Master, okumayı bitirdiğini NACK ile bildirir." },
    { id: 11, Component: StopCondition, width: CONFIG.START_STOP_WIDTH, duration: 2000, description: "11. Master, iletişimi DURMA koşulu ile sonlandırır." },
  ];

  const handleStart = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    if (currentStep >= sequence.length - 1) {
      setCurrentStep(-1); // Reset for replay
      setTimeout(() => setCurrentStep(0), 100);
    } else {
      setCurrentStep(0);
    }
  }, [isPlaying, currentStep, sequence.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  const handleStepComplete = useCallback(() => {
    if (currentStep < sequence.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, sequence.length]);

  const totalWidth = sequence.reduce((sum, item) => sum + item.width, 0) + 120; // Add padding

  return (
    <div style={{ margin: '2rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
      <SignalText text={sequence[currentStep]?.description || 'Animasyonu başlatmak için oynat tuşuna basın.'} />
      <div style={{ width: '100%', backgroundColor: CONFIG.BG_COLOR, borderRadius: '12px', padding: '2rem 1rem', border: `1px solid ${CONFIG.LINE_BG_COLOR}` }}>
        <svg width="100%" viewBox={`0 0 ${totalWidth} 240`}>
          {/* Background Timeline */}
          <line x1="0" y1={CONFIG.Y_SCL} x2={totalWidth} y2={CONFIG.Y_SCL} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" />
          <text x="15" y={CONFIG.Y_SCL} fill={CONFIG.LABEL_COLOR} fontSize="16" alignmentBaseline="middle">SCL</text>
          <line x1="0" y1={CONFIG.Y_SDA} x2={totalWidth} y2={CONFIG.Y_SDA} stroke={CONFIG.LINE_BG_COLOR} strokeWidth="1" />
          <text x="15" y={CONFIG.Y_SDA} fill={CONFIG.LABEL_COLOR} fontSize="16" alignmentBaseline="middle">SDA</text>
          
          {(() => {
            let currentX = 50; // Start with some padding
            return sequence.map((item, index) => {
              const { Component, props, width, duration } = item;
              const x = currentX;
              currentX += width;
              return (
                <g key={item.id} transform={`translate(${x}, 0)`}>
                  <Component 
                    {...props} 
                    isActive={index <= currentStep} 
                    animationDuration={duration}
                    onComplete={index === currentStep && isPlaying ? handleStepComplete : undefined} 
                  />
                </g>
              );
            });
          })()}
        </svg>
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handleStart} disabled={isPlaying} style={{
          padding: '10px 20px', borderRadius: '25px', border: 'none', 
          background: isPlaying ? '#555' : 'linear-gradient(45deg, #4a90e2, #50e3c2)', 
          color: 'white', cursor: isPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold',
          transition: 'all 0.3s'
        }}>
          {isPlaying ? 'Oynatılıyor...' : (currentStep >= sequence.length - 1 ? '🔄 Tekrar Oynat' : '▶️ Animasyonu Başlat')}
        </button>
        <button onClick={handleReset} style={{
          padding: '10px 20px', borderRadius: '25px', border: `1px solid ${CONFIG.LABEL_COLOR}`, 
          background: 'transparent', color: CONFIG.LABEL_COLOR, cursor: 'pointer', fontWeight: 'bold',
          transition: 'all 0.3s'
        }}>
          ⏹️ Sıfırla
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: '1em', color: '#fff', marginTop: '2rem', fontWeight: 'bold' }}>
        Şekil 5.3: Tekrarlanan BAŞLAMA (Repeated START) Kullanımı
      </p>
    </div>
  );
}