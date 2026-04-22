import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedManifesto() {
  const manifesto = [
    { type: 'Manifesto', content: 'Aetherium AI es un Sistema Operativo Soberano (Sovereign OS) concebido como una capa de inteligencia autónoma bajo el gobierno directo de la empresa.' },
    { type: 'Philosophy', content: 'La soberanía del dueño de un negocio está intrínsecamente ligada a la soberanía de su infraestructura digital. Los datos no se venden ni se usan para entrenar terceros.' },
    { type: 'Fiscal', content: 'Superpoder Fiscal: Automatiza 606 y 607, detecta errores de NCF antes de reportar a la DGII y gestiona plazos de cumplimiento.' },
    { type: 'HR', content: 'Superpoder de RR.HH.: Cálculos de nómina con rigor matemático, aplicando topes de TSS y escalas de ISR 2025-2026 en RD.' },
    { type: 'Legal', content: 'Superpoder Legal: Automatiza redacción de contratos y firmas digitales bajo la Ley 126-02 de Comercio Electrónico de RD.' },
    { type: 'Voice', content: 'Superpoder de Voz: Integración con ElevenLabs para interacción natural o clonada, narrando nóminas o resúmenes diarios.' },
    { type: 'Technical', content: 'Opera sobre la verdad del código (schema.prisma) y documentos propios (contexto 1M tokens) para evitar alucinaciones.' }
  ];

  for (const item of manifesto) {
    await prisma.trainingLog.create({
      data: {
        type: item.type,
        content: item.content,
        metadata: { source: 'USER_MANIFESTO_2026' }
      }
    });
  }

  console.log("Sovereign Manifesto Injected Successfully.");
}

seedManifesto();
