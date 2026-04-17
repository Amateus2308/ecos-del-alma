'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Music, Image as ImageIcon, Type, Mail } from 'lucide-react';
import type { CanvasElement, Photo, Letter, Video, Song } from '@/store/content';

interface CanvasViewerProps {
  page: {
    id: string;
    name: string;
    elements: CanvasElement[];
  };
  allPhotos: Photo[];
  allLetters: Letter[];
  allVideos: Video[];
  allSongs: Song[];
}

export default function CanvasViewer({
  page,
  allPhotos,
  allLetters,
  allVideos,
  allSongs,
}: CanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoOverlay, setVideoOverlay] = useState<{ youtubeId: string; title: string | null } | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const CANVAS_W = 3000;
  const CANVAS_H = 2000;

  const handlePlaySong = (song: Song) => {
    if (playingSongId === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingSongId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`/upload/${song.filename}`);
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlayingSongId(song.id);

    audio.addEventListener('ended', () => {
      setPlayingSongId(null);
      audioRef.current = null;
    });
  };

  const handleOpenVideo = (video: Video) => {
    setVideoOverlay({ youtubeId: video.youtubeId, title: video.title });
  };

  const renderElementContent = (el: CanvasElement) => {
    switch (el.type) {
      case 'text':
        return (
          <div
            className="w-full h-full overflow-hidden p-1"
          >
            <p
              className="font-[family-name:var(--font-fell)] text-[#d4c5b0] text-sm leading-relaxed whitespace-pre-wrap"
              style={{ textShadow: '0 0 1px rgba(139, 0, 0, 0.15)' }}
            >
              {el.content || ''}
            </p>
          </div>
        );

      case 'photo': {
        const photo = allPhotos.find((p) => p.id === el.refId);
        if (!photo) return null;
        return (
          <img
            src={`/upload/${photo.filename}`}
            alt={photo.caption || photo.originalName}
            className="w-full h-full object-cover rounded"
            loading="lazy"
          />
        );
      }

      case 'letter': {
        const letter = allLetters.find((l) => l.id === el.refId);
        if (!letter) return null;
        return (
          <div className="p-4 h-full overflow-hidden paper-texture rounded">
            {/* Wax seal */}
            <div className="absolute top-2 right-2 pointer-events-none select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a00000] via-[#8B0000] to-[#5a0000] shadow-[0_0_8px_rgba(139,0,0,0.3)] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-[#c9a84c]/20 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#c9a84c]/25" />
                </div>
              </div>
            </div>

            <h4
              className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-sm mb-3 pr-10"
              style={{ textShadow: '0 0 8px rgba(201, 168, 76, 0.2)' }}
            >
              {letter.title}
            </h4>

            {/* Ornamental divider */}
            <div className="gothic-divider my-2">
              <span className="text-[#c9a84c]/40 text-[8px] select-none">✦</span>
            </div>

            <p className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-xs leading-relaxed whitespace-pre-wrap overflow-hidden">
              {letter.content}
            </p>
          </div>
        );
      }

      case 'video': {
        const video = allVideos.find((v) => v.id === el.refId);
        if (!video) return null;
        return (
          <button
            onClick={() => handleOpenVideo(video)}
            className="w-full h-full relative rounded overflow-hidden cursor-pointer group"
          >
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title || 'Video'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#8B0000]/80 group-hover:bg-[#8B0000] flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-[#8B0000]/40">
                <Play size={22} className="text-[#d4c5b0] ml-0.5" fill="#d4c5b0" />
              </div>
            </div>
            {video.title && (
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm text-[#d4c5b0] font-[family-name:var(--font-fell)] truncate">
                  {video.title}
                </p>
              </div>
            )}
          </button>
        );
      }

      case 'song': {
        const song = allSongs.find((s) => s.id === el.refId);
        if (!song) return null;
        const isPlaying = playingSongId === song.id;
        return (
          <button
            onClick={() => handlePlaySong(song)}
            className={`w-full h-full flex items-center gap-3 p-3 rounded border transition-all ${
              isPlaying
                ? 'bg-[#8B0000]/10 border-[#8B0000]/40'
                : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#c9a84c]/30'
            }`}
          >
            <div
              className={`w-11 h-11 rounded flex items-center justify-center shrink-0 transition-colors ${
                isPlaying ? 'bg-[#8B0000]/30' : 'bg-[#2d1b3d]'
              }`}
            >
              {isPlaying ? (
                <div className="flex items-end gap-[2px] h-4">
                  <motion.div
                    className="w-[3px] bg-[#c9a84c] rounded-full"
                    animate={{ height: ['4px', '16px', '8px', '12px', '4px'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="w-[3px] bg-[#c9a84c] rounded-full"
                    animate={{ height: ['12px', '4px', '16px', '8px', '12px'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  />
                  <motion.div
                    className="w-[3px] bg-[#c9a84c] rounded-full"
                    animate={{ height: ['8px', '12px', '4px', '16px', '8px'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  />
                </div>
              ) : (
                <Music size={18} className="text-[#c9a84c]" />
              )}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm text-[#d4c5b0] font-[family-name:var(--font-fell)] truncate">
                {song.title || song.originalName}
              </p>
              <p className="text-xs text-[#8a7e6b] truncate">{song.artist || 'Sin artista'}</p>
            </div>
            {isPlaying && (
              <div className="text-xs text-[#8a7e6b] font-[family-name:var(--font-typewriter)]">
                ♪
              </div>
            )}
          </button>
        );
      }

      default:
        return null;
    }
  };

  const sortedElements = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-[#0a0a0a] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111]/80 backdrop-blur-sm border-b border-[#2a2a2a] shrink-0 z-10">
        <div className="flex items-center gap-3">
          <ImageIcon size={18} className="text-[#c9a84c]" />
          <h2
            className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-sm sm:text-base tracking-widest uppercase"
            style={{ textShadow: '0 0 10px rgba(201, 168, 76, 0.2)' }}
          >
            {page.name}
          </h2>
          <span className="text-xs text-[#8a7e6b] font-[family-name:var(--font-fell)]">
            ({page.elements.length} elemento{page.elements.length !== 1 ? 's' : ''})
          </span>
        </div>
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
            }
          }}
          className="p-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#d4c5b0] hover:border-[#d4c5b0]/30 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Canvas viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={{ background: '#0a0a0a' }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            minWidth: CANVAS_W,
            minHeight: CANVAS_H,
            background:
              'radial-gradient(circle, rgba(42, 42, 42, 0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Subtle center cross */}
          <div
            className="absolute pointer-events-none"
            style={{ left: CANVAS_W / 2, top: 0, width: 1, height: CANVAS_H, background: 'rgba(139, 0, 0, 0.06)' }}
          />
          <div
            className="absolute pointer-events-none"
            style={{ top: CANVAS_H / 2, left: 0, height: 1, width: CANVAS_W, background: 'rgba(139, 0, 0, 0.06)' }}
          />

          {/* Render elements */}
          {sortedElements.map((el) => (
            <div
              key={el.id}
              className="absolute"
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation}deg)`,
                zIndex: el.zIndex,
              }}
            >
              {renderElementContent(el)}
            </div>
          ))}

          {/* Empty state */}
          {sortedElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4 opacity-30">🖼️</div>
                <p className="font-[family-name:var(--font-cinzel)] text-[#8a7e6b] text-lg tracking-wider">
                  Este lienzo está vacío
                </p>
                <p className="font-[family-name:var(--font-fell)] text-[#5a5040] text-sm mt-2">
                  Aún no se han añadido elementos
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video overlay */}
      {videoOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setVideoOverlay(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideoOverlay(null)}
              className="absolute -top-10 right-0 p-2 text-[#8a7e6b] hover:text-[#d4c5b0] transition-colors"
            >
              <X size={20} />
            </button>
            {videoOverlay.title && (
              <p className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-sm tracking-widest uppercase mb-3">
                {videoOverlay.title}
              </p>
            )}
            <iframe
              src={`https://www.youtube.com/embed/${videoOverlay.youtubeId}?autoplay=1`}
              title={videoOverlay.title || 'Video'}
              className="w-full h-full rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
