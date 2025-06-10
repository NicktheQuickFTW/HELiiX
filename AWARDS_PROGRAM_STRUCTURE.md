# Big 12 Awards Program - Database Structure

## Overview
The Awards Program has been completely restructured to provide comprehensive tracking of all Big 12 awards, recipients, and financial management with proper class code integration.

## Database Tables

### 1. `awards_program` (Main Table)
Comprehensive award tracking with all essential details.

**Key Fields:**
- `award_name` - Full descriptive name
- `award_type` - Enum with 20+ award categories
- `status` - Enhanced workflow (planned → approved → ordered → in_production → shipped → delivered → distributed → completed)
- `sport_code` & `sport_gender` - For class code generation
- `class_code` - S-050 (Regular Season) / S-060 (Championship) format
- `account_code` - Big 12 financial account (4105 - Awards)
- `unit_cost` & `total_cost` - Financial tracking in cents
- `vendor_name` & `vendor_contact_info` - Procurement management
- `award_material` & `award_dimensions` - Physical specifications

### 2. `award_recipients` 
Detailed recipient tracking with achievement context.

**Key Fields:**
- `recipient_name` - Individual/team name
- `school_name` & `school_code` - Institution details
- `achievement_details` - JSON with stats, accomplishments
- `shipping_address` - Distribution management
- `delivery_status` - Tracking fulfillment

### 3. `award_budget_tracking`
Financial management and procurement workflow.

**Key Fields:**
- `fiscal_year` - Budget period
- `budgeted_amount` vs `actual_cost` - Variance tracking
- `purchase_order_number` & `invoice_number` - Procurement
- `payment_status` - Financial workflow
- `approval_workflow` - Authorization tracking

## Class Code System

### Format: `S-[050/060]-00-[SPORT]-[GENDER]`

**Classification:**
- **S-050** = Regular Season awards (RS)
- **S-060** = Championship awards (CC)

**Sport Codes:**
- BB = Basketball
- FB = Football  
- SB = Softball
- VB = Volleyball
- SC = Soccer
- HB = Baseball
- TN = Tennis
- GF = Golf
- CC = Cross Country
- WW = Wrestling
- SD = Swimming & Diving
- GY = Gymnastics
- IT = Indoor Track & Field
- OT = Outdoor Track & Field
- LX = Lacrosse
- RW = Rowing
- EQ = Equestrian
- BV = Beach Volleyball

**Gender Codes:**
- M = Men's
- W = Women's
- X = Mixed/Co-ed

**Examples:**
- `S-050-00-BB-M` = Men's Basketball Regular Season
- `S-060-00-FB-M` = Football Championship
- `S-050-00-SB-W` = Softball Regular Season

## Award Types (Enum)

1. **Trophies**
   - championship_trophy
   - tournament_trophy
   - regular_season_trophy

2. **Individual Recognition**
   - player_of_year
   - coach_of_year
   - freshman_of_year
   - newcomer_of_year
   - defensive_player
   - offensive_player
   - most_outstanding_player
   - sixth_man
   - most_improved

3. **Team Recognition**
   - all_conference_first
   - all_conference_second
   - all_conference_honorable
   - team_award

4. **Academic & Character**
   - scholar_athlete
   - academic_honor
   - sportsmanship

5. **Special Recognition**
   - milestone_achievement
   - hall_of_fame
   - medallion
   - individual_recognition

## Status Workflow

1. **planned** - Initial budget planning
2. **approved** - Budget/design approved
3. **ordered** - Order placed with vendor
4. **in_production** - Being manufactured
5. **shipped** - In transit
6. **delivered** - Received by conference
7. **distributed** - Sent to recipients
8. **completed** - Process finished
9. **cancelled** - Order cancelled

## Financial Integration

### Big 12 Account Structure
- **Account:** 4105 - Awards
- **Class Codes:** S-050 (RS) / S-060 (CC)
- **Currency:** Stored in cents for precision
- **Tax:** 5% default rate
- **Variance Tracking:** Budget vs Actual analysis

### Cost Components
- Unit cost (base award price)
- Tax calculation
- Shipping costs
- Total delivered cost
- Quantity-based pricing

## Database Views

### `v_awards_program_complete`
Complete award overview with recipients and financial data.

### `v_awards_financial_by_sport`
Financial summaries grouped by sport and season.

### `v_awards_by_class_code`
Analysis by class code for budget reporting.

## Data Migration Status

✅ **Structure Created** - All tables, indexes, and views defined
✅ **Class Codes Implemented** - S-050/S-060 system ready
✅ **Financial Integration** - Account 4105 mapping complete
✅ **Recipient Tracking** - Full school and achievement context
⚠️ **Migration Pending** - SQL file ready for Supabase execution

## Next Steps

1. **Execute Migration:** Run `07-restructure-awards-program.sql` in Supabase
2. **Migrate Data:** Transfer existing 57 awards and 152 recipients
3. **Load Order History:** Import 2024-25 order files with proper structure
4. **Generate Reports:** Create class code financial summaries
5. **Update UI:** Modify React components for new structure

## Benefits

1. **Comprehensive Tracking** - Every aspect of award lifecycle
2. **Financial Precision** - Proper class codes and variance analysis
3. **Recipient Management** - Full context with achievements
4. **Vendor Relations** - Procurement workflow integration
5. **Compliance Ready** - Big 12 financial reporting standards
6. **Scalable** - Supports growth and new award types

The new Awards Program structure provides enterprise-level award management aligned with Big 12 Conference financial and operational requirements.