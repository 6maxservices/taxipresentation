import Link from 'next/link';
import './Footer.css';
import { prisma } from '@/lib/prisma';
import { Facebook, Instagram, Send, Mail } from 'lucide-react';

async function getSettings() {
  try {
    const settings = await prisma.globalSetting.findMany();
    return settings.reduce((acc, curr) => {
      acc[curr.key] = JSON.parse(curr.value);
      return acc;
    }, {});
  } catch (err) {
    return {};
  }
}

export default async function Footer() {
  const settings = await getSettings();
  const social = settings.social_links || {};
  const contact = settings.contact_info || {};

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="font-serif">Discover Greece<br/>with George.</h2>
          <p>Premium private tours and transfers in Athens and beyond.</p>
          
          <div className="social-icons" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {social.facebook?.enabled && (
              <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                <Facebook size={20} />
              </a>
            )}
            {social.instagram?.enabled && (
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram size={20} />
              </a>
            )}
            {social.telegram?.enabled && (
              <a href={social.telegram.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                <Send size={20} />
              </a>
            )}
            {contact.email?.enabled && (
              <a href={`mailto:${contact.email.value}`} className="social-icon">
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
        
        <div className="footer-links">
          <div>
            <h3>Services</h3>
            <ul>
              <li><Link href="/tours">Tours</Link></li>
              <li><Link href="/transfers">Transfers</Link></li>
            </ul>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/book">Book Now</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} George Tours. All rights reserved.</p>
        <div className="admin-link">
          <Link href="/admin">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
