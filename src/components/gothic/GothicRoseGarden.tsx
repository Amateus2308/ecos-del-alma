'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface RoseMessage {
  rose: string;
  message: string;
}

interface GothicRoseGardenProps {
  messages?: RoseMessage[];
}

// ─── Default Messages ───
const DEFAULT_MESSAGES: RoseMessage[] = [
  { rose: 'Rosa Negra', message: 'En la oscuridad más profunda, florece lo más eterno.' },
  { rose: 'Rosa Carmesí', message: 'Cada pétalo es un suspiro que te dedicó mi alma.' },
  { rose: 'Rosa Dorada', message: 'El oro de tu presencia ilumina hasta los rincones más sombríos.' },
  { rose: 'Rosa Plateada', message: 'Bajo la luna, nuestros caminos se entrelazan como enredaderas.' },
  { rose: 'Rosa Blanca', message: 'Pureza no es ausencia de sombra, sino la elección de la luz.' },
  { rose: 'Rosa Violeta', message: 'En el jardín prohibido, encontré la flor que solo florece para nosotros.' },
];

const ROSE_COLORS = ['#1a1a2e', '#8B0000', '#c9a84c', '#8a8a9a', '#e8e0d0', '#6b3fa0'] as const;

// ─── Firefly Particles ───
interface FireflyData {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
}

function generateFireflies(): FireflyData[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 8 + Math.random() * 84,
    top: 10 + Math.random() * 70,
    delay: Math.random() * 6,
    duration: 5 + Math.random() * 4,
    size: 2 + Math.random() * 2,
  }));
}

