import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to:', process.env.DATABASE_URL);
  try {
    await prisma.$connect();
    console.log('✅ Connected!');
    
    // Check schemas
    const schemas = await prisma.$queryRaw`SELECT schema_name FROM information_schema.schemata`;
    console.log('Schemas:', schemas);
    
    // Check tables in public
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables in public:', tables);

    fs.writeFileSync('db_diagnostic_raw.txt', JSON.stringify({ schemas, tables }, null, 2));
    
  } catch (error: any) {
    fs.writeFileSync('db_diagnostic_error.txt', JSON.stringify({ 
      message: error.message, 
      code: error.code, 
      stack: error.stack
    }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main();
