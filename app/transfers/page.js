import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import './transfers.css';

async function getTransfers() {
  return await prisma.transfer.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export const metadata = {
  title: "Transfers | Discover Greece with George",
  description: "Private transfers to and from Athens airport, ports, and hotels.",
};

export default async function TransfersPage() {
  const transfers = await getTransfers();

  return (
    <div className="transfers-page page-container">
      <div className="container">
        <header className="page-header text-center">
          <h1 className="font-serif">Private Transfers</h1>
          <p className="page-subtitle">Punctual, comfortable, and reliable transportation across Greece.</p>
        </header>

        <div className="transfers-list">
          {transfers.map(transfer => (
            <div key={transfer.id} className="transfer-card">
              <div className="transfer-info">
                <h3 className="transfer-title">{transfer.title}</h3>
                <div className="transfer-route">
                  <span className="route-point">{transfer.fromArea}</span>
                  <span className="route-arrow">→</span>
                  <span className="route-point">{transfer.toArea}</span>
                </div>
                {transfer.description && <p className="transfer-desc">{transfer.description}</p>}
              </div>
              
              <div className="transfer-action">
                <Link href={`/book?type=transfer&id=${transfer.id}`} className="btn btn-outline">
                  Request Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="custom-transfer-cta text-center editorial-section">
          <h2 className="font-serif">Need to go somewhere else?</h2>
          <p>We provide point-to-point transfers anywhere in Greece.</p>
          <Link href="/book?type=custom_transfer" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Request Custom Transfer</Link>
        </div>
      </div>
    </div>
  );
}
