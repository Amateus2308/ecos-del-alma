'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollProgressBarProps {
  /** Height of the progress bar in pixels (default: 2) */
  height?: number;
  /** Whether to show the glow animation class when progress > 50% (default: true) */
  enableGlow?: boolean;
}

export default function ScrollProgressBar({
  height = 2,
  enableGlow = true,
}: ScrollProgressBarProps) {
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Calculate reading progress (0–100)
    const currentProgress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    setProgress(currentProgress);

    // Fade in when user scrolls past 60% of the hero viewport
    const heroThreshold = window.innerHeight * 0.6;
    setVisible(scrollTop > heroThreshold);

    rafRef.current = null;
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [updateProgress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Schedule initial calculation via rAF to avoid synchronous setState in effect
    const initRaf = requestAnimationFrame(() => {
      updateProgress();
    });

    return () => {
      cancelAnimationFrame(initRaf);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateProgress]);

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 pointer-events-none"
      style={{
        height,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s ease-in-out',
      }}
      aria-hidden="true"
    >
      {/* Track — full-width dark background */}
      <div className="w-full h-full bg-black/30" />

      {/* Fill — gold gradient, smooth CSS transition */}
      <div
        className={`absolute top-0 left-0 h-full ${
          progress > 50 && enableGlow ? 'scroll-progress-glow' : ''
        }`}
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #c9a84c, #8a7234)',
          transition: 'width 0.15s ease-out',
          borderRadius: '0 1px 1px 0',
        }}
      />
    </div>
  );
}
