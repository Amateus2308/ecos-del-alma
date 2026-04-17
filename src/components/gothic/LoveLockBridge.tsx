'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, Lock, Heart } from 'lucide-react';
import { toast } from 'sonner';
import GothicDivider from '@/components/gothic/GothicDivider';

// ─── Types ───
interface LoveLockData {
  id: string;
  names: string;
  message: string;
  date: string | null;
  color: string;
  createdAt: string;
}

interface LoveLockBridgeProps {
  isAdmin: boolean;
  token: string | null;
}

type LockColor = 'gold' | 'silver' | 'copper' | 'blood';

// ─── Color Definitions ───
const LOCK_COLORS: Record<LockColor, { body: string; highlight: string; shadow: string; glow: string; label: string; swatch: string }> = {
  gold: {
    body: '#c9a84c',
    highlight: '#e8d48b',
    shadow: '#8a7234',
    glow: 'rgba(201,168,76,0.35)',
    label: 'Oro',
    swatch: '#c9a84c',
  },
  silver: {
    body: '#c0c0c0',
    highlight: '#e0e0e0',
    shadow: '#808080',
    glow: 'rgba(192,192,192,0.3)',
    label: 'Plata',
    swatch: '#c0c0c0',
  },
  copper: {
    body: '#b87333',
    highlight: '#d4956a',
    shadow: '#7a4d22',
    glow: 'rgba(184,115,51,0.3)',
    label: 'Cobre',
    swatch: '#b87333',
  },
  blood: {
    body: '#8B0000',
    highlight: '#b22222',
    shadow: '#5a0000',
    glow: 'rgba(139,0,0,0.35)',
    label: 'Sangre',
    swatch: '#8B0000',
  },
};

const LOCK_COLOR_KEYS: LockColor[] = ['gold', 'silver', 'copper', 'blood'];

// ─── Utility: deterministic random per ID ───
function seededRandom(seed: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  hash = ((hash << 5) - hash + index) | 0;
  return ((hash % 100) + 100) % 100 / 100;
}

// ─── Bridge Railing SVG ───
function BridgeRailing({ lockCount }: { lockCount: number }) {
  const width = Math.max(800, lockCount * 90);
  return (
    <svg
      viewBox={`0 0 ${width} 50`}
      className="w-full max-w-5xl mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main chain */}
      <path
        d={`M 20 25 L ${width - 20} 25`}
        stroke="#c9a84c"
        strokeWidth="2.5"
        opacity="0.4"
      />
      {/* Chain links */}
      {Array.from({ length: Math.floor(width / 40) }, (_, i) => {
        const x = 30 + i * 40;
        return (
          <g key={i}>
            {/* Vertical link */}
            <ellipse
              cx={x}
              cy={25}
              rx="5"
              ry="10"
              stroke="#c9a84c"
              strokeWidth="1.5"
              opacity={0.25 + (i % 3) * 0.05}
              fill="none"
            />
            {/* Horizontal link */}
            {i < Math.floor(width / 40) - 1 && (
              <ellipse
                cx={x + 20}
                cy={25}
                rx="10"
                ry="5"
                stroke="#c9a84c"
                strokeWidth="1.5"
                opacity={0.2 + ((i + 1) % 3) * 0.05}
                fill="none"
              />
            )}
          </g>
        );
      })}
      {/* End finials */}
      <circle cx="14" cy="25" r="6" stroke="#c9a84c" strokeWidth="1.5" opacity="0.4" fill="none" />
      <circle cx="14" cy="25" r="2.5" fill="#c9a84c" opacity="0.2" />
      <circle cx={width - 14} cy="25" r="6" stroke="#c9a84c" strokeWidth="1.5" opacity="0.4" fill="none" />
      <circle cx={width - 14} cy="25" r="2.5" fill="#c9a84c" opacity="0.2" />
      {/* Top rail bar */}
      <rect x="8" y="12" width={width - 16} height="3" rx="1.5" fill="#c9a84c" opacity="0.12" />
      {/* Gothic post accents */}
      <rect x="6" y="8" width="4" height="34" rx="2" fill="#c9a84c" opacity="0.15" />
      <rect x={width - 10} y="8" width="4" height="34" rx="2" fill="#c9a84c" opacity="0.15" />
      {/* Post tops - pointed gothic */}
      <path d="M 8 8 L 6 3 L 4 8" stroke="#c9a84c" strokeWidth="1" opacity="0.2" fill="#c9a84c" fillOpacity="0.08" />
      <path d={`M ${width - 4} 8 L ${width - 6} 3 L ${width - 8} 8`} stroke="#c9a84c" strokeWidth="1" opacity="0.2" fill="#c9a84c" fillOpacity="0.08" />
    </svg>
  );
}

// ─── Padlock SVG ───
function PadlockSVG({ color, names }: { color: LockColor; names: string }) {
  const c = LOCK_COLORS[color];
  const displayNames = names.length > 12 ? names.slice(0, 11) + '…' : names;

  return (
    <svg viewBox="0 0 64 80" className="w-14 h-[70px] sm:w-16 sm:h-[80px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`lock-body-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="50%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.shadow} />
        </linearGradient>
        <filter id={`lock-glow-${color}`}>
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shackle */}
      <path
        d="M 18 32 L 18 18 C 18 8 46 8 46 18 L 46 32"
        stroke={c.body}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M 18 32 L 18 18 C 18 10 46 10 46 18 L 46 32"
        stroke={c.highlight}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />

      {/* Lock body */}
      <rect x="8" y="30" width="48" height="38" rx="4" fill={`url(#lock-body-${color})`} />
      <rect x="8" y="30" width="48" height="38" rx="4" stroke={c.shadow} strokeWidth="1" fill="none" opacity="0.4" />

      {/* Highlight stripe */}
      <rect x="12" y="33" width="3" height="32" rx="1.5" fill={c.highlight} opacity="0.25" />

      {/* Keyhole */}
      <circle cx="32" cy="46" r="5" fill={c.shadow} opacity="0.6" />
      <rect x="30" y="48" width="4" height="8" rx="2" fill={c.shadow} opacity="0.6" />
      <circle cx="32" cy="45" r="2" fill={c.highlight} opacity="0.3" />

      {/* Names text */}
      <text
        x="32"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-cinzel)"
        fontSize="5.5"
        fill={c.shadow}
        fontWeight="600"
      >
        {displayNames}
      </text>
    </svg>
  );
}

