'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================================================
   Types
   ================================================================ */

interface GothicConstellationMapProps {
  className?: string;
}

interface ConnectableStar {
  id: number;
  x: number;
  y: number;
  name: string;
}

interface BackgroundStar {
  id: number;
  x: number;
  y: number;
  r: number;
  opacity: number;
}

interface CelebrationParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  duration: number;
}

/* ================================================================
   Constants — 8 connectable stars in heart shape (viewBox 500×400)
   ================================================================ */

const CONNECTABLE_STARS: ConnectableStar[] = [
  { id: 0, x: 250, y: 340, name: 'Coraz\u00f3n' },
  { id: 1, x: 320, y: 290, name: 'Alma' },
  { id: 2, x: 375, y: 225, name: 'Destino' },
  { id: 3, x: 380, y: 155, name: 'Sombra' },
  { id: 4, x: 320, y: 100, name: 'Luz' },
  { id: 5, x: 250, y: 135, name: 'Eco' },
  { id: 6, x: 180, y: 100, name: 'Fuego' },
  { id: 7, x: 120, y: 155, name: 'Eternidad' },
];

const STAR_COUNT = 30;

/* ================================================================
   Helpers
   ================================================================ */

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function buildBackgroundStars(): BackgroundStar[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: seededRandom(i * 7 + 3) * 500,
    y: seededRandom(i * 13 + 17) * 400,
    r: 0.5 + seededRandom(i * 23 + 5) * 1.2,
    opacity: 0.2 + seededRandom(i * 31 + 11) * 0.4,
  }));
}

function buildCelebrationParticles(): CelebrationParticle[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 250,
    y: 210,
    angle: (i / 20) * 360 + seededRandom(i * 41 + 7) * 15,
    distance: 60 + seededRandom(i * 53 + 13) * 120,
    size: 2 + seededRandom(i * 67 + 19) * 4,
    color: seededRandom(i * 79 + 23) > 0.4 ? '#c9a84c' : '#8B0000',
    duration: 0.6 + seededRandom(i * 89 + 29) * 0.6,
  }));
}

/* ================================================================
   Sub-components
   ================================================================ */

function StarTooltip({ star, visible }: { star: ConnectableStar; visible: boolean }) {
  return (
    <g aria-hidden="true">
      <rect
        x={star.x - 38}
        y={star.y - 38}
        width={76}
        height={18}
        rx={4}
        fill="rgba(10,10,10,0.92)"
        stroke="rgba(42,42,42,0.8)"
        strokeWidth={0.5}
        opacity={visible ? 1 : 0}
        style={{ transition: 'opacity 0.2s ease' }}
      />
      <text
        x={star.x}
        y={star.y - 25}
        textAnchor="middle"
        fontFamily="'Cinzel', serif"
        fontSize={10}
        fill="#c9a84c"
        opacity={visible ? 1 : 0}
        style={{ transition: 'opacity 0.2s ease' }}
      >
        {star.name}
      </text>
    </g>
  );
}

function ShootingStarSVG({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <g aria-hidden="true">
      <line
        x1={60}
        y1={30}
        x2={120}
        y2={65}
        stroke="url(#shootingGrad)"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.8}
      />
      <circle cx={60} cy={30} r={2} fill="#d4c5b0" opacity={0.9}>
        <animate
          attributeName="cx"
          from={60}
          to={460}
          dur="1.2s"
          fill="freeze"
        />
        <animate
          attributeName="cy"
          from={30}
          to={250}
          dur="1.2s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          values="0;0.9;0.7;0"
          dur="1.2s"
          fill="freeze"
        />
      </circle>
      <line
        x1={60}
        y1={30}
        x2={120}
        y2={65}
        stroke="url(#shootingGrad)"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <animate
          attributeName="x1"
          from={60}
          to={460}
          dur="1.2s"
          fill="freeze"
        />
        <animate
          attributeName="y1"
          from={30}
          to={250}
          dur="1.2s"
          fill="freeze"
        />
        <animate
          attributeName="x2"
          from={120}
          to={520}
          dur="1.2s"
          fill="freeze"
        />
        <animate
          attributeName="y2"
          from={65}
          to={285}
          dur="1.2s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0.5;0"
          dur="1.2s"
          fill="freeze"
        />
      </line>
    </g>
  );
}

