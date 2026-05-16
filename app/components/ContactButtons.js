import { MessageCircle, Phone, MessageSquare } from 'lucide-react';
import './ContactButtons.css';
import { prisma } from '@/lib/prisma';

async function getContactSettings() {
  try {
    const setting = await prisma.globalSetting.findUnique({
      where: { key: 'contact_info' }
    });
    if (setting) return JSON.parse(setting.value);
  } catch (err) {}
  return {
    whatsapp: { value: '+30 694 446 6259', enabled: true },
    imessage: { value: '+30 694 446 6259', enabled: true },
  };
}

export default async function ContactButtons() {
  const contact = await getContactSettings();
  
  const cleanNumber = (num) => num.replace(/\s+/g, '').replace('+', '');
  
  return (
    <div className="floating-contact">
      {contact.imessage?.enabled && (
        <a href={`sms:${cleanNumber(contact.imessage.value)}`} className="contact-btn imessage-btn" aria-label="Contact on iMessage">
          <MessageSquare size={24} />
        </a>
      )}
      {contact.whatsapp?.enabled && (
        <a href={`https://wa.me/${cleanNumber(contact.whatsapp.value)}`} className="contact-btn whatsapp-btn" target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
          <MessageCircle size={24} />
        </a>
      )}
    </div>
  );
}
