'use client';
import { CalendarPlus } from 'lucide-react';

function pad(n) {
  return String(n).padStart(2, '0');
}

function toICSDate(date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

function toICSDateTime(date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;
}

function escapeICS(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export default function AddToCalendarButton({ booking }) {
  const handleClick = () => {
    const bookingDate = new Date(booking.date);

    // Build description with all relevant details
    const lines = [
      `Client: ${booking.clientName}`,
      `Email: ${booking.clientEmail}`,
      booking.clientPhone ? `Phone: ${booking.clientPhone}` : null,
      `Service: ${booking.serviceType}`,
      `Passengers: ${booking.passengers}`,
      booking.pickupLocation ? `Pick-up: ${booking.pickupLocation}` : null,
      booking.dropoffLocation ? `Drop-off: ${booking.dropoffLocation}` : null,
      booking.arrivalType ? `Arrival: ${booking.arrivalType}` : null,
      booking.flightNumber ? `Flight: ${booking.flightNumber}` : null,
      booking.portName ? `Port: ${booking.portName}` : null,
      booking.arrivalTime ? `Arrival time: ${booking.arrivalTime}` : null,
      booking.portGate ? `Gate: ${booking.portGate}` : null,
      booking.notes ? `Notes: ${booking.notes}` : null,
    ].filter(Boolean);

    const description = escapeICS(lines.join('\n'));
    const summary = escapeICS(`${booking.serviceType} – ${booking.clientName}`);
    const location = escapeICS(booking.pickupLocation || '');

    let dtStart, dtEnd;

    if (booking.arrivalTime) {
      // Parse arrivalTime (e.g. "14:30" or "2:30 PM")
      const timeParts = booking.arrivalTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const meridiem = timeParts[3];
        if (meridiem?.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;
        bookingDate.setUTCHours(hours, minutes, 0, 0);
      }
      const endDate = new Date(bookingDate.getTime() + 60 * 60 * 1000); // +1 hour
      dtStart = `DTSTART:${toICSDateTime(bookingDate)}`;
      dtEnd = `DTEND:${toICSDateTime(endDate)}`;
    } else {
      // All-day event
      dtStart = `DTSTART;VALUE=DATE:${toICSDate(bookingDate)}`;
      const nextDay = new Date(bookingDate);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      dtEnd = `DTEND;VALUE=DATE:${toICSDate(nextDay)}`;
    }

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//George Athens Taxi//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:booking-${booking.id}@georgeathenstaxi.gr`,
      dtStart,
      dtEnd,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      location ? `LOCATION:${location}` : null,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.clientName.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-outline"
      style={{ padding: '6px 12px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
    >
      <CalendarPlus size={16} /> Add to Calendar
    </button>
  );
}
