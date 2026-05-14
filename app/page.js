import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import './page.css';

async function getFeaturedTours() {
  return await prisma.tour.findMany({
    where: { isActive: true },
    include: { photos: true },
    take: 3,
  });
}

export default async function Home() {
  const featuredTours = await getFeaturedTours();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-mosaic">
          <div className="mosaic-item item-1">
            <Image src="/photos/4c8caf05-1ae7-48d4-9ced-287b6f63df53.jpg" alt="The Acropolis of Athens" fill priority className="object-cover" />
          </div>
          <div className="mosaic-item item-2">
            <Image src="/photos/0b55f0ee-dce1-4e33-a9b3-39e6f9e1dbee.jpg" alt="Greece Landmark" fill priority className="object-cover" />
          </div>
          <div className="mosaic-item item-3">
            <Image src="/photos/6fd01cac-9d39-4a2a-b256-d6d9dce77acc.jpg" alt="Greece Landmark" fill priority className="object-cover" />
          </div>
          <div className="mosaic-item item-4">
            <Image src="/photos/1ea2cb4d-feb7-4581-a516-b9dcdd423211.jpg" alt="Greece Landmark" fill priority className="object-cover" />
          </div>
          <div className="mosaic-item item-5">
            <Image src="/photos/7de10596-bd1c-42bf-9e88-a76f4cbc4389.jpg" alt="Greece Landmark" fill priority className="object-cover" />
          </div>
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content text-center">
          <h1 className="hero-title">Experience Greece<br/>Beyond the Guidebook</h1>
          <p className="hero-subtitle">Premium private tours and transfers. Personal service. No upfront payments.</p>
          <Link href="/book" className="btn btn-primary btn-large">Request a Tour</Link>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="features-section editorial-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card text-center">
              <h3 className="font-serif">No Deposit Required</h3>
              <p>Book your tour today without paying a dime upfront. We operate on trust and reputation.</p>
            </div>
            <div className="feature-card text-center">
              <h3 className="font-serif">Pay After the Tour</h3>
              <p>Experience the journey first. Pay easily by cash or card (POS) when your tour is completed.</p>
            </div>
            <div className="feature-card text-center">
              <h3 className="font-serif">Private & Personalized</h3>
              <p>Your pace, your interests. 1-4 passengers in premium comfort, exploring at your own rhythm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="tours-section editorial-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Hand-Crafted Itineraries</h2>
            <p>Our most popular experiences around Athens and Southern Greece</p>
          </div>
          
          <div className="tours-grid">
            {featuredTours.map(tour => (
              <Link href={`/tours/${tour.slug}`} key={tour.id} className="tour-card">
                <div className="tour-card-image">
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
                <div className="tour-card-content">
                  <h3 className="tour-card-title">{tour.title}</h3>
                  <p className="tour-card-desc">{tour.shortDesc}</p>
                  <div className="tour-card-meta">
                    <span>{tour.duration}</span>
                    {tour.showPrice && tour.priceFrom && <span>From €{tour.priceFrom}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-xl)' }}>
            <Link href="/tours" className="btn btn-outline">View All Tours</Link>
          </div>
        </div>
      </section>

      {/* Meet George Section */}
      <section className="about-section editorial-section">
        <div className="container about-grid">
          <div className="about-image-wrapper">
            <div className="george-image">
              <Image 
                src="/photos/george/george.jpg" 
                alt="George - Your Private Driver in Greece"
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
          <div className="about-content">
            <h2>Meet George</h2>
            <p>I'm a professional, licensed taxi driver with years of experience showing travelers the real Greece. My goal is to make you feel like a welcomed guest, not just a tourist.</p>
            <p>From the bustling streets of Athens to the ancient ruins of Delphi and the sunset at Sounio, I provide safe, comfortable, and highly personalized transportation.</p>
            <p>I believe in honest service. That's why I never ask for a deposit. You book, we drive, you enjoy, and you pay at the end.</p>
            <Link href="/book" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Ride with George</Link>
          </div>
        </div>
      </section>

      {/* Value Proposition CTA */}
      <section className="cta-section editorial-section text-center">
        <div className="container">
          <h2>Ready for an Unforgettable Journey?</h2>
          <p className="cta-subtitle">Let us handle the driving while you take in the views.</p>
          <div className="cta-buttons">
            <Link href="/book" className="btn btn-primary">Book Your Transfer</Link>
            <Link href="/tours" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>Explore Tours</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
