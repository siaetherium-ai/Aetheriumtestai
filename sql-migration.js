import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Aplicando cambios a la tabla public.companies vía SQL...");
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE public.companies 
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVO',
      ADD COLUMN IF NOT EXISTS employeecount INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS phone TEXT,
      ADD COLUMN IF NOT EXISTS email TEXT,
      ADD COLUMN IF NOT EXISTS paymentregime TEXT;
    `);
    console.log("✅ Columnas añadidas con éxito.");
  } catch (error) {
    console.error("❌ Error aplicando SQL:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
