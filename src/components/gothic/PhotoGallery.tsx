'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  filename: string;
  originalName: string;
  caption: string | null;
}

interface PhotoGalleryProps {
  photos: Photo[];
  isAdmin: boolean;
  onTogglePublish: (id: string, published: boolean) => void;
}

function PhotoCard({
  photo,
  index,
  isAdmin,
  onTogglePublish,
  onOpen,
}: {
  photo: Photo;
  index: number;
  isAdmin: boolean;
  onTogglePublish: (id: string, published: boolean) => void;
  onOpen: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  // Vary aspect ratio for masonry-like effect
  const aspectClasses = [
    'aspect-[4/3]',
    'aspect-[3/4]',
    'aspect-square',
    'aspect-[4/5]',
    'aspect-[3/2]',
  ];
  const aspectClass = aspectClasses[index % aspectClasses.length];

  return (
    <motion.div
      className="group relative overflow-hidden rounded-sm border border-[#2a2a2a] bg-[#111111] cursor-pointer transition-all duration-500 hover:border-[#8B0000]/40 hover:shadow-[0_0_20px_rgba(139,0,0,0.15)]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: 'easeOut',
      }}
      onClick={onOpen}
    >
      {/* Image container */}
      <div className={`relative ${aspectClass} overflow-hidden bg-[#0a0a0a]`}>
        {!imgError ? (
          <img
            src={`/upload/${photo.filename}`}
            alt={photo.caption || photo.originalName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#8a7e6b] text-xs font-[family-name:var(--font-fell)] italic">
              Imagen no disponible
            </span>
          </div>
        )}

        {/* Age/damage sepia vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 40%, rgba(40, 30, 10, 0.35) 100%),
              linear-gradient(to bottom, rgba(60, 40, 10, 0.12) 0%, transparent 30%, transparent 70%, rgba(40, 25, 5, 0.18) 100%)
            `,
          }}
        />

        {/* Subtle noise grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Caption overlay - slides up from bottom on hover */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none">
          <div className="bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-transparent pt-8 pb-3 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <p className="font-[family-name:var(--font-fell)] italic text-[#d4c5b0]/90 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {photo.caption || photo.originalName}
            </p>
          </div>
        </div>

        {/* Hover edge glow */}
        <div className="absolute inset-0 border border-[#8B0000]/0 group-hover:border-[#8B0000]/20 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Admin publish toggle */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePublish(photo.id, true);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-sm bg-[#0a0a0a]/80 border border-[#2a2a2a] hover:border-[#c9a84c]/50 transition-colors duration-300 cursor-pointer"
          title="Publicar / Ocultar"
        >
          <Eye className="w-3.5 h-3.5 text-[#c9a84c]/70" />
        </button>
      )}
    </motion.div>
  );
}

function Lightbox({
  photos,
  currentIndex,
  onNavigate,
  onClose,
}: {
  photos: Photo[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const photo = photos[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
      if (e.key === 'Escape') onClose();
    },
    [onNavigate, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full border border-[#2a2a2a] bg-[#111111]/80 hover:border-[#c9a84c]/50 transition-all duration-300 cursor-pointer"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5 text-[#d4c5b0]" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-[#111111]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-sm">
        <span className="font-[family-name:var(--font-typewriter)] text-[#8a7e6b] text-xs tracking-wider">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {/* Previous arrow */}
      {hasPrev && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('prev');
          }}
          className="absolute left-3 sm:left-6 z-10 p-2.5 sm:p-3 rounded-full border border-[#2a2a2a] bg-[#111111]/80 backdrop-blur-sm hover:border-[#c9a84c]/40 hover:bg-[#1a1a1a]/90 transition-all duration-300 cursor-pointer group/arrow"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-5 h-5 text-[#8a7e6b] group-hover/arrow:text-[#c9a84c] transition-colors" />
        </motion.button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('next');
          }}
          className="absolute right-3 sm:right-6 z-10 p-2.5 sm:p-3 rounded-full border border-[#2a2a2a] bg-[#111111]/80 backdrop-blur-sm hover:border-[#c9a84c]/40 hover:bg-[#1a1a1a]/90 transition-all duration-300 cursor-pointer group/arrow"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          aria-label="Foto siguiente"
        >
          <ChevronRight className="w-5 h-5 text-[#8a7e6b] group-hover/arrow:text-[#c9a84c] transition-colors" />
        </motion.button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          {!imgError ? (
            <img
              src={`/upload/${photo.filename}`}
              alt={photo.caption || photo.originalName}
              className="max-w-full max-h-[80vh] object-contain rounded-sm border border-[#2a2a2a] shadow-2xl"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-[60vw] h-[60vh] bg-[#111111] border border-[#2a2a2a] rounded-sm">
              <span className="text-[#8a7e6b] text-sm font-[family-name:var(--font-fell)] italic">
                Imagen no disponible
              </span>
            </div>
          )}

          {/* Caption */}
          <motion.p
            className="mt-4 text-sm font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-center max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {photo.caption || photo.originalName}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function PhotoGallery({
  photos,
  isAdmin,
  onTogglePublish,
}: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpen = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (lightboxIndex === null) return;
      if (direction === 'prev' && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      } else if (direction === 'next' && lightboxIndex < photos.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      }
    },
    [lightboxIndex, photos.length]
  );

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[#8a7e6b] font-[family-name:var(--font-fell)] italic text-sm">
          No hay fotografías en esta galería...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry-like grid with varying aspect ratios */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
        {photos.map((photo, index) => (
          <div key={photo.id} className="break-inside-avoid">
            <PhotoCard
              photo={photo}
              index={index}
              isAdmin={isAdmin}
              onTogglePublish={onTogglePublish}
              onOpen={() => handleOpen(index)}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            currentIndex={lightboxIndex}
            onNavigate={handleNavigate}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
