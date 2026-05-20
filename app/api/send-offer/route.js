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
      text: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send offer email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
