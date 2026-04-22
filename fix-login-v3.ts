import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 's.iaetherium@gmail.com';
  const password = 'Novas-19--';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('--- Restaurando Acceso Maestro ---');

  try {
    // 1. Obtener el ID real de Auth (para que coincidan)
    const authUsers: any[] = await prisma.$queryRawUnsafe(
      'SELECT id FROM auth.users WHERE email = $1', email
    );

    let userId = authUsers.length > 0 ? authUsers[0].id : 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // 2. Crear/Actualizar en la tabla que el servidor realmente consulta
    await prisma.$executeRawUnsafe(`
      INSERT INTO public.users (id, email, password_hash, fullname, role, isapproved)
      VALUES ($1::uuid, $2, $3, 'Owner Aetherium', 'Owner', true)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = $3, role = 'Owner', isapproved = true, id = $1::uuid
    `, userId, email, hashedPassword);

    console.log('✅ Usuario inyectado en tabla pública con hash bcrypt.');
    console.log('✅ Ahora puedes intentar loguearte.');

  } catch (e: any) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
