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
    const { id, photos, ...payload } = data;
    
    // Trim string fields to avoid 404s from trailing spaces
    if (payload.slug) payload.slug = payload.slug.trim();
    if (payload.title) payload.title = payload.title.trim();
    
    let result;
    if (id) {
      // Update existing
      result = await prisma.$transaction(async (tx) => {
        // Update tour data
        const tour = await tx.tour.update({
          where: { id },
          data: payload
        });

        // Delete old photos
        await tx.tourPhoto.deleteMany({ where: { tourId: id } });

        // Create new photos
        if (photos && photos.length > 0) {
          await tx.tourPhoto.createMany({
            data: photos.map(p => ({
              tourId: id,
              url: p.url,
              type: p.type || 'GALLERY',
              sortOrder: p.sortOrder || 0
            }))
          });
        }
        return tour;
      });
    } else {
      // Create new
      result = await prisma.tour.create({
        data: {
          ...payload,
          photos: {
            create: (photos || []).map(p => ({
              url: p.url,
              type: p.type || 'GALLERY',
              sortOrder: p.sortOrder || 0
            }))
          }
        }
      });
    }

    revalidatePath('/admin/tours');
    revalidatePath('/tours');
    revalidatePath(`/tours/${payload.slug}`);
    revalidatePath('/');
    
    return { success: true, id: result.id };
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
