'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function logBookingAction(bookingId, action, message) {
  try {
    await prisma.bookingLog.create({
      data: {
        bookingId,
        action,
        message
      }
    });
  } catch (error) {
    console.error('Failed to create booking log:', error);
  }
}

export async function updateBookingStatus(bookingId, newStatus) {
  try {
    const oldBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { status: true }
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    await logBookingAction(
      bookingId, 
      'STATUS_CHANGE', 
      `Status changed from ${oldBooking?.status || 'UNKNOWN'} to ${newStatus}`
    );
    
    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { error: 'Failed to update status' };
  }
}

export async function getBookingLogs(bookingId) {
  try {
    return await prisma.bookingLog.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch booking logs:', error);
    return [];
  }
}
