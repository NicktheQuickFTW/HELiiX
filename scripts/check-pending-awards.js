import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPendingAwards() {
  console.log('Checking for awards ordered but awaiting invoices...\n');

  try {
    // First, get all awards that should have been ordered
    const { data: awards, error: awardsError } = await supabase
      .from('awards')
      .select('*')
      .in('status', ['ordered', 'pending_invoice', 'in_production'])
      .order('sport', { ascending: true });

    if (awardsError) {
      console.error('Error fetching awards:', awardsError);
      return;
    }

    // Get all invoices to cross-reference
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('sport_code, award_description, invoice_number, amount')
      .order('sport_code', { ascending: true });

    if (invoicesError) {
      console.error('Error fetching invoices:', invoicesError);
      return;
    }

    // Create a map of invoiced items by sport
    const invoicedItems = {};
    invoices.forEach(inv => {
      const key = `${inv.sport_code}-${inv.award_description}`;
      if (!invoicedItems[inv.sport_code]) {
        invoicedItems[inv.sport_code] = [];
      }
      invoicedItems[inv.sport_code].push(inv.award_description);
    });

    console.log('=== AWARDS ORDERED BUT AWAITING INVOICES ===\n');

    // Sports that typically have championship awards
    const championshipSports = [
      { code: 'FB', name: 'Football', championships: ['Big 12 Championship Trophy', 'Championship Game MVP'] },
      { code: 'MBB', name: "Men's Basketball", championships: ['Tournament Championship Trophy', 'Tournament MVP', 'All-Tournament Team'] },
      { code: 'BSB', name: 'Baseball', championships: ['Tournament Championship Trophy', 'Tournament MVP', 'All-Tournament Team'] },
      { code: 'SB', name: 'Softball', championships: ['Tournament Championship Trophy', 'Tournament MVP', 'All-Tournament Team'] },
      { code: 'MOTF', name: "Men's Outdoor Track", championships: ['Championship Trophy', 'Individual Event Medals'] },
      { code: 'WOTF', name: "Women's Outdoor Track", championships: ['Championship Trophy', 'Individual Event Medals'] }
    ];

    let pendingCount = 0;
    let estimatedTotal = 0;

    // Check each championship sport
    championshipSports.forEach(sport => {
      const sportInvoices = invoicedItems[sport.code] || [];
      const missingAwards = [];

      sport.championships.forEach(award => {
        const hasInvoice = sportInvoices.some(inv => 
          inv.toLowerCase().includes(award.toLowerCase()) ||
          inv.toLowerCase().includes('championship')
        );
        
        if (!hasInvoice) {
          missingAwards.push(award);
        }
      });

      if (missingAwards.length > 0) {
        console.log(`${sport.name} (${sport.code}):`);
        missingAwards.forEach(award => {
          console.log(`  - ${award}`);
          pendingCount++;
          
          // Estimate costs based on typical prices
          if (award.includes('Trophy')) {
            estimatedTotal += 2800; // Typical championship trophy cost
          } else if (award.includes('MVP')) {
            estimatedTotal += 250; // MVP award cost
          } else if (award.includes('All-Tournament')) {
            estimatedTotal += 1500; // Team awards cost
          } else if (award.includes('Medals')) {
            estimatedTotal += 500; // Medal set cost
          }
        });
        console.log('');
      }
    });

    // Check for spring sports that haven't happened yet
    console.log('=== UPCOMING SPRING CHAMPIONSHIPS (Not Yet Ordered) ===\n');
    
    const springSports = [
      'Baseball', 'Softball', 'Men\'s Golf', 'Women\'s Golf',
      'Men\'s Tennis', 'Women\'s Tennis', 'Men\'s Outdoor Track',
      'Women\'s Outdoor Track', 'Beach Volleyball', 'Rowing'
    ];

    springSports.forEach(sport => {
      console.log(`${sport}: Championship awards to be ordered after tournament`);
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Pending Invoices: ${pendingCount} awards`);
    console.log(`Estimated Value: $${estimatedTotal.toLocaleString()}`);
    console.log(`\nNote: Spring championship awards will be ordered after tournaments conclude.`);

    // Check for any awards marked as ordered in the database
    if (awards && awards.length > 0) {
      console.log('\n=== AWARDS MARKED AS ORDERED IN DATABASE ===\n');
      awards.forEach(award => {
        console.log(`${award.sport || 'Unknown'}: ${award.name || award.award_type}`);
        console.log(`  Status: ${award.status}`);
        console.log(`  Quantity: ${award.quantity || 'N/A'}`);
        if (award.notes) console.log(`  Notes: ${award.notes}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('Error checking pending awards:', error);
  }
}

// Run the check
checkPendingAwards().catch(console.error);