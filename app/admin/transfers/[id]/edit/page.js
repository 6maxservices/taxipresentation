import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TransferForm from '../../TransferForm';

export const metadata = {
  title: 'Edit Transfer | Admin',
};

export default async function EditTransferPage({ params }) {
  const { id } = await params;
  
  const transfer = await prisma.transfer.findUnique({
    where: { id }
  });

  if (!transfer) {
    notFound();
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="admin-header">
        <h1 className="font-serif">Edit Transfer</h1>
      </div>
      <TransferForm transfer={transfer} />
    </div>
  );
}
