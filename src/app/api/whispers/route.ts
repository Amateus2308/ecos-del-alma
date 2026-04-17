import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const whispers = await db.whisper.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ whispers });
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

    const { author, message } = await request.json();
    if (!author || !message) return NextResponse.json({ error: 'Autor y mensaje requeridos' }, { status: 400 });
    if (typeof author !== 'string' || typeof message !== 'string') return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    if (author.trim().length === 0 || author.length > 100) return NextResponse.json({ error: 'Autor debe tener entre 1 y 100 caracteres' }, { status: 400 });
    if (message.trim().length === 0 || message.length > 500) return NextResponse.json({ error: 'Mensaje debe tener entre 1 y 500 caracteres' }, { status: 400 });

    const whisper = await db.whisper.create({
      data: { author: author.trim(), message: message.trim() },
    });
    return NextResponse.json({ whisper });
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

    await db.whisper.delete({ where: { id } });
    return NextResponse.json({ message: 'Susurro eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
