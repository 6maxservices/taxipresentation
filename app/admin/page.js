import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: "Admin Dashboard | George Tours",
};

export default async function AdminDashboard() {
  // Fetch pending bookings
  const pendingBookings = await prisma.booking.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Get simple stats
  const totalTours = await prisma.tour.count();
  const totalBookings = await prisma.booking.count();

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Dashboard Overview</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="admin-card text-center">
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-azure-dark)' }}>{totalBookings}</div>
          <div style={{ color: '#6c757d', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Bookings</div>
        </div>
        <div className="admin-card text-center">
          <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-azure-dark)' }}>{totalTours}</div>
          <div style={{ color: '#6c757d', fontSize: '0.875rem', textTransform: 'uppercase' }}>Active Tours</div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 className="font-serif">Recent Pending Requests</h2>
          <Link href="/admin/bookings" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.875rem' }}>View All</Link>
        </div>

        {pendingBookings.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No pending bookings. You're all caught up!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {pendingBookings.map(booking => (
              <div key={booking.id} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid #dee2e6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong>{booking.clientName}</strong>
                  <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#495057' }}>
                  {booking.serviceType} • {new Date(booking.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
