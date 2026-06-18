'use client';
import { useState } from 'react';
import { Mail, Loader2, Check, X } from 'lucide-react';

export default function GlobalSendEmailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
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
          to: toEmail,
          subject: subject,
          body: message,
        }),
      });
      const sendResult = await res.json();

      if (sendResult.error) {
        setError(sendResult.error);
        return;
      }

      setIsSent(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSent(false);
        setToEmail('');
        setSubject('');
        setMessage('');
      }, 3000);
    } catch (err) {
      setError('An error occurred while sending the email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="btn-logout"
        style={{ backgroundColor: 'var(--color-azure)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
      >
        <Mail size={16} /> Compose
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '8px', padding: '24px', 
            width: '100%', maxWidth: '600px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative'
          }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} /> Compose Email
            </h3>

            {isSent ? (
              <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} /> Email sent successfully!
              </div>
            ) : (
              <form onSubmit={handleSend}>
                <div className="form-group">
                  <label>Recipient Email (To)</label>
                  <input
                    type="email"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    required
                    placeholder="client@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Regarding your trip to Athens..."
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

                {error && <p style={{ color: '#d00000', fontSize: '0.875rem', marginBottom: '16px' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSending}
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  >
                    {isSending ? <Loader2 className="animate-spin" size={18} /> : 'Send Email'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
