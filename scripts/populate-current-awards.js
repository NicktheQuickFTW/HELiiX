const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Format award names properly
function formatAwardName(honor, sport) {
  let formattedHonor = honor
    .replace(/OTY/g, 'of the Year')
    .replace(/MOP/g, 'Most Outstanding Player')
    .replace(/oTY/g, 'of the Year')
    .replace(/oty/g, 'of the Year')
    .replace(/MOST Outstanding/g, 'Most Outstanding')
    .replace(/All-BIG 12/g, 'All-Big 12')
    .replace(/All-big 12/g, 'All-Big 12')
    .replace(/SwimMING/g, 'Swimming')
    .replace(/Chuck Neinas Coach oty/g, 'Chuck Neinas Coach of the Year')
    .replace(/Special Teams Player oty/g, 'Special Teams Player of the Year')
    .replace(/Off\/Def/g, 'Offensive/Defensive')
    .replace(/MATCH PLAY CHAMPION/g, 'Match Play Champion')
    .replace(/most Outstanding Player/g, 'Most Outstanding Player')
    .replace(/forward OTY/g, 'Forward of the Year')
    .replace(/midfielder OTY/g, 'Midfielder of the Year')
    .replace(/Diver oTY/g, 'Diver of the Year')
    .replace(/Swim Coach oTY/g, 'Swimming Coach of the Year');

  let formattedSport = sport
    .replace(/WRESTLING/g, 'Wrestling')
    .replace(/GYMNASTICS/g, 'Gymnastics')
    .replace(/EQUESTRIAN/g, 'Equestrian')
    .replace(/ROWING/g, 'Rowing')
    .replace(/SOFTBALL/g, 'Softball')
    .replace(/BASEBALL/g, 'Baseball');

  return `${formattedHonor} - ${formattedSport}`;
}

// Award type mapping
function getAwardType(honor, awardPhysicalType) {
  if (honor.toLowerCase().includes('champion')) return 'championship';
  if (honor.toLowerCase().includes('tournament')) return 'tournament_champion';
  if (honor.toLowerCase().includes('player of the year') || honor.toLowerCase().includes('player oty')) return 'player_of_year';
  if (honor.toLowerCase().includes('coach')) return 'coach_of_year';
  if (honor.toLowerCase().includes('freshman')) return 'freshman_of_year';
  if (honor.toLowerCase().includes('newcomer')) return 'newcomer_of_year';
  if (honor.toLowerCase().includes('scholar')) return 'academic_honor';
  if (honor.toLowerCase().includes('all-big 12')) return 'all_conference';
  if (honor.toLowerCase().includes('outstanding') || honor.toLowerCase().includes('mop')) return 'individual_award';
  if (awardPhysicalType === 'Medallion') return 'individual_award';
  return 'other';
}

// Cost mapping (corrected terminology)
const costMapping = {
  'Champion Bowl': { unit: 276019, description: 'Champion Trophy' }, // Corrected terminology
  'Tournament Trophy': { unit: 159863, description: 'Tournament Trophy' },
  'OTY-A': { unit: 24570, description: 'OTY Award (Level A)' }, // Corrected terminology
  'OTY-B': { unit: 23126, description: 'OTY Award (Level B)' }, // Corrected terminology
  'All-Big 12-A': { unit: 3996, description: 'All-Big 12 Trophy (1st Team)' }, // Corrected terminology
  'All-Big 12-B': { unit: 3294, description: 'All-Big 12 Trophy (2nd Team)' }, // Corrected terminology
  'All-Big 12': { unit: 3294, description: 'All-Big 12 Trophy' }, // Corrected terminology
  'Mop': { unit: 9923, description: 'MOP Award' },
  'Medallion': { unit: 1626, description: 'Medallion' }
};

