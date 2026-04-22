import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = 's.iaetherium@gmail.com';
  const hashedPassword = await bcrypt.hash('Aetherium2026!', 10);
  try {
    await prisma.$connect();
    console.log('✅ Connected!');
    
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: '00000000-0000-0000-0000-000000000001',
          email: ownerEmail,
          passwordHash: hashedPassword,
          fullName: 'Aetherium Owner',
          role: 'Owner',
          isApproved: true
        }
      });
      console.log('✅ User created!');
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword, role: 'Owner', isApproved: true }
      });
      console.log('✅ User updated!');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
