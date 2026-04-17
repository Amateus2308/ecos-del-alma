'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface GothicMusicBoxProps {
  className?: string;
}

// ─── Note Frequencies ───
const NOTE_FREQ: Record<string, number> = {
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G4: 392.0,
  B4: 493.88,
  A4: 440.0,
};

// ─── Melody: simple arpeggio pattern (gothic music box feel) ───
const MELODY: { note: string; freq: number }[] = [
  { note: 'C5', freq: NOTE_FREQ.C5 },
  { note: 'E5', freq: NOTE_FREQ.E5 },
  { note: 'G4', freq: NOTE_FREQ.G4 },
  { note: 'C5', freq: NOTE_FREQ.C5 },
  { note: 'E5', freq: NOTE_FREQ.E5 },
  { note: 'D5', freq: NOTE_FREQ.D5 },
  { note: 'B4', freq: NOTE_FREQ.B4 },
  { note: 'C5', freq: NOTE_FREQ.C5 },
];

const NOTE_DURATION = 400; // ms per note
const TOTAL_MELODY_DURATION = MELODY.length * NOTE_DURATION; // ~3200ms

// ─── Musical Note Particle ───
interface MusicNote {
  id: number;
  symbol: string;
  x: number;
  delay: number;
  duration: number;
}

function MusicalNoteParticles({ active }: { active: boolean }) {
  const particles = useMemo<MusicNote[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        symbol: i % 2 === 0 ? '\u266A' : '\u266B',
        x: 20 + Math.random() * 60,
        delay: i * 400 + Math.random() * 300,
        duration: 2.5 + Math.random() * 1.5,
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-[#c9a84c]"
              style={{
                left: `${p.x}%`,
                bottom: '60%',
                fontSize: '14px',
                opacity: 0,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [-20, -120],
                opacity: [0, 0.7, 0.4, 0],
                x: [0, (Math.random() - 0.5) * 30],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay / 1000,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            >
              {p.symbol}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Gold Filigree Decoration ───
function GoldFiligree({ className = '' }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="20"
      viewBox="0 0 200 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Center flourish */}
      <path
        d="M100 10 C95 4, 86 3, 80 6 C77 7.5, 76 9.5, 78 10 C76 10.5, 77 12.5, 80 14 C86 17, 95 16, 100 10Z"
        stroke="#c9a84c"
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M100 10 C105 4, 114 3, 120 6 C123 7.5, 124 9.5, 122 10 C124 10.5, 123 12.5, 120 14 C114 17, 105 16, 100 10Z"
        stroke="#c9a84c"
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
      <circle cx="100" cy="10" r="1.5" fill="#c9a84c" opacity="0.4" />
      {/* Left vine */}
      <path d="M80 10 C68 10, 55 8, 40 10" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.35" />
      <path d="M70 7 C65 5, 58 7, 50 9" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.25" />
      <path d="M70 13 C65 15, 58 13, 50 11" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.25" />
      {/* Right vine */}
      <path d="M120 10 C132 10, 145 8, 160 10" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.35" />
      <path d="M130 7 C135 5, 142 7, 150 9" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.25" />
      <path d="M130 13 C135 15, 142 13, 150 11" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.25" />
      {/* End dots */}
      <circle cx="40" cy="10" r="1" fill="#c9a84c" opacity="0.3" />
      <circle cx="160" cy="10" r="1" fill="#c9a84c" opacity="0.3" />
    </svg>
  );
}

// ─── Main Component ───
export default function GothicMusicBox({ className = '' }: GothicMusicBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [spinKey, setSpinKey] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const melodyLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  // ─── Play single note ───
  const playNote = useCallback((freq: number, startTime: number, durationSec: number) => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Soft attack and release for music box feel
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);

    osc.connect(noteGain);
    noteGain.connect(masterGainRef.current);

    osc.start(startTime);
    osc.stop(startTime + durationSec + 0.05);
    activeOscillatorsRef.current.push(osc);

    osc.onended = () => {
      const idx = activeOscillatorsRef.current.indexOf(osc);
      if (idx > -1) activeOscillatorsRef.current.splice(idx, 1);
      try { noteGain.disconnect(); } catch { /* already disconnected */ }
      try { osc.disconnect(); } catch { /* already disconnected */ }
    };
  }, []);

  // ─── Ref to hold the latest playMelody for self-scheduling ───
  const playMelodyRef = useRef<() => void>(() => {});

  // ─── Play full melody (schedules all notes and sets loop) ───
  const playMelody = useCallback(() => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    let currentTime = ctx.currentTime + 0.05;

    MELODY.forEach((n) => {
      const noteSec = (NOTE_DURATION * 0.85) / 1000;
      playNote(n.freq, currentTime, noteSec);
      currentTime += NOTE_DURATION / 1000;
    });

    // Schedule next loop via ref to avoid stale closure
    melodyLoopRef.current = setTimeout(() => playMelodyRef.current(), TOTAL_MELODY_DURATION + 100);
  }, [playNote]);

  // Keep ref up to date
  useEffect(() => {
    playMelodyRef.current = playMelody;
  }, [playMelody]);

  // ─── Stop melody with fade out ───
  const stopMelody = useCallback(() => {
    if (melodyLoopRef.current) {
      clearTimeout(melodyLoopRef.current);
      melodyLoopRef.current = null;
    }

    // Fade out master gain
    if (masterGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    }

    // Force stop after fade
    setTimeout(() => {
      activeOscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      activeOscillatorsRef.current = [];

      // Reset master gain
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setValueAtTime(0.15, audioContextRef.current.currentTime);
      }
    }, 400);
  }, []);

  // ─── Toggle open/close ───
  const toggleBox = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isOpen) {
      // Open the box
      setIsOpen(true);
      setSpinKey((k) => k + 1);

      // Create AudioContext lazily on first open
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.gain.setValueAtTime(0.15, audioContextRef.current.currentTime);
        masterGainRef.current.connect(audioContextRef.current.destination);
      }

      // Resume if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Play melody after lid opens
      setTimeout(playMelody, 600);
    } else {
      // Close the box
      stopMelody();
      setTimeout(() => setIsOpen(false), 500);
    }

    setTimeout(() => setIsAnimating(false), 700);
  }, [isOpen, isAnimating, playMelody, stopMelody]);

  // ─── Cleanup on unmount ───
  useEffect(() => {
    return () => {
      if (melodyLoopRef.current) clearTimeout(melodyLoopRef.current);
      activeOscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`relative w-full max-w-md mx-auto my-8 sm:my-12 ${className}`}>
      {/* ─── Title & Subtitle ─── */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="font-[family-name:var(--font-cinzel-decorative)] text-2xl sm:text-3xl text-gradient-gold tracking-wider mb-2"
          style={{
            textShadow: '0 0 20px rgba(201, 168, 76, 0.3), 0 0 40px rgba(201, 168, 76, 0.1)',
          }}
        >
          Caja de M&uacute;sica
        </h2>
        <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm sm:text-base tracking-wide">
          Una melod&iacute;a que trasciende el tiempo
        </p>
      </motion.div>

      {/* ─── Music Box SVG Container ─── */}
      <motion.div
        className="relative flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={toggleBox}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleBox();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          isOpen
            ? 'Caja de m\u00fasica abierta. Toca para cerrar.'
            : 'Caja de m\u00fasica cerrada. Toca para abrir y escuchar la melod\u00eda.'
        }
        style={{ cursor: 'pointer', perspective: '800px' }}
      >
        <svg
          width="300"
          height="280"
          viewBox="0 0 300 280"
          fill="none"
          className="w-full max-w-[300px] h-auto"
        >
          <defs>
            {/* Dark wood gradient */}
            <linearGradient id="mb-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a1810" />
              <stop offset="30%" stopColor="#1a100a" />
              <stop offset="60%" stopColor="#231510" />
              <stop offset="100%" stopColor="#150d08" />
            </linearGradient>

            {/* Lid wood gradient */}
            <linearGradient id="mb-lid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2e1a12" />
              <stop offset="50%" stopColor="#1e110c" />
              <stop offset="100%" stopColor="#2a1810" />
            </linearGradient>

            {/* Velvet interior gradient */}
            <linearGradient id="mb-velvet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d1525" />
              <stop offset="50%" stopColor="#2a0e1a" />
              <stop offset="100%" stopColor="#1f0a14" />
            </linearGradient>

            {/* Gold gradient for trim */}
            <linearGradient id="mb-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a6b2e" />
              <stop offset="30%" stopColor="#c9a84c" />
              <stop offset="50%" stopColor="#e8cc78" />
              <stop offset="70%" stopColor="#c9a84c" />
              <stop offset="100%" stopColor="#8a6b2e" />
            </linearGradient>

            {/* Interior glow */}
            <radialGradient id="mb-glow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
            </radialGradient>

            {/* Shadow filter */}
            <filter id="mb-shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* ═══════ BOX BODY (bottom half) ═══════ */}
          <g filter="url(#mb-shadow)">
            {/* Main box body */}
            <rect
              x="30" y="145" width="240" height="100" rx="4"
              fill="url(#mb-wood)" stroke="url(#mb-gold)" strokeWidth="1.5"
            />

            {/* Wood grain texture lines */}
            <line x1="50" y1="160" x2="250" y2="160" stroke="#3a2218" strokeWidth="0.3" opacity="0.4" />
            <line x1="45" y1="175" x2="255" y2="175" stroke="#3a2218" strokeWidth="0.2" opacity="0.3" />
            <line x1="50" y1="190" x2="250" y2="190" stroke="#3a2218" strokeWidth="0.3" opacity="0.35" />
            <line x1="48" y1="205" x2="252" y2="205" stroke="#3a2218" strokeWidth="0.2" opacity="0.3" />
            <line x1="50" y1="220" x2="250" y2="220" stroke="#3a2218" strokeWidth="0.3" opacity="0.25" />

            {/* Gold trim — bottom edge */}
            <rect x="30" y="238" width="240" height="7" rx="1" fill="url(#mb-gold)" opacity="0.4" />

            {/* ── Interior (visible when open) ── */}
            <AnimatePresence>
              {isOpen && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <rect x="38" y="148" width="224" height="94" rx="2" fill="url(#mb-velvet)" />
                  <rect x="38" y="148" width="224" height="94" rx="2" fill="url(#mb-glow)" />
                  {/* Velvet texture dots */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <circle
                      key={`v${i}`}
                      cx={48 + (i % 10) * 22}
                      cy={158 + Math.floor(i / 10) * 20}
                      r="0.4"
                      fill="#5a2040"
                      opacity="0.3"
                    />
                  ))}
                  {/* Miniature mirror on back wall */}
                  <rect x="110" y="100" width="80" height="45" rx="2" fill="#1a0a12" stroke="#c9a84c" strokeWidth="0.5" opacity="0.6" />
                  <rect x="113" y="103" width="74" height="39" rx="1" fill="#0f0609" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
                  {/* Mirror shine */}
                  <line x1="120" y1="108" x2="135" y2="130" stroke="#c9a84c" strokeWidth="0.15" opacity="0.3" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* ── Ballerina (visible when open, spinning) ── */}
            <AnimatePresence>
              {isOpen && (
                <motion.g
                  key={spinKey}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, 360],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.3 },
                    scale: { duration: 0.5, delay: 0.3, type: 'spring' },
                    rotate: { duration: 2.5, repeat: Infinity, ease: 'linear' },
                  }}
                  style={{ originX: '150px', originY: '190px' }}
                >
                  {/* Pedestal */}
                  <ellipse cx="150" cy="232" rx="12" ry="3" fill="#c9a84c" opacity="0.3" />
                  <rect x="146" y="222" width="8" height="10" rx="1" fill="#c9a84c" opacity="0.25" />

                  {/* Ballerina figure — silhouette centered at 150,190 */}
                  {/* Head */}
                  <circle cx="150" cy="162" r="4" fill="#c9a84c" opacity="0.8" />
                  {/* Hair bun */}
                  <circle cx="150" cy="158.5" r="2.2" fill="#c9a84c" opacity="0.6" />
                  {/* Neck */}
                  <rect x="148.5" y="166" width="3" height="4" rx="1" fill="#c9a84c" opacity="0.7" />
                  {/* Torso / tutu */}
                  <path
                    d="M144 170 C144 170, 146 168, 150 168 C154 168, 156 170, 156 170 L158 178 L142 178 Z"
                    fill="#c9a84c" opacity="0.2"
                    stroke="#c9a84c" strokeWidth="0.5"
                  />
                  {/* Tutu skirt */}
                  <ellipse cx="150" cy="178" rx="10" ry="3" fill="none" stroke="#c9a84c" strokeWidth="0.6" opacity="0.5" />
                  <ellipse cx="150" cy="177" rx="8" ry="2" fill="#c9a84c" opacity="0.1" />
                  {/* Arms raised */}
                  <path d="M145 170 C143 167, 140 164, 138 162" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d="M155 170 C157 167, 160 164, 162 162" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  {/* Standing leg */}
                  <path d="M150 178 L150 210 L148 212 M150 210 L152 212" stroke="#c9a84c" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
                  {/* Extended leg (arabesque) */}
                  <path d="M150 180 L162 196 L164 195" stroke="#c9a84c" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Front gold filigree scrollwork */}
            <path
              d="M80 185 C85 180, 95 178, 100 182 C103 184, 102 188, 100 190 C102 192, 103 196, 100 198 C95 202, 85 200, 80 195"
              stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.35"
            />
            <path
              d="M220 185 C215 180, 205 178, 200 182 C197 184, 198 188, 200 190 C198 192, 197 196, 200 198 C205 202, 215 200, 220 195"
              stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.35"
            />
            {/* Center rosette */}
            <circle cx="150" cy="190" r="8" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="150" cy="190" r="4" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.2" />
            <circle cx="150" cy="190" r="1.5" fill="#c9a84c" opacity="0.2" />

            {/* Front clasp */}
            {!isOpen && (
              <g>
                <rect x="144" y="142" width="12" height="8" rx="2" fill="url(#mb-gold)" opacity="0.5" />
                <circle cx="150" cy="146" r="1.5" fill="#1a100a" opacity="0.6" />
              </g>
            )}
          </g>

          {/* ═══════ LID (top half) ═══════ */}
          <motion.g
            animate={
              isOpen
                ? { rotateX: -120, y: -5 }
                : { rotateX: 0, y: 0 }
            }
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: '150px 145px' }}
          >
            {/* Lid main rectangle */}
            <rect
              x="30" y="75" width="240" height="72" rx="4"
              fill="url(#mb-lid)" stroke="url(#mb-gold)" strokeWidth="1.5"
            />

            {/* Lid gold trim — top edge */}
            <rect x="30" y="75" width="240" height="6" rx="1" fill="url(#mb-gold)" opacity="0.35" />

            {/* Lid wood grain */}
            <line x1="50" y1="90" x2="250" y2="90" stroke="#3a2218" strokeWidth="0.2" opacity="0.3" />
            <line x1="45" y1="105" x2="255" y2="105" stroke="#3a2218" strokeWidth="0.3" opacity="0.25" />
            <line x1="50" y1="120" x2="250" y2="120" stroke="#3a2218" strokeWidth="0.2" opacity="0.3" />
            <line x1="48" y1="133" x2="252" y2="133" stroke="#3a2218" strokeWidth="0.2" opacity="0.2" />

            {/* Outer ornate border on lid */}
            <rect x="65" y="88" width="170" height="48" rx="3" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.3" />
            {/* Inner border on lid */}
            <rect x="70" y="92" width="160" height="40" rx="2" stroke="#c9a84c" strokeWidth="0.3" fill="none" opacity="0.2" />

            {/* Center treble clef / musical symbol */}
            <g opacity="0.4">
              <path
                d="M150 97 C148 97, 146 99, 146 102 C146 105, 148 107, 150 107 C152 107, 154 105, 154 102 C154 99, 152 97, 150 97Z"
                stroke="#c9a84c" strokeWidth="0.5" fill="none"
              />
              <line x1="150" y1="97" x2="150" y2="118" stroke="#c9a84c" strokeWidth="0.5" />
              <path d="M150 118 C148 116, 145 115, 144 117 C143 119, 145 121, 148 120" stroke="#c9a84c" strokeWidth="0.5" fill="none" />
              <path d="M150 105 C152 107, 155 108, 156 106 C157 104, 155 102, 152 103" stroke="#c9a84c" strokeWidth="0.4" fill="none" />
            </g>

            {/* Corner ornaments */}
            <circle cx="70" cy="92" r="2" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.3" />
            <circle cx="230" cy="92" r="2" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.3" />
            <circle cx="70" cy="132" r="2" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.3" />
            <circle cx="230" cy="132" r="2" stroke="#c9a84c" strokeWidth="0.4" fill="none" opacity="0.3" />
          </motion.g>

          {/* ═══════ HINGES ═══════ */}
          <rect x="60" y="140" width="14" height="10" rx="2" fill="url(#mb-gold)" opacity="0.5" />
          <rect x="226" y="140" width="14" height="10" rx="2" fill="url(#mb-gold)" opacity="0.5" />
          <circle cx="67" cy="145" r="1.5" fill="#1a100a" opacity="0.4" />
          <circle cx="233" cy="145" r="1.5" fill="#1a100a" opacity="0.4" />

          {/* ═══════ BOX FEET ═══════ */}
          <ellipse cx="55" cy="248" rx="10" ry="4" fill="#1a100a" stroke="url(#mb-gold)" strokeWidth="0.5" opacity="0.7" />
          <ellipse cx="245" cy="248" rx="10" ry="4" fill="#1a100a" stroke="url(#mb-gold)" strokeWidth="0.5" opacity="0.7" />
        </svg>

        {/* ─── Ambient warm glow from inside when open ─── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[220px] h-[120px] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.03) 50%, transparent 70%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Musical Note Particles ─── */}
        <MusicalNoteParticles active={isOpen} />
      </motion.div>

      {/* ─── Instruction Text ─── */}
      <motion.div className="text-center mt-6">
        <motion.p
          className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm tracking-wide"
          animate={{
            opacity: isAnimating ? 0 : isOpen ? [0.5, 0.8, 0.5] : [0.6, 1, 0.6],
          }}
          transition={
            isAnimating
              ? { duration: 0.15 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          {isOpen ? 'Toca para cerrar la caja' : 'Toca para abrir la caja de m\u00fasica'}
        </motion.p>
      </motion.div>

      {/* ─── Gold Filigree Divider ─── */}
      <div className="mt-8 px-4">
        <GoldFiligree />
      </div>
    </div>
  );
}
