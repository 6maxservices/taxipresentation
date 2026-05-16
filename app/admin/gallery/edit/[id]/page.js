import AlbumForm from '../../AlbumForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditAlbumPage({ params }) {
  const { id } = params;
  
  const [album, tours, transfers] = await Promise.all([
    prisma.galleryAlbum.findUnique({
      where: { id },
      include: { photos: { orderBy: { sortOrder: 'asc' } } }
    }),
    prisma.tour.findMany({ select: { id: true, title: true } }),
    prisma.transfer.findMany({ select: { id: true, title: true } })
  ]);

  if (!album) notFound();

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Edit Collection: {album.title}</h1>
      </div>
      <AlbumForm album={album} tours={tours} transfers={transfers} />
    </div>
  );
}
