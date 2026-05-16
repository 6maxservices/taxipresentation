import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const photosDir = path.join(process.cwd(), 'public/photos');
    // If public/photos doesn't exist, try root photos
    let finalDir = photosDir;
    if (!fs.existsSync(photosDir)) {
      finalDir = path.join(process.cwd(), 'photos');
    }

    if (!fs.existsSync(finalDir)) {
      return NextResponse.json({ photos: [] });
    }

    const files = fs.readdirSync(finalDir);
    const photos = files
      .filter(file => /\.(jpg|jpeg|png|webp|jfif)$/i.test(file))
      .map(file => ({
        url: `/photos/${file}`,
        name: file
      }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Failed to list photos:', error);
    return NextResponse.json({ error: 'Failed to list photos' }, { status: 500 });
  }
}
