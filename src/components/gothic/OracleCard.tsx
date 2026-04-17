'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface OracleCardProps {
  className?: string;
}

type FortuneCategory = 'Amor' | 'Destino' | 'Misterio' | 'Esperanza' | 'Pasión';
type CardState = 'face-down' | 'revealing' | 'revealed';

interface Fortune {
  text: string;
  category: FortuneCategory;
}

// ─── Fortune Data (22 gothic-romantic fortunes) ───
const FORTUNES: Fortune[] = [
  {
    text: 'El laberinto del amor tiene una salida: está escrita en tus ojos.',
    category: 'Amor',
  },
  {
    text: 'Los ecos del pasado te guían hacia un destino que ya fue escrito con tinta de luna.',
    category: 'Destino',
  },
  {
    text: 'Una flor crecerá entre las ruinas de lo que una vez fue — y será más hermosa que el jardín original.',
    category: 'Esperanza',
  },
  {
    text: 'El velo entre mundos se desvanece en la medianoche: aquello que buscas ya te ha encontrado.',
    category: 'Misterio',
  },
  {
    text: 'No temas las sombras que caminan contigo; son los fantasmas de los besos que aún no has dado.',
    category: 'Pasión',
  },
  {
    text: 'Tu corazón es una catedral en ruinas donde aún resuena un canto antiguo de amor.',
    category: 'Amor',
  },
  {
    text: 'El río del destino no se detiene, pero sus aguas llevan pétalos de rosas hacia tu orilla.',
    category: 'Destino',
  },
  {
    text: 'En la oscuridad más profunda, una vela arde: es tu esperanza, y nadie podrá apagarla.',
    category: 'Esperanza',
  },
  {
    text: 'Las estrellas escriben tu nombre en un idioma que solo el alma puede leer.',
    category: 'Misterio',
  },
  {
    text: 'El fuego que arde en tu pecho no es dolor — es la pasión de mil vidas reclaimándose.',
    category: 'Pasión',
  },
  {
    text: 'Quien te ama en silencio te hablará en sueños; escucha con el corazón cerrado.',
    category: 'Amor',
  },
  {
    text: 'Tu camino está tejido con hilos de oro y sangre: cada paso es una elección del destino.',
    category: 'Destino',
  },
  {
    text: 'Después de la tormenta, el espejismo se convierte en realidad: lo imposible se hará presente.',
    category: 'Esperanza',
  },
  {
    text: 'Un secreto ancestral espera ser descubierto bajo la losa de tu doubts más antiguos.',
    category: 'Misterio',
  },
  {
    text: 'Los labios que besaste en sueños te buscarán al amanecer con sed de eternidad.',
    category: 'Pasión',
  },
  {
    text: 'El amor verdadero no necesita testigos: crece en los rincones más sombríos del alma.',
    category: 'Amor',
  },
  {
    text: 'El reloj de la eternidad marca la hora exacta en que tus caminos volverán a cruzarse.',
    category: 'Destino',
  },
  {
    text: 'Una mariposa negra se posa en tu ventana: no es mal augurio, es la transformación que pediste.',
    category: 'Esperanza',
  },
  {
    text: 'Lo que enterraste con lágrimas renacerá como gardenia: fragante, blanco, eterno.',
    category: 'Misterio',
  },
  {
    text: 'La sangre de tu corazón fertiliza una pasión que dormía siglos bajo tierra.',
    category: 'Pasión',
  },
  {
    text: 'El espejo refleja una versión de ti que aún no conoces: es quien serás cuando ames sin miedo.',
    category: 'Amor',
  },
  {
    text: 'Cada eclipse es un adiós y un reencuentro: el destino te prepara un retorno inminente.',
    category: 'Destino',
  },
  {
    text: 'Las cadenas que sientes no son prisión: son las raíces de un árbol que crece hacia el cielo.',
    category: 'Esperanza',
  },
  {
    text: 'El cuervo que canta a medianoche guarda un mensaje escrito con la pluma de los ángeles caídos.',
    category: 'Misterio',
  },
  {
    text: 'Tus manos tiemblan porque sostienen el filo de una pasión que puede salvar o destruir.',
    category: 'Pasión',
  },
];

