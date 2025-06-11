#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function insertJostensInvoices() {
  console.log('🎯 Inserting Jostens invoice data into invoices table...\n');

  const jostensInvoices = [
    // Baseball Championship split
    {
      invoice_number: '791346-A',
      vendor_name: 'Jostens',
      amount: 281535, // $2,815.35 in cents
      status: 'planned',
      date: '2025-05-15',
      due_date: '2025-06-15',
      notes: 'Baseball Championship Trophy - Invoice 791346 part A',
      sport_id: 1,
      sport_code: 'BSB',
      award_type: 'championship',
      class_code: 'S-060-00-HB-0',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '01-01-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 18660
    },
    {
      invoice_number: '791346-B',
      vendor_name: 'Jostens',
      amount: 9450, // $94.50 in cents
      status: 'planned',
      date: '2025-05-15',
      due_date: '2025-06-15',
      notes: 'Baseball Most Outstanding Player - Invoice 791346 part B',
      sport_id: 1,
      sport_code: 'BSB',
      award_type: 'championship',
      class_code: 'S-060-00-HB-0',
      supervisor: 'Lizzie',
      award_description: 'Most Outstanding Player',
      award_id_new: '01-08-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 9450,
      tax_amount: 0,
      shipping_cost: 0
    },
    
    // Beach Volleyball MOP
    {
      invoice_number: '790904',
      vendor_name: 'Jostens',
      amount: 21231, // $212.31 in cents
      status: 'planned',
      date: '2025-05-08',
      due_date: '2025-06-08',
      notes: 'Beach Volleyball Most Outstanding Pair',
      sport_id: 4,
      sport_code: 'BVB',
      award_type: 'championship',
      class_code: 'S-060-00-BV-W',
      supervisor: 'Lizzie',
      award_description: 'Most Outstanding Pair',
      award_id_new: '04-08-01-2026',
      academic_year: '2024-25',
      quantity: 2,
      unit_cost: 9450,
      tax_amount: 0,
      shipping_cost: 2331
    },
    
    // Beach Volleyball Championship Trophy
    {
      invoice_number: '789041',
      vendor_name: 'Jostens',
      amount: 275893, // $2,758.93 in cents
      status: 'planned',
      date: '2025-04-03',
      due_date: '2025-05-03',
      notes: 'Beach Volleyball Championship Trophy',
      sport_id: 4,
      sport_code: 'BVB',
      award_type: 'championship',
      class_code: 'S-060-00-BV-W',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '04-01-01-2026',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 13018
    },
    
    // Equestrian Championship split
    {
      invoice_number: '788239-A',
      vendor_name: 'Jostens',
      amount: 283797, // $2,837.97 in cents
      status: 'planned',
      date: '2025-03-13',
      due_date: '2025-04-13',
      notes: 'Equestrian Championship Trophy - Invoice 788239 part A',
      sport_id: 7,
      sport_code: 'EQ',
      award_type: 'championship',
      class_code: 'S-060-00-EQ-W',
      supervisor: 'Lizzie',
      award_description: 'Championship Trophy',
      award_id_new: '07-01-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 262875,
      tax_amount: 0,
      shipping_cost: 20922
    },
    {
      invoice_number: '788239-B',
      vendor_name: 'Jostens',
      amount: 37800, // $378.00 in cents
      status: 'planned',
      date: '2025-03-13',
      due_date: '2025-04-13',
      notes: 'Equestrian Most Outstanding Performer - Invoice 788239 part B',
      sport_id: 7,
      sport_code: 'EQ',
      award_type: 'championship',
      class_code: 'S-060-00-EQ-W',
      supervisor: 'Lizzie',
      award_description: 'Most Outstanding Performer',
      award_id_new: '07-08-01-2425',
      academic_year: '2024-25',
      quantity: 4,
      unit_cost: 9450,
      tax_amount: 0,
      shipping_cost: 0
    },
    {
      invoice_number: '788239-C',
      vendor_name: 'Jostens',
      amount: 198970, // $1,989.70 in cents
      status: 'planned',
      date: '2025-03-13',
      due_date: '2025-04-13',
      notes: 'Equestrian OTY + 1st Team - Invoice 788239 part C',
      sport_id: 7,
      sport_code: 'EQ',
      award_type: 'regular_season',
      class_code: 'S-050-00-EQ-W',
      supervisor: 'Lizzie',
      award_description: 'Of The Year + 1st Team All-Conference',
      award_id_new: '07-04-08-2425',
      academic_year: '2024-25',
      quantity: 25,
      unit_cost: 7959, // Average of $245.70 for OTY and $38.06 for 1st Team
      tax_amount: 0,
      shipping_cost: 0
    },
    
    // Equestrian Regular Season Plates
    {
      invoice_number: '788788',
      vendor_name: 'Jostens',
      amount: 43333, // $433.33 in cents
      status: 'planned',
      date: '2025-03-27',
      due_date: '2025-04-27',
      notes: 'Equestrian OTY plates + All Conference plates',
      sport_id: 7,
      sport_code: 'EQ',
      award_type: 'regular_season',
      class_code: 'S-050-00-EQ-W',
      supervisor: 'Lizzie',
      award_description: 'Of The Year plates + All Conference plates',
      award_id_new: '07-04-03-2425',
      academic_year: '2024-25',
      quantity: 26,
      unit_cost: 1500, // $15.00 per plate
      tax_amount: 0,
      shipping_cost: 1833
    },
    
    // Equestrian Scholar Athlete
    {
      invoice_number: '791347',
      vendor_name: 'Jostens',
      amount: 30037, // $300.37 in cents
      status: 'planned',
      date: '2025-05-15',
      due_date: '2025-06-15',
      notes: 'Equestrian Scholar Athlete Award',
      sport_id: 7,
      sport_code: 'EQ',
      award_type: 'academic',
      class_code: 'S-050-00-EQ-W',
      supervisor: 'Lizzie',
      award_description: 'Scholar Athlete',
      award_id_new: '07-19-01-2425',
      academic_year: '2024-25',
      quantity: 1,
      unit_cost: 24570,
      tax_amount: 2268,
      shipping_cost: 3199
    }
  ];

  try {
    console.log('📝 Inserting invoice records...');
    
    for (const invoice of jostensInvoices) {
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
    console.log('\n🔍 Verifying Jostens invoices...');
    const { data: jostensData, error: verifyError } = await supabase
      .from('invoices')
      .select('*')
      .eq('vendor_name', 'Jostens')
      .order('invoice_number');

    if (!verifyError) {
      console.log(`✅ Found ${jostensData.length} Jostens invoice records`);
      
      // Summary by sport
      const sportSummary = {};
      let totalAmount = 0;
      
      jostensData.forEach(invoice => {
        if (!sportSummary[invoice.sport_code]) {
          sportSummary[invoice.sport_code] = { count: 0, amount: 0 };
        }
        sportSummary[invoice.sport_code].count++;
        sportSummary[invoice.sport_code].amount += invoice.amount;
        totalAmount += invoice.amount;
      });
      
      console.log('\n📊 Summary by Sport:');
      Object.entries(sportSummary).forEach(([sport, data]) => {
        console.log(`${sport}: ${data.count} invoices, $${(data.amount / 100).toFixed(2)}`);
      });
      
      console.log(`\n💰 Total Amount: $${(totalAmount / 100).toFixed(2)}`);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the script
insertJostensInvoices()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });