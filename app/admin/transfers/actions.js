'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveTransfer(data) {
  try {
    const { id, ...payload } = data;
    
    if (id) {
      await prisma.transfer.update({
        where: { id },
        data: payload
      });
    } else {
      await prisma.transfer.create({
        data: payload
      });
    }

    revalidatePath('/admin/transfers');
    revalidatePath('/transfers');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save transfer:', error);
    return { error: error.message || 'Failed to save transfer' };
  }
}

export async function toggleTransferActive(transferId, currentStatus) {
  try {
    await prisma.transfer.update({
      where: { id: transferId },
      data: { isActive: !currentStatus },
    });
    
    revalidatePath('/admin/transfers');
    revalidatePath('/transfers');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle transfer:', error);
    return { error: 'Failed to update transfer' };
  }
}

export async function deleteTransfer(id) {
  try {
    await prisma.transfer.delete({ where: { id } });
    
    revalidatePath('/admin/transfers');
    revalidatePath('/transfers');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete transfer:', error);
    return { error: 'Failed to delete transfer' };
  }
}
