'use client';
import { MessageCircle, Phone } from 'lucide-react';
import './ContactButtons.css';

export default function ContactButtons() {
  // George's number placeholder
  const phone = "306900000000"; 
  const whatsappUrl = `https://wa.me/${phone}`;
  const viberUrl = `viber://chat?number=%2B${phone}`;

  return (
    <div className="floating-contact">
      <a href={viberUrl} className="contact-btn viber-btn" aria-label="Contact on Viber">
        <Phone size={24} />
      </a>
      <a href={whatsappUrl} className="contact-btn whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
