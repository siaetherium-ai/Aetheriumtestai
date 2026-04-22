import { PrismaClient } from '@prisma/client';

// Hardcoded for diagnostic purposes
const url = "postgresql://postgres.apeevlmoooanlnmwylyi:Altagracia190599%21%3D@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url
    }
  }
});

async function main() {
  console.log('Testing connection to hardcoded direct URL...');
  try {
    await prisma.$connect();
    console.log('✅ Connected!');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Users found:', users.length);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
