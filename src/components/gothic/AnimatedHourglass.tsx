'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================================================
   Types
   ================================================================ */

interface AnimatedHourglassProps {
  className?: string;
  message?: string;
}

interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

/* ================================================================
   Constants
   ================================================================ */

const SAND_CYCLE = 30; // seconds

/* ================================================================
   Dust Particles — floating golden dust around the hourglass
   ================================================================ */

function DustParticles() {
  const particles = useMemo<DustParticle[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 1.5 + Math.random() * 2.5,
        delay: i * 1.2 + Math.random() * 0.8,
        duration: 6 + Math.random() * 6,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(201,168,76,0.5), transparent)',
          }}
          animate={{
            opacity: [0, 0.6, 0.3, 0],
            y: [0, -20 - Math.random() * 30, 10, -40 - Math.random() * 20],
            x: [0, Math.sin(p.id) * 10, Math.cos(p.id * 2) * -8, Math.sin(p.id * 3) * 12],
            scale: [0.5, 1, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   Hourglass SVG — ornate gothic hourglass with sand animation
   ================================================================ */

function HourglassSVG({ isFlipped, flipKey }: { isFlipped: boolean; flipKey: number }) {
  return (
    <svg
      viewBox="0 0 120 220"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* Glass gradient for bulbs */}
        <linearGradient id="hg-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(201,168,76,0.08)" />
          <stop offset="20%" stopColor="rgba(201,168,76,0.03)" />
          <stop offset="50%" stopColor="rgba(201,168,76,0.01)" />
          <stop offset="80%" stopColor="rgba(201,168,76,0.03)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0.08)" />
        </linearGradient>

        {/* Glass reflection highlight */}
        <linearGradient id="hg-glass-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
        </linearGradient>

        {/* Frame metal gradient */}
        <linearGradient id="hg-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="30%" stopColor="#222222" />
          <stop offset="70%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>

        {/* Gold accent gradient */}
        <linearGradient id="hg-gold-vert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" />
          <stop offset="50%" stopColor="#8a7234" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>

        {/* Sand color gradient */}
        <linearGradient id="hg-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#a08536" />
        </linearGradient>

        {/* Sand glow filter */}
        <filter id="hg-sand-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Top cap (ornate gothic frame) ──────────────── */}
      <rect x="30" y="8" width="60" height="10" rx="2" fill="url(#hg-metal)" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Gold accent lines on top cap */}
      <line x1="35" y1="11" x2="85" y2="11" stroke="#c9a84c" strokeWidth="0.4" opacity="0.4" />
      <line x1="35" y1="15" x2="85" y2="15" stroke="#c9a84c" strokeWidth="0.4" opacity="0.25" />
      {/* Small decorative dots on top cap */}
      <circle cx="40" cy="13" r="1" fill="#c9a84c" opacity="0.3" />
      <circle cx="60" cy="13" r="1.2" fill="#c9a84c" opacity="0.35" />
      <circle cx="80" cy="13" r="1" fill="#c9a84c" opacity="0.3" />
      {/* Gothic finial on top */}
      <path d="M56 8 L54 2 L60 0 L66 2 L64 8 Z" fill="url(#hg-metal)" stroke="#c9a84c" strokeWidth="0.4" strokeOpacity="0.3" />
      <line x1="60" y1="0" x2="60" y2="4" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />

      {/* ── Top frame pillars (left & right) ──────────── */}
      <rect x="32" y="18" width="4" height="10" rx="1" fill="url(#hg-metal)" />
      <rect x="84" y="18" width="4" height="10" rx="1" fill="url(#hg-metal)" />
      {/* Pillar gold trim */}
      <line x1="32" y1="22" x2="36" y2="22" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
      <line x1="84" y1="22" x2="88" y2="22" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />

      {/* ── Top bulb (glass) ──────────────────────────── */}
      <path
        d="M34 28 Q34 25 42 22 Q55 18 60 18 Q65 18 78 22 Q86 25 86 28 L86 80 Q86 95 60 100 Q34 95 34 80 Z"
        fill="url(#hg-glass)"
        stroke="rgba(201,168,76,0.15)"
        strokeWidth="0.5"
      />
      {/* Glass reflection */}
      <path
        d="M38 30 Q38 28 44 25 Q52 22 55 22 L55 75 Q52 82 38 78 Z"
        fill="url(#hg-glass-shine)"
        opacity="0.6"
      />

      {/* ── Sand in top bulb (decreasing) ─────────────── */}
      <clipPath id="hg-top-bulb">
        <path d="M36 30 Q36 27 44 24 Q55 20 60 20 Q65 20 76 24 Q84 27 84 30 L84 78 Q84 93 60 98 Q36 93 36 78 Z" />
      </clipPath>
      <g clipPath="url(#hg-top-bulb)">
        <rect
          className="hg-sand-top"
          x="36"
          y="30"
          width="48"
          height="68"
          fill="url(#hg-sand)"
          opacity="0.7"
        />
      </g>

      {/* ── Center joint (ornate gothic) ──────────────── */}
      <rect x="28" y="97" width="64" height="6" rx="2" fill="url(#hg-metal)" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.4" />
      {/* Gold decorative line on center */}
      <line x1="33" y1="100" x2="87" y2="100" stroke="#c9a84c" strokeWidth="0.4" opacity="0.35" />
      {/* Filigree ornaments on center joint */}
      <path d="M48 98 Q52 95 56 98 Q52 101 48 98 Z" fill="#c9a84c" opacity="0.2" />
      <path d="M64 98 Q68 95 72 98 Q68 101 64 98 Z" fill="#c9a84c" opacity="0.2" />
      <circle cx="60" cy="100" r="1.5" fill="#c9a84c" opacity="0.3" />

      {/* ── Sand stream through neck ──────────────────── */}
      <rect
        className="hg-sand-stream"
        x="58.5"
        y="50"
        width="3"
        height="50"
        fill="url(#hg-sand)"
        opacity="0.6"
        filter="url(#hg-sand-glow)"
      />

      {/* ── Individual falling sand particles ─────────── */}
      <g className="hg-sand-particles">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={59 + (i % 2 === 0 ? -1 : 1)}
            r={0.8}
            fill="#c9a84c"
            opacity="0.8"
            className="hg-particle"
            style={{
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </g>

      {/* ── Bottom bulb (glass) ───────────────────────── */}
      <path
        d="M34 120 Q34 125 42 128 Q55 132 60 132 Q65 132 78 128 Q86 125 86 120 L86 190 Q86 200 60 204 Q34 200 34 190 Z"
        fill="url(#hg-glass)"
        stroke="rgba(201,168,76,0.15)"
        strokeWidth="0.5"
      />
      {/* Glass reflection */}
      <path
        d="M38 122 Q38 124 44 126 Q50 128 52 128 L52 185 Q50 192 38 188 Z"
        fill="url(#hg-glass-shine)"
        opacity="0.6"
      />

      {/* ── Sand in bottom bulb (growing pile) ────────── */}
      <clipPath id="hg-bottom-bulb">
        <path d="M36 122 Q36 126 44 130 Q55 134 60 134 Q65 134 76 130 Q84 126 84 122 L84 188 Q84 198 60 202 Q36 198 36 188 Z" />
      </clipPath>
      <g clipPath="url(#hg-bottom-bulb)">
        <ellipse
          className="hg-sand-bottom-pile"
          cx="60"
          cy="198"
          rx="24"
          ry="0"
          fill="url(#hg-sand)"
          opacity="0.7"
        />
      </g>

      {/* ── Bottom frame pillars (left & right) ───────── */}
      <rect x="32" y="192" width="4" height="10" rx="1" fill="url(#hg-metal)" />
      <rect x="84" y="192" width="4" height="10" rx="1" fill="url(#hg-metal)" />
      {/* Pillar gold trim */}
      <line x1="32" y1="196" x2="36" y2="196" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
      <line x1="84" y1="196" x2="88" y2="196" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />

      {/* ── Bottom cap (ornate gothic frame) ───────────── */}
      <rect x="30" y="202" width="60" height="10" rx="2" fill="url(#hg-metal)" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3" />
      {/* Gold accent lines on bottom cap */}
      <line x1="35" y1="205" x2="85" y2="205" stroke="#c9a84c" strokeWidth="0.4" opacity="0.4" />
      <line x1="35" y1="209" x2="85" y2="209" stroke="#c9a84c" strokeWidth="0.4" opacity="0.25" />
      {/* Small decorative dots on bottom cap */}
      <circle cx="40" cy="207" r="1" fill="#c9a84c" opacity="0.3" />
      <circle cx="60" cy="207" r="1.2" fill="#c9a84c" opacity="0.35" />
      <circle cx="80" cy="207" r="1" fill="#c9a84c" opacity="0.3" />
      {/* Gothic finial on bottom */}
      <path d="M56 212 L54 218 L60 220 L66 218 L64 212 Z" fill="url(#hg-metal)" stroke="#c9a84c" strokeWidth="0.4" strokeOpacity="0.3" />
      <line x1="60" y1="216" x2="60" y2="220" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />

      {/* ── Side filigree decorations ─────────────────── */}
      {/* Left side gothic arch */}
      <path
        d="M24 40 Q18 80 24 130 Q18 170 24 180"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.4"
        opacity="0.15"
      />
      <path
        d="M22 60 Q16 80 22 100 Q16 120 22 140"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.3"
        opacity="0.1"
      />
      {/* Right side gothic arch */}
      <path
        d="M96 40 Q102 80 96 130 Q102 170 96 180"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.4"
        opacity="0.15"
      />
      <path
        d="M98 60 Q104 80 98 100 Q104 120 98 140"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.3"
        opacity="0.1"
      />

      {/* ── Sand glow at the neck ─────────────────────── */}
      <ellipse
        className="hg-sand-neck-glow"
        cx="60"
        cy="100"
        rx="8"
        ry="12"
        fill="#c9a84c"
        opacity="0.04"
      />
    </svg>
  );
}

/* ================================================================
   AnimatedHourglass — Main Component
   ================================================================ */

export default function AnimatedHourglass({ className = '', message }: AnimatedHourglassProps) {
  const [flipCount, setFlipCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipCount((prev) => prev + 1);
    // Re-enable interaction after animation completes
    setTimeout(() => setIsAnimating(false), 1500);
  }, [isAnimating]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip],
  );

  // Rotation angle based on flip count (alternates 0 and 180)
  const rotation = (flipCount % 2) * 180;

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-6 py-10 px-4 select-none ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Title ──────────────────────────────────────── */}
      <motion.h2
        className="font-[family-name:var(--font-cinzel-decorative)] text-center text-xl sm:text-2xl md:text-3xl"
        style={{
          color: '#c9a84c',
          textShadow: '0 0 20px rgba(201,168,76,0.3), 0 0 40px rgba(201,168,76,0.1)',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        El Reloj del Destino
      </motion.h2>

      {/* ── Subtitle ───────────────────────────────────── */}
      <motion.p
        className="font-[family-name:var(--font-fell)] italic text-center text-sm sm:text-base px-6 leading-relaxed"
        style={{ color: '#d4c5b0', opacity: 0.7 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        El tiempo fluye como arena entre nuestros dedos
      </motion.p>

      {/* ── Hourglass wrapper ──────────────────────────── */}
      <div className="relative flex items-center justify-center">
        {/* Floating dust particles */}
        <DustParticles />

        {/* Pulsing shadow beneath the hourglass */}
        <motion.div
          className="absolute bottom-[-8px] left-1/2 -translate-x-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            width: '60%',
            height: 12,
            background: 'radial-gradient(ellipse at center, rgba(139,0,0,0.3), transparent 70%)',
            filter: 'blur(4px)',
          }}
        />

        {/* Clickable hourglass area */}
        <motion.div
          className="relative cursor-pointer w-36 h-56 sm:w-44 sm:h-64 md:w-52 md:h-72 lg:w-60 lg:h-80"
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Voltear el reloj de arena"
          style={{ outline: 'none' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated SVG with flip rotation */}
          <motion.div
            key={flipCount}
            initial={{ rotate: -180, opacity: 0.5 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="w-full h-full"
          >
            {/* Sand animation key is reset on each flip */}
            <HourglassSVG isFlipped={flipCount % 2 !== 0} flipKey={flipCount} />
          </motion.div>

          {/* Sand animation layer (CSS keyframes, reset on flip) */}
          <div
            key={`sand-anim-${flipCount}`}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top sand decreasing */}
            <style>{`
              .hg-sand-top {
                animation: hgSandTopDecrease ${SAND_CYCLE}s linear forwards;
              }
              .hg-sand-bottom-pile {
                animation: hgSandBottomGrow ${SAND_CYCLE}s linear forwards;
              }
              .hg-sand-stream {
                animation: hgSandStreamFlow 1.5s linear infinite;
              }
              .hg-particle {
                animation: hgParticleFall 1.2s linear infinite;
              }
              .hg-sand-neck-glow {
                animation: hgNeckGlow 2s ease-in-out infinite;
              }
            `}</style>
          </div>

          {/* Hover glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            whileHover={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                border: '1px solid rgba(201,168,76,0.08)',
                boxShadow: '0 0 30px rgba(201,168,76,0.05)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Third text line ────────────────────────────── */}
      <motion.p
        className="font-[family-name:var(--font-fell)] italic text-center text-xs sm:text-sm px-8 leading-relaxed"
        style={{ color: '#8a7e6b' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Cada grano es un momento que compartimos
      </motion.p>

      {/* ── Optional message ───────────────────────────── */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="divider-glow-center w-full max-w-sm px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
            <p
              className="font-[family-name:var(--font-fell)] italic text-center text-xs sm:text-sm leading-relaxed px-4"
              style={{
                color: '#c9a84c',
                opacity: 0.6,
                textShadow: '0 0 8px rgba(201,168,76,0.15)',
              }}
            >
              {message}
            </p>
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Flip button ────────────────────────────────── */}
      <motion.button
        onClick={handleFlip}
        className="gothic-btn btn-press font-[family-name:var(--font-cinzel)] text-xs sm:text-sm uppercase tracking-[0.2em] px-6 py-2.5 rounded-sm border border-[#c9a84c]/20 bg-[#111111] hover:bg-[#1a1a1a] transition-colors duration-300"
        style={{
          color: '#c9a84c',
          textShadow: '0 0 6px rgba(201,168,76,0.2)',
        }}
        disabled={isAnimating}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ borderColor: 'rgba(201,168,76,0.4)' }}
        whileTap={{ scale: 0.97 }}
      >
        Voltear el Reloj
      </motion.button>

      {/* ── Instruction text ───────────────────────────── */}
      <motion.span
        className="font-[family-name:var(--font-cinzel)] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-center"
        style={{ color: '#3a3528' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        — haz clic o pulsa Enter para voltear —
      </motion.span>
    </motion.div>
  );
}
