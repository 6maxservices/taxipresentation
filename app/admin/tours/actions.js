'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleTourActive(tourId, currentStatus) {
  try {
    await prisma.tour.update({
      where: { id: tourId },
      data: { isActive: !currentStatus },
    });
    
    // Revalidate tours pages
    revalidatePath('/admin/tours');
    revalidatePath('/tours');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle tour:', error);
    return { error: 'Failed to update tour' };
  }
}

export async function saveTour(data) {
  try {
    const { id, ...payload } = data;
    
    if (id) {
      // Update existing
      await prisma.tour.update({
        where: { id },
        data: payload
      });
    } else {
      // Create new
      await prisma.tour.create({
        data: payload
      });
    }

    revalidatePath('/admin/tours');
    revalidatePath('/tours');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save tour:', error);
    return { error: error.message || 'Failed to save tour' };
  }
}

export async function deleteTour(id) {
  try {
    // Delete associated photos first
    await prisma.tourPhoto.deleteMany({ where: { tourId: id } });
    await prisma.tour.delete({ where: { id } });
    
    revalidatePath('/admin/tours');
    revalidatePath('/tours');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete tour:', error);
    return { error: 'Failed to delete tour' };
  }
}
