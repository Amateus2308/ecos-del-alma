'use client';

import { motion } from 'framer-motion';

interface GothicDividerProps {
  text?: string;
  className?: string;
}

export default function GothicDivider({
  text,
  className = '',
}: GothicDividerProps) {
  return (
    <motion.div
      className={`flex items-center gap-4 w-full py-4 ${className}`}
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Left line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-[#c9a84c]/60" />

      {/* Center ornament */}
      {text ? (
        <div className="flex items-center gap-3 shrink-0">
          {/* Left diamond */}
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/50" />
          {/* Text */}
          <span className="text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-[0.2em] text-[#c9a84c]/70 whitespace-nowrap">
            {text}
          </span>
          {/* Right diamond */}
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/50" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center shrink-0">
          {/* Outer diamond */}
          <div className="w-2 h-2 rotate-45 border border-[#c9a84c]/50 bg-[#0a0a0a]" />
          {/* Inner dot */}
          <div className="absolute w-1 h-1 rotate-45 bg-[#c9a84c]/60" />
        </div>
      )}

      {/* Right line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c9a84c]/40 to-[#c9a84c]/60" />
    </motion.div>
  );
}
