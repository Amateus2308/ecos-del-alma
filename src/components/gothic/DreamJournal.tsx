'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, X, Edit3, Trash2, Moon, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import GothicDivider from './GothicDivider';

// ─── Types ───
interface DreamEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DreamJournalProps {
  isAdmin: boolean;
  token: string | null;
}

// ─── Mood Config ───
const MOOD_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  'místico': { color: '#7b3fa0', bg: 'rgba(123,63,160,0.15)', label: 'Místico' },
  'romántico': { color: '#8B0000', bg: 'rgba(139,0,0,0.15)', label: 'Romántico' },
  'melancólico': { color: '#4a5568', bg: 'rgba(74,85,104,0.15)', label: 'Melancólico' },
  'esperanzador': { color: '#c9a84c', bg: 'rgba(201,168,76,0.15)', label: 'Esperanzador' },
  'inquietante': { color: '#8B4513', bg: 'rgba(139,69,19,0.15)', label: 'Inquietante' },
};

const MOOD_OPTIONS = Object.keys(MOOD_CONFIG);

const FORM_DEFAULTS = { title: '', content: '', mood: 'místico' };

export default function DreamJournal({ isAdmin, token }: DreamJournalProps) {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState(FORM_DEFAULTS);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch Entries ───
  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/dream-journal');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // ─── Form Handlers ───
  const resetForm = () => {
    setForm(FORM_DEFAULTS);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Título y contenido son requeridos');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = !!editingId;
      const url = '/api/dream-journal';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? JSON.stringify({ id: editingId, title: form.title.trim(), content: form.content.trim(), mood: form.mood })
        : JSON.stringify({ title: form.title.trim(), content: form.content.trim(), mood: form.mood });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Error');
        return;
      }

      toast.success(isEdit ? 'Sueño actualizado' : 'Nuevo sueño registrado');
      resetForm();
      fetchEntries();
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: DreamEntry) => {
    setForm({ title: entry.title, content: entry.content, mood: entry.mood });
    setEditingId(entry.id);
    setShowForm(true);
    setExpandedId(null);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dream-journal?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Sueño eliminado');
        setDeleteConfirmId(null);
        if (expandedId === id) setExpandedId(null);
        fetchEntries();
      } else {
        toast.error('Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFavorite = async (entry: DreamEntry) => {
    if (!token) return;
    try {
      const res = await fetch('/api/dream-journal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: entry.id, isFavorite: !entry.isFavorite }),
      });
      if (res.ok) {
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, isFavorite: !entry.isFavorite } : e))
        );
      }
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const moodConfig = (mood: string) => MOOD_CONFIG[mood] || MOOD_CONFIG['místico'];

  // ─── Render ───
  return (
    <section id="section-dreams" className="max-w-3xl mx-auto px-3 sm:px-4 py-16 scroll-mt-16 section-accent-top">
      {/* Section Header */}
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
          Capítulo VII — Sueños
        </motion.p>
        <GothicDivider text="Diario de Sueños" />
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm text-center mt-2 tracking-wide">
          Donde los sueños se convierten en tinta
        </p>
      </motion.div>

      <div className="mt-8">
        {/* ─── Admin: New Dream Button ─── */}
        {isAdmin && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {!showForm ? (
              <motion.button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded border border-[#c9a84c]/20 bg-[#111]/60
                  text-[#c9a84c] hover:bg-[#c9a84c]/5 hover:border-[#c9a84c]/40 transition-all
                  font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-wider cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={14} />
                Nuevo Sueño
              </motion.button>
            ) : (
              <motion.button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2.5 rounded border border-[#2a2a2a] bg-[#111]/60
                  text-[#8a7e6b] hover:text-[#d4c5b0] hover:border-[#8a7e6b]/30 transition-all
                  font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-wider cursor-pointer"
              >
                <X size={14} />
                Cancelar
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ─── Admin: New/Edit Form ─── */}
        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="paper-texture gothic-corner-frame border border-[#2a2a2a] rounded-lg p-5 sm:p-6 space-y-4">
                {/* Gold corner accents */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#c9a84c]/20 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#c9a84c]/20 rounded-bl-sm pointer-events-none" />

                <h3 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-sm uppercase tracking-wider">
                  {editingId ? 'Editar Sueño' : 'Registrar un Sueño'}
                </h3>

                {/* Title */}
                <div>
                  <label className="block font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs mb-1.5">
                    Título del sueño
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="El laberinto de cristal..."
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#d4c5b0]
                      font-[family-name:var(--font-cinzel)] tracking-wide placeholder:text-[#3a3530]
                      focus:outline-none focus:border-[#c9a84c]/40 focus:shadow-[0_0_12px_rgba(201,168,76,0.08)]
                      transition-all"
                    maxLength={200}
                  />
                  <p className="text-right text-[10px] text-[#5a5040] mt-0.5 font-[family-name:var(--font-typewriter)]">
                    {form.title.length}/200
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs mb-1.5">
                    Describe tu sueño
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="Caminaba por un corredor infinito de espejos..."
                    rows={5}
                    className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#d4c5b0]
                      font-[family-name:var(--font-fell)] italic leading-relaxed placeholder:text-[#3a3530]
                      focus:outline-none focus:border-[#c9a84c]/40 focus:shadow-[0_0_12px_rgba(201,168,76,0.08)]
                      transition-all resize-y min-h-[100px] max-h-[300px]
                      dream-journal-scrollbar"
                    maxLength={5000}
                  />
                  <p className="text-right text-[10px] text-[#5a5040] mt-0.5 font-[family-name:var(--font-typewriter)]">
                    {form.content.length}/5000
                  </p>
                </div>

                {/* Mood */}
                <div>
                  <label className="block font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs mb-1.5">
                    Estado del sueño
                  </label>
                  <div className="relative">
                    <select
                      value={form.mood}
                      onChange={(e) => setForm((f) => ({ ...f, mood: e.target.value }))}
                      className="w-full appearance-none bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#d4c5b0]
                        font-[family-name:var(--font-cinzel)] tracking-wide pr-8
                        focus:outline-none focus:border-[#c9a84c]/40 transition-all cursor-pointer"
                    >
                      {MOOD_OPTIONS.map((m) => (
                        <option key={m} value={m}>{MOOD_CONFIG[m].label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5040] pointer-events-none" />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3 pt-2">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-2 rounded border border-[#8B0000]/40 bg-[#8B0000]/10
                      text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-wider
                      hover:bg-[#8B0000]/20 hover:border-[#8B0000]/60 transition-all cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-3 h-3 border border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full"
                        />
                        Guardando...
                      </span>
                    ) : editingId ? 'Guardar Cambios' : 'Registrar Sueño'}
                  </motion.button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-xs text-[#8a7e6b] hover:text-[#d4c5b0] transition-colors
                      font-[family-name:var(--font-cinzel)] uppercase tracking-wider cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Entries List ─── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c]/40 text-lg"
            >
              Despertando recuerdos...
            </motion.div>
          </div>
        ) : entries.length === 0 ? (
          /* Empty State */
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-6 inline-block"
            >
              <Moon size={48} className="text-[#8a7e6b]/30" />
            </motion.div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b]/60 text-base sm:text-lg tracking-wider mb-2">
              Aún no has soñado...
            </h3>
            <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040]/60 text-sm max-w-sm mx-auto">
              El diario de sueños espera en silencio por las visiones de la noche.
            </p>
          </motion.div>
        ) : (
          /* Entry Cards */
          <div className="space-y-3 max-h-[600px] overflow-y-auto dream-journal-scrollbar pr-1">
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => {
                const mc = moodConfig(entry.mood);
                const isExpanded = expandedId === entry.id;
                const isDeleteConfirm = deleteConfirmId === entry.id;

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="relative"
                  >
                    <div
                      className="relative paper-texture border border-[#2a2a2a] rounded-lg overflow-hidden
                        hover:border-[#c9a84c]/15 transition-colors duration-300 group"
                      style={{ borderLeftWidth: '3px', borderLeftColor: mc.color }}
                    >
                      {/* Gold corner accents */}
                      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#c9a84c]/10 rounded-tr-sm pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#c9a84c]/10 rounded-bl-sm pointer-events-none" />

                      {/* Card Header */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Title + Favorite */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3
                                className="font-[family-name:var(--font-cinzel)] text-sm sm:text-base text-[#d4c5b0] tracking-wide truncate cursor-pointer hover:text-[#c9a84c] transition-colors"
                                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                              >
                                {entry.title}
                              </h3>
                              <motion.button
                                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(entry); }}
                                className="shrink-0 cursor-pointer"
                                whileTap={{ scale: 0.85 }}
                              >
                                <Star
                                  size={14}
                                  className={`transition-colors ${
                                    entry.isFavorite
                                      ? 'fill-[#c9a84c] text-[#c9a84c]'
                                      : 'text-[#5a5040] hover:text-[#8a7e6b]'
                                  }`}
                                />
                              </motion.button>
                            </div>

                            {/* Content Preview */}
                            <p
                              className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs sm:text-sm
                                leading-relaxed cursor-pointer hover:text-[#a09080] transition-colors"
                              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                            >
                              {isExpanded
                                ? entry.content
                                : entry.content.length > 100
                                  ? entry.content.substring(0, 100) + '...'
                                  : entry.content}
                            </p>
                          </div>
                        </div>

                        {/* Mood Tag + Date */}
                        <div className="flex items-center gap-3 mt-3">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider
                              font-[family-name:var(--font-cinzel)]"
                            style={{
                              color: mc.color,
                              backgroundColor: mc.bg,
                              border: `1px solid ${mc.color}25`,
                            }}
                          >
                            {mc.label}
                          </span>
                          <span className="font-[family-name:var(--font-fell)] italic text-[10px] sm:text-[11px] text-[#5a5040]">
                            {formatDate(entry.createdAt)}
                          </span>

                          {/* Admin Actions */}
                          {isAdmin && (
                            <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                onClick={() => handleEdit(entry)}
                                className="p-1.5 rounded text-[#8a7e6b] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all cursor-pointer"
                                whileTap={{ scale: 0.9 }}
                                title="Editar"
                              >
                                <Edit3 size={12} />
                              </motion.button>
                              <motion.button
                                onClick={() => setDeleteConfirmId(isDeleteConfirm ? null : entry.id)}
                                className="p-1.5 rounded text-[#8a7e6b] hover:text-[#a00000] hover:bg-[#a00000]/5 transition-all cursor-pointer"
                                whileTap={{ scale: 0.9 }}
                                title="Eliminar"
                              >
                                <Trash2 size={12} />
                              </motion.button>
                            </div>
                          )}
                        </div>

                        {/* Delete Confirmation */}
                        <AnimatePresence>
                          {isDeleteConfirm && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-[#2a2a2a]/50 flex items-center gap-3">
                                <p className="font-[family-name:var(--font-fell)] italic text-[#8B0000] text-xs">
                                  ¿Borrar este sueño para siempre?
                                </p>
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  disabled={deleting}
                                  className="px-3 py-1 rounded border border-[#8B0000]/30 bg-[#8B0000]/5
                                    text-[#a00000] text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-wider
                                    hover:bg-[#8B0000]/15 transition-all cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deleting ? 'Eliminando...' : 'Sí, borrar'}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="text-xs text-[#8a7e6b] hover:text-[#d4c5b0] transition-colors cursor-pointer
                                    font-[family-name:var(--font-cinzel)] uppercase tracking-wider"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Ornament */}
      {!loading && entries.length > 0 && (
        <motion.div
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/20" />
          </div>
          <span className="font-[family-name:var(--font-cinzel)] text-[8px] tracking-[0.3em] uppercase text-[#5a5040]/50">
            fin
          </span>
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/20" />
          </div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
        </motion.div>
      )}
    </section>
  );
}
