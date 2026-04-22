import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding columns to public schema...');
  
  try {
    // Add columns to User table
    await prisma.$executeRawUnsafe(`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMP WITH TIME ZONE`);
    
    // Add columns to Company table
    await prisma.$executeRawUnsafe(`ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS sector TEXT`);
    
    // Ensure RncRegistry has the correct column naming in the DB
    // (Using lowercase paymentregime in DB, but model will map to it)
    await prisma.$executeRawUnsafe(`ALTER TABLE public.rnc_registry ADD COLUMN IF NOT EXISTS paymentregime TEXT`);

    // Ensure LegalTemplate has isglobal
    await prisma.$executeRawUnsafe(`ALTER TABLE public.legal_templates ADD COLUMN IF NOT EXISTS isglobal BOOLEAN DEFAULT false`);

    console.log('✅ Columns added successfully.');
  } catch (error) {
    console.error('Error adding columns:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
