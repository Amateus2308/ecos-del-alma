'use client';

// Modal para leer cartas completas
// me costó bastante el tema del scroll con cartas largas —
// al final lo solucioné con items-start y overflow-y-auto en el contenedor padre

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LetterReaderModalProps {
  letter: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_QUOTE = 'Las palabras que no se escribieron permanecen intactas en el eco del alma, esperando el momento en que el silencio las libere.';

function WaxSeal() {
  return (
    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 pointer-events-none select-none z-10">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        {/* Outer ring with depth */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b01010] via-[#8B0000] to-[#4a0000] shadow-[0_2px_20px_rgba(139,0,0,0.5)]" />
        {/* Mid ring */}
        <div className="absolute inset-[3px] rounded-full border border-[#c9a84c]/25" />
        {/* Inner circle */}
        <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-[#c00000] to-[#5a0000]" />
        {/* Inner accent ring */}
        <div className="absolute inset-[10px] rounded-full border border-[#c9a84c]/15" />
        {/* Cross design */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1px] h-6 sm:h-7 bg-[#c9a84c]/30 absolute" />
          <div className="h-[1px] w-6 sm:w-7 bg-[#c9a84c]/30 absolute" />
          <div className="w-3 h-3 rounded-full border border-[#c9a84c]/25" />
        </div>
        {/* Top-left shine */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-white/[0.06]" />
        {/* Drip effect */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-2 bg-gradient-to-b from-[#8B0000] to-transparent rounded-b-full opacity-60" />
      </div>
    </div>
  );
}

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6 sm:my-8">
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

export default function LetterReaderModal({ letter, isOpen, onClose }: LetterReaderModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!letter) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const displayContent = letter.content || FALLBACK_QUOTE;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 sm:py-10 md:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Dark backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Ambient glow */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#8B0000] rounded-full blur-[250px] opacity-[0.03]" />
            <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-[#2d1b3d] rounded-full blur-[200px] opacity-[0.05]" />
          </div>

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] p-2.5 rounded-full border border-[#2a2a2a] bg-[#111111]/90 backdrop-blur-sm hover:border-[#a00000]/60 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            aria-label="Cerrar carta"
          >
            <X className="w-5 h-5 text-[#a00000] group-hover:text-[#c9a84c] transition-colors duration-300" />
          </motion.button>

          {/* Letter container */}
          <motion.div
            className="relative z-10 w-full max-w-2xl mx-4 mb-8 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="paper-texture rounded-lg border border-[#2a2a2a] p-6 sm:p-10 md:p-12 relative shadow-[0_0_60px_rgba(0,0,0,0.5)]">
              {/* Gold-tinted corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c9a84c]/30 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c9a84c]/30 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c9a84c]/30 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c9a84c]/30 rounded-br-lg pointer-events-none" />

              {/* Wax seal */}
              <WaxSeal />

              {/* Title */}
              <motion.h2
                className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-2xl sm:text-3xl mb-3 pr-20 sm:pr-24 text-center sm:text-left"
                style={{
                  textShadow: '0 0 15px rgba(201, 168, 76, 0.4), 0 0 30px rgba(201, 168, 76, 0.15)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {letter.title}
              </motion.h2>

              {/* Date */}
              <motion.p
                className="font-[family-name:var(--font-typewriter)] text-[#8a7e6b] text-xs sm:text-sm tracking-wide text-center sm:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {formatDate(letter.createdAt)}
              </motion.p>

              {/* Ornamental line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <OrnamentalDivider />
              </motion.div>

              {/* Content */}
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                {displayContent.split('\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-[1.9] tracking-[0.03em] whitespace-pre-wrap mb-4 last:mb-0"
                    style={{
                      textShadow: '0 0 1px rgba(139, 0, 0, 0.1)',
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* Footer ornament */}
              <motion.div
                className="mt-8 sm:mt-10 pt-6 border-t border-[#2a2a2a]/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                  <span className="text-[#c9a84c]/30 text-xs select-none">✦</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
                </div>
                <p className="text-center font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs mt-3">
                  Fin de la carta
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
