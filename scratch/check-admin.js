const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: 'george@example.com' }
    });
    
    if (admin) {
      console.log('ADMIN_FOUND');
      console.log('Email:', admin.email);
      console.log('Hash Prefix:', admin.passwordHash.substring(0, 10));
    } else {
      console.log('ADMIN_NOT_FOUND');
    }
  } catch (err) {
    console.error('DIAGNOSTIC_ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
