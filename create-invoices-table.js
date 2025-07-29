import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createInvoicesTable() {
  console.log('🏗️  Creating invoices table for Big 12 Awards tracking...\n');

  try {
    // Create the invoices table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.invoices (
          invoice_id SERIAL PRIMARY KEY,
          invoice_number VARCHAR(50) UNIQUE NOT NULL,
          vendor_name VARCHAR(255) NOT NULL DEFAULT 'Jostens',
          total_amount INTEGER NOT NULL DEFAULT 0, -- Amount in cents
          tax_amount INTEGER DEFAULT 0, -- Tax in cents
          shipping_cost INTEGER DEFAULT 0, -- Shipping in cents
          status VARCHAR(50) NOT NULL DEFAULT 'planned',
          date DATE,
          due_date DATE,
          notes TEXT,
          academic_year VARCHAR(10) DEFAULT '2024-25',
          class_code VARCHAR(50), -- Big 12 class codes like S-060-00-BB-M
          sport VARCHAR(100),
          award_type VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);
        CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON public.invoices(vendor_name);
        CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
        CREATE INDEX IF NOT EXISTS idx_invoices_academic_year ON public.invoices(academic_year);
        CREATE INDEX IF NOT EXISTS idx_invoices_class_code ON public.invoices(class_code);

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_invoices_updated_at 
          BEFORE UPDATE ON public.invoices 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();

        -- Enable Row Level Security
        ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

        -- Create policy to allow all operations for service role
        CREATE POLICY "Allow all operations for service role" ON public.invoices
        FOR ALL USING (true) WITH CHECK (true);
      `,
    });

    if (error) {
      console.error('❌ Error creating invoices table:', error);
      return false;
    }

    console.log('✅ Invoices table created successfully!');

    // Verify table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'invoices')
      .eq('table_schema', 'public');

    if (!columnsError && columns) {
      console.log('\n📋 Table structure:');
      columns.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`
        );
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run the creation
createInvoicesTable();