/* ================================================================
   Main Component
   ================================================================ */

export default function GothicConstellationMap({ className = '' }: GothicConstellationMapProps) {
  const [connectedStars, setConnectedStars] = useState<number[]>([]);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [showShootingStar, setShowShootingStar] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);

  const bgStars = useMemo(() => buildBackgroundStars(), []);
  const celebrationParticles = useMemo(() => buildCelebrationParticles(), []);

  const isComplete = connectedStars.length === 8;
  const isStarConnected = useCallback(
    (id: number) => connectedStars.includes(id),
    [connectedStars],
  );
  const isNextStar = useCallback(
    (id: number) => connectedStars.length < 8 && id === connectedStars.length,
    [connectedStars],
  );

  /* ---- Shooting star timer ---- */
  useEffect(() => {
    const fire = () => {
      setShowShootingStar(true);
      setTimeout(() => setShowShootingStar(false), 1400);
    };
    fire();
    const interval = setInterval(fire, 8000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  /* ---- Handle star click ---- */
  const handleStarClick = useCallback(
    (id: number) => {
      if (isComplete) return;
      if (id !== connectedStars.length) return;

      const newConnected = [...connectedStars, id];
      setConnectedStars(newConnected);

      if (newConnected.length === 8) {
        setTimeout(() => {
          setShowCelebration(true);
          setShowCompleteMessage(true);
        }, 400);
        setTimeout(() => setShowCelebration(false), 1800);
      }
    },
    [connectedStars, isComplete],
  );

  /* ---- Handle star key press (accessibility) ---- */
  const handleStarKeyDown = useCallback(
    (e: React.KeyboardEvent, id: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStarClick(id);
      }
    },
    [handleStarClick],
  );

  /* ---- Reset ---- */
  const handleClear = useCallback(() => {
    setConnectedStars([]);
    setShowCelebration(false);
    setShowCompleteMessage(false);
  }, []);

  /* ---- Build connection lines ---- */
  const connectionLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
    for (let i = 0; i < connectedStars.length - 1; i++) {
      const a = CONNECTABLE_STARS[connectedStars[i]];
      const b = CONNECTABLE_STARS[connectedStars[i + 1]];
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, key: `${i}-${i + 1}` });
    }
    // Close the heart
    if (connectedStars.length === 8) {
      const first = CONNECTABLE_STARS[connectedStars[0]];
      const last = CONNECTABLE_STARS[connectedStars[7]];
      lines.push({ x1: last.x, y1: last.y, x2: first.x, y2: first.y, key: '7-0' });
    }
    return lines;
  }, [connectedStars]);

  /* ---- Twinkling star indices (3-4) ---- */
  const twinkleIndices = useMemo(() => [2, 9, 17, 25], []);

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* ---- Title ---- */}
      <motion.div
        className="text-center mb-4 sm:mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2
          className="font-[family-name:var(--font-cinzel-decorative)] text-xl sm:text-2xl md:text-3xl text-[#c9a84c] tracking-wider mb-2"
          style={{
            textShadow: '0 0 20px rgba(201, 168, 76, 0.3), 0 0 40px rgba(201, 168, 76, 0.1)',
          }}
        >
          Mapa Estelar del Amor
        </h2>
        <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base">
          Conecta las estrellas para revelar tu constelaci&oacute;n
        </p>
      </motion.div>

      {/* ---- Star Map SVG ---- */}
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Celebration particles overlay */}
        <AnimatePresence>
          {showCelebration && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-10"
              aria-hidden="true"
            >
              {celebrationParticles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                    y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: p.duration, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <svg
          viewBox="0 0 500 400"
          className="w-full h-auto"
          role="img"
          aria-label="Mapa estelar interactivo con 8 estrellas conectables"
          style={{
            borderRadius: '12px',
            border: '1px solid rgba(42, 42, 42, 0.6)',
            overflow: 'hidden',
          }}
        >
          {/* ---- Defs: gradients & filters ---- */}
          <defs>
            {/* Background gradient */}
            <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#0d0b1a" />
              <stop offset="60%" stopColor="#08070f" />
              <stop offset="100%" stopColor="#050408" />
            </radialGradient>

            {/* Subtle purple nebula */}
            <radialGradient id="nebulaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(45,27,61,0.15)" />
              <stop offset="100%" stopColor="rgba(45,27,61,0)" />
            </radialGradient>

            {/* Gold glow for stars */}
            <radialGradient id="starGlow">
              <stop offset="0%" stopColor="rgba(201,168,76,0.6)" />
              <stop offset="50%" stopColor="rgba(201,168,76,0.15)" />
              <stop offset="100%" stopColor="rgba(201,168,76,0)" />
            </radialGradient>

            {/* Bright connected star glow */}
            <radialGradient id="starGlowBright">
              <stop offset="0%" stopColor="rgba(201,168,76,0.9)" />
              <stop offset="40%" stopColor="rgba(201,168,76,0.3)" />
              <stop offset="100%" stopColor="rgba(201,168,76,0)" />
            </radialGradient>

            {/* Line glow filter */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Heart glow filter */}
            <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shooting star gradient */}
            <linearGradient id="shootingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(201,168,76,0.8)" />
              <stop offset="100%" stopColor="rgba(201,168,76,0)" />
            </linearGradient>
          </defs>

          {/* ---- Background ---- */}
          <rect width="500" height="400" fill="url(#bgGrad)" />

          {/* ---- Nebula cloud ---- */}
          <ellipse cx="390" cy="70" rx="110" ry="80" fill="url(#nebulaGrad)" opacity={0.6} />
          <ellipse cx="100" cy="350" rx="80" ry="60" fill="url(#nebulaGrad)" opacity={0.3} />

          {/* ---- Background stars (30 small dots) ---- */}
          {bgStars.map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#d4c5b0"
              opacity={s.opacity}
            >
              {/* Some stars twinkle */}
              {twinkleIndices.includes(s.id) && (
                <animate
                  attributeName="opacity"
                  values={`${s.opacity};${Math.min(1, s.opacity + 0.4)};${s.opacity}`}
                  dur={`${2.5 + s.id * 0.3}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          ))}

          {/* ---- Additional twinkling stars (3-4 more) ---- */}
          {[{ cx: 40, cy: 60 }, { cx: 460, cy: 320 }, { cx: 250, cy: 20 }, { cx: 80, cy: 280 }].map(
            (s, i) => (
              <circle key={`twinkle-${i}`} cx={s.cx} cy={s.cy} r={1} fill="#c9a84c" opacity={0.3}>
                <animate
                  attributeName="opacity"
                  values="0.2;0.7;0.2"
                  dur={`${3 + i * 1.5}s`}
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="0.8;1.5;0.8"
                  dur={`${3 + i * 1.5}s`}
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ),
          )}

          {/* ---- Shooting star ---- */}
          <ShootingStarSVG active={showShootingStar} />

          {/* ---- Connection lines ---- */}
          {connectionLines.map((line) => (
            <g key={line.key}>
              {/* Glow layer */}
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#c9a84c"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.25}
                filter="url(#lineGlow)"
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="0.25"
                  dur="0.5s"
                  fill="freeze"
                />
              </line>
              {/* Core line */}
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#c9a84c"
                strokeWidth={1.2}
                strokeLinecap="round"
                opacity={0.8}
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="0.8"
                  dur="0.5s"
                  fill="freeze"
                />
              </line>
            </g>
          ))}

          {/* ---- Heart shape revealed when complete ---- */}
          <AnimatePresence>
            {isComplete && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <path
                  d={
                    'M250,345 ' +
                    'C250,345 205,310 180,280 ' +
                    'C155,250 135,220 130,185 ' +
                    'C125,155 140,120 170,105 ' +
                    'C195,92 225,100 250,135 ' +
                    'C275,100 305,92 330,105 ' +
                    'C360,120 375,155 370,185 ' +
                    'C365,220 345,250 320,280 ' +
                    'C295,310 250,345 250,345 Z'
                  }
                  fill="rgba(201,168,76,0.03)"
                  stroke="#c9a84c"
                  strokeWidth={0.8}
                  strokeDasharray="4 2"
                  opacity={0.3}
                  filter="url(#heartGlow)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* ---- Connectable stars ---- */}
          {CONNECTABLE_STARS.map((star) => {
            const connected = isStarConnected(star.id);
            const next = isNextStar(star.id);
            const hovered = hoveredStar === star.id;
            const glowRadius = connected ? 18 : hovered ? 16 : 14;
            const starRadius = connected ? 5 : hovered ? 4.5 : 3.5;

            return (
              <g
                key={star.id}
                onClick={() => handleStarClick(star.id)}
                onKeyDown={(e) => handleStarKeyDown(e, star.id)}
                tabIndex={0}
                role="button"
                aria-label={`${star.name}${connected ? ' (conectada)' : next ? ' (siguiente estrella)' : ''}`}
                className="outline-none"
                style={{ cursor: next ? 'pointer' : 'default' }}
                onMouseEnter={() => setHoveredStar(star.id)}
                onMouseLeave={() => setHoveredStar(null)}
                onFocus={() => setHoveredStar(star.id)}
                onBlur={() => setHoveredStar(null)}
              >
                {/* Tooltip */}
                <StarTooltip star={star} visible={hovered || connected} />

                {/* Glow circle */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={glowRadius}
                  fill={connected ? 'url(#starGlowBright)' : 'url(#starGlow)'}
                  opacity={connected ? 1 : next ? 0.8 : 0.4}
                >
                  {/* Pulse animation for next star */}
                  {next && !isComplete && (
                    <animate
                      attributeName="r"
                      values={`${glowRadius};${glowRadius + 4};${glowRadius}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                  {next && !isComplete && (
                    <animate
                      attributeName="opacity"
                      values="0.8;0.4;0.8"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>

                {/* Star core */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={starRadius}
                  fill={connected ? '#f0dca0' : next ? '#c9a84c' : '#8a7e6b'}
                  opacity={connected ? 1 : next ? 0.9 : 0.6}
                  style={{
                    transition: 'fill 0.3s ease, opacity 0.3s ease',
                  }}
                />

                {/* Bright center for connected stars */}
                {connected && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={2}
                    fill="#fff8e0"
                    opacity={0.8}
                  />
                )}

                {/* Order number for connected stars */}
                {connected && (
                  <text
                    x={star.x}
                    y={star.y + 22}
                    textAnchor="middle"
                    fontFamily="'Cinzel', serif"
                    fontSize={9}
                    fill="#c9a84c"
                    opacity={0.5}
                  >
                    {star.id + 1}
                  </text>
                )}

                {/* Next star indicator: small ring */}
                {next && !isComplete && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={8}
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth={0.5}
                    opacity={0.4}
                    strokeDasharray="2 2"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${star.x} ${star.y}`}
                      to={`360 ${star.x} ${star.y}`}
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* ---- Info Panel ---- */}
      <motion.div
        className="mt-4 sm:mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Progress counter */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className="font-[family-name:var(--font-typewriter)] text-xs sm:text-sm tracking-wider"
            style={{ color: '#8a7e6b' }}
          >
            {connectedStars.length} / 8 estrellas conectadas
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-px mx-auto mb-4 bg-[#2a2a2a] relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ background: 'linear-gradient(to right, #c9a84c, #f0dca0)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(connectedStars.length / 8) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Completion message */}
        <AnimatePresence>
          {showCompleteMessage && (
            <motion.p
              className="font-[family-name:var(--font-fell)] italic text-[#c9a84c] text-sm sm:text-base mb-4"
              style={{
                textShadow: '0 0 10px rgba(201, 168, 76, 0.2)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Tu constelaci&oacute;n ha sido revelada... los destinos est&aacute;n entrelazados
            </motion.p>
          )}
        </AnimatePresence>

        {/* Clear button */}
        <button
          onClick={handleClear}
          className="font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-300 cursor-pointer py-1 px-4 border border-[#2a2a2a] hover:border-[#c9a84c]/30 rounded-sm"
          aria-label="Limpiar todas las conexiones de estrellas"
        >
          Limpiar
        </button>
      </motion.div>
    </div>
  );
}
