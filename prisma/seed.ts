import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Aetherium AI Dominican Data...');

  // 0. Initial Owner User
  const ownerEmail = 's.iaetherium@gmail.com';
  const hashedPassword = await bcrypt.hash('Aetherium2026!', 10);
  
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      email: ownerEmail,
      passwordHash: hashedPassword,
      fullName: 'Aetherium Owner',
      role: 'Owner',
      isApproved: true
    }
  });

  // 1. RNC Registry
  const rncs = [
    { rnc: '131000001', name: 'BANCO POPULAR DOMINICANO', status: 'ACTIVO', activity: 'BANCOS MULTIPLES', paymentRegime: 'NORMAL' },
    { rnc: '101010632', name: 'CERVECERIA NACIONAL DOMINICANA', status: 'ACTIVO', activity: 'FABRICACION DE CERVEZA', paymentRegime: 'NORMAL' },
    { rnc: '101001579', name: 'GRUPO RAMOS', status: 'ACTIVO', activity: 'SUPERMERCADOS', paymentRegime: 'NORMAL' },
  ];

  for (const rnc of rncs) {
    await prisma.rncRegistry.upsert({
      where: { rnc: rnc.rnc },
      update: rnc,
      create: rnc,
    });
  }

  // 2. Global Legal Templates
  const templates = [
    { name: 'Contrato de Trabajo Indefinido', content: '# CONTRATO DE TRABAJO\nEntre {{empresa}} y {{empleado}}...', isGlobal: true, companyId: null },
    { name: 'Acta de Asamblea Ordinaria Anual', content: '# ACTA DE ASAMBLEA\nEn la ciudad de Santo Domingo...', isGlobal: true, companyId: null },
    { name: 'Acuerdo de Confidencialidad (NDA)', content: '# ACUERDO DE CONFIDENCIALIDAD\nEste acuerdo protege...', isGlobal: true, companyId: null },
  ];

  for (const template of templates) {
    await prisma.legalTemplate.create({
      data: template,
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
