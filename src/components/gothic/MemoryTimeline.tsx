'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, Heart, Star, Moon, Sun, Music, Feather, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string | null;
  icon: string;
  createdAt: string;
}

interface MemoryTimelineProps {
  isAdmin?: boolean;
  token?: string | null;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  heart: <Heart size={14} />,
  star: <Star size={14} />,
  moon: <Moon size={14} />,
  sun: <Sun size={14} />,
  music: <Music size={14} />,
  feather: <Feather size={14} />,
  sparkles: <Sparkles size={14} />,
};

const ICON_OPTIONS = [
  { value: 'heart', label: 'Corazón' },
  { value: 'star', label: 'Estrella' },
  { value: 'moon', label: 'Luna' },
  { value: 'sun', label: 'Sol' },
  { value: 'music', label: 'Música' },
  { value: 'feather', label: 'Pluma' },
  { value: 'sparkles', label: 'Destellos' },
];

function TimelineIcon({ icon, size = 'sm' }: { icon: string; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  const nodeSize = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  const iconEl = ICON_MAP[icon] || ICON_MAP.heart;

  return (
    <div className={`${nodeSize} rounded-full border border-[#c9a84c]/30 bg-[#111] flex items-center justify-center text-[#c9a84c]`}>
      <div className={sizeClass}>{iconEl}</div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function MemoryTimeline({ isAdmin, token }: MemoryTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('heart');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/timeline');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newTitle.trim() || !newDate) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, date: newDate, description: newDesc || null, icon: newIcon }),
      });
      if (res.ok) {
        toast.success('Momento añadido al laberinto');
        setNewTitle('');
        setNewDate('');
        setNewDesc('');
        setNewIcon('heart');
        setShowAddForm(false);
        fetchEvents();
      } else {
        toast.error('Error al crear evento');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/timeline?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Momento olvidado');
        fetchEvents();
      }
    } catch {
      toast.error('Error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="relative">
      {/* Timeline container */}
      <div className="relative px-4 sm:px-8">
        {/* Central vertical line */}
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/20 to-transparent" />

        {/* Events */}
        {loading ? (
          <div className="space-y-8 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="gothic-skeleton w-7 h-7 rounded-full flex-shrink-0" />
                <div className="gothic-skeleton flex-1 h-20 rounded-lg" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block"
            >
              <Feather size={32} className="text-[#8a7e6b]/30 mx-auto mb-3" />
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-sm">
                Aún no hay momentos registrados...
              </p>
              <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/60 text-xs mt-1">
                Cada momento compartido deja su huella en el laberinto
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12 py-4">
            {events.map((event, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.5) }}
                  className={`relative flex items-start gap-4 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Timeline node (center on desktop, left on mobile) */}
                  <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 z-10 timeline-node">
                    <div className="timeline-node-pulse">
                      <TimelineIcon icon={event.icon} size="sm" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`ml-14 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                    isLeft ? 'sm:mr-auto sm:pr-0' : 'sm:ml-auto sm:pl-0'
                  }`}>
                    <div className="relative paper-texture border border-[#2a2a2a] rounded-lg p-4 sm:p-5 card-hover-lift group">
                      {/* Gold corner accents */}
                      <div className={`absolute top-2 ${isLeft ? 'right-2' : 'left-2'} w-4 h-4 border-t border-r border-[#c9a84c]/15 rounded-tr-sm pointer-events-none`} />
                      <div className={`absolute bottom-2 ${isLeft ? 'left-2' : 'right-2'} w-4 h-4 border-b border-l border-[#c9a84c]/15 rounded-bl-sm pointer-events-none`} />

                      {/* Connector line to node */}
                      <div className={`hidden sm:block absolute top-1/2 -translate-y-1/2 w-6 h-px bg-[#c9a84c]/20 ${
                        isLeft ? 'right-[-1.5rem]' : 'left-[-1.5rem]'
                      }`} />

                      {/* Date */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Calendar size={10} className="text-[#c9a84c]/50" />
                        <span className="font-[family-name:var(--font-typewriter)] text-[10px] sm:text-xs text-[#8a7e6b] tracking-wide">
                          {formatDate(event.date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-sm sm:text-base tracking-wider mb-1.5">
                        {event.title}
                      </h4>

                      {/* Description */}
                      {event.description && (
                        <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Delete button (admin only) */}
                      {isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                          disabled={deleting === event.id}
                          className="absolute top-2 right-2 p-1.5 rounded bg-[#0a0a0a]/80 border border-transparent
                            text-[#8a7e6b]/0 group-hover:text-[#8a7e6b]/60 group-hover:border-[#2a2a2a]
                            hover:!text-[#a00000] hover:!border-[#a00000]/30 transition-all cursor-pointer"
                          aria-label="Eliminar evento"
                        >
                          {deleting === event.id ? (
                            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25" />
                              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <Trash2 size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Add Button / Form */}
      {isAdmin && (
        <div className="mt-8 flex justify-center">
          {!showAddForm ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded border border-[#2a2a2a] bg-[#111]/80
                text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all text-sm
                font-[family-name:var(--font-cinzel)] tracking-wider uppercase cursor-pointer"
            >
              <Plus size={14} />
              Añadir Momento
            </motion.button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="w-full max-w-md paper-texture border border-[#2a2a2a] rounded-lg p-5 sm:p-6 relative overflow-hidden"
              >
                {/* Gold corner accents */}
                <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#c9a84c]/20 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#c9a84c]/20 rounded-bl-sm pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-3 right-3 text-[#8a7e6b]/60 hover:text-[#a00000] transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>

                <h4 className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-base tracking-wider mb-4">
                  Nuevo Momento
                </h4>

                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-[#8a7e6b] mb-1.5">
                      Título
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Un momento inolvidable..."
                      required
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#d4c5b0]
                        font-[family-name:var(--font-fell)] text-sm placeholder:text-[#8a7e6b]/30
                        focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-[#8a7e6b] mb-1.5">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#d4c5b0]
                        font-[family-name:var(--font-fell)] text-sm
                        focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all
                        [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-[#8a7e6b] mb-1.5">
                      Descripción
                    </label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Un recuerdo que atesoro..."
                      rows={2}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm text-[#d4c5b0]
                        font-[family-name:var(--font-fell)] text-sm placeholder:text-[#8a7e6b]/30 resize-none
                        focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest text-[#8a7e6b] mb-2">
                      Ícono
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ICON_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setNewIcon(opt.value)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-all cursor-pointer text-xs
                            font-[family-name:var(--font-cinzel)] tracking-wider
                            ${newIcon === opt.value
                              ? 'border-[#c9a84c]/50 text-[#c9a84c] bg-[#c9a84c]/5'
                              : 'border-[#2a2a2a] text-[#8a7e6b] hover:border-[#8a7e6b]/30'
                            }`}
                        >
                          <span className="text-[#c9a84c]">{ICON_MAP[opt.value] && <span className="inline-block w-3 h-3">{ICON_MAP[opt.value]}</span>}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-3 py-2 rounded border border-[#2a2a2a] text-[#8a7e6b] text-xs
                        font-[family-name:var(--font-cinzel)] tracking-wider uppercase hover:border-[#8a7e6b]/30 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-3 py-2 rounded bg-[#8B0000] border border-[#8B0000] text-[#c9a84c] text-xs
                        font-[family-name:var(--font-cinzel)] tracking-wider uppercase
                        hover:bg-[#a00000] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Guardando...' : 'Crear Momento'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
