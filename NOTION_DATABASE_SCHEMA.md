# XII Conference Contacts - Notion Database Schema

## Database Information
- **Database ID**: `13779839c200819db58bd3f239672f9a`
- **Title**: XII Conference Contacts
- **Created**: November 7, 2024
- **Last Edited**: May 9, 2025
- **Total Properties**: 20

## Complete Field Structure

### 1. Core Contact Information
| Field Name | Notion Type | SQL Type | Description |
|------------|-------------|----------|-------------|
| `Name` | title | TEXT | Primary identifier - full name |
| `First Name` | rich_text | TEXT | First name |
| `Last Name` | rich_text | TEXT | Last name |
| `E-Mail` | email | TEXT | Email address |
| `Phone` | phone_number | TEXT | Phone number |
| `Birthdate` | date | DATE | Date of birth |

### 2. Organizational Information
| Field Name | Notion Type | SQL Type | Description |
|------------|-------------|----------|-------------|
| `Affiliation` | select | TEXT | Organization (Big 12, schools, etc.) |
| `Title` | select | TEXT | Job title/position |
| `Department [Conf. Office]` | select | TEXT | Conference office department |
| `Member Status` | select | TEXT | Legacy or Affiliate status |

### 3. Sports & Roles
| Field Name | Notion Type | SQL Type | Description |
|------------|-------------|----------|-------------|
| `Sport` | multi_select | JSONB | Sports associated with contact |
| `Sport Role` | multi_select | JSONB | Roles within sports organizations |
| `Governance Group` | multi_select | JSONB | Governance roles (President, AD, SWA, etc.) |

### 4. Liaison Responsibilities
| Field Name | Notion Type | SQL Type | Description |
|------------|-------------|----------|-------------|
| `Sport Liaison for` | multi_select | JSONB | Primary sport liaison responsibilities |
| `Secondary Liaison for` | multi_select | JSONB | Secondary sport liaison responsibilities |
| `Communications Liaison for` | multi_select | JSONB | Sports communication liaison |
| `Marketing Liaison for` | multi_select | JSONB | Sports marketing liaison |
| `SWA Liaison for` | multi_select | JSONB | Senior Woman Administrator liaison |
| `Secondary SWA Liaison for` | multi_select | JSONB | Secondary SWA liaison |
| `Liaison to Officials for` | multi_select | JSONB | Officials liaison responsibilities |

## Select Field Options

### Affiliation Options
Big 12 Conference, Air Force, Arizona, Arizona State, Baylor, BYU, Cal Baptist, UC Davis, UCF, Cincinnati, Colorado, Denver, Fresno, Florida, Houston, Iowa State, Kansas, K-State, Missouri, North Dakota State, Northern Colorado, Northern Iowa, Oklahoma, Oklahoma State, Old Dominion, San Diego State, South Dakota State, TCU, Texas Tech, Tulsa, Utah, Utah Valley, West Virginia, Wyoming, Tulsa Sports Commission, BOK Center

### Title Options
Intern, Coordinator, Staff Accountant, Assistant Director, Associate Director, Director, Controller, Human Resources Manager, Senior Director, Associate Vice President, Vice President, Chief Impact Officer, Chief Administrative Officer, Chief Competition & Football Officer, Chief Marketing Officer, Chief Financial Officer and Human Resources, Chief Legal Officer, Jr. Executive Assistant, Executive Assistant, Deputy Commissioner, Commissioner, Liaison to Officials

### Department [Conf. Office] Options
Office of the Commissioner, Academics Student-Athlete Success Impact, Accounting & Human Resources, Communications, Competition, Legal Affairs Compliance & Governance, Marketing Branding & Licensing, Sales & Ticketing, Television Digital Production & Technology, Liaison to Officials

### Member Status Options
Legacy, Affiliate

### Sport Options
Baseball, Men's Basketball, Women's Basketball, Beach Volleyball, Cross Country, Equestrian, Football, Men's Golf, Women's Golf, Gymnastics, Lacrosse, Rowing, Soccer, Softball, Swimming & Diving, Men's Tennis, Women's Tennis, Track & Field, Volleyball, Wrestling

### Sport Role Options
Sport Liaison, Communications Liaison, Marketing Liaison, Liaison to Officials, President, Director of Athletics, SWA, Faculty Athletic Representative, Director of Compliance, ADID, Sport Administrator, Head Coach, Swimming, Diving, Associate Head Coach, Assistant Coach, Director of Operations, Video Coordinator, Game Operations, Communications, Women's Only, Men's Only, Branding, Content, Coordinator, Game Presentation, Merchandise, Partnerships, Social Media, Technology, Ticketing, Intern

### Governance Group Options
President, Director of Athletics, SWA, FAR, DOC, ADID

## Sport Liaison Options
Cross Country, Soccer, Volleyball, Football, Swimming & Diving, Track & Field, Wrestling, Women's Basketball, Men's Basketball, Gymnastics, Equestrian, Tennis, Women's Tennis, Men's Tennis, Golf, Men's Golf, Women's Golf, Beach Volleyball, Lacrosse, Softball, Rowing, Baseball

## Recommended SQL Table Structure

```sql
CREATE TABLE big12_contacts (
  -- Notion metadata
  notion_id TEXT PRIMARY KEY,
  notion_url TEXT,
  created_time TIMESTAMP WITH TIME ZONE,
  last_edited_time TIMESTAMP WITH TIME ZONE,
  
  -- Contact Information
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  birthdate DATE,
  
  -- Organizational Information
  affiliation TEXT,
  title TEXT,
  department_conf_office TEXT,
  member_status TEXT,
  
  -- Sports and Roles (JSONB for multi-select fields)
  sport JSONB,
  sport_role JSONB,
  governance_group JSONB,
  
  -- Liaison Responsibilities (JSONB for multi-select fields)
  sport_liaison_for JSONB,
  secondary_liaison_for JSONB,
  communications_liaison_for JSONB,
  marketing_liaison_for JSONB,
  swa_liaison_for JSONB,
  secondary_swa_liaison_for JSONB,
  liaison_to_officials_for JSONB,
  
  -- Sync metadata
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Next Steps

1. **Create the table**: Use the SQL schema in `scripts/create-contacts-table.sql`
2. **Set up sync**: Create a sync service to pull data from Notion API
3. **Build queries**: Use JSONB operations to search multi-select fields
4. **Create API endpoints**: Build REST endpoints for contact management

## Example JSONB Queries

```sql
-- Find contacts who are sport liaisons for Football
SELECT * FROM big12_contacts 
WHERE sport_liaison_for ? 'Football';

-- Find all governance group members
SELECT * FROM big12_contacts 
WHERE governance_group IS NOT NULL AND governance_group != '[]';

-- Find contacts with multiple sport responsibilities
SELECT name, sport_liaison_for, communications_liaison_for 
FROM big12_contacts 
WHERE jsonb_array_length(sport_liaison_for) > 1;

-- Find all contacts from a specific school
SELECT * FROM big12_contacts 
WHERE affiliation = 'Kansas';
```