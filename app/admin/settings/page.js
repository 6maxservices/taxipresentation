'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [contactInfo, setContactInfo] = useState({
    whatsapp: { value: '+30 694 446 6259', enabled: true },
    imessage: { value: '+30 694 446 6259', enabled: true },
    messenger: { value: 'George Papatheodorou', enabled: true },
    email: { value: 'gpapathe77@gmail.com', enabled: true },
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: { url: '', enabled: false },
    telegram: { url: '', enabled: false },
    tiktok: { url: '', enabled: false },
    instagram: { url: '', enabled: false },
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.contact_info) setContactInfo(data.contact_info);
        if (data.social_links) setSocialLinks(data.social_links);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await Promise.all([
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'contact_info', value: contactInfo }),
        }),
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'social_links', value: socialLinks }),
        })
      ]);
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Loading settings...</p></div>;

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Settings & Contact Info</h1>
      </div>

      {error && <div className="admin-card" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div className="admin-card" style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSave}>
        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ marginBottom: '1rem' }}>Contact Methods</h2>
          
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>WhatsApp</label>
            <input 
              value={contactInfo.whatsapp.value} 
              onChange={e => setContactInfo({...contactInfo, whatsapp: {...contactInfo.whatsapp, value: e.target.value}})}
              placeholder="+30 ..."
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={contactInfo.whatsapp.enabled} 
                onChange={e => setContactInfo({...contactInfo, whatsapp: {...contactInfo.whatsapp, enabled: e.target.checked}})}
              /> Enabled
            </label>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>iMessage</label>
            <input 
              value={contactInfo.imessage.value} 
              onChange={e => setContactInfo({...contactInfo, imessage: {...contactInfo.imessage, value: e.target.value}})}
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={contactInfo.imessage.enabled} 
                onChange={e => setContactInfo({...contactInfo, imessage: {...contactInfo.imessage, enabled: e.target.checked}})}
              /> Enabled
            </label>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>Messenger</label>
            <input 
              value={contactInfo.messenger.value} 
              onChange={e => setContactInfo({...contactInfo, messenger: {...contactInfo.messenger, value: e.target.value}})}
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={contactInfo.messenger.enabled} 
                onChange={e => setContactInfo({...contactInfo, messenger: {...contactInfo.messenger, enabled: e.target.checked}})}
              /> Enabled
            </label>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>Email</label>
            <input 
              value={contactInfo.email.value} 
              onChange={e => setContactInfo({...contactInfo, email: {...contactInfo.email, value: e.target.value}})}
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={contactInfo.email.enabled} 
                onChange={e => setContactInfo({...contactInfo, email: {...contactInfo.email, enabled: e.target.checked}})}
              /> Enabled
            </label>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ marginBottom: '1rem' }}>Social Media</h2>
          
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>Facebook URL</label>
            <input 
              value={socialLinks.facebook.url} 
              onChange={e => setSocialLinks({...socialLinks, facebook: {...socialLinks.facebook, url: e.target.value}})}
              placeholder="https://facebook.com/..."
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={socialLinks.facebook.enabled} 
                onChange={e => setSocialLinks({...socialLinks, facebook: {...socialLinks.facebook, enabled: e.target.checked}})}
              /> Show
            </label>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>Telegram URL</label>
            <input 
              value={socialLinks.telegram.url} 
              onChange={e => setSocialLinks({...socialLinks, telegram: {...socialLinks.telegram, url: e.target.value}})}
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={socialLinks.telegram.enabled} 
                onChange={e => setSocialLinks({...socialLinks, telegram: {...socialLinks.telegram, enabled: e.target.checked}})}
              /> Show
            </label>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>TikTok URL</label>
            <input 
              value={socialLinks.tiktok.url} 
              onChange={e => setSocialLinks({...socialLinks, tiktok: {...socialLinks.tiktok, url: e.target.value}})}
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={socialLinks.tiktok.enabled} 
                onChange={e => setSocialLinks({...socialLinks, tiktok: {...socialLinks.tiktok, enabled: e.target.checked}})}
              /> Show
            </label>
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <label>Instagram URL</label>
            <input 
              value={socialLinks.instagram.url} 
              onChange={e => setSocialLinks({...socialLinks, instagram: {...socialLinks.instagram, url: e.target.value}})}
            />
            <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={socialLinks.instagram.enabled} 
                onChange={e => setSocialLinks({...socialLinks, instagram: {...socialLinks.instagram, enabled: e.target.checked}})}
              /> Show
            </label>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', minHeight: '56px' }}>
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