// ─── Category Icons (SVG) ───
function CategoryIcon({ category }: { category: FortuneCategory }) {
  const size = 28;
  switch (category) {
    case 'Amor':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="ornate-icon" aria-hidden="true">
          <path
            d="M14 24C14 24 3 16 3 9.5C3 5.36 6.36 2 10.5 2C12.44 2 14 3.5 14 3.5C14 3.5 15.56 2 17.5 2C21.64 2 25 5.36 25 9.5C25 16 14 24 14 24Z"
            stroke="#c9a84c"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M14 20C14 20 6 14 6 9.5C6 6.46 8.46 4 11.5 4C13 4 14 5 14 5C14 5 15 4 16.5 4C19.54 4 22 6.46 22 9.5C22 14 14 20 14 20Z"
            stroke="#c9a84c"
            strokeWidth="0.5"
            fill="rgba(201,168,76,0.05)"
            opacity="0.5"
          />
        </svg>
      );
    case 'Destino':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="ornate-icon" aria-hidden="true">
          <polygon
            points="14,2 17.1,9.5 25,10.2 19.2,15.8 20.8,23.7 14,19.5 7.2,23.7 8.8,15.8 3,10.2 10.9,9.5"
            stroke="#c9a84c"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="14" cy="13" r="2" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
        </svg>
      );
    case 'Misterio':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="ornate-icon" aria-hidden="true">
          {/* Eye of Providence */}
          <path
            d="M3 14C3 14 7.5 5 14 5C20.5 5 25 14 25 14C25 14 20.5 23 14 23C7.5 23 3 14 3 14Z"
            stroke="#c9a84c"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="14" cy="14" r="4.5" stroke="#c9a84c" strokeWidth="1" fill="none" />
          <circle cx="14" cy="14" r="2" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" strokeWidth="0.5" />
          <circle cx="14" cy="14" r="0.8" fill="#c9a84c" opacity="0.6" />
        </svg>
      );
    case 'Esperanza':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="ornate-icon" aria-hidden="true">
          {/* Crescent moon */}
          <path
            d="M20 5C20 5 14 7 14 14C14 21 20 23 20 23C20 23 8 21 8 14C8 7 20 5 20 5Z"
            stroke="#c9a84c"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="10" cy="9" r="0.8" fill="#c9a84c" opacity="0.4" />
          <circle cx="7" cy="14" r="0.6" fill="#c9a84c" opacity="0.3" />
          <circle cx="9" cy="19" r="0.7" fill="#c9a84c" opacity="0.35" />
        </svg>
      );
    case 'Pasión':
      return (
        <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="ornate-icon" aria-hidden="true">
          {/* Flame */}
          <path
            d="M14 2C14 2 8 10 8 16C8 20 10.5 24 14 26C17.5 24 20 20 20 16C20 10 14 2 14 2Z"
            stroke="#c9a84c"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M14 10C14 10 11 14.5 11 17C11 19.2 12.3 21 14 22C15.7 21 17 19.2 17 17C17 14.5 14 10 14 10Z"
            stroke="#c9a84c"
            strokeWidth="0.6"
            fill="rgba(201,168,76,0.08)"
          />
          <path
            d="M14 15C14 15 12.8 17 12.8 18.2C12.8 19.3 13.3 20 14 20.5C14.7 20 15.2 19.3 15.2 18.2C15.2 17 14 15 14 15Z"
            fill="rgba(201,168,76,0.15)"
          />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Card Back: Eye of the Oracle SVG ───
function OracleEye() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      className="drop-shadow-[0_0_10px_rgba(201,168,76,0.25)]"
      aria-hidden="true"
    >
      {/* Outer glow circle */}
      <circle cx="36" cy="36" r="35" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
      <circle cx="36" cy="36" r="32" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />

      {/* Eye shape */}
      <path
        d="M6 36C6 36 17 14 36 14C55 14 66 36 66 36C66 36 55 58 36 58C17 58 6 36 6 36Z"
        stroke="#c9a84c"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M10 36C10 36 19 18 36 18C53 18 62 36 62 36C62 36 53 54 36 54C19 54 10 36 10 36Z"
        stroke="#c9a84c"
        strokeWidth="0.4"
        fill="none"
        opacity="0.4"
      />

      {/* Iris */}
      <circle cx="36" cy="36" r="10" stroke="#c9a84c" strokeWidth="1" fill="none" />
      <circle cx="36" cy="36" r="7" stroke="#c9a84c" strokeWidth="0.4" fill="rgba(201,168,76,0.06)" opacity="0.6" />

      {/* Pupil */}
      <circle cx="36" cy="36" r="4" fill="rgba(201,168,76,0.15)" stroke="#c9a84c" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="1.5" fill="#c9a84c" opacity="0.5" />

      {/* Pentagram inside pupil */}
      <polygon
        points="36,32 37.8,34.5 40.5,34.8 38.8,37 39.2,39.7 36,38.5 32.8,39.7 33.2,37 31.5,34.8 34.2,34.5"
        stroke="#c9a84c"
        strokeWidth="0.3"
        fill="none"
        opacity="0.35"
      />

      {/* Decorative rays from eye */}
      <line x1="36" y1="4" x2="36" y2="12" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
      <line x1="36" y1="60" x2="36" y2="68" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
      <line x1="4" y1="36" x2="10" y2="36" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
      <line x1="62" y1="36" x2="68" y2="36" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
      <line x1="13" y1="13" x2="18" y2="18" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
      <line x1="54" y1="54" x2="59" y2="59" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
      <line x1="59" y1="13" x2="54" y2="18" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
      <line x1="13" y1="59" x2="18" y2="54" stroke="#c9a84c" strokeWidth="0.3" opacity="0.15" />
    </svg>
  );
}

