import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TourForm from '../../TourForm';

export const metadata = {
  title: 'Edit Tour | Admin',
};

export default async function EditTourPage({ params }) {
  const { id } = await params;
  
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: 'asc' } } }
  });

  if (!tour) {
    notFound();
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="admin-header">
        <h1 className="font-serif">Edit Tour</h1>
      </div>
      <TourForm tour={tour} />
    </div>
  );
}
