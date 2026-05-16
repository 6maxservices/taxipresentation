'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveFAQ(data) {
  try {
    const faq = data.id 
      ? await prisma.fAQ.update({
          where: { id: data.id },
          data: {
            question: data.question,
            answer: data.answer,
            sortOrder: data.sortOrder || 0
          }
        })
      : await prisma.fAQ.create({
          data: {
            question: data.question,
            answer: data.answer,
            sortOrder: data.sortOrder || 0
          }
        });

    revalidatePath('/faq');
    revalidatePath('/admin/faq');
    return { success: true, faq };
  } catch (err) {
    console.error('FAQ save error', err);
    return { success: false, error: err.message };
  }
}

export async function deleteFAQ(id) {
  try {
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath('/faq');
    revalidatePath('/admin/faq');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
