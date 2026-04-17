'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface MemoryVaultProps {
  className?: string;
}

type VaultState = 'locked' | 'shaking' | 'unlocking' | 'unlocked' | 'closing';

// ─── Constants ───
const CORRECT_COMBO = [1, 4, 2];

const MEMORIES = [
  'El día que nuestros caminos se cruzaron, el laberinto encontró su centro.',
  'Cada amanecer contigo es un capítulo nuevo en un libro que nunca quiero terminar.',
  'En la bóveda más profunda de mi alma, guardo el momento exacto en que supe que eras tú.',
];

// ─── Combination Wheel ───
function ComboWheel({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const increment = useCallback(() => {
    onChange((value + 1) % 10);
  }, [value, onChange]);

  const decrement = useCallback(() => {
    onChange((value + 9) % 10);
  }, [value, onChange]);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Up arrow */}
      <button
        onClick={increment}
        className="w-10 h-7 sm:w-12 sm:h-8 flex items-center justify-center rounded-t border border-[#c9a84c]/30 border-b-0
          bg-gradient-to-b from-[#2a2520] to-[#1a1510] text-[#c9a84c]/70 hover:text-[#c9a84c] hover:bg-gradient-to-b hover:from-[#3a3530] hover:to-[#2a2520]
          transition-all cursor-pointer active:scale-95"
        aria-label="Aumentar número"
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
          <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Number display */}
      <div className="w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center
        bg-gradient-to-b from-[#1a1815] to-[#0f0d0a] border border-[#c9a84c]/25
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_0_8px_rgba(201,168,76,0.06)]">
        <span className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-2xl sm:text-3xl
          drop-shadow-[0_0_6px_rgba(201,168,76,0.3)] select-none">
          {value}
        </span>
      </div>

      {/* Down arrow */}
      <button
        onClick={decrement}
        className="w-10 h-7 sm:w-12 sm:h-8 flex items-center justify-center rounded-b border border-[#c9a84c]/30 border-t-0
          bg-gradient-to-t from-[#2a2520] to-[#1a1510] text-[#c9a84c]/70 hover:text-[#c9a84c] hover:bg-gradient-to-t hover:from-[#3a3530] hover:to-[#2a2520]
          transition-all cursor-pointer active:scale-95"
        aria-label="Disminuir número"
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
          <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── Gold Particle Burst ───
function GoldParticleBurst({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        angle: (i / 24) * 360 + (Math.random() * 15 - 7.5),
        distance: 60 + Math.random() * 120,
        size: 2 + Math.random() * 5,
        color: Math.random() > 0.35 ? '#c9a84c' : '#8B0000',
        duration: 0.6 + Math.random() * 0.8,
        delay: Math.random() * 0.15,
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-50"
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
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Gold Corner Accent ───
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

// ─── Vault Door SVG ───
function VaultDoorSVG({ shaking }: { shaking: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 240 320"
      className="w-48 h-64 sm:w-56 sm:h-[280px] md:w-64 md:h-80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={shaking ? { x: [-4, 4, -3, 3, -2, 2, 0] } : {}}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <defs>
        {/* Iron gradient */}
        <linearGradient id="vault-iron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="30%" stopColor="#3a3a3a" />
          <stop offset="60%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        {/* Iron highlight */}
        <linearGradient id="vault-iron-highlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#555555" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#666666" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#555555" stopOpacity="0.3" />
        </linearGradient>
        {/* Gold gradient for rivets */}
        <radialGradient id="vault-gold-rivet" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#e8d48b" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#8a7234" />
        </radialGradient>
        {/* Gothic arch clip */}
        <clipPath id="vault-arch-clip">
          <path d="M 20 300 L 20 80 Q 20 20 120 20 Q 220 20 220 80 L 220 300 Z" />
        </clipPath>
      </defs>

      {/* Outer frame */}
      <path
        d="M 10 310 L 10 80 Q 10 10 120 10 Q 230 10 230 80 L 230 310 Z"
        stroke="#555555"
        strokeWidth="3"
        fill="url(#vault-iron)"
      />
      {/* Inner frame */}
      <path
        d="M 20 300 L 20 80 Q 20 20 120 20 Q 220 20 220 80 L 220 300 Z"
        stroke="#444444"
        strokeWidth="2"
        fill="#1a1815"
      />

      {/* Door panel (the part that swings) */}
      <path
        d="M 25 295 L 25 82 Q 25 25 120 25 Q 215 25 215 82 L 215 295 Z"
        fill="url(#vault-iron)"
        stroke="#3a3a3a"
        strokeWidth="1"
      />
      {/* Door highlight stripe */}
      <rect x="30" y="30" width="6" height="260" fill="url(#vault-iron-highlight)" clipPath="url(#vault-arch-clip)" rx="3" />

      {/* Decorative gothic arch lines on door */}
      <path d="M 50 280 L 50 90 Q 50 45 120 45" stroke="#555555" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M 190 280 L 190 90 Q 190 45 120 45" stroke="#555555" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M 75 280 L 75 95 Q 75 60 120 60" stroke="#444444" strokeWidth="0.5" fill="none" opacity="0.25" />
      <path d="M 165 280 L 165 95 Q 165 60 120 60" stroke="#444444" strokeWidth="0.5" fill="none" opacity="0.25" />

      {/* Center vertical line */}
      <line x1="120" y1="45" x2="120" y2="295" stroke="#444444" strokeWidth="0.5" opacity="0.2" />

      {/* Horizontal bands */}
      <rect x="25" y="120" width="190" height="4" rx="1" fill="#444444" opacity="0.3" clipPath="url(#vault-arch-clip)" />
      <rect x="25" y="200" width="190" height="4" rx="1" fill="#444444" opacity="0.3" clipPath="url(#vault-arch-clip)" />

      {/* Gold rivets - outer frame */}
      {[
        { x: 10, y: 30 }, { x: 230, y: 30 },
        { x: 10, y: 80 }, { x: 230, y: 80 },
        { x: 10, y: 140 }, { x: 230, y: 140 },
        { x: 10, y: 200 }, { x: 230, y: 200 },
        { x: 10, y: 260 }, { x: 230, y: 260 },
        { x: 10, y: 310 }, { x: 230, y: 310 },
      ].map((r, i) => (
        <circle key={`fr-${i}`} cx={r.x} cy={r.y} r="4" fill="url(#vault-gold-rivet)" opacity="0.8" />
      ))}

      {/* Gold rivets - inner frame top arch */}
      {[
        { x: 40, y: 38 }, { x: 60, y: 27 }, { x: 80, y: 22 }, { x: 100, y: 20 },
        { x: 120, y: 20 }, { x: 140, y: 20 }, { x: 160, y: 22 }, { x: 180, y: 27 },
        { x: 200, y: 38 },
      ].map((r, i) => (
        <circle key={`ar-${i}`} cx={r.x} cy={r.y} r="3" fill="url(#vault-gold-rivet)" opacity="0.6" />
      ))}

      {/* Gold rivets - door sides */}
      {[
        { x: 35, y: 150 }, { x: 35, y: 200 }, { x: 35, y: 250 },
        { x: 205, y: 150 }, { x: 205, y: 200 }, { x: 205, y: 250 },
      ].map((r, i) => (
        <circle key={`dr-${i}`} cx={r.x} cy={r.y} r="3" fill="url(#vault-gold-rivet)" opacity="0.6" />
      ))}

      {/* Ornate handle (right side) */}
      <g>
        {/* Handle plate */}
        <rect x="195" y="155" width="14" height="50" rx="3" fill="url(#vault-gold-rivet)" opacity="0.7" />
        {/* Handle bar */}
        <rect x="193" y="170" width="18" height="6" rx="2" fill="#c9a84c" opacity="0.8" />
        <rect x="193" y="185" width="18" height="6" rx="2" fill="#c9a84c" opacity="0.8" />
        {/* Handle shadow */}
        <rect x="196" y="160" width="10" height="40" rx="2" fill="none" stroke="#8a7234" strokeWidth="0.5" opacity="0.3" />
      </g>

      {/* Center ornate cross/medallion */}
      <g opacity="0.5">
        <circle cx="120" cy="240" r="18" fill="none" stroke="#555555" strokeWidth="1" />
        <circle cx="120" cy="240" r="14" fill="none" stroke="#444444" strokeWidth="0.5" />
        <line x1="120" y1="226" x2="120" y2="254" stroke="#555555" strokeWidth="0.5" />
        <line x1="106" y1="240" x2="134" y2="240" stroke="#555555" strokeWidth="0.5" />
        <circle cx="120" cy="240" r="5" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Keyhole below medallion */}
      <g>
        <circle cx="120" cy="272" r="6" fill="#111" stroke="#555555" strokeWidth="1" />
        <rect x="118" y="275" width="4" height="10" rx="1" fill="#111" stroke="#555555" strokeWidth="1" />
        <circle cx="120" cy="272" r="3" fill="#0a0a0a" />
      </g>
    </motion.svg>
  );
}

// ─── Memory Card ───
function MemoryCard({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.25, ease: 'easeOut' }}
      className="relative paper-texture border border-[#2a2a2a] rounded-lg p-5 sm:p-6 overflow-hidden"
    >
      {/* Gold corner accents */}
      <GoldCornerAccent position="tl" />
      <GoldCornerAccent position="tr" />
      <GoldCornerAccent position="bl" />
      <GoldCornerAccent position="br" />

      {/* Inner subtle border */}
      <div className="absolute inset-[2px] rounded-[10px] border border-[#c9a84c]/8 pointer-events-none" />

      {/* Memory number */}
      <p className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/40 text-[9px] uppercase tracking-[0.3em] mb-2">
        Recuerdo {index + 1}
      </p>

      {/* Memory text */}
      <p
        className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.03em] italic"
        style={{ textShadow: '0 0 1px rgba(139, 0, 0, 0.1)' }}
      >
        &ldquo;{text}&rdquo;
      </p>

      {/* Decorative end */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/15" />
        <div className="w-1 h-1 rotate-45 bg-[#c9a84c]/20" />
        <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/15" />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function MemoryVault({ className = '' }: MemoryVaultProps) {
  const [combo, setCombo] = useState([0, 0, 0]);
  const [vaultState, setVaultState] = useState<VaultState>('locked');
  const [errorMsg, setErrorMsg] = useState('');
  const [showParticles, setShowParticles] = useState(false);

  const updateDigit = useCallback((index: number, value: number) => {
    setCombo((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setErrorMsg('');
  }, []);

  const handleTryOpen = useCallback(() => {
    if (vaultState !== 'locked') return;

    if (combo[0] === CORRECT_COMBO[0] && combo[1] === CORRECT_COMBO[1] && combo[2] === CORRECT_COMBO[2]) {
      // Correct combination
      setShowParticles(true);
      setVaultState('unlocking');

      setTimeout(() => {
        setVaultState('unlocked');
      }, 600);

      setTimeout(() => {
        setShowParticles(false);
      }, 1200);
    } else {
      // Wrong combination
      setVaultState('shaking');
      setErrorMsg('La bóveda rechaza tu intento...');

      setTimeout(() => {
        setVaultState('locked');
      }, 600);
    }
  }, [combo, vaultState]);

  const handleCloseVault = useCallback(() => {
    setVaultState('closing');

    setTimeout(() => {
      setCombo([0, 0, 0]);
      setErrorMsg('');
      setVaultState('locked');
    }, 500);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && vaultState === 'locked') {
        handleTryOpen();
      }
    },
    [vaultState, handleTryOpen]
  );

  return (
    <div className={`relative ${className}`}>
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-10"
      >
        <motion.p
          className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Capítulo XI — Bóveda
        </motion.p>
        <h2
          className="font-[family-name:var(--font-cinzel-decorative)] text-2xl sm:text-3xl md:text-4xl text-[#c9a84c] tracking-wider"
          style={{
            textShadow: '0 0 20px rgba(201, 168, 76, 0.3), 0 0 40px rgba(201, 168, 76, 0.1)',
          }}
        >
          Bóveda de Recuerdos
        </h2>
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm mt-3 tracking-wide">
          Solo quien conoce el código puede acceder a estos recuerdos
        </p>
      </motion.div>

      {/* Vault container */}
      <div className="relative max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {/* ─── Locked State: Vault Door ─── */}
          {(vaultState === 'locked' || vaultState === 'shaking') && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: 30 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Vault door */}
              <VaultDoorSVG shaking={vaultState === 'shaking'} />

              {/* Combination lock area */}
              <motion.div
                className="mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-b from-[#121010] to-[#0d0a0a] border border-[#2a2a2a] rounded-xl
                  shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onKeyDown={handleKeyDown}
              >
                {/* Lock label */}
                <p className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] sm:text-xs uppercase tracking-[0.25em] text-center mb-4">
                  Combinación
                </p>

                {/* Three wheels */}
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <ComboWheel value={combo[0]} onChange={(v) => updateDigit(0, v)} />
                  <span className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-lg">—</span>
                  <ComboWheel value={combo[1]} onChange={(v) => updateDigit(1, v)} />
                  <span className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-lg">—</span>
                  <ComboWheel value={combo[2]} onChange={(v) => updateDigit(2, v)} />
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="font-[family-name:var(--font-fell)] italic text-[#a00000] text-xs sm:text-sm text-center mt-4"
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Try to open button */}
                <motion.button
                  onClick={handleTryOpen}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-3 rounded-lg border border-[#8B0000]/40 bg-[#8B0000]/10
                    text-[#c9a84c] font-[family-name:var(--font-cinzel)] text-xs sm:text-sm uppercase tracking-[0.15em]
                    hover:bg-[#8B0000]/20 hover:border-[#8B0000]/60
                    transition-all cursor-pointer shadow-[0_0_15px_rgba(139,0,0,0.1)]"
                >
                  Intentar abrir
                </motion.button>

                {/* Hint */}
                <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/50 text-[10px] text-center mt-3 tracking-wide">
                  &ldquo;El corazón recuerda lo que la mente olvida&rdquo;
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ─── Unlocking Animation ─── */}
          {vaultState === 'unlocking' && (
            <motion.div
              key="unlocking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="relative">
                {/* Door opening animation */}
                <div
                  className="relative"
                  style={{ perspective: 800 }}
                >
                  <motion.div
                    animate={{ rotateY: -110 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
                  >
                    <VaultDoorSVG shaking={false} />
                  </motion.div>
                </div>
                {/* Gold glow from inside */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.8] }}
                  transition={{ duration: 0.6 }}
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)',
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* ─── Unlocked State: Memories Revealed ─── */}
          {(vaultState === 'unlocked' || vaultState === 'closing') && (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: vaultState === 'closing' ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Inside vault header */}
              <motion.div
                className="text-center mb-6 sm:mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-lg sm:text-xl tracking-wider"
                  style={{ textShadow: '0 0 15px rgba(201, 168, 76, 0.25)' }}
                >
                  La bóveda se ha abierto
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                  <div className="flex items-center gap-2">
                    <span className="text-[#c9a84c]/30 text-[10px] select-none">&#9670;</span>
                    <span className="text-[#c9a84c]/50 text-xs select-none">&#10022;</span>
                    <span className="text-[#c9a84c]/30 text-[10px] select-none">&#9670;</span>
                  </div>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
                </div>
              </motion.div>

              {/* Memory cards */}
              <div className="w-full space-y-4 sm:space-y-5">
                {MEMORIES.map((memory, index) => (
                  <MemoryCard key={index} text={memory} index={index} />
                ))}
              </div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="mt-8 sm:mt-10"
              >
                <button
                  onClick={handleCloseVault}
                  className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-lg border border-[#2a2a2a]
                    bg-[#111]/80 text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30
                    font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em]
                    transition-all cursor-pointer"
                >
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                    <rect x="1" y="5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" />
                    <path d="M3 5V3.5C3 1.84 4.34 0.5 6 0.5C7.66 0.5 9 1.84 9 3.5V5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="6" cy="9" r="1" fill="currentColor" />
                  </svg>
                  Cerrar bóveda
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle burst */}
        <GoldParticleBurst active={showParticles} />
      </div>
    </div>
  );
}
