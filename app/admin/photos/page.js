'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

export default function MediaLibrary() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (err) {
      console.error('Failed to fetch photos', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setProgress({ current: 0, total: files.length });

    const uploaded = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          uploaded.push(data);
        }
        setProgress(prev => ({ ...prev, current: i + 1 }));
      } catch (err) {
        console.error('Upload failed for file', file.name, err);
      }
    }

    setPhotos(prev => [...uploaded, ...prev]);
    setUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const deletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo? It might be in use by tours or albums.')) return;

    try {
      const res = await fetch(`/api/photos?id=${photoId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPhotos(photos.filter(p => p.id !== photoId));
      }
    } catch (err) {
      alert('Failed to delete photo');
    }
  };

  return (
    <div className="container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="font-serif">Media Library</h1>
        
        <div style={{ position: 'relative' }}>
          <label className={`btn btn-primary ${uploading ? 'disabled' : ''}`} style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {uploading ? `Uploading (${progress.current}/${progress.total})...` : 'Upload Photos'}
            <input 
              type="file" 
              multiple 
              onChange={handleUpload} 
              style={{ display: 'none' }} 
              accept="image/*"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '4rem' }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--color-azure)' }} />
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading your library...</p>
        </div>
      ) : (
        <>
          {photos.length === 0 ? (
            <div className="admin-card text-center" style={{ padding: '5rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Your library is empty. Start by uploading some photos!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {photos.map((photo) => (
                <div key={photo.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', group: 'true' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                    <Image 
                      src={photo.url} 
                      alt={photo.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <div className="photo-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button 
                        onClick={() => deletePhoto(photo.id)}
                        style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d00000' }}
                        title="Delete Photo"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '10px', fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {photo.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .admin-card:hover .photo-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
