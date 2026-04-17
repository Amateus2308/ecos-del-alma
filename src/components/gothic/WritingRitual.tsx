'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ChevronLeft, ChevronRight, Feather, Sparkles, Eye, Palette } from 'lucide-react';
import { toast } from 'sonner';
import GothicDivider from '@/components/gothic/GothicDivider';

// ─── Types ───
interface WritingRitualProps {
  className?: string;
}

type Mood = 'pasión' | 'melancolía' | 'esperanza' | 'nostalgia' | 'devoción' | 'misterio';
type SealColor = 'rojo' | 'negro' | 'dorado';
type ParchmentStyle = 'antiguo' | 'vitela' | 'pergamino oscuro';

const MOODS: Mood[] = ['pasión', 'melancolía', 'esperanza', 'nostalgia', 'devoción', 'misterio'];

const MOOD_DESCRIPTIONS: Record<Mood, string> = {
  pasión: 'Un fuego que arde sin control',
  melancolía: 'La dulce tristeza del recuerdo',
  esperanza: 'Una luz al final del laberinto',
  nostalgia: 'Añoranza de lo que una vez fue',
  devoción: 'Entrega absoluta del alma',
  misterio: 'Secretos escritos entre sombras',
};

const MOOD_ICONS: Record<Mood, string> = {
  pasión: '🔥',
  melancolía: '🌑',
  esperanza: '✨',
  nostalgia: '🍂',
  devoción: '🖤',
  misterio: '🗝️',
};

const SEAL_COLORS: { value: SealColor; label: string; hex: string }[] = [
  { value: 'rojo', label: 'Rojo', hex: '#8B0000' },
  { value: 'negro', label: 'Negro', hex: '#1a1a1a' },
  { value: 'dorado', label: 'Dorado', hex: '#c9a84c' },
];

const PARCHMENT_STYLES: { value: ParchmentStyle; label: string; bg: string; textColor: string }[] = [
  {
    value: 'antiguo',
    label: 'Antiguo',
    bg: 'linear-gradient(135deg, #2a2318 0%, #1e1a12 50%, #252015 100%)',
    textColor: '#d4c5b0',
  },
  {
    value: 'vitela',
    label: 'Vitela',
    bg: 'linear-gradient(135deg, #2e2b24 0%, #242018 50%, #2c2820 100%)',
    textColor: '#e0d5c0',
  },
  {
    value: 'pergamino oscuro',
    label: 'Pergamino Oscuro',
    bg: 'linear-gradient(135deg, #1a1815 0%, #141210 50%, #1c1916 100%)',
    textColor: '#b8a88e',
  },
];

const TOTAL_STEPS = 4;

// ─── Wax Seal SVG ───
function WaxSeal({ color }: { color: SealColor }) {
  const sealColor = SEAL_COLORS.find((s) => s.value === color)?.hex ?? '#8B0000';
  const accentColor = color === 'negro' ? '#3a3a3a' : '#c9a84c';

  return (
    <div className="flex justify-center mt-6">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Outer ring */}
        <circle cx="36" cy="36" r="34" fill={sealColor} opacity="0.9" />
        <circle cx="36" cy="36" r="34" stroke={accentColor} strokeWidth="1.5" opacity="0.4" />
        {/* Inner ring */}
        <circle cx="36" cy="36" r="26" stroke={accentColor} strokeWidth="0.8" opacity="0.3" />
        {/* Cross design */}
        <line x1="36" y1="14" x2="36" y2="58" stroke={accentColor} strokeWidth="1.2" opacity="0.5" />
        <line x1="14" y1="36" x2="58" y2="36" stroke={accentColor} strokeWidth="1.2" opacity="0.5" />
        {/* Center diamond */}
        <rect x="32" y="32" width="8" height="8" rx="1" transform="rotate(45 36 36)" fill={accentColor} opacity="0.5" />
        {/* Shine highlight */}
        <ellipse cx="28" cy="26" rx="6" ry="4" fill="white" opacity="0.08" transform="rotate(-20 28 26)" />
        {/* Drip effect */}
        <ellipse cx="22" cy="56" rx="4" ry="6" fill={sealColor} opacity="0.7" />
        <ellipse cx="52" cy="58" rx="3" ry="5" fill={sealColor} opacity="0.5" />
        <ellipse cx="58" cy="28" rx="3" ry="4" fill={sealColor} opacity="0.4" />
      </svg>
    </div>
  );
}

