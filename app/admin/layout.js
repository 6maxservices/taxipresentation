'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './admin.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-wrapper">
      <div className="admin-nav-bar">
        <div className="container admin-nav-container">
          <div className="admin-links">
            <Link href="/admin" className={`admin-link ${pathname === '/admin' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link href="/admin/bookings" className={`admin-link ${pathname === '/admin/bookings' ? 'active' : ''}`}>
              Bookings
            </Link>
            <Link href="/admin/tours" className={`admin-link ${pathname.startsWith('/admin/tours') ? 'active' : ''}`}>
              Tours
            </Link>
            <Link href="/admin/mosaic" className={`admin-link ${pathname.startsWith('/admin/mosaic') ? 'active' : ''}`}>
              Mosaic
            </Link>
            <Link href="/admin/gallery" className={`admin-link ${pathname.startsWith('/admin/gallery') ? 'active' : ''}`}>
              Gallery
            </Link>
            <Link href="/admin/photos" className={`admin-link ${pathname.startsWith('/admin/photos') ? 'active' : ''}`}>
              Media Library
            </Link>
            <Link href="/admin/faq" className={`admin-link ${pathname.startsWith('/admin/faq') ? 'active' : ''}`}>
              FAQ
            </Link>
            <Link href="/admin/transfers" className={`admin-link ${pathname.startsWith('/admin/transfers') ? 'active' : ''}`}>
              Transfers
            </Link>
            <Link href="/admin/settings" className={`admin-link ${pathname.startsWith('/admin/settings') ? 'active' : ''}`}>
              Settings
            </Link>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
