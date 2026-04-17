'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageCircle, Feather, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import GothicDivider from '@/components/gothic/GothicDivider';

// ─── Types ───
interface WhisperData {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

interface WhisperWallProps {
  isAdmin: boolean;
  token: string | null;
  onRefresh?: () => void;
}

// ─── Ornamental Divider ───
function WhisperDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-[#c9a84c]/50" />
      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/25" />
        <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/30" />
      </div>
      <span className="font-[family-name:var(--font-typewriter)] text-[8px] tracking-[0.4em] uppercase text-[#5a5040]/60">
        ◆
      </span>
      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/25" />
        <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/30" />
      </div>
      <div className="w-10 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/30 to-[#c9a84c]/50" />
    </div>
  );
}

// ─── Whisper Card ───
function WhisperCard({
  whisper,
  index,
  isAdmin,
  token,
  onDelete,
}: {
  whisper: WhisperData;
  index: number;
  isAdmin: boolean;
  token: string | null;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!token || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/whispers?id=${whisper.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Susurro eliminado');
        onDelete(whisper.id);
      } else {
        toast.error('Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setDeleting(false);
    }
  };

  const formattedDate = new Date(whisper.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(whisper.createdAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <div className="relative paper-texture border border-[#2a2a2a] rounded-lg p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:border-[#c9a84c]/20 hover:shadow-[0_0_30px_rgba(201,168,76,0.04)]">
        {/* Gold corner accents */}
        <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-[#c9a84c]/15 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-[#c9a84c]/15 rounded-bl-sm pointer-events-none" />
        <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-[#c9a84c]/10 rounded-tl-sm pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-[#c9a84c]/10 rounded-br-sm pointer-events-none" />

        {/* Delete button (admin only) */}
        {isAdmin && (
          <AnimatePresence>
            {(hovered || deleting) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={handleDelete}
                disabled={deleting}
                className="absolute top-3 right-3 z-10 p-1.5 rounded border border-[#2a2a2a] bg-[#0a0a0a]/90 text-[#8a7e6b] hover:text-[#a00000] hover:border-[#a00000]/30 transition-all cursor-pointer disabled:opacity-50"
                aria-label="Eliminar susurro"
              >
                {deleting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        )}

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <Feather size={12} className="text-[#c9a84c]/40 flex-shrink-0" />
          <span className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs sm:text-sm tracking-wider uppercase">
            {whisper.author}
          </span>
        </div>

        {/* Message */}
        <p className="font-[family-name:var(--font-typewriter)] text-[#d4c5b0] text-sm sm:text-base leading-[1.8] tracking-[0.02em] mb-3 italic">
          &ldquo;{whisper.message}&rdquo;
        </p>

        {/* Date */}
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[10px] sm:text-xs tracking-wide">
          {formattedDate} — {formattedTime}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Admin Form ───
function WhisperForm({
  token,
  onSubmitted,
}: {
  token: string | null;
  onSubmitted: () => void;
}) {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || submitting) return;
    if (!author.trim() || !message.trim()) {
      toast.error('Autor y mensaje son requeridos');
      return;
    }
    if (author.length > 100) {
      toast.error('Autor: máximo 100 caracteres');
      return;
    }
    if (message.length > 500) {
      toast.error('Mensaje: máximo 500 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/whispers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ author: author.trim(), message: message.trim() }),
      });
      if (res.ok) {
        toast.success('Susurro publicado');
        setAuthor('');
        setMessage('');
        setExpanded(false);
        onSubmitted();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Error al publicar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-8"
    >
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg border border-[#8B0000]/30 bg-[#8B0000]/5 text-[#c9a84c] hover:bg-[#8B0000]/10 hover:border-[#8B0000]/50 transition-all font-[family-name:var(--font-cinzel)] text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
        >
          <MessageCircle size={14} />
          Escribir un susurro
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="paper-texture border border-[#2a2a2a] rounded-lg p-5 sm:p-6 overflow-hidden"
        >
          {/* Gold corner accents */}
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#c9a84c]/15 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#c9a84c]/15 rounded-bl-sm pointer-events-none" />

          <h4 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c]/70 text-xs tracking-widest uppercase mb-4">
            Nuevo susurro
          </h4>

          {/* Author field */}
          <div className="mb-4">
            <label
              htmlFor="whisper-author"
              className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
            >
              Autor
            </label>
            <input
              id="whisper-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={100}
              placeholder="Nombre del susurrador..."
              className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-cinzel)] tracking-wide
                placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all"
            />
            <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1 text-right">
              {author.length}/100
            </p>
          </div>

          {/* Message field */}
          <div className="mb-4">
            <label
              htmlFor="whisper-message"
              className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
            >
              Mensaje
            </label>
            <textarea
              id="whisper-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Deja tu eco en el laberinto..."
              className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-typewriter)] leading-relaxed
                placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all resize-none"
            />
            <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1 text-right">
              {message.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded border border-[#8B0000]/40 bg-[#8B0000]/10 text-[#c9a84c] hover:bg-[#8B0000]/20 hover:border-[#8B0000]/60 transition-all font-[family-name:var(--font-cinzel)] text-xs tracking-wider uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Feather size={12} />
              )}
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="px-3 py-2 rounded border border-[#2a2a2a] text-[#5a5040] hover:text-[#8a7e6b] hover:border-[#2a2a2a] transition-all font-[family-name:var(--font-cinzel)] text-xs tracking-wider uppercase cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}

// ─── Main Component ───
export default function WhisperWall({ isAdmin, token, onRefresh }: WhisperWallProps) {
  const [whispers, setWhispers] = useState<WhisperData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWhispers = useCallback(async () => {
    try {
      const res = await fetch('/api/whispers');
      if (res.ok) {
        const data = await res.json();
        setWhispers(data.whispers);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWhispers();
  }, [fetchWhispers]);

  const handleDelete = useCallback(
    (id: string) => {
      setWhispers((prev) => prev.filter((w) => w.id !== id));
      onRefresh?.();
    },
    [onRefresh]
  );

  const handleSubmitted = useCallback(() => {
    fetchWhispers();
    onRefresh?.();
  }, [fetchWhispers, onRefresh]);

  return (
    <section id="section-whispers" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
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
          Capítulo IV — Susurros
        </motion.p>
        <GothicDivider text="Susurros del Laberinto" />
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
          Ecos dejados por quienes cruzaron este camino
        </p>
      </motion.div>

      {/* Admin form */}
      {isAdmin && token && (
        <div className="mt-8">
          <WhisperForm token={token} onSubmitted={handleSubmitted} />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <motion.div
            className="w-6 h-6 border-2 border-[#2a2a2a] border-t-[#c9a84c]/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Whispers list */}
      {!loading && (
        <div className="mt-8">
          {whispers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="text-3xl mb-4 opacity-20">🍂</div>
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-sm">
                El laberinto aún guarda silencio...
              </p>
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/50 text-xs mt-1">
                Los primeros ecos están por llegar.
              </p>
            </motion.div>
          ) : (
            <div className="columns-1 sm:columns-2 gap-4 space-y-4">
              {whispers.map((whisper, index) => (
                <div key={whisper.id} className="break-inside-avoid">
                  {index > 0 && index % 3 === 0 && <WhisperDivider />}
                  <WhisperCard
                    whisper={whisper}
                    index={index}
                    isAdmin={isAdmin}
                    token={token}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom ornament */}
      {whispers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/15" />
            <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/20" />
          </div>
          <span className="font-[family-name:var(--font-typewriter)] text-[8px] tracking-[0.3em] uppercase text-[#5a5040]/40">
            fin
          </span>
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/15" />
            <div className="absolute w-0.5 h-0.5 rotate-45 bg-[#c9a84c]/20" />
          </div>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
        </motion.div>
      )}
    </section>
  );
}
