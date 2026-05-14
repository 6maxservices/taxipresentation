'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateBookingStatus(bookingId, newStatus) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });
    
    // Revalidate the bookings list page and dashboard
    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { error: 'Failed to update status' };
  }
}
