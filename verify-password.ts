import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "s.iaetherium@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
    select: { passwordHash: true }
  });

  if (!user) {
    console.log("RESULT:USER_NOT_FOUND");
    return;
  }

  const storedHash = user.passwordHash;
  const passwords = ["Aetherium2026!", "Novas-1914--"];
  
  for (const pw of passwords) {
    const isMatch = await bcrypt.compare(pw, storedHash);
    console.log(`RESULT:PW[${pw}]:MATCH[${isMatch}]`);
  }

  await prisma.$disconnect();
}

main();
