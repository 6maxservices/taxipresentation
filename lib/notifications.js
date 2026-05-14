// lib/notifications.js

export async function sendEmailNotification(booking) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.ADMIN_EMAIL || 'george@example.com'; // Admin's email

  const subject = `New Booking Request: ${booking.serviceType} from ${booking.clientName}`;
  const html = `
    <h2>New Booking Request</h2>
    <p><strong>Service:</strong> ${booking.serviceType}</p>
    <p><strong>Client:</strong> ${booking.clientName}</p>
    <p><strong>Email:</strong> ${booking.clientEmail}</p>
    <p><strong>Phone:</strong> ${booking.clientPhone}</p>
    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
    <p><strong>Passengers:</strong> ${booking.passengers}</p>
    <p><strong>Pick-up:</strong> ${booking.pickupLocation || 'N/A'}</p>
    <p><strong>Drop-off:</strong> ${booking.dropoffLocation || 'N/A'}</p>
    <p><strong>Notes:</strong> ${booking.notes || 'None'}</p>
  `;

  if (!RESEND_API_KEY) {
    console.log("[MOCK EMAIL] Would send email to:", TO_EMAIL);
    console.log("[MOCK EMAIL] HTML Content:", html);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Bookings <onboarding@resend.dev>', // Update this when domain is verified
        to: TO_EMAIL,
        subject: subject,
        html: html,
      }),
    });
    
    if (!res.ok) {
      console.error('Failed to send email:', await res.text());
    }
    return res.ok;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendWhatsAppNotification(booking) {
  const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;
  const PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER; // Format: +3069XXXXX without the +

  const message = encodeURIComponent(
    `*New Booking Request!*\n` +
    `Service: ${booking.serviceType}\n` +
    `Client: ${booking.clientName}\n` +
    `Phone: ${booking.clientPhone}\n` +
    `Date: ${new Date(booking.date).toLocaleDateString()}`
  );

  if (!CALLMEBOT_API_KEY || !PHONE_NUMBER) {
    console.log("[MOCK WHATSAPP] Would send message to:", PHONE_NUMBER || "Unknown");
    console.log("[MOCK WHATSAPP] Content:", decodeURIComponent(message));
    return true;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE_NUMBER}&text=${message}&apikey=${CALLMEBOT_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to send WhatsApp:', await res.text());
    }
    return res.ok;
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    return false;
  }
}
