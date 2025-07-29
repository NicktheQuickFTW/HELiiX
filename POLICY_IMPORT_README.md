# Big 12 Sport Policies Import Guide

This directory contains scripts to import Big 12 sport policies from markdown files into your Supabase database.

## Files Created

- `import-policies-to-supabase.js` - Main import script
- `check-database-schema.js` - Database schema verification script
- `package-import.json` - Dependencies for the import scripts
- Policy files are located in: `docs/big12-sport-policies/`

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Supabase account** with database access
3. **Environment file** at `/Users/nickw/.env/flextime.env` (already configured)

## Installation

1. **Install dependencies:**
   ```bash
   cd /Users/nickw/Documents/XII-Ops/HELiiX
   npm install --package-lock-only
   npm install @supabase/supabase-js@^2.39.0 dotenv@^16.3.1
   ```

## Usage

### Step 1: Check Database Schema

First, verify that your database has the required tables:

```bash
node check-database-schema.js
```

This will:

- Check if `policies`, `awards`, and `scheduling_parameters` tables exist
- Show sample data from existing tables
- Provide SQL commands to create missing tables

### Step 2: Create Missing Tables (if needed)

If tables don't exist, run the SQL commands provided by the schema checker in your Supabase SQL editor.

### Step 3: Import Policy Data

Run the import script:

```bash
node import-policies-to-supabase.js
```

This will:

- Read all markdown files from `docs/big12-sport-policies/`
- Parse policy content, awards criteria, and scheduling parameters
- Create separate entries for men's and women's sports where applicable
- Insert data into the appropriate tables

## What Gets Imported

### Policy Data (policies table)

- **Sports with single entry:** Baseball, Football, Gymnastics, Lacrosse, Soccer, Softball, Volleyball, Wrestling, Common Section
- **Sports with gender variations:** Basketball (Men's + Women's), Tennis (Men's + Women's)

### Data Structure

Each policy record includes:

- `policy_id` - Randomly generated unique identifier
- `sport` - Sport name (e.g., "Baseball", "Men's Basketball")
- `gender` - Gender designation (men/women/both/all)
- `year` - Policy year (e.g., "2024", "2025", "2024-25")
- `title` - Document title
- `content` - Full markdown content
- `table_of_contents` - Extracted TOC
- `sections` - Parsed sections as JSON
- `word_count` - Document word count
- `source_file` - Original filename

### Awards Criteria (awards table)

- Extracted from "Awards" sections in each policy
- Includes Scholar-Athlete criteria, All-Conference team requirements
- Linked to policies via `policy_id`

### Scheduling Parameters (scheduling_parameters table)

- Extracted scheduling information (game counts, formats)
- Conference scheduling principles and requirements
- Linked to policies via `policy_id`

## Expected Results

After successful import, you should have:

- **13 policy records** (11 individual sports + 2 basketball variations + 2 tennis variations + common section)
- **Awards criteria** extracted from each sport
- **Scheduling parameters** for sports that include scheduling information

## Troubleshooting

### Common Issues:

1. **"Missing Supabase configuration"**
   - Verify `/Users/nickw/.env/flextime.env` exists and contains valid Supabase credentials

2. **"Table does not exist"**
   - Run `check-database-schema.js` and create missing tables using provided SQL

3. **"Permission denied"**
   - Ensure your Supabase service key has appropriate permissions
   - Check if Row Level Security (RLS) is blocking inserts

4. **"File not found"**
   - Verify policy files exist in `docs/big12-sport-policies/`
   - Check file permissions

### Verification

After import, check your Supabase dashboard:

1. **policies table** should have ~13 records
2. **awards table** should have awards criteria entries
3. **scheduling_parameters table** should have scheduling data

## Data Preview

The script will show you:

- Number of files found
- Policy records to be inserted
- Awards criteria extracted
- Scheduling parameters found

## Safety Features

- **Preview mode**: Shows what will be imported before insertion
- **Error handling**: Continues processing other files if one fails
- **Validation**: Checks database connectivity before import
- **Detailed logging**: Reports success/failure for each operation

## Manual Verification

After import, you can query the data:

```sql
-- Check imported policies
SELECT sport, gender, year, title FROM policies ORDER BY sport;

-- Check awards criteria
SELECT sport, award_type, criteria FROM awards WHERE criteria IS NOT NULL;

-- Check scheduling parameters
SELECT sport, parameter_type, parameter_value FROM scheduling_parameters;
```

## Next Steps

After successful import, you can:

1. Build queries to search policies by sport/gender/year
2. Create views that combine policy, awards, and scheduling data
3. Set up full-text search on policy content
4. Build a frontend interface to browse the policies

## Support

For issues or questions, check:

- Supabase dashboard for error logs
- Console output from the import script
- Database table structure in Supabase
