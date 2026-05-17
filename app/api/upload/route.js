import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from '@/lib/prisma';

const s3Client = process.env.R2_ACCESS_KEY_ID ? new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
}) : null;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const filename = `${randomUUID()}${ext}`;

    let publicUrl;

    if (s3Client && process.env.R2_BUCKET_NAME) {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      }));

      publicUrl = process.env.R2_PUBLIC_DOMAIN
        ? `${process.env.R2_PUBLIC_DOMAIN}/${filename}`
        : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${filename}`;
    } else {
      // Local fallback (development only)
      const photosDir = path.join(process.cwd(), 'public/photos');
      try { await mkdir(photosDir, { recursive: true }); } catch (e) {}
      await writeFile(path.join(photosDir, filename), buffer);
      publicUrl = `/photos/${filename}`;
    }

    // Save to database so the library can list it
    const photo = await prisma.photo.create({
      data: { url: publicUrl, name: file.name || filename }
    });

    return NextResponse.json({ success: true, url: publicUrl, name: photo.name, id: photo.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
