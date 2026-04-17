'use client';

// Panel de administración — aquí se crean las cartas, se suben fotos, etc.
// es un sidebar que se desliza desde la derecha
// el textarea de cartas tiene scroll y se puede expandir (resize-y)

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, ChevronDown, Upload, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Photo, Song, Video, CanvasPage } from '@/store/content';

interface AdminPanelProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  photos?: Photo[];
  songs?: Song[];
  videos?: Video[];
  canvasPages?: CanvasPage[];
}

type SectionKey = 'cartas' | 'fotos' | 'canciones' | 'videos' | 'lienzo' | 'usuarios';

interface SectionConfig {
  key: SectionKey;
  icon: string;
  label: string;
  defaultOpen: boolean;
}

const SECTIONS: SectionConfig[] = [
  { key: 'cartas', icon: '📝', label: 'Cartas', defaultOpen: true },
  { key: 'fotos', icon: '📷', label: 'Fotos', defaultOpen: false },
  { key: 'canciones', icon: '🎵', label: 'Canciones', defaultOpen: false },
  { key: 'videos', icon: '🎬', label: 'Videos', defaultOpen: false },
  { key: 'lienzo', icon: '🖼️', label: 'Lienzo', defaultOpen: false },
  { key: 'usuarios', icon: '👥', label: 'Usuarios', defaultOpen: false },
];

