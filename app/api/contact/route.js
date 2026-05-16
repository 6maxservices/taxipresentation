import { NextResponse } from 'next/server';
import { sendEmailNotification, sendWhatsAppNotification } from '@/lib/notifications';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');

    if (!name || !email || !message) {
      return NextResponse.redirect(new URL('/contact?error=MissingFields', req.url));
    }

    // Create a mock booking object to reuse our notification system
    const mockBooking = {
      serviceType: `General Inquiry: ${service}`,
      clientName: name,
      clientEmail: email,
      clientPhone: 'Not provided (Contact Form)',
      date: new Date(),
      passengers: 'N/A',
      notes: message,
    };

    // Send notifications
    await Promise.allSettled([
      sendEmailNotification(mockBooking),
      sendWhatsAppNotification(mockBooking)
    ]);

    // Redirect back to contact page with a success flag
    return NextResponse.redirect(new URL('/contact?success=true', req.url));

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.redirect(new URL('/contact?error=ServerError', req.url));
  }
}
