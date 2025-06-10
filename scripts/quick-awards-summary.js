const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function generateQuickSummary() {
  console.log('=== AWARDS ORDER PROCESSING SUMMARY ===\n');
  
  try {
    // Get current database state
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select('*')
      .order('created_at', { ascending: false });
      
    const { data: recipients, error: recipientsError } = await supabase
      .from('award_recipients')
      .select('*')
      .order('created_at', { ascending: false });
      
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (awardsError || recipientsError || invoicesError) {
      console.error('Database error:', awardsError || recipientsError || invoicesError);
      return;
    }
    
    console.log('DATABASE STATUS:');
    console.log(`Total Awards: ${awards.length}`);
    console.log(`Total Recipients: ${recipients.length}`);
    console.log(`Total Invoices: ${invoices.length}`);
    
    // Calculate financial totals
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    console.log('\nFINANCIAL SUMMARY:');
    console.log(`Total Invoice Amount: $${(totalInvoiceAmount / 100).toFixed(2)}`);
    console.log('Account 4105 - Awards');
    
    // Show recent awards added
    console.log('\nRECENT AWARDS ADDED:');
    awards.slice(0, 10).forEach(award => {
      console.log(`• ${award.name} (Qty: ${award.quantity}) - ${award.status}`);
    });
    
    console.log('\nCLASS CODE IMPLEMENTATION STATUS:');
    console.log('✅ Framework created for S-050 (Regular Season) and S-060 (Championship) codes');
    console.log('✅ Sport-Gender mapping implemented (XX-M/XX-W format)');
    console.log('✅ Recipients and school tracking integrated');
    console.log('⚠️  CSV parsing needs refinement for varying file formats');
    
    console.log('\nNEXT STEPS:');
    console.log('1. Fix CSV parsing for different column structures');
    console.log('2. Add missing school mappings (UCF, Colorado variants, etc.)');
    console.log('3. Handle Excel files (.xlsx) conversion');
    console.log('4. Implement class code assignment to existing data');
    console.log('5. Generate financial reports with class code breakdowns');
    
  } catch (error) {
    console.error('Error generating summary:', error);
  }
}

generateQuickSummary();