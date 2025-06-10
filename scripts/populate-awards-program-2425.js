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

// Award type mapping for proper formatting
const awardTypeMapping = {
  'Conference Champion': 'championship_trophy',
  'Regular Season Champion': 'championship_trophy', 
  'Tournament Champion': 'tournament_trophy',
  'Championship Medallions': 'medallion',
  'Top Finishers': 'medallion',
  'All-Big 12 1st Team': 'all_conference_first',
  'All-Big 12 2nd Team': 'all_conference_second',
  'All-Big 12 3rd Team': 'all_conference_second',
  'All-Big 12 Team': 'all_conference_first',
  'All-BIG 12 Team': 'all_conference_first',
  'All-BIG 12 TEAM': 'all_conference_first',
  'All-big 12 Team rs': 'all_conference_first',
  'Player OTY': 'player_of_year',
  'Coach OTY': 'coach_of_year',
  'Scholar-Athlete OTY': 'scholar_athlete',
  'Freshman OTY': 'freshman_of_year',
  'Newcomer OTY': 'newcomer_of_year',
  'Defensive Player OTY': 'defensive_player',
  'Offensive Player OTY': 'offensive_player',
  'Tournament MOP': 'most_outstanding_player',
  'Tournament Offensive MOP': 'most_outstanding_player',
  'Tournament Defensive MOP': 'most_outstanding_player',
  'MOST Outstanding Wrestler': 'most_outstanding_player',
  'Most Outstanding Performer': 'most_outstanding_player',
  'Sixth Man/Player OTY': 'sixth_man',
  'Most Improved Player OTY': 'most_improved'
};

// Award physical type mapping
const awardPhysicalMapping = {
  'Champion Bowl': { material: 'Crystal', dimensions: '12" x 8"', type: 'Bowl Trophy' },
  'Tournament Trophy': { material: 'Metal & Crystal', dimensions: '18" x 6"', type: 'Standing Trophy' },
  'OTY-A': { material: 'Crystal', dimensions: '8" x 6"', type: 'Crystal Award' },
  'OTY-B': { material: 'Crystal', dimensions: '6" x 4"', type: 'Crystal Award' },
  'All-Big 12-A': { material: 'Crystal', dimensions: '6" x 4"', type: 'Crystal Plaque' },
  'All-Big 12-B': { material: 'Crystal', dimensions: '5" x 3"', type: 'Crystal Plaque' },
  'All-Big 12': { material: 'Crystal', dimensions: '5" x 3"', type: 'Crystal Plaque' },
  'Mop': { material: 'Crystal', dimensions: '10" x 8"', type: 'Crystal Trophy' },
  'Medallion': { material: 'Metal', dimensions: '3" diameter', type: 'Medal' }
};

// Cost mapping based on previous data
const costMapping = {
  'Champion Bowl': { unit: 262875, tax: 13144, total: 276019 },
  'Tournament Trophy': { unit: 152250, tax: 7613, total: 159863 },
  'OTY-A': { unit: 23400, tax: 1170, total: 24570 },
  'OTY-B': { unit: 22025, tax: 1101, total: 23126 },
  'All-Big 12-A': { unit: 3806, tax: 190, total: 3996 },
  'All-Big 12-B': { unit: 3137, tax: 157, total: 3294 },
  'All-Big 12': { unit: 3137, tax: 157, total: 3294 },
  'Mop': { unit: 9450, tax: 473, total: 9923 },
  'Medallion': { unit: 1549, tax: 77, total: 1626 }
};

function formatAwardName(honor, sport) {
  // Clean up and format award names properly
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
    .replace(/most Outstanding Player/g, 'Most Outstanding Player');

  // Format sport names
  let formattedSport = sport
    .replace(/WRESTLING/g, 'Wrestling')
    .replace(/GYMNASTICS/g, 'Gymnastics')
    .replace(/EQUESTRIAN/g, 'Equestrian')
    .replace(/ROWING/g, 'Rowing')
    .replace(/SOFTBALL/g, 'Softball')
    .replace(/BASEBALL/g, 'Baseball');

  return `${formattedHonor} - ${formattedSport}`;
}

