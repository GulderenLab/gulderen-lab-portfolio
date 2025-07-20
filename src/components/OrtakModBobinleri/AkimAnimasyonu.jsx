import React, { useState, useEffect } from 'react';

const CONFIG = {
  WIDTH: 1000,
  HEIGHT: 600,
  BG_COLOR: '#0a0a0a',
  WIRE_COLOR: '#FFFFFF',
  CURRENT_COLOR: '#00D4FF',
  RETURN_COLOR: '#FF6B35',
  CORE_COLOR: '#666666',
  FIELD_COLOR: '#4CAF50',
  CANCEL_COLOR: '#FF4444',
  TEXT_COLOR: '#E0E0E0',
  ACCENT_COLOR: '#FFD700',
};

const ANIMATION_DURATION = "3s";

// ANIMATION_DURATION'ı milisaniyeye çeviren yardımcı fonksiyon
function parseDuration(durationStr) {
  if (typeof durationStr === "string" && durationStr.endsWith("s")) {
    return parseFloat(durationStr) * 1000;
  }
  return 3000; // fallback
}

const MagneticField = ({ x, y, direction, strength = 1, animated = true, duration = ANIMATION_DURATION }) => {
  const circles = [];
  const fieldColor = direction === 'into' ? '#FF6B35' : '#4CAF50';
  
  for (let i = 0; i < 5; i++) {
    const radius = 15 + i * 8;
    const opacity = (5 - i) * 0.15 * strength;
    
    circles.push(
      <circle
        key={i}
        cx={x}
        cy={y}
        r={radius}
        fill="none"
        stroke={fieldColor}
        strokeWidth="2"
        opacity={opacity}
        strokeDasharray="5,5"
      >
        {animated && (
          <animate
            attributeName="r"
            values={`${radius};${radius + 5};${radius}`}
            dur={duration}
            repeatCount="indefinite"
          />
        )}
      </circle>
    );
  }
  
  return (
    <g>
      {circles}
      <circle
        cx={x}
        cy={y}
        r="8"
        fill={fieldColor}
        opacity="0.8"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        {direction === 'into' ? '⊗' : '⊙'}
      </text>
    </g>
  );
};

const AnimatedCurrent = ({ pathId, color, count = 4, duration = "3s", inverted = false }) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const start = 0.1 + (i * 0.7 / (count - 1));
    const end = start + 0.15;
    particles.push(
      <circle key={i} r="6" fill={color} filter="url(#glow)">
        <animateMotion
          dur={duration}
          repeatCount="indefinite"
          keyPoints={inverted ? "1;0;1" : "0;1;0"}
          keyTimes="0;0.5;1"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    );
  }
  return <g>{particles}</g>;
};

const EducationalPanel = ({ phase }) => {
  const content = {
    normal: {
      title: "Normal Çalışma Durumu",
      points: [
        "Giden akım (I₁) ve dönen akım (I₂) eşit büyüklükte",
        "Akımlar zıt yönlerde akar",
        "Her bobin kendi manyetik alanını oluşturur",
        "Manyetik alanlar birbirini sönümler (B₁ + B₂ = 0)",
        "Bobin düşük empedans gösterir"
      ],
      color: CONFIG.FIELD_COLOR
    }
  };
  
  const current = content[phase] || content.normal;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      border: `2px solid ${current.color}`,
      borderRadius: '15px',
      padding: '1.5rem',
      margin: '1rem 0',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <h3 style={{
        color: current.color,
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        {current.title}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.5rem'
      }}>
        {current.points.map((point, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            color: CONFIG.TEXT_COLOR,
            fontSize: '14px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: current.color,
              borderRadius: '50%',
              marginRight: '0.5rem',
              flexShrink: 0
            }}></span>
            {point}
          </div>
        ))}
      </div>
    </div>
  );
};

// Daha gerçekçi bobin için sinusoidal path fonksiyonu
function generateCoilPath({ xStart, y, length, amplitude, turns, direction = 1 }) {
  const points = [];
  const steps = turns * 20;
  const step = length / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xStart + i * step;
    const angle = (i / steps) * turns * 2 * Math.PI;
    const yOffset = Math.sin(angle) * amplitude * direction;
    points.push(`${x},${y + yOffset}`);
  }
  return 'M ' + points.join(' L ');
}

