import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED_COLORS = ['gold', 'rose', 'blood', 'moon'];

export async function GET() {
  try {
    const notes = await db.loveNote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ notes });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { title, message, color } = await request.json();
    if (!title || !message) return NextResponse.json({ error: 'Título y mensaje requeridos' }, { status: 400 });
    if (typeof title !== 'string' || typeof message !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 100) return NextResponse.json({ error: 'Título debe tener entre 1 y 100 caracteres' }, { status: 400 });
    if (trimmedMessage.length < 1 || trimmedMessage.length > 1000) return NextResponse.json({ error: 'Mensaje debe tener entre 1 y 1000 caracteres' }, { status: 400 });
    if (color && !ALLOWED_COLORS.includes(color)) return NextResponse.json({ error: 'Color no válido' }, { status: 400 });

    const note = await db.loveNote.create({
      data: {
        title: trimmedTitle,
        message: trimmedMessage,
        color: color || 'gold',
      },
    });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const note = await db.loveNote.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json({ note });
  } catch {
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

    await db.loveNote.delete({ where: { id } });
    return NextResponse.json({ message: 'Nota eliminada' });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