// ─── Single Lock Card ───
function LockCard({
  lock,
  index,
  isAdmin,
  token,
  onDelete,
}: {
  lock: LoveLockData;
  index: number;
  isAdmin: boolean;
  token: string | null;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const color = (lock.color as LockColor) || 'gold';
  const c = LOCK_COLORS[color];

  // Deterministic random values per lock
  const rotation = useMemo(() => -8 + seededRandom(lock.id, 0) * 16, [lock.id]);
  const swingDuration = useMemo(() => 3 + seededRandom(lock.id, 1) * 3, [lock.id]);
  const swingDelay = useMemo(() => seededRandom(lock.id, 2) * 2, [lock.id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/love-locks?id=${lock.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Candado eliminado');
        onDelete(lock.id);
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
      initial={{ opacity: 0, y: -30, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.6),
        ease: 'easeOut',
      }}
      className="relative group flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Chain connector */}
      <motion.div
        className="w-px h-4"
        style={{ backgroundColor: `${c.body}40` }}
      />

      {/* Swing wrapper */}
      <motion.div
        animate={
          hovered
            ? { rotate: 0 }
            : { rotate: [rotation - 2, rotation + 2, rotation - 1, rotation + 1, rotation] }
        }
        transition={
          hovered
            ? { duration: 0.3, ease: 'easeOut' }
            : { duration: swingDuration, repeat: Infinity, ease: 'easeInOut', delay: swingDelay }
        }
        className="relative"
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg pointer-events-none"
          animate={{
            opacity: hovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: c.glow,
            transform: 'scale(1.5)',
          }}
        />

        {/* The lock itself */}
        <motion.div
          animate={{
            filter: hovered ? `drop-shadow(0 0 8px ${c.glow})` : 'none',
          }}
          transition={{ duration: 0.3 }}
          className="relative cursor-pointer"
        >
          <PadlockSVG color={color} names={lock.names} />

          {/* Delete button (admin only, on hover) */}
          {isAdmin && (
            <AnimatePresence>
              {(hovered || deleting) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="absolute -top-2 -right-2 z-10 p-1 rounded-full border border-[#2a2a2a] bg-[#0a0a0a]/95 text-[#8a7e6b] hover:text-[#a00000] hover:border-[#a00000]/40 transition-all cursor-pointer disabled:opacity-50"
                  aria-label="Eliminar candado"
                >
                  {deleting ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Trash2 size={10} />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Names label */}
        <p
          className="font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs text-center tracking-wider mt-1 max-w-[80px] truncate"
          style={{ color: c.body }}
        >
          {lock.names}
        </p>

        {/* Message */}
        <p className="font-[family-name:var(--font-typewriter)] text-[#8a7e6b] text-[8px] sm:text-[9px] text-center italic mt-0.5 max-w-[90px] line-clamp-2 leading-tight">
          &ldquo;{lock.message}&rdquo;
        </p>

        {/* Date */}
        {lock.date && (
          <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/60 text-[7px] sm:text-[8px] text-center mt-0.5">
            {lock.date}
          </p>
        )}
      </motion.div>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-20 px-3 py-2 rounded border max-w-[180px] pointer-events-none"
            style={{
              backgroundColor: '#0d0a0a',
              borderColor: `${c.body}40`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 15px ${c.glow}`,
            }}
          >
            {/* Tooltip arrow */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l"
              style={{ backgroundColor: '#0d0a0a', borderColor: `${c.body}40` }}
            />
            <p className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-wider mb-1" style={{ color: c.body }}>
              {lock.names}
            </p>
            <p className="font-[family-name:var(--font-typewriter)] text-[#d4c5b0] text-[10px] italic leading-relaxed">
              &ldquo;{lock.message}&rdquo;
            </p>
            {lock.date && (
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[8px] mt-1 text-right">
                {lock.date}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Admin Form ───
function LoveLockForm({
  token,
  onSubmitted,
}: {
  token: string | null;
  onSubmitted: () => void;
}) {
  const [names, setNames] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [color, setColor] = useState<LockColor>('gold');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || submitting) return;
    if (!names.trim() || !message.trim()) {
      toast.error('Nombres y mensaje son requeridos');
      return;
    }
    if (names.trim().length > 100) {
      toast.error('Nombres: máximo 100 caracteres');
      return;
    }
    if (message.trim().length > 100) {
      toast.error('Mensaje: máximo 100 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/love-locks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          names: names.trim(),
          message: message.trim(),
          date: date.trim() || null,
          color,
        }),
      });
      if (res.ok) {
        toast.success('Candado colgado en el puente');
        setNames('');
        setMessage('');
        setDate('');
        setColor('gold');
        setExpanded(false);
        onSubmitted();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Error al crear candado');
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
          Nuevo Candado
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
            Nuevo candado de amor
          </h4>

          {/* Names field */}
          <div className="mb-4">
            <label
              htmlFor="lock-names"
              className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
            >
              Nombres
            </label>
            <input
              id="lock-names"
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              maxLength={100}
              placeholder="Ana & Carlos"
              className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-cinzel)] tracking-wide
                placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all"
            />
            <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1 text-right">
              {names.length}/100
            </p>
          </div>

          {/* Message field */}
          <div className="mb-4">
            <label
              htmlFor="lock-message"
              className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
            >
              Mensaje grabado
            </label>
            <input
              id="lock-message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
              placeholder="Para siempre unidos..."
              className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-typewriter)] leading-relaxed
                placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all"
            />
            <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040]/40 text-[9px] mt-1 text-right">
              {message.length}/100
            </p>
          </div>

          {/* Date field */}
          <div className="mb-4">
            <label
              htmlFor="lock-date"
              className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-1.5"
            >
              Fecha (opcional)
            </label>
            <input
              id="lock-date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="14 de febrero, 2025"
              className="w-full bg-[#111]/60 border border-[#2a2a2a] rounded px-3 py-2 text-[#d4c5b0] text-sm font-[family-name:var(--font-fell)] italic
                placeholder:text-[#5a5040]/40 focus:outline-none focus:border-[#c9a84c]/30 focus:shadow-[0_0_12px_rgba(201,168,76,0.06)] transition-all"
            />
          </div>

          {/* Color selector */}
          <div className="mb-5">
            <label className="block font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-[10px] uppercase tracking-widest mb-2">
              Color del candado
            </label>
            <div className="flex items-center gap-3">
              {LOCK_COLOR_KEYS.map((key) => {
                const isSelected = color === key;
                const cMap = LOCK_COLORS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColor(key)}
                    className="relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer"
                    style={{
                      backgroundColor: cMap.swatch,
                      borderColor: isSelected ? cMap.swatch : 'rgba(42,42,42,0.8)',
                      boxShadow: isSelected ? `0 0 12px ${cMap.glow}` : 'none',
                      opacity: isSelected ? 1 : 0.5,
                    }}
                    aria-label={`Color ${cMap.label}`}
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
              <span className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[10px] ml-1">
                {LOCK_COLORS[color].label}
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
                <Lock size={12} />
              )}
              {submitting ? 'Colgando...' : 'Colgar candado'}
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

// ─── Empty State ───
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      {/* Gothic bridge empty illustration */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block mb-6"
      >
        <svg viewBox="0 0 200 120" className="w-48 h-28 opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bridge arches */}
          <path d="M 20 100 Q 60 20 100 100" stroke="#c9a84c" strokeWidth="2" opacity="0.6" />
          <path d="M 100 100 Q 140 20 180 100" stroke="#c9a84c" strokeWidth="2" opacity="0.6" />
          {/* Railing */}
          <path d="M 10 40 L 190 40" stroke="#c9a84c" strokeWidth="1.5" opacity="0.4" />
          <path d="M 10 35 L 190 35" stroke="#c9a84c" strokeWidth="1" opacity="0.3" />
          {/* Railing posts */}
          {[30, 60, 90, 110, 140, 170].map((x) => (
            <line key={x} x1={x} y1="35" x2={x} y2="55" stroke="#c9a84c" strokeWidth="1.5" opacity="0.3" />
          ))}
          {/* Water */}
          <path d="M 0 105 Q 25 95 50 105 Q 75 115 100 105 Q 125 95 150 105 Q 175 115 200 105" stroke="#c9a84c" strokeWidth="1" opacity="0.15" />
          <path d="M 0 112 Q 25 102 50 112 Q 75 122 100 112 Q 125 102 150 112 Q 175 122 200 112" stroke="#c9a84c" strokeWidth="0.8" opacity="0.1" />
        </svg>
      </motion.div>
      <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-sm">
        Aún no hay candados en el puente...
      </p>
      <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/50 text-xs mt-1">
        Los primeros amores están por sellar su destino.
      </p>
    </motion.div>
  );
}

// ─── Main Component ───
export default function LoveLockBridge({ isAdmin, token }: LoveLockBridgeProps) {
  const [locks, setLocks] = useState<LoveLockData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocks = useCallback(async () => {
    try {
      const res = await fetch('/api/love-locks');
      if (res.ok) {
        const data = await res.json();
        setLocks(data.locks);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocks();
  }, [fetchLocks]);

  const handleDelete = useCallback((id: string) => {
    setLocks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleSubmitted = useCallback(() => {
    fetchLocks();
  }, [fetchLocks]);

  return (
    <section id="section-love-locks" className="max-w-5xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
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
          Capítulo X — Candados de Amor
        </motion.p>
        <GothicDivider text="Puente de los Destinos" />
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
          Donde los amores sellan su unión para la eternidad
        </p>
      </motion.div>

      {/* Admin form */}
      {isAdmin && token && (
        <div className="mt-8">
          <LoveLockForm token={token} onSubmitted={handleSubmitted} />
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

      {/* Locks display */}
      {!loading && (
        <div className="mt-8">
          {locks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="w-full">
              {/* Bridge railing SVG */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-2"
              >
                <BridgeRailing lockCount={locks.length} />
              </motion.div>

              {/* Locks grid */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 py-6 px-2"
              >
                {locks.map((lock, index) => (
                  <LockCard
                    key={lock.id}
                    lock={lock}
                    index={index}
                    isAdmin={isAdmin}
                    token={token}
                    onDelete={handleDelete}
                  />
                ))}
              </motion.div>

              {/* Bottom chain */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-2"
              >
                <BridgeRailing lockCount={locks.length} />
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* Bottom ornament */}
      {locks.length > 0 && (
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
          <Heart size={10} className="text-[#8B0000]/40" />
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
