import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

const ALLOWED_MOODS = ['místico', 'romántico', 'melancólico', 'esperanzador', 'inquietante'];

export async function GET() {
  try {
    const entries = await db.dreamJournal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ entries });
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

    const { title, content, mood } = await request.json();
    if (!title || !content) return NextResponse.json({ error: 'Título y contenido requeridos' }, { status: 400 });
    if (typeof title !== 'string' || typeof content !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 200) return NextResponse.json({ error: 'Título debe tener entre 1 y 200 caracteres' }, { status: 400 });
    if (trimmedContent.length < 1 || trimmedContent.length > 5000) return NextResponse.json({ error: 'Contenido debe tener entre 1 y 5000 caracteres' }, { status: 400 });
    if (mood && !ALLOWED_MOODS.includes(mood)) return NextResponse.json({ error: 'Estado de ánimo no válido' }, { status: 400 });

    const entry = await db.dreamJournal.create({
      data: {
        title: trimmedTitle,
        content: trimmedContent,
        mood: mood || 'místico',
      },
    });
    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Solo admin' }, { status: 403 });

    const { id, title, content, mood, isFavorite } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const updateData: Record<string, string | boolean> = {};
    if (title !== undefined) {
      if (typeof title !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
      const trimmedTitle = title.trim();
      if (trimmedTitle.length < 1 || trimmedTitle.length > 200) return NextResponse.json({ error: 'Título debe tener entre 1 y 200 caracteres' }, { status: 400 });
      updateData.title = trimmedTitle;
    }
    if (content !== undefined) {
      if (typeof content !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
      const trimmedContent = content.trim();
      if (trimmedContent.length < 1 || trimmedContent.length > 5000) return NextResponse.json({ error: 'Contenido debe tener entre 1 y 5000 caracteres' }, { status: 400 });
      updateData.content = trimmedContent;
    }
    if (mood !== undefined) {
      if (!ALLOWED_MOODS.includes(mood)) return NextResponse.json({ error: 'Estado de ánimo no válido' }, { status: 400 });
      updateData.mood = mood;
    }
    if (isFavorite !== undefined) {
      updateData.isFavorite = Boolean(isFavorite);
    }

    const entry = await db.dreamJournal.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ entry });
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

    await db.dreamJournal.delete({ where: { id } });
    return NextResponse.json({ message: 'Sueño eliminado' });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
