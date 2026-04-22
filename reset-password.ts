import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "s.iaetherium@gmail.com";
  const password = "Aetherium2026!";
  const passwordHash = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        fullName: "Owner Aetherium"
      }
    });
    console.log(`Successfully reset password for ${user.email}`);
  } catch (error: any) {
    if (error.code === 'P2025') {
       // User not found, try creating it
       const user = await prisma.user.create({
         data: {
           email,
           passwordHash,
           fullName: "Owner Aetherium",
           role: "Admin"
         }
       });
       console.log(`Successfully created user ${user.email}`);
    } else {
      console.error("Error resetting password:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
