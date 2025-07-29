-- HELiiX Awards Tracker Schema
-- Version: 1.0
-- Date: 2025-06-07
-- Description: Adds awards tracking tables to Supabase

-- ========================================
-- Create status enum type
-- ========================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
    CREATE TYPE "status" AS ENUM(
      'planned',
      'ordered', 
      'approved', 
      'delivered',
      'received'
    );
  END IF;
END $$;

-- ========================================
-- Awards Table
-- ========================================
CREATE TABLE IF NOT EXISTS "awards" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "status" DEFAULT 'planned' NOT NULL,
  "quantity" INTEGER DEFAULT 0 NOT NULL,
  "image_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for awards
CREATE INDEX IF NOT EXISTS idx_awards_status ON awards(status);
CREATE INDEX IF NOT EXISTS idx_awards_created_at ON awards(created_at DESC);

-- ========================================
-- Documents Table
-- ========================================
CREATE TABLE IF NOT EXISTS "documents" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "file_name" TEXT NOT NULL,
  "file_url" TEXT NOT NULL,
  "file_type" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" INTEGER NOT NULL,
  "uploaded_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for documents
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- ========================================
-- Invoices Table
-- ========================================
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "invoice_number" TEXT NOT NULL,
  "vendor_name" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" "status" DEFAULT 'planned' NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "due_date" TIMESTAMP,
  "image_url" TEXT,
  "notes" TEXT,
  "award_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);

-- Create indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor_name);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_award_id ON invoices(award_id);

-- Add foreign key constraint
ALTER TABLE "invoices"
ADD CONSTRAINT "invoices_award_id_awards_id_fk"
FOREIGN KEY ("award_id") REFERENCES "awards"("id")
ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ========================================
-- Update Triggers
-- ========================================

-- Apply update triggers to new tables
CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on new tables
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access for authenticated users" ON awards
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for authenticated users" ON documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access for authenticated users" ON invoices
  FOR SELECT TO authenticated USING (true);

-- For service role (full access)
CREATE POLICY "Service role has full access" ON awards
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON documents
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON invoices
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================================
-- Comments for Documentation
-- ========================================
COMMENT ON TABLE awards IS 'Tracks awards, trophies, and recognition items';
COMMENT ON TABLE documents IS 'Stores document references for awards and invoices';
COMMENT ON TABLE invoices IS 'Tracks invoices related to award purchases';

COMMENT ON COLUMN awards.status IS 'Workflow status: planned → ordered → approved → delivered → received';
COMMENT ON COLUMN documents.entity_type IS 'Type of entity (awards or invoices)';
COMMENT ON COLUMN documents.entity_id IS 'ID of the related award or invoice';
COMMENT ON COLUMN invoices.amount IS 'Amount in cents (multiply by 100 for dollars)';

-- ========================================
-- Storage Buckets Configuration Note
-- ========================================
-- IMPORTANT: You must also create these storage buckets in Supabase dashboard:
-- 1. heliix-awards (for award images)
-- 2. heliix-invoices (for invoice documents)
--
-- Go to Storage section in Supabase dashboard and create these buckets
-- with the following settings:
-- - Public bucket: No (keep them private)
-- - File size limit: 50MB
-- - Allowed MIME types: image/*, application/pdf