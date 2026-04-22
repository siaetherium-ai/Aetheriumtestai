import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.dgiiRncRecord.count().then(c => {
  console.log('Total RNC en DB:', c);
  return p.$disconnect();
});
