import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function GalleryAdmin() {
  const albums = await prisma.galleryAlbum.findMany({
    include: {
      _count: {
        select: { photos: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Gallery Collections</h1>
        <Link href="/admin/gallery/new" className="btn btn-primary">Create New Collection</Link>
      </div>

      <div className="admin-grid">
        {albums.map((album) => (
          <div key={album.id} className="admin-card">
            <h3 className="font-serif">{album.title}</h3>
            <p className="text-small" style={{ margin: '0.5rem 0' }}>
              {album._count.photos} photos • {album.isPublic ? 'Public' : 'Private'}
              {album.isTrip && ' • Client Trip'}
            </p>
            <div className="admin-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Link href={`/admin/gallery/edit/${album.id}`} className="btn btn-outline btn-small">Edit</Link>
              <Link href={`/gallery/${album.slug}`} target="_blank" className="btn btn-outline btn-small">View Live</Link>
            </div>
          </div>
        ))}
      </div>

      {albums.length === 0 && (
        <div className="admin-card text-center" style={{ padding: '3rem' }}>
          <p>No gallery collections found. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
