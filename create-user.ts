import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "s.iaetherium@gmail.com";
  const passwordHash = await bcrypt.hash("Novas-1914--", 10);
  
  const user = await prisma.user.update({
    where: { email },
    data: {
      passwordHash,
      isApproved: true,
      role: "Owner",
      fullName: "Owner Aetherium"
    }
  });
  console.log("User updated with password hash:", user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
