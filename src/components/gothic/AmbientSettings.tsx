'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Sparkles, Layers, MousePointer, Zap } from 'lucide-react';

interface AmbientSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Setting {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultOn: boolean;
}

const SETTINGS: Setting[] = [
  {
    key: 'particles',
    label: 'Partículas',
    description: 'Partículas de sangre flotantes',
    icon: <Sparkles size={14} />,
    defaultOn: true,
  },
  {
    key: 'scanlines',
    label: 'Líneas de escaneo',
    description: 'Efecto CRT retro',
    icon: <Layers size={14} />,
    defaultOn: true,
  },
  {
    key: 'lightning',
    label: 'Relámpagos',
    description: 'Destellos dramáticos',
    icon: <Zap size={14} />,
    defaultOn: false,
  },
  {
    key: 'cursor',
    label: 'Cursor gótico',
    description: 'Puntero personalizado',
    icon: <MousePointer size={14} />,
    defaultOn: false,
  },
];

export default function AmbientSettings({ isOpen, onClose }: AmbientSettingsProps) {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ecos_ambient');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    const defaults: Record<string, boolean> = {};
    SETTINGS.forEach((s) => { defaults[s.key] = s.defaultOn; });
    return defaults;
  });

  const toggleSetting = useCallback((key: string) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('ecos_ambient', JSON.stringify(next));
      return next;
    });
  }, []);

  // Apply effects to document
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('gothic-cursor-active', !!settings.cursor);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 gothic-glass overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-lg tracking-wider">
                    Ambiente
                  </h3>
                  <p className="font-[family-name:var(--font-fell)] italic text-[#8a7e6b] text-xs mt-1">
                    Ajusta la atmósfera del laberinto
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#c9a84c]
                    hover:border-[#c9a84c]/30 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/20" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#c9a84c]/20" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/20" />
              </div>

              {/* Settings list */}
              <div className="space-y-4">
                {SETTINGS.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-3 rounded border border-[#2a2a2a]/50
                      bg-[#0a0a0a]/30 hover:border-[#2a2a2a] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-[#2a2a2a] flex items-center justify-center
                        text-[#8a7e6b] group-hover:text-[#c9a84c] transition-colors">
                        {setting.icon}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-cinzel)] text-xs tracking-wider text-[#d4c5b0] uppercase">
                          {setting.label}
                        </p>
                        <p className="font-[family-name:var(--font-fell)] italic text-[10px] text-[#5a5040]">
                          {setting.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => toggleSetting(setting.key)}
                      className={`gothic-toggle ${settings[setting.key] ? 'active' : ''}`}
                      role="switch"
                      aria-checked={settings[setting.key]}
                      aria-label={setting.label}
                    />
                  </div>
                ))}
              </div>

              {/* Preview section */}
              <div className="mt-6 p-4 rounded border border-[#2a2a2a]/30 bg-[#0a0a0a]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={12} className="text-[#8a7e6b]" />
                  <span className="font-[family-name:var(--font-cinzel)] text-[10px] tracking-widest uppercase text-[#8a7e6b]">
                    Efectos activos
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SETTINGS.filter((s) => settings[s.key]).map((s) => (
                    <span
                      key={s.key}
                      className="px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-typewriter)]
                        text-[#c9a84c]/60 border border-[#c9a84c]/15 bg-[#c9a84c]/5"
                    >
                      {s.label}
                    </span>
                  ))}
                  {SETTINGS.filter((s) => settings[s.key]).length === 0 && (
                    <span className="font-[family-name:var(--font-fell)] italic text-[#5a5040] text-xs">
                      Todos los efectos desactivados
                    </span>
                  )}
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  const defaults: Record<string, boolean> = {};
                  SETTINGS.forEach((s) => { defaults[s.key] = s.defaultOn; });
                  setSettings(defaults);
                  localStorage.setItem('ecos_ambient', JSON.stringify(defaults));
                }}
                className="mt-4 w-full px-3 py-2 rounded border border-[#2a2a2a]/50 text-[#8a7e6b]/60 text-xs
                  font-[family-name:var(--font-cinzel)] tracking-wider uppercase
                  hover:text-[#8a7e6b] hover:border-[#2a2a2a] transition-all cursor-pointer"
              >
                Restablecer valores
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
