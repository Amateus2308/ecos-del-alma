import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const type = formData.get('type') as string;

    if (!files || files.length === 0) return NextResponse.json({ error: 'No files' }, { status: 400 });

    const uploadDir = path.join(process.cwd(), 'upload', type === 'song' ? 'songs' : 'photos');
    await mkdir(uploadDir, { recursive: true });

    const results = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(file.name) || (type === 'song' ? '.mp3' : '.jpg');
      const uniqueName = `${uuidv4()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);

      if (type === 'photo') {
        const photo = await db.photo.create({
          data: { filename: `photos/${uniqueName}`, originalName: file.name, caption: formData.get('caption') as string || null, published: false },
        });
        results.push({ id: photo.id, type: 'photo', filename: photo.filename, originalName: photo.originalName });
      } else if (type === 'song') {
        const song = await db.song.create({
          data: { filename: `songs/${uniqueName}`, originalName: file.name, title: formData.get('title') as string || file.name.replace(/\.[^/.]+$/, ''), artist: formData.get('artist') as string || null, published: false },
        });
        results.push({ id: song.id, type: 'song', filename: song.filename, originalName: song.originalName });
      }
    }
    return NextResponse.json({ message: 'Archivos subidos', files: results });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir' }, { status: 500 });
  }
}
