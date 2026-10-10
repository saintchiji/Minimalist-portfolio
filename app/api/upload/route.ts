import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { addMediaItem } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const origName = file.name || 'uploaded_media';
    const ext = path.extname(origName).toLowerCase();
    const cleanBaseName = path
      .basename(origName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);

    const filename = `${Date.now()}-${cleanBaseName}${ext}`;
    let publicUrl = '';
    const isVideo = /\.(mp4|webm|mov|m4v|ogg)$/i.test(ext);
    const contentType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

    // 1. Try remote cloud storage if configured
    try {
      const { uploadRemoteMedia } = await import('@/lib/storage');
      const remoteUrl = await uploadRemoteMedia(buffer, `${cleanBaseName}${ext}`, contentType);
      if (remoteUrl) {
        publicUrl = remoteUrl;
      }
    } catch {}

    // 2. Fall back to local uploads directory or serverless /tmp
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        publicUrl = `/uploads/${filename}`;
      } catch {
        // Fallback for Vercel lambda /tmp directory
        const tmpDir = path.join('/tmp', 'uploads');
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        const tmpFilePath = path.join(tmpDir, filename);
        fs.writeFileSync(tmpFilePath, buffer);
        // Base64 data URI fallback if completely serverless without S3
        publicUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
      }
    }

    const mediaRecord = addMediaItem({
      filename: origName,
      url: publicUrl,
      type: isVideo ? 'video' : 'image',
      size: file.size,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: mediaRecord,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}
