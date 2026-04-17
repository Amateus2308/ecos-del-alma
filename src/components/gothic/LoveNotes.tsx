'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Waves, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import GothicDivider from '@/components/gothic/GothicDivider';

// ─── Types ───
interface LoveNoteData {
  id: string;
  title: string;
  message: string;
  color: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoveNotesProps {
  isAdmin: boolean;
  token: string | null;
}

type NoteColor = 'gold' | 'rose' | 'blood' | 'moon';

const COLOR_MAP: Record<NoteColor, { glow: string; text: string; border: string; bg: string; swatch: string; shimmer: string }> = {
  gold: {
    glow: '#c9a84c',
    text: '#c9a84c',
    border: 'rgba(201,168,76,0.3)',
    bg: 'rgba(201,168,76,0.03)',
    swatch: '#c9a84c',
    shimmer: 'rgba(201,168,76,0.15)',
  },
  rose: {
    glow: '#c9506e',
    text: '#c9506e',
    border: 'rgba(201,80,110,0.3)',
    bg: 'rgba(201,80,110,0.03)',
    swatch: '#c9506e',
    shimmer: 'rgba(201,80,110,0.15)',
  },
  blood: {
    glow: '#8B0000',
    text: '#c95050',
    border: 'rgba(139,0,0,0.3)',
    bg: 'rgba(139,0,0,0.03)',
    swatch: '#8B0000',
    shimmer: 'rgba(139,0,0,0.15)',
  },
  moon: {
    glow: '#7b7fa8',
    text: '#7b7fa8',
    border: 'rgba(123,127,168,0.3)',
    bg: 'rgba(123,127,168,0.03)',
    swatch: '#7b7fa8',
    shimmer: 'rgba(123,127,168,0.15)',
  },
};

const NOTE_COLORS: NoteColor[] = ['gold', 'rose', 'blood', 'moon'];

// ─── Bottle SVG Component ───
function GlassBottle({ color, isOpened }: { color: NoteColor; isOpened: boolean }) {
  const colors = COLOR_MAP[color];
  const glowColor = colors.glow;

  return (
    <svg
      viewBox="0 0 80 120"
      className="w-16 h-24 sm:w-20 sm:h-30 mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cork */}
      <AnimatePresence>
        {!isOpened && (
          <motion.g
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0, rotate: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <rect x="34" y="6" width="12" height="10" rx="2" fill="#8B6914" stroke="#6B4F0A" strokeWidth="0.5" />
            <line x1="36" y1="8" x2="44" y2="8" stroke="#6B4F0A" strokeWidth="0.3" opacity="0.5" />
            <line x1="36" y1="11" x2="44" y2="11" stroke="#6B4F0A" strokeWidth="0.3" opacity="0.5" />
            <line x1="36" y1="14" x2="44" y2="14" stroke="#6B4F0A" strokeWidth="0.3" opacity="0.5" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Bottle neck */}
      <path
        d="M34 16 L34 40 Q34 44 30 48 L22 56 Q18 60 18 66 L18 98 Q18 108 28 110 L52 110 Q62 108 62 98 L62 66 Q62 60 58 56 L50 48 Q46 44 46 40 L46 16"
        stroke={glowColor}
        strokeWidth="1.5"
        fill="rgba(255,255,255,0.03)"
        opacity={isOpened ? 0.4 : 0.8}
      />

      {/* Glass reflection */}
      <path
        d="M24 60 Q22 75 24 95"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner glow (unread) */}
      {!isOpened && (
        <motion.ellipse
          cx="40"
          cy="80"
          rx="16"
          ry="20"
          fill={glowColor}
          opacity={0.08}
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Shimmer on glass (unread) */}
      {!isOpened && (
        <motion.rect
          x="20"
          y="55"
          width="8"
          height="50"
          rx="4"
          fill="rgba(255,255,255,0.06)"
          animate={{ opacity: [0.04, 0.12, 0.04], x: [20, 28, 20] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Scroll inside (visible when opened) */}
      {isOpened && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2 }}
        >
          <rect x="28" y="60" width="24" height="30" rx="2" fill={glowColor} opacity="0.08" />
          <line x1="32" y1="68" x2="48" y2="68" stroke={glowColor} strokeWidth="0.5" opacity="0.2" />
          <line x1="32" y1="72" x2="46" y2="72" stroke={glowColor} strokeWidth="0.5" opacity="0.2" />
          <line x1="32" y1="76" x2="44" y2="76" stroke={glowColor} strokeWidth="0.5" opacity="0.2" />
          <line x1="32" y1="80" x2="40" y2="80" stroke={glowColor} strokeWidth="0.5" opacity="0.2" />
        </motion.g>
      )}
    </svg>
  );
}

// ─── Bottle Card (sealed state) ───
function BottleCard({
  note,
  index,
  isOpened,
  onUncork,
  isAdmin,
  token,
  onDelete,
}: {
  note: LoveNoteData;
  index: number;
  isOpened: boolean;
  onUncork: () => void;
  isAdmin: boolean;
  token: string | null;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const color = (note.color as NoteColor) || 'gold';
  const colors = COLOR_MAP[color];

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/love-notes?id=${note.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Nota eliminada');
        onDelete(note.id);
      } else {
        toast.error('Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5), ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="break-inside-avoid group relative"
    >
      <motion.div
        onClick={onUncork}
        className="relative cursor-pointer rounded-lg p-5 sm:p-6 border border-[#1a1a1a] overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: 'rgba(10,10,10,0.6)',
        }}
        animate={{
          boxShadow: hovered && !isOpened
            ? `0 0 40px ${colors.shimmer}, inset 0 0 20px rgba(0,0,0,0.5)`
            : !isOpened
              ? `0 0 20px ${colors.shimmer.replace('0.15', '0.05')}, inset 0 0 10px rgba(0,0,0,0.3)`
              : '0 0 0px transparent',
          borderColor: hovered ? colors.border : 'rgba(26,26,26,0.6)',
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Floating animation wrapper for bottle */}
        <motion.div
          animate={!isOpened ? { y: [0, -4, 0] } : { y: 0 }}
          transition={{ duration: 3 + (index % 3) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-3"
        >
          <GlassBottle color={color} isOpened={isOpened} />
        </motion.div>

        {/* Status indicator */}
        {!isOpened && (
          <motion.div
            className="text-center mb-2"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span
              className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.2em]"
              style={{ color: colors.text, opacity: 0.7 }}
            >
              Sellada
            </span>
          </motion.div>
        )}

        {isOpened && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.5, y: 0 }}
            className="text-center mb-2"
          >
            <span className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.2em] text-[#5a5040]">
              Abierta
            </span>
          </motion.div>
        )}

        {/* Delete button (admin only, on hover) */}
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
                aria-label="Eliminar nota"
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

        {/* Instruction text for unread */}
        {!isOpened && hovered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[10px] text-center tracking-wide"
          >
            toca para descorchar
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Revealed Note Card ───
function RevealedNote({
  note,
  onRecork,
}: {
  note: LoveNoteData;
  onRecork: () => void;
}) {
  const color = (note.color as NoteColor) || 'gold';
  const colors = COLOR_MAP[color];

  const formattedDate = new Date(note.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(note.createdAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateX: -5 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.95, rotateX: 5 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="break-inside-avoid"
    >
      <div
        className="relative paper-texture rounded-lg p-5 sm:p-6 overflow-hidden"
        style={{
          border: `1px solid ${colors.border}`,
          boxShadow: `0 0 30px ${colors.shimmer.replace('0.15', '0.04')}`,
        }}
      >
        {/* Gold corner accents */}
        <div
          className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r rounded-tr-sm pointer-events-none"
          style={{ borderColor: colors.border }}
        />
        <div
          className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l rounded-bl-sm pointer-events-none"
          style={{ borderColor: colors.border }}
        />
        <div
          className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l rounded-tl-sm pointer-events-none"
          style={{ borderColor: colors.border.replace('0.3', '0.15') }}
        />
        <div
          className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r rounded-br-sm pointer-events-none"
          style={{ borderColor: colors.border.replace('0.3', '0.15') }}
        />

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base tracking-wider mb-3 text-center"
          style={{
            color: colors.text,
            textShadow: `0 0 20px ${colors.shimmer}`,
          }}
        >
          {note.title}
        </motion.h3>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <div className="w-8 h-px" style={{ backgroundColor: `${colors.glow}30` }} />
          <span className="font-[family-name:var(--font-typewriter)] text-[9px]" style={{ color: `${colors.glow}50` }}>
            ◆✦◆
          </span>
          <div className="w-8 h-px" style={{ backgroundColor: `${colors.glow}30` }} />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-[family-name:var(--font-typewriter)] text-[#d4c5b0] text-sm sm:text-base leading-[1.9] tracking-[0.02em] mb-4"
        >
          {note.message}
        </motion.p>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[10px] sm:text-xs tracking-wide text-center mb-4"
        >
          {formattedDate} — {formattedTime}
        </motion.p>

        {/* Re-cork button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={onRecork}
            className="font-[family-name:var(--font-cinzel)] text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded border transition-all cursor-pointer hover:bg-white/5"
            style={{
              color: colors.text,
              borderColor: colors.border,
            }}
          >
            Volver a sellar
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Admin Form ───
function LoveNoteForm({
  token,
  onSubmitted,
}: {
  token: string | null;
  onSubmitted: () => void;
}) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState<NoteColor>('gold');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || submitting) return;
    if (!title.trim() || !message.trim()) {
      toast.error('Título y mensaje son requeridos');
      return;
    }
    if (title.trim().length > 100) {
      toast.error('Título: máximo 100 caracteres');
      return;
    }
    if (message.trim().length > 1000) {
      toast.error('Mensaje: máximo 1000 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/love-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), message: message.trim(), color }),
      });
      if (res.ok) {
        toast.success('Nota lanzada al mar');
        setTitle('');
        setMessage('');
        setColor('gold');
        setExpanded(false);
        onSubmitted();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Error al crear nota');
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
          <Plus size={14} />
          Nueva Nota
        </button>
      ) : (
        <AnimatePresence>
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
              Nueva nota de amor
            </h4>

            {/* Title field */}
            <div className="mb-4">
              <label
                htmlFor="love-note-title"
                className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
              >
                Título
              </label>
              <input
                id="love-note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="Nombre de esta botella..."
                className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-cinzel)] tracking-wide
                  placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all"
              />
              <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1 text-right">
                {title.length}/100
              </p>
            </div>

            {/* Message field */}
            <div className="mb-4">
              <label
                htmlFor="love-note-message"
                className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
              >
                Mensaje
              </label>
              <textarea
                id="love-note-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Escribe tu mensaje al oleaje del tiempo..."
                className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-typewriter)] leading-relaxed
                  placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all resize-none"
              />
              <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1 text-right">
                {message.length}/1000
              </p>
            </div>

            {/* Color selector */}
            <div className="mb-5">
              <label className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-2">
                Color del pergamino
              </label>
              <div className="flex items-center gap-3">
                {NOTE_COLORS.map((c) => {
                  const isSelected = color === c;
                  const cMap = COLOR_MAP[c];
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer"
                      style={{
                        backgroundColor: cMap.swatch,
                        borderColor: isSelected ? cMap.swatch : 'rgba(42,42,42,0.8)',
                        boxShadow: isSelected ? `0 0 12px ${cMap.shimmer}` : 'none',
                        opacity: isSelected ? 1 : 0.5,
                      }}
                      aria-label={`Color ${c}`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-white/80" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
                <span className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[10px] ml-1 capitalize">
                  {color}
                </span>
              </div>
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
                  <Plus size={12} />
                )}
                {submitting ? 'Lanzando...' : 'Lanzar al mar'}
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
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// ─── Empty State ───
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block mb-4 opacity-20"
      >
        <Waves size={48} strokeWidth={1} />
      </motion.div>
      <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-sm">
        El mar está en calma...
      </p>
      <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/50 text-xs mt-1">
        Aún no hay notas en las olas.
      </p>
    </motion.div>
  );
}

// ─── Main Component ───
export default function LoveNotes({ isAdmin, token }: LoveNotesProps) {
  const [notes, setNotes] = useState<LoveNoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openedId, setOpenedId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/love-notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleUncork = useCallback(
    async (note: LoveNoteData) => {
      setOpenedId(note.id);

      // Mark as read via API if not already read
      if (!note.isRead && token) {
        try {
          await fetch('/api/love-notes', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: note.id }),
          });
        } catch {
          // Mark locally as fallback
          setNotes((prev) =>
            prev.map((n) => (n.id === note.id ? { ...n, isRead: true } : n))
          );
        }
      }
    },
    [token]
  );

  const handleRecork = useCallback(() => {
    setOpenedId(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (openedId === id) setOpenedId(null);
  }, [openedId]);

  const handleSubmitted = useCallback(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <section id="section-love-notes" className="max-w-4xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
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
          Capítulo IX — Notas de Amor
        </motion.p>
        <GothicDivider text="Botellas al Mar" />
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
          Mensajes lanzados al oleaje del tiempo
        </p>
      </motion.div>

      {/* Admin form */}
      {isAdmin && token && (
        <div className="mt-8">
          <LoveNoteForm token={token} onSubmitted={handleSubmitted} />
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

      {/* Notes grid */}
      {!loading && (
        <div className="mt-8">
          {notes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {notes.map((note, index) => (
                <div key={note.id} className="break-inside-avoid">
                  <AnimatePresence mode="wait">
                    {openedId === note.id ? (
                      <RevealedNote
                        key={`revealed-${note.id}`}
                        note={note}
                        onRecork={handleRecork}
                      />
                    ) : (
                      <BottleCard
                        key={`bottle-${note.id}`}
                        note={note}
                        index={index}
                        isOpened={note.isRead}
                        onUncork={() => handleUncork(note)}
                        isAdmin={isAdmin}
                        token={token}
                        onDelete={handleDelete}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom ornament */}
      {notes.length > 0 && (
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
