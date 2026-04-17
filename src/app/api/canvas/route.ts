import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const pages = await db.canvasPage.findMany({
      orderBy: { createdAt: 'desc' },
      where: payload.role === 'admin' ? {} : { published: true },
      include: { elements: { orderBy: { zIndex: 'asc' } } },
    });
    return NextResponse.json({ pages });
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

    const { name } = await request.json();
    const page = await db.canvasPage.create({ data: { name: name || 'Sin título' } });
    return NextResponse.json({ page });
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

    const { id, name, published, elements } = await request.json();

    if (elements && Array.isArray(elements)) {
      // Delete existing elements and recreate
      await db.canvasElement.deleteMany({ where: { pageId: id } });
      for (const el of elements) {
        await db.canvasElement.create({
          data: {
            pageId: id,
            type: el.type,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation || 0,
            zIndex: el.zIndex || 1,
            content: el.content || null,
            refId: el.refId || null,
          },
        });
      }
    }

    const page = await db.canvasPage.update({
      where: { id },
      data: { ...(name !== undefined && { name }), ...(published !== undefined && { published }) },
      include: { elements: { orderBy: { zIndex: 'asc' } } },
    });
    return NextResponse.json({ page });
  } catch (error) {
    console.error('Canvas error:', error);
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

    await db.canvasPage.delete({ where: { id } });
    return NextResponse.json({ message: 'Página eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
