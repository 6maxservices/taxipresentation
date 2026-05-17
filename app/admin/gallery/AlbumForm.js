'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveAlbum } from './actions';
import Image from 'next/image';

export default function AlbumForm({ album = null, tours = [], transfers = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allPhotos, setAllPhotos] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [photos, setPhotos] = useState(album?.photos || []);
  const uploadRef = useRef(null);

  useEffect(() => {
    async function fetchPhotos() {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setAllPhotos(data.photos || []);
    }
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) uploaded.push(data);
      } catch (err) {
        console.error('Upload failed for', file.name, err);
      }
    }

    setAllPhotos(prev => [...uploaded, ...prev]);
    setPhotos(prev => [
      ...prev,
      ...uploaded.map((p, i) => ({ url: p.url, sortOrder: prev.length + i, caption: '' }))
    ]);
    setLoading(false);
    e.target.value = '';
  };

  const addPhoto = (url) => {
    setPhotos([...photos, { url, sortOrder: photos.length, caption: '' }]);
    setShowLibrary(false);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      ...data,
      id: album?.id || undefined,
      isPublic: data.isPublic === 'true',
      isTrip: data.isTrip === 'true',
      photos: photos,
      tourId: data.tourId || null,
      transferId: data.transferId || null,
    };

    const result = await saveAlbum(payload);

    if (result.success) {
      router.push('/admin/gallery');
      router.refresh();
    } else {
      setError(result.error || 'Failed to save album');
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="admin-card">
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <div className="form-group">
          <label>Album Title</label>
          <input name="title" defaultValue={album?.title} required placeholder="e.g. Athens Highlights" />
        </div>

        <div className="form-group">
          <label>Slug (URL name)</label>
          <input name="slug" defaultValue={album?.slug} required placeholder="e.g. athens-highlights" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" defaultValue={album?.description} rows="3" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Link to Tour</label>
            <select name="tourId" defaultValue={album?.tourId || ''}>
              <option value="">None</option>
              {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Link to Transfer</label>
            <select name="transferId" defaultValue={album?.transferId || ''}>
              <option value="">None</option>
              {transfers.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="isPublic" value="true" defaultChecked={album ? album.isPublic : true} />
            Public in Gallery
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="isTrip" value="true" defaultChecked={album ? album.isTrip : false} />
            Client Trip Album
          </label>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 className="font-serif" style={{ marginBottom: '1rem' }}>Photos ({photos.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {photos.map((p, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Album" />
                <button type="button" onClick={() => removePhoto(i)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-outline" onClick={() => setShowLibrary(true)}>+ Add Photos to Album</button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
            {loading ? 'Saving...' : 'Save Album'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-outline" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>

      {showLibrary && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 className="font-serif">Select Photo</h2>
              <button onClick={() => setShowLibrary(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => uploadRef.current?.click()}>
                {loading ? 'Uploading...' : '+ Upload New Photo'}
              </button>
              <input ref={uploadRef} type="file" multiple onChange={handleUpload} accept="image/*" style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
              {allPhotos.map((photo, i) => {
                const isSelected = photos.some(p => p.url === photo.url);
                return (
                  <div key={i} onClick={() => addPhoto(photo.url)} style={{ position: 'relative', aspectRatio: '1', cursor: 'pointer', borderRadius: '4px', overflow: 'hidden', outline: isSelected ? '3px solid #28a745' : 'none' }}>
                    <Image src={photo.url} fill className="object-cover" alt="Library" />
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 4, right: 4, background: '#28a745', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
