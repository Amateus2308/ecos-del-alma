'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PactPhase = 'dormant' | 'ceremony' | 'sealing' | 'sealed';

// ─── Vow Text ───
const VOW_TEXT = `Bajo la luz de las velas eternas y la sombra del laberinto,
yo juro amarte más allá del último eco.
Este pacto no se rompe con el tiempo ni con la distancia,
pues está escrito con tinta de alma y sangre de corazón.

Hasta que las estrellas pierdan su brillo,
hasta que el laberinto deje de girar,
este amor será mi única verdad.`;

const SIGNATURE = '— Sellado en la oscuridad, para la eternidad —';

// ─── Typewriter Effect ───
function TypewriterText({
  text,
  speed = 30,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <p className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.03em] whitespace-pre-wrap relative z-10 min-h-[6rem]">
      {displayed}
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

// ─── Candle SVG (compact version for pact card) ───
function PactCandle({
  lit,
  onToggle,
  label,
}: {
  lit: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-label={lit ? `Apagar vela ${label}` : `Encender vela ${label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Warm glow when lit */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute -inset-12 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,170,0,0.08) 0%, rgba(139,0,0,0.04) 40%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <svg
        width="56"
        height="120"
        viewBox="0 0 56 120"
        className="relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id={`candle-body-${label}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8dcc8" />
            <stop offset="25%" stopColor="#f5efe3" />
            <stop offset="50%" stopColor="#faf6ee" />
            <stop offset="75%" stopColor="#f0e8d8" />
            <stop offset="100%" stopColor="#ddd0bc" />
          </linearGradient>
          <linearGradient id={`wax-drip-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a00000" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
          <linearGradient id={`holder-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#222222" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
          <linearGradient id={`holder-rim-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#8a7234" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>
          <radialGradient id={`flame-outer-g-${label}`} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff6600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`flame-inner-g-${label}`} cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#fff7a0" stopOpacity="1" />
            <stop offset="50%" stopColor="#ffdd44" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id={`flame-core-g-${label}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff7a0" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Flame group */}
        <AnimatePresence>
          {lit && (
            <g>
              {/* Glow aura */}
              <ellipse cx="28" cy="28" rx="16" ry="14" fill="#ffaa00" opacity="0.05">
                <animate attributeName="rx" values="16;18;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="ry" values="14;16;14" dur="2s" repeatCount="indefinite" />
              </ellipse>
              {/* Outer flame */}
              <path
                className="candle-flicker"
                d="M28 32 Q22 26 20 20 Q18 14 22 6 Q25 2 28 0 Q31 2 34 6 Q38 14 36 20 Q34 26 28 32 Z"
                fill={`url(#flame-outer-g-${label})`}
                opacity="0.7"
              />
              {/* Inner flame */}
              <path
                className="candle-flicker"
                d="M28 30 Q24 26 23 21 Q22 16 25 10 Q27 5 28 3 Q29 5 31 10 Q34 16 33 21 Q32 26 28 30 Z"
                fill={`url(#flame-inner-g-${label})`}
              />
              {/* Core flame */}
              <path
                className="candle-flicker"
                d="M28 27 Q26 24 25 21 Q24 18 26 13 Q27 8 28 6 Q29 8 30 13 Q32 18 31 21 Q30 24 28 27 Z"
                fill={`url(#flame-core-g-${label})`}
              />
            </g>
          )}
        </AnimatePresence>

        {/* Wick */}
        <line x1="28" y1="32" x2="28" y2="40" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" />
        {lit && (
          <circle cx="28" cy="32" r="1.5" fill="#ff8c00" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="0.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Wax pool */}
        <ellipse cx="28" cy="40" rx="16" ry="3" fill="#faf6ee" opacity="0.7" />

        {/* Candle body */}
        <rect x="14" y="40" width="28" height="52" rx="1" fill={`url(#candle-body-${label})`} />

        {/* Red wax drips */}
        <path d={`M18 44 Q16 52 17 60 Q18 65 16 70`} stroke={`url(#wax-drip-${label})`} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d={`M38 46 Q40 54 39 62 Q38 68 40 74`} stroke={`url(#wax-drip-${label})`} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="16" cy="71" rx="3" ry="2.5" fill="#8B0000" opacity="0.6" />
        <ellipse cx="40" cy="75" rx="3" ry="2.5" fill="#8B0000" opacity="0.6" />

        {/* Holder */}
        <rect x="8" y="92" width="40" height="5" rx="2" fill={`url(#holder-rim-${label})`} />
        <rect x="10" y="97" width="36" height="12" rx="1" fill={`url(#holder-${label})`} />
        <rect x="6" y="109" width="44" height="4" rx="2" fill={`url(#holder-rim-${label})`} />
        <rect x="4" y="113" width="48" height="6" rx="2" fill={`url(#holder-${label})`} />

        {/* Gold accents on holder */}
        <line x1="14" y1="98" x2="14" y2="108" stroke="#c9a84c" strokeWidth="0.4" opacity="0.3" />
        <line x1="42" y1="98" x2="42" y2="108" stroke="#c9a84c" strokeWidth="0.4" opacity="0.3" />
        <circle cx="22" cy="103" r="0.8" fill="#c9a84c" opacity="0.2" />
        <circle cx="34" cy="103" r="0.8" fill="#c9a84c" opacity="0.2" />
      </svg>
    </div>
  );
}

// ─── Chalice SVG ───
function Chalice({ glowing }: { glowing: boolean }) {
  return (
    <motion.div
      className={glowing ? 'chalice-glow' : ''}
      initial={false}
    >
      <svg
        width="64"
        height="80"
        viewBox="0 0 64 80"
        className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="chalice-blood" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#c01010" stopOpacity={glowing ? 0.9 : 0.3} />
            <stop offset="60%" stopColor="#8B0000" stopOpacity={glowing ? 0.8 : 0.2} />
            <stop offset="100%" stopColor="#4a0000" stopOpacity={glowing ? 0.6 : 0.1} />
          </radialGradient>
          <linearGradient id="chalice-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="30%" stopColor="#5a5a5a" />
            <stop offset="50%" stopColor="#6a6a6a" />
            <stop offset="70%" stopColor="#5a5a5a" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>
          <linearGradient id="chalice-metal-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
        </defs>

        {/* Chalice cup */}
        <path
          d="M12 8 Q10 4 16 2 L48 2 Q54 4 52 8 L48 30 Q46 34 32 36 Q18 34 16 30 Z"
          fill="url(#chalice-metal)"
          stroke="#c9a84c"
          strokeWidth="0.5"
          opacity="0.8"
        />
        {/* Cup interior - blood fill */}
        <path
          d="M16 10 Q18 8 32 8 Q46 8 48 10 L46 26 Q44 30 32 31 Q20 30 18 26 Z"
          fill="url(#chalice-blood)"
        />
        {/* Cup rim highlight */}
        <path
          d="M14 6 Q16 3 32 3 Q48 3 50 6"
          stroke="#c9a84c"
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
        />
        {/* Gold band on cup */}
        <path
          d="M15 14 Q18 12 32 12 Q46 12 49 14"
          stroke="#c9a84c"
          strokeWidth="0.4"
          fill="none"
          opacity="0.25"
        />
        {/* Stem */}
        <rect x="29" y="36" width="6" height="20" rx="1" fill="url(#chalice-metal-v)" stroke="#c9a84c" strokeWidth="0.3" opacity="0.6" />
        {/* Stem gold accent */}
        <line x1="29" y1="42" x2="35" y2="42" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
        <line x1="29" y1="48" x2="35" y2="48" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
        {/* Base */}
        <ellipse cx="32" cy="58" rx="18" ry="4" fill="url(#chalice-metal)" stroke="#c9a84c" strokeWidth="0.4" opacity="0.6" />
        <rect x="14" y="58" width="36" height="6" rx="2" fill="url(#chalice-metal-v)" stroke="#c9a84c" strokeWidth="0.3" opacity="0.6" />
        <ellipse cx="32" cy="64" rx="20" ry="4" fill="url(#chalice-metal)" stroke="#c9a84c" strokeWidth="0.4" opacity="0.7" />
        {/* Base gold line */}
        <line x1="16" y1="60" x2="48" y2="60" stroke="#c9a84c" strokeWidth="0.3" opacity="0.2" />

        {/* Blood drip animation when glowing */}
        {glowing && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Drip 1 */}
            <motion.ellipse
              cx="24"
              cy={8}
              rx="2"
              ry="1.5"
              fill="#8B0000"
              animate={{ cy: [8, 36], ry: [1.5, 3], opacity: [0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeIn', delay: 0.5 }}
            />
            {/* Drip 2 */}
            <motion.ellipse
              cx="38"
              cy={8}
              rx="1.5"
              ry="1"
              fill="#a00000"
              animate={{ cy: [8, 32], ry: [1, 2.5], opacity: [0.7, 0.2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeIn', delay: 1.2 }}
            />
            {/* Drip 3 */}
            <motion.ellipse
              cx="32"
              cy={6}
              rx="1.8"
              ry="1.2"
              fill="#8B0000"
              animate={{ cy: [6, 30], ry: [1.2, 2.8], opacity: [0.6, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeIn', delay: 2 }}
            />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

// ─── Pentagram SVG ───
function Pentagram({ glowing }: { glowing: boolean }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.4"
        opacity={glowing ? 0.35 : 0.15}
      />
      <polygon
        points="20,4 24.5,15 36,15 27,22.5 30.5,34 20,27 9.5,34 13,22.5 4,15 15.5,15"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.5"
        opacity={glowing ? 0.4 : 0.15}
      />
    </svg>
  );
}

// ─── Blood-drip overlay on seal ───
function BloodDripOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: '100%', opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#8B0000]/20 via-[#8B0000]/10 to-transparent pointer-events-none rounded-lg z-20"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}

// ─── Seal particles burst ───
function SealParticles({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        angle: (i / 15) * 360 + Math.random() * 20,
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

// ─── Wax Seal decoration ───
function WaxSealDecoration() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-[0_0_8px_rgba(139,0,0,0.3)]" aria-hidden="true">
      <defs>
        <radialGradient id="wax-seal-g" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#c01010" />
          <stop offset="50%" stopColor="#8B0000" />
          <stop offset="100%" stopColor="#4a0000" />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="24" cy="24" r="22" fill="url(#wax-seal-g)" stroke="#c9a84c" strokeWidth="0.5" />
      {/* Inner ring */}
      <circle cx="24" cy="24" r="16" fill="none" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
      {/* Cross */}
      <line x1="24" y1="10" x2="24" y2="38" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
      <line x1="10" y1="24" x2="38" y2="24" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
      {/* Diamond center */}
      <rect x="20" y="20" width="8" height="8" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.4" opacity="0.35" transform="rotate(45 24 24)" />
      <circle cx="24" cy="24" r="2" fill="#c9a84c" opacity="0.25" />
      {/* Drip */}
      <ellipse cx="24" cy="46" rx="3" ry="2" fill="#8B0000" opacity="0.5" />
      {/* Shine */}
      <circle cx="18" cy="18" r="4" fill="white" opacity="0.05" />
    </svg>
  );
}

// ─── Gold corner accent ───
function GoldCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const cls = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
  };
  return (
    <div
      className={`absolute w-5 h-5 sm:w-7 sm:h-7 border-[#c9a84c]/30 pointer-events-none z-10 ${cls[position]}`}
      aria-hidden="true"
    />
  );
}

// ─── Ornamental divider ───
function PactDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-3 sm:my-4" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
      <div className="flex items-center gap-1.5">
        <span className="text-[#c9a84c]/25 text-[9px] select-none">◆</span>
        <span className="text-[#c9a84c]/40 text-[10px] select-none">✦</span>
        <span className="text-[#c9a84c]/25 text-[9px] select-none">◆</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
    </div>
  );
}

// ─── Main Component ───
export default function BloodPactVows() {
  const [leftCandleLit, setLeftCandleLit] = useState(false);
  const [rightCandleLit, setRightCandleLit] = useState(false);
  const [phase, setPhase] = useState<PactPhase>('dormant');
  const [showDrip, setShowDrip] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);

  const bothCandlesLit = leftCandleLit && rightCandleLit;

  // Transition to ceremony phase when both candles are lit
  useEffect(() => {
    if (bothCandlesLit && phase === 'dormant') {
      const timer = setTimeout(() => setPhase('ceremony'), 800);
      return () => clearTimeout(timer);
    }
  }, [bothCandlesLit, phase]);

  const toggleLeftCandle = useCallback(() => {
    if (phase !== 'dormant') return;
    setLeftCandleLit((prev) => !prev);
  }, [phase]);

  const toggleRightCandle = useCallback(() => {
    if (phase !== 'dormant') return;
    setRightCandleLit((prev) => !prev);
  }, [phase]);

  const handleSealPact = useCallback(() => {
    if (phase !== 'ceremony') return;
    setPhase('sealing');
    setShowDrip(true);
    setShowParticles(true);

    setTimeout(() => {
      setPhase('sealed');
    }, 800);

    setTimeout(() => {
      setShowParticles(false);
    }, 1200);

    setTimeout(() => {
      setShowDrip(false);
    }, 3000);
  }, [phase]);

  const handleRenew = useCallback(() => {
    setLeftCandleLit(false);
    setRightCandleLit(false);
    setPhase('dormant');
    setShowDrip(false);
    setShowParticles(false);
    setTypewriterDone(false);
  }, []);

  const handleTypewriterComplete = useCallback(() => {
    setTypewriterDone(true);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative w-full max-w-lg mx-auto my-8 sm:my-12"
    >
      {/* Section title */}
      <motion.h2
        className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xl sm:text-2xl text-center tracking-wider mb-6"
        style={{ textShadow: '0 0 15px rgba(139, 0, 0, 0.25), 0 0 30px rgba(139, 0, 0, 0.1)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Pacto de Sangre Eterno
      </motion.h2>

      {/* Card */}
      <div className="relative paper-texture rounded-lg border border-[#2a2a2a] p-6 sm:p-10 overflow-hidden pact-glow">
        {/* Gold corners */}
        <GoldCorner position="tl" />
        <GoldCorner position="tr" />
        <GoldCorner position="bl" />
        <GoldCorner position="br" />

        {/* Blood drip overlay (on seal) */}
        <BloodDripOverlay active={showDrip} />

        {/* Particles burst (on seal) */}
        <SealParticles active={showParticles} />

        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 0, 0, 0.06) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          {/* ─── DORMANT STATE ─── */}
          {phase === 'dormant' && (
            <motion.div
              key="dormant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              {/* Three-column layout: candle - chalice - candle */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 my-6 sm:my-8">
                <PactCandle
                  lit={leftCandleLit}
                  onToggle={toggleLeftCandle}
                  label="izquierda"
                />

                {/* Central chalice + pentagram */}
                <div className="relative flex flex-col items-center">
                  <Pentagram glowing={false} />
                  <Chalice glowing={false} />
                </div>

                <PactCandle
                  lit={rightCandleLit}
                  onToggle={toggleRightCandle}
                  label="derecha"
                />
              </div>

              {/* Ornamental divider */}
              <PactDivider />

              {/* Instruction text */}
              <motion.p
                className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm text-center tracking-wide"
                animate={{
                  opacity: bothCandlesLit ? 0 : [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {bothCandlesLit
                  ? ''
                  : 'Enciende las velas para comenzar la ceremonia'}
              </motion.p>

              {/* Hint when one candle is lit */}
              {!bothCandlesLit && (leftCandleLit || rightCandleLit) && (
                <motion.p
                  className="font-[family-name:var(--font-cinzel)] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#5a5040] text-center mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  — enciende la otra vela —
                </motion.p>
              )}
            </motion.div>
          )}

          {/* ─── CEREMONY ACTIVE STATE ─── */}
          {(phase === 'ceremony' || phase === 'sealing') && (
            <motion.div
              key="ceremony"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              {/* Three-column layout: candle - chalice - candle (all lit) */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 my-6 sm:my-8">
                <PactCandle lit label="izquierda" onToggle={() => {}} />
                <div className="relative flex flex-col items-center">
                  <Pentagram glowing />
                  <Chalice glowing />
                </div>
                <PactCandle lit label="derecha" onToggle={() => {}} />
              </div>

              {/* Ornamental divider */}
              <PactDivider />

              {/* Ceremony text */}
              <AnimatePresence mode="wait">
                {phase === 'ceremony' && (
                  <motion.div
                    key="ceremony-text"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <p className="font-[family-name:var(--font-fell)] italic text-[#c9a84c]/70 text-sm sm:text-base mb-6">
                      El pacto está listo para ser sellado
                    </p>

                    {/* Seal button */}
                    <motion.button
                      onClick={handleSealPact}
                      className="font-[family-name:var(--font-cinzel)] text-xs sm:text-sm uppercase tracking-[0.2em] px-8 py-3 rounded border border-[#8B0000]/50 bg-[#8B0000]/10 text-[#c9a84c] hover:bg-[#8B0000]/20 hover:border-[#8B0000]/70 transition-all duration-300 cursor-pointer"
                      style={{
                        boxShadow: '0 0 20px rgba(139, 0, 0, 0.15), 0 0 40px rgba(139, 0, 0, 0.05)',
                      }}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(139, 0, 0, 0.15), 0 0 40px rgba(139, 0, 0, 0.05)',
                          '0 0 30px rgba(139, 0, 0, 0.25), 0 0 60px rgba(139, 0, 0, 0.1)',
                          '0 0 20px rgba(139, 0, 0, 0.15), 0 0 40px rgba(139, 0, 0, 0.05)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      aria-label="Sellar el Pacto de Sangre"
                    >
                      Sellar el Pacto
                    </motion.button>
                  </motion.div>
                )}

                {phase === 'sealing' && (
                  <motion.div
                    key="sealing-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      className="inline-block"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <p className="font-[family-name:var(--font-cinzel-decorative)] text-[#8B0000] text-sm sm:text-base tracking-wider">
                        Sellando el pacto...
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── SEALED / REVEALED STATE ─── */}
          {phase === 'sealed' && (
            <motion.div
              key="sealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Title */}
              <motion.h3
                className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-base sm:text-lg text-center tracking-wider mb-1"
                style={{ textShadow: '0 0 12px rgba(201, 168, 76, 0.3)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Pacto Sellado
              </motion.h3>

              {/* Mini chalice icon */}
              <motion.div
                className="flex justify-center mb-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Chalice glowing />
              </motion.div>

              <PactDivider />

              {/* Vow text with typewriter */}
              <motion.div
                className="my-4 sm:my-6 min-h-[8rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <TypewriterText
                  text={VOW_TEXT}
                  speed={30}
                  onComplete={handleTypewriterComplete}
                />
              </motion.div>

              {/* Signature line */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: typewriterDone ? 1 : 0, y: typewriterDone ? 0 : 8 }}
                transition={{ duration: 0.8 }}
              >
                <PactDivider />
                <p className="font-[family-name:var(--font-fell)] italic text-[#c9a84c]/50 text-xs sm:text-sm text-center tracking-wide my-4">
                  {SIGNATURE}
                </p>

                {/* Two decorative wax seals */}
                <div className="flex items-center justify-center gap-12 sm:gap-16 my-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <WaxSealDecoration />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <WaxSealDecoration />
                  </motion.div>
                </div>

                {/* Renew button */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[#2a2a2a]/50">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                  <motion.button
                    onClick={handleRenew}
                    className="font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-300 cursor-pointer py-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Renovar el Pacto de Sangre"
                  >
                    Renovar el Pacto
                  </motion.button>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
