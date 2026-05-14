'use client';
import { useState } from 'react';
import { updateBookingStatus } from './actions';

export default function BookingStatusSelector({ bookingId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    
    const result = await updateBookingStatus(bookingId, newStatus);
    
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status");
    }
    
    setLoading(false);
  };

  return (
    <select 
      value={status} 
      onChange={handleChange}
      disabled={loading}
      style={{
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontSize: '0.875rem',
        backgroundColor: 'var(--color-white)',
        cursor: loading ? 'wait' : 'pointer'
      }}
    >
      <option value="PENDING">Pending</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="COMPLETED">Completed</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
