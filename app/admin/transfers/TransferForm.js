'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveTransfer } from './actions';

export default function TransferForm({ transfer = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      ...data,
      id: transfer?.id || undefined,
      priceFrom: data.priceFrom ? parseFloat(data.priceFrom) : null,
      isActive: data.isActive === 'true',
      showPrice: data.showPrice === 'true',
    };

    const result = await saveTransfer(payload);

    if (result.success) {
      router.push('/admin/transfers');
      router.refresh();
    } else {
      setError(result.error || 'Failed to save transfer');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="form-group">
        <label>Transfer Title</label>
        <input name="title" defaultValue={transfer?.title} required placeholder="e.g. Airport to City Center" />
      </div>

      <div className="form-group">
        <label>Slug (URL name)</label>
        <input name="slug" defaultValue={transfer?.slug} required placeholder="e.g. airport-athens" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>From Area</label>
          <input name="fromArea" defaultValue={transfer?.fromArea} required placeholder="e.g. Athens Airport (ATH)" />
        </div>
        <div className="form-group">
          <label>To Area</label>
          <input name="toArea" defaultValue={transfer?.toArea} required placeholder="e.g. Athens City Center" />
        </div>
      </div>

      <div className="form-group">
        <label>Price From (€)</label>
        <input name="priceFrom" type="number" defaultValue={transfer?.priceFrom} placeholder="e.g. 50" />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" defaultValue={transfer?.description} rows="3" />
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" name="isActive" value="true" defaultChecked={transfer ? transfer.isActive : true} />
          Visible on Site
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" name="showPrice" value="true" defaultChecked={transfer ? transfer.showPrice : true} />
          Show Price
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
          {loading ? 'Saving...' : 'Save Transfer'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-outline" style={{ flex: 1 }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
