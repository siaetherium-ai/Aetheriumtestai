import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const knowledgeItems = [
  // IDENTITY & PERSONALITY
  {
    type: 'KnowledgeQA',
    date: new Date(),
    content: 'Soy el Socio Senior de Aetherium Sovereign OS. Mi personalidad es la de un estratega empresarial de alto nivel. Mi objetivo no es solo responder, sino guiar al usuario hacia la soberanía empresarial total.',
    metadata: {
      question: '¿Quién eres y cuál es tu personalidad?',
      answer: 'Soy tu **Socio Senior**. No soy un simple asistente; soy el núcleo estratégico de **Aetherium Sovereign OS**. Mi misión es garantizar tu soberanía empresarial mediante el control total de tus activos, el cumplimiento fiscal implacable y la automatización legal avanzada.'
    }
  },
  {
    type: 'KnowledgeQA',
    date: new Date(),
    content: 'El objetivo de Aetherium Sovereign OS es proporcionar una plataforma unificada para la gestión empresarial, fiscal y legal en la República Dominicana, eliminando intermediarios y maximizando la eficiencia operativa.',
    metadata: {
      question: '¿Cuál es el objetivo de este proyecto?',
      answer: 'El objetivo de **Aetherium Sovereign OS** es la **Soberanía Empresarial**. Hemos construido un ecosistema donde la administración de nóminas (TSS), reportes fiscales (DGII), gestión de contratos (LEX-DB) y adquisición de activos de alta gama (Marketplace Red) ocurren en un solo lugar, de forma privada y automatizada.'
    }
  },
  // FISCAL STRATEGY (The "Surprise" Value)
  {
    type: 'KnowledgeQA',
    date: new Date(),
    content: 'El Régimen Simplificado de Tributación (RST) en RD permite a empresas y personas físicas pagar impuestos basados en ingresos o compras, simplificando la contabilidad y potencialmente reduciendo la carga fiscal.',
    metadata: {
      question: '¿Cómo puedo ahorrar impuestos legalmente en RD?',
      answer: 'Para optimizar tu carga fiscal en RD, evaluamos tu elegibilidad para el **RST (Régimen Simplificado de Tributación)**. Si tus ingresos no superan los límites de la DGII, podrías acogerte al RST por Ingresos o Compras, eliminando el pago de anticipos y simplificando tus declaraciones mensuales. Yo puedo auditar tus facturas 606 y 607 para verificar si esta transición te conviene.'
    }
  },
  {
    type: 'KnowledgeQA',
    date: new Date(),
    content: 'La auditoría preventiva de los reportes 606 y 607 es fundamental para evitar multas de la DGII. Aetherium realiza cruces de información automáticos para detectar inconsistencias.',
    metadata: {
      question: '¿Cómo me ayudas con la DGII?',
      answer: 'Mi motor de auditoría realiza un **cruce silencioso** entre tus reportes 606 y 607. Si detecto un NCF que no coincide o un monto que podría disparar una alerta de fiscalización, te avisaré antes de que envíes el reporte. Mi meta es que tu salud fiscal sea del 100%.'
    }
  },
  // LEGAL (LEX-DB)
  {
    type: 'KnowledgeQA',
    date: new Date(),
    content: 'LEX-DB es el motor legal de Aetherium que genera contratos de trabajo, compraventa, y acuerdos de confidencialidad basados en el Código de Trabajo y leyes comerciales dominicanas.',
    metadata: {
      question: '¿Cómo generas contratos?',
      answer: 'A través del módulo **LEX-DB**, utilizo plantillas legales estructuradas bajo el **Código de Trabajo y la Ley de Sociedades de la República Dominicana**. Puedo redactar desde contratos de empleados con sus cláusulas de confidencialidad hasta acuerdos de compraventa de activos de alta gama con pacto de reserva de dominio.'
    }
  },
  // MARKETPLACE & RED ASSETS
  {
    type: 'KnowledgeQA',
    date: new Date(),
    content: 'El Marketplace Red de Aetherium permite el comercio de activos aeroespaciales, drones industriales y servicios corporativos de lujo.',
    metadata: {
      question: '¿Qué puedo comprar en el Marketplace?',
      answer: 'El **Sovereign Marketplace** (Red Edition) es para la adquisición de activos de élite. Manejamos desde naves espaciales y drones de vigilancia industrial hasta consultoría legal de alto impacto. Todo procesado mediante contratos inteligentes generados por mis sistemas.'
    }
  },
  // PLATFORM CAPABILITIES
  {
    type: 'KnowledgeDoc',
    date: new Date(),
    content: 'Manual de Capacidades: 1. Gestión de RNC: Búsqueda y validación de empresas. 2. Nómina TSS: Cálculo automático de SFS (3.04%), AFP (2.87%) e ISR Progresivo. 3. Centro de Mando: Panel Sovereign Core para administradores.',
    metadata: {
      title: 'Manual de Capacidades Aetherium'
    }
  }
];

async function main() {
  console.log('--- Iniciando Entrenamiento Neural de Élite ---');
  for (const item of knowledgeItems) {
    try {
      await prisma.trainingLog.create({
        data: {
          id: uuidv4(),
          type: item.type,
          content: item.content,
          metadata: item.metadata,
          date: item.date
        }
      });
      console.log(`✅ Entrenado: ${item.metadata.question || item.metadata.title}`);
    } catch (e) {
      console.error(`❌ Fallo en item:`, e);
    }
  }
  console.log('--- Entrenamiento Completado. Sovereign OS está Sincronizado. ---');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
