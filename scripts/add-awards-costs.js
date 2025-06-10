const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Awards cost data from 25-26 Awards Cost Breakdown.xlsx
const awardsCostData = [
  {
    name: "Tournament Trophy",
    description: "Big 12 Tournament Championship Trophy",
    unit_cost: 152250, // $1522.50 in cents
    tax_cost: 7613,    // $76.13 in cents (5%)
    total_cost: 159863, // $1598.63 in cents
    quantity: 1,
    status: 'planned'
  },
  {
    name: "Champion Trophy", 
    description: "Big 12 Regular Season Champion Trophy",
    unit_cost: 262875, // $2628.75 in cents
    tax_cost: 13144,   // $131.44 in cents (5%)
    total_cost: 276019, // $2760.19 in cents
    quantity: 1,
    status: 'planned'
  },
  {
    name: "OTY-A Award",
    description: "Official of the Year - Category A Award",
    unit_cost: 23400,  // $234.00 in cents
    tax_cost: 1170,    // $11.70 in cents (5%)
    total_cost: 24570, // $245.70 in cents
    quantity: 1,
    status: 'planned'
  },
  {
    name: "OTY-B Award",
    description: "Official of the Year - Category B Award", 
    unit_cost: 22025,  // $220.25 in cents
    tax_cost: 1101,    // $11.01 in cents (5%)
    total_cost: 23126, // $231.26 in cents
    quantity: 1,
    status: 'planned'
  },
  {
    name: "All-Big 12-A Award",
    description: "All-Big 12 First Team Award - Category A",
    unit_cost: 3806,   // $38.06 in cents
    tax_cost: 190,     // $1.90 in cents (5%)
    total_cost: 3996,  // $39.96 in cents
    quantity: 50,      // Estimated quantity for All-Big 12 awards
    status: 'planned'
  },
  {
    name: "All-Big 12-B Award", 
    description: "All-Big 12 Second Team Award - Category B",
    unit_cost: 3137,   // $31.37 in cents
    tax_cost: 157,     // $1.57 in cents (5%)
    total_cost: 3294,  // $32.94 in cents
    quantity: 50,      // Estimated quantity for All-Big 12 awards
    status: 'planned'
  },
  {
    name: "MOP Award",
    description: "Most Outstanding Player Award",
    unit_cost: 9450,   // $94.50 in cents
    tax_cost: 473,     // $4.73 in cents (5%)
    total_cost: 9923,  // $99.23 in cents
    quantity: 10,      // Estimated quantity for MOP awards
    status: 'planned'
  },
  {
    name: "Medallion",
    description: "Championship/Achievement Medallion",
    unit_cost: 1549,   // $15.49 in cents
    tax_cost: 77,      // $0.77 in cents (5%)
    total_cost: 1626,  // $16.26 in cents
    quantity: 100,     // Estimated quantity for medallions
    status: 'planned'
  }
];

async function addAwardsCosts() {
  console.log('Adding awards cost data to database...');
  
  try {
    // First, let's add the awards to the awards table
    for (const award of awardsCostData) {
      console.log(`Adding award: ${award.name}`);
      
      const { data: awardData, error: awardError } = await supabase
        .from('awards')
        .insert({
          name: award.name,
          description: award.description,
          status: award.status,
          quantity: award.quantity
        })
        .select()
        .single();
        
      if (awardError) {
        console.error(`Error adding award ${award.name}:`, awardError);
        continue;
      }
      
      console.log(`✓ Added award: ${award.name} (ID: ${awardData.id})`);
      
      // Create an invoice record for the cost tracking
      const invoiceNumber = `AWD-2526-${String(awardData.id).padStart(3, '0')}`;
      
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          vendor_name: 'TBD - Awards Vendor',
          amount: award.total_cost * award.quantity, // Total cost for all quantities
          status: 'planned',
          date: new Date().toISOString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          award_id: awardData.id,
          notes: `Unit cost: $${(award.unit_cost / 100).toFixed(2)}, Tax: $${(award.tax_cost / 100).toFixed(2)}, Quantity: ${award.quantity}`
        })
        .select()
        .single();
        
      if (invoiceError) {
        console.error(`Error adding invoice for ${award.name}:`, invoiceError);
      } else {
        console.log(`✓ Added invoice: ${invoiceNumber} for $${(invoiceData.amount / 100).toFixed(2)}`);
      }
    }
    
    // Calculate and display total costs
    const totalCost = awardsCostData.reduce((sum, award) => 
      sum + (award.total_cost * award.quantity), 0
    );
    
    console.log('\n=== AWARDS COST SUMMARY ===');
    console.log(`Total Awards Budget: $${(totalCost / 100).toFixed(2)}`);
    console.log(`Number of Award Types: ${awardsCostData.length}`);
    
    // Display breakdown by award type
    console.log('\n=== COST BREAKDOWN ===');
    awardsCostData.forEach(award => {
      const totalAwardCost = award.total_cost * award.quantity;
      console.log(`${award.name}: ${award.quantity}x $${(award.unit_cost / 100).toFixed(2)} = $${(totalAwardCost / 100).toFixed(2)}`);
    });
    
    console.log('\n✅ Awards cost data successfully added to database!');
    
  } catch (error) {
    console.error('Error adding awards costs:', error);
  }
}

addAwardsCosts();