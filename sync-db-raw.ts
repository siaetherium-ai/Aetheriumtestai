import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Aetherium DB Synchronizer (Raw SQL Edition) ---');

  const queries = [
    // 1. System Settings
    `CREATE TABLE IF NOT EXISTS "public"."system_settings" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "ai_model" TEXT DEFAULT 'gemini-1.5-flash',
      "language" TEXT DEFAULT 'es',
      "notifications_enabled" BOOLEAN DEFAULT true,
      "ai_voice_enabled" BOOLEAN DEFAULT true,
      "elevenlabs_api_key" TEXT,
      "elevenlabs_voice_id" TEXT DEFAULT '21m00Tcm4TlvDq8ikWAM',
      "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
    );`,

    // 2. Training Logs
    `CREATE TABLE IF NOT EXISTS "public"."training_logs" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "type" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "metadata" JSONB,
      CONSTRAINT "training_logs_pkey" PRIMARY KEY ("id")
    );`,

    // 3. Documents (Digital Locker)
    `CREATE TABLE IF NOT EXISTS "public"."documents" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "company_id" UUID,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "content" TEXT,
      "storage_path" TEXT,
      "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "documents_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    );`,

    // 4. Employees
    `CREATE TABLE IF NOT EXISTS "public"."employees" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "company_id" UUID,
      "full_name" TEXT NOT NULL,
      "rnc" TEXT,
      "position" TEXT,
      "salary" DOUBLE PRECISION NOT NULL,
      "hire_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "employees_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    );`,

    // 5. Payroll Records
    `CREATE TABLE IF NOT EXISTS "public"."payroll_records" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "company_id" UUID,
      "employee_id" UUID,
      "month" TEXT NOT NULL,
      "year" INTEGER NOT NULL,
      "gross_salary" DOUBLE PRECISION NOT NULL,
      "sfs" DOUBLE PRECISION DEFAULT 0,
      "afp" DOUBLE PRECISION DEFAULT 0,
      "isr" DOUBLE PRECISION DEFAULT 0,
      "net_salary" DOUBLE PRECISION NOT NULL,
      "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "payroll_records_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "payroll_records_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT "payroll_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    );`,

    // 6. Tax Projections
    `CREATE TABLE IF NOT EXISTS "public"."tax_projections" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "company_id" UUID,
      "period" TEXT NOT NULL,
      "revenue" DOUBLE PRECISION NOT NULL,
      "expenses" DOUBLE PRECISION NOT NULL,
      "isr" DOUBLE PRECISION NOT NULL,
      "notes" TEXT,
      "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "tax_projections_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "tax_projections_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    );`

  ];

  for (const query of queries) {
    try {
      console.log(`Executing: ${query.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(query);
      console.log('✅ Success');
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('ℹ️ Already exists, skipping.');
      } else {
        console.error('❌ Failed:', e.message);
      }
    }
  }

  console.log('\n--- Sync Complete ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
