import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const email = 's.iaetherium@gmail.com';
  const pass = 'Novas-19--';
  const hash = await bcrypt.hash(pass, 10);

  console.log('--- Corrigiendo Permisos y Acceso (Auto-Fix) ---');
  try {
    // 1. DESACTIVAR RLS en la tabla users
    console.log('Desactivando RLS en public.users...');
    await prisma.$executeRawUnsafe(`ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;`);
    
    // 2. RE-INYECTAR USUARIO
    console.log('Inyectando usuario Maestro...');
    
    // Intentamos obtener el ID de auth.users si existe, si no generamos uno
    const authUsers: any[] = await prisma.$queryRawUnsafe('SELECT id FROM auth.users WHERE email = $1', email);
    const userId = authUsers.length > 0 ? authUsers[0].id : 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    await prisma.$executeRawUnsafe(`
      INSERT INTO public.users (id, email, password_hash, fullname, role, isapproved)
      VALUES ($1::uuid, $2, $3, 'Owner Aetherium', 'Owner', true)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = $3, role = 'Owner', isapproved = true, id = $1::uuid
    `, userId, email, hash);

    console.log('✅ TODO LISTO: RLS desactivado y usuario inyectado.');
    console.log('Email: ' + email);
    console.log('Contraseña: ' + pass);

  } catch (e: any) {
    console.error('❌ Error crítico:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
