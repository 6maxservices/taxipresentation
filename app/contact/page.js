'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Phone, Mail, MessageSquare, Facebook, Instagram } from 'lucide-react';
import './contact.css';

function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service') || 'Day Tour';
  const [service, setService] = useState(preselectedService);

  useEffect(() => {
    if (preselectedService) setService(preselectedService);
  }, [preselectedService]);

  return (
    <form action="/api/contact" method="POST">
      <div className="form-group">
        <label>Full Name</label>
        <input name="name" required placeholder="Your name" />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" required placeholder="email@example.com" />
      </div>
      <div className="form-group">
        <label>Service Interested In</label>
        <select 
          name="service" 
          value={service} 
          onChange={(e) => setService(e.target.value)}
        >
          <option>Day Tour</option>
          <option>Airport/Port Transfer</option>
          <option>Multi-day Trip</option>
          <option>Custom Request</option>
        </select>
      </div>
      <div className="form-group">
        <label>Your Message</label>
        <textarea name="message" required rows="5" placeholder="How can we help you?"></textarea>
      </div>
      <button type="submit" className="btn btn-primary w-full">Send Message</button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="font-serif">Get in Touch</h1>
          <p>Have a special request or need a custom quote? George is available 24/7 to assist you.</p>
        </div>
      </div>

      <div className="container contact-content">
        <div className="contact-grid">
          
          <div className="contact-info">
            <h2 className="font-serif">Direct Contact</h2>
            <div className="contact-methods">
              <a href="https://wa.me/306944466259" className="method-card">
                <div className="method-icon whatsapp"><Phone size={24} /></div>
                <div className="method-details">
                  <h3>WhatsApp / iMessage</h3>
                  <p>+30 694 446 6259</p>
                </div>
              </a>

              <a href="mailto:gpapathe77@gmail.com" className="method-card">
                <div className="method-icon email"><Mail size={24} /></div>
                <div className="method-details">
                  <h3>Email Address</h3>
                  <p>gpapathe77@gmail.com</p>
                </div>
              </a>

              <a href="https://m.me/george.papatheodorou" className="method-card">
                <div className="method-icon messenger"><MessageSquare size={24} /></div>
                <div className="method-details">
                  <h3>Facebook Messenger</h3>
                  <p>George Papatheodorou</p>
                </div>
              </a>
            </div>

            <h2 className="font-serif" style={{ marginTop: '3rem' }}>Follow Us</h2>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={24} /></a>
              <a href="#" className="social-icon"><Instagram size={24} /></a>
              <a href="https://wa.me/306944466259" className="social-icon"><Phone size={24} /></a>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="admin-card">
              <h2 className="font-serif">Quick Message</h2>
              <Suspense fallback={<div>Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
