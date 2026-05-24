import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { url, name } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const photo = await prisma.photo.create({
      data: { url, name: name || url.split('/').pop() },
    });

    return NextResponse.json({ success: true, url: photo.url, name: photo.name, id: photo.id });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to register photo' }, { status: 500 });
  }
}
