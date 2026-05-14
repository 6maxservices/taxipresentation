import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import './tour-detail.css';

async function getTour(slug) {
  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: { photos: { orderBy: { sortOrder: 'asc' } } },
  });
  
  if (!tour) return null;
  
  return {
    ...tour,
    highlights: JSON.parse(tour.highlights),
    included: JSON.parse(tour.included),
    excluded: JSON.parse(tour.excluded),
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = await prisma.tour.findUnique({ where: { slug } });
  if (!tour) return { title: 'Tour Not Found' };
  
  return {
    title: `${tour.title} | George Tours`,
    description: tour.shortDesc,
  };
}

export default async function TourDetail({ params }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  
  if (!tour) {
    notFound();
  }

  return (
    <div className="tour-detail-page">
      {/* Tour Hero */}
      <section className="tour-hero">
        <div className="tour-hero-bg">
          {tour.photos && tour.photos.length > 0 && (
            <Image 
              src={tour.photos[0].url}
              alt={tour.title}
              fill
              priority
              className="object-cover"
            />
          )}
        </div>
        <div className="container tour-hero-content">
          <nav className="breadcrumbs" aria-label="breadcrumb">
            <Link href="/">Home</Link> &gt; <Link href="/tours">Tours</Link> &gt; <span>{tour.title}</span>
          </nav>
          <h1 className="tour-title">{tour.title}</h1>
          <div className="tour-quick-facts">
            <div className="fact"><Clock size={20} /> <span>{tour.duration}</span></div>
            {tour.distance && <div className="fact"><MapPin size={20} /> <span>{tour.distance}</span></div>}
          </div>
        </div>
      </section>

      <section className="tour-body container">
        <div className="tour-grid">
          
          <div className="tour-main-content">
            <div className="tour-description editorial-content">
              {tour.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="tour-highlights">
              <h2 className="font-serif">Highlights</h2>
              <ul className="highlight-list">
                {tour.highlights.map((item, i) => (
                  <li key={i}>
                    <MapPin className="list-icon" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {tour.photos && tour.photos.length > 1 && (
              <div className="tour-gallery">
                <h2 className="font-serif">Gallery</h2>
                <div className="tour-gallery-grid">
                  {tour.photos.slice(1).map((photo, i) => (
                    <div key={photo.id} className="tour-gallery-img">
                      <Image 
                        src={photo.url}
                        alt={`${tour.title} photo ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="tour-sidebar">
            <div className="booking-card">
              <div className="price-box">
                {tour.showPrice && tour.priceFrom ? (
                  <>
                    <span className="price-label">From</span>
                    <span className="price-value">€{tour.priceFrom}</span>
                    <span className="price-note">Per group (up to 4 persons)</span>
                  </>
                ) : (
                  <span className="price-value">Price upon request</span>
                )}
              </div>
              
              <Link href={`/book?tour=${tour.id}`} className="btn btn-primary book-btn">
                Request to Book
              </Link>
              <p className="no-deposit-note">No deposit required. Pay after the tour.</p>
              
              <div className="included-excluded">
                <div className="included">
                  <h3><CheckCircle size={18} className="text-green" /> Included</h3>
                  <ul>
                    {tour.included.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                
                <div className="excluded">
                  <h3><XCircle size={18} className="text-red" /> Excluded</h3>
                  <ul>
                    {tour.excluded.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </section>
    </div>
  );
}
