import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import TransferToggle from './TransferToggle';
import DeleteButton from '../DeleteButton';
import { deleteTransfer } from './actions';

export const metadata = {
  title: 'Manage Transfers | Admin',
};

export default async function AdminTransfers() {
  const transfers = await prisma.transfer.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Manage Transfers</h1>
        <Link href="/admin/transfers/new" className="btn btn-primary" style={{ padding: '8px 16px' }}>+ New Transfer</Link>
      </div>

      <div className="admin-card">
        {transfers.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No transfers found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {transfers.map(transfer => (
              <div key={transfer.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-md)', borderBottom: '1px solid #dee2e6' }}>
                
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '4px', color: transfer.isActive ? 'var(--color-charcoal)' : '#adb5bd' }}>
                    {transfer.title}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '8px' }}>
                    {transfer.fromArea} → {transfer.toArea} • €{transfer.priceFrom || '?'}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href={`/admin/transfers/${transfer.id}/edit`} style={{ fontSize: '0.875rem', color: 'var(--color-azure-dark)', textDecoration: 'underline' }}>Edit Details</Link>
                    <DeleteButton id={transfer.id} onDelete={deleteTransfer} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className={`status-badge ${transfer.isActive ? 'status-CONFIRMED' : 'status-CANCELLED'}`}>
                    {transfer.isActive ? 'ACTIVE' : 'DISABLED'}
                  </span>
                  <TransferToggle transferId={transfer.id} isActive={transfer.isActive} />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
