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
        
        // Arrival Details
        arrivalType: body.arrivalType || null,
        flightNumber: body.flightNumber || null,
        arrivalTime: body.arrivalTime || null,
        portName: body.portName || null,
        portGate: body.portGate || null,
        
        notes: body.notes || null,
        status: 'NEW',
      }
    });

    const results = await Promise.allSettled([
      sendEmailNotification(booking),
      sendWhatsAppNotification(booking)
    ]);
    console.log('Notification results:', results.map(r => r.status));

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json({ error: 'Failed to submit booking' }, { status: 500 });
  }
}
