'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Video {
  id: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string | null;
}

interface GothicVideoPlayerProps {
  video: Video;
  isAdmin: boolean;
  onTogglePublish: (id: string, published: boolean) => void;
  published: boolean;
}

function OrnateCorner({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const positionClasses: Record<string, string> = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const rotationClasses: Record<string, string> = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-x-[-1] scale-y-[-1]',
  };

  return (
    <svg
      className={`absolute w-6 h-6 text-[#c9a84c]/30 pointer-events-none ${positionClasses[position]} ${rotationClasses[position]}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 2 L2 8 L4 8 L4 4 L8 4 L8 2 Z" fill="currentColor" />
      <path
        d="M2 2 L6 2 L6 3 L3 3 L3 6 L2 6 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <circle cx="5" cy="5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function GothicVideoPlayer({
  video,
  isAdmin,
  onTogglePublish,
  published,
}: GothicVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayTitle = video.title || 'Video sin título';
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.getInternalPlayer()?.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current?.getInternalPlayer()?.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Video container with gothic frame */}
      <div
        ref={containerRef}
        className="relative bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm overflow-hidden transition-all duration-500 hover:border-[#8B0000]/30 hover:shadow-[0_0_20px_rgba(139,0,0,0.1)]"
        style={{ aspectRatio: '16/9' }}
      >
        {/* React Player */}
        <ReactPlayer
          ref={playerRef}
          url={youtubeUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReady={handleReady}
          controls={false}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                controls: 0,
                iv_load_policy: 3,
                autoplay: 0,
                fs: 0,
                disablekb: 0,
                playsinline: 1,
              },
            },
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        {/* Ornate corners */}
        <OrnateCorner position="top-left" />
        <OrnateCorner position="top-right" />
        <OrnateCorner position="bottom-left" />
        <OrnateCorner position="bottom-right" />

        {/* Gothic play overlay */}
        {!isPlaying && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/60 cursor-pointer z-10"
            onClick={handlePlayPause}
            initial={{ opacity: 1 }}
            animate={{ opacity: isPlaying ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.6) 100%)',
              }}
            />

            {/* Play button */}
            <motion.div
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#c9a84c]/60 bg-[#0a0a0a]/80 flex items-center justify-center hover:border-[#c9a84c] hover:shadow-[0_0_25px_rgba(201,168,76,0.3)] transition-all duration-400 group/play"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Inner glow ring */}
              <div className="absolute inset-1 rounded-full border border-[#8B0000]/40 group-hover/play:border-[#8B0000]/70 transition-colors duration-300" />
              <div className="absolute inset-2 rounded-full border border-[#c9a84c]/20" />

              {/* Play triangle */}
              <svg
                width="22"
                height="26"
                viewBox="0 0 22 26"
                fill="currentColor"
                className="text-[#c9a84c] ml-1"
              >
                <path d="M0 0L22 13L0 26V0Z" />
              </svg>
            </motion.div>

            {/* "Click to play" hint */}
            <p className="relative z-10 mt-4 text-[10px] font-[family-name:var(--font-cinzel)] uppercase tracking-[0.15em] text-[#8a7e6b]/60">
              Reproducir
            </p>
          </motion.div>
        )}

        {/* Custom controls bar (visible when playing) */}
        <AnimatePresence>
          {isPlaying && isReady && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-end p-3 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pause button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="p-2 rounded-full bg-[#111111]/80 border border-[#2a2a2a] hover:border-[#c9a84c]/50 transition-all duration-300 cursor-pointer"
                aria-label="Pausar"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-[#c9a84c]"
                >
                  <rect
                    x="2"
                    y="1"
                    width="3"
                    height="12"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="9"
                    y="1"
                    width="3"
                    height="12"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title section */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-cinzel)] text-sm font-semibold text-[#c9a84c] truncate">
            {displayTitle}
          </h3>
        </div>

        {/* Admin publish toggle */}
        {isAdmin && (
          <button
            onClick={() => onTogglePublish(video.id, !published)}
            className="shrink-0 p-1.5 rounded-sm border border-[#2a2a2a] hover:border-[#c9a84c]/50 transition-colors duration-300 cursor-pointer"
            title={published ? 'Ocultar' : 'Publicar'}
          >
            {published ? (
              <Eye className="w-3.5 h-3.5 text-[#c9a84c]/70" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-[#8a7e6b]" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}


