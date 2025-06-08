-- Create the status enum type
CREATE TYPE "status" AS ENUM('planned', 'ordered', 'approved', 'delivered', 'received');

-- Create awards table
CREATE TABLE IF NOT EXISTS "awards" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "status" "status" DEFAULT 'planned' NOT NULL,
  "quantity" integer DEFAULT 0 NOT NULL,
  "image_url" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create documents table
CREATE TABLE IF NOT EXISTS "documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_name" text NOT NULL,
  "file_url" text NOT NULL,
  "file_type" text NOT NULL,
  "file_size" integer NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" integer NOT NULL,
  "uploaded_at" timestamp DEFAULT now() NOT NULL
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" serial PRIMARY KEY NOT NULL,
  "invoice_number" text NOT NULL,
  "vendor_name" text NOT NULL,
  "amount" integer NOT NULL,
  "status" "status" DEFAULT 'planned' NOT NULL,
  "date" timestamp NOT NULL,
  "due_date" timestamp,
  "image_url" text,
  "notes" text,
  "award_id" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);

-- Add foreign key constraint
ALTER TABLE "invoices" 
ADD CONSTRAINT "invoices_award_id_awards_id_fk" 
FOREIGN KEY ("award_id") REFERENCES "awards"("id") 
ON DELETE no action ON UPDATE no action;

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('heliix-awards', 'heliix-awards', true),
  ('heliix-invoices', 'heliix-invoices', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on tables
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON awards FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON awards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON awards FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON invoices FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON documents FOR UPDATE USING (true);