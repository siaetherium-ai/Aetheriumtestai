import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Adding missing columns to public.users...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMPTZ(6);`);
    console.log("Column session_started_at added.");
  } catch (error) {
    console.error("Failed to add session_started_at:", error);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
