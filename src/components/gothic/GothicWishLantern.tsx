'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface LanternData {
  id: number;
  x: number;
  wish: string;
  createdAt: number;
  swayOffset: number;
  swaySpeed: number;
}

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// ─── Pre-written Wishes ───
const PREWRITTEN_WISHES = [
  'Que nuestro amor sea eterno',
  'Que siempre encontremos el camino de regreso',
  'Que los sueños se hagan realidad',
  'Que cada amanecer sea juntos',
];

// ─── Max lanterns visible at once ───
const MAX_VISIBLE_LANTERNS = 15;
const LANTERN_LIFETIME_MS = 10000; // 10 seconds
const LANTERN_ANIMATION_DURATION = 9; // seconds for framer motion

// ─── Twinkling Star ───
function TwinklingStar({ star }: { star: StarData }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white pointer-events-none"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: star.size,
        height: star.size,
      }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: star.duration,
        delay: star.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// ─── Sky Lantern SVG ───
function SkyLanternSVG({ glowIntensity = 1 }: { glowIntensity?: number }) {
  return (
    <svg
      width="40"
      height="56"
      viewBox="0 0 40 56"
      className="relative z-10 drop-shadow-[0_0_12px_rgba(212,135,14,0.4)]"
    >
      <defs>
        <linearGradient id="lantern-body-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a020" />
          <stop offset="30%" stopColor="#d4870e" />
          <stop offset="70%" stopColor="#c97510" />
          <stop offset="100%" stopColor="#b05a08" />
        </linearGradient>
        <radialGradient id="lantern-glow-grad" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#ffcc44" stopOpacity={0.9 * glowIntensity} />
          <stop offset="40%" stopColor="#ffaa22" stopOpacity={0.5 * glowIntensity} />
          <stop offset="100%" stopColor="#ff6600" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="lantern-flame-grad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fff7a0" />
          <stop offset="50%" stopColor="#ffdd44" />
          <stop offset="100%" stopColor="#ff8800" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="lantern-top-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c97510" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#e8a020" />
          <stop offset="100%" stopColor="#c97510" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Outer glow */}
      <ellipse
        cx="20"
        cy="28"
        rx="28"
        ry="32"
        fill="url(#lantern-glow-grad)"
        opacity={0.3 * glowIntensity}
      >
        <animate
          attributeName="rx"
          values="28;30;28"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="32;34;32"
          dur="3s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Lantern body — trapezoid (wider at bottom) */}
      <path
        d="M14 4 L26 4 L30 40 L10 40 Z"
        fill="url(#lantern-body-grad)"
        opacity="0.9"
      />

      {/* Lantern top cap */}
      <rect x="13" y="2" width="14" height="4" rx="1" fill="url(#lantern-top-grad)" />

      {/* Lantern horizontal ribs */}
      <line x1="14.5" y1="14" x2="25.5" y2="14" stroke="#b05a08" strokeWidth="0.5" opacity="0.3" />
      <line x1="13.8" y1="24" x2="26.2" y2="24" stroke="#b05a08" strokeWidth="0.5" opacity="0.3" />
      <line x1="13" y1="34" x2="27" y2="34" stroke="#b05a08" strokeWidth="0.5" opacity="0.3" />

      {/* Vertical ribs */}
      <line x1="20" y1="6" x2="20" y2="40" stroke="#b05a08" strokeWidth="0.4" opacity="0.2" />
      <line x1="14.5" y1="6" x2="13" y2="40" stroke="#b05a08" strokeWidth="0.3" opacity="0.15" />
      <line x1="25.5" y1="6" x2="27" y2="40" stroke="#b05a08" strokeWidth="0.3" opacity="0.15" />

      {/* Opening at bottom */}
      <path d="M10 40 L14 44 L26 44 L30 40" fill="none" stroke="#8a5a10" strokeWidth="0.8" opacity="0.5" />

      {/* Flame inside opening */}
      <ellipse cx="20" cy="42" rx="3" ry="4" fill="url(#lantern-flame-grad)" opacity="0.8">
        <animate
          attributeName="ry"
          values="4;5;4"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          values="3;3.5;3"
          dur="2s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Small rim at bottom */}
      <rect x="11" y="39" width="18" height="2" rx="0.5" fill="#8a5a10" opacity="0.6" />

      {/* Warm highlight on left side */}
      <path
        d="M16 8 L14 36"
        stroke="#ffe080"
        strokeWidth="0.5"
        opacity="0.15"
      />
    </svg>
  );
}

// ─── Floating Lantern ───
function FloatingLantern({ lantern }: { lantern: LanternData }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${lantern.x}%`, bottom: '0%' }}
      initial={{ y: 0, opacity: 0.9, scale: 1 }}
      animate={{
        y: [0, -600],
        x: [0, 15 * Math.sin(lantern.swayOffset), -10 * Math.cos(lantern.swayOffset), 12 * Math.sin(lantern.swayOffset * 1.5), 0],
        opacity: [0.9, 0.85, 0.6, 0.3, 0],
        scale: [1, 0.95, 0.75, 0.5, 0.3],
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: LANTERN_ANIMATION_DURATION,
        ease: 'easeOut',
      }}
    >
      <div className="relative">
        {/* Glow aura */}
        <div
          className="absolute -inset-10 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,135,14,0.15) 0%, rgba(201,168,76,0.05) 40%, transparent 70%)',
          }}
        />
        <SkyLanternSVG glowIntensity={1} />
        {/* Wish text (visible briefly) */}
        {lantern.wish && (
          <motion.p
            className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-fell)] italic text-[#c9a84c]/70 text-[10px]"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: [0, 0.7, 0.7, 0], y: [5, -5, -5, -15] }}
            transition={{ duration: 6, ease: 'easeOut' }}
          >
            {lantern.wish.length > 30 ? `${lantern.wish.slice(0, 30)}...` : lantern.wish}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function GothicWishLantern({ className = '' }: { className?: string }) {
  const [wishText, setWishText] = useState('');
  const [lanterns, setLanterns] = useState<LanternData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const nextIdRef = useRef(0);
  const cleanupTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Generate twinkling stars
  const stars = useMemo<StarData[]>(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 90,
        size: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 4,
      })),
    []
  );

  // Cleanup old lanterns after they float off screen
  useEffect(() => {
    const timers = cleanupTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const releaseLantern = useCallback(() => {
    const trimmed = wishText.trim() || 'Deseo silencioso';
    const id = nextIdRef.current++;

    const newLantern: LanternData = {
      id,
      x: 15 + Math.random() * 70, // Random position between 15-85%
      wish: trimmed,
      createdAt: Date.now(),
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 0.5,
    };

    setLanterns((prev) => {
      const updated = [...prev, newLantern];
      // Remove oldest if exceeding max
      if (updated.length > MAX_VISIBLE_LANTERNS) {
        const removed = updated.shift();
        if (removed) {
          const timer = cleanupTimersRef.current.get(removed.id);
          if (timer) {
            clearTimeout(timer);
            cleanupTimersRef.current.delete(removed.id);
          }
        }
      }
      return updated;
    });

    setTotalCount((prev) => prev + 1);
    setWishText('');

    // Remove lantern after it finishes floating
    const timer = setTimeout(() => {
      setLanterns((prev) => prev.filter((l) => l.id !== id));
      cleanupTimersRef.current.delete(id);
    }, LANTERN_LIFETIME_MS);

    cleanupTimersRef.current.set(id, timer);
  }, [wishText]);

  const handleQuickWish = useCallback((wish: string) => {
    setWishText(wish);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col items-center gap-6 ${className}`}
    >
      {/* Title */}
      <div className="text-center">
        <motion.h2
          className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xl sm:text-2xl md:text-3xl tracking-wider mb-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textShadow: '0 0 20px rgba(201,168,76,0.15)' }}
        >
          Linternas de Deseos
        </motion.h2>
        <motion.p
          className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Escribe tu deseo y libéralo al cielo nocturno
        </motion.p>
      </div>

      {/* Night Sky with Lanterns */}
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{
          height: '500px',
          background: 'linear-gradient(to top, #0d0d1a 0%, #0a0a14 30%, #070711 60%, #050510 100%)',
          border: '1px solid #1a1a2e',
        }}
      >
        {/* Stars */}
        {stars.map((star) => (
          <TwinklingStar key={star.id} star={star} />
        ))}

        {/* Subtle moon glow at top-right */}
        <div
          className="absolute top-4 right-8 w-20 h-20 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(200,200,220,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Floating lanterns */}
        <AnimatePresence>
          {lanterns.map((lantern) => (
            <FloatingLantern key={lantern.id} lantern={lantern} />
          ))}
        </AnimatePresence>

        {/* Empty state hint */}
        {lanterns.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <svg
                className="mx-auto mb-3 opacity-10"
                width="48"
                height="64"
                viewBox="0 0 40 56"
              >
                <path d="M14 4 L26 4 L30 40 L10 40 Z" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
                <rect x="13" y="2" width="14" height="4" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
                <path d="M10 40 L14 44 L26 44 L30 40" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
              </svg>
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/40 text-xs">
                El cielo espera tus deseos...
              </p>
            </div>
          </motion.div>
        )}

        {/* Ground silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #0a0a0a 0%, #0a0a0a 40%, transparent 100%)',
          }}
        />
      </div>

      {/* Quick Wishes */}
      <div className="flex flex-wrap justify-center gap-2 px-2">
        {PREWRITTEN_WISHES.map((wish, i) => (
          <motion.button
            key={i}
            onClick={() => handleQuickWish(wish)}
            className="px-3 py-1.5 rounded-full border border-[#c9a84c]/20 bg-[#111]/50 text-[#c9a84c]/70 text-xs font-[family-name:var(--font-fell)] italic
              hover:border-[#c9a84c]/50 hover:text-[#c9a84c] hover:shadow-[0_0_12px_rgba(201,168,76,0.1)] transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {wish.length > 28 ? `${wish.slice(0, 28)}...` : wish}
          </motion.button>
        ))}
      </div>

      {/* Wish Input Area */}
      <div className="w-full max-w-lg space-y-3">
        <div className="relative">
          <textarea
            value={wishText}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                setWishText(e.target.value);
              }
            }}
            placeholder="Escribe tu deseo aquí..."
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-[#111]/80 border border-[#c9a84c]/20
              font-[family-name:var(--font-typewriter)] text-sm text-[#d4c5b0] placeholder-[#5a5040]/50
              resize-none outline-none focus:border-[#c9a84c]/50 focus:shadow-[0_0_15px_rgba(201,168,76,0.08)]
              transition-all duration-300"
            style={{ caretColor: '#c9a84c' }}
          />
          {/* Character counter */}
          <span className="absolute bottom-2 right-3 font-[family-name:var(--font-typewriter)] text-[10px] text-[#5a5040]/40">
            {wishText.length}/200
          </span>
        </div>

        {/* Release Button */}
        <motion.button
          onClick={releaseLantern}
          className="w-full py-3 rounded-lg font-[family-name:var(--font-cinzel)] text-sm tracking-wider uppercase text-[#0a0a0a]
            cursor-pointer transition-all duration-300 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #d4870e 50%, #c9a84c 100%)',
            boxShadow: '0 0 20px rgba(201,168,76,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          whileHover={{
            boxShadow: '0 0 30px rgba(201,168,76,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
            scale: 1.01,
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          />
          <span className="relative z-10">✦ Liberar Linterna ✦</span>
        </motion.button>
      </div>

      {/* Counter */}
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.p
            className="font-[family-name:var(--font-typewriter)] text-[10px] tracking-widest uppercase text-[#5a5040]/50 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {totalCount} {totalCount === 1 ? 'linterna liberada' : 'linternas liberadas'}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
