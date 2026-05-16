import AlbumForm from '../AlbumForm';
import { prisma } from '@/lib/prisma';

export default async function NewAlbumPage() {
  const tours = await prisma.tour.findMany({ select: { id: true, title: true } });
  const transfers = await prisma.transfer.findMany({ select: { id: true, title: true } });

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Create New Collection</h1>
      </div>
      <AlbumForm tours={tours} transfers={transfers} />
    </div>
  );
}
