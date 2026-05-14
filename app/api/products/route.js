import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [tours, transfers] = await Promise.all([
      prisma.tour.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.prismaTransfer.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      })
    ]);

    return NextResponse.json({ tours, transfers });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
