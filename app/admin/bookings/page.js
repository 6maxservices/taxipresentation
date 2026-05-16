import { prisma } from '@/lib/prisma';
import BookingStatusSelector from './BookingStatusSelector';
import SendOfferForm from './SendOfferForm';
import { Plane, Ship, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "All Bookings | Admin Dashboard",
};

export default async function AdminBookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      logs: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">All Bookings</h1>
      </div>

      <div className="admin-card">
        {bookings.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No bookings found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {bookings.map(booking => (
              <div key={booking.id} style={{ paddingBottom: 'var(--space-md)', borderBottom: '1px solid #dee2e6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  
                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>
                      {booking.clientName}
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '4px' }}>
                      <a href={`mailto:${booking.clientEmail}`} style={{ textDecoration: 'underline' }}>{booking.clientEmail}</a> • 
                      <a href={`tel:${booking.clientPhone}`} style={{ marginLeft: '4px', textDecoration: 'underline' }}>{booking.clientPhone}</a>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-azure-dark)', fontWeight: '500' }}>
                      Service: {booking.serviceType}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <BookingStatusSelector bookingId={booking.id} initialStatus={booking.status} />
                    <span style={{ fontSize: '0.75rem', color: '#adb5bd' }}>
                      Requested: {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                <div style={{ marginTop: 'var(--space-sm)', fontSize: '0.875rem', backgroundColor: 'var(--color-stone)', padding: 'var(--space-sm)', borderRadius: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                    <div><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</div>
                    <div><strong>Passengers:</strong> {booking.passengers}</div>
                  </div>
                  
                  {/* Arrival Specific Details */}
                  {booking.arrivalType && (
                    <div style={{ padding: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {booking.arrivalType === 'AIRPORT' ? <Plane size={16} /> : <Ship size={16} />}
                      <span>
                        <strong>{booking.arrivalType}:</strong> {booking.flightNumber || booking.portName} 
                        {booking.arrivalTime && ` @ ${booking.arrivalTime}`}
                        {booking.portGate && ` (Gate: ${booking.portGate})`}
                      </span>
                    </div>
                  )}

                  {(booking.pickupLocation || booking.dropoffLocation) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                      <div><strong>Pick-up:</strong> {booking.pickupLocation || '-'}</div>
                      <div><strong>Drop-off:</strong> {booking.dropoffLocation || '-'}</div>
                    </div>
                  )}
                  
                  {booking.notes && (
                    <div style={{ marginTop: 'var(--space-xs)' }}>
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                  {booking.adminNotes && (
                    <div style={{ marginTop: 'var(--space-xs)', color: 'var(--color-azure-dark)', fontStyle: 'italic' }}>
                      <strong>Admin Note:</strong> {booking.adminNotes}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'var(--space-sm)' }}>
                  <SendOfferForm booking={booking} />
                </div>

                {/* Booking History Logs */}
                {booking.logs && booking.logs.length > 0 && (
                  <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px dashed #dee2e6' }}>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6c757d', marginBottom: '8px' }}>History</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {booking.logs.map(log => (
                        <div key={log.id} style={{ fontSize: '0.75rem', display: 'flex', gap: '8px' }}>
                          <span style={{ color: '#adb5bd', whiteSpace: 'nowrap' }}>
                            {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <span style={{ fontWeight: '500', color: 'var(--color-azure-dark)' }}>{log.action}:</span>
                          <span>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
