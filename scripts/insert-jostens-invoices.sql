-- Insert Jostens Awards Invoice Data
-- Based on invoices from 2024-25 Jostens-Awards Invoices

-- First, insert awards into awards_program table
INSERT INTO awards_program (
  award_name,
  award_description,
  award_type,
  status,
  sport_name,
  sport_code,
  sport_gender,
  sport_season,
  competition_level,
  season_year,
  academic_year,
  class_code,
  account_code,
  unit_cost,
  total_cost,
  quantity_ordered,
  vendor_name,
  engraving_details
) VALUES 
-- Baseball Championship Awards (Invoice 791346)
(
  'Baseball Championship Trophy',
  'Championship trophy for Big 12 Baseball',
  'championship_trophy',
  'delivered',
  'Baseball',
  'BSB',
  'M',
  'spring',
  'championship',
  2025,
  '2024-25',
  'S-050-00-HB-0',
  '4105',
  262875, -- $2,628.75 in cents
  290985, -- $2,909.85 total in cents
  1,
  'Jostens',
  'Championship Trophy'
),
(
  'Baseball Most Outstanding Player Award',
  'Most Outstanding Player award for Big 12 Baseball Championship',
  'player_of_year',
  'delivered',
  'Baseball',
  'BSB',
  'M',
  'spring',
  'championship',
  2025,
  '2024-25',
  'S-050-00-HB-0',
  '4105',
  9450, -- $94.50 in cents
  290985, -- included in total above
  1,
  'Jostens',
  'Most Outstanding Player'
),

-- Beach Volleyball Regular Season MOP (Invoice 790904)
(
  'Beach Volleyball Most Outstanding Pair',
  'Most Outstanding Pair for Beach Volleyball regular season',
  'player_of_year',
  'delivered',
  'Beach Volleyball',
  'BVB',
  'W',
  'spring',
  'regular_season',
  2025,
  '2024-25',
  'S-050-00-BV-W',
  '4105',
  18900, -- $189.00 in cents
  21231, -- $212.31 total in cents
  2,
  'Jostens',
  'Most Outstanding Pair'
),

-- Beach Volleyball Championship Trophy (Invoice 789041)
(
  'Beach Volleyball Championship Trophy',
  'Championship trophy for Big 12 Beach Volleyball',
  'championship_trophy',
  'delivered',
  'Beach Volleyball',
  'BVB',
  'W',
  'spring',
  'championship',
  2025,
  '2024-25',
  'S-060-00-BV-W',
  '4105',
  262875, -- $2,628.75 in cents
  275893, -- $2,758.93 total in cents
  1,
  'Jostens',
  'Championship Trophy'
),

-- Equestrian Championship Awards (Invoice 788239)
(
  'Equestrian Championship Trophy',
  'Championship trophy for Big 12 Equestrian',
  'championship_trophy',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'championship',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  262875, -- $2,628.75 in cents
  520567, -- $5,205.67 total in cents (includes all items)
  1,
  'Jostens',
  'Championship Trophy'
),
(
  'Equestrian Most Outstanding Performer',
  'Most Outstanding Performer for Big 12 Equestrian Championship',
  'player_of_year',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'championship',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  37800, -- $378.00 in cents (4 x $94.50)
  520567, -- included in total above
  4,
  'Jostens',
  'Most Outstanding Performer'
),
(
  'Equestrian Of The Year Award',
  'Of The Year Large award for Big 12 Equestrian',
  'player_of_year',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'championship',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  122850, -- $1,228.50 in cents (5 x $245.70)
  520567, -- included in total above
  5,
  'Jostens',
  'Of The Year Large'
),
(
  'Equestrian 1st Team All-Conference',
  '1st Team All-Conference awards for Big 12 Equestrian',
  'all_conference',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'championship',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  76120, -- $761.20 in cents (20 x $38.06)
  520567, -- included in total above
  20,
  'Jostens',
  '1st Team All-Conference'
),

-- Equestrian Regular Season Awards (Invoice 788788)
(
  'Equestrian Of The Year Plates',
  'Of The Year plates for Big 12 Equestrian regular season',
  'regular_season_award',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'regular_season',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  9000, -- $90.00 in cents (6 x $15.00)
  43333, -- $433.33 total in cents
  6,
  'Jostens',
  'OTY Plate'
),
(
  'Equestrian All Conference Plates',
  'All Conference plates for Big 12 Equestrian regular season',
  'all_conference',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'regular_season',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  30000, -- $300.00 in cents (20 x $15.00)
  43333, -- included in total above
  20,
  'Jostens',
  'All Conference Plate'
),

-- Equestrian Scholar Athlete (Invoice 791347)
(
  'Equestrian Scholar Athlete Award',
  'Scholar Athlete award for Big 12 Equestrian',
  'academic_award',
  'delivered',
  'Equestrian',
  'EQ',
  'W',
  'fall',
  'regular_season',
  2025,
  '2024-25',
  'S-050-00-EQ-W',
  '4105',
  24570, -- $245.70 in cents
  30037, -- $300.37 total in cents
  1,
  'Jostens',
  'Equestrian Scholar Athlete'
);

-- Now insert detailed budget tracking for each invoice
INSERT INTO award_budget_tracking (
  award_id,
  fiscal_year,
  budget_category,
  invoice_number,
  vendor_invoice_amount,
  tax_amount,
  shipping_cost,
  payment_status,
  requested_by,
  approved_by
) VALUES 
-- Baseball Championship (Invoice 791346)
((SELECT id FROM awards_program WHERE award_name = 'Baseball Championship Trophy' AND sport_code = 'BSB'), 
 '2024-25', 'Awards', '791346', 272325, 0, 18660, 'paid', 'Lizzie', 'Scott'),

-- Beach Volleyball MOP (Invoice 790904)
((SELECT id FROM awards_program WHERE award_name = 'Beach Volleyball Most Outstanding Pair'), 
 '2024-25', 'Awards', '790904', 18900, 0, 2331, 'paid', 'Lizzie', 'Scott'),

-- Beach Volleyball Championship (Invoice 789041)
((SELECT id FROM awards_program WHERE award_name = 'Beach Volleyball Championship Trophy'), 
 '2024-25', 'Awards', '789041', 262875, 0, 13018, 'paid', 'Lizzie', 'Scott'),

-- Equestrian Championship (Invoice 788239)
((SELECT id FROM awards_program WHERE award_name = 'Equestrian Championship Trophy'), 
 '2024-25', 'Awards', '788239', 499645, 0, 20922, 'paid', 'Lizzie', 'Scott'),

-- Equestrian Regular Season Plates (Invoice 788788)
((SELECT id FROM awards_program WHERE award_name = 'Equestrian Of The Year Plates'), 
 '2024-25', 'Awards', '788788', 41500, 0, 1833, 'paid', 'Lizzie', 'Scott'),

-- Equestrian Scholar Athlete (Invoice 791347)
((SELECT id FROM awards_program WHERE award_name = 'Equestrian Scholar Athlete Award'), 
 '2024-25', 'Awards', '791347', 24570, 2268, 3199, 'paid', 'Lizzie', 'Scott');

-- Add notes about which invoices are championships vs regular season
UPDATE awards_program 
SET award_description = award_description || ' - Championship award (MOP or Tournament Trophy)'
WHERE award_type IN ('championship_trophy', 'tournament_trophy') 
  AND vendor_name = 'Jostens';

UPDATE awards_program 
SET award_description = award_description || ' - Regular season award'
WHERE award_type NOT IN ('championship_trophy', 'tournament_trophy') 
  AND vendor_name = 'Jostens';