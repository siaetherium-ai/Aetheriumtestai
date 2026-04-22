import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."trial_access" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "ip_address" TEXT NOT NULL,
        "first_access" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_blocked" BOOLEAN NOT NULL DEFAULT false,

        CONSTRAINT "trial_access_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "trial_access_ip_address_key" ON "public"."trial_access"("ip_address");
    `);

    console.log("✅ Table 'trial_access' created or already exists.");
  } catch (error) {
    console.error("❌ Error creating table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
