const fs = require('fs');
const csv = require('csv-parser');

// Function to format award names properly
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
    .replace(/BASEBALL/g, 'Baseball')
    .replace(/Men's Cross Country/g, "Men's Cross Country")
    .replace(/Women's Cross Country/g, "Women's Cross Country");

  return `${formattedHonor} - ${formattedSport}`;
}

async function formatAwardsData() {
  console.log('=== FORMATTING 2024-25 AWARDS DATA ===\n');
  
  const results = [];
  const summary = {
    totalAwards: 0,
    totalQuantity: 0,
    regularSeason: 0,
    championship: 0,
    sports: new Set(),
    awardTypes: new Set()
  };
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('/Users/nickw/Downloads/2024-25 XII Awards Chart.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Processing ${results.length} award entries...\n`);
        
        const formattedAwards = results.map(row => {
          const sport = row.Sport?.trim();
          const honor = row.Honor?.trim();
          const designation = row['Award Designation']?.trim();
          const criteria = row['Award Criteria']?.trim();
          const selectionProcess = row['Selection Process']?.trim();
          const awardType = row['Award Type']?.trim();
          const quantity = parseInt(row.Quantity) || 1;
          const classCode = row['Class Code']?.trim();
          
          if (!sport || !honor || !classCode) {
            return null;
          }
          
          const formattedName = formatAwardName(honor, sport);
          const isChampionship = designation === 'CC';
          
          // Clean up criteria and selection process
          let cleanCriteria = criteria || '';
          let cleanSelection = (selectionProcess || '')
            .replace(/Coaches'vote\^/g, "Coaches' Vote")
            .replace(/Coaches'Vote \^/g, "Coaches' Vote")
            .replace(/Media & Coaches'Vote \^/g, "Media & Coaches' Vote");
          
          // Update summary
          summary.totalAwards++;
          summary.totalQuantity += quantity;
          summary.sports.add(sport);
          summary.awardTypes.add(awardType);
          
          if (isChampionship) {
            summary.championship++;
          } else {
            summary.regularSeason++;
          }
          
          return {
            formattedName,
            originalHonor: honor,
            sport,
            designation,
            criteria: cleanCriteria,
            selectionProcess: cleanSelection,
            awardType,
            quantity,
            classCode,
            isChampionship,
            category: isChampionship ? 'Championship' : 'Regular Season'
          };
        }).filter(item => item !== null);
        
        // Display formatted results
        console.log('=== FORMATTED AWARDS LIST ===\n');
        
        // Group by sport
        const sportGroups = {};
        formattedAwards.forEach(award => {
          if (!sportGroups[award.sport]) {
            sportGroups[award.sport] = [];
          }
          sportGroups[award.sport].push(award);
        });
        
        Object.keys(sportGroups).sort().forEach(sport => {
          console.log(`🏆 ${sport.toUpperCase()}`);
          console.log(''.padEnd(50, '='));
          
          // Regular Season first
          const regularSeason = sportGroups[sport].filter(a => !a.isChampionship);
          if (regularSeason.length > 0) {
            console.log('\n📊 Regular Season (S-050):');
            regularSeason.forEach(award => {
              console.log(`  • ${award.formattedName}`);
              console.log(`    Class Code: ${award.classCode}`);
              console.log(`    Quantity: ${award.quantity}`);
              if (award.selectionProcess) {
                console.log(`    Selection: ${award.selectionProcess}`);
              }
              console.log('');
            });
          }
          
          // Championship next
          const championship = sportGroups[sport].filter(a => a.isChampionship);
          if (championship.length > 0) {
            console.log('🏅 Championship (S-060):');
            championship.forEach(award => {
              console.log(`  • ${award.formattedName}`);
              console.log(`    Class Code: ${award.classCode}`);
              console.log(`    Quantity: ${award.quantity}`);
              if (award.selectionProcess) {
                console.log(`    Selection: ${award.selectionProcess}`);
              }
              console.log('');
            });
          }
          
          console.log('\n');
        });
        
        // Summary statistics
        console.log('=== SUMMARY STATISTICS ===');
        console.log(`Total Award Types: ${summary.totalAwards}`);
        console.log(`Total Quantity: ${summary.totalQuantity} awards`);
        console.log(`Regular Season Awards: ${summary.regularSeason}`);
        console.log(`Championship Awards: ${summary.championship}`);
        console.log(`Sports Covered: ${summary.sports.size}`);
        
        console.log('\n=== SPORTS BREAKDOWN ===');
        Array.from(summary.sports).sort().forEach(sport => {
          const sportAwards = formattedAwards.filter(a => a.sport === sport);
          const sportQuantity = sportAwards.reduce((sum, a) => sum + a.quantity, 0);
          console.log(`${sport}: ${sportAwards.length} types, ${sportQuantity} total awards`);
        });
        
        console.log('\n=== AWARD TYPES BREAKDOWN ===');
        Array.from(summary.awardTypes).sort().forEach(type => {
          const typeAwards = formattedAwards.filter(a => a.awardType === type);
          const typeQuantity = typeAwards.reduce((sum, a) => sum + a.quantity, 0);
          console.log(`${type}: ${typeQuantity} awards`);
        });
        
        console.log('\n=== CLASS CODE ANALYSIS ===');
        const classCodes = {};
        formattedAwards.forEach(award => {
          if (!classCodes[award.classCode]) {
            classCodes[award.classCode] = { count: 0, quantity: 0 };
          }
          classCodes[award.classCode].count++;
          classCodes[award.classCode].quantity += award.quantity;
        });
        
        Object.keys(classCodes).sort().forEach(code => {
          const data = classCodes[code];
          console.log(`${code}: ${data.count} types, ${data.quantity} total`);
        });
        
        console.log('\n✅ Data formatting complete!');
        console.log('📋 This formatted data is ready for import into the Awards Program system.');
        
        resolve(formattedAwards);
      })
      .on('error', reject);
  });
}

formatAwardsData().catch(console.error);