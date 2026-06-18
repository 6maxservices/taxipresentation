import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import './tour-detail.css';

export const dynamic = 'force-dynamic';

async function getTour(slug) {
  // Use findFirst with case-insensitive mode to be more robust
  const tour = await prisma.tour.findFirst({
    where: { 
      slug: {
        equals: slug.trim(),
        mode: 'insensitive'
      }
    },
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
  const tour = await prisma.tour.findFirst({ 
    where: { 
      slug: {
        equals: slug.trim(),
        mode: 'insensitive'
      }
    } 
  });
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
    <>
      {/* Tour Hero & Top Mosaic */}
      <section className="tour-hero">
        <div className="tour-hero-bg">
          {tour.photos.filter(p => p.type === 'MOSAIC').length > 0 ? (
            <div className={`tour-mosaic grid-${Math.min(tour.photos.filter(p => p.type === 'MOSAIC').length, 6)}`}>
              {tour.photos.filter(p => p.type === 'MOSAIC').slice(0, 6).map((p, i) => (
                <div key={i} className={`mosaic-img item-${i + 1}`}>
                  <Image src={p.url} alt={tour.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <Image 
              src={tour.photos.find(p => p.type === 'MAIN')?.url || tour.photos[0]?.url || '/placeholder.jpg'}
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
            
            {tour.photos.filter(p => p.type === 'GALLERY').length > 0 && (
              <div className="tour-gallery">
                <h2 className="font-serif">Photo Gallery</h2>
                <div className="tour-gallery-scroll">
                  {tour.photos.filter(p => p.type === 'GALLERY').map((photo, i) => (
                    <div key={photo.id} className="gallery-item">
                      <Image 
                        src={photo.url}
                        alt={`${tour.title} gallery ${i + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="tour-sidebar">
            <div className="booking-card">
              <div className="price-box" style={{ textAlign: 'center' }}>
                {tour.showPrice && tour.priceFrom ? (
                  <>
                    <span className="price-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>From €{tour.priceFrom}</span>
                    <span className="price-note">Per vehicle / No deposit required</span>
                  </>
                ) : (
                  <>
                    <span className="price-value" style={{ fontSize: '1.5rem' }}>Price upon request</span>
                    <span className="price-note">Get a custom quote for your group</span>
                  </>
                )}
              </div>
              
              <Link href={`/book?type=tour&id=${tour.id}`} className="btn btn-primary book-btn">
                Request Quote
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
    </>
  );
}
