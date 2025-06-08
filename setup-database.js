import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.NEON_DB_CONNECTION_STRING,
  });

  try {
    await client.connect();
    console.log('Connected to Neon database');

    // Create the status enum type
    console.log('Creating status enum...');
    await client.query(`
      CREATE TYPE "status" AS ENUM('planned', 'ordered', 'approved', 'delivered', 'received')
    `).catch(err => {
      if (err.code === '42710') {
        console.log('Status enum already exists, skipping...');
      } else {
        throw err;
      }
    });

    // Create awards table
    console.log('Creating awards table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "awards" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "status" "status" DEFAULT 'planned' NOT NULL,
        "quantity" integer DEFAULT 0 NOT NULL,
        "image_url" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    // Create documents table
    console.log('Creating documents table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "documents" (
        "id" serial PRIMARY KEY NOT NULL,
        "file_name" text NOT NULL,
        "file_url" text NOT NULL,
        "file_type" text NOT NULL,
        "file_size" integer NOT NULL,
        "entity_type" text NOT NULL,
        "entity_id" integer NOT NULL,
        "uploaded_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    // Create invoices table
    console.log('Creating invoices table...');
    await client.query(`
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
      )
    `);

    // Add foreign key constraint
    console.log('Adding foreign key constraint...');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'invoices_award_id_awards_id_fk'
        ) THEN
          ALTER TABLE "invoices" 
          ADD CONSTRAINT "invoices_award_id_awards_id_fk" 
          FOREIGN KEY ("award_id") REFERENCES "awards"("id") 
          ON DELETE no action ON UPDATE no action;
        END IF;
      END $$;
    `);

    console.log('Database setup completed successfully!');

    // Check if tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('awards', 'invoices', 'documents')
    `);
    
    console.log('\nCreated tables:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();