'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface GothicGraveyardRosesProps {
  className?: string;
}

interface PlantedRose {
  id: string;
  color: string;
  colorName: string;
}

interface Gravestone {
  id: number;
  name: string;
  dates: string;
  shape: 'pointed' | 'rounded' | 'cross' | 'cracked' | 'ornate';
  tilt: number;
  roses: PlantedRose[];
}

// ─── Rose Varieties ───
const ROSE_VARIETIES = [
  { color: '#8B0000', name: 'Rosa Roja', label: 'roja', lighter: '#b00000', darker: '#5a0000' },
  { color: '#1a1a2e', name: 'Rosa Negra', label: 'negra', lighter: '#2a2a4e', darker: '#0a0a1e' },
  { color: '#e8e0d0', name: 'Rosa Blanca', label: 'blanca', lighter: '#f0ece4', darker: '#b0a890' },
  { color: '#2a4080', name: 'Rosa Azul', label: 'azul', lighter: '#4060b0', darker: '#1a2850' },
  { color: '#5a2a6e', name: 'Rosa P&uacute;rpura', label: 'p&uacute;rpura', lighter: '#7a4a8e', darker: '#3a1a4e' },
  { color: '#c9a84c', name: 'Rosa Dorada', label: 'dorada', lighter: '#d4b86a', darker: '#8a7234' },
] as const;

// ─── Gravestone Data ───
const INITIAL_GRAVESTONES: Gravestone[] = [
  { id: 0, name: 'Rosa Negra', dates: '1847-1892', shape: 'pointed', tilt: -2, roses: [] },
  { id: 1, name: 'Amor Eterno', dates: '???-???', shape: 'rounded', tilt: 1.5, roses: [] },
  { id: 2, name: 'Conde Sombra', dates: '1812-1866', shape: 'cross', tilt: -1, roses: [] },
  { id: 3, name: 'Dulce Pena', dates: '1901-1945', shape: 'cracked', tilt: 2.5, roses: [] },
  { id: 4, name: 'Alma Perdida', dates: '???-???', shape: 'ornate', tilt: -1.8, roses: [] },
];

const MAX_ROSES_PER_STONE = 3;

// ─── Firefly Data ───
interface FireflyData {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}

function generateFireflies(): FireflyData[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    top: 8 + Math.random() * 60,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 2 + Math.random() * 2.5,
  }));
}

// ─── SVG Rose Head (compact) ───
function MiniRoseSVG({ color, lighter, darker }: { color: string; lighter: string; darker: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id={`mr-${color}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={lighter} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={darker} />
        </radialGradient>
      </defs>
      {/* Outer petals */}
      <ellipse cx="9" cy="10" rx="5" ry="3.5" fill={darker} opacity="0.5" transform="rotate(-30 9 10)" />
      <ellipse cx="15" cy="10" rx="5" ry="3.5" fill={darker} opacity="0.5" transform="rotate(30 15 10)" />
      <ellipse cx="12" cy="7" rx="4" ry="5" fill={darker} opacity="0.5" />
      {/* Middle petals */}
      <ellipse cx="10" cy="10" rx="4" ry="3" fill={color} opacity="0.7" transform="rotate(-20 10 10)" />
      <ellipse cx="14" cy="10" rx="4" ry="3" fill={color} opacity="0.7" transform="rotate(20 14 10)" />
      <ellipse cx="12" cy="9" rx="3.5" ry="4" fill={color} opacity="0.75" />
      {/* Inner petals */}
      <ellipse cx="11" cy="10" rx="2.5" ry="2" fill={lighter} opacity="0.8" transform="rotate(-10 11 10)" />
      <ellipse cx="13" cy="10" rx="2.5" ry="2" fill={lighter} opacity="0.8" transform="rotate(10 13 10)" />
      {/* Center */}
      <circle cx="12" cy="10" r="1.5" fill={darker} opacity="0.6" />
    </svg>
  );
}

// ─── Gravestone SVG ───
function GravestoneSVG({
  shape,
  name,
  dates,
  tilt,
}: {
  shape: Gravestone['shape'];
  name: string;
  dates: string;
  tilt: number;
}) {
  const baseColor = '#2a2a2a';
  const highlightColor = '#3a3a3a';
  const shadowColor = '#1a1a1a';

  const stonePath = () => {
    switch (shape) {
      case 'pointed':
        return (
          <path
            d="M35 85 L35 35 Q35 15 50 10 Q65 15 65 35 L65 85 Z"
            fill={baseColor}
            stroke={highlightColor}
            strokeWidth="0.5"
          />
        );
      case 'rounded':
        return (
          <path
            d="M30 85 L30 40 Q30 15 50 15 Q70 15 70 40 L70 85 Z"
            fill={baseColor}
            stroke={highlightColor}
            strokeWidth="0.5"
          />
        );
      case 'cross':
        return (
          <g>
            <path
              d="M30 85 L30 30 Q30 15 50 15 Q70 15 70 30 L70 85 Z"
              fill={baseColor}
              stroke={highlightColor}
              strokeWidth="0.5"
            />
            {/* Cross on top */}
            <line x1="50" y1="5" x2="50" y2="20" stroke={highlightColor} strokeWidth="2" />
            <line x1="43" y1="10" x2="57" y2="10" stroke={highlightColor} strokeWidth="2" />
          </g>
        );
      case 'cracked':
        return (
          <g>
            <path
              d="M30 85 L30 30 Q30 12 50 12 Q70 12 70 30 L70 85 Z"
              fill={baseColor}
              stroke={highlightColor}
              strokeWidth="0.5"
            />
            {/* Crack line */}
            <path
              d="M48 20 L50 30 L47 38 L52 48 L49 55 L51 60"
              stroke={shadowColor}
              strokeWidth="0.8"
              fill="none"
            />
          </g>
        );
      case 'ornate':
        return (
          <g>
            <path
              d="M30 85 L30 30 Q30 10 50 8 Q70 10 70 30 L70 85 Z"
              fill={baseColor}
              stroke={highlightColor}
              strokeWidth="0.5"
            />
            {/* Ornate cross */}
            <line x1="50" y1="2" x2="50" y2="18" stroke={highlightColor} strokeWidth="2.5" />
            <line x1="42" y1="8" x2="58" y2="8" stroke={highlightColor} strokeWidth="2" />
            <circle cx="50" cy="4" r="1.5" fill="none" stroke={highlightColor} strokeWidth="0.8" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width="100"
      height="90"
      viewBox="0 0 100 90"
      style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'bottom center' }}
      aria-hidden="true"
    >
      {/* Stone shadow */}
      <ellipse cx="52" cy="87" rx="22" ry="3" fill="rgba(0,0,0,0.3)" />
      {/* Base mound */}
      <ellipse cx="50" cy="85" rx="24" ry="5" fill="#1a2010" opacity="0.5" />
      {/* Stone */}
      {stonePath()}
      {/* Surface texture highlights */}
      <path
        d="M38 25 Q42 22 48 25"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d="M55 28 Q60 25 64 28"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth="0.5"
        fill="none"
      />
      {/* Inscription */}
      <text
        x="50"
        y={shape === 'cross' ? 48 : 45}
        textAnchor="middle"
        fontFamily="'Cinzel', serif"
        fontSize="6"
        fill="rgba(201,168,76,0.35)"
        letterSpacing="0.5"
      >
        {name}
      </text>
      <text
        x="50"
        y={shape === 'cross' ? 56 : 53}
        textAnchor="middle"
        fontFamily="'Cinzel', serif"
        fontSize="4.5"
        fill="rgba(138,126,107,0.3)"
      >
        {dates}
      </text>
      {/* Bottom border */}
      <line x1="38" y1="82" x2="62" y2="82" stroke={highlightColor} strokeWidth="0.3" opacity="0.3" />
    </svg>
  );
}

// ─── Moon SVG ───
function MoonSVG() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      className="moon-glow"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="moonGrad" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#f0e8d0" />
          <stop offset="60%" stopColor="#d4c8a8" />
          <stop offset="100%" stopColor="#b0a888" />
        </radialGradient>
        <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Halo */}
      <circle cx="30" cy="30" r="30" fill="url(#moonHalo)" />
      {/* Moon body */}
      <circle cx="30" cy="30" r="14" fill="url(#moonGrad)" />
      {/* Craters */}
      <circle cx="25" cy="26" r="2.5" fill="rgba(0,0,0,0.06)" />
      <circle cx="34" cy="32" r="1.8" fill="rgba(0,0,0,0.05)" />
      <circle cx="28" cy="35" r="1.2" fill="rgba(0,0,0,0.04)" />
    </svg>
  );
}

// ─── Bare Tree SVG ───
function BareTreeSVG({ flip = false }: { flip?: boolean }) {
  const transform = flip ? 'scale(-1,1) translate(-100,0)' : undefined;
  return (
    <svg
      width="80"
      height="120"
      viewBox="0 0 80 120"
      style={{ transform, opacity: 0.15 }}
      aria-hidden="true"
    >
      {/* Trunk */}
      <path
        d="M40 120 Q38 90 36 70 Q35 55 40 40"
        stroke="#2a2018"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Main branches */}
      <path d="M38 70 Q25 55 15 50" stroke="#2a2018" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M39 55 Q50 40 60 35" stroke="#2a2018" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M36 60 Q22 45 18 35" stroke="#2a2018" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Smaller branches */}
      <path d="M25 52 Q18 42 12 40" stroke="#2a2018" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M15 50 Q8 44 5 38" stroke="#2a2018" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M50 42 Q55 32 62 28" stroke="#2a2018" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M22 43 Q16 35 20 25" stroke="#2a2018" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M58 38 Q65 30 60 22" stroke="#2a2018" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Twigs */}
      <path d="M12 40 L8 35" stroke="#2a2018" strokeWidth="0.5" fill="none" />
      <path d="M18 35 L14 28" stroke="#2a2018" strokeWidth="0.5" fill="none" />
      <path d="M62 28 L66 24" stroke="#2a2018" strokeWidth="0.5" fill="none" />
      <path d="M20 25 L24 20" stroke="#2a2018" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// ─── Iron Fence SVG ───
function IronFenceSVG() {
  return (
    <svg
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      className="w-full h-[35px] sm:h-[45px]"
      style={{ opacity: 0.2 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
      {/* Horizontal bars */}
      <rect x="0" y="15" width="600" height="1.5" fill="url(#gfGrad)" />
      <rect x="0" y="32" width="600" height="1.5" fill="url(#gfGrad)" />
      {/* Pickets */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = i * 40 + 10;
        return (
          <g key={i}>
            <line x1={x} y1="5" x2={x} y2="35" stroke="#2a2a2a" strokeWidth="1.5" />
            <path d={`M${x - 3} 10 L${x} 3 L${x + 3} 10`} fill="none" stroke="#3a3a3a" strokeWidth="1" />
            <circle cx={x} cy="6" r="1" fill="#3a3a3a" opacity="0.4" />
          </g>
        );
      })}
      {/* Decorative arches */}
      {Array.from({ length: 3 }, (_, i) => {
        const cx = i * 200 + 110;
        return (
          <path
            key={`arch-${i}`}
            d={`M${cx - 15} 15 Q${cx} 3 ${cx + 15} 15`}
            fill="none"
            stroke="#3a3a3a"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}

// ─── Main Component ───
export default function GothicGraveyardRoses({ className }: GothicGraveyardRosesProps) {
  const [gravestones, setGravestones] = useState<Gravestone[]>(INITIAL_GRAVESTONES);
  const [selectedStone, setSelectedStone] = useState<number | null>(null);
  const [selectedRose, setSelectedRose] = useState<number | null>(null);

  const fireflies = useMemo(() => generateFireflies(), []);

  const totalRoses = useMemo(
    () => gravestones.reduce((sum, g) => sum + g.roses.length, 0),
    [gravestones],
  );

  const handleStoneClick = useCallback(
    (id: number) => {
      setSelectedStone((prev) => (prev === id ? null : id));
      // If a rose is already selected, plant it immediately
      setSelectedRose((prevRose) => {
        if (prevRose !== null && prevRose !== undefined) {
          setGravestones((stones) =>
            stones.map((stone) => {
              if (stone.id === id && stone.roses.length < MAX_ROSES_PER_STONE) {
                const variety = ROSE_VARIETIES[prevRose];
                return {
                  ...stone,
                  roses: [
                    ...stone.roses,
                    {
                      id: `rose-${Date.now()}-${Math.random()}`,
                      color: variety.color,
                      colorName: variety.name,
                    },
                  ],
                };
              }
              return stone;
            }),
          );
          return null;
        }
        return prevRose;
      });
    },
    [],
  );

  const handleRoseClick = useCallback(
    (roseIndex: number) => {
      if (selectedStone === null) {
        // Select the rose for next stone click
        setSelectedRose((prev) => (prev === roseIndex ? null : roseIndex));
        return;
      }
      // Plant on selected stone
      const stone = gravestones.find((g) => g.id === selectedStone);
      if (!stone || stone.roses.length >= MAX_ROSES_PER_STONE) {
        setSelectedRose((prev) => (prev === roseIndex ? null : roseIndex));
        return;
      }
      const variety = ROSE_VARIETIES[roseIndex];
      setGravestones((stones) =>
        stones.map((s) => {
          if (s.id === selectedStone && s.roses.length < MAX_ROSES_PER_STONE) {
            return {
              ...s,
              roses: [
                ...s.roses,
                {
                  id: `rose-${Date.now()}-${Math.random()}`,
                  color: variety.color,
                  colorName: variety.name,
                },
              ],
            };
          }
          return s;
        }),
      );
      setSelectedRose(null);
    },
    [selectedStone, gravestones],
  );

  return (
    <section
      className={`relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 overflow-hidden ${className ?? ''}`}
      aria-label="Jard\u00edn de Rosas Eternas"
    >
      {/* ─── Title ─── */}
      <motion.h2
        className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-2xl sm:text-3xl md:text-4xl text-center tracking-[0.08em]"
        style={{
          textShadow: '0 0 15px rgba(201, 168, 76, 0.3), 0 0 30px rgba(201, 168, 76, 0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
      >
        Jard&iacute;n de Rosas Eternas
      </motion.h2>

      {/* ─── Subtitle ─── */}
      <motion.p
        className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base text-center mt-3 tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        Cada rosa es una promesa que trasciende la muerte
      </motion.p>

      {/* ─── Ornamental Divider ─── */}
      <motion.div
        className="flex items-center justify-center gap-3 my-6 sm:my-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.25 }}
        aria-hidden="true"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
        <span className="text-[#c9a84c]/40 text-xs select-none">&#10022;</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
      </motion.div>

      {/* ─── Graveyard Scene ─── */}
      <motion.div
        className="relative rounded-xl overflow-hidden border border-[#2a2a2a]/60"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* ── Sky ── */}
        <div
          className="relative w-full"
          style={{
            background: 'linear-gradient(180deg, #0a0a14 0%, #0d0d1a 30%, #111118 60%, #0a0a0a 100%)',
            minHeight: '340px',
          }}
        >
          {/* Moon */}
          <div className="absolute top-3 right-4 sm:top-5 sm:right-8 moon-float">
            <MoonSVG />
          </div>

          {/* Bare trees */}
          <div className="absolute bottom-[42%] left-2 sm:left-6">
            <BareTreeSVG />
          </div>
          <div className="absolute bottom-[42%] right-2 sm:right-6">
            <BareTreeSVG flip />
          </div>

          {/* ── Firefly Particles ── */}
          {fireflies.map((f) => (
            <div
              key={f.id}
              className="firefly-float absolute pointer-events-none rounded-full"
              style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: f.size,
                height: f.size,
                background: 'radial-gradient(circle, rgba(201,168,76,0.8), rgba(201,168,76,0.2))',
                boxShadow: '0 0 4px rgba(201,168,76,0.5), 0 0 8px rgba(201,168,76,0.2)',
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
              }}
              aria-hidden="true"
            />
          ))}

          {/* ── Iron Fence ── */}
          <div className="absolute top-[12%] left-0 right-0">
            <IronFenceSVG />
          </div>

          {/* ── Ground ── */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '45%',
              background:
                'linear-gradient(180deg, #0d0f08 0%, #111a0e 20%, #141f10 50%, #1a2510 100%)',
            }}
          >
            {/* Grass texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle, #3a5a2a 1px, transparent 1px)',
                backgroundSize: '10px 8px',
              }}
            />
            {/* Earth patches */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(80,50,30,0.5) 30px, rgba(80,50,30,0.5) 31px)',
              }}
            />
          </div>

          {/* ── Gravestones Row ── */}
          <div className="absolute bottom-[20%] left-0 right-0 flex justify-center items-end gap-1 sm:gap-3 md:gap-5 px-2 sm:px-8">
            {gravestones.map((stone, idx) => {
              const isSelected = selectedStone === stone.id;
              const isFull = stone.roses.length >= MAX_ROSES_PER_STONE;
              return (
                <motion.div
                  key={stone.id}
                  className="relative flex flex-col items-center cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  onClick={() => handleStoneClick(stone.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStoneClick(stone.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`L&aacute;pida de ${stone.name}${isSelected ? ' (seleccionada)' : ''}`}
                  aria-pressed={isSelected}
                >
                  {/* Selection glow */}
                  {isSelected && (
                    <motion.div
                      className="absolute -inset-4 rounded-lg pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)',
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Full indicator */}
                  {isFull && (
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                      style={{
                        background: '#8B0000',
                        boxShadow: '0 0 6px rgba(139,0,0,0.5)',
                      }}
                      aria-label="L&aacute;pida llena"
                    />
                  )}

                  <GravestoneSVG
                    shape={stone.shape}
                    name={stone.name}
                    dates={stone.dates}
                    tilt={stone.tilt}
                  />

                  {/* ── Planted Roses ── */}
                  <div className="relative flex gap-0.5 mt-[-4px] h-7 items-end">
                    <AnimatePresence>
                      {stone.roses.map((rose, rIdx) => {
                        const variety = ROSE_VARIETIES.find((v) => v.color === rose.color);
                        return (
                          <motion.div
                            key={rose.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: rIdx * 0.05,
                              type: 'spring',
                              stiffness: 200,
                              damping: 15,
                            }}
                            className="relative"
                            title={rose.colorName}
                            aria-label={`${rose.colorName} plantada en ${stone.name}`}
                          >
                            <MiniRoseSVG
                              color={rose.color}
                              lighter={variety?.lighter ?? rose.color}
                              darker={variety?.darker ?? rose.color}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Stone name on hover (mobile: always show) */}
                  <p className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[8px] sm:text-[9px] tracking-wider uppercase mt-0.5 opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity text-center max-w-[80px] truncate sm:max-w-none">
                    {stone.name}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ── Fog Layer ── */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none overflow-hidden" aria-hidden="true">
            <div
              className="graveyard-fog absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(20,26,14,0.3) 40%, transparent 100%)',
              }}
            />
            <div
              className="mist-layer absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 60%)',
                opacity: 0.4,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── Rose Selection Panel ─── */}
      <motion.div
        className="mt-8 sm:mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Instructions */}
        <p className="font-[family-name:var(--font-fell)] text-[#8a7e6b] text-xs sm:text-sm text-center mb-4 italic">
          {selectedStone !== null
            ? `L&aacute;pida "${gravestones.find((g) => g.id === selectedStone)?.name}" seleccionada &mdash; elige una rosa`
            : selectedRose !== null
              ? `Rosa "${ROSE_VARIETIES[selectedRose]?.name}" elegida &mdash; toca una l&aacute;pida`
              : 'Toca una l&aacute;pida y luego una rosa para plantarla en su memoria'}
        </p>

        {/* Rose Buttons */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
          {ROSE_VARIETIES.map((rose, idx) => {
            const isRoseSelected = selectedRose === idx;
            return (
              <motion.button
                type="button"
                key={rose.color}
                className="relative flex flex-col items-center p-2 sm:p-3 rounded-lg border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/40"
                style={{
                  borderColor: isRoseSelected
                    ? `${rose.color}80`
                    : 'rgba(42,42,42,0.6)',
                  backgroundColor: isRoseSelected
                    ? `${rose.color}15`
                    : 'rgba(26,26,26,0.8)',
                  boxShadow: isRoseSelected
                    ? `0 0 20px ${rose.color}30, 0 0 40px ${rose.color}10`
                    : 'none',
                }}
                onClick={() => handleRoseClick(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRoseClick(idx);
                  }
                }}
                tabIndex={0}
                aria-label={`Plantar ${rose.name}`}
                aria-pressed={isRoseSelected}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                  <MiniRoseSVG
                    color={rose.color}
                    lighter={rose.lighter}
                    darker={rose.darker}
                  />
                </div>
                <span
                  className="font-[family-name:var(--font-cinzel)] text-[8px] sm:text-[10px] tracking-wider uppercase mt-1"
                  style={{ color: isRoseSelected ? rose.color : '#8a7e6b' }}
                >
                  {rose.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Rose Counter ─── */}
      <motion.p
        className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/60 text-xs sm:text-sm text-center mt-6 tracking-[0.15em]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {totalRoses} ros{totalRoses === 1 ? 'a' : 'as'} plantad{totalRoses === 1 ? 'a' : 'as'} en memoria
      </motion.p>
    </section>
  );
}
