'use client';
import { useState, useTransition } from 'react';
import { toggleTourActive } from './actions';

export default function TourToggle({ tourId, isActive }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTourActive(tourId, isActive);
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`btn ${isActive ? 'btn-outline' : 'btn-primary'}`}
      style={{ padding: '4px 12px', fontSize: '0.875rem' }}
    >
      {isPending ? 'Updating...' : (isActive ? 'Disable' : 'Enable')}
    </button>
  );
}
