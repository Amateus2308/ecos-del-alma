import { create } from 'zustand';

export interface Letter {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  caption: string | null;
  published: boolean;
  createdAt: string;
}

export interface Song {
  id: string;
  filename: string;
  originalName: string;
  title: string | null;
  artist: string | null;
  published: boolean;
  createdAt: string;
}

export interface Video {
  id: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string | null;
  published: boolean;
  createdAt: string;
}

export interface CanvasElement {
  id: string;
  pageId: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content: string | null;
  refId: string | null;
}

export interface CanvasPage {
  id: string;
  name: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  elements: CanvasElement[];
}

interface ContentState {
  letters: Letter[];
  photos: Photo[];
  songs: Song[];
  videos: Video[];
  canvasPages: CanvasPage[];
  loading: boolean;
  fetchAll: (token: string) => Promise<void>;
  setLetters: (letters: Letter[]) => void;
  setPhotos: (photos: Photo[]) => void;
  setSongs: (songs: Song[]) => void;
  setVideos: (videos: Video[]) => void;
  setCanvasPages: (pages: CanvasPage[]) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  letters: [],
  photos: [],
  songs: [],
  videos: [],
  canvasPages: [],
  loading: false,

  fetchAll: async (token: string) => {
    set({ loading: true });
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [lettersRes, photosRes, songsRes, videosRes, canvasRes] = await Promise.all([
        fetch('/api/letters', { headers }).then(r => r.json()),
        fetch('/api/photos', { headers }).then(r => r.json()),
        fetch('/api/songs', { headers }).then(r => r.json()),
        fetch('/api/videos', { headers }).then(r => r.json()),
        fetch('/api/canvas', { headers }).then(r => r.json()),
      ]);
      set({
        letters: lettersRes.letters || [],
        photos: photosRes.photos || [],
        songs: songsRes.songs || [],
        videos: videosRes.videos || [],
        canvasPages: canvasRes.pages || [],
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  setLetters: (letters) => set({ letters }),
  setPhotos: (photos) => set({ photos }),
  setSongs: (songs) => set({ songs }),
  setVideos: (videos) => set({ videos }),
  setCanvasPages: (pages) => set({ canvasPages: pages }),
}));
