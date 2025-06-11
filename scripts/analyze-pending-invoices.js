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

async function analyzePendingInvoices() {
  console.log('Analyzing awards ordered but awaiting invoices...\n');

  try {
    // Get all invoices to see what we've already received
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('invoice_number, sport_code, award_description, amount, status, date')
      .order('sport_code', { ascending: true });

    if (invoicesError) {
      console.error('Error fetching invoices:', invoicesError);
      return;
    }

    // Group invoices by sport
    const invoicedBySport = {};
    invoices.forEach(inv => {
      if (!invoicedBySport[inv.sport_code]) {
        invoicedBySport[inv.sport_code] = [];
      }
      invoicedBySport[inv.sport_code].push({
        invoice: inv.invoice_number,
        description: inv.award_description,
        amount: inv.amount / 100, // Convert from cents
        date: inv.date
      });
    });

    console.log('=== CURRENT INVOICE STATUS BY SPORT ===\n');
    
    // List what we have invoices for
    Object.keys(invoicedBySport).sort().forEach(sport => {
      console.log(`${sport}:`);
      invoicedBySport[sport].forEach(inv => {
        console.log(`  ✓ ${inv.description} - Invoice #${inv.invoice} ($${inv.amount.toFixed(2)})`);
      });
      console.log('');
    });

    console.log('=== EXPECTED AWARDS STILL PENDING INVOICES ===\n');

    // Based on typical Big 12 award cycles, these are likely ordered but pending invoices:
    const pendingAwards = [
      {
        sport: 'FB (Football)',
        event: 'Big 12 Championship Game (Dec 7, 2024)',
        awards: [
          'Championship Trophy - Arlington',
          'Championship Game MVP Award',
          'Participant Awards',
          'Officials Awards'
        ],
        estimatedCost: 5000
      },
      {
        sport: 'MBB (Men\'s Basketball)',
        event: 'Big 12 Tournament (March 2025)',
        awards: [
          'Tournament Championship Trophy',
          'Tournament MVP Award',
          'All-Tournament Team Awards (5)',
          'Participant Awards'
        ],
        estimatedCost: 4500
      },
      {
        sport: 'WBB (Women\'s Basketball)',
        event: 'Big 12 Tournament (March 2025)',
        awards: [
          'Additional All-Conference Awards',
          'Scholar Athlete Awards',
          'Special Recognition Awards'
        ],
        estimatedCost: 2000
      },
      {
        sport: 'BSB (Baseball)',
        event: 'Big 12 Tournament (May 2025)',
        awards: [
          'Tournament Championship Trophy',
          'Tournament MVP Award',
          'All-Tournament Team Awards (9)',
          'Pitcher/Player of the Year'
        ],
        estimatedCost: 4000
      },
      {
        sport: 'SB (Softball)',
        event: 'Big 12 Tournament (May 2025)',
        awards: [
          'Additional Tournament Awards',
          'All-Tournament Team Awards',
          'Special Recognition'
        ],
        estimatedCost: 2500
      },
      {
        sport: 'MOTF/WOTF (Outdoor Track)',
        event: 'Big 12 Championships (May 2025)',
        awards: [
          'Team Championship Trophies',
          'Individual Event Medals (estimated 200+)',
          'Relay Medals',
          'Athlete of the Meet Awards'
        ],
        estimatedCost: 8000
      },
      {
        sport: 'MGO/WGO (Golf)',
        event: 'Big 12 Championships (April 2025)',
        awards: [
          'Team Championship Trophies',
          'Individual Medals',
          'All-Conference Awards'
        ],
        estimatedCost: 3000
      }
    ];

    let totalPending = 0;
    let totalEstimated = 0;

    pendingAwards.forEach(sport => {
      const hasInvoice = invoicedBySport[sport.sport.split(' ')[0]];
      const missingAwards = [];
      
      sport.awards.forEach(award => {
        const invoiced = hasInvoice && hasInvoice.some(inv => 
          inv.description.toLowerCase().includes(award.toLowerCase().split(' ')[0])
        );
        if (!invoiced) {
          missingAwards.push(award);
        }
      });

      if (missingAwards.length > 0) {
        console.log(`${sport.sport} - ${sport.event}:`);
        missingAwards.forEach(award => {
          console.log(`  ⏳ ${award}`);
          totalPending++;
        });
        console.log(`  Estimated Cost: $${sport.estimatedCost.toLocaleString()}`);
        totalEstimated += sport.estimatedCost;
        console.log('');
      }
    });

    console.log('=== SUMMARY ===');
    console.log(`Total Pending Awards: ${totalPending} items`);
    console.log(`Estimated Pending Value: $${totalEstimated.toLocaleString()}`);
    console.log(`\nTotal Invoiced to Date: $${invoices.reduce((sum, inv) => sum + (inv.amount / 100), 0).toLocaleString()}`);
    console.log(`\nNote: Spring sport championships (Baseball, Softball, Golf, Tennis, Outdoor Track)`);
    console.log(`      will be ordered after tournaments conclude in April-May 2025.`);

  } catch (error) {
    console.error('Error analyzing pending invoices:', error);
  }
}

// Run the analysis
analyzePendingInvoices().catch(console.error);