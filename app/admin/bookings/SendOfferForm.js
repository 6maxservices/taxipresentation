'use client';
import { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import { updateBookingStatus, logBookingAction } from './actions';

export default function SendOfferForm({ booking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(`Hello ${booking.clientName},\n\nThank you for reaching out to Discover Greece with George.\n\nRegarding your request for the ${booking.serviceType} on ${new Date(booking.date).toLocaleDateString()}, I am pleased to offer you this service for a total of €${amount}.\n\nThere is no deposit required to secure this booking. You simply pay at the end of your trip (cash or card).\n\nIf you would like to proceed, please reply to this email or reach out to me directly on WhatsApp/iMessage to confirm.`);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    setMessage(prev => prev.replace(/€\d*/, `€${newAmount}`));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    // Open blank window synchronously — iOS Safari blocks window.open()
    // called after an await, so we must open it before any async work.
    const gmailWindow = window.open('', '_blank');

    try {
      const result = await updateBookingStatus(booking.id, 'CONTACTED');

      if (result.success) {
        await logBookingAction(
          booking.id,
          'OFFER_SENT',
          `Sent offer of €${amount} via Gmail`
        );

        const signature = `\n\nBest regards,\n\nGeorge Papatheodorou\nPremium Taxi Transfer & Tours\n\n📱 WhatsApp / iMessage: +30 694 446 6259\n✉️ Email: gpapathe77@gmail.com\n🌐 Web: https://www.georgeathenstaxi.gr`;
        const subject = encodeURIComponent(`Offer for your trip in Greece - George Papatheodorou`);
        const body = encodeURIComponent(message + signature);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${booking.clientEmail}&su=${subject}&body=${body}`;

        gmailWindow.location = gmailUrl;

        setIsSent(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSent(false);
          window.location.reload();
        }, 3000);
      } else {
        gmailWindow.close();
        setError(result.error || 'Failed to update booking status');
      }
    } catch (err) {
      gmailWindow.close();
      setError('An error occurred while updating the status.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{ padding: '6px 12px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <Mail size={16} /> Create Offer
      </button>
    );
  }

  return (
    <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', border: '1px solid var(--color-azure)', borderRadius: '8px', backgroundColor: '#f0f7ff' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-azure-dark)' }}>Prepare Custom Offer</h4>

      {isSent ? (
        <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: 'var(--space-sm)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Status updated! Opening Gmail...
        </div>
      ) : (
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label>Amount (€)</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="e.g. 250"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              required
            />
          </div>

          {error && <p style={{ color: '#d00000', fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSending}
              style={{ flex: 1 }}
            >
              {isSending ? <Loader2 className="animate-spin" size={18} /> : 'Update Status & Open Gmail'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsOpen(false)}
              disabled={isSending}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
