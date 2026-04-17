'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretMessageProps {
  message: string;
  title?: string;
}

// ─── Wax Seal SVG ───
function WaxSeal({ breaking }: { breaking: boolean }) {
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="drop-shadow-[0_0_12px_rgba(139,0,0,0.4)]"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle
        cx="40"
        cy="40"
        r="38"
        fill="url(#sealGradient)"
        stroke="#c9a84c"
        strokeWidth="0.8"
        opacity={breaking ? 0.5 : 1}
      />
      {/* Mid ring */}
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.5"
        opacity={breaking ? 0.3 : 0.35}
      />
      {/* Inner circle */}
      <circle
        cx="40"
        cy="40"
        r="26"
        fill="url(#sealInnerGradient)"
        stroke="#c9a84c"
        strokeWidth="0.4"
        opacity={breaking ? 0.5 : 1}
      />
      {/* Inner accent */}
      <circle
        cx="40"
        cy="40"
        r="22"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="0.3"
        opacity={breaking ? 0.2 : 0.25}
      />
      {/* Cross design */}
      <line x1="40" y1="20" x2="40" y2="60" stroke="#c9a84c" strokeWidth="0.6" opacity={breaking ? 0.2 : 0.4} />
      <line x1="20" y1="40" x2="60" y2="40" stroke="#c9a84c" strokeWidth="0.6" opacity={breaking ? 0.2 : 0.4} />
      {/* Center diamond */}
      <rect x="35" y="35" width="10" height="10" rx="1" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity={breaking ? 0.2 : 0.35} transform="rotate(45 40 40)" />
      <circle cx="40" cy="40" r="2.5" fill="#c9a84c" opacity={breaking ? 0.15 : 0.3} />
      {/* Top-left shine */}
      <circle cx="28" cy="28" r="6" fill="white" opacity={breaking ? 0.02 : 0.06} />
      {/* Drip effect */}
      <ellipse cx="40" cy="77" rx="4" ry="3" fill="#8B0000" opacity={breaking ? 0.2 : 0.6} />
      <defs>
        <radialGradient id="sealGradient" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#c01010" />
          <stop offset="50%" stopColor="#8B0000" />
          <stop offset="100%" stopColor="#4a0000" />
        </radialGradient>
        <radialGradient id="sealInnerGradient" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#c00000" />
          <stop offset="100%" stopColor="#5a0000" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}

// ─── Particle burst on seal break ───
function SealParticles({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        angle: (i / 18) * 360,
        distance: 40 + Math.random() * 60,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#c9a84c' : '#8B0000',
        duration: 0.4 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible" aria-hidden="true">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 4px ${p.color}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: p.duration, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Corner ornament for sealed card ───
function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotation = position === 'tl' ? 0 : position === 'tr' ? 90 : position === 'br' ? 180 : 270;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`absolute ${position === 'tl' ? 'top-2 left-2' : position === 'tr' ? 'top-2 right-2' : position === 'bl' ? 'bottom-2 left-2' : 'bottom-2 right-2'} pointer-events-none`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path d="M2 2 L2 12" stroke="#c9a84c" strokeWidth="0.6" opacity="0.3" />
      <path d="M2 2 L12 2" stroke="#c9a84c" strokeWidth="0.6" opacity="0.3" />
      <path d="M2 2 C2 2, 4 5, 2 8" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.2" />
      <circle cx="2" cy="2" r="1.2" fill="#c9a84c" opacity="0.2" />
    </svg>
  );
}

// ─── Gold corner accent for revealed card ───
function GoldCornerAccent({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
  };
  return (
    <div
      className={`absolute w-6 h-6 sm:w-8 sm:h-8 border-[#c9a84c]/30 pointer-events-none ${classes[position]}`}
      aria-hidden="true"
    />
  );
}

// ─── Ornamental divider ───
function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4 sm:my-5" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
      <div className="flex items-center gap-2">
        <span className="text-[#c9a84c]/30 text-[10px] select-none">◆</span>
        <span className="text-[#c9a84c]/50 text-xs select-none">✦</span>
        <span className="text-[#c9a84c]/30 text-[10px] select-none">◆</span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
    </div>
  );
}

