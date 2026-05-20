import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildOfferHtml(body) {
  const bodyHtml = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
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
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Athens Taxi Transfers &amp; Tours</h1>
              <p style="margin:6px 0 0;color:#a8c4dc;font-size:13px;font-family:Arial,sans-serif;">Athens, Greece</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 36px;font-size:16px;color:#444;line-height:1.8;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 48px 40px;border-top:1px solid #e8ecf0;">
              <p style="margin:24px 0 0;font-size:15px;color:#1a3c5e;">Warm regards,</p>
              <p style="margin:6px 0 4px;font-size:18px;color:#1a3c5e;font-weight:bold;">George Papatheodorou</p>
              <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;">
                Licensed Taxi Driver &amp; Tour Operator<br/>
                Greek National Tourist Organisation &middot; Lic. 0208E70000094100
              </p>
              <p style="margin:12px 0 0;font-size:13px;color:#888;font-family:Arial,sans-serif;">
                📱 +30 694 446 6259 &nbsp;|&nbsp; ✉️ gpapathe77@gmail.com &nbsp;|&nbsp; 🌐 www.georgeathenstaxi.gr
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6f9;padding:20px 48px;border-top:1px solid #e8ecf0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaa;font-family:Arial,sans-serif;">
                Athens, Greece &nbsp;&middot;&nbsp; www.georgeathenstaxi.gr
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

export async function POST(req) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"George Papatheodorou" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: buildOfferHtml(body),
      text: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send offer email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
