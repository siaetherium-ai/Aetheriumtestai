import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Checking Database State ---');
    
    // Check if auth.users exists
    const authUser = await prisma.$queryRawUnsafe(`
      SELECT id, email, encrypted_password FROM auth.users WHERE email = 's.iaetherium@gmail.com'
    `);
    console.log('Auth User:', authUser);

    // Check if public.users exists
    const publicUser = await prisma.user.findUnique({
      where: { email: 's.iaetherium@gmail.com' }
    });
    console.log('Public User:', publicUser);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
