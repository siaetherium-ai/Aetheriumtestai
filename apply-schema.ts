import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sql = `
-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. ESQUEMAS
CREATE SCHEMA IF NOT EXISTS "public";

-- 3. TABLAS PUBLIC
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" UUID PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT,
    "fullname" TEXT,
    "role" TEXT DEFAULT 'Free',
    "isapproved" BOOLEAN DEFAULT false,
    "last_login_at" TIMESTAMPTZ(6),
    "premium_until" TIMESTAMPTZ(6),
    "session_started_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "rnc" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "taxtype" TEXT DEFAULT 'Normal',
    "sector" TEXT,
    "taxhealth" DOUBLE PRECISION DEFAULT 100,
    "countrycode" TEXT DEFAULT 'DO',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "public"."company_users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID REFERENCES "public"."companies"("id") ON DELETE CASCADE,
    "user_id" UUID REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "role" TEXT DEFAULT 'Member',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("company_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "public"."tax_obligations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID REFERENCES "public"."companies"("id") ON DELETE CASCADE,
    "description" TEXT NOT NULL,
    "duedate" TIMESTAMPTZ(6) NOT NULL,
    "status" TEXT DEFAULT 'Pending',
    "type" TEXT
);

CREATE TABLE IF NOT EXISTS "public"."dgii_reports" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID REFERENCES "public"."companies"("id") ON DELETE CASCADE,
    "reporttype" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Draft',
    "summaryjson" JSONB,
    "fulldata" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "public"."financial_metrics" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID REFERENCES "public"."companies"("id") ON DELETE CASCADE,
    "month" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION DEFAULT 0,
    "expenses" DOUBLE PRECISION DEFAULT 0,
    "taxestimate" DOUBLE PRECISION DEFAULT 0,
    "healthscore" DOUBLE PRECISION DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "public"."rnc_registry" (
    "rnc" TEXT PRIMARY KEY,
    "RAZON SOCIAL" TEXT NOT NULL,
    "status" TEXT,
    "activity" TEXT,
    "paymentregime" TEXT
);

CREATE TABLE IF NOT EXISTS "public"."legal_templates" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID REFERENCES "public"."companies"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isglobal" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "company_id" UUID REFERENCES "public"."companies"("id") ON DELETE CASCADE,
    "user_id" UUID REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "topic" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "public"."conversation_messages" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "conversation_id" UUID REFERENCES "public"."conversations"("id") ON DELETE CASCADE,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "audio_path" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userid" UUID REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "companyid" UUID REFERENCES "public"."companies"("id"),
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, fullname, role, isapproved)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'fullname'), 
    'Free', 
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

// Simple statement splitter that counts semicolons except inside quotes
function splitStatements(sql: string) {
  const statements: string[] = [];
  let current = '';
  let inQuote = false;
  let inFunction = 0;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (char === "'" && sql[i-1] !== "\\") inQuote = !inQuote;
    if (!inQuote) {
      if (sql.substring(i, i+2) === '$$') {
        inFunction = inFunction === 0 ? 1 : 0;
        current += '$$';
        i++;
        continue;
      }
      if (char === ';' && inFunction === 0) {
        statements.push(current.trim());
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected!');
    
    const statements = splitStatements(sql);
    for (const stmt of statements) {
      if (!stmt) continue;
      console.log('Executing:', stmt.substring(0, 50) + '...');
      await prisma.$executeRawUnsafe(stmt);
    }
    
    console.log('✅ SQL Schema applied successfully!');
  } catch (error: any) {
    console.error('❌ Error applying SQL:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