async function populateCurrentAwards() {
  console.log('=== POPULATING CURRENT AWARDS TABLE WITH 2024-25 DATA ===\n');
  
  try {
    const results = [];
    
    // Read the CSV file
    fs.createReadStream('/Users/nickw/Downloads/2024-25 XII Awards Chart.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Processing ${results.length} award entries...\n`);
        
        let successCount = 0;
        let errorCount = 0;
        const summary = {
          sports: new Set(),
          totalQuantity: 0,
          totalEstimatedCost: 0,
          regularSeason: 0,
          championship: 0,
          awardTypes: new Set()
        };
        
        for (const row of results) {
          try {
            const sport = row.Sport?.trim();
            const honor = row.Honor?.trim();
            const designation = row['Award Designation']?.trim();
            const criteria = row['Award Criteria']?.trim();
            const selectionProcess = row['Selection Process']?.trim();
            const awardType = row['Award Type']?.trim();
            const quantity = parseInt(row.Quantity) || 1;
            const classCode = row['Class Code']?.trim();
            
            if (!sport || !honor || !classCode) {
              console.log(`Skipping incomplete row: ${sport} - ${honor}`);
              continue;
            }
            
            // Format data properly
            const formattedName = formatAwardName(honor, sport);
            const description = `${honor} award for ${sport}. ${criteria || ''} ${selectionProcess || ''}`.trim();
            const awardCategory = getAwardType(honor, awardType);
            const costs = costMapping[awardType] || { unit: 5000, description: 'Standard Award' };
            const isChampionship = designation === 'CC';
            const status = 'planned';
            
            // Create award entry for current table structure
            const awardData = {
              name: formattedName,
              description: description,
              status: status,
              quantity: quantity,
              season_year: 2025,
              award_type: awardCategory,
              recipient_details: {
                class_code: classCode,
                sport: sport,
                sport_code: classCode.split('-')[3] || 'XX',
                sport_gender: classCode.split('-')[4] || 'X',
                competition_level: isChampionship ? 'Championship' : 'Regular Season',
                academic_year: '2024-25',
                physical_type: costs.description,
                selection_process: selectionProcess || '',
                criteria: criteria || '',
                estimated_cost: costs.unit
              }
            };
            
            const { data, error } = await supabase
              .from('awards')
              .insert(awardData)
              .select()
              .single();
              
            if (error) {
              console.error(`❌ Error inserting ${formattedName}:`, error.message);
              errorCount++;
            } else {
              console.log(`✅ Added: ${formattedName} (${quantity}x) - ${classCode}`);
              successCount++;
              
              // Update summary
              summary.sports.add(sport);
              summary.totalQuantity += quantity;
              summary.totalEstimatedCost += costs.unit * quantity;
              summary.awardTypes.add(awardCategory);
              
              if (isChampionship) {
                summary.championship++;
              } else {
                summary.regularSeason++;
              }
              
              // Create invoice record
              const invoiceData = {
                invoice_number: `AWD-2425-${String(data.id).padStart(3, '0')}`,
                vendor_name: 'TBD - Awards Vendor',
                amount: costs.unit * quantity,
                status: 'planned',
                date: new Date().toISOString(),
                award_id: data.id,
                notes: `${costs.description} - Class Code: ${classCode} - Quantity: ${quantity}`
              };
              
              const { error: invoiceError } = await supabase
                .from('invoices')
                .insert(invoiceData);
                
              if (invoiceError) {
                console.log(`   ⚠️  Could not create invoice: ${invoiceError.message}`);
              }
            }
            
          } catch (error) {
            console.error(`❌ Error processing row:`, error);
            errorCount++;
          }
        }
        
        // Generate summary report
        console.log('\n=== POPULATION COMPLETE ===');
        console.log(`✅ Successfully added: ${successCount} awards`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Total quantity: ${summary.totalQuantity} awards`);
        console.log(`💰 Estimated total cost: $${(summary.totalEstimatedCost / 100).toFixed(2)}`);
        console.log(`🏆 Regular Season awards: ${summary.regularSeason}`);
        console.log(`🥇 Championship awards: ${summary.championship}`);
        console.log(`🏅 Sports covered: ${summary.sports.size}`);
        console.log(`🎯 Award types: ${summary.awardTypes.size}`);
        
        console.log('\n=== CORRECTED TERMINOLOGY APPLIED ===');
        console.log('• Champion Bowl → Champion Trophy');
        console.log('• Crystal Awards → OTY Awards');
        console.log('• All-Big 12 Plaques → All-Big 12 Trophies');
        
        console.log('\n=== NEXT STEPS ===');
        console.log('1. Execute the Awards Program migration in Supabase');
        console.log('2. Transfer this data to the new awards_program table');
        console.log('3. Add recipient details from order files');
        console.log('4. Generate financial reports with class codes');
        
        console.log('\n🎉 Awards data successfully loaded with corrected terminology!');
      });
      
  } catch (error) {
    console.error('Error populating awards:', error);
  }
}

populateCurrentAwards();