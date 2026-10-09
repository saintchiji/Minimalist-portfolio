import { NextRequest, NextResponse } from 'next/server';
import { validateVideo, VIDEO_PROVIDERS_IN_ORDER } from '@/lib/video-providers';
import { VideoSource } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, source } = body as { url: string; source?: VideoSource };

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        {
          valid: false,
          warning: 'URL is required for validation.',
          providers: VIDEO_PROVIDERS_IN_ORDER.map((p) => ({
            id: p.id,
            name: p.name,
            order: p.order,
            description: p.description,
          })),
        },
        { status: 400 }
      );
    }

    const result = validateVideo(url, source);

    return NextResponse.json({
      ...result,
      providers: VIDEO_PROVIDERS_IN_ORDER.map((p) => ({
        id: p.id,
        name: p.name,
        order: p.order,
        description: p.description,
      })),
    });
  } catch (error) {
    console.error('Video validation API error:', error);
    return NextResponse.json({ error: 'Failed to validate video URL' }, { status: 500 });
  }
}