// ─── SVG Rose Component ───
function RoseSVG({ color, index }: { color: string; index: number }) {
  const isDark = color === '#1a1a2e';
  const isCrimson = color === '#8B0000';
  const isGold = color === '#c9a84c';
  const isSilver = color === '#8a8a9a';
  const isWhite = color === '#e8e0d0';
  const isViolet = color === '#6b3fa0';

  // Compute lighter and darker shades for depth
  const lighterColor = useMemo(() => {
    if (isDark) return '#2a2a4e';
    if (isCrimson) return '#b00000';
    if (isGold) return '#d4b86a';
    if (isSilver) return '#a0a0b0';
    if (isWhite) return '#f0ece4';
    if (isViolet) return '#8b5fc0';
    return color;
  }, [color, isDark, isCrimson, isGold, isSilver, isWhite, isViolet]);

  const darkerColor = useMemo(() => {
    if (isDark) return '#0a0a1e';
    if (isCrimson) return '#5a0000';
    if (isGold) return '#8a7234';
    if (isSilver) return '#5a5a6a';
    if (isWhite) return '#b0a890';
    if (isViolet) return '#3a1a60';
    return color;
  }, [color, isDark, isCrimson, isGold, isSilver, isWhite, isViolet]);

  // Rotate each rose slightly for organic feel
  const rotation = [-8, 5, -3, 10, -6, 4][index] ?? 0;

  return (
    <svg
      width="100"
      height="130"
      viewBox="0 0 100 130"
      className="ornate-icon"
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`petalGrad${index}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={lighterColor} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={darkerColor} />
        </radialGradient>
        <linearGradient id={`stemGrad${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d4a1e" />
          <stop offset="100%" stopColor="#1a3010" />
        </linearGradient>
        <linearGradient id={`leafGrad${index}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a6a28" />
          <stop offset="100%" stopColor="#1e3e14" />
        </linearGradient>
      </defs>

      {/* Stem */}
      <path
        d="M50 55 Q48 75 50 95 Q52 110 48 125"
        stroke="url(#stemGrad)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left leaf */}
      <path
        d="M48 82 Q30 72 22 78 Q30 86 48 82Z"
        fill="url(#leafGrad)"
        opacity="0.8"
      />
      <path
        d="M48 82 Q35 77 22 78"
        stroke="#1a3010"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />

      {/* Right leaf */}
      <path
        d="M50 96 Q68 86 76 92 Q68 100 50 96Z"
        fill="url(#leafGrad)"
        opacity="0.8"
      />
      <path
        d="M50 96 Q63 91 76 92"
        stroke="#1a3010"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />

      {/* Left thorn */}
      <path d="M48 75 L42 70 L46 74" fill="#2d4a1e" />
      {/* Right thorn */}
      <path d="M50 88 L56 83 L52 87" fill="#2d4a1e" />
      {/* Left thorn 2 */}
      <path d="M49 105 L43 100 L47 104" fill="#2d4a1e" />

      {/* Rose head — 6 petal layers */}
      {/* Outermost petals */}
      <ellipse cx="35" cy="42" rx="14" ry="10" fill={darkerColor} opacity="0.5" transform="rotate(-30 35 42)" />
      <ellipse cx="65" cy="42" rx="14" ry="10" fill={darkerColor} opacity="0.5" transform="rotate(30 65 42)" />
      <ellipse cx="50" cy="32" rx="12" ry="14" fill={darkerColor} opacity="0.5" transform="rotate(0 50 32)" />
      <ellipse cx="38" cy="52" rx="13" ry="9" fill={darkerColor} opacity="0.45" transform="rotate(-20 38 52)" />
      <ellipse cx="62" cy="52" rx="13" ry="9" fill={darkerColor} opacity="0.45" transform="rotate(20 62 52)" />

      {/* Middle petals */}
      <ellipse cx="40" cy="40" rx="11" ry="8" fill={color} opacity="0.7" transform="rotate(-25 40 40)" />
      <ellipse cx="60" cy="40" rx="11" ry="8" fill={color} opacity="0.7" transform="rotate(25 60 40)" />
      <ellipse cx="50" cy="36" rx="9" ry="11" fill={color} opacity="0.75" />

      {/* Inner petals */}
      <ellipse cx="44" cy="38" rx="8" ry="6" fill={lighterColor} opacity="0.8" transform="rotate(-15 44 38)" />
      <ellipse cx="56" cy="38" rx="8" ry="6" fill={lighterColor} opacity="0.8" transform="rotate(15 56 38)" />
      <ellipse cx="50" cy="40" rx="7" ry="8" fill={lighterColor} opacity="0.85" />

      {/* Center spiral */}
      <circle cx="50" cy="40" r="4" fill={darkerColor} opacity="0.6" />
      <path
        d="M50 40 Q48 37 50 35 Q53 33 54 36 Q55 39 52 40 Q49 41 50 40Z"
        fill={lighterColor}
        opacity="0.9"
      />

      {/* Subtle highlight on top petals */}
      <ellipse cx="46" cy="35" rx="4" ry="2" fill="white" opacity="0.06" transform="rotate(-20 46 35)" />
      <ellipse cx="54" cy="35" rx="3" ry="1.5" fill="white" opacity="0.04" transform="rotate(15 54 35)" />
    </svg>
  );
}

// ─── Gothic Iron Fence SVG ───
function IronFence() {
  return (
    <div className="w-full overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-[50px] sm:h-[60px]"
        style={{ opacity: 0.25 }}
      >
        <defs>
          <linearGradient id="fenceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
        </defs>

        {/* Horizontal bars */}
        <rect x="0" y="22" width="1200" height="2" fill="url(#fenceGrad)" />
        <rect x="0" y="48" width="1200" height="2" fill="url(#fenceGrad)" />

        {/* Vertical pickets with gothic points */}
        {Array.from({ length: 30 }, (_, i) => {
          const x = i * 40 + 10;
          return (
            <g key={i}>
              <line x1={x} y1="8" x2={x} y2="50" stroke="#2a2a2a" strokeWidth="2" />
              {/* Gothic pointed top */}
              <path
                d={`M${x - 4} 14 L${x} 4 L${x + 4} 14`}
                fill="none"
                stroke="#3a3a3a"
                strokeWidth="1.5"
              />
              {/* Decorative knob */}
              <circle cx={x} cy="8" r="1.5" fill="#3a3a3a" opacity="0.5" />
            </g>
          );
        })}

        {/* Decorative arches between every 5th picket */}
        {Array.from({ length: 5 }, (_, i) => {
          const cx = i * 240 + 130;
          return (
            <path
              key={`arch-${i}`}
              d={`M${cx - 20} 22 Q${cx} 6 ${cx + 20} 22`}
              fill="none"
              stroke="#3a3a3a"
              strokeWidth="1.5"
              opacity="0.6"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Gothic Arch above Title ───
function GothicArch() {
  return (
    <div className="flex justify-center mb-2" aria-hidden="true">
      <svg width="220" height="60" viewBox="0 0 220 60" className="ornate-icon">
        {/* Main arch */}
        <path
          d="M10 58 Q10 10 110 6 Q210 10 210 58"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="1.2"
          opacity="0.35"
        />
        {/* Inner arch */}
        <path
          d="M20 58 Q20 18 110 14 Q200 18 200 58"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="0.5"
          opacity="0.2"
        />
        {/* Center diamond */}
        <rect
          x="106" y="2" width="8" height="8"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="0.8"
          opacity="0.3"
          transform="rotate(45 110 6)"
        />
        {/* Side ornaments */}
        <circle cx="30" cy="30" r="2" fill="#c9a84c" opacity="0.15" />
        <circle cx="190" cy="30" r="2" fill="#c9a84c" opacity="0.15" />
        {/* Bottom corners */}
        <path d="M10 58 L10 50 M10 58 L20 58" stroke="#c9a84c" strokeWidth="1" opacity="0.25" />
        <path d="M210 58 L210 50 M210 58 L200 58" stroke="#c9a84c" strokeWidth="1" opacity="0.25" />
        {/* Top point decoration */}
        <line x1="110" y1="2" x2="110" y2="0" stroke="#c9a84c" strokeWidth="0.5" opacity="0.2" />
      </svg>
    </div>
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
      className={`absolute w-5 h-5 sm:w-6 sm:h-6 border-[#c9a84c]/30 pointer-events-none ${classes[position]}`}
      aria-hidden="true"
    />
  );
}

// ─── Main Component ───
export default function GothicRoseGarden({ messages }: GothicRoseGardenProps) {
  const roses = useMemo(() => messages ?? DEFAULT_MESSAGES, [messages]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const fireflies = useMemo(() => generateFireflies(), []);

  const handleRoseClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 overflow-hidden">
      {/* ─── Gothic Arch ─── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GothicArch />
      </motion.div>

      {/* ─── Title ─── */}
      <motion.h2
        className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-2xl sm:text-3xl md:text-4xl text-center tracking-[0.08em]"
        style={{
          textShadow: '0 0 15px rgba(201, 168, 76, 0.3), 0 0 30px rgba(201, 168, 76, 0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Jard&iacute;n de Rosas Prohibidas
      </motion.h2>

      {/* ─── Subtitle ─── */}
      <motion.p
        className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base text-center mt-3 tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        Toca una rosa para revelar su secreto
      </motion.p>

      {/* ─── Ornamental Divider ─── */}
      <motion.div
        className="flex items-center justify-center gap-3 my-6 sm:my-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.35 }}
        aria-hidden="true"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
        <span className="text-[#c9a84c]/40 text-xs select-none">&#10022;</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
      </motion.div>

      {/* ─── Iron Fence ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <IronFence />
      </motion.div>

      {/* ─── Garden Grid ─── */}
      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 px-2 sm:px-4">
        {/* ─── Firefly Particles ─── */}
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

        {/* ─── Rose Cells ─── */}
        {roses.map((item, index) => {
          const isActive = activeIndex === index;
          const color = ROSE_COLORS[index] ?? ROSE_COLORS[0];

          return (
            <motion.div
              key={index}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            >
              {/* ── Rose Button ── */}
              <motion.button
                type="button"
                className="rose-breathe relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/40 rounded-lg p-2 sm:p-3 transition-[box-shadow] duration-300"
                style={{
                  animationDelay: `${index * 0.6}s`,
                  boxShadow: isActive
                    ? `0 0 25px ${color}55, 0 0 50px ${color}22, 0 0 80px ${color}11`
                    : 'none',
                }}
                onClick={() => handleRoseClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRoseClick(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${item.rose}: ${isActive ? 'ocultar' : 'mostrar'} mensaje`}
                aria-expanded={isActive}
                whileHover={{
                  scale: 1.08,
                  filter: `drop-shadow(0 0 12px ${color}66)`,
                }}
                whileTap={{ scale: 0.96 }}
              >
                {/* Bloom animation wrapper */}
                <motion.div
                  animate={
                    isActive
                      ? { scale: [1, 1.12, 1.05], opacity: [0.9, 1, 1] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={
                    isActive
                      ? { duration: 0.6, ease: 'easeOut' }
                      : { duration: 0.4, ease: 'easeInOut' }
                  }
                >
                  <RoseSVG color={color} index={index} />
                </motion.div>
              </motion.button>

              {/* ── Rose Name ── */}
              <motion.p
                className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] sm:text-xs tracking-[0.12em] uppercase mt-1 text-center transition-colors duration-300"
                style={{ color: isActive ? '#c9a84c' : undefined }}
                animate={isActive ? { opacity: 1 } : { opacity: 0.6 }}
              >
                {item.rose}
              </motion.p>

              {/* ── Message Card (AnimatePresence) ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="w-full mt-3"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div className="paper-texture relative rounded-lg border border-[#c9a84c]/20 p-3 sm:p-4">
                      {/* Gold corner accents */}
                      <GoldCornerAccent position="tl" />
                      <GoldCornerAccent position="tr" />
                      <GoldCornerAccent position="bl" />
                      <GoldCornerAccent position="br" />

                      {/* Inner border */}
                      <div className="absolute inset-[2px] rounded-md border border-[#c9a84c]/8 pointer-events-none" />

                      {/* Message text */}
                      <p className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-xs sm:text-sm leading-[1.8] tracking-[0.02em] text-center relative z-10">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Thorny Vine Borders ─── */}
      <div className="relative mt-8 sm:mt-12" aria-hidden="true">
        {/* Bottom thorny vine */}
        <svg
          width="100%"
          height="30"
          viewBox="0 0 800 30"
          preserveAspectRatio="none"
          className="w-full opacity-20"
        >
          <defs>
            <linearGradient id="vineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="15%" stopColor="#2d4a1e" />
              <stop offset="50%" stopColor="#3a6a28" />
              <stop offset="85%" stopColor="#2d4a1e" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Main vine line */}
          <path
            d="M0 15 Q100 10 200 16 Q300 22 400 14 Q500 6 600 18 Q700 22 800 15"
            stroke="url(#vineGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Thorns */}
          <path d="M80 14 L76 8 L78 13" fill="#2d4a1e" />
          <path d="M150 16 L154 10 L152 15" fill="#2d4a1e" />
          <path d="M260 18 L256 12 L258 17" fill="#2d4a1e" />
          <path d="M340 14 L344 8 L342 13" fill="#2d4a1e" />
          <path d="M450 10 L446 4 L448 9" fill="#2d4a1e" />
          <path d="M530 16 L534 10 L532 15" fill="#2d4a1e" />
          <path d="M620 20 L616 14 L618 19" fill="#2d4a1e" />
          <path d="M710 16 L714 10 L712 15" fill="#2d4a1e" />
          {/* Small leaves on vine */}
          <ellipse cx="180" cy="13" rx="6" ry="3" fill="#2d4a1e" opacity="0.5" transform="rotate(-15 180 13)" />
          <ellipse cx="380" cy="18" rx="5" ry="2.5" fill="#2d4a1e" opacity="0.5" transform="rotate(10 380 18)" />
          <ellipse cx="580" cy="12" rx="6" ry="3" fill="#2d4a1e" opacity="0.5" transform="rotate(-10 580 12)" />
        </svg>
      </div>

      {/* ─── Garden Ground ─── */}
      <div
        className="w-full h-8 sm:h-12 -mb-12 sm:-mb-16 rounded-t-lg"
        style={{
          background: 'linear-gradient(to bottom, #0a0a0a 0%, #0d0f08 30%, #141a0e 60%, #1a2010 100%)',
          position: 'relative',
        }}
        aria-hidden="true"
      >
        {/* Subtle earth texture dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #3a5a2a 1px, transparent 1px)',
            backgroundSize: '12px 8px',
          }}
        />
      </div>

      {/* ─── Fog / Mist at Garden Base ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 mist-layer"
          style={{
            background: 'linear-gradient(to top, rgba(10, 10, 10, 0.6) 0%, transparent 100%)',
            opacity: 0.5,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background: 'linear-gradient(to top, rgba(20, 26, 14, 0.4) 0%, transparent 100%)',
          }}
        />
      </div>
    </section>
  );
}
