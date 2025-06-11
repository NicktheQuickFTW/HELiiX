#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function insertJostensInvoices() {
  console.log('🎯 Starting Jostens invoice data insertion...\n');

  try {
    // Awards program data
    const awardsData = [
      // Baseball Championship Awards (Invoice 791346)
      {
        award_name: 'Baseball Championship Trophy',
        award_description: 'Championship trophy for Big 12 Baseball',
        award_type: 'championship_trophy',
        status: 'delivered',
        sport_name: 'Baseball',
        sport_code: 'BSB',
        sport_gender: 'M',
        sport_season: 'spring',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-HB-0',
        account_code: '4105',
        unit_cost: 262875, // $2,628.75 in cents
        total_cost: 290985, // $2,909.85 total in cents
        quantity_ordered: 1,
        vendor_name: 'Jostens',
        engraving_details: 'Championship Trophy'
      },
      {
        award_name: 'Baseball Most Outstanding Player Award',
        award_description: 'Most Outstanding Player award for Big 12 Baseball Championship',
        award_type: 'player_of_year',
        status: 'delivered',
        sport_name: 'Baseball',
        sport_code: 'BSB',
        sport_gender: 'M',
        sport_season: 'spring',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-HB-0',
        account_code: '4105',
        unit_cost: 9450, // $94.50 in cents
        total_cost: 290985, // included in total above
        quantity_ordered: 1,
        vendor_name: 'Jostens',
        engraving_details: 'Most Outstanding Player'
      },
      // Beach Volleyball Regular Season MOP (Invoice 790904)
      {
        award_name: 'Beach Volleyball Most Outstanding Pair',
        award_description: 'Most Outstanding Pair for Beach Volleyball regular season',
        award_type: 'player_of_year',
        status: 'delivered',
        sport_name: 'Beach Volleyball',
        sport_code: 'BVB',
        sport_gender: 'W',
        sport_season: 'spring',
        competition_level: 'regular_season',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-BV-W',
        account_code: '4105',
        unit_cost: 9450, // $94.50 per pair in cents
        total_cost: 21231, // $212.31 total in cents
        quantity_ordered: 2,
        vendor_name: 'Jostens',
        engraving_details: 'Most Outstanding Pair'
      },
      // Beach Volleyball Championship Trophy (Invoice 789041)
      {
        award_name: 'Beach Volleyball Championship Trophy',
        award_description: 'Championship trophy for Big 12 Beach Volleyball',
        award_type: 'championship_trophy',
        status: 'delivered',
        sport_name: 'Beach Volleyball',
        sport_code: 'BVB',
        sport_gender: 'W',
        sport_season: 'spring',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-060-00-BV-W',
        account_code: '4105',
        unit_cost: 262875, // $2,628.75 in cents
        total_cost: 275893, // $2,758.93 total in cents
        quantity_ordered: 1,
        vendor_name: 'Jostens',
        engraving_details: 'Championship Trophy'
      },
      // Equestrian Championship Awards (Invoice 788239)
      {
        award_name: 'Equestrian Championship Trophy',
        award_description: 'Championship trophy for Big 12 Equestrian',
        award_type: 'championship_trophy',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 262875, // $2,628.75 in cents
        total_cost: 520567, // $5,205.67 total in cents (includes all items)
        quantity_ordered: 1,
        vendor_name: 'Jostens',
        engraving_details: 'Championship Trophy'
      },
      {
        award_name: 'Equestrian Most Outstanding Performer',
        award_description: 'Most Outstanding Performer for Big 12 Equestrian Championship',
        award_type: 'player_of_year',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 9450, // $94.50 per award in cents
        total_cost: 520567, // included in total above
        quantity_ordered: 4,
        vendor_name: 'Jostens',
        engraving_details: 'Most Outstanding Performer'
      },
      {
        award_name: 'Equestrian Of The Year Award',
        award_description: 'Of The Year Large award for Big 12 Equestrian',
        award_type: 'player_of_year',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 24570, // $245.70 per award in cents
        total_cost: 520567, // included in total above
        quantity_ordered: 5,
        vendor_name: 'Jostens',
        engraving_details: 'Of The Year Large'
      },
      {
        award_name: 'Equestrian 1st Team All-Conference',
        award_description: '1st Team All-Conference awards for Big 12 Equestrian',
        award_type: 'all_conference',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'championship',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 3806, // $38.06 per award in cents
        total_cost: 520567, // included in total above
        quantity_ordered: 20,
        vendor_name: 'Jostens',
        engraving_details: '1st Team All-Conference'
      },
      // Equestrian Regular Season Awards (Invoice 788788)
      {
        award_name: 'Equestrian Of The Year Plates',
        award_description: 'Of The Year plates for Big 12 Equestrian regular season',
        award_type: 'regular_season_award',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'regular_season',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 1500, // $15.00 per plate in cents
        total_cost: 43333, // $433.33 total in cents
        quantity_ordered: 6,
        vendor_name: 'Jostens',
        engraving_details: 'OTY Plate'
      },
      {
        award_name: 'Equestrian All Conference Plates',
        award_description: 'All Conference plates for Big 12 Equestrian regular season',
        award_type: 'all_conference',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'regular_season',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 1500, // $15.00 per plate in cents
        total_cost: 43333, // included in total above
        quantity_ordered: 20,
        vendor_name: 'Jostens',
        engraving_details: 'All Conference Plate'
      },
      // Equestrian Scholar Athlete (Invoice 791347)
      {
        award_name: 'Equestrian Scholar Athlete Award',
        award_description: 'Scholar Athlete award for Big 12 Equestrian',
        award_type: 'academic_award',
        status: 'delivered',
        sport_name: 'Equestrian',
        sport_code: 'EQ',
        sport_gender: 'W',
        sport_season: 'fall',
        competition_level: 'regular_season',
        season_year: 2025,
        academic_year: '2024-25',
        class_code: 'S-050-00-EQ-W',
        account_code: '4105',
        unit_cost: 24570, // $245.70 in cents
        total_cost: 30037, // $300.37 total in cents
        quantity_ordered: 1,
        vendor_name: 'Jostens',
        engraving_details: 'Equestrian Scholar Athlete'
      }
    ];

    // Insert awards program data
    console.log('📝 Inserting awards program data...');
    const { data: insertedAwards, error: awardsError } = await supabase
      .from('awards_program')
      .insert(awardsData)
      .select('id, award_name');

    if (awardsError) {
      console.error('❌ Error inserting awards:', awardsError);
      return;
    }

    console.log(`✅ Inserted ${insertedAwards.length} awards successfully`);

    // Budget tracking data for invoices
    const budgetData = [
      {
        award_name: 'Baseball Championship Trophy',
        fiscal_year: '2024-25',
        budget_category: 'Awards',
        invoice_number: '791346',
        vendor_invoice_amount: 272325,
        tax_amount: 0,
        shipping_cost: 18660,
        payment_status: 'paid',
        requested_by: 'Lizzie',
        approved_by: 'Scott'
      },
      {
        award_name: 'Beach Volleyball Most Outstanding Pair',
        fiscal_year: '2024-25',
        budget_category: 'Awards',
        invoice_number: '790904',
        vendor_invoice_amount: 18900,
        tax_amount: 0,
        shipping_cost: 2331,
        payment_status: 'paid',
        requested_by: 'Lizzie',
        approved_by: 'Scott'
      },
      {
        award_name: 'Beach Volleyball Championship Trophy',
        fiscal_year: '2024-25',
        budget_category: 'Awards',
        invoice_number: '789041',
        vendor_invoice_amount: 262875,
        tax_amount: 0,
        shipping_cost: 13018,
        payment_status: 'paid',
        requested_by: 'Lizzie',
        approved_by: 'Scott'
      },
      {
        award_name: 'Equestrian Championship Trophy',
        fiscal_year: '2024-25',
        budget_category: 'Awards',
        invoice_number: '788239',
        vendor_invoice_amount: 499645,
        tax_amount: 0,
        shipping_cost: 20922,
        payment_status: 'paid',
        requested_by: 'Lizzie',
        approved_by: 'Scott'
      },
      {
        award_name: 'Equestrian Of The Year Plates',
        fiscal_year: '2024-25',
        budget_category: 'Awards',
        invoice_number: '788788',
        vendor_invoice_amount: 41500,
        tax_amount: 0,
        shipping_cost: 1833,
        payment_status: 'paid',
        requested_by: 'Lizzie',
        approved_by: 'Scott'
      },
      {
        award_name: 'Equestrian Scholar Athlete Award',
        fiscal_year: '2024-25',
        budget_category: 'Awards',
        invoice_number: '791347',
        vendor_invoice_amount: 24570,
        tax_amount: 2268,
        shipping_cost: 3199,
        payment_status: 'paid',
        requested_by: 'Lizzie',
        approved_by: 'Scott'
      }
    ];

    // Insert budget tracking data
    console.log('💰 Inserting budget tracking data...');
    
    for (const budget of budgetData) {
      // Find the corresponding award ID
      const award = insertedAwards.find(a => a.award_name === budget.award_name);
      if (!award) {
        console.log(`⚠️  Could not find award: ${budget.award_name}`);
        continue;
      }

      const budgetRecord = {
        award_id: award.id,
        fiscal_year: budget.fiscal_year,
        budget_category: budget.budget_category,
        invoice_number: budget.invoice_number,
        vendor_invoice_amount: budget.vendor_invoice_amount,
        tax_amount: budget.tax_amount,
        shipping_cost: budget.shipping_cost,
        payment_status: budget.payment_status,
        requested_by: budget.requested_by,
        approved_by: budget.approved_by
      };

      const { error: budgetError } = await supabase
        .from('award_budget_tracking')
        .insert(budgetRecord);

      if (budgetError) {
        console.error(`❌ Error inserting budget for ${budget.award_name}:`, budgetError);
      } else {
        console.log(`✅ Budget tracking added for invoice ${budget.invoice_number}`);
      }
    }

    console.log('\n🎉 Jostens invoice data insertion completed successfully!');

    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Awards inserted: ${insertedAwards.length}`);
    console.log(`- Budget records: ${budgetData.length}`);
    console.log(`- Total invoice value: $${(budgetData.reduce((sum, b) => sum + b.vendor_invoice_amount + b.tax_amount + b.shipping_cost, 0) / 100).toFixed(2)}`);
    
    // Sport breakdown
    const sportBreakdown = {};
    awardsData.forEach(award => {
      if (!sportBreakdown[award.sport_name]) {
        sportBreakdown[award.sport_name] = 0;
      }
      sportBreakdown[award.sport_name]++;
    });
    
    console.log('\n🏆 Awards by Sport:');
    Object.entries(sportBreakdown).forEach(([sport, count]) => {
      console.log(`- ${sport}: ${count} awards`);
    });

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
if (require.main === module) {
  insertJostensInvoices()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { insertJostensInvoices };