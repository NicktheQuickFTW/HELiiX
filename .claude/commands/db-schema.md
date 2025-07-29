# Database Schema Command

Complete database schema reference for HELiiX-OS.

## Command: /db-schema

### Database Architecture:

HELiiX-OS uses Supabase PostgreSQL with two main schemas:

- **`competition`** - FlexTime integration (accessed via public views)
- **`public`** - Core application tables

### Public Views (from Competition Schema):

```sql
-- Schools
CREATE VIEW public.schools AS SELECT * FROM competition.schools;
-- Columns: id, name, nickname, logo_url, primary_color, secondary_color

-- Teams
CREATE VIEW public.teams AS SELECT * FROM competition.teams;
-- Columns: id, school_id, sport, gender, head_coach, assistant_coaches

-- Venues
CREATE VIEW public.venues AS SELECT * FROM competition.venues;
-- Columns: id, name, school_id, address, capacity, sport_types

-- Games
CREATE VIEW public.games AS SELECT * FROM competition.games;
-- Columns: id, home_team_id, away_team_id, venue_id, game_date, sport, status
```

### Core Tables (Public Schema):

#### Awards Management

```sql
-- awards_program
CREATE TABLE public.awards_program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  class_code TEXT NOT NULL, -- S-050 or S-060
  quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2),
  total_value DECIMAL(10,2),
  in_stock INTEGER DEFAULT 0,
  reserved INTEGER DEFAULT 0,
  ordered INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- award_recipients
CREATE TABLE public.award_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  award_id UUID REFERENCES awards_program(id),
  recipient_type TEXT CHECK (recipient_type IN ('individual', 'team')),
  recipient_name TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  sport TEXT,
  year INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- award_budget_tracking
CREATE TABLE public.award_budget_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year INTEGER NOT NULL,
  account_code TEXT DEFAULT '4105',
  budget_amount DECIMAL(12,2),
  spent_amount DECIMAL(12,2) DEFAULT 0,
  committed_amount DECIMAL(12,2) DEFAULT 0,
  available_amount DECIMAL(12,2),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

#### Financial Operations

```sql
-- invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  vendor_name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  category TEXT,
  account_code TEXT,
  school_id UUID REFERENCES schools(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- budget_categories
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  parent_code TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true
);
```

#### Policy Management

```sql
-- manuals
CREATE TABLE public.manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  content TEXT,
  file_url TEXT,
  version TEXT,
  effective_date DATE,
  vector_id TEXT, -- Pinecone vector ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- policy_categories
CREATE TABLE public.policy_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES policy_categories(id),
  sort_order INTEGER,
  active BOOLEAN DEFAULT true
);
```

#### User & Auth

```sql
-- profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer',
  school_id UUID REFERENCES schools(id),
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies:

```sql
-- Enable RLS on all tables
ALTER TABLE awards_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "Users can view their school's data"
  ON invoices FOR SELECT
  USING (school_id = auth.jwt() ->> 'school_id');

CREATE POLICY "Admins can manage all data"
  ON awards_program FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Indexes for Performance:

```sql
-- Frequently queried columns
CREATE INDEX idx_awards_category ON awards_program(category);
CREATE INDEX idx_awards_class_code ON awards_program(class_code);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_vendor ON invoices(vendor_name);
CREATE INDEX idx_games_date ON games(game_date);
CREATE INDEX idx_games_sport ON games(sport);
```

### Common Queries:

```sql
-- Get awards by category
SELECT * FROM awards_program
WHERE category = 'Championship Trophies'
ORDER BY name;

-- Get school's invoices
SELECT * FROM invoices
WHERE school_id = $1
AND status = 'pending'
ORDER BY due_date;

-- Get upcoming games
SELECT g.*, ht.school_id as home_school, at.school_id as away_school
FROM games g
JOIN teams ht ON g.home_team_id = ht.id
JOIN teams at ON g.away_team_id = at.id
WHERE g.game_date >= NOW()
ORDER BY g.game_date;

-- Budget summary
SELECT
  account_code,
  budget_amount,
  spent_amount,
  (budget_amount - spent_amount) as remaining
FROM award_budget_tracking
WHERE fiscal_year = EXTRACT(YEAR FROM NOW());
```

### Database Migrations:

Located in `/supabase/migrations/`:

- Use timestamp prefix: `20240101120000_description.sql`
- Include up and down migrations
- Test locally before production

### Usage:

```
/db-schema
```

Reference this schema when working with database operations or creating new features.