// ─── Progress Dots ───
function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className="w-8 h-px transition-all duration-500"
                style={{
                  backgroundColor: isCompleted ? 'rgba(201,168,76,0.4)' : 'rgba(42,42,42,0.6)',
                }}
              />
            )}
            <motion.button
              onClick={() => {
                // Only allow going back to completed steps or current
                if (step <= currentStep) {
                  // We'll handle this via a callback
                }
              }}
              className="flex items-center justify-center cursor-default"
              aria-label={`Paso ${step}`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  boxShadow: isActive ? '0 0 16px rgba(201,168,76,0.3)' : '0 0 0px transparent',
                }}
                transition={{ duration: 0.3 }}
                className={`w-3 h-3 rounded-full border transition-all duration-500 ${
                  isActive
                    ? 'bg-[#c9a84c] border-[#c9a84c]'
                    : isCompleted
                      ? 'bg-[#c9a84c]/40 border-[#c9a84c]/40'
                      : 'bg-transparent border-[#2a2a2a]'
                }`}
              />
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Decorative Divider Between Steps ───
function StepDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-[#c9a84c]/35" />
      <div className="relative flex items-center justify-center">
        <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a84c]/20" />
        <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/25" />
      </div>
      <span className="font-[family-name:var(--font-typewriter)] text-[7px] tracking-[0.4em] uppercase text-[#5a5040]/50">
        ◆
      </span>
      <div className="relative flex items-center justify-center">
        <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a84c]/20" />
        <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/25" />
      </div>
      <div className="w-10 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/20 to-[#c9a84c]/35" />
    </div>
  );
}

// ─── Gold Corner Accents ───
function GoldCorners({ opacity = 0.2 }: { opacity?: number }) {
  return (
    <>
      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r rounded-tr-sm pointer-events-none" style={{ borderColor: `rgba(201,168,76,${opacity})` }} />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l rounded-bl-sm pointer-events-none" style={{ borderColor: `rgba(201,168,76,${opacity})` }} />
      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l rounded-tl-sm pointer-events-none" style={{ borderColor: `rgba(201,168,76,${opacity * 0.6})` }} />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r rounded-br-sm pointer-events-none" style={{ borderColor: `rgba(201,168,76,${opacity * 0.6})` }} />
    </>
  );
}