// ─── Typewriter text effect ───
function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setDone(false);
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setDone(true);
        onComplete();
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <p
      className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.03em] whitespace-pre-wrap relative z-10 min-h-[3rem]"
      style={{ textShadow: '0 0 1px rgba(139, 0, 0, 0.1)' }}
    >
      {displayedText}
      {!done && (
        <motion.span
          className="inline-block w-[2px] h-4 bg-[#c9a84c] ml-[1px] align-text-bottom"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(2)' }}
        />
      )}
    </p>
  );
}

// ─── Main Component ───
export default function SecretMessage({ message, title = 'Confesión Sellada' }: SecretMessageProps) {
  const [revealed, setRevealed] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState(false);

  const handleOpen = useCallback(() => {
    if (revealed) return;
    setBreaking(true);
    setShowParticles(true);
    // After seal break animation, reveal
    setTimeout(() => {
      setRevealed(true);
      setBreaking(false);
    }, 600);
    // Hide particles after burst
    setTimeout(() => {
      setShowParticles(false);
    }, 1000);
  }, [revealed]);

  const handleClose = useCallback(() => {
    setRevealed(false);
    setTypewriterComplete(false);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto my-8 sm:my-12">
      <AnimatePresence mode="wait">
        {/* ─── Sealed State ─── */}
        {!revealed && (
          <motion.div
            key="sealed"
            className="secret-message-float cursor-pointer select-none"
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpen();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Abrir confesión sellada. Toca para romper el sello."
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateY: 90 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="relative bg-gradient-to-b from-[#121010] to-[#0d0a0a] border border-[#2a2a2a] rounded-lg p-8 sm:p-10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
              {/* Corner ornaments */}
              <CornerOrnament position="tl" />
              <CornerOrnament position="tr" />
              <CornerOrnament position="bl" />
              <CornerOrnament position="br" />

              {/* Subtle border inner glow */}
              <div className="absolute inset-[1px] rounded-lg border border-[#c9a84c]/5 pointer-events-none" />

              {/* Seal with pulsing glow */}
              <div className="flex justify-center mb-6 relative">
                <div className="secret-seal-glow rounded-full p-2">
                  <AnimatePresence>
                    {!breaking && (
                      <motion.div
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                          scale: 1.4,
                          opacity: 0,
                          rotate: 15,
                        }}
                        transition={{ duration: 0.5, ease: 'easeIn' }}
                      >
                        <WaxSeal breaking={false} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Particles burst from seal */}
                <SealParticles active={showParticles} />
              </div>

              {/* Title */}
              <motion.h3
                className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-base sm:text-lg text-center tracking-wider mb-3"
                style={{ textShadow: '0 0 15px rgba(201, 168, 76, 0.2)' }}
                animate={{ opacity: breaking ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {title}
              </motion.h3>

              {/* Ornamental line under title */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a84c]/20" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
              </div>

              {/* Instruction text */}
              <motion.p
                className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm text-center tracking-wide"
                animate={{ opacity: breaking ? 0 : [0.6, 1, 0.6] }}
                transition={
                  breaking
                    ? { duration: 0.15 }
                    : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                Toca para romper el sello
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* ─── Revealed State ─── */}
        {revealed && (
          <motion.div
            key="revealed"
            className="relative"
            initial={{ opacity: 0, scale: 0.95, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateY: -90 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="paper-texture rounded-lg border border-[#2a2a2a] p-6 sm:p-10 relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]">
              {/* Gold corner accents */}
              <GoldCornerAccent position="tl" />
              <GoldCornerAccent position="tr" />
              <GoldCornerAccent position="bl" />
              <GoldCornerAccent position="br" />

              {/* Title */}
              <motion.h3
                className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xl sm:text-2xl text-center tracking-wider mb-2"
                style={{
                  textShadow: '0 0 15px rgba(201, 168, 76, 0.4), 0 0 30px rgba(201, 168, 76, 0.15)',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {title}
              </motion.h3>

              {/* Ornamental divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <OrnamentalDivider />
              </motion.div>

              {/* Message with typewriter effect */}
              <motion.div
                className="min-h-[5rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <TypewriterText
                  text={message}
                  onComplete={() => setTypewriterComplete(true)}
                />
              </motion.div>

              {/* Close / Re-seal button */}
              <motion.div
                className="mt-6 sm:mt-8 pt-4 border-t border-[#2a2a2a]/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: typewriterComplete ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                  <button
                    onClick={handleClose}
                    className="font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8a7e6b] hover:text-[#c9a84c] transition-colors duration-300 cursor-pointer py-1"
                    aria-label="Volver a sellar la confesión"
                  >
                    Volver a sellar
                  </button>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
