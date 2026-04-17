'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmokeParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

function CandleFlame() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Flame glow aura */}
      <div className="candle-glow absolute -inset-8 rounded-full pointer-events-none" />

      {/* Flame SVG */}
      <svg
        width="28"
        height="52"
        viewBox="0 0 28 52"
        className="candle-flicker relative z-10"
      >
        <defs>
          <radialGradient id="flame-outer-grad" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff6600" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flame-inner-grad" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#fff7a0" stopOpacity="1" />
            <stop offset="50%" stopColor="#ffdd44" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="flame-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff7a0" stopOpacity="0.6" />
          </radialGradient>
          <filter id="flame-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Outer flame */}
        <path
          d="M14 48 Q6 38 4 28 Q2 18 8 8 Q12 2 14 0 Q16 2 20 8 Q26 18 24 28 Q22 38 14 48 Z"
          fill="url(#flame-outer-grad)"
          filter="url(#flame-blur)"
          opacity="0.7"
        />

        {/* Inner flame */}
        <path
          d="M14 44 Q9 36 7 28 Q5 20 10 10 Q13 4 14 2 Q15 4 18 10 Q23 20 21 28 Q19 36 14 44 Z"
          fill="url(#flame-inner-grad)"
        />

        {/* Core flame */}
        <path
          d="M14 38 Q11 32 10 26 Q9 20 12 12 Q13.5 6 14 4 Q14.5 6 16 12 Q19 20 18 26 Q17 32 14 38 Z"
          fill="url(#flame-core-grad)"
        />
      </svg>
    </div>
  );
}

