'use client';
import { useState } from 'react';

export default function DeleteButton({ id, onDelete, label = "Delete" }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000); // Reset after 3s
      return;
    }

    setLoading(true);
    await onDelete(id);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        color: confirming ? '#d00000' : '#6c757d',
        fontSize: '0.8125rem',
        textDecoration: 'underline',
        cursor: 'pointer',
        padding: '0',
        fontWeight: confirming ? '700' : '400'
      }}
    >
      {loading ? 'Deleting...' : (confirming ? 'Confirm Delete?' : label)}
    </button>
  );
}
