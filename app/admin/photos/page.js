'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Loader2 } from 'lucide-react';

export default function MediaLibrary() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [uploadErrors, setUploadErrors] = useState([]);
  const fileInputRef = useRef(null);

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
    setUploadErrors([]);

    const uploaded = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);

      try {
        // Step 1: get a presigned PUT URL from the server
        const presignRes = await fetch(
          `/api/upload/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type || 'image/jpeg')}`
        );
        if (!presignRes.ok) throw new Error('Could not get upload URL');
        const { uploadUrl, publicUrl } = await presignRes.json();

        // Step 2: PUT the file directly to R2 (no Vercel size limit)
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        });
        if (!putRes.ok) throw new Error(`R2 rejected upload (${putRes.status})`);

        // Step 3: register the URL in the database
        const registerRes = await fetch('/api/upload/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: publicUrl, name: file.name }),
        });
        const data = await registerRes.json();
        if (data.success) {
          uploaded.push(data);
        } else {
          errors.push(`${file.name}: ${data.error || 'Failed to save'}`);
        }
      } catch (err) {
        errors.push(`${file.name} (${sizeMB}MB): ${err.message || 'Upload failed'}`);
        console.error('Upload failed for', file.name, err);
      }

      setProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setPhotos(prev => [...uploaded, ...prev]);
    setUploadErrors(errors);
    setUploading(false);
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

        <div>
          <button
            className={`btn btn-primary ${uploading ? 'disabled' : ''}`}
            style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => !uploading && fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {uploading ? `Uploading ${progress.current}/${progress.total}...` : 'Upload Photos'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </div>
      </div>

      {uploadErrors.length > 0 && (
        <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <strong style={{ color: '#856404' }}>Some photos failed to upload:</strong>
          <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#856404' }}>
            {uploadErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

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
                <div key={photo.id} className="admin-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
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
