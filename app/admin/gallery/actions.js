'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveAlbum(data) {
  try {
    const { id, photos, ...payload } = data;
    
    let result;
    if (id) {
      result = await prisma.$transaction(async (tx) => {
        const album = await tx.galleryAlbum.update({
          where: { id },
          data: payload
        });
        
        await tx.galleryPhoto.deleteMany({ where: { albumId: id } });
        
        if (photos && photos.length > 0) {
          await tx.galleryPhoto.createMany({
            data: photos.map(p => ({
              albumId: id,
              url: p.url,
              caption: p.caption || '',
              sortOrder: p.sortOrder || 0
            }))
          });
        }
        return album;
      });
    } else {
      result = await prisma.galleryAlbum.create({
        data: {
          ...payload,
          photos: {
            create: (photos || []).map(p => ({
              url: p.url,
              caption: p.caption || '',
              sortOrder: p.sortOrder || 0
            }))
          }
        }
      });
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/gallery');
    revalidatePath(`/gallery/${payload.slug}`);
    
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Failed to save album:', error);
    return { error: error.message || 'Failed to save album' };
  }
}

export async function deleteAlbum(id) {
  try {
    await prisma.galleryPhoto.deleteMany({ where: { albumId: id } });
    await prisma.galleryAlbum.delete({ where: { id } });
    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete album:', error);
    return { error: 'Failed to delete album' };
  }
}
