'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveTour } from './actions';
import Image from 'next/image';

export default function TourForm({ tour = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allPhotos, setAllPhotos] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeType, setActiveType] = useState(null);

  const [photos, setPhotos] = useState(tour?.photos || []);
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
      ...uploaded.map((p, i) => ({
        url: p.url,
        type: activeType,
        sortOrder: prev.filter(ph => ph.type === activeType).length + i
      }))
    ]);
    setLoading(false);
    e.target.value = '';
  };

  const addPhoto = (url) => {
    if (!activeType) return;
    
    if (activeType === 'MAIN') {
      // Replace main photo
      setPhotos([
        { url, type: 'MAIN', sortOrder: 0 },
        ...photos.filter(p => p.type !== 'MAIN')
      ]);
    } else if (activeType === 'MOSAIC') {
      const currentMosaic = photos.filter(p => p.type === 'MOSAIC');
      if (currentMosaic.length >= 6) return;
      setPhotos([
        ...photos,
        { url, type: 'MOSAIC', sortOrder: currentMosaic.length }
      ]);
    } else {
      const currentGallery = photos.filter(p => p.type === 'GALLERY');
      setPhotos([
        ...photos,
        { url, type: 'GALLERY', sortOrder: currentGallery.length }
      ]);
    }
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
      id: tour?.id || undefined,
      priceFrom: data.priceFrom ? parseFloat(data.priceFrom) : null,
      isActive: data.isActive === 'true',
      showPrice: data.showPrice === 'true',
      highlights: JSON.stringify(data.highlights.split('\n').filter(l => l.trim())),
      included: JSON.stringify(data.included.split('\n').filter(l => l.trim())),
      excluded: JSON.stringify(data.excluded.split('\n').filter(l => l.trim())),
      photos: photos // Pass the photo array
    };

    const result = await saveTour(payload);

    if (result.success) {
      router.push('/admin/tours');
      router.refresh();
    } else {
      setError(result.error || 'Failed to save tour');
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="admin-card">
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <div className="form-group">
          <label>Tour Title</label>
          <input name="title" defaultValue={tour?.title} required placeholder="e.g. Athens Highlights" />
        </div>

        <div className="form-group">
          <label>Slug (URL name)</label>
          <input name="slug" defaultValue={tour?.slug} required placeholder="e.g. athens-highlights" />
        </div>

        {/* Photos Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="font-serif" style={{ marginBottom: '1rem' }}>Product Photos</h3>
          
          {/* Main Photo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Main Photo (Card)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {photos.find(p => p.type === 'MAIN') ? (
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                  <Image src={photos.find(p => p.type === 'MAIN').url} fill className="object-cover rounded" alt="Main" />
                  <button type="button" onClick={() => removePhoto(photos.findIndex(p => p.type === 'MAIN'))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
                </div>
              ) : (
                <div style={{ width: '120px', height: '120px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#666' }}>No Main</div>
              )}
              <button type="button" className="btn btn-outline" onClick={() => { setActiveType('MAIN'); setShowLibrary(true); }}>Change Main Photo</button>
            </div>
          </div>

          {/* Mosaic Photos */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Top Mosaic (Max 6)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {photos.filter(p => p.type === 'MOSAIC').map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                  <Image src={p.url} fill className="object-cover rounded" alt="Mosaic" />
                  <button type="button" onClick={() => removePhoto(photos.indexOf(p))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}>×</button>
                </div>
              ))}
            </div>
            {photos.filter(p => p.type === 'MOSAIC').length < 6 && (
              <button type="button" className="btn btn-outline" style={{ fontSize: '0.875rem' }} onClick={() => { setActiveType('MOSAIC'); setShowLibrary(true); }}>+ Add Mosaic Photo</button>
            )}
          </div>

          {/* Gallery Photos */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>Bottom Gallery (Unlimited)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {photos.filter(p => p.type === 'GALLERY').map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                  <Image src={p.url} fill className="object-cover rounded" alt="Gallery" />
                  <button type="button" onClick={() => removePhoto(photos.indexOf(p))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}>×</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline" style={{ fontSize: '0.875rem' }} onClick={() => { setActiveType('GALLERY'); setShowLibrary(true); }}>+ Add Gallery Photo</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Category</label>
            <select name="category" defaultValue={tour?.category || 'DAY_TOUR'}>
              <option value="DAY_TOUR">Day Tour</option>
              <option value="MULTI_DAY">Multi-Day Tour</option>
              <option value="CUSTOM">Custom/Private</option>
            </select>
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input name="duration" defaultValue={tour?.duration} placeholder="e.g. 8 hours" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Price From (€)</label>
            <input name="priceFrom" type="number" defaultValue={tour?.priceFrom} placeholder="e.g. 260" />
          </div>
          <div className="form-group">
            <label>Distance</label>
            <input name="distance" defaultValue={tour?.distance} placeholder="e.g. 160km" />
          </div>
        </div>

        <div className="form-group">
          <label>Short Description (Card text)</label>
          <textarea name="shortDesc" defaultValue={tour?.shortDesc} rows="2" required />
        </div>

        <div className="form-group">
          <label>Full Description (Markdown/Text)</label>
          <textarea name="description" defaultValue={tour?.description} rows="6" required />
        </div>

        <div className="form-group">
          <label>Highlights (One per line)</label>
          <textarea 
            name="highlights" 
            defaultValue={tour ? JSON.parse(tour.highlights).join('\n') : ''} 
            rows="5" 
          />
        </div>

        <div className="form-group">
          <label>Included (One per line)</label>
          <textarea 
            name="included" 
            defaultValue={tour ? JSON.parse(tour.included).join('\n') : ''} 
            rows="4" 
          />
        </div>

        <div className="form-group">
          <label>Excluded (One per line)</label>
          <textarea 
            name="excluded" 
            defaultValue={tour ? JSON.parse(tour.excluded).join('\n') : ''} 
            rows="3" 
          />
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="isActive" value="true" defaultChecked={tour ? tour.isActive : true} />
            Visible on Site
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="showPrice" value="true" defaultChecked={tour ? tour.showPrice : true} />
            Show Price
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
            {loading ? 'Saving...' : 'Save Tour'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-outline" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>

      {/* Photo Library Modal */}
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
                const isSelected = photos.some(p => p.url === photo.url && p.type === activeType);
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
