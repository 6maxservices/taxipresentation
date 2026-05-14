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
            <Link href="/admin/transfers" className={`admin-link ${pathname.startsWith('/admin/transfers') ? 'active' : ''}`}>
              Transfers
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
