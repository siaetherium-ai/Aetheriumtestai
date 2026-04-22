import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Deep Inspection ---');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

    const authUsers: any[] = await prisma.$queryRawUnsafe('SELECT id, email, encrypted_password, email_confirmed_at, last_sign_in_at FROM auth.users');
    console.log('Auth Users Count:', authUsers.length);
    authUsers.forEach(u => {
      console.log(`User ID: ${u.id}`);
      console.log(`Email: ${u.email}`);
      console.log(`Email Confirmed: ${u.email_confirmed_at}`);
      console.log(`Last Sign In: ${u.last_sign_in_at}`);
      console.log(`Password Hash Prefix: ${u.encrypted_password ? u.encrypted_password.substring(0, 10) : 'NULL'}`);
      console.log('---');
    });

    const publicUsers = await (prisma as any).users.findMany();
    console.log('Public Users:', publicUsers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
