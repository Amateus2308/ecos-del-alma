'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SparkleData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  createdAt: number;
  shape: 'circle' | 'diamond';
  initialOpacity: number;
}

interface CursorSparkleTrailProps {
  enabled?: boolean;
  colors?: string[];
}

const DEFAULT_COLORS = ['#c9a84c', '#8a7234', '#8B0000', '#d4c5b0', '#a00000'];

const MAX_PARTICLES = 30;
const SPARKLE_LIFETIME = 700;
const THROTTLE_INTERVAL = 50;
const CLEANUP_INTERVAL = 100;

let nextId = 0;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export default function CursorSparkleTrail({
  enabled = true,
  colors = DEFAULT_COLORS,
}: CursorSparkleTrailProps) {
  const [sparkles, setSparkles] = useState<SparkleData[]>([]);
  const lastMoveTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const cleanupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const removeExpired = useCallback(() => {
    const now = Date.now();
    setSparkles((prev) => prev.filter((s) => now - s.createdAt < SPARKLE_LIFETIME));
  }, []);

  useEffect(() => {
    if (!enabled) {
      setSparkles([]);
      return;
    }

    cleanupIntervalRef.current = setInterval(removeExpired, CLEANUP_INTERVAL);

    return () => {
      if (cleanupIntervalRef.current !== null) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [enabled, removeExpired]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;

      const now = Date.now();
      if (now - lastMoveTimeRef.current < THROTTLE_INTERVAL) {
        rafIdRef.current = requestAnimationFrame(() => handleMouseMove(e));
        return;
      }
      lastMoveTimeRef.current = now;

      const offsetX = randomInRange(-5, 5);
      const offsetY = randomInRange(-5, 5);
      const x = e.clientX + offsetX;
      const y = e.clientY + offsetY;
      const size = randomInRange(2, 4);
      const color = pickRandom(colors);
      const shape = Math.random() > 0.5 ? 'circle' : 'diamond';
      const initialOpacity = randomInRange(0.6, 0.8);

      const sparkle: SparkleData = {
        id: nextId++,
        x,
        y,
        size,
        color,
        createdAt: Date.now(),
        shape,
        initialOpacity,
      };

      setSparkles((prev) => {
        const next = [...prev, sparkle];
        if (next.length > MAX_PARTICLES) {
          return next.slice(next.length - MAX_PARTICLES);
        }
        return next;
      });
    },
    [enabled, colors],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, handleMouseMove]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
      style={{ overflow: 'hidden' }}
    >
      {sparkles.map((sparkle) => {
        const age = Date.now() - sparkle.createdAt;
        const progress = Math.min(age / SPARKLE_LIFETIME, 1);
        const opacity = sparkle.initialOpacity * (1 - progress);
        const scale = 1 - progress * 0.6;
        const currentSize = sparkle.size * scale;

        if (opacity <= 0) return null;

        const isDiamond = sparkle.shape === 'diamond';
        const rotation = isDiamond ? 45 : 0;

        return (
          <div
            key={sparkle.id}
            style={{
              position: 'absolute',
              left: sparkle.x,
              top: sparkle.y,
              width: currentSize,
              height: currentSize,
              backgroundColor: sparkle.color,
              borderRadius: isDiamond ? '1px' : '50%',
              opacity,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              boxShadow: `0 0 ${currentSize * 2}px ${sparkle.color}, 0 0 ${currentSize * 4}px ${sparkle.color}40`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </div>
  );
}
