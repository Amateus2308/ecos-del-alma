'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

const SYNODIC_MONTH = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

const PHASE_NAMES = [
  'Luna Nueva',
  'Creciente',
  'Cuarto Creciente',
  'Gibosa Creciente',
  'Luna Llena',
  'Gibosa Menguante',
  'Cuarto Menguante',
  'Menguante',
] as const;

/** Moon circle centre and radius in SVG viewBox coordinates */
const CX = 100;
const CY = 100;
const R = 80;

/** Crater positions (normalised –1…+1 relative to moon centre) */
const CRATERS = [
  { x: 0.15, y: -0.25, r: 0.1 },
  { x: -0.3, y: 0.1, r: 0.07 },
  { x: 0.25, y: 0.3, r: 0.055 },
  { x: -0.12, y: -0.4, r: 0.045 },
  { x: 0.35, y: -0.05, r: 0.035 },
  { x: -0.2, y: 0.35, r: 0.06 },
  { x: 0.05, y: 0.15, r: 0.04 },
] as const;

/** Decorative twinkling stars placed around the moon */
const STARS = [
  { top: '2%', left: '3%', size: 2, delay: 0, duration: 3 },
  { top: '3%', left: '92%', size: 1.5, delay: 0.8, duration: 4 },
  { top: '93%', left: '3%', size: 2.5, delay: 1.5, duration: 3.5 },
  { top: '91%', left: '93%', size: 1.5, delay: 2.2, duration: 2.8 },
] as const;

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

interface MoonPhaseInfo {
  phase: number;        // 0 – 1
  phaseName: string;
  illumination: number; // 0 – 100
}

/* ═══════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════ */

/**
 * Calculate the current moon phase from a Unix‑ms timestamp.
 * Uses a known new‑moon reference (Jan 6 2000 18:14 UTC) and the
 * synodic month length to determine the position within the lunar cycle.
 */
function calculateMoonPhase(now: number): MoonPhaseInfo {
  const daysSince = (now - KNOWN_NEW_MOON) / 86_400_000;
  const raw = daysSince / SYNODIC_MONTH;
  const phase = ((raw % 1) + 1) % 1;
  const illumination = Math.round(
    ((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100,
  );
  const phaseIndex = Math.round(phase * 8) % 8;

  return { phase, phaseName: PHASE_NAMES[phaseIndex], illumination };
}

/**
 * Build an SVG path string for the illuminated portion of the moon.
 *
 * The terminator (shadow boundary) is rendered as an elliptical arc
 * whose horizontal radius is `|cos(phase × 2π)| × R`.  The sweep
 * direction of that arc controls whether the lit region appears as a
 * crescent or gibbous shape.
 */
function buildMoonPath(phase: number): string {
  const tx = Math.abs(Math.cos(phase * 2 * Math.PI)) * R;

  if (phase <= 0.5) {
    // Waxing — illuminated on the right
    const sweep = phase <= 0.25 ? 1 : 0;
    return [
      `M ${CX},${CY - R}`,
      `A ${R},${R} 0 0 1 ${CX},${CY + R}`,
      `A ${tx},${R} 0 0 ${sweep} ${CX},${CY - R}`,
    ].join(' ');
  }

  // Waning — illuminated on the left
  const sweep = phase <= 0.75 ? 1 : 0;
  return [
    `M ${CX},${CY - R}`,
    `A ${R},${R} 0 0 0 ${CX},${CY + R}`,
    `A ${tx},${R} 0 0 ${sweep} ${CX},${CY - R}`,
  ].join(' ');
}

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

export default function GothicMoonPhase() {
  const [moonInfo, setMoonInfo] = useState<MoonPhaseInfo>(() =>
    calculateMoonPhase(Date.now()),
  );

  /* Recalculate every 60 s — the phase changes extremely slowly */
  useEffect(() => {
    const id = setInterval(
      () => setMoonInfo(calculateMoonPhase(Date.now())),
      60_000,
    );
    return () => clearInterval(id);
  }, []);

  const moonPath = useMemo(
    () => buildMoonPath(moonInfo.phase),
    [moonInfo.phase],
  );

  return (
    <motion.div
      className="relative flex flex-col items-center py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── Moon + stars area ─────────────────────────────── */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
        {/* Twinkling stars — pure CSS animation, staggered via delay */}
        {STARS.map((s, i) => (
          <span
            key={i}
            className="star-twinkle absolute rounded-full pointer-events-none"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              backgroundColor: '#c9a84c',
              boxShadow: `0 0 ${s.size * 2}px rgba(201,168,76,0.5)`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Float wrapper — kept separate from Framer Motion to
            avoid transform conflicts between CSS translateY and
            Framer Motion's inline scale. */}
        <div className="moon-float absolute inset-0">
          {/* Glow + entry animation wrapper */}
          <motion.div
            className="moon-glow w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: 'easeOut' }}
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              role="img"
              aria-label={`Fase lunar: ${moonInfo.phaseName}`}
            >
              <defs>
                {/* Soft radial glow behind the moon */}
                <radialGradient id="mg-ambient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
                </radialGradient>

                {/* Gold → blood‑red gradient for the lit surface */}
                <linearGradient
                  id="mg-lit"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#a03030" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B0000" stopOpacity="0.7" />
                </linearGradient>

                {/* Clip to moon circle (for crater shadows) */}
                <clipPath id="mg-clip">
                  <circle cx={CX} cy={CY} r={R} />
                </clipPath>
              </defs>

              {/* Ambient halo */}
              <circle
                cx={CX}
                cy={CY}
                r={R + 20}
                fill="url(#mg-ambient)"
              />

              {/* Dark moon base with subtle gold border */}
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="#0d0d0d"
                stroke="#c9a84c"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />

              {/* Craters on the dark surface */}
              {CRATERS.map((c, i) => (
                <circle
                  key={`d${i}`}
                  cx={CX + c.x * R}
                  cy={CY + c.y * R}
                  r={c.r * R}
                  fill="#1a1a1a"
                  opacity="0.7"
                />
              ))}

              {/* Illuminated portion */}
              <path d={moonPath} fill="url(#mg-lit)" />

              {/* Subtle crater shadows on the lit surface */}
              <g clipPath="url(#mg-clip)">
                {CRATERS.map((c, i) => (
                  <circle
                    key={`l${i}`}
                    cx={CX + c.x * R}
                    cy={CY + c.y * R}
                    r={c.r * R * 0.85}
                    fill="#0a0a0a"
                    opacity="0.12"
                  />
                ))}
              </g>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ── Phase name ───────────────────────────────────── */}
      <motion.h3
        className="font-[family-name:var(--font-cinzel)] mt-6 text-center text-lg sm:text-xl md:text-2xl"
        style={{
          color: '#c9a84c',
          textShadow: '0 0 15px rgba(201,168,76,0.3)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {moonInfo.phaseName}
      </motion.h3>

      {/* ── Illumination percentage ──────────────────────── */}
      <motion.p
        className="font-[family-name:var(--font-cinzel)] mt-2 text-sm"
        style={{ color: '#8a7e6b' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {moonInfo.illumination}% de iluminación
      </motion.p>

      {/* ── Italic subtitle ──────────────────────────────── */}
      <motion.p
        className="font-[family-name:var(--font-fell)] italic mt-4 text-center text-xs sm:text-sm px-4"
        style={{ color: '#8a7e6b' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        La luna vigila nuestros secretos
      </motion.p>
    </motion.div>
  );
}
