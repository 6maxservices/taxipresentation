import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const settings = await prisma.globalSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = JSON.parse(curr.value);
      return acc;
    }, {});
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await req.json();
    
    const setting = await prisma.globalSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error('Failed to save setting:', error);
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}
