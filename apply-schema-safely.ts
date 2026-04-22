import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function applySafeUpgrades() {
  console.log("🚀 Iniciando actualización segura de la Base de Datos...");

  try {
    console.log("⚙️ 1. Alterando las restricciones de llave foránea en 'audit_logs' para habilitar CASCADE...");
    
    // Primero, eliminamos la restricción antigua (NoAction)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "public"."audit_logs"
      DROP CONSTRAINT IF EXISTS "audit_logs_companyid_fkey";
    `);
    
    // Luego, creamos la nueva restricción con ON DELETE CASCADE
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "public"."audit_logs"
      ADD CONSTRAINT "audit_logs_companyid_fkey" 
      FOREIGN KEY ("companyid") 
      REFERENCES "public"."companies"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    console.log("✅ Restricción en CASCADE aplicada. Error de borrado neutralizado.");

    console.log("⚙️ 2. Creando la nueva tabla master 'dgii_rnc_records'...");
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."dgii_rnc_records" (
          "rnc" TEXT NOT NULL,
          "razon_social" TEXT NOT NULL,
          "actividad_economica" TEXT,
          "fecha_inicio_operaciones" TEXT,
          "estado" TEXT,
          "regimen_pago" TEXT,
          "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "dgii_rnc_records_pkey" PRIMARY KEY ("rnc")
      );
    `);

    console.log("✅ Tabla de caché estructurada para DGII RNC creada con éxito.");

  } catch (error) {
    console.error("❌ Error aplicando actualizaciones de base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

applySafeUpgrades();
