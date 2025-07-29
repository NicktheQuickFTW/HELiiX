-- Create invoices table for Big 12 Awards tracking
-- Migration: Create invoices table for awards tracking
-- Created: 2025-06-30

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

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.invoices
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow all operations for service role
CREATE POLICY "Allow all operations for service role" ON public.invoices
FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
GRANT USAGE, SELECT ON SEQUENCE invoices_invoice_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE invoices_invoice_id_seq TO service_role;