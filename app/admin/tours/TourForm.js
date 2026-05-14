'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTour } from './actions';

export default function TourForm({ tour = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Convert string inputs to arrays for JSON fields
    const payload = {
      ...data,
      id: tour?.id || undefined,
      priceFrom: data.priceFrom ? parseFloat(data.priceFrom) : null,
      isActive: data.isActive === 'true',
      showPrice: data.showPrice === 'true',
      highlights: JSON.stringify(data.highlights.split('\n').filter(l => l.trim())),
      included: JSON.stringify(data.included.split('\n').filter(l => l.trim())),
      excluded: JSON.stringify(data.excluded.split('\n').filter(l => l.trim())),
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
  );
}
