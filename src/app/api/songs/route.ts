import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const songs = await db.song.findMany({
      orderBy: { createdAt: 'desc' },
      where: payload.role === 'admin' ? {} : { published: true },
    });
    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { id, title, artist, published } = await request.json();
    const song = await db.song.update({
      where: { id },
      data: { ...(title !== undefined && { title }), ...(artist !== undefined && { artist }), ...(published !== undefined && { published }) },
    });
    return NextResponse.json({ song });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const song = await db.song.findUnique({ where: { id } });
    if (song) {
      try { await unlink(path.join(process.cwd(), 'upload', song.filename)); } catch {}
      await db.song.delete({ where: { id } });
    }
    return NextResponse.json({ message: 'Canción eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
