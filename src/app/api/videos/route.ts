import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const videos = await db.video.findMany({
      orderBy: { createdAt: 'desc' },
      where: payload.role === 'admin' ? {} : { published: true },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { youtubeUrl, title } = await request.json();

    let youtubeId = '';
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern);
      if (match) { youtubeId = match[1]; break; }
    }

    if (!youtubeId) return NextResponse.json({ error: 'URL de YouTube inválida' }, { status: 400 });

    const video = await db.video.create({
      data: { youtubeUrl, youtubeId, title: title || null, published: false },
    });
    return NextResponse.json({ video });
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

    const { id, title, published } = await request.json();
    const video = await db.video.update({
      where: { id },
      data: { ...(title !== undefined && { title }), ...(published !== undefined && { published }) },
    });
    return NextResponse.json({ video });
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

    await db.video.delete({ where: { id } });
    return NextResponse.json({ message: 'Video eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