// ─── Card Back: Pentagram ornament ───
function PentagramOrnament() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#c9a84c" strokeWidth="0.5" opacity="0.15" />
      <polygon
        points="20,3 23.5,14.5 35.5,14.5 25.5,21.8 29.5,33 20,25.5 10.5,33 14.5,21.8 4.5,14.5 16.5,14.5"
        stroke="#c9a84c"
        strokeWidth="0.6"
        fill="none"
        opacity="0.2"
      />
      <circle cx="20" cy="20" r="3" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.15" />
    </svg>
  );
}

// ─── Corner ornament for card back ───
function CardBackCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotations: Record<string, number> = { tl: 0, tr: 90, br: 180, bl: 270 };
  const positions: Record<string, string> = {
    tl: 'top-3 left-3',
    tr: 'top-3 right-3',
    br: 'bottom-3 right-3',
    bl: 'bottom-3 left-3',
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={`absolute ${positions[position]} pointer-events-none`}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
      aria-hidden="true"
    >
      <path d="M2 2 L2 14" stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />
      <path d="M2 2 L14 2" stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />
      <path d="M2 6 C4 6, 6 4, 6 2" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.25" />
      <circle cx="2" cy="2" r="1.5" fill="#c9a84c" opacity="0.3" />
      <path d="M2 10 C3 10, 4 9, 4 8" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.15" />
    </svg>
  );
}

// ─── Gold corner accent for card front ───
function GoldCornerAccent({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
  };
  return (
    <div
      className={`absolute w-6 h-6 sm:w-8 sm:h-8 border-[#c9a84c]/30 pointer-events-none ${classes[position]}`}
      aria-hidden="true"
    />
  );
}

// ─── Gold particle burst ───
function GoldParticleBurst({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * 360 + (Math.random() * 20 - 10),
        distance: 50 + Math.random() * 80,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.4 ? '#c9a84c' : '#8B0000',
        duration: 0.5 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
          aria-hidden="true"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Ornamental divider ───
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3 sm:my-4" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
      <div className="flex items-center gap-2">
        <span className="text-[#c9a84c]/30 text-[10px] select-none">&#9670;</span>
        <span className="text-[#c9a84c]/50 text-xs select-none">&#10022;</span>
        <span className="text-[#c9a84c]/30 text-[10px] select-none">&#9670;</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
    </div>
  );
}

// ─── Typewriter text effect ───
function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setDone(false);
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete();
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <p
      className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.03em] whitespace-pre-wrap relative z-10 min-h-[3rem]"
      style={{ textShadow: '0 0 1px rgba(139, 0, 0, 0.1)' }}
    >
      {displayedText}
      {!done && (
        <motion.span
          className="inline-block w-[2px] h-4 bg-[#c9a84c] ml-[1px] align-text-bottom"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(2)' }}
        />
      )}
    </p>
  );
}

