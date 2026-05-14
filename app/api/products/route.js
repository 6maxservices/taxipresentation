import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'DAY_TOUR' or 'TRANSFER'

    let data = [];
    if (type === 'DAY_TOUR') {
      data = await prisma.tour.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      });
    } else {
      data = await prisma.transfer.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: 'asc' }
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
