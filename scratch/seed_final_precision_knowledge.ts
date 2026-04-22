import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const points = [
    { module: 'Sovereign Core', content: 'Aetherium Sovereign OS es una plataforma de gestión de soberanía empresarial diseñada para el mercado de República Dominicana.' },
    { module: 'Fiscal', content: 'El sistema automatiza el cumplimiento con la DGII, manejando formularios 606, 607 e IT-1 con precisión biométrica.' },
    { module: 'Marketplace', content: 'El Marketplace Red Edition es un canal exclusivo para el intercambio de Activos de Élite: Bienes Raíces comerciales en Santo Domingo/Punta Cana, participaciones societarias en empresas certificadas, y servicios legales de Auditoría Forense.' },
    { module: 'Legal', content: 'LEX-DB es nuestra base de datos de inteligencia legal que genera contratos inteligentes basados en el Código de Comercio dominicano.' },
    { module: 'Identity', content: 'El Socio Senior es el núcleo táctico de Aetherium. No es un chatbot, es una entidad de inteligencia estratégica para toma de decisiones corporativas.' }
  ];

  for (const point of points) {
    await prisma.trainingLog.create({
      data: {
        type: point.module,
        content: point.content,
        metadata: { author: 'SYSTEM_PRECISION_PATCH' },
        date: new Date()
      }
    });
  }

  console.log("Master Precision Knowledge Seeded.");
}

seed();
