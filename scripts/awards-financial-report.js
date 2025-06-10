const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateFinancialReport() {
  console.log('=== BIG 12 AWARDS FINANCIAL REPORT - FY 2025-26 ===\n');
  
  try {
    // Get all awards and their associated invoices
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select('*');
      
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*');
    
    if (awardsError || invoicesError) {
      console.error('Error fetching data:', awardsError || invoicesError);
      return;
    }
    
    // Calculate totals by status
    const statusTotals = {};
    const categoryTotals = {};
    let grandTotal = 0;
    
    // Big 12 Account Classification
    console.log('ACCOUNT CLASSIFICATION:');
    console.log('Account 4105 - Awards');
    console.log('Expense Category: Championship Awards & Recognition\n');
    
    // Detailed breakdown
    console.log('DETAILED COST BREAKDOWN:');
    console.log('=' .repeat(80));
    console.log('Award Type'.padEnd(25) + 'Qty'.padEnd(8) + 'Unit Cost'.padEnd(12) + 'Tax (5%)'.padEnd(12) + 'Total Cost');
    console.log('-'.repeat(80));
    
    awards.forEach(award => {
      const invoice = invoices.find(inv => inv.award_id === award.id);
      if (invoice) {
        const unitCost = invoice.amount / award.quantity;
        const taxAmount = unitCost * 0.05; // Assuming 5% tax
        const baseUnit = unitCost / 1.05;
        
        console.log(
          award.name.padEnd(25) + 
          award.quantity.toString().padEnd(8) + 
          `$${(baseUnit / 100).toFixed(2)}`.padEnd(12) + 
          `$${(taxAmount / 100).toFixed(2)}`.padEnd(12) + 
          `$${(invoice.amount / 100).toFixed(2)}`
        );
        
        // Accumulate totals
        if (!statusTotals[award.status]) statusTotals[award.status] = 0;
        statusTotals[award.status] += invoice.amount;
        grandTotal += invoice.amount;
        
        // Categorize awards
        let category = 'Other';
        if (award.name.includes('Trophy')) category = 'Trophies';
        else if (award.name.includes('All-Big 12')) category = 'All-Conference';
        else if (award.name.includes('OTY')) category = 'Official Recognition';
        else if (award.name.includes('MOP')) category = 'Outstanding Player';
        else if (award.name.includes('Medallion')) category = 'Medallions';
        
        if (!categoryTotals[category]) categoryTotals[category] = 0;
        categoryTotals[category] += invoice.amount;
      }
    });
    
    console.log('-'.repeat(80));
    console.log(`TOTAL AWARDS BUDGET:`.padEnd(57) + `$${(grandTotal / 100).toFixed(2)}`);
    console.log('=' .repeat(80));
    
    // Status breakdown
    console.log('\nSTATUS BREAKDOWN:');
    console.log('-'.repeat(40));
    Object.entries(statusTotals).forEach(([status, amount]) => {
      console.log(`${status.charAt(0).toUpperCase() + status.slice(1)}:`.padEnd(15) + `$${(amount / 100).toFixed(2)}`);
    });
    
    // Category breakdown
    console.log('\nCATEGORY BREAKDOWN:');
    console.log('-'.repeat(40));
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      const percentage = ((amount / grandTotal) * 100).toFixed(1);
      console.log(`${category}:`.padEnd(20) + `$${(amount / 100).toFixed(2)}`.padEnd(12) + `(${percentage}%)`);
    });
    
    // Budget recommendations
    console.log('\nBUDGET RECOMMENDATIONS:');
    console.log('-'.repeat(50));
    console.log('• Current total budget allocation: $11,099.08');
    console.log('• Recommended contingency (10%): $1,109.91');
    console.log('• Suggested total budget: $12,209.00');
    console.log('• Account: 4105 - Awards');
    console.log('• Fiscal Year: 2025-26');
    
    // Next steps
    console.log('\nNEXT STEPS:');
    console.log('-'.repeat(30));
    console.log('1. Review vendor selection for "TBD - Awards Vendor"');
    console.log('2. Finalize quantities for All-Big 12 awards based on sport participation');
    console.log('3. Confirm delivery timelines for championship events');
    console.log('4. Update invoice status as orders are placed');
    console.log('5. Set up budget tracking in financial system');
    
    // Export summary for accounting
    const summary = {
      account: '4105',
      description: 'Awards',
      fiscal_year: '2025-26',
      total_budget: (grandTotal / 100),
      recommended_budget: Math.ceil((grandTotal * 1.1) / 100),
      status_breakdown: Object.fromEntries(
        Object.entries(statusTotals).map(([k,v]) => [k, v/100])
      ),
      category_breakdown: Object.fromEntries(
        Object.entries(categoryTotals).map(([k,v]) => [k, v/100])
      ),
      item_count: awards.length,
      total_units: awards.reduce((sum, award) => sum + award.quantity, 0)
    };
    
    console.log('\n=== JSON EXPORT FOR ACCOUNTING SYSTEM ===');
    console.log(JSON.stringify(summary, null, 2));
    
  } catch (error) {
    console.error('Error generating financial report:', error);
  }
}

generateFinancialReport();