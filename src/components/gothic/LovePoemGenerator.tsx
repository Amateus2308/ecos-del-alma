'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Sparkles, RefreshCw, X } from 'lucide-react';

export default function LovePoemGenerator() {
  const [poem, setPoem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [visible, setVisible] = useState(false);

  const generatePoem = useCallback(async () => {
    setLoading(true);
    setError('');
    setPoem(null);
    setDisplayedText('');
    setVisible(true);

    try {
      const res = await fetch('/api/poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: 'amor gótico oscuro, laberinto, ecos del alma, eternidad, sombras y luz',
          language: 'es',
        }),
      });

      if (!res.ok) {
        throw new Error('Error del servidor');
      }

      const data = await res.json();
      if (data.poem) {
        setPoem(data.poem);
        // Typewriter effect
        setIsTyping(true);
        let index = 0;
        const text = data.poem;
        const interval = setInterval(() => {
          if (index < text.length) {
            setDisplayedText(text.slice(0, index + 1));
            index++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
          }
        }, 25);
      } else {
        setError(data.error || 'No se pudo generar el poema');
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setPoem(null);
      setDisplayedText('');
      setError('');
    }, 300);
  };

  return (
    <div className="w-full max-w-lg mx-auto my-8 sm:my-12">
      {/* Generate button */}
      {!visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePoem}
            className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded border border-[#2a2a2a]
              bg-[#111]/80 text-[#c9a84c] font-[family-name:var(--font-cinzel)] tracking-wider uppercase text-sm
              hover:border-[#c9a84c]/30 hover:shadow-[0_0_20px_rgba(201,168,76,0.08)] transition-all cursor-pointer
              overflow-hidden"
          >
            {/* Shimmer overlay */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-r from-transparent via-[#c9a84c]/5 to-transparent" />

            <Feather size={16} className="relative z-10 quill-write" />
            <span className="relative z-10">Generar Poema del Alma</span>
            <Sparkles size={14} className="relative z-10 text-[#c9a84c]/50" />
          </motion.button>
          <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs mt-3">
            Deja que la pluma del laberinto escriba para ti
          </p>
        </motion.div>
      )}

      {/* Poem display */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative paper-texture border border-[#2a2a2a] rounded-lg p-6 sm:p-8 poem-card-glow overflow-hidden">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c9a84c]/25 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#c9a84c]/25 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#c9a84c]/25 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c9a84c]/25 rounded-br-lg pointer-events-none" />

              {/* Close button */}
              {!loading && !isTyping && (
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1.5 rounded text-[#8a7e6b]/40 hover:text-[#a00000] transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}

              {/* Header */}
              <div className="text-center mb-5">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Feather size={20} className="text-[#c9a84c]/40 mx-auto mb-2" />
                  <h3 className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-base sm:text-lg tracking-wider"
                    style={{ textShadow: '0 0 15px rgba(201,168,76,0.2)' }}
                  >
                    Versos del Laberinto
                  </h3>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                <span className="text-[#c9a84c]/30 text-[10px]">◆</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
              </div>

              {/* Content */}
              <div className="min-h-[8rem]">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="mb-4"
                    >
                      <Feather size={24} className="text-[#c9a84c]/40 quill-write" />
                    </motion.div>
                    <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-sm">
                      La pluma escribe...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-6">
                    <p className="font-[family-name:var(--font-fell)] italic text-[#a00000] text-sm mb-3">
                      {error}
                    </p>
                    <button
                      onClick={generatePoem}
                      className="text-[#8a7e6b] hover:text-[#c9a84c] text-xs font-[family-name:var(--font-cinzel)]
                        tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {displayedText && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-[family-name:var(--font-fell)] italic text-[#c4b59a] text-sm sm:text-base
                      leading-[1.9] tracking-[0.02em] whitespace-pre-wrap text-center relative"
                    style={{ textShadow: '0 0 1px rgba(139,0,0,0.08)' }}
                  >
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-[2px] h-4 bg-[#c9a84c] ml-[1px] align-text-bottom"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: 'steps(2)' }}
                      />
                    )}
                  </motion.p>
                )}
              </div>

              {/* Actions after generation */}
              {poem && !isTyping && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 pt-4 border-t border-[#2a2a2a]/40 flex justify-center"
                >
                  <button
                    onClick={generatePoem}
                    className="flex items-center gap-2 px-4 py-2 rounded border border-[#2a2a2a] text-[#8a7e6b]
                      text-xs font-[family-name:var(--font-cinzel)] tracking-wider uppercase
                      hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    Nuevo poema
                  </button>
                </motion.div>
              )}

              {/* Footer ornament */}
              <div className="mt-4 text-center">
                <span className="font-[family-name:var(--font-typewriter)] text-[#3a3530] text-[10px] tracking-wider">
                  — Generado por los ecos del alma —
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
