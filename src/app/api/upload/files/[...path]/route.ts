import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync, existsSync } from 'fs';
import { join } from 'path';

// Sirve archivos estáticos desde la carpeta /upload
// Next.js no sirve esta carpeta automáticamente porque no está en /public

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), 'upload', ...path);

    // Seguridad: evitar path traversal
    const resolvedPath = join(process.cwd(), 'upload');
    if (!filePath.startsWith(resolvedPath)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const stat = statSync(filePath);

    // Determinar content-type basado en la extensión
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
      'gif': 'image/gif', 'webp': 'image/webp', 'svg': 'image/svg+xml',
      'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
      'mp4': 'video/mp4', 'webm': 'video/webm',
    };

    const readable = new ReadableStream({
      start(controller) {
        const stream = createReadStream(filePath);
        stream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json({ error: 'Error serving file' }, { status: 500 });
  }
}
