'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Trash2, BookOpen } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface LetterCardProps {
  letter: {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
  };
  index: number;
  isAdmin: boolean;
  onTogglePublish: (id: string, published: boolean) => void;
  onDelete?: (id: string) => void;
  onRead?: (id: string) => void;
}

export default function LetterCard({
  letter,
  index,
  isAdmin,
  onTogglePublish,
  onDelete,
  onRead,
}: LetterCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="max-w-2xl mx-auto relative group"
    >
      <div className="paper-texture rounded-lg border border-[#2a2a2a] p-4 sm:p-6 md:p-8 relative overflow-hidden card-glow">
        {/* Gold-tinted corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c9a84c]/30 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#c9a84c]/30 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#c9a84c]/30 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c9a84c]/30 rounded-br-lg pointer-events-none" />

        {/* Wax seal decoration - top right */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 pointer-events-none select-none">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#a00000] via-[#8B0000] to-[#5a0000] shadow-[0_0_15px_rgba(139,0,0,0.4)]" />
            {/* Inner ring */}
            <div className="absolute inset-[3px] rounded-full border border-[#c9a84c]/20" />
            {/* Inner circle */}
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#c00000] to-[#6a0000]" />
            {/* Cross design */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[1px] h-5 bg-[#c9a84c]/30 absolute" />
              <div className="h-[1px] w-5 bg-[#c9a84c]/30 absolute" />
              <div className="w-2 h-2 rounded-full border border-[#c9a84c]/25" />
            </div>
            {/* Shine highlight */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/5" />
          </div>
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="absolute top-2 right-14 sm:top-3 sm:right-16 md:top-4 md:right-20 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1.5 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-md px-2 py-1 border border-[#2a2a2a]">
              {letter.published ? (
                <Eye size={12} className="text-[#c9a84c]" />
              ) : (
                <EyeOff size={12} className="text-[#8a7e6b]" />
              )}
              <Switch
                checked={letter.published}
                onCheckedChange={() => onTogglePublish(letter.id, letter.published)}
                className="data-[state=checked]:bg-[#8B0000] scale-75"
              />
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(letter.id);
                }}
                className="p-1.5 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-md border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#a00000] hover:border-[#a00000]/30 transition-all cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* Title */}
        <h2
          className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-lg sm:text-xl md:text-2xl mb-2 pr-14 sm:pr-16 md:pr-20"
          style={{ textShadow: '0 0 10px rgba(201, 168, 76, 0.3)' }}
        >
          {letter.title}
        </h2>

        {/* Date */}
        <p className="font-[family-name:var(--font-typewriter)] text-[#8a7e6b] text-xs sm:text-sm mb-4 tracking-wide">
          {formatDate(letter.createdAt)}
        </p>

        {/* Ornamental divider */}
        <div className="gothic-divider my-4">
          <span className="text-[#c9a84c]/40 text-xs select-none">✦</span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {letter.content.split('\n').map((paragraph, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-sm sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap"
              style={{
                textShadow: '0 0 1px rgba(139, 0, 0, 0.15)',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom ornamental flourish */}
        <div className="mt-6 flex justify-center">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
        </div>

        {/* Read letter button */}
        {onRead && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => onRead(letter.id)}
              className="inline-flex items-center gap-2 px-4 py-2 font-[family-name:var(--font-cinzel)] text-xs uppercase tracking-[0.15em] text-[#8a7e6b] hover:text-[#c9a84c] border border-[#2a2a2a] hover:border-[#c9a84c]/30 rounded-sm transition-all duration-300 group/read cursor-pointer"
            >
              <BookOpen size={13} className="group-hover/read:text-[#c9a84c] transition-colors" />
              <span>Abrir carta</span>
              <span className="text-[#c9a84c]/30 group-hover/read:text-[#c9a84c]/50 transition-colors">—</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