// ─── Step 1: Choose Mood ───
function StepMood({
  mood,
  setMood,
}: {
  mood: Mood | '';
  setMood: (m: Mood) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative bg-[#111]/60 border border-[#2a2a2a] rounded-lg p-5 sm:p-6 overflow-hidden"
      style={{ boxShadow: '0 0 30px rgba(201,168,76,0.04)' }}
    >
      <GoldCorners opacity={0.15} />

      {/* Active gold glow border */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          boxShadow: '0 0 20px rgba(201,168,76,0.06), inset 0 0 20px rgba(201,168,76,0.02)',
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Feather size={14} className="text-[#c9a84c]/50" />
          <h3 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs tracking-[0.15em] uppercase">
            Elige la Emoción
          </h3>
        </div>
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs mb-5">
          ¿Qué siente tu alma en este momento?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MOODS.map((m) => {
            const isSelected = mood === m;
            return (
              <motion.button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 sm:p-4 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#c9a84c]/40 bg-[#c9a84c]/5'
                    : 'border-[#2a2a2a] bg-[#0a0a0a]/40 hover:border-[#c9a84c]/20 hover:bg-[#c9a84c]/3'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="mood-glow"
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{ boxShadow: '0 0 24px rgba(201,168,76,0.1)' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="relative z-10">
                  <span className="text-lg mb-1.5 block">{MOOD_ICONS[m]}</span>
                  <p
                    className={`font-[family-name:var(--font-cinzel)] text-xs tracking-wider capitalize ${
                      isSelected ? 'text-[#c9a84c]' : 'text-[#8a7e6b]'
                    }`}
                  >
                    {m}
                  </p>
                  <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/60 text-[9px] mt-0.5 leading-snug">
                    {MOOD_DESCRIPTIONS[m]}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Write Raw Thought ───
function StepWrite({
  rawText,
  setRawText,
  mood,
}: {
  rawText: string;
  setRawText: (t: string) => void;
  mood: Mood | '';
}) {
  const MAX_CHARS = 2000;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative bg-[#111]/60 border border-[#2a2a2a] rounded-lg p-5 sm:p-6 overflow-hidden"
      style={{ boxShadow: '0 0 30px rgba(201,168,76,0.04)' }}
    >
      <GoldCorners opacity={0.15} />

      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          boxShadow: '0 0 20px rgba(201,168,76,0.06), inset 0 0 20px rgba(201,168,76,0.02)',
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-[#c9a84c]/50" />
          <h3 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs tracking-[0.15em] uppercase">
            Escribe tu Pensamiento
          </h3>
        </div>
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs mb-5">
          Deja que la tinta fluya sin filtro...
        </p>

        {mood && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">{MOOD_ICONS[mood]}</span>
            <span className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest capitalize">
              {mood}
            </span>
          </div>
        )}

        <div className="relative paper-texture rounded-lg overflow-hidden border border-[#2a2a2a]">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            maxLength={MAX_CHARS}
            rows={8}
            placeholder="Aquí, en este pergamino digital, escribo lo que mi alma guarda en silencio..."
            className="w-full bg-transparent px-4 py-3 text-[#d4c5b0] text-sm sm:text-base font-[family-name:var(--font-typewriter)] leading-[1.9] tracking-[0.02em]
              placeholder:text-[#5a5040]/30 focus:outline-none resize-none"
          />
        </div>

        <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1.5 text-right">
          {rawText.length}/{MAX_CHARS}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Decorative Elements ───
function StepDecorate({
  sealColor,
  setSealColor,
  parchmentStyle,
  setParchmentStyle,
}: {
  sealColor: SealColor;
  setSealColor: (c: SealColor) => void;
  parchmentStyle: ParchmentStyle;
  setParchmentStyle: (s: ParchmentStyle) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative bg-[#111]/60 border border-[#2a2a2a] rounded-lg p-5 sm:p-6 overflow-hidden"
      style={{ boxShadow: '0 0 30px rgba(201,168,76,0.04)' }}
    >
      <GoldCorners opacity={0.15} />

      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          boxShadow: '0 0 20px rgba(201,168,76,0.06), inset 0 0 20px rgba(201,168,76,0.02)',
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={14} className="text-[#c9a84c]/50" />
          <h3 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs tracking-[0.15em] uppercase">
            Adornos y Estilo
          </h3>
        </div>
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs mb-5">
          Elige cómo sellará tu carta el paso del tiempo
        </p>

        {/* Wax Seal Color */}
        <div className="mb-6">
          <label className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-3">
            Color del Sello de Cera
          </label>
          <div className="flex items-center gap-4">
            {SEAL_COLORS.map((s) => {
              const isSelected = sealColor === s.value;
              return (
                <motion.button
                  key={s.value}
                  type="button"
                  onClick={() => setSealColor(s.value)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div
                    className="relative w-10 h-10 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: s.hex,
                      borderColor: isSelected ? '#c9a84c' : 'rgba(42,42,42,0.8)',
                      boxShadow: isSelected
                        ? `0 0 16px ${s.value === 'negro' ? 'rgba(58,58,58,0.3)' : `${s.hex}40`}`
                        : 'none',
                      opacity: isSelected ? 1 : 0.5,
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
                      </motion.div>
                    )}
                  </div>
                  <span
                    className={`font-[family-name:var(--font-fell)] italic text-[10px] capitalize ${
                      isSelected ? 'text-[#c9a84c]' : 'text-[#5a5040]'
                    }`}
                  >
                    {s.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Parchment Style */}
        <div>
          <label className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-3">
            Estilo del Pergamino
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PARCHMENT_STYLES.map((p) => {
              const isSelected = parchmentStyle === p.value;
              return (
                <motion.button
                  key={p.value}
                  type="button"
                  onClick={() => setParchmentStyle(p.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative rounded-lg border overflow-hidden transition-all cursor-pointer p-3 ${
                    isSelected
                      ? 'border-[#c9a84c]/40'
                      : 'border-[#2a2a2a] hover:border-[#c9a84c]/20'
                  }`}
                >
                  {/* Mini parchment preview */}
                  <div
                    className="w-full h-12 rounded mb-2 border border-[#2a2a2a]/50"
                    style={{ background: p.bg }}
                  />
                  <p
                    className={`font-[family-name:var(--font-cinzel)] text-[10px] tracking-wider text-center ${
                      isSelected ? 'text-[#c9a84c]' : 'text-[#5a5040]'
                    }`}
                  >
                    {p.label}
                  </p>
                  {isSelected && (
                    <motion.div
                      layoutId="parchment-glow"
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{ boxShadow: '0 0 20px rgba(201,168,76,0.08)' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 4: Preview & Copy ───
function StepPreview({
  rawText,
  mood,
  sealColor,
  parchmentStyle,
  onCopy,
}: {
  rawText: string;
  mood: Mood | '';
  sealColor: SealColor;
  parchmentStyle: ParchmentStyle;
  onCopy: () => void;
}) {
  const parchment = PARCHMENT_STYLES.find((p) => p.value === parchmentStyle);
  const formattedText = rawText.trim();

  // Build the copy text
  const copyText = [
    `— ${mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : 'Carta'} —`,
    '',
    formattedText,
    '',
    '✦ Fin de la carta ✦',
  ].join('\n');

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Preview card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative rounded-lg overflow-hidden border border-[#2a2a2a]"
        style={{
          background: parchment?.bg ?? PARCHMENT_STYLES[0].bg,
          boxShadow: '0 0 40px rgba(201,168,76,0.06), 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <GoldCorners opacity={0.25} />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Mood header */}
          {mood && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-4"
            >
              <span className="text-lg block mb-1">{MOOD_ICONS[mood]}</span>
              <p className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs tracking-[0.25em] uppercase">
                {mood}
              </p>
            </motion.div>
          )}

          {/* Ornamental divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mb-5"
          >
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
            <span className="font-[family-name:var(--font-typewriter)] text-[8px]" style={{ color: 'rgba(201,168,76,0.35)' }}>
              ◆✦◆
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
          </motion.div>

          {/* Letter content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="min-h-[80px]"
          >
            <p
              className="font-[family-name:var(--font-typewriter)] text-sm sm:text-base leading-[1.9] tracking-[0.02em] whitespace-pre-wrap"
              style={{ color: parchment?.textColor ?? '#d4c5b0' }}
            >
              {formattedText || (
                <span className="text-[#5a5040]/40 italic">Tu carta aparecerá aquí...</span>
              )}
            </p>
          </motion.div>

          {/* Ornamental divider bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-5"
          >
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/25" />
            <span className="font-[family-name:var(--font-typewriter)] text-[7px] tracking-[0.3em] uppercase" style={{ color: 'rgba(90,80,64,0.5)' }}>
              fin de la carta
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/25" />
          </motion.div>

          {/* Wax Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            <WaxSeal color={sealColor} />
          </motion.div>
        </div>
      </motion.div>

      {/* Copy button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 flex justify-center"
      >
        <motion.button
          onClick={onCopy}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={!formattedText}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#c9a84c]/30 bg-[#c9a84c]/5
            text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 transition-all
            font-[family-name:var(--font-cinzel)] text-xs tracking-wider uppercase cursor-pointer
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Copy size={14} />
          Copiar carta
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function WritingRitual({ className = '' }: WritingRitualProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [mood, setMood] = useState<Mood | ''>('');
  const [rawText, setRawText] = useState('');
  const [sealColor, setSealColor] = useState<SealColor>('rojo');
  const [parchmentStyle, setParchmentStyle] = useState<ParchmentStyle>('antiguo');
  const [direction, setDirection] = useState<1 | -1>(1);

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep],
  );

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return mood !== '';
      case 2:
        return rawText.trim().length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [currentStep, mood, rawText]);

  const handleCopy = useCallback(async () => {
    const parchment = PARCHMENT_STYLES.find((p) => p.value === parchmentStyle);
    const copyText = [
      `— ${mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : 'Carta'} —`,
      '',
      rawText.trim(),
      '',
      '✦ Fin de la carta ✦',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(copyText);
      toast.success('Carta copiada al portapapeles', {
        description: 'Tinta eterna preservada',
      });
    } catch {
      toast.error('No se pudo copiar la carta');
    }
  }, [mood, rawText, parchmentStyle]);

  return (
    <div className={className}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/30 text-[10px] uppercase tracking-[0.3em] text-center mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Capítulo XI — Ritual
        </motion.p>
        <GothicDivider text="Ritual de Escritura" />
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
          Donde las palabras se convierten en tinta eterna
        </p>
      </motion.div>

      {/* Step progress indicator */}
      <div className="mt-8">
        <StepProgress currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <StepMood
              key="step-1"
              mood={mood}
              setMood={(m) => {
                setMood(m);
              }}
            />
          )}

          {currentStep === 2 && (
            <StepWrite
              key="step-2"
              rawText={rawText}
              setRawText={setRawText}
              mood={mood}
            />
          )}

          {currentStep === 3 && (
            <StepDecorate
              key="step-3"
              sealColor={sealColor}
              setSealColor={setSealColor}
              parchmentStyle={parchmentStyle}
              setParchmentStyle={setParchmentStyle}
            />
          )}

          {currentStep === 4 && (
            <StepPreview
              key="step-4"
              rawText={rawText}
              mood={mood}
              sealColor={sealColor}
              parchmentStyle={parchmentStyle}
              onCopy={handleCopy}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        <motion.button
          onClick={() => goToStep(currentStep - 1)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={currentStep <= 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#2a2a2a] text-[#8a7e6b]
            hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all
            font-[family-name:var(--font-cinzel)] text-[10px] tracking-wider uppercase cursor-pointer
            disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:border-[#2a2a2a] disabled:hover:text-[#8a7e6b]"
        >
          <ChevronLeft size={14} />
          Atrás
        </motion.button>

        {/* Step indicator text */}
        <span className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] tracking-wider">
          {currentStep} / {TOTAL_STEPS}
        </span>

        <motion.button
          onClick={() => goToStep(currentStep + 1)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={!canProceed() || currentStep >= TOTAL_STEPS}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#8B0000]/30 bg-[#8B0000]/5
            text-[#c9a84c] hover:bg-[#8B0000]/10 hover:border-[#8B0000]/50 transition-all
            font-[family-name:var(--font-cinzel)] text-[10px] tracking-wider uppercase cursor-pointer
            disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-[#8B0000]/5 disabled:hover:border-[#8B0000]/30"
        >
          {currentStep === 3 ? 'Previsualizar' : 'Siguiente'}
          {currentStep === 3 ? <Eye size={14} /> : <ChevronRight size={14} />}
        </motion.button>
      </div>

      {/* Decorative divider between steps label */}
      {currentStep < TOTAL_STEPS && <StepDivider />}
    </div>
  );
}
