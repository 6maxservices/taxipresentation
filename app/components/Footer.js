import Link from 'next/link';
import './Footer.css';
import { prisma } from '@/lib/prisma';
import { Facebook, Send, Mail } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

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
          <Link href="/">
            <img 
              src="/logos/logo_option_1.png" 
              alt="George Papatheodorou Taxi Transfer & Tours" 
              style={{ 
                height: '100px', 
                width: 'auto', 
                margin: '0',
                filter: 'invert(1)',
                mixBlendMode: 'screen',
                objectFit: 'contain'
              }} 
            />
          </Link>
          <p>Premium private tours and transfers in Athens and beyond.</p>
          
          <div className="social-icons" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {social.facebook?.enabled && (
              <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                <Facebook size={20} />
              </a>
            )}
            {social.instagram?.enabled && (
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                <InstagramIcon size={20} />
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
          
          <div style={{ marginTop: '2rem' }}>
            <a 
              href="https://www.google.com/search?sca_esv=388c3e2ad9a04a50&cs=0&sxsrf=ANbL-n5ppT5TK9WDcqI0URFMc0rsfGq1mA:1781810481925&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOXP3aQ02utrSzxiRLXHg7YfSJE-4f_T4h2RLorvVPbEI2tevL-0K8_z8ibusrA2-HFvzYjPtQZdgImqT9gdAM9HCjbQS7L6eXc1HeWbELHF88aj5DkG4Q9nSJ_8iOMcepSkzo-2RRr6fd3eQ1YxFADREmjwe&q=George+Papatheodorou+Athens+Taxi+Transfers+%26+Tours+Reviews&sa=X&ved=2ahUKEwiK0dOmwZGVAxUCRvEDHXBDJuIQ0bkNegQIJBAF&biw=1920&bih=919&dpr=1" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>Excellent 5.0/5</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>Based on 33 reviews</span>
              </div>
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          <div>
            <h3>Services</h3>
            <ul>
              <li><Link href="/tours">Tours</Link></li>
              <li><Link href="/transfers">Transfers</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3>Explore</h3>
            <ul>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/book">Request Quote</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-license">
            <h3>Licensed Taxi Driver & Tour Operator</h3>
            <p>George Papatheodorou</p>
            <p>Tour Operator</p>
            <p>Greek National Tourist Organisation</p>
            <p>Lic. No. 0208E70000094100</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} George’s Papatheodorou Taxi Transfer & Tours. All rights reserved.</p>
        <div className="admin-link">
          <Link href="/admin">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
