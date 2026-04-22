import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 's.iaetherium@gmail.com';
  const password = 'Novas-1914--';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.$connect();
    console.log('✅ Connected!');
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword }
      });
      console.log('✅ Updated public.users password_hash for owner.');
    } else {
      console.log('❌ User not found in public.users');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
