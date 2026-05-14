'use client';
import { useTransition } from 'react';
import { toggleTransferActive } from './actions';

export default function TransferToggle({ transferId, isActive }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTransferActive(transferId, isActive);
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
