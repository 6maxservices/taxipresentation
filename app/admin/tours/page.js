export const dynamic = "force-dynamic";

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import TourToggle from './TourToggle';
import DeleteButton from '../DeleteButton';
import { deleteTour } from './actions';

export const metadata = {
  title: "Manage Tours | Admin Dashboard",
};

export default async function AdminTours() {
  const tours = await prisma.tour.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Manage Tours</h1>
        <Link href="/admin/tours/new" className="btn btn-primary" style={{ padding: '8px 16px' }}>+ New Tour</Link>
      </div>

      <div className="admin-card">
        {tours.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No tours found in database.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {tours.map(tour => (
              <div key={tour.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-md)', borderBottom: '1px solid #dee2e6' }}>
                
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '4px', color: tour.isActive ? 'var(--color-charcoal)' : '#adb5bd' }}>
                    {tour.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '8px' }}>
                    {tour.duration} • €{tour.priceFrom || '?'}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href={`/admin/tours/${tour.id}/edit`} style={{ fontSize: '0.875rem', color: 'var(--color-azure-dark)', textDecoration: 'underline' }}>Edit Details</Link>
                    <DeleteButton id={tour.id} onDelete={deleteTour} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className={`status-badge ${tour.isActive ? 'status-CONFIRMED' : 'status-CANCELLED'}`}>
                    {tour.isActive ? 'ACTIVE' : 'DISABLED'}
                  </span>
                  <TourToggle tourId={tour.id} isActive={tour.isActive} />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
