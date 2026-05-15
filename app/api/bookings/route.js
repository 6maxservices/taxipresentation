import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmailNotification, sendWhatsAppNotification } from '@/lib/notifications';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body.clientName || !body.clientEmail || !body.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to database
    const booking = await prisma.booking.create({
      data: {
        serviceType: body.serviceType,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientPhone: body.clientPhone,
        date: body.date,
        passengers: body.passengers,
        pickupLocation: body.pickupLocation || null,
        dropoffLocation: body.dropoffLocation || null,
        notes: body.notes || null,
        status: 'NEW',
      }
    });

    // Send notifications in the background (do not await so user gets fast response)
    // We catch errors to prevent unhandled rejections
    Promise.allSettled([
      sendEmailNotification(booking),
      sendWhatsAppNotification(booking)
    ]).then(results => {
      console.log('Notification results:', results.map(r => r.status));
    });

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json({ error: 'Failed to submit booking' }, { status: 500 });
  }
}
