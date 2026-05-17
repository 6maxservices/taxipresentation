import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from 'path';
import { unlink } from 'fs/promises';

const s3Client = process.env.R2_ACCESS_KEY_ID ? new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
}) : null;

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Failed to list photos:', error);
    return NextResponse.json({ error: 'Failed to list photos' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });

    // Delete from storage
    if (s3Client && process.env.R2_BUCKET_NAME && !photo.url.startsWith('/')) {
      const filename = photo.url.split('/').pop();
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: filename,
        }));
      } catch (e) {
        console.error('R2 delete failed:', e);
      }
    } else if (photo.url.startsWith('/photos/')) {
      const filePath = path.join(process.cwd(), 'public', photo.url);
      try { await unlink(filePath); } catch (e) {}
    }

    await prisma.photo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