// ─── Card Back Design (ornate geometric) ───
function CardBackDesign() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Geometric border pattern */}
      <svg width="100%" height="100%" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid meet" className="absolute inset-0" aria-hidden="true">
        {/* Outer border */}
        <rect x="8" y="8" width="184" height="284" rx="4" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.3" />
        {/* Inner border */}
        <rect x="14" y="14" width="172" height="272" rx="2" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.15" />

        {/* Corner diamonds */}
        <rect x="6" y="6" width="8" height="8" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" transform="rotate(45 10 10)" />
        <rect x="186" y="6" width="8" height="8" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" transform="rotate(45 190 10)" />
        <rect x="6" y="286" width="8" height="8" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" transform="rotate(45 10 290)" />
        <rect x="186" y="286" width="8" height="8" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" transform="rotate(45 190 290)" />

        {/* Top/bottom horizontal ornaments */}
        <line x1="30" y1="8" x2="80" y2="8" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="120" y1="8" x2="170" y2="8" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="30" y1="292" x2="80" y2="292" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="120" y1="292" x2="170" y2="292" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />

        {/* Left/right vertical ornaments */}
        <line x1="8" y1="30" x2="8" y2="80" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="8" y1="120" x2="8" y2="180" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="8" y1="220" x2="8" y2="270" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="192" y1="30" x2="192" y2="80" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="192" y1="120" x2="192" y2="180" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />
        <line x1="192" y1="220" x2="192" y2="270" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2" />

        {/* Top center ornament */}
        <circle cx="100" cy="8" r="2" fill="#c9a84c" opacity="0.2" />
        {/* Bottom center ornament */}
        <circle cx="100" cy="292" r="2" fill="#c9a84c" opacity="0.2" />
      </svg>

      {/* Top pentagram */}
      <div className="relative z-10 mb-2 mt-6">
        <PentagramOrnament />
      </div>

      {/* Central Eye */}
      <div className="relative z-10 oracle-card-eye-pulse my-2">
        <OracleEye />
      </div>

      {/* Bottom pentagram */}
      <div className="relative z-10 mt-2 mb-6">
        <PentagramOrnament />
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function OracleCard({ className = '' }: OracleCardProps) {
  const [cardState, setCardState] = useState<CardState>('face-down');
  const [showParticles, setShowParticles] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipAngle, setFlipAngle] = useState(0);

  const handleReveal = useCallback(() => {
    if (cardState !== 'face-down' || isFlipping) return;

    // Pick a random fortune (avoid repeating the same one)
    let nextFortune: Fortune;
    do {
      nextFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    } while (fortune && nextFortune.text === fortune.text && FORTUNES.length > 1);

    setFortune(nextFortune);
    setTypewriterComplete(false);
    setShowParticles(true);
    setCardState('revealing');
    setIsFlipping(true);

    // Phase 1: Flip from back to side (0 → 90)
    setFlipAngle(90);

    // Phase 2: Switch to front and flip from side to front (90 → 0)
    setTimeout(() => {
      setCardState('revealed');
      setFlipAngle(0);
    }, 500);

    // Hide particles
    setTimeout(() => {
      setShowParticles(false);
    }, 1000);

    // Mark flip complete
    setTimeout(() => {
      setIsFlipping(false);
    }, 1000);
  }, [cardState, isFlipping, fortune]);

  const handleReshuffle = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);

    // Flip back to face-down
    setFlipAngle(90);

    setTimeout(() => {
      setCardState('face-down');
      setFlipAngle(0);
      setFortune(null);
      setTypewriterComplete(false);
    }, 500);

    setTimeout(() => {
      setIsFlipping(false);
    }, 1000);
  }, [isFlipping]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (cardState === 'face-down') {
          handleReveal();
        } else if (cardState === 'revealed' && typewriterComplete) {
          handleReshuffle();
        }
      }
    },
    [cardState, typewriterComplete, handleReveal, handleReshuffle]
  );

  const isBack = cardState === 'face-down' || cardState === 'revealing';
  const showFront = cardState === 'revealed';

  return (
    <div className={`relative w-full max-w-sm sm:max-w-md mx-auto my-8 sm:my-12 ${className}`}>
      <motion.div
        className="relative"
        style={{ perspective: 1000 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="relative cursor-pointer select-none"
          style={{
            transformStyle: 'preserve-3d',
            rotateY: flipAngle,
          }}
          animate={{ rotateY: flipAngle }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={isBack ? handleReveal : undefined}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={
            isBack
              ? 'Carta del oráculo boca abajo. Toca para consultar el oráculo.'
              : `Carta del oráculo revelada. Fortuna: ${fortune?.category}. Toca consultar de nuevo.`
          }
        >
          {/* ─── Card Back ─── */}
          <motion.div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden' }}
            animate={{ opacity: showFront ? 0 : 1 }}
            transition={{ duration: 0.01 }}
          >
            <div className="oracle-card-glow relative bg-gradient-to-b from-[#121010] to-[#0d0a0a] border border-[#2a2a2a] rounded-xl p-6 sm:p-8 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              {/* Corner ornaments */}
              <CardBackCorner position="tl" />
              <CardBackCorner position="tr" />
              <CardBackCorner position="br" />
              <CardBackCorner position="bl" />

              {/* Inner border glow */}
              <div className="absolute inset-[1px] rounded-xl border border-[#c9a84c]/5 pointer-events-none" />

              {/* Ornate back design */}
              <CardBackDesign />

              {/* Instruction text */}
              <motion.p
                className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm text-center tracking-wide relative z-10 mt-4 mb-2"
                animate={{
                  opacity: cardState === 'revealing' ? 0 : [0.6, 1, 0.6],
                }}
                transition={
                  cardState === 'revealing'
                    ? { duration: 0.15 }
                    : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                Toca para consultar el or&aacute;culo
              </motion.p>
            </div>
          </motion.div>

          {/* ─── Card Front ─── */}
          <motion.div
            className="relative"
            style={{ backfaceVisibility: 'hidden' }}
            animate={{ opacity: showFront ? 1 : 0 }}
            transition={{ duration: 0.01 }}
          >
            <div className="paper-texture rounded-xl border border-[#2a2a2a] p-6 sm:p-8 relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
              {/* Gold corner accents */}
              <GoldCornerAccent position="tl" />
              <GoldCornerAccent position="tr" />
              <GoldCornerAccent position="bl" />
              <GoldCornerAccent position="br" />

              {/* Inner subtle border */}
              <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/8 pointer-events-none" />

              {/* Category icon */}
              <motion.div
                className="flex justify-center mb-3"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: showFront ? 1 : 0, scale: showFront ? 1 : 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {fortune && <CategoryIcon category={fortune.category} />}
              </motion.div>

              {/* Category label */}
              <motion.h3
                className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-base sm:text-lg text-center tracking-[0.15em] uppercase mb-2"
                style={{
                  textShadow: '0 0 15px rgba(201, 168, 76, 0.3), 0 0 30px rgba(201, 168, 76, 0.1)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: showFront ? 1 : 0, y: showFront ? 0 : -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {fortune?.category}
              </motion.h3>

              {/* Ornamental divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: showFront ? 1 : 0, scaleX: showFront ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <OrnamentalDivider />
              </motion.div>

              {/* Fortune message with typewriter effect */}
              <motion.div
                className="min-h-[4rem] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: showFront ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {fortune && (
                  <TypewriterText
                    text={fortune.text}
                    onComplete={() => setTypewriterComplete(true)}
                  />
                )}
              </motion.div>

              {/* Reshuffle button */}
              <motion.div
                className="mt-5 sm:mt-6 pt-4 border-t border-[#2a2a2a]/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: typewriterComplete ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReshuffle();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleReshuffle();
                      }
                    }}
                    className="font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-300 cursor-pointer py-1 px-2"
                    aria-label="Consultar de nuevo el oráculo"
                  >
                    Consultar de nuevo
                  </button>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Particle burst overlay */}
        <GoldParticleBurst active={showParticles} />
      </motion.div>
    </div>
  );
}