export default function OrtakModSokBobiniEgitici() {
  // Faz state'i: gerçek zamanlı hesaplanacak
  const [phase, setPhase] = useState(0);
  const animationStartRef = React.useRef(Date.now());
  useEffect(() => {
    let frameId;
    const ANIMATION_DURATION_MS = parseDuration(ANIMATION_DURATION);
    const updatePhase = () => {
      const elapsed = Date.now() - animationStartRef.current;
      // Her yarı turda faz değişsin
      const phaseNow = Math.floor((elapsed / (ANIMATION_DURATION_MS / 2)) % 2);
      setPhase(phaseNow);
      frameId = requestAnimationFrame(updatePhase);
    };
    frameId = requestAnimationFrame(updatePhase);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Manyetik alan yön ve etiketleri (faz ile tam senkron)
  const topFieldDirection = phase === 0 ? "into" : "out";
  const bottomFieldDirection = phase === 0 ? "out" : "into";
  const topFieldLabel = phase === 0 ? "B₁ (İçeri)" : "B₁ (Dışarı)";
  const bottomFieldLabel = phase === 0 ? "B₂ (Dışarı)" : "B₂ (İçeri)";
  // Yazı renkleri: Dışarı yazarken yeşil, İçeri yazarken turuncu
  const getFieldColor = (label) => label.includes("Dışarı") ? "#4CAF50" : "#FF6B35";
  const topFieldColor = getFieldColor(topFieldLabel);
  const bottomFieldColor = getFieldColor(bottomFieldLabel);
  // Ana devre yolları (bobin ortasından geçmeyen, ikiye bölünmüş)
  const topLeftPath = "M 100 200 L 400 200";
  const topRightPath = "M 600 200 L 800 200";
  const bottomLeftPath = "M 100 400 L 400 400";
  const bottomRightPath = "M 600 400 L 800 400";
  // Bobin spiral parametreleri
  const spiralStartX = 400;
  const spiralEndX = 600;
  const spiralLength = spiralEndX - spiralStartX;
  const topY = 200;
  const bottomY = 400;
  // Bobin spiral yolları
  const topCoilPath = generateCoilPath({ xStart: spiralStartX, y: topY, length: spiralLength, amplitude: 18, turns: 7, direction: 1 });
  const bottomCoilPath = generateCoilPath({ xStart: spiralStartX, y: bottomY, length: spiralLength, amplitude: 18, turns: 7, direction: -1 });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
      color: CONFIG.TEXT_COLOR,
      padding: '2rem',
      borderRadius: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(45deg, #00D4FF, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          Ortak Mod Şok Bobini
        </h1>
        <p style={{ fontSize: '16px', opacity: '0.8' }}>
          Normal Çalışma Durumu - Diferansiyel Mod
        </p>
      </div>
      <svg width="100%" height="600" viewBox="0 0 1000 600">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <path id="top-left-path" d={topLeftPath} />
          <path id="top-right-path" d={topRightPath} />
          <path id="bottom-left-path" d={bottomLeftPath} />
          <path id="bottom-right-path" d={bottomRightPath} />
          <path id="top-coil-spiral" d={topCoilPath} />
          <path id="bottom-coil-spiral" d={bottomCoilPath} />
          
          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#888" />
            <stop offset="100%" stopColor="#444" />
          </linearGradient>
        </defs>

        {/* Ferrit Çekirdek */}
        <rect x="380" y="250" width="240" height="100" rx="10" 
              fill="url(#coreGradient)" 
              stroke="#999" 
              strokeWidth="2"/>
        <text x="500" y="240" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold">
          FERRİT ÇEKİRDEK
        </text>

        {/* Kaynak */}
        <rect x="50" y="280" width="80" height="40" rx="5" 
              fill={`${CONFIG.CURRENT_COLOR}30`} 
              stroke={CONFIG.CURRENT_COLOR} 
              strokeWidth="2"/>
        <text x="90" y="305" fill={CONFIG.CURRENT_COLOR} textAnchor="middle" fontSize="14" fontWeight="bold">
          KAYNAK
        </text>

        {/* Yük */}
        <rect x="820" y="280" width="80" height="40" rx="5" 
              fill={`${CONFIG.RETURN_COLOR}30`} 
              stroke={CONFIG.RETURN_COLOR} 
              strokeWidth="2"/>
        <text x="860" y="305" fill={CONFIG.RETURN_COLOR} textAnchor="middle" fontSize="14" fontWeight="bold">
          YÜK
        </text>

        {/* Ana tel bağlantıları (bobin ortasından geçmeyen) */}
        <path d={topLeftPath} stroke={CONFIG.WIRE_COLOR} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d={topRightPath} stroke={CONFIG.WIRE_COLOR} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d={bottomLeftPath} stroke={CONFIG.WIRE_COLOR} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d={bottomRightPath} stroke={CONFIG.WIRE_COLOR} strokeWidth="4" fill="none" strokeLinecap="round"/>

        {/* Bobin spiral sargıları */}
        <path d={topCoilPath} stroke={CONFIG.WIRE_COLOR} strokeWidth="6" fill="none" filter="url(#glow)" />
        <path d={bottomCoilPath} stroke={CONFIG.WIRE_COLOR} strokeWidth="6" fill="none" filter="url(#glow)" />

        {/* Bobin çekirdek çizgileri */}

        {/* Akım yönü noktaları */}

        {/* Manyetik alanlar */}
        <MagneticField x={500} y={200} direction={topFieldDirection} duration={ANIMATION_DURATION} />
        <MagneticField x={500} y={400} direction={bottomFieldDirection} duration={ANIMATION_DURATION} />

        {/* Akım animasyonları */}
        <AnimatedCurrent pathId="top-coil-spiral" color={CONFIG.CURRENT_COLOR} count={4} duration={ANIMATION_DURATION} inverted={false} />
        <AnimatedCurrent pathId="bottom-coil-spiral" color={CONFIG.RETURN_COLOR} count={4} duration={ANIMATION_DURATION} inverted={true} />

        {/* Bobin giriş/çıkış uçlarında ileri-geri hareket eden toplar */}
        <AnimatedCurrent pathId="top-left-path" color={CONFIG.CURRENT_COLOR} count={1} duration={ANIMATION_DURATION} inverted={false} />
        <AnimatedCurrent pathId="top-right-path" color={CONFIG.CURRENT_COLOR} count={1} duration={ANIMATION_DURATION} inverted={false} />
        <AnimatedCurrent pathId="bottom-left-path" color={CONFIG.RETURN_COLOR} count={1} duration={ANIMATION_DURATION} inverted={true} />
        <AnimatedCurrent pathId="bottom-right-path" color={CONFIG.RETURN_COLOR} count={1} duration={ANIMATION_DURATION} inverted={true} />

        {/* Spiral bobin giriş ve çıkış noktaları (üst) */}
        <circle cx={spiralStartX} cy={topY} r="7" fill="#fff" />
        <circle cx={spiralEndX} cy={topY} r="7" fill="#fff" />
        {/* Spiral bobin giriş ve çıkış noktaları (alt) */}
        <circle cx={spiralStartX} cy={bottomY} r="7" fill="#fff" />
        <circle cx={spiralEndX} cy={bottomY} r="7" fill="#fff" />

        {/* Akım etiketleri */}
        <text x="250" y="180" fill={CONFIG.CURRENT_COLOR} fontSize="18" fontWeight="bold">
          I₁ (Giden Akım)
        </text>
        <text x="250" y="430" fill={CONFIG.RETURN_COLOR} fontSize="18" fontWeight="bold">
          I₂ (Dönen Akım)
        </text>

        {/* Manyetik alan etiketleri */}
        <text x="450" y="150" fill={topFieldColor} fontSize="16" fontWeight="bold" textAnchor="middle">
          {topFieldLabel}
        </text>
        <text x="450" y="460" fill={bottomFieldColor} fontSize="16" fontWeight="bold" textAnchor="middle">
          {bottomFieldLabel}
        </text>

        {/* Sönümleme göstergesi */}
        <g>
          <circle cx="500" cy="300" r="40" fill="none" stroke={CONFIG.CANCEL_COLOR} strokeWidth="3" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" values="0;10;0"/>
          </circle>
          <text x="500" y="290" fill={CONFIG.CANCEL_COLOR} fontSize="14" fontWeight="bold" textAnchor="middle">
            B₁ + B₂ = 0
          </text>
          <text x="500" y="305" fill={CONFIG.CANCEL_COLOR} fontSize="12" textAnchor="middle">
            (Sönümleme)
          </text>
          <text x="500" y="320" fill={CONFIG.CANCEL_COLOR} fontSize="12" textAnchor="middle">
            Net Alan = 0
          </text>
        </g>

        {/* Akım büyüklüğü göstergesi */}
        <text x="750" y="180" fill={CONFIG.CURRENT_COLOR} fontSize="16" fontWeight="bold">
          |I₁| = |I₂|
        </text>
        <text x="750" y="200" fill={CONFIG.TEXT_COLOR} fontSize="12">
          (Eşit büyüklük)
        </text>

        {/* Faz göstergesi */}
        <text x="750" y="430" fill={CONFIG.RETURN_COLOR} fontSize="16" fontWeight="bold">
          φ = 180°
        </text>
        <text x="750" y="450" fill={CONFIG.TEXT_COLOR} fontSize="12">
          (Zıt faz)
        </text>

        {/* Empedans göstergesi */}
        <rect x="50" y="50" width="200" height="80" rx="10" 
              fill={`${CONFIG.FIELD_COLOR}20`} 
              stroke={CONFIG.FIELD_COLOR} 
              strokeWidth="2"/>
        <text x="150" y="75" fill={CONFIG.FIELD_COLOR} fontSize="16" fontWeight="bold" textAnchor="middle">
          Düşük Empedans
        </text>
        <text x="150" y="95" fill={CONFIG.TEXT_COLOR} fontSize="12" textAnchor="middle">
          Normal sinyal geçişi
        </text>
        <text x="150" y="110" fill={CONFIG.TEXT_COLOR} fontSize="12" textAnchor="middle">
          Z ≈ 0 Ω
        </text>

        {/* Frekans bilgisi */}
        <rect x="750" y="50" width="200" height="80" rx="10" 
              fill={`${CONFIG.ACCENT_COLOR}20`} 
              stroke={CONFIG.ACCENT_COLOR} 
              strokeWidth="2"/>
        <text x="850" y="75" fill={CONFIG.ACCENT_COLOR} fontSize="16" fontWeight="bold" textAnchor="middle">
          Diferansiyel Mod
        </text>
        <text x="850" y="95" fill={CONFIG.TEXT_COLOR} fontSize="12" textAnchor="middle">
          Sinyal iletimi
        </text>
        <text x="850" y="110" fill={CONFIG.TEXT_COLOR} fontSize="12" textAnchor="middle">
          Normal çalışma
        </text>
      </svg>

      <EducationalPanel phase={phase} />

      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
        border: '2px solid #333',
        borderRadius: '15px',
        padding: '1.5rem',
        marginTop: '1rem'
      }}>
        <h4 style={{
          color: CONFIG.ACCENT_COLOR,
          marginBottom: '1rem',
          fontSize: '16px'
        }}>
          Önemli Noktalar:
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h5 style={{ color: CONFIG.CURRENT_COLOR, marginBottom: '0.5rem' }}>
              Akım Özellikleri
            </h5>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: CONFIG.TEXT_COLOR, fontSize: '14px' }}>
              <li>Giden ve dönen akımlar eşit büyüklükte</li>
              <li>180° faz farkı (zıt yönler)</li>
              <li>Sürekli akım döngüsü</li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: CONFIG.FIELD_COLOR, marginBottom: '0.5rem' }}>
              Manyetik Alan
            </h5>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: CONFIG.TEXT_COLOR, fontSize: '14px' }}>
              <li>Her bobin kendi manyetik alanını oluşturur</li>
              <li>Alanlar zıt yönlerde</li>
              <li>Net manyetik alan sıfır</li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: CONFIG.CANCEL_COLOR, marginBottom: '0.5rem' }}>
              Sonuç
            </h5>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: CONFIG.TEXT_COLOR, fontSize: '14px' }}>
              <li>Bobin düşük empedans gösterir</li>
              <li>Normal sinyal geçişi sağlanır</li>
              <li>Diferansiyel mod korunur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}