import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

const REVIEW_URL = 'https://g.page/r/Cb0vAW03l1u8EBM/review';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildEmailHtml(clientName, serviceType, date) {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a3c5e;padding:36px 40px;text-align:center;">
              <p style="margin:0;color:#a8c4dc;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">George Papatheodorou</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Premium Taxi Transfer &amp; Tours</h1>
              <p style="margin:6px 0 0;color:#a8c4dc;font-size:13px;font-family:Arial,sans-serif;">Athens, Greece</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 32px;">
              <p style="margin:0 0 12px;font-size:20px;color:#1a3c5e;">Dear ${clientName},</p>
              <p style="margin:0 0 20px;font-size:16px;color:#444;line-height:1.7;">
                It was a true pleasure serving you on your <strong>${serviceType}</strong> on ${formattedDate}.
                I hope it made your time in Greece a little more comfortable and memorable.
              </p>
              <p style="margin:0 0 32px;font-size:16px;color:#444;line-height:1.7;">
                If you have a moment, I would be very grateful if you could share your experience with a Google review.
                As a small local business, every review makes an enormous difference — and it helps other travelers
                discover a trusted service for their trip to Greece.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 40px;">
                    <a href="${REVIEW_URL}"
                       style="display:inline-block;background:#1a3c5e;color:#ffffff;font-family:Arial,sans-serif;font-size:17px;font-weight:bold;text-decoration:none;padding:18px 48px;border-radius:8px;letter-spacing:0.5px;">
                      ⭐ Leave a Google Review
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e8ecf0;padding:32px 0 0;">
                    <p style="margin:0 0 20px;text-align:center;font-size:14px;color:#888;font-family:Arial,sans-serif;">
                      On your phone? Scan the QR code below to leave your review instantly:
                    </p>
                    <!-- QR Code embedded via CID -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:0 0 28px;">
                          <img src="cid:review-qr"
                               alt="Scan to leave a Google review"
                               width="180" height="180"
                               style="display:block;border:6px solid #f4f6f9;border-radius:8px;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:15px;color:#444;line-height:1.7;">
                Thank you again for choosing my service. I hope to welcome you back to Greece very soon!
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 48px 40px;">
              <p style="margin:0;font-size:15px;color:#1a3c5e;">Warm regards,</p>
              <p style="margin:6px 0 4px;font-size:18px;color:#1a3c5e;font-weight:bold;">George Papatheodorou</p>
              <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Licensed Taxi Driver &amp; Tour Operator<br/>Greek National Tourist Organisation · Lic. 0208E70000094100</p>
              <p style="margin:12px 0 0;font-size:13px;color:#888;font-family:Arial,sans-serif;">
                📱 +30 694 446 6259 &nbsp;|&nbsp; ✉️ gpapathe77@gmail.com &nbsp;|&nbsp; 🌐 www.georgeathenstaxi.gr
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6f9;padding:20px 48px;border-top:1px solid #e8ecf0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaa;font-family:Arial,sans-serif;">
                You are receiving this email because you recently used George's taxi or tour service in Athens, Greece.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendReviewEmail(booking) {
  try {
    const qrBuffer = await QRCode.toBuffer(REVIEW_URL, {
      width: 360,
      margin: 2,
      color: { dark: '#1a3c5e', light: '#ffffff' },
    });

    await transporter.sendMail({
      from: `"George Papatheodorou" <${process.env.GMAIL_USER}>`,
      to: booking.clientEmail,
      subject: `Thank you for traveling with George, ${booking.clientName}! ⭐`,
      html: buildEmailHtml(booking.clientName, booking.serviceType, booking.date),
      attachments: [
        {
          filename: 'review-qr.png',
          content: qrBuffer,
          cid: 'review-qr',
        },
      ],
    });

    console.log(`Review email sent to ${booking.clientEmail}`);
    return true;
  } catch (err) {
    console.error('Failed to send review email:', err);
    return false;
  }
}