function formatDescription(honor, criteria, selectionProcess, sport) {
  let description = '';
  
  if (criteria && criteria.trim() && criteria !== '') {
    description += `Criteria: ${criteria.trim()}. `;
  }
  
  if (selectionProcess && selectionProcess.trim() && selectionProcess !== '') {
    let process = selectionProcess
      .replace(/Coaches'vote\^/g, "Coaches' Vote")
      .replace(/Coaches'Vote \^/g, "Coaches' Vote")
      .replace(/Media & Coaches'Vote \^/g, "Media & Coaches' Vote")
      .replace(/Sport Administrators Vote/g, "Sport Administrators Vote")
      .replace(/Judge's vote/g, "Judges' Vote")
      .replace(/Games Committee/g, "Games Committee Selection");
    
    description += `Selection: ${process}. `;
  }
  
  if (!description.trim()) {
    description = `${honor} award for ${sport}. `;
  }
  
  return description.trim();
}

function getSportSeason(sport) {
  const seasonMapping = {
    'Cross Country': 'fall',
    'Soccer': 'fall',
    'Volleyball': 'fall',
    'Football': 'fall',
    'Men\'s Basketball': 'winter',
    'Women\'s Basketball': 'winter',
    'Wrestling': 'winter',
    'Gymnastics': 'winter',
    'Men\'s Indoor Track & Field': 'winter',
    'Women\'s Indoor Track & Field': 'winter',
    'Men\'s Swimming & Diving': 'winter',
    'Women\'s Swimming & Diving': 'winter',
    'Baseball': 'spring',
    'Softball': 'spring',
    'Men\'s Tennis': 'spring',
    'Women\'s Tennis': 'spring',
    'Men\'s Golf': 'spring',
    'Women\'s Golf': 'spring',
    'Men\'s Outdoor Track & Field': 'spring',
    'Women\'s Outdoor Track & Field': 'spring',
    'Rowing': 'spring',
    'Lacrosse': 'spring',
    'Equestrian': 'year_round'
  };
  
  return seasonMapping[sport] || 'year_round';
}

async function populateAwardsProgram() {
  console.log('=== POPULATING AWARDS PROGRAM WITH 2024-25 DATA ===\n');
  
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
            const description = formatDescription(honor, criteria, selectionProcess, sport);
            const awardTypeEnum = awardTypeMapping[honor] || 'individual_recognition';
            const physicalSpecs = awardPhysicalMapping[awardType] || { material: 'Crystal', dimensions: 'Standard', type: 'Award' };
            const costs = costMapping[awardType] || { unit: 5000, tax: 250, total: 5250 };
            const sportSeason = getSportSeason(sport);
            
            // Determine status based on designation
            const status = designation === 'CC' ? 'planned' : 'planned';
            const isChampionship = designation === 'CC';
            
            // Insert into awards_program table
            const awardData = {
              award_name: formattedName,
              award_description: description,
              award_type: awardTypeEnum,
              status: status,
              sport_name: sport,
              sport_code: classCode.split('-')[3] || 'XX',
              sport_gender: classCode.split('-')[4] || 'X',
              sport_season: sportSeason,
              competition_level: isChampionship ? 'Championship' : 'Regular Season',
              season_year: 2025,
              academic_year: '2024-25',
              class_code: classCode,
              account_code: '4105',
              unit_cost: costs.unit,
              total_cost: costs.total,
              quantity_ordered: quantity,
              award_material: physicalSpecs.material,
              award_dimensions: physicalSpecs.dimensions,
              recipient_count: quantity,
              recipient_type: honor.toLowerCase().includes('team') ? 'team' : 'individual',
              special_instructions: criteria || '',
              public_description: description,
              created_by: 'System Migration'
            };
            
            const { data, error } = await supabase
              .from('awards_program')
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
              summary.totalEstimatedCost += costs.total * quantity;
              summary.awardTypes.add(awardTypeEnum);
              
              if (isChampionship) {
                summary.championship++;
              } else {
                summary.regularSeason++;
              }
            }
            
          } catch (error) {
            console.error(`❌ Error processing row:`, error);
            errorCount++;
          }
        }
        
        // Generate summary report
        console.log('\n=== AWARDS PROGRAM POPULATION COMPLETE ===');
        console.log(`✅ Successfully added: ${successCount} awards`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Total quantity: ${summary.totalQuantity} awards`);
        console.log(`💰 Estimated total cost: $${(summary.totalEstimatedCost / 100).toFixed(2)}`);
        console.log(`🏆 Regular Season awards: ${summary.regularSeason}`);
        console.log(`🥇 Championship awards: ${summary.championship}`);
        console.log(`🏅 Sports covered: ${summary.sports.size}`);
        console.log(`🎯 Award types: ${summary.awardTypes.size}`);
        
        console.log('\n=== SPORTS BREAKDOWN ===');
        Array.from(summary.sports).sort().forEach(sport => {
          console.log(`  • ${sport}`);
        });
        
        console.log('\n=== CLASS CODE SUMMARY ===');
        console.log(`Regular Season (S-050): ${summary.regularSeason} award types`);
        console.log(`Championship (S-060): ${summary.championship} award types`);
        console.log(`Account: 4105 - Awards`);
        console.log(`Academic Year: 2024-25`);
        
        console.log('\n🎉 Awards Program successfully populated with official 2024-25 data!');
      });
      
  } catch (error) {
    console.error('Error populating awards program:', error);
  }
}

populateAwardsProgram();