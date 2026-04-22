-- ACTUALIZACIÓN DE BASE DE DATOS AETHERIUM V2: INTELIGENCIA FISCAL
-- Ejecute este script en su consola de PostgreSQL o Supabase

-- 1. Extensiones necesarias (si no existen)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla para Normativas Fiscales (RAG Legal Agent)
CREATE TABLE IF NOT EXISTS "public"."fiscal_norms" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL, -- Ley, Norma General, Aviso, Decreto
    "content" TEXT NOT NULL,
    "law_number" TEXT,
    "issue_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fiscal_norms_pkey" PRIMARY KEY ("id")
);

-- 3. Tabla para Sellos Electrónicos (e-Facturación)
CREATE TABLE IF NOT EXISTS "public"."electronic_stamps" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_id" UUID,
    "cert_type" TEXT NOT NULL DEFAULT 'FE-Persona Fisica',
    "cert_data" TEXT NOT NULL,
    "expiry_date" TIMESTAMPTZ(6) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "electronic_stamps_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "electronic_stamps_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- 4. Tabla para Resultados de Auditoría Cruzada (Auditoría Silenciosa)
CREATE TABLE IF NOT EXISTS "public"."cross_audit_results" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_id" UUID,
    "period" TEXT NOT NULL,
    "type" TEXT NOT NULL, -- ITBIS, 606vs607, RNC-Invalid
    "severity" TEXT NOT NULL DEFAULT 'Low',
    "description" TEXT NOT NULL,
    "discrepancy_amt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "details" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cross_audit_results_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cross_audit_results_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- 5. Actualización de Tabla de Empleados (TSS/SIRLA Support)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='sfs') THEN
        ALTER TABLE "public"."employees" ADD COLUMN "sfs" DOUBLE PRECISION DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='afp') THEN
        ALTER TABLE "public"."employees" ADD COLUMN "afp" DOUBLE PRECISION DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='arl') THEN
        ALTER TABLE "public"."employees" ADD COLUMN "arl" DOUBLE PRECISION DEFAULT 0;
    END IF;
END $$;

-- 6. Indices para velocidad de búsqueda de RNC (DGII Sync)
CREATE INDEX IF NOT EXISTS "idx_dgii_rnc_razon_social" ON "public"."dgii_rnc_records" USING GIN ("razon_social" gin_trgm_ops);
