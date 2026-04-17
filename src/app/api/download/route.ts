import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync, existsSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const filePath = '/tmp/ecos-download.tar.gz';

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const stat = statSync(filePath);

    const readable = new ReadableStream({
      start(controller) {
        const stream = createReadStream(filePath);
        stream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        stream.on('end', () => {
          controller.close();
        });
        stream.on('error', (err) => {
          controller.error(err);
        });
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': 'attachment; filename="ecos-del-alma-project.tar.gz"',
        'Content-Length': stat.size.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
