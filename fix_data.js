const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting data fixes...');

    // 1. Fix the Athens-Sounio tour text
    const sounioTour = await prisma.tour.findFirst({
      where: {
        slug: {
          contains: 'athens-sounio',
          mode: 'insensitive'
        }
      }
    });

    if (sounioTour) {
      const updatedDesc = sounioTour.description.replace('1-4 persons', 'all group sizes');
      await prisma.tour.update({
        where: { id: sounioTour.id },
        data: { description: updatedDesc }
      });
      console.log('✅ Updated Athens-Sounio description (removed "1-4 persons").');
    } else {
      console.log('⚠️ Could not find Athens-Sounio tour.');
    }

    // 2. Deactivate the Test tour
    const testTour = await prisma.tour.findFirst({
      where: {
        title: {
          contains: 'Test',
          mode: 'insensitive'
        }
      }
    });

    if (testTour) {
      await prisma.tour.update({
        where: { id: testTour.id },
        data: { isActive: false }
      });
      console.log('✅ Deactivated the "Test" tour.');
    } else {
      console.log('⚠️ Could not find Test tour.');
    }

  } catch (error) {
    console.error('Error fixing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
