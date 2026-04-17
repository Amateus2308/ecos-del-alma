'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Feather } from 'lucide-react';

interface LoveLetterArchiveProps {
  letters: Array<{ id: string; title: string; content: string; published: boolean; createdAt: string }>;
  onRead: (id: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'az';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Más recientes',
  oldest: 'Más antiguas',
  az: 'A-Z',
};

export default function LoveLetterArchive({ letters, onRead }: LoveLetterArchiveProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');

  const filtered = useMemo(() => {
    let result = [...letters];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title, 'es'));
        break;
    }

    return result;
  }, [letters, search, sort]);

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

  return (
    <div className="w-full">
      {/* ─── Archive Header ─── */}
      <div className="text-center mb-8">
        <h2
          className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-2xl sm:text-3xl md:text-4xl mb-2"
          style={{ textShadow: '0 0 20px rgba(201, 168, 76, 0.3), 0 0 40px rgba(201, 168, 76, 0.1)' }}
        >
          Archivo de Cartas
        </h2>
        <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs sm:text-sm tracking-wide">
          Todas las cartas del laberinto, ordenadas por el tiempo
        </p>
      </div>

      {/* ─── Controls Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5040] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en el archivo..."
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-sm pl-9 pr-4 py-2.5 text-sm font-[family-name:var(--font-typewriter)] text-[#c4b59a] placeholder:text-[#5a5040]/50 focus:outline-none focus:border-[#c9a84c]/60 focus:shadow-[0_0_12px_rgba(201,168,76,0.15)] transition-all duration-300"
          />
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`px-3 py-2 rounded-sm text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer ${
                sort === opt
                  ? 'bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/40 shadow-[0_0_8px_rgba(201,168,76,0.1)]'
                  : 'bg-[#111] text-[#5a5040] border border-[#2a2a2a] hover:text-[#8a7e6b] hover:border-[#3a3a3a]'
              }`}
            >
              {SORT_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Count Display ─── */}
      <p className="font-[family-name:var(--font-typewriter)] text-[#5a5040] text-xs tracking-wide mb-6">
        {filtered.length} {filtered.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
      </p>

      {/* ─── Masonry Grid ─── */}
      {filtered.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
          {filtered.map((letter, i) => (
            <motion.article
              key={letter.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="break-inside-avoid"
            >
              <div className="relative bg-[#1a1814] rounded-sm border border-[#2a2a2a] border-l-[3px] border-l-[#c9a84c]/40 overflow-hidden transition-all duration-300 hover:border-l-[#c9a84c]/70 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_12px_rgba(201,168,76,0.08)] group">
                {/* Torn edge effect at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(135deg, #1a1814 33.33%, transparent 33.33%) -8px 0,
                      linear-gradient(225deg, #1a1814 33.33%, transparent 33.33%) -8px 0,
                      linear-gradient(315deg, #1a1814 33.33%, transparent 33.33%),
                      linear-gradient(45deg, #1a1814 33.33%, transparent 33.33%)
                    `,
                    backgroundSize: '16px 8px',
                    opacity: 0.5,
                  }}
                />

                {/* Wax Seal - top right corner */}
                <div className="absolute top-3 right-3 pointer-events-none select-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7.5" fill="#8B0000" stroke="#c9a84c" strokeWidth="0.5" opacity="0.8" />
                    <circle cx="8" cy="8" r="5" fill="#a00000" />
                    {/* Cross */}
                    <line x1="8" y1="4" x2="8" y2="12" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
                    <line x1="4" y1="8" x2="12" y2="8" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
                    {/* Shine */}
                    <circle cx="6" cy="6" r="1.5" fill="white" opacity="0.06" />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 pb-6">
                  {/* Title */}
                  <h3
                    className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-base sm:text-lg mb-1.5 pr-6 leading-snug"
                    style={{ textShadow: '0 0 8px rgba(201, 168, 76, 0.2)' }}
                  >
                    {letter.title}
                  </h3>

                  {/* Date */}
                  <p className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-[11px] sm:text-xs mb-3 tracking-wide">
                    {formatDate(letter.createdAt)}
                  </p>

                  {/* Ornamental line */}
                  <div className="w-16 h-px bg-gradient-to-r from-[#c9a84c]/20 to-transparent mb-3" />

                  {/* Content Preview */}
                  <p
                    className="font-[family-name:var(--font-typewriter)] text-[#8a7e6b] text-xs sm:text-sm leading-relaxed tracking-wide"
                    style={{ textShadow: '0 0 1px rgba(139, 0, 0, 0.1)' }}
                  >
                    {letter.content.length > 120
                      ? letter.content.substring(0, 120) + '...'
                      : letter.content}
                  </p>

                  {/* Read Button */}
                  <button
                    onClick={() => onRead(letter.id)}
                    className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 font-[family-name:var(--font-cinzel)] text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[#5a5040] hover:text-[#c9a84c] border border-[#2a2a2a] hover:border-[#c9a84c]/30 rounded-sm transition-all duration-300 group/read cursor-pointer"
                  >
                    <BookOpen size={12} className="group-hover/read:text-[#c9a84c] transition-colors" />
                    <span>Leer carta completa</span>
                    <span className="text-[#c9a84c]/20 group-hover/read:text-[#c9a84c]/50 transition-colors">—</span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        /* ─── Empty State ─── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center mb-5">
            <Feather size={24} className="text-[#3a3530]" />
          </div>
          <p
            className="font-[family-name:var(--font-cinzel-decorative)] text-[#5a5040] text-lg sm:text-xl mb-2"
            style={{ textShadow: '0 0 10px rgba(90, 80, 64, 0.2)' }}
          >
            El archivo está vacío...
          </p>
          <p className="font-[family-name:var(--font-fell)] italic text-[#3a3530] text-xs sm:text-sm tracking-wide max-w-xs">
            Aún no hay cartas en el laberinto. Las palabras esperan en la oscuridad.
          </p>
        </motion.div>
      )}
    </div>
  );
}
