#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function summarizeInvoices() {
  const { data, count } = await supabase
    .from('invoices')
    .select('invoice_number, vendor_name, amount, sport_code, award_type', { count: 'exact' })
    .eq('vendor_name', 'Jostens')
    .order('created_at', { ascending: false })
    .limit(19);
  
  console.log(`📊 Total Jostens invoices in database: ${count}`);
  console.log('\n🆕 Recently loaded invoices (batch 2):');
  
  const batch2 = data.slice(0, 11);
  batch2.forEach((inv, i) => {
    console.log(`${i+1}. #${inv.invoice_number} - ${inv.sport_code || 'N/A'} - $${(inv.amount/100).toFixed(2)}`);
  });
  
  const batch2Total = batch2.reduce((sum, inv) => sum + inv.amount, 0);
  console.log(`\n💰 Batch 2 total: $${(batch2Total/100).toFixed(2)}`);
  
  // Sport summary
  const sportSummary = {};
  data.forEach(inv => {
    const sport = inv.sport_code || 'Unknown';
    if (!sportSummary[sport]) {
      sportSummary[sport] = { count: 0, total: 0 };
    }
    sportSummary[sport].count++;
    sportSummary[sport].total += inv.amount;
  });
  
  console.log('\n🏆 Invoices by Sport (recent 19):');
  Object.entries(sportSummary).sort((a, b) => b[1].total - a[1].total).forEach(([sport, data]) => {
    console.log(`  ${sport}: ${data.count} invoices - $${(data.total/100).toFixed(2)}`);
  });
  
  const grandTotal = Object.values(sportSummary).reduce((sum, data) => sum + data.total, 0);
  console.log(`\n💵 Grand total (19 recent invoices): $${(grandTotal/100).toFixed(2)}`);
}

summarizeInvoices()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });