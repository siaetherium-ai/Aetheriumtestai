import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const sql = `
CREATE TABLE IF NOT EXISTS public.fiscal_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_rnc TEXT NOT NULL,
    customer_name TEXT,
    ncf TEXT NOT NULL,
    ncf_modified TEXT,
    invoice_type TEXT NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    itbis DOUBLE PRECISION DEFAULT 0,
    itbis_retained DOUBLE PRECISION DEFAULT 0,
    income_tax_retained DOUBLE PRECISION DEFAULT 0,
    status TEXT DEFAULT 'Valid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fiscal_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    supplier_rnc TEXT NOT NULL,
    supplier_name TEXT,
    ncf TEXT NOT NULL,
    ncf_modified TEXT,
    purchase_type TEXT NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL,
    payment_date TIMESTAMPTZ,
    amount DOUBLE PRECISION NOT NULL,
    itbis DOUBLE PRECISION DEFAULT 0,
    itbis_retained DOUBLE PRECISION DEFAULT 0,
    income_tax_retained DOUBLE PRECISION DEFAULT 0,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ncf_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    prefix TEXT NOT NULL,
    current INTEGER DEFAULT 1,
    "limit" INTEGER NOT NULL,
    expiry_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.legal_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Applying fiscal tables...');
    try {
        // We use prisma.$executeRawUnsafe to apply the SQL
        // This is the most direct way since we already have prisma configured
        
        const statements = sql.split(';').filter(s => s.trim().length > 0);
        
        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            await prisma.$executeRawUnsafe(statement);
        }
        
        console.log('✅ Tables created successfully!');
    } catch (error) {
        console.error('❌ Error applying SQL:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
