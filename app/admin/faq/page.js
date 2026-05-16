import { prisma } from '@/lib/prisma';
import FAQList from './FAQList';

export const dynamic = 'force-dynamic';

export default async function AdminFAQ() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Manage FAQ</h1>
        <p>Add, edit or remove frequently asked questions shown on the site.</p>
      </div>

      <FAQList initialFaqs={faqs} />
    </div>
  );
}
