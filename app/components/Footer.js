import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="font-serif">Discover Greece<br/>with George.</h2>
          <p>Premium private tours and transfers in Athens and beyond.</p>
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
