'use client';
import { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import { logBookingAction } from './actions';

export default function SendCustomEmailForm({ booking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(`Update regarding your trip in Greece - George Papatheodorou`);
  const [message, setMessage] = useState(`Dear ${booking.clientName}\n\n`);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const res = await fetch('/api/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.clientEmail,
          subject: subject,
          body: message,
        }),
      });
      const sendResult = await res.json();

      if (sendResult.error) {
        setError(sendResult.error);
        return;
      }

      await logBookingAction(
        booking.id,
        'EMAIL_SENT',
        `Sent custom email with subject: ${subject}`
      );

      setIsSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSent(false);
        window.location.reload();
      }, 3000);
    } catch (err) {
      setError('An error occurred while sending the email.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline"
        style={{ padding: '6px 12px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <Mail size={16} /> Send Custom Email
      </button>
    );
  }

  return (
    <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', border: '1px solid #718096', borderRadius: '8px', backgroundColor: '#f7fafc' }}>
      <h4 style={{ marginBottom: 'var(--space-sm)', color: '#2d3748' }}>Send Custom Email</h4>

      {isSent ? (
        <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: 'var(--space-sm)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Email sent successfully!
        </div>
      ) : (
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
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
              placeholder="Write your custom message here..."
            />
            <small style={{ color: '#718096', marginTop: '4px', display: 'block' }}>Note: The professional header and signature block will be automatically added to this message.</small>
          </div>

          {error && <p style={{ color: '#d00000', fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSending}
              style={{ flex: 1 }}
            >
              {isSending ? <Loader2 className="animate-spin" size={18} /> : 'Send Email'}
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
