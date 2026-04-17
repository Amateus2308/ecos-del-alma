'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X,
  Type,
  Image as ImageIcon,
  Mail,
  Play,
  Music,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CanvasElement, Photo, Letter, Video, Song } from '@/store/content';

interface CanvasEditorProps {
  page: {
    id: string;
    name: string;
    elements: CanvasElement[];
  };
  token: string;
  onSave: (page: any) => void;
  onClose: () => void;
  allPhotos: Photo[];
  allLetters: Letter[];
  allVideos: Video[];
  allSongs: Song[];
}

type HandlePosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'rotation';

interface DragState {
  type: 'move' | 'resize' | 'rotate';
  elementId: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  origRotation: number;
  handle?: HandlePosition;
}

const CANVAS_W = 3000;
const CANVAS_H = 2000;

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={14} />,
  photo: <ImageIcon size={14} />,
  letter: <Mail size={14} />,
  video: <Play size={14} />,
  song: <Music size={14} />,
};

export default function CanvasEditor({
  page,
  token,
  onSave,
  onClose,
  allPhotos,
  allLetters,
  allVideos,
  allSongs,
}: CanvasEditorProps) {
  const [elements, setElements] = useState<CanvasElement[]>(page.elements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addingType, setAddingType] = useState<string | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // Prevent text selection while dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) e.preventDefault();
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const generateId = () => `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId]
  );

  const bringForward = useCallback((id: string) => {
    setElements((prev) => {
      const maxZ = Math.max(...prev.map((el) => el.zIndex), 0);
      return prev.map((el) => (el.id === id ? { ...el, zIndex: maxZ + 1 } : el));
    });
  }, []);

  const sendBackward = useCallback((id: string) => {
    setElements((prev) => {
      const minZ = Math.min(...prev.map((el) => el.zIndex), 0);
      return prev.map((el) => (el.id === id ? { ...el, zIndex: minZ - 1 } : el));
    });
  }, []);

  // ─── Add Element Handlers ───
  const addTextElement = () => {
    const newEl: CanvasElement = {
      id: generateId(),
      pageId: page.id,
      type: 'text',
      x: CANVAS_W / 2 - 150,
      y: CANVAS_H / 2 - 50,
      width: 300,
      height: 100,
      rotation: 0,
      zIndex: Math.max(0, ...elements.map((e) => e.zIndex)) + 1,
      content: 'Escribe aquí...',
      refId: null,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
    setAddingType(null);
  };

  const addPhotoElement = (photo: Photo) => {
    const newEl: CanvasElement = {
      id: generateId(),
      pageId: page.id,
      type: 'photo',
      x: CANVAS_W / 2 - 150,
      y: CANVAS_H / 2 - 112,
      width: 300,
      height: 225,
      rotation: 0,
      zIndex: Math.max(0, ...elements.map((e) => e.zIndex)) + 1,
      content: null,
      refId: photo.id,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
    setAddingType(null);
  };

  const addLetterElement = (letter: Letter) => {
    const newEl: CanvasElement = {
      id: generateId(),
      pageId: page.id,
      type: 'letter',
      x: CANVAS_W / 2 - 175,
      y: CANVAS_H / 2 - 150,
      width: 350,
      height: 300,
      rotation: 0,
      zIndex: Math.max(0, ...elements.map((e) => e.zIndex)) + 1,
      content: letter.content,
      refId: letter.id,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
    setAddingType(null);
  };

  const addVideoElement = (video: Video) => {
    const newEl: CanvasElement = {
      id: generateId(),
      pageId: page.id,
      type: 'video',
      x: CANVAS_W / 2 - 200,
      y: CANVAS_H / 2 - 112,
      width: 400,
      height: 225,
      rotation: 0,
      zIndex: Math.max(0, ...elements.map((e) => e.zIndex)) + 1,
      content: null,
      refId: video.id,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
    setAddingType(null);
  };

  const addSongElement = (song: Song) => {
    const newEl: CanvasElement = {
      id: generateId(),
      pageId: page.id,
      type: 'song',
      x: CANVAS_W / 2 - 150,
      y: CANVAS_H / 2 - 40,
      width: 300,
      height: 80,
      rotation: 0,
      zIndex: Math.max(0, ...elements.map((e) => e.zIndex)) + 1,
      content: null,
      refId: song.id,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
    setAddingType(null);
  };

  // ─── Mouse Handlers ───
  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      // Don't start drag if clicking on text editing area
      if ((e.target as HTMLElement).contentEditable === 'true') return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedId(elementId);

      const el = elements.find((el) => el.id === elementId);
      if (!el) return;

      const container = containerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const scrollTop = container.scrollTop;

      dragRef.current = {
        type: 'move',
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        origW: el.width,
        origH: el.height,
        origRotation: el.rotation,
      };

      const handleMove = (me: MouseEvent) => {
        if (!dragRef.current || dragRef.current.type !== 'move') return;
        const dx = me.clientX - dragRef.current.startX;
        const dy = me.clientY - dragRef.current.startY;
        updateElement(dragRef.current.elementId, {
          x: dragRef.current.origX + dx,
          y: dragRef.current.origY + dy,
        });
      };

      const handleUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [elements, updateElement]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string, handle: HandlePosition) => {
      e.stopPropagation();
      e.preventDefault();

      const el = elements.find((el) => el.id === elementId);
      if (!el) return;

      dragRef.current = {
        type: 'resize',
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        origW: el.width,
        origH: el.height,
        origRotation: el.rotation,
        handle,
      };

      const handleMove = (me: MouseEvent) => {
        if (!dragRef.current || dragRef.current.type !== 'resize') return;
        const dx = me.clientX - dragRef.current.startX;
        const dy = me.clientY - dragRef.current.startY;
        const h = dragRef.current.handle!;

        let newX = dragRef.current.origX;
        let newY = dragRef.current.origY;
        let newW = dragRef.current.origW;
        let newH = dragRef.current.origH;

        // Resize based on handle position
        if (h.includes('right')) newW = Math.max(40, dragRef.current.origW + dx);
        if (h.includes('left')) {
          newW = Math.max(40, dragRef.current.origW - dx);
          newX = dragRef.current.origX + dragRef.current.origW - newW;
        }
        if (h.includes('bottom')) newH = Math.max(40, dragRef.current.origH + dy);
        if (h.includes('top')) {
          newH = Math.max(40, dragRef.current.origH - dy);
          newY = dragRef.current.origY + dragRef.current.origH - newH;
        }

        updateElement(dragRef.current.elementId, {
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        });
      };

      const handleUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [elements, updateElement]
  );

  const handleRotationMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      e.preventDefault();

      const el = elements.find((el) => el.id === elementId);
      if (!el) return;

      const elRect = (e.currentTarget.closest('.canvas-element') as HTMLElement)?.getBoundingClientRect();
      if (!elRect) return;

      const centerX = elRect.left + elRect.width / 2;
      const centerY = elRect.top + elRect.height / 2;

      const initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const startRotation = el.rotation;

      dragRef.current = {
        type: 'rotate',
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        origW: el.width,
        origH: el.height,
        origRotation: startRotation,
      };

      const handleMove = (me: MouseEvent) => {
        if (!dragRef.current || dragRef.current.type !== 'rotate') return;
        const angle = Math.atan2(me.clientY - centerY, me.clientX - centerX);
        const delta = (angle - initialAngle) * (180 / Math.PI);
        updateElement(dragRef.current.elementId, {
          rotation: dragRef.current.origRotation + delta,
        });
      };

      const handleUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [elements, updateElement]
  );

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset?.canvas === 'true') {
      setSelectedId(null);
      setAddingType(null);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't delete if editing text
        if ((e.target as HTMLElement).contentEditable === 'true') return;
        if (selectedId) {
          e.preventDefault();
          deleteElement(selectedId);
        }
      }
      if (e.key === 'Escape') {
        setSelectedId(null);
        setAddingType(null);
      }
    },
    [selectedId, deleteElement]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ─── Save ───
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/canvas', {
        method: 'PUT',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id, elements }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || 'Error al guardar');
        return;
      }
      const data = await res.json();
      toast.success('Lienzo guardado');
      onSave(data.page);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  // ─── Element Render ───
  const renderElementContent = (el: CanvasElement) => {
    switch (el.type) {
      case 'text':
        return (
          <div
            contentEditable
            suppressContentEditableWarning
            className="w-full h-full outline-none p-2 text-sm font-[family-name:var(--font-fell)] text-[#d4c5b0] whitespace-pre-wrap overflow-hidden"
            style={{ color: '#d4c5b0' }}
            onBlur={(e) => {
              updateElement(el.id, { content: e.currentTarget.textContent || '' });
            }}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).contentEditable === 'true') {
                e.stopPropagation();
              }
            }}
          >
            {el.content || ''}
          </div>
        );
      case 'photo': {
        const photo = allPhotos.find((p) => p.id === el.refId);
        if (!photo) return <div className="flex items-center justify-center text-[#8a7e6b] text-sm">Foto no encontrada</div>;
        return (
          <img
            src={`/api/upload/files/${photo.filename}`}
            alt={photo.caption || photo.originalName}
            className="w-full h-full object-cover rounded pointer-events-none"
            draggable={false}
          />
        );
      }
      case 'letter': {
        const letter = allLetters.find((l) => l.id === el.refId);
        if (!letter) return <div className="flex items-center justify-center text-[#8a7e6b] text-sm">Carta no encontrada</div>;
        return (
          <div className="p-3 overflow-hidden h-full">
            <h4 className="font-[family-name:var(--font-cinzel-decorative)] text-[#c9a84c] text-xs mb-2 truncate">{letter.title}</h4>
            <p className="font-[family-name:var(--font-typewriter)] text-[#c4b59a] text-xs leading-relaxed line-clamp-[12]">
              {letter.content}
            </p>
          </div>
        );
      }
      case 'video': {
        const video = allVideos.find((v) => v.id === el.refId);
        if (!video) return <div className="flex items-center justify-center text-[#8a7e6b] text-sm">Video no encontrado</div>;
        return (
          <div className="w-full h-full relative rounded overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title || 'Video'}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-[#8B0000]/90 flex items-center justify-center">
                <Play size={20} className="text-[#d4c5b0] ml-0.5" fill="#d4c5b0" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60">
              <p className="text-xs text-[#d4c5b0] font-[family-name:var(--font-fell)] truncate">{video.title || 'Video'}</p>
            </div>
          </div>
        );
      }
      case 'song': {
        const song = allSongs.find((s) => s.id === el.refId);
        if (!song) return <div className="flex items-center justify-center text-[#8a7e6b] text-sm">Canción no encontrada</div>;
        return (
          <div className="flex items-center gap-3 p-3 h-full bg-[#1a1a1a] rounded border border-[#2a2a2a]">
            <div className="w-10 h-10 rounded bg-[#8B0000]/20 flex items-center justify-center shrink-0">
              <Music size={16} className="text-[#c9a84c]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#d4c5b0] font-[family-name:var(--font-fell)] truncate">{song.title || song.originalName}</p>
              <p className="text-xs text-[#8a7e6b] truncate">{song.artist || 'Sin artista'}</p>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const resizeHandles: { pos: HandlePosition; style: string }[] = [
    { pos: 'top-left', style: 'top-[-5px] left-[-5px] cursor-nw-resize' },
    { pos: 'top', style: 'top-[-5px] left-1/2 -translate-x-1/2 cursor-n-resize' },
    { pos: 'top-right', style: 'top-[-5px] right-[-5px] cursor-ne-resize' },
    { pos: 'right', style: 'top-1/2 -translate-y-1/2 right-[-5px] cursor-e-resize' },
    { pos: 'bottom-right', style: 'bottom-[-5px] right-[-5px] cursor-se-resize' },
    { pos: 'bottom', style: 'bottom-[-5px] left-1/2 -translate-x-1/2 cursor-s-resize' },
    { pos: 'bottom-left', style: 'bottom-[-5px] left-[-5px] cursor-sw-resize' },
    { pos: 'left', style: 'top-1/2 -translate-y-1/2 left-[-5px] cursor-w-resize' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
      >
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#111111] border-b border-[#2a2a2a] shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-sm tracking-widest uppercase">
              {page.name}
            </h2>
            {selectedElement && (
              <>
                <div className="w-px h-5 bg-[#2a2a2a]" />
                <span className="text-xs text-[#8a7e6b] font-[family-name:var(--font-fell)] flex items-center gap-1.5">
                  {ELEMENT_ICONS[selectedElement.type] || null}
                  <span className="capitalize">{selectedElement.type}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedElement && (
              <>
                <button
                  onClick={() => bringForward(selectedId!)}
                  className="p-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-colors"
                  title="Traer al frente"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => sendBackward(selectedId!)}
                  className="p-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-colors"
                  title="Enviar atrás"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => deleteElement(selectedId!)}
                  className="p-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#a00000] hover:border-[#a00000]/30 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
                <div className="w-px h-5 bg-[#2a2a2a] mx-1" />
              </>
            )}

            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] font-[family-name:var(--font-cinzel)] text-xs tracking-widest uppercase"
            >
              <Save size={14} />
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#8a7e6b] hover:text-[#d4c5b0] hover:border-[#d4c5b0]/30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-56 bg-[#111111] border-r border-[#2a2a2a] p-3 flex flex-col gap-2 shrink-0 overflow-y-auto">
            <p className="font-[family-name:var(--font-cinzel)] text-[#c9a84c] text-xs tracking-widest uppercase mb-1">
              Añadir Elemento
            </p>

            <button
              onClick={() => setAddingType(addingType === 'text' ? null : 'text')}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                addingType === 'text'
                  ? 'bg-[#8B0000]/20 border-[#8B0000] text-[#c9a84c]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#d4c5b0] hover:border-[#c9a84c]/30'
              }`}
            >
              <Type size={14} />
              <span className="font-[family-name:var(--font-fell)]">Texto</span>
            </button>

            <button
              onClick={() => setAddingType(addingType === 'photo' ? null : 'photo')}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                addingType === 'photo'
                  ? 'bg-[#8B0000]/20 border-[#8B0000] text-[#c9a84c]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#d4c5b0] hover:border-[#c9a84c]/30'
              }`}
            >
              <ImageIcon size={14} />
              <span className="font-[family-name:var(--font-fell)]">Foto</span>
            </button>

            <button
              onClick={() => setAddingType(addingType === 'letter' ? null : 'letter')}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                addingType === 'letter'
                  ? 'bg-[#8B0000]/20 border-[#8B0000] text-[#c9a84c]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#d4c5b0] hover:border-[#c9a84c]/30'
              }`}
            >
              <Mail size={14} />
              <span className="font-[family-name:var(--font-fell)]">Carta</span>
            </button>

            <button
              onClick={() => setAddingType(addingType === 'video' ? null : 'video')}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                addingType === 'video'
                  ? 'bg-[#8B0000]/20 border-[#8B0000] text-[#c9a84c]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#d4c5b0] hover:border-[#c9a84c]/30'
              }`}
            >
              <Play size={14} />
              <span className="font-[family-name:var(--font-fell)]">Video</span>
            </button>

            <button
              onClick={() => setAddingType(addingType === 'song' ? null : 'song')}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-colors ${
                addingType === 'song'
                  ? 'bg-[#8B0000]/20 border-[#8B0000] text-[#c9a84c]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#d4c5b0] hover:border-[#c9a84c]/30'
              }`}
            >
              <Music size={14} />
              <span className="font-[family-name:var(--font-fell)]">Canción</span>
            </button>

            {/* Picker panels */}
            {addingType === 'text' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-[#2a2a2a] pt-2"
              >
                <button
                  onClick={addTextElement}
                  className="w-full px-3 py-2 bg-[#8B0000] hover:bg-[#a00000] text-[#d4c5b0] rounded text-sm font-[family-name:var(--font-cinzel)] tracking-wider uppercase transition-colors"
                >
                  + Añadir Texto
                </button>
              </motion.div>
            )}

            {addingType === 'photo' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-[#2a2a2a] pt-2 space-y-1 max-h-48 overflow-y-auto"
              >
                <p className="text-[10px] text-[#8a7e6b] uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                  Seleccionar foto
                </p>
                {allPhotos.length === 0 && (
                  <p className="text-xs text-[#8a7e6b] italic">No hay fotos disponibles</p>
                )}
                {allPhotos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addPhotoElement(p)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors text-left"
                  >
                    <img
                      src={`/api/upload/files/${p.filename}`}
                      alt={p.caption || ''}
                      className="w-8 h-8 rounded object-cover border border-[#2a2a2a]"
                    />
                    <span className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                      {p.caption || p.originalName}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {addingType === 'letter' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-[#2a2a2a] pt-2 space-y-1 max-h-48 overflow-y-auto"
              >
                <p className="text-[10px] text-[#8a7e6b] uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                  Seleccionar carta
                </p>
                {allLetters.length === 0 && (
                  <p className="text-xs text-[#8a7e6b] italic">No hay cartas disponibles</p>
                )}
                {allLetters.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => addLetterElement(l)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded bg-[#1a1611] border border-[#2a2a2a] flex items-center justify-center text-[#c9a84c] text-xs shrink-0">
                      ✉
                    </div>
                    <span className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                      {l.title}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {addingType === 'video' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-[#2a2a2a] pt-2 space-y-1 max-h-48 overflow-y-auto"
              >
                <p className="text-[10px] text-[#8a7e6b] uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                  Seleccionar video
                </p>
                {allVideos.length === 0 && (
                  <p className="text-xs text-[#8a7e6b] italic">No hay videos disponibles</p>
                )}
                {allVideos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => addVideoElement(v)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors text-left"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`}
                      alt=""
                      className="w-8 h-6 rounded object-cover border border-[#2a2a2a]"
                    />
                    <span className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                      {v.title || 'Sin título'}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {addingType === 'song' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-[#2a2a2a] pt-2 space-y-1 max-h-48 overflow-y-auto"
              >
                <p className="text-[10px] text-[#8a7e6b] uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                  Seleccionar canción
                </p>
                {allSongs.length === 0 && (
                  <p className="text-xs text-[#8a7e6b] italic">No hay canciones disponibles</p>
                )}
                {allSongs.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => addSongElement(s)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded bg-[#2d1b3d] border border-[#2a2a2a] flex items-center justify-center text-[#c9a84c] shrink-0">
                      <Music size={12} />
                    </div>
                    <span className="text-xs text-[#d4c5b0] truncate font-[family-name:var(--font-fell)]">
                      {s.title || s.originalName}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Element count */}
            <div className="mt-auto pt-3 border-t border-[#2a2a2a]">
              <p className="text-[10px] text-[#8a7e6b] font-[family-name:var(--font-fell)]">
                {elements.length} elemento{elements.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto relative"
            style={{
              background: '#0a0a0a',
            }}
          >
            <div
              ref={canvasRef}
              data-canvas="true"
              onMouseDown={handleCanvasMouseDown}
              className="relative mx-auto"
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                minWidth: CANVAS_W,
                minHeight: CANVAS_H,
                background:
                  'radial-gradient(circle, #2a2a2a 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              {/* Center guides */}
              <div
                className="absolute pointer-events-none"
                style={{ left: CANVAS_W / 2, top: 0, width: 1, height: CANVAS_H, background: 'rgba(139, 0, 0, 0.1)' }}
              />
              <div
                className="absolute pointer-events-none"
                style={{ top: CANVAS_H / 2, left: 0, height: 1, width: CANVAS_W, background: 'rgba(139, 0, 0, 0.1)' }}
              />

              {/* Elements */}
              {[...elements].sort((a, b) => a.zIndex - b.zIndex).map((el) => {
                const isSelected = el.id === selectedId;
                return (
                  <div
                    key={el.id}
                    className={`canvas-element absolute ${
                      el.type === 'text'
                        ? 'bg-transparent border border-dashed border-[#2a2a2a]'
                        : el.type === 'photo'
                        ? 'bg-[#1a1a1a] rounded overflow-hidden border border-[#2a2a2a]'
                        : el.type === 'letter'
                        ? 'paper-texture rounded border border-[#2a2a2a]'
                        : el.type === 'video'
                        ? 'rounded overflow-hidden border border-[#2a2a2a]'
                        : 'rounded border border-[#2a2a2a]'
                    } ${isSelected ? '' : 'hover:outline hover:outline-1 hover:outline-[#c9a84c]/20'}`}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                      transform: `rotate(${el.rotation}deg)`,
                      zIndex: el.zIndex,
                      outline: isSelected ? '2px solid #c9a84c' : undefined,
                      outlineOffset: '2px',
                    }}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                  >
                    {renderElementContent(el)}

                    {/* Type icon on hover */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="p-0.5 bg-[#0a0a0a]/80 rounded text-[#c9a84c]">
                        {ELEMENT_ICONS[el.type]}
                      </div>
                    </div>

                    {/* Selection controls */}
                    {isSelected && (
                      <>
                        {/* Resize handles */}
                        {resizeHandles.map(({ pos, style }) => (
                          <div
                            key={pos}
                            className={`absolute w-2.5 h-2.5 bg-[#c9a84c] border border-[#8B0000] rounded-sm ${style} z-10`}
                            onMouseDown={(e) => handleResizeMouseDown(e, el.id, pos)}
                          />
                        ))}

                        {/* Rotation handle */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                          style={{ top: -35 }}
                          onMouseDown={(e) => handleRotationMouseDown(e, el.id)}
                        >
                          <div className="w-4 h-4 rounded-full bg-[#8B0000] border-2 border-[#c9a84c] cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-lg shadow-[#8B0000]/30" />
                          <div className="w-px h-5 bg-[#c9a84c]/60" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
