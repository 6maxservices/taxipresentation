'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-container">
        <Link href="/" className="logo">
          <img src="/logos/logo_option_1.png" alt="George Papatheodorou Taxi Transfer & Tours" style={{ height: '60px', width: 'auto' }} />
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`nav ${isOpen ? 'nav-open' : ''}`}>
          <Link href="/tours" onClick={() => setIsOpen(false)}>Tours</Link>
          <Link href="/transfers" onClick={() => setIsOpen(false)}>Transfers</Link>
          <Link href="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link href="/faq" onClick={() => setIsOpen(false)}>FAQ</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/book" className="btn btn-primary nav-cta" onClick={() => setIsOpen(false)}>
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
