import { prisma } from '@/lib/prisma';
import './faq.css';

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="container">
          <h1 className="font-serif">Frequently Asked Questions</h1>
          <p>Everything you need to know about our services, bookings, and tours.</p>
        </div>
      </div>

      <div className="container faq-content">
        <div className="faq-grid">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="faq-item">
              <h3 className="font-serif">{faq.question}</h3>
              <div className="faq-answer">
                {faq.answer.split('\n').map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <p>We are currently updating our FAQs. Please contact us directly for any questions!</p>
          </div>
        )}

        <div className="faq-contact-cta">
          <h2 className="font-serif">Still have questions?</h2>
          <p>We are here to help you 24/7. Contact George directly via WhatsApp or Email.</p>
          <div className="cta-buttons">
            <a href="https://wa.me/306944466259" className="btn btn-primary">WhatsApp Us</a>
            <a href="/contact" className="btn btn-outline">Contact Page</a>
          </div>
        </div>
      </div>
    </div>
  );
}
