import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function GET() {
  const config = {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID ? '✅ set' : '❌ missing',
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ? `✅ ${process.env.R2_BUCKET_NAME}` : '❌ missing',
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? `✅ ${process.env.R2_ACCESS_KEY_ID.slice(0, 6)}...` : '❌ missing',
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? '✅ set' : '❌ missing',
    R2_PUBLIC_DOMAIN: process.env.R2_PUBLIC_DOMAIN || '❌ missing',
  };

  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_BUCKET_NAME) {
    return NextResponse.json({ config, writeTest: 'skipped - missing env vars' });
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'debug-test.txt',
      Body: Buffer.from('test'),
      ContentType: 'text/plain',
    }));

    const testUrl = `${process.env.R2_PUBLIC_DOMAIN}/debug-test.txt`;

    // Clean up
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'debug-test.txt',
    }));

    return NextResponse.json({ config, writeTest: '✅ success', testUrl });
  } catch (err) {
    return NextResponse.json({ config, writeTest: `❌ FAILED: ${err.message}` });
  }
}
