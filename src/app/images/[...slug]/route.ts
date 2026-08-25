import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> | { slug: string[] } }
) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  if (!slug || slug.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Prevent directory traversal attacks
  const safePath = slug.map((segment) => path.basename(segment)).join('/');
  
  // Possible locations where images might be stored across local, Docker, standalone, Cloud Run
  const searchDirs = [
    path.join(process.cwd(), 'public/images'),
    path.join(process.cwd(), 'images'),
    path.join(process.cwd(), '.next/standalone/public/images'),
    path.join(process.cwd(), 'src/public/images'),
    path.resolve(__dirname, '../../../../public/images'),
    path.resolve(__dirname, '../../../../images'),
  ];

  let targetFile: string | null = null;
  for (const dir of searchDirs) {
    const fullPath = path.join(dir, safePath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      targetFile = fullPath;
      break;
    }
  }

  if (!targetFile) {
    return new NextResponse('Image Not Found', { status: 404 });
  }

  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const fileBuffer = fs.readFileSync(targetFile);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
