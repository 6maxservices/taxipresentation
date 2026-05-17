'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function MosaicManager() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const uploadRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [photosRes, mosaicRes] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/settings?key=homepage_mosaic')
        ]);
        
        const photosData = await photosRes.json();
        const mosaicData = await mosaicRes.json();
        
        setAllPhotos(photosData.photos || []);
        
        // homepage_mosaic setting might be an array of URLs
        const mosaicSettings = mosaicData.homepage_mosaic || [];
        setSelectedPhotos(mosaicSettings);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newPhotos = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          newPhotos.push({ url: data.url, name: data.name });
        }
      } catch (err) {
        console.error('Upload failed for', file.name, err);
      }
    }

    setAllPhotos(prev => [...newPhotos, ...prev]);

    // Auto-select newly uploaded photos up to the 5-photo limit
    setSelectedPhotos(prev => {
      const available = 5 - prev.length;
      const toAdd = newPhotos.slice(0, available).map(p => p.url);
      return [...prev, ...toAdd];
    });

    setUploading(false);
    e.target.value = '';
  };

  const togglePhoto = (url) => {
    if (selectedPhotos.includes(url)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== url));
    } else {
      if (selectedPhotos.length >= 5) {
        setMessage({ type: 'error', text: 'You can only select up to 5 photos for the mosaic.' });
        return;
      }
      setSelectedPhotos([...selectedPhotos, url]);
      setMessage({ type: '', text: '' });
    }
  };

  const movePhoto = (index, direction) => {
    const newPhotos = [...selectedPhotos];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newPhotos.length) return;
    
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[newIndex];
    newPhotos[newIndex] = temp;
    setSelectedPhotos(newPhotos);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'homepage_mosaic', value: selectedPhotos }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Mosaic updated successfully!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save mosaic settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container"><p>Loading photos...</p></div>;

  return (
    <div className="container">
      <div className="admin-header">
        <h1 className="font-serif">Homepage Mosaic Manager</h1>
        <p>Select up to 5 photos to display in the hero section of your homepage.</p>
      </div>

      {message.text && (
        <div className={`admin-card ${message.type}`} style={{ 
          marginBottom: '1.5rem', 
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          padding: '1rem'
        }}>
          {message.text}
        </div>
      )}

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 className="font-serif" style={{ marginBottom: '1rem' }}>Selected Photos ({selectedPhotos.length}/5)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {selectedPhotos.map((url, index) => (
            <div key={url} style={{ position: 'relative', aspectRatio: '1', border: '2px solid var(--color-azure-dark)', borderRadius: '8px', overflow: 'hidden' }}>
              <Image src={url} alt={`Mosaic ${index + 1}`} fill className="object-cover" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', gap: '8px', padding: '4px' }}>
                <button onClick={() => movePhoto(index, -1)} disabled={index === 0} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
                <button onClick={() => togglePhoto(url)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                <button onClick={() => movePhoto(index, 1)} disabled={index === selectedPhotos.length - 1} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>→</button>
              </div>
              <div style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--color-azure-dark)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                {index + 1}
              </div>
            </div>
          ))}
          {selectedPhotos.length === 0 && <p style={{ color: '#6c757d', gridColumn: '1 / -1' }}>No photos selected. Please pick from the library below.</p>}
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving || selectedPhotos.length === 0} 
          className="btn btn-primary" 
          style={{ marginTop: '1.5rem', width: '100%' }}
        >
          {saving ? 'Updating Mosaic...' : 'Save Mosaic Selection'}
        </button>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="font-serif">Photo Library</h2>
          <button type="button" className="btn btn-outline" onClick={() => uploadRef.current?.click()}>
            {uploading ? 'Uploading...' : '+ Upload Photo'}
          </button>
          <input ref={uploadRef} type="file" multiple onChange={handleUpload} accept="image/*" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', maxHeight: '500px', overflowY: 'auto', padding: '4px' }}>
          {allPhotos.map(photo => (
            <div 
              key={photo.url} 
              onClick={() => togglePhoto(photo.url)}
              style={{ 
                position: 'relative', 
                aspectRatio: '1', 
                cursor: 'pointer', 
                borderRadius: '8px', 
                overflow: 'hidden',
                outline: selectedPhotos.includes(photo.url) ? '4px solid var(--color-azure-dark)' : 'none',
                opacity: selectedPhotos.includes(photo.url) ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              <Image src={photo.url} alt={photo.name} fill className="object-cover" />
              {selectedPhotos.includes(photo.url) && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--color-azure-dark)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
