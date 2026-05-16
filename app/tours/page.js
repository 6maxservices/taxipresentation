import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import './page.css';

async function getTours() {
  return await prisma.tour.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: { photos: true },
  });
}

export const metadata = {
  title: "Tours | Discover Greece with George",
  description: "Private, hand-crafted tours in Athens and across Greece.",
};

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <div className="tours-page page-container">
      <div className="container">
        <header className="page-header text-center">
          <h1 className="font-serif">Private Tours</h1>
          <p className="page-subtitle">Discover the beauty of Greece at your own pace. All tours are private and fully customizable.</p>
        </header>

        <div className="catalog-grid">
          {tours.map(tour => (
            <Link href={`/tours/${tour.slug}`} key={tour.id} className="catalog-card">
              <div className="catalog-card-image">
                {tour.photos && tour.photos.length > 0 ? (
                  <Image 
                    src={tour.photos[0].url} 
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>
              <div className="catalog-card-content">
                <h2 className="catalog-card-title">{tour.title}</h2>
                <p className="catalog-card-desc">{tour.shortDesc}</p>
                
                <div className="catalog-card-meta">
                  <div className="meta-item">
                    <span className="meta-label">Duration</span>
                    <span className="meta-value">{tour.duration}</span>
                  </div>
                </div>
                
                <div className="catalog-card-footer">
                  <span className="btn btn-outline" style={{ width: '100%' }}>View Details & Quote</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="custom-tour-cta text-center editorial-section">
          <h2 className="font-serif">Looking for something else?</h2>
          <p>I can create a fully custom itinerary based on your interests.</p>
          <Link href="/book?type=custom" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Request Custom Tour</Link>
        </div>
      </div>
    </div>
  );
}
