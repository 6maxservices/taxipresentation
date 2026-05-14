import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'DAY_TOUR') {
      const data = await prisma.tour.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      });
      return NextResponse.json({ success: true, tours: data });
    } else if (type === 'TRANSFER') {
      const data = await prisma.transfer.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      });
      return NextResponse.json({ success: true, transfers: data });
    }

    // Default: fetch both
    const [tours, transfers] = await Promise.all([
      prisma.tour.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.transfer.findMany({
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