function SmokeRise({ lit }: { lit: boolean }) {
  const particles = useMemo<SmokeParticle[]>(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 40 + Math.random() * 20,
        delay: i * 0.8 + Math.random() * 0.5,
        duration: 3 + Math.random() * 2,
        size: 4 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-16 overflow-visible pointer-events-none">
      <AnimatePresence>
        {!lit &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0.6, scale: 0.5 }}
              animate={{
                opacity: [0.5, 0.3, 0],
                y: [0, -20, -40],
                x: [0, Math.sin(p.id) * 8, Math.cos(p.id * 2) * -5],
                scale: [0.5, 1.2, 1.8],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
              }}
              className="absolute bottom-0 rounded-full"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                background: 'radial-gradient(circle, rgba(120,120,120,0.3), transparent)',
                filter: 'blur(2px)',
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

export default function InteractiveCandle() {
  const [isLit, setIsLit] = useState(false);

  const toggleCandle = useCallback(() => {
    setIsLit((prev) => !prev);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center gap-5 select-none"
    >
      {/* Candle wrapper */}
      <div
        className="relative cursor-pointer group"
        onClick={toggleCandle}
        role="button"
        tabIndex={0}
        aria-label={isLit ? 'Apagar la vela' : 'Encender la vela'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCandle();
          }
        }}
      >
        {/* Warm glow when lit */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute -inset-16 rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255,170,0,0.06) 0%, rgba(139,0,0,0.03) 40%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Smoke */}
        <SmokeRise lit={isLit} />

        {/* Full candle SVG */}
        <svg
          width="80"
          height="160"
          viewBox="0 0 80 160"
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="candle-body-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8dcc8" />
              <stop offset="25%" stopColor="#f5efe3" />
              <stop offset="50%" stopColor="#faf6ee" />
              <stop offset="75%" stopColor="#f0e8d8" />
              <stop offset="100%" stopColor="#ddd0bc" />
            </linearGradient>
            <linearGradient id="candle-body-vert" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#faf6ee" />
              <stop offset="60%" stopColor="#f0e8d8" />
              <stop offset="100%" stopColor="#d4c5b0" />
            </linearGradient>
            <linearGradient id="wax-drip-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a00000" />
              <stop offset="100%" stopColor="#8B0000" />
            </linearGradient>
            <linearGradient id="holder-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3a3a" />
              <stop offset="50%" stopColor="#222222" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
            <linearGradient id="holder-rim-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#8a7234" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3a3a3a" />
            </linearGradient>
            <radialGradient id="wax-pool-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#faf6ee" />
              <stop offset="70%" stopColor="#f0e8d8" />
              <stop offset="100%" stopColor="#e0d5c0" />
            </radialGradient>
          </defs>

          {/* Flame group - only shown when lit */}
          <g className="candle-flame-group">
            <AnimatePresence>
              {isLit && (
                <g>
                  {/* Flame glow */}
                  <ellipse cx="40" cy="38" rx="20" ry="18" fill="#ffaa00" opacity="0.06">
                    <animate
                      attributeName="rx"
                      values="20;22;20"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="ry"
                      values="18;20;18"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </ellipse>

                  {/* Outer flame */}
                  <path
                    className="candle-flicker"
                    d="M40 42 Q32 34 30 26 Q28 18 33 8 Q37 2 40 0 Q43 2 47 8 Q52 18 50 26 Q48 34 40 42 Z"
                    fill="url(#flame-outer-grad)"
                    opacity="0.7"
                  />

                  {/* Inner flame */}
                  <path
                    className="candle-flicker"
                    d="M40 40 Q35 34 34 27 Q33 20 36 12 Q38.5 5 40 3 Q41.5 5 44 12 Q47 20 46 27 Q45 34 40 40 Z"
                    fill="url(#flame-inner-grad)"
                  />

                  {/* Core flame */}
                  <path
                    className="candle-flicker"
                    d="M40 36 Q37 32 36 27 Q35 22 38 15 Q39.5 8 40 6 Q40.5 8 42 15 Q45 22 44 27 Q43 32 40 36 Z"
                    fill="url(#flame-core-grad)"
                  />
                </g>
              )}
            </AnimatePresence>
          </g>

          {/* Wick */}
          <line
            x1="40"
            y1="42"
            x2="40"
            y2="52"
            stroke="#2a2a2a"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Wax pool at top */}
          <ellipse
            cx="40"
            cy="52"
            rx="22"
            ry="4"
            fill="url(#wax-pool-grad)"
            opacity="0.8"
          />

          {/* Candle body */}
          <rect
            x="22"
            y="52"
            width="36"
            height="72"
            rx="1"
            fill="url(#candle-body-grad)"
          />
          {/* Vertical shading overlay */}
          <rect
            x="22"
            y="52"
            width="36"
            height="72"
            rx="1"
            fill="url(#candle-body-vert)"
            opacity="0.4"
          />

          {/* Red wax drips - left side */}
          <path
            d="M26 56 Q24 65 25 75 Q26 80 24 85 Q23 88 25 90"
            stroke="url(#wax-drip-grad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M28 54 Q26 60 27 68 Q28 72 26 78"
            stroke="url(#wax-drip-grad)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Red wax drips - right side */}
          <path
            d="M54 58 Q56 68 55 78 Q54 84 56 90 Q57 94 55 98"
            stroke="url(#wax-drip-grad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M52 55 Q54 62 53 70"
            stroke="url(#wax-drip-grad)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Wax drip blobs */}
          <ellipse cx="24" cy="91" rx="4" ry="3" fill="#8B0000" opacity="0.7" />
          <ellipse cx="56" cy="99" rx="4.5" ry="3" fill="#8B0000" opacity="0.6" />

          {/* Subtle candle texture lines */}
          <line x1="30" y1="54" x2="30" y2="124" stroke="#d4c5b0" strokeWidth="0.3" opacity="0.3" />
          <line x1="36" y1="54" x2="36" y2="124" stroke="#d4c5b0" strokeWidth="0.3" opacity="0.2" />
          <line x1="44" y1="54" x2="44" y2="124" stroke="#d4c5b0" strokeWidth="0.3" opacity="0.2" />
          <line x1="50" y1="54" x2="50" y2="124" stroke="#d4c5b0" strokeWidth="0.3" opacity="0.3" />

          {/* Holder - ornate base */}
          {/* Holder plate top rim */}
          <rect
            x="14"
            y="124"
            width="52"
            height="6"
            rx="2"
            fill="url(#holder-rim-grad)"
          />
          {/* Holder plate body */}
          <rect
            x="16"
            y="130"
            width="48"
            height="16"
            rx="1"
            fill="url(#holder-grad)"
          />
          {/* Holder plate bottom rim */}
          <rect
            x="12"
            y="146"
            width="56"
            height="5"
            rx="2"
            fill="url(#holder-rim-grad)"
          />
          {/* Holder base */}
          <rect
            x="10"
            y="151"
            width="60"
            height="8"
            rx="2"
            fill="url(#holder-grad)"
          />

          {/* Gold decorative accents on holder */}
          <line x1="18" y1="132" x2="18" y2="144" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
          <line x1="62" y1="132" x2="62" y2="144" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
          <line x1="40" y1="132" x2="40" y2="144" stroke="#c9a84c" strokeWidth="0.5" opacity="0.2" />

          {/* Small ornamental dots on holder */}
          <circle cx="24" cy="138" r="1" fill="#c9a84c" opacity="0.2" />
          <circle cx="32" cy="138" r="1" fill="#c9a84c" opacity="0.2" />
          <circle cx="48" cy="138" r="1" fill="#c9a84c" opacity="0.2" />
          <circle cx="56" cy="138" r="1" fill="#c9a84c" opacity="0.2" />

          {/* Holder bottom decorative line */}
          <line x1="18" y1="153" x2="62" y2="153" stroke="#c9a84c" strokeWidth="0.5" opacity="0.15" />
        </svg>

        {/* Click hint on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          initial={false}
        >
          <div className="w-16 h-16 rounded-full border border-[#c9a84c]/10" />
        </motion.div>
      </div>

      {/* Text below */}
      <AnimatePresence mode="wait">
        <motion.p
          key={isLit ? 'lit' : 'unlit'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
          className={`font-[family-name:var(--font-fell)] italic text-center text-sm sm:text-base px-8 leading-relaxed ${
            isLit ? 'text-[#c9a84c]/80' : 'text-[#8a7e6b]'
          }`}
          style={
            isLit
              ? { textShadow: '0 0 10px rgba(201, 168, 76, 0.15)' }
              : undefined
          }
        >
          {isLit
            ? 'Esta vela arde por nosotros'
            : 'Enciende esta vela para iluminar nuestros recuerdos'}
        </motion.p>
      </AnimatePresence>

      {/* Small instruction */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="font-[family-name:var(--font-cinzel)] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#5a5040] text-center"
      >
        — haz clic para {isLit ? 'apagar' : 'encender'} —
      </motion.span>
    </motion.div>
  );
}
