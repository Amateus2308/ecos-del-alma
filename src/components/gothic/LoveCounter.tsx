'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoveCounterProps {
  sinceDate?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

function calculateTimeSince(sinceDate: string): TimeLeft {
  const start = new Date(sinceDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function BatWing({ side }: { side: 'left' | 'right' }) {
  const flip = side === 'right' ? 'scaleX(-1)' : 'none';
  return (
    <svg
      width="40"
      height="50"
      viewBox="0 0 40 50"
      className="text-[#c9a84c]/20 select-none"
      style={{ transform: flip }}
      fill="currentColor"
    >
      <path d="M20 50 L20 30 Q10 25 5 15 Q2 8 0 0 Q8 5 15 10 Q18 12 20 20 Q22 12 25 10 Q32 5 40 0 Q38 8 35 15 Q30 25 20 30 Z" />
      <path d="M20 35 Q15 30 10 25 Q14 28 20 32" opacity="0.5" />
      <path d="M20 35 Q25 30 30 25 Q26 28 20 32" opacity="0.5" />
    </svg>
  );
}

function FloatingHeartParticle({ heart }: { heart: FloatingHeart }) {
  return (
    <motion.div
      key={heart.id}
      className="absolute bottom-0 pointer-events-none"
      style={{ left: `${heart.x}%` }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: -120 - heart.size * 4,
        opacity: [0, heart.opacity, heart.opacity, 0],
        x: [0, Math.sin(heart.id) * 15, Math.cos(heart.id * 1.5) * -10, 0],
      }}
      transition={{
        duration: heart.duration,
        delay: heart.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={heart.size}
        height={heart.size}
        viewBox="0 0 24 24"
        fill="#8B0000"
        className="opacity-60"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

function CounterBox({
  value,
  label,
  index,
}: {
  value: number;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.12, ease: 'easeOut' }}
      className="relative flex flex-col items-center gap-2"
    >
      {/* Number box */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center rounded-sm border border-[#c9a84c]/30 bg-gradient-to-b from-[#1a1a1a] to-[#111111] overflow-hidden group">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c9a84c]/20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c9a84c]/20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c9a84c]/20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c9a84c]/20" />

        {/* Number */}
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-[family-name:var(--font-cinzel)] text-2xl sm:text-3xl md:text-4xl text-[#c9a84c] relative z-10"
          style={{ textShadow: '0 0 8px rgba(201, 168, 76, 0.2)' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>

      {/* Label */}
      <span className="font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7e6b]">
        {label}
      </span>
    </motion.div>
  );
}

export default function LoveCounter({ sinceDate = '2025-02-14' }: LoveCounterProps) {
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const updateTime = useCallback(() => {
    setTime(calculateTimeSince(sinceDate));
  }, [sinceDate]);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const floatingHearts = useMemo<FloatingHeart[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: i * 1.5 + Math.random() * 2,
      duration: 4 + Math.random() * 3,
      size: 8 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  const counterItems = useMemo(
    () => [
      { value: time.days, label: 'Días' },
      { value: time.hours, label: 'Horas' },
      { value: time.minutes, label: 'Minutos' },
      { value: time.seconds, label: 'Segundos' },
    ],
    [time]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative max-w-lg mx-auto"
    >
      {/* Pulsing glow wrapper */}
      <div className="love-counter-glow relative rounded-lg border border-[#c9a84c]/20 bg-gradient-to-b from-[#151515] via-[#1a1a1a] to-[#111111] p-6 sm:p-8 overflow-hidden">
        {/* Floating hearts container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingHearts.map((heart) => (
            <FloatingHeartParticle key={heart.id} heart={heart} />
          ))}
        </div>

        {/* Bat wings - left */}
        <div className="absolute top-4 left-2 sm:left-3 opacity-40">
          <BatWing side="left" />
        </div>

        {/* Bat wings - right */}
        <div className="absolute top-4 right-2 sm:right-3 opacity-40">
          <BatWing side="right" />
        </div>

        {/* Top ornamental line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent mb-5"
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-[family-name:var(--font-cinzel-decorative)] text-xl sm:text-2xl md:text-3xl text-[#c9a84c] text-center mb-2"
          style={{
            textShadow:
              '0 0 10px rgba(201, 168, 76, 0.3), 0 0 30px rgba(201, 168, 76, 0.1)',
          }}
        >
          Latidos Compartidos
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm text-center mb-6 sm:mb-8 leading-relaxed px-4"
        >
          Cada segundo es un eco que se suma a nuestro laberinto
        </motion.p>

        {/* Counter boxes */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
          {counterItems.map((item, index) => (
            <div key={item.label} className="relative">
              <CounterBox value={item.value} label={item.label} index={index} />
              {/* Separator between boxes */}
              {index < counterItems.length - 1 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="absolute -right-[10px] sm:-right-[12px] md:-right-[14px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20"
                  >
                    <div className="w-px h-3 bg-[#c9a84c]/20" />
                    <div className="w-1 h-1 rotate-45 border border-[#c9a84c]/30 bg-[#0a0a0a]" />
                    <div className="w-px h-3 bg-[#c9a84c]/20" />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Bottom ornamental */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="mt-6 sm:mt-8 flex items-center justify-center gap-2"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent" />
          <div className="w-1 h-1 rotate-45 bg-[#c9a84c]/30" />
          <span className="text-[#c9a84c]/20 text-[8px]">♥</span>
          <div className="w-1 h-1 rotate-45 bg-[#c9a84c]/30" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}
