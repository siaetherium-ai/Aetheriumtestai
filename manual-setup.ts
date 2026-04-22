import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected!');

    // Create User table if missing
    // We'll use a simplified version for now to unblock login
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        fullname TEXT,
        role TEXT DEFAULT 'Free',
        isapproved BOOLEAN DEFAULT false,
        last_login_at TIMESTAMPTZ(6),
        premium_until TIMESTAMPTZ(6),
        created_at TIMESTAMPTZ(6) DEFAULT now(),
        session_started_at TIMESTAMPTZ(6)
      );
    `);
    console.log('✅ User table checked/created.');

    // Seed owner
    const ownerEmail = 's.iaetherium@gmail.com';
    const hashedPassword = await bcrypt.hash('Aetherium2026!', 10);
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO public.users (email, password_hash, fullname, role, isapproved)
      VALUES ('${ownerEmail}', '${hashedPassword}', 'Aetherium Owner', 'Owner', true)
      ON CONFLICT (email) DO UPDATE SET password_hash = '${hashedPassword}', role = 'Owner', isapproved = true;
    `);
    console.log('✅ Owner user seeded.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
