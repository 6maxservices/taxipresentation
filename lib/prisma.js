import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

const getPrismaClient = () => {
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
