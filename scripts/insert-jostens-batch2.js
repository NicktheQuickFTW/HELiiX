#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function insertJostensBatch2() {
  console.log('🎯 Inserting Jostens Batch 2 invoice data into invoices table...\n');

  const batch2Invoices = [
    // Gymnastics (787803) - Split by budget
    {
      invoice_number: '787803-A',
      vendor_name: 'Jostens',
      amount: 292185, // $2,921.85 in cents
      status: 'planned',
      date: '2025-02-27',
      due_date: '2025-03-27',
      notes: 'Gymnastics Championship Trophy - Invoice 787803 part A',
      sport_id: 11,
      sport_code: 'GYM',
      award_type: 'championship',
      class_code: 'S-060-00-GY-W',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '11-01-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 29310
    },
    {
      invoice_number: '787803-B',
      vendor_name: 'Jostens',
      amount: 152250, // $1,522.50 in cents
      status: 'planned',
      date: '2025-02-27',
      due_date: '2025-03-27',
      notes: 'Gymnastics Tournament Championship - Invoice 787803 part B',
      sport_id: 11,
      sport_code: 'GYM',
      award_type: 'championship',
      class_code: 'S-060-00-GY-W',
      supervisor: 'Lizzie',
      award_description: 'Tournament Championship',
      award_id_new: '11-02-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 152250,
      tax_amount: 0,
      shipping_cost: 0
    },
    {
      invoice_number: '787803-C',
      vendor_name: 'Jostens',
      amount: 310577, // $3,105.77 in cents
      status: 'planned',
      date: '2025-02-27',
      due_date: '2025-03-27',
      notes: 'Gymnastics OTY A + OTY B + Medals - Invoice 787803 part C',
      sport_id: 11,
      sport_code: 'GYM',
      award_type: 'regular_season',
      class_code: 'S-050-00-GY-W',
      supervisor: 'Lizzie',
      award_description: 'Of The Year A + Of The Year B + Medals',
      award_id_new: '11-04-01-2425',
      academic_year: '2024-25',
      quantity: 17,
      unit_cost: 18269, // Average cost per award
      tax_amount: 0,
      shipping_cost: 0
    },
    
    // Indoor Track & Field (790279)
    {
      invoice_number: '790279',
      vendor_name: 'Jostens',
      amount: 170218, // $1,702.18 in cents
      status: 'planned',
      date: '2025-04-29',
      due_date: '2025-05-29',
      notes: 'Indoor Track & Field Of The Year Awards',
      sport_id: 20,
      sport_code: 'ITK',
      award_type: 'regular_season',
      class_code: 'S-050-00-IT-M',
      supervisor: 'Lizzie',
      award_description: 'Of The Year Awards',
      award_id_new: '20-04-01-2425',
      academic_year: '2024-25',
      quantity: 6,
      unit_cost: 24089, // $240.89 per award
      tax_amount: 12785,
      shipping_cost: 12901
    },
    
    // Lacrosse - Split by budget
    {
      invoice_number: '789582-A',
      vendor_name: 'Jostens',
      amount: 22119, // $221.19 in cents
      status: 'planned',
      date: '2025-04-17',
      due_date: '2025-05-17',
      notes: 'Lacrosse Most Outstanding Player - Invoice 789582 part A',
      sport_id: 12,
      sport_code: 'LAX',
      award_type: 'championship',
      class_code: 'S-060-00-LX-W',
      supervisor: 'Lizzie',
      award_description: 'Most Outstanding Player',
      award_id_new: '12-08-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 9450,
      tax_amount: 0,
      shipping_cost: 12669
    },
    {
      invoice_number: '789582-B',
      vendor_name: 'Jostens',
      amount: 152250, // $1,522.50 in cents
      status: 'planned',
      date: '2025-04-17',
      due_date: '2025-05-17',
      notes: 'Lacrosse Tournament Championship - Invoice 789582 part B',
      sport_id: 12,
      sport_code: 'LAX',
      award_type: 'championship',
      class_code: 'S-060-00-LX-W',
      supervisor: 'Lizzie',
      award_description: 'Tournament Championship',
      award_id_new: '12-02-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 152250,
      tax_amount: 0,
      shipping_cost: 0
    },
    {
      invoice_number: '790026',
      vendor_name: 'Jostens',
      amount: 350629, // $3,506.29 in cents
      status: 'planned',
      date: '2025-04-24',
      due_date: '2025-05-24',
      notes: 'Lacrosse Championship Trophy',
      sport_id: 12,
      sport_code: 'LAX',
      award_type: 'championship',
      class_code: 'S-060-00-LX-W',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '12-01-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 19716,
      shipping_cost: 68038
    },
    
    // Men's Basketball - Split by budget
    {
      invoice_number: '790905-A',
      vendor_name: 'Jostens',
      amount: 256659, // $2,566.59 in cents
      status: 'planned',
      date: '2025-05-08',
      due_date: '2025-06-08',
      notes: 'Men\'s Basketball OTY Awards + All-Conference Teams - Invoice 790905 part A',
      sport_id: 2,
      sport_code: 'MBB',
      award_type: 'regular_season',
      class_code: 'S-050-00-BB-M',
      supervisor: 'Lizzie',
      award_description: 'Of The Year Awards + All-Conference Teams',
      award_id_new: '02-04-01-2425',
      academic_year: '2024-25',
      quantity: 27,
      unit_cost: 8672, // Average cost per award
      tax_amount: 204,
      shipping_cost: 22255
    },
    {
      invoice_number: '787804',
      vendor_name: 'Jostens',
      amount: 270924, // $2,709.24 in cents
      status: 'planned',
      date: '2025-02-27',
      due_date: '2025-03-27',
      notes: 'Men\'s Basketball Championship Trophy',
      sport_id: 2,
      sport_code: 'MBB',
      award_type: 'championship',
      class_code: 'S-060-00-BB-M',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '02-01-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 8049
    },
    {
      invoice_number: '787985-A',
      vendor_name: 'Jostens',
      amount: 23849, // $238.49 in cents
      status: 'planned',
      date: '2025-03-06',
      due_date: '2025-04-06',
      notes: 'Men\'s Basketball Most Outstanding Player - Invoice 787985 part A',
      sport_id: 2,
      sport_code: 'MBB',
      award_type: 'championship',
      class_code: 'S-060-00-BB-M',
      supervisor: 'Lizzie',
      award_description: 'Most Outstanding Player',
      award_id_new: '02-08-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 9450,
      tax_amount: 0,
      shipping_cost: 14399
    },
    {
      invoice_number: '787985-B',
      vendor_name: 'Jostens',
      amount: 24570, // $245.70 in cents
      status: 'planned',
      date: '2025-03-06',
      due_date: '2025-04-06',
      notes: 'Men\'s Basketball Of The Year Large - Invoice 787985 part B',
      sport_id: 2,
      sport_code: 'MBB',
      award_type: 'championship',
      class_code: 'S-060-00-BB-M',
      supervisor: 'Lizzie',
      award_description: 'Of The Year Large',
      award_id_new: '02-04-08-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 24570,
      tax_amount: 0,
      shipping_cost: 0
    },
    {
      invoice_number: '787985-C',
      vendor_name: 'Jostens',
      amount: 152250, // $1,522.50 in cents
      status: 'planned',
      date: '2025-03-06',
      due_date: '2025-04-06',
      notes: 'Men\'s Basketball Tournament Championship - Invoice 787985 part C',
      sport_id: 2,
      sport_code: 'MBB',
      award_type: 'championship',
      class_code: 'S-060-00-BB-M',
      supervisor: 'Lizzie',
      award_description: 'Tournament Championship',
      award_id_new: '02-02-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 152250,
      tax_amount: 0,
      shipping_cost: 0
    },
    
    // Men's Golf (788545)
    {
      invoice_number: '788545',
      vendor_name: 'Jostens',
      amount: 269201, // $2,692.01 in cents
      status: 'planned',
      date: '2025-03-20',
      due_date: '2025-04-20',
      notes: 'Men\'s Golf Championship Trophy',
      sport_id: 9,
      sport_code: 'MGO',
      award_type: 'championship',
      class_code: 'S-060-00-GF-M',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '09-01-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 6326
    },
    
    // Men's Tennis - Split by budget
    {
      invoice_number: '789042-A',
      vendor_name: 'Jostens',
      amount: 21089, // $210.89 in cents
      status: 'planned',
      date: '2025-04-03',
      due_date: '2025-05-03',
      notes: 'Men\'s Tennis Most Outstanding Player - Invoice 789042 part A',
      sport_id: 18,
      sport_code: 'MTN',
      award_type: 'championship',
      class_code: 'S-060-00-TN-M',
      supervisor: 'Lizzie',
      award_description: 'Most Outstanding Player',
      award_id_new: '18-08-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 9450,
      tax_amount: 0,
      shipping_cost: 11639
    },
    {
      invoice_number: '789042-B',
      vendor_name: 'Jostens',
      amount: 152250, // $1,522.50 in cents
      status: 'planned',
      date: '2025-04-03',
      due_date: '2025-05-03',
      notes: 'Men\'s Tennis Tournament Championship - Invoice 789042 part B',
      sport_id: 18,
      sport_code: 'MTN',
      award_type: 'championship',
      class_code: 'S-060-00-TN-M',
      supervisor: 'Lizzie',
      award_description: 'Tournament Championship',
      award_id_new: '18-02-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 152250,
      tax_amount: 0,
      shipping_cost: 0
    },
    {
      invoice_number: '792130',
      vendor_name: 'Jostens',
      amount: 228358, // $2,283.58 in cents
      status: 'planned',
      date: '2025-05-29',
      due_date: '2025-06-29',
      notes: 'Men\'s Tennis OTY Awards + 1st Team All-Conference',
      sport_id: 18,
      sport_code: 'MTN',
      award_type: 'regular_season',
      class_code: 'S-050-00-TN-M',
      supervisor: 'Lizzie',
      award_description: 'Of The Year Awards + 1st Team All-Conference',
      award_id_new: '18-04-01-2026',
      academic_year: '2024-25',
      quantity: 29,
      unit_cost: 7286, // Average cost per award
      tax_amount: 494,
      shipping_cost: 16558
    },
    {
      invoice_number: '789583',
      vendor_name: 'Jostens',
      amount: 275454, // $2,754.54 in cents
      status: 'planned',
      date: '2025-04-17',
      due_date: '2025-05-17',
      notes: 'Men\'s Tennis Championship Trophy',
      sport_id: 18,
      sport_code: 'MTN',
      award_type: 'championship',
      class_code: 'S-060-00-TN-M',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '18-01-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 12579
    }
  ];

  try {
    console.log('📝 Inserting batch 2 invoice records...');
    
    for (const invoice of batch2Invoices) {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select();

      if (error) {
        console.log(`❌ Error inserting ${invoice.invoice_number}:`, error.message);
      } else {
        console.log(`✅ Inserted ${invoice.invoice_number} - ${invoice.award_description}`);
      }
    }

    // Verify the insertions
    console.log('\n🔍 Verifying all Jostens invoices...');
    const { data: allJostensData, error: verifyError } = await supabase
      .from('invoices')
      .select('*')
      .eq('vendor_name', 'Jostens')
      .order('invoice_number');

    if (!verifyError) {
      console.log(`✅ Found ${allJostensData.length} total Jostens invoice records`);
      
      // Summary by sport
      const sportSummary = {};
      let totalAmount = 0;
      
      allJostensData.forEach(invoice => {
        const sport = invoice.sport_code || 'Unknown';
        if (!sportSummary[sport]) {
          sportSummary[sport] = { count: 0, amount: 0, rs: 0, cc: 0 };
        }
        sportSummary[sport].count++;
        sportSummary[sport].amount += invoice.amount;
        
        if (invoice.award_type === 'championship') {
          sportSummary[sport].cc++;
        } else {
          sportSummary[sport].rs++;
        }
        
        totalAmount += invoice.amount;
      });
      
      console.log('\n📊 Summary by Sport:');
      Object.entries(sportSummary).forEach(([sport, data]) => {
        console.log(`${sport}: ${data.count} invoices, $${(data.amount / 100).toFixed(2)} (RS: ${data.rs}, CC: ${data.cc})`);
      });
      
      console.log(`\n💰 Total Amount: $${(totalAmount / 100).toFixed(2)}`);

      // Budget classification summary
      const budgetSummary = {
        'S-050': { count: 0, amount: 0 }, // Regular Season
        'S-060': { count: 0, amount: 0 }  // Championship
      };
      
      allJostensData.forEach(invoice => {
        const budgetType = invoice.class_code?.substring(0, 5) || 'Unknown';
        if (budgetSummary[budgetType]) {
          budgetSummary[budgetType].count++;
          budgetSummary[budgetType].amount += invoice.amount;
        }
      });
      
      console.log('\n💼 Budget Classification:');
      console.log(`S-050 (Regular Season): ${budgetSummary['S-050'].count} invoices, $${(budgetSummary['S-050'].amount / 100).toFixed(2)}`);
      console.log(`S-060 (Championship): ${budgetSummary['S-060'].count} invoices, $${(budgetSummary['S-060'].amount / 100).toFixed(2)}`);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
insertJostensBatch2()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });