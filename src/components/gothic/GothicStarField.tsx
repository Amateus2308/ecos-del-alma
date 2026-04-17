'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';

/* ================================================================
   Types
   ================================================================ */

interface StarData {
  id: number;
  x: number;           // % horizontal position
  y: number;           // % vertical position
  radius: number;      // SVG circle radius (0.8 – 3.3)
  color: string;       // hex color
  baseOpacity: number; // 0.1 – 0.4
  duration: number;    // star-twinkle animation duration (s)
  delay: number;       // star-twinkle animation delay (s)
}

interface ShootingStarData {
  id: number;
  startX: number;   // % start position
  startY: number;   // % start position
  duration: number; // animation duration (s)
}

/* ================================================================
   Constants
   ================================================================ */

const STAR_COUNT = 60;
const MAX_SHOOTING = 3;
const PROXIMITY_PX = 180;

/**
 * Weighted color pool — ~65 % warm gold, ~20 % dim, ~15 % bright white.
 */
const COLOR_POOL: string[] = [
  '#c9a84c', '#c9a84c', '#c9a84c', '#c9a84c',
  '#c9a84c', '#c9a84c', '#c9a84c',
  '#8a7e6b', '#8a7e6b',
  '#d4c5b0', '#d4c5b0',
];

/* ================================================================
   Helpers
   ================================================================ */

function pickColor(): string {
  return COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];
}

/** Build a stable array of ~60 stars with random attributes. */
function buildStars(): StarData[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    radius: 0.8 + Math.random() * 2.5,
    color: pickColor(),
    baseOpacity: 0.1 + Math.random() * 0.3,
    duration: 3 + Math.random() * 6,
    delay: Math.random() * 6,
  }));
}

/* ================================================================
   Component
   ================================================================ */

export default function GothicStarField() {
  /* Stable star dataset — only computed once */
  const stars = useMemo(() => buildStars(), []);

  /* ---- Mouse position (throttled to rAF) ---- */
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePos(mouseRef.current);
          rafRef.current = 0;
        });
      }
    };
    const onLeave = () => {
      mouseRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      setMousePos(null);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ---- Shooting-star lifecycle ---- */
  const spawnShootingStar = useCallback((): ShootingStarData => ({
    id: Date.now() + Math.random(),
    startX: -5 + Math.random() * 50,
    startY: Math.random() * 40,
    duration: 0.7 + Math.random() * 0.9,
  }), []);

  const [shootingStars, setShootingStars] = useState<ShootingStarData[]>(() => [
    spawnShootingStar(),
  ]);

  useEffect(() => {
    // Spawn a new one every ~3-6 seconds, keeping at most MAX_SHOOTING
    const timer = setInterval(() => {
      setShootingStars((prev) => [...prev.slice(-(MAX_SHOOTING - 1)), spawnShootingStar()]);
    }, 3000 + Math.random() * 3000);

    return () => clearInterval(timer);
  }, [spawnShootingStar]);

  /* ---- Proximity brightness boost ---- */
  const getBoost = useCallback(
    (sx: number, sy: number): number => {
      if (!mousePos) return 0;
      const px = (sx / 100) * window.innerWidth;
      const py = (sy / 100) * window.innerHeight;
      const d = Math.hypot(px - mousePos.x, py - mousePos.y);
      if (d > PROXIMITY_PX) return 0;
      return (1 - d / PROXIMITY_PX) * 0.5;
    },
    [mousePos],
  );

  /* ================================================================
     Render
     ================================================================ */

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* ---- Static stars ---- */}
      {stars.map((s) => {
        const b = getBoost(s.x, s.y);

        /*
         * The existing `.star-twinkle` animation cycles opacity 0.2 → 0.8.
         * We wrap each star in a container whose own opacity scales this
         * range down to the desired 0.1–0.4 base, and up to ~0.8 when
         * boosted by mouse proximity.
         */
        const wrapperOpacity = Math.min(1, (s.baseOpacity + b) / 0.6);

        return (
          <div
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: wrapperOpacity }}
          >
            <div
              className="star-twinkle"
              style={{
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            >
              <svg
                width={Math.max(4, s.radius * 3)}
                height={Math.max(4, s.radius * 3)}
                viewBox="0 0 12 12"
              >
                {/* Soft glow halo */}
                <circle cx="6" cy="6" r={s.radius * 1.4} fill={s.color} opacity={0.12} />
                {/* Core */}
                <circle cx="6" cy="6" r={s.radius * 0.5} fill={s.color} />
              </svg>
            </div>
          </div>
        );
      })}

      {/* ---- Shooting stars ---- */}
      {shootingStars.map((ss) => (
        <div
          key={ss.id}
          className="absolute shooting-star-fly"
          style={{
            left: `${ss.startX}%`,
            top: `${ss.startY}%`,
            animationDuration: `${ss.duration}s`,
          }}
        >
          {/* Bright head */}
          <div className="shooting-star-head" />
          {/* Trailing tail */}
          <div className="shooting-star-tail" />
        </div>
      ))}
    </div>
  );
}