export default function AdminPanel({
  token,
  isOpen,
  onClose,
  onRefresh,
  photos = [],
  songs = [],
  videos = [],
  canvasPages = [],
}: AdminPanelProps) {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SECTIONS.forEach((s) => { initial[s.key] = s.defaultOpen; });
    return initial as Record<SectionKey, boolean>;
  });
  const [submitting, setSubmittingState] = useState<Record<string, boolean>>({});

  const authHeaders = { Authorization: `Bearer ${token}` };

  // Letter form
  const letterTitleRef = useRef<HTMLInputElement>(null);
  const letterContentRef = useRef<HTMLTextAreaElement>(null);

  // Photo form
  const photoFileRef = useRef<HTMLInputElement>(null);
  const photoCaptionRef = useRef<HTMLInputElement>(null);

  // Song form
  const songFileRef = useRef<HTMLInputElement>(null);
  const songTitleRef = useRef<HTMLInputElement>(null);
  const songArtistRef = useRef<HTMLInputElement>(null);

  // Video form
  const videoUrlRef = useRef<HTMLInputElement>(null);
  const videoTitleRef = useRef<HTMLInputElement>(null);

  // Canvas form
  const canvasNameRef = useRef<HTMLInputElement>(null);

  // User form
  const userEmailRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const userPasswordRef = useRef<HTMLInputElement>(null);

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setSubmitting = (key: string, val: boolean) => {
    setSubmittingState((prev) => ({ ...prev, [key]: val }));
  };

  // ─── Letter ───
  const handleCreateLetter = async () => {
    const title = letterTitleRef.current?.value?.trim();
    const content = letterContentRef.current?.value?.trim();
    if (!title || !content) { toast.error('Título y contenido son requeridos'); return; }
    setSubmitting('letter', true);
    try {
      const res = await fetch('/api/letters', { method: 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Carta creada');
      letterTitleRef.current!.value = '';
      letterContentRef.current!.value = '';
      onRefresh();
    } catch { toast.error('Error de conexión'); } finally { setSubmitting('letter', false); }
  };

  // ─── Photo ───
  const handleUploadPhoto = async () => {
    const file = photoFileRef.current?.files?.[0];
    if (!file) { toast.error('Selecciona una imagen'); return; }
    setSubmitting('photo', true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('type', 'photo');
      if (photoCaptionRef.current?.value?.trim()) fd.append('caption', photoCaptionRef.current.value.trim());
      const res = await fetch('/api/upload', { method: 'POST', headers: authHeaders, body: fd });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Foto subida');
      photoFileRef.current!.value = '';
      if (photoCaptionRef.current) photoCaptionRef.current.value = '';
      onRefresh();
    } catch { toast.error('Error de conexión'); } finally { setSubmitting('photo', false); }
  };

  const handleTogglePhotoPublish = async (id: string, published: boolean) => {
    try {
      await fetch('/api/photos', { method: 'PUT', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, published: !published }) });
      toast.success(published ? 'Foto ocultada' : 'Foto publicada');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await fetch(`/api/photos?id=${id}`, { method: 'DELETE', headers: authHeaders });
      toast.success('Foto eliminada');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  // ─── Song ───
  const handleUploadSong = async () => {
    const file = songFileRef.current?.files?.[0];
    if (!file) { toast.error('Selecciona un audio'); return; }
    setSubmitting('song', true);
    try {
      const fd = new FormData();
      fd.append('files', file);
      fd.append('type', 'song');
      if (songTitleRef.current?.value?.trim()) fd.append('title', songTitleRef.current.value.trim());
      if (songArtistRef.current?.value?.trim()) fd.append('artist', songArtistRef.current.value.trim());
      const res = await fetch('/api/upload', { method: 'POST', headers: authHeaders, body: fd });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Canción subida');
      songFileRef.current!.value = '';
      if (songTitleRef.current) songTitleRef.current.value = '';
      if (songArtistRef.current) songArtistRef.current.value = '';
      onRefresh();
    } catch { toast.error('Error de conexión'); } finally { setSubmitting('song', false); }
  };

  const handleToggleSongPublish = async (id: string, published: boolean) => {
    try {
      await fetch('/api/songs', { method: 'PUT', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, published: !published }) });
      toast.success(published ? 'Canción oculta' : 'Canción publicada');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      await fetch(`/api/songs?id=${id}`, { method: 'DELETE', headers: authHeaders });
      toast.success('Canción eliminada');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  // ─── Video ───
  const handleAddVideo = async () => {
    const youtubeUrl = videoUrlRef.current?.value?.trim();
    const title = videoTitleRef.current?.value?.trim();
    if (!youtubeUrl) { toast.error('URL de YouTube requerida'); return; }
    setSubmitting('video', true);
    try {
      const res = await fetch('/api/videos', { method: 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ youtubeUrl, title }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Video añadido');
      videoUrlRef.current!.value = '';
      if (videoTitleRef.current) videoTitleRef.current.value = '';
      onRefresh();
    } catch { toast.error('Error de conexión'); } finally { setSubmitting('video', false); }
  };

  const handleToggleVideoPublish = async (id: string, published: boolean) => {
    try {
      await fetch('/api/videos', { method: 'PUT', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, published: !published }) });
      toast.success(published ? 'Video oculto' : 'Video publicado');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await fetch(`/api/videos?id=${id}`, { method: 'DELETE', headers: authHeaders });
      toast.success('Video eliminado');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  // ─── Canvas ───
  const handleCreateCanvas = async () => {
    const name = canvasNameRef.current?.value?.trim();
    if (!name) { toast.error('Nombre requerido'); return; }
    setSubmitting('canvas', true);
    try {
      const res = await fetch('/api/canvas', { method: 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Lienzo creado');
      canvasNameRef.current!.value = '';
      onRefresh();
    } catch { toast.error('Error de conexión'); } finally { setSubmitting('canvas', false); }
  };

  const handleDeleteCanvas = async (id: string) => {
    try {
      await fetch(`/api/canvas?id=${id}`, { method: 'DELETE', headers: authHeaders });
      toast.success('Lienzo eliminado');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  const handleToggleCanvasPublish = async (id: string, published: boolean) => {
    try {
      await fetch('/api/canvas', { method: 'PUT', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, published: !published }) });
      toast.success(published ? 'Lienzo oculto' : 'Lienzo publicado');
      onRefresh();
    } catch { toast.error('Error'); }
  };

  // ─── User ───
  const handleCreateUser = async () => {
    const email = userEmailRef.current?.value?.trim();
    const name = userNameRef.current?.value?.trim();
    const password = userPasswordRef.current?.value?.trim();
    if (!email) { toast.error('Email requerido'); return; }
    setSubmitting('user', true);
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create-viewer', email, name, password }) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || 'Error'); return; }
      toast.success('Usuario creado');
      userEmailRef.current!.value = '';
      userNameRef.current!.value = '';
      userPasswordRef.current!.value = '';
    } catch { toast.error('Error de conexión'); } finally { setSubmitting('user', false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[360px] bg-[#111111] border-l-[3px] border-[#8B0000] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
              <h2
                className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-lg tracking-widest uppercase"
              >
                Panel del Guardián
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-[#1a1a1a] text-[#8a7e6b] hover:text-[#d4c5b0] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* ─── Cartas ─── */}
              <Collapsible open={openSections.cartas} onOpenChange={() => toggleSection('cartas')}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                  <span className="text-lg">📝</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-sm tracking-wider flex-1 text-left">
                    Cartas
                  </span>
                  <ChevronDown size={16} className={`text-[#8a7e6b] transition-transform ${openSections.cartas ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pl-2 pr-1 pb-3">
                    <Input
                      ref={letterTitleRef}
                      placeholder="Título de la carta"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Textarea
                      ref={letterContentRef}
                      placeholder="Escribe tu carta..."
                      rows={6}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)] min-h-[120px] max-h-[400px] resize-y overflow-y-auto custom-scrollbar"
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateLetter}
                      disabled={!!submitting.letter}
                      className="w-full bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase"
                    >
                      {submitting.letter ? 'Creando...' : 'Crear Carta'}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ─── Fotos ─── */}
              <Collapsible open={openSections.fotos} onOpenChange={() => toggleSection('fotos')}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                  <span className="text-lg">📷</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-sm tracking-wider flex-1 text-left">
                    Fotos
                  </span>
                  <ChevronDown size={16} className={`text-[#8a7e6b] transition-transform ${openSections.fotos ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pl-2 pr-1 pb-3">
                    <input
                      ref={photoFileRef}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-[#8a7e6b] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-[family-name:var(--font-cinzel)] file:tracking-wider file:uppercase file:bg-[#2a2a2a] file:text-[#c9a84c] hover:file:bg-[#3a3a3a] file:cursor-pointer file:transition-colors"
                    />
                    <Input
                      ref={photoCaptionRef}
                      placeholder="Pie de foto (opcional)"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Button
                      size="sm"
                      onClick={handleUploadPhoto}
                      disabled={!!submitting.photo}
                      className="w-full bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase"
                    >
                      {submitting.photo ? 'Subiendo...' : 'Subir Foto'}
                    </Button>

                    {/* Existing photos list */}
                    {photos.length > 0 && (
                      <div className="space-y-2 mt-3 border-t border-[#2a2a2a] pt-3">
                        <p className="text-xs text-[#8a7e6b] font-[family-name:var(--font-cinzel)] tracking-wider uppercase">Existentes ({photos.length})</p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {photos.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2a2a]">
                              <img
                                src={`/upload/${p.filename}`}
                                alt={p.caption || p.originalName}
                                className="w-10 h-10 rounded object-cover border border-[#2a2a2a]"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                                  {p.caption || p.originalName}
                                </p>
                                <p className="text-[10px] text-[#8a7e6b]">{p.published ? 'Publicado' : 'Borrador'}</p>
                              </div>
                              <Switch
                                checked={p.published}
                                onCheckedChange={() => handleTogglePhotoPublish(p.id, p.published)}
                                className="data-[state=checked]:bg-[#8B0000]"
                              />
                              <button
                                onClick={() => handleDeletePhoto(p.id)}
                                className="p-1 text-[#8a7e6b] hover:text-[#a00000] transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ─── Canciones ─── */}
              <Collapsible open={openSections.canciones} onOpenChange={() => toggleSection('canciones')}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                  <span className="text-lg">🎵</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-sm tracking-wider flex-1 text-left">
                    Canciones
                  </span>
                  <ChevronDown size={16} className={`text-[#8a7e6b] transition-transform ${openSections.canciones ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pl-2 pr-1 pb-3">
                    <input
                      ref={songFileRef}
                      type="file"
                      accept="audio/*"
                      className="block w-full text-sm text-[#8a7e6b] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-[family-name:var(--font-cinzel)] file:tracking-wider file:uppercase file:bg-[#2a2a2a] file:text-[#c9a84c] hover:file:bg-[#3a3a3a] file:cursor-pointer file:transition-colors"
                    />
                    <Input
                      ref={songTitleRef}
                      placeholder="Título"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Input
                      ref={songArtistRef}
                      placeholder="Artista"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Button
                      size="sm"
                      onClick={handleUploadSong}
                      disabled={!!submitting.song}
                      className="w-full bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase"
                    >
                      {submitting.song ? 'Subiendo...' : 'Subir Canción'}
                    </Button>

                    {songs.length > 0 && (
                      <div className="space-y-2 mt-3 border-t border-[#2a2a2a] pt-3">
                        <p className="text-xs text-[#8a7e6b] font-[family-name:var(--font-cinzel)] tracking-wider uppercase">Existentes ({songs.length})</p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {songs.map((s) => (
                            <div key={s.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2a2a]">
                              <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#8a7e6b]">
                                🎵
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                                  {s.title || s.originalName}
                                </p>
                                <p className="text-[10px] text-[#8a7e6b]">{s.artist || 'Sin artista'} · {s.published ? 'Publicado' : 'Borrador'}</p>
                              </div>
                              <Switch
                                checked={s.published}
                                onCheckedChange={() => handleToggleSongPublish(s.id, s.published)}
                                className="data-[state=checked]:bg-[#8B0000]"
                              />
                              <button
                                onClick={() => handleDeleteSong(s.id)}
                                className="p-1 text-[#8a7e6b] hover:text-[#a00000] transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ─── Videos ─── */}
              <Collapsible open={openSections.videos} onOpenChange={() => toggleSection('videos')}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                  <span className="text-lg">🎬</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-sm tracking-wider flex-1 text-left">
                    Videos
                  </span>
                  <ChevronDown size={16} className={`text-[#8a7e6b] transition-transform ${openSections.videos ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pl-2 pr-1 pb-3">
                    <Input
                      ref={videoUrlRef}
                      placeholder="URL de YouTube"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Input
                      ref={videoTitleRef}
                      placeholder="Título"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddVideo}
                      disabled={!!submitting.video}
                      className="w-full bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase"
                    >
                      {submitting.video ? 'Añadiendo...' : 'Añadir Video'}
                    </Button>

                    {videos.length > 0 && (
                      <div className="space-y-2 mt-3 border-t border-[#2a2a2a] pt-3">
                        <p className="text-xs text-[#8a7e6b] font-[family-name:var(--font-cinzel)] tracking-wider uppercase">Existentes ({videos.length})</p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {videos.map((v) => (
                            <div key={v.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2a2a]">
                              <img
                                src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`}
                                alt={v.title || 'Video'}
                                className="w-14 h-10 rounded object-cover border border-[#2a2a2a]"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                                  {v.title || 'Sin título'}
                                </p>
                                <p className="text-[10px] text-[#8a7e6b]">{v.published ? 'Publicado' : 'Borrador'}</p>
                              </div>
                              <Switch
                                checked={v.published}
                                onCheckedChange={() => handleToggleVideoPublish(v.id, v.published)}
                                className="data-[state=checked]:bg-[#8B0000]"
                              />
                              <button
                                onClick={() => handleDeleteVideo(v.id)}
                                className="p-1 text-[#8a7e6b] hover:text-[#a00000] transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ─── Lienzo ─── */}
              <Collapsible open={openSections.lienzo} onOpenChange={() => toggleSection('lienzo')}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                  <span className="text-lg">🖼️</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-sm tracking-wider flex-1 text-left">
                    Lienzo
                  </span>
                  <ChevronDown size={16} className={`text-[#8a7e6b] transition-transform ${openSections.lienzo ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pl-2 pr-1 pb-3">
                    <div className="flex gap-2">
                      <Input
                        ref={canvasNameRef}
                        placeholder="Nombre del lienzo"
                        className="flex-1 bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                      />
                      <Button
                        size="sm"
                        onClick={handleCreateCanvas}
                        disabled={!!submitting.canvas}
                        className="bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase px-3"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>

                    {canvasPages.length > 0 && (
                      <div className="space-y-2 mt-3 border-t border-[#2a2a2a] pt-3">
                        <p className="text-xs text-[#8a7e6b] font-[family-name:var(--font-cinzel)] tracking-wider uppercase">Páginas ({canvasPages.length})</p>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                          {canvasPages.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] rounded border border-[#2a2a2a]">
                              <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#8a7e6b] text-sm">
                                🖼️
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-[#8a7e6b]">{p.elements?.length || 0} elementos · {p.published ? 'Publicado' : 'Borrador'}</p>
                              </div>
                              <Switch
                                checked={p.published}
                                onCheckedChange={() => handleToggleCanvasPublish(p.id, p.published)}
                                className="data-[state=checked]:bg-[#8B0000]"
                              />
                              <button
                                onClick={() => handleDeleteCanvas(p.id)}
                                className="p-1 text-[#8a7e6b] hover:text-[#a00000] transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ─── Usuarios ─── */}
              <Collapsible open={openSections.usuarios} onOpenChange={() => toggleSection('usuarios')}>
                <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors group">
                  <span className="text-lg">👥</span>
                  <span className="font-[family-name:var(--font-cinzel)] text-[#d4c5b0] text-sm tracking-wider flex-1 text-left">
                    Usuarios
                  </span>
                  <ChevronDown size={16} className={`text-[#8a7e6b] transition-transform ${openSections.usuarios ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-3 pl-2 pr-1 pb-3">
                    <p className="text-xs text-[#8a7e6b] font-[family-name:var(--font-fell)] italic">
                      Crear cuenta de observador
                    </p>
                    <Input
                      ref={userEmailRef}
                      type="email"
                      placeholder="Email"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Input
                      ref={userNameRef}
                      placeholder="Nombre"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Input
                      ref={userPasswordRef}
                      type="password"
                      placeholder="Contraseña"
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-[#d4c5b0] placeholder:text-[#5a5040] text-sm font-[family-name:var(--font-fell)]"
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateUser}
                      disabled={!!submitting.user}
                      className="w-full bg-[#2d1b3d] hover:bg-[#3d2b5d] text-[#c9a84c] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase"
                    >
                      {submitting.user ? 'Creando...' : 'Crear Usuario'}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
