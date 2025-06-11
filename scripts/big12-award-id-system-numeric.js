#!/usr/bin/env node

/**
 * Big 12 Conference Award ID System (Numeric)
 * Format: [SPORT_ID]-[AWARD_TYPE]-[AWARD_SPECIFIC]-[SEASON_YEAR]
 * Example: 01-01-01-2025 (Baseball Championship Trophy), 02-04-01-2025 (MBB OTY-A)
 */

// Big 12 Sport ID Mappings (from Supabase sports table)
const BIG12_SPORTS_NUMERIC = {
  '01': { name: 'Baseball', code: 'BSB', gender: 'M', season: 'spring' },
  '02': { name: 'Men\'s Basketball', code: 'MBB', gender: 'M', season: 'winter' },
  '03': { name: 'Women\'s Basketball', code: 'WBB', gender: 'W', season: 'winter' },
  '04': { name: 'Beach Volleyball', code: 'BVB', gender: 'W', season: 'spring' },
  '05': { name: 'Men\'s Cross Country', code: 'MXC', gender: 'M', season: 'fall' },
  '06': { name: 'Women\'s Cross Country', code: 'WXC', gender: 'W', season: 'fall' },
  '07': { name: 'Equestrian', code: 'EQ', gender: 'W', season: 'winter' },
  '08': { name: 'Football', code: 'FB', gender: 'M', season: 'fall' },
  '09': { name: 'Men\'s Golf', code: 'MGO', gender: 'M', season: 'spring' },
  '10': { name: 'Women\'s Golf', code: 'WGO', gender: 'W', season: 'spring' },
  '11': { name: 'Gymnastics', code: 'GYM', gender: 'W', season: 'winter' },
  '12': { name: 'Lacrosse', code: 'LAX', gender: 'W', season: 'spring' },
  '13': { name: 'Rowing', code: 'ROW', gender: 'W', season: 'spring' },
  '14': { name: 'Soccer', code: 'SOC', gender: 'W', season: 'fall' },
  '15': { name: 'Softball', code: 'SB', gender: 'W', season: 'spring' },
  '16': { name: 'Men\'s Swimming & Diving', code: 'MSD', gender: 'M', season: 'winter' },
  '17': { name: 'Women\'s Swimming & Diving', code: 'WSD', gender: 'W', season: 'winter' },
  '18': { name: 'Men\'s Tennis', code: 'MTN', gender: 'M', season: 'spring' },
  '19': { name: 'Women\'s Tennis', code: 'WTN', gender: 'W', season: 'spring' },
  '20': { name: 'Men\'s Indoor Track & Field', code: 'MITF', gender: 'M', season: 'winter' },
  '21': { name: 'Women\'s Indoor Track & Field', code: 'WITF', gender: 'W', season: 'winter' },
  '22': { name: 'Men\'s Outdoor Track & Field', code: 'MOTF', gender: 'M', season: 'spring' },
  '23': { name: 'Women\'s Outdoor Track & Field', code: 'WOTF', gender: 'W', season: 'spring' },
  '24': { name: 'Volleyball', code: 'VB', gender: 'W', season: 'fall' },
  '25': { name: 'Wrestling', code: 'WRE', gender: 'M', season: 'winter' }
};

// Award Type Categories (2-digit numeric)
const AWARD_TYPES_NUMERIC = {
  '01': { name: 'Championship Trophy', category: 'championship', description: 'Main championship trophy' },
  '02': { name: 'Tournament Trophy', category: 'championship', description: 'Tournament championship trophy' },
  '03': { name: 'Regular Season Trophy', category: 'regular_season', description: 'Regular season championship trophy' },
  '04': { name: 'Of The Year - A', category: 'individual', description: 'Primary Of The Year award' },
  '05': { name: 'Of The Year - B', category: 'individual', description: 'Secondary Of The Year award' },
  '06': { name: 'Player of the Year', category: 'individual', description: 'Player of the Year' },
  '07': { name: 'Coach of the Year', category: 'individual', description: 'Coach of the Year' },
  '08': { name: 'Most Outstanding Player', category: 'individual', description: 'Most Outstanding Player/Performer' },
  '09': { name: 'Freshman of the Year', category: 'individual', description: 'Freshman of the Year' },
  '10': { name: 'Newcomer of the Year', category: 'individual', description: 'Newcomer of the Year' },
  '11': { name: 'Defensive Player of the Year', category: 'individual', description: 'Defensive Player of the Year' },
  '12': { name: 'Offensive Player of the Year', category: 'individual', description: 'Offensive Player of the Year' },
  '13': { name: 'First Team All-Conference', category: 'team', description: 'Big 12 First Team All-Conference' },
  '14': { name: 'Second Team All-Conference', category: 'team', description: 'Big 12 Second Team All-Conference' },
  '15': { name: 'Third Team All-Conference', category: 'team', description: 'Big 12 Third Team All-Conference' },
  '16': { name: 'Honorable Mention', category: 'team', description: 'Big 12 Honorable Mention' },
  '17': { name: 'All-Freshman Team', category: 'team', description: 'Big 12 All-Freshman Team' },
  '18': { name: 'All-Newcomer Team', category: 'team', description: 'Big 12 All-Newcomer Team' },
  '19': { name: 'Scholar Athlete', category: 'academic', description: 'Scholar Athlete Award' },
  '20': { name: 'Academic All-Big 12', category: 'academic', description: 'Academic All-Big 12' },
  '21': { name: 'Academic Player of the Year', category: 'academic', description: 'Academic Player of the Year' },
  '22': { name: 'Sportsmanship Award', category: 'special', description: 'Sportsmanship Award' },
  '23': { name: 'Leadership Award', category: 'special', description: 'Leadership Award' },
  '24': { name: 'Community Service Award', category: 'special', description: 'Community Service Award' },
  '25': { name: 'Special Recognition', category: 'special', description: 'Special Recognition Award' }
};

// Award Specific Sub-categories (2-digit numeric)
const AWARD_SPECIFICS_NUMERIC = {
  '01': { name: 'Primary Award', description: 'Main/Primary award in category' },
  '02': { name: 'Secondary Award', description: 'Secondary award in category' },
  '03': { name: 'Plate/Plaque', description: 'Award plate or plaque version' },
  '04': { name: 'Medal', description: 'Medal version of award' },
  '05': { name: 'Certificate', description: 'Certificate version of award' },
  '06': { name: 'Individual Trophy', description: 'Individual trophy version' },
  '07': { name: 'Team Trophy', description: 'Team trophy version' },
  '08': { name: 'Large Format', description: 'Large format award' },
  '09': { name: 'Standard Format', description: 'Standard format award' },
  '10': { name: 'Small Format', description: 'Small format award' }
};

/**
 * Get season-specific year code
 * @param {string} season - Sport season (fall, winter, spring)
 * @param {number} academicYear - Academic year (2025 for 2024-25 season)
 * @returns {string} Season year code
 */
function getSeasonYear(season, academicYear = 2025) {
  switch (season) {
    case 'fall':
      return academicYear.toString(); // 2025 for fall 2024
    case 'winter':
      return `${(academicYear - 1).toString().slice(-2)}${academicYear.toString().slice(-2)}`; // 2425 for winter 2024-25
    case 'spring':
      return (academicYear + 1).toString(); // 2026 for spring 2025
    default:
      return academicYear.toString();
  }
}

/**
 * Generate Numeric Award ID
 * @param {string} sportId - 2-digit sport ID (01-25)
 * @param {string} awardType - 2-digit award type (01-25)
 * @param {string} awardSpecific - 2-digit award specific (01-10)
 * @param {number} academicYear - Academic year (2025 for 2024-25 season)
 * @returns {string} Generated award ID
 */
function generateNumericAwardId(sportId, awardType, awardSpecific, academicYear = 2025) {
  // Validate inputs
  if (!BIG12_SPORTS_NUMERIC[sportId]) {
    throw new Error(`Invalid sport ID: ${sportId}`);
  }
  if (!AWARD_TYPES_NUMERIC[awardType]) {
    throw new Error(`Invalid award type: ${awardType}`);
  }
  if (!AWARD_SPECIFICS_NUMERIC[awardSpecific]) {
    throw new Error(`Invalid award specific: ${awardSpecific}`);
  }
  
  // Get sport season and calculate proper year
  const sport = BIG12_SPORTS_NUMERIC[sportId];
  const seasonYear = getSeasonYear(sport.season, academicYear);
  
  return `${sportId}-${awardType}-${awardSpecific}-${seasonYear}`;
}

/**
 * Parse Numeric Award ID back to components
 * @param {string} awardId - Award ID to parse
 * @returns {object} Parsed components
 */
function parseNumericAwardId(awardId) {
  const parts = awardId.split('-');
  if (parts.length !== 4) {
    throw new Error(`Invalid award ID format: ${awardId}`);
  }
  
  const [sportId, awardType, awardSpecific, seasonYear] = parts;
  
  return {
    sportId,
    sportName: BIG12_SPORTS_NUMERIC[sportId]?.name,
    sportCode: BIG12_SPORTS_NUMERIC[sportId]?.code,
    awardType,
    awardTypeName: AWARD_TYPES_NUMERIC[awardType]?.name,
    awardSpecific,
    awardSpecificName: AWARD_SPECIFICS_NUMERIC[awardSpecific]?.name,
    seasonYear: parseInt(seasonYear),
    fullDescription: `${BIG12_SPORTS_NUMERIC[sportId]?.name} ${AWARD_TYPES_NUMERIC[awardType]?.name} ${AWARD_SPECIFICS_NUMERIC[awardSpecific]?.name} (${seasonYear})`
  };
}

/**
 * Generate Numeric Award IDs for Jostens Invoice Data
 */
function generateJostensNumericAwardIds() {
  const jostensAwards = [
    // Baseball Championship (Invoice 791346)
    {
      invoice: '791346',
      sport: 'Baseball',
      awards: [
        {
          awardId: generateNumericAwardId('01', '01', '01'), // Baseball Championship Trophy
          description: 'Championship Trophy',
          quantity: 1
        },
        {
          awardId: generateNumericAwardId('01', '08', '01'), // Baseball MOP
          description: 'Most Outstanding Player',
          quantity: 1
        }
      ]
    },
    
    // Beach Volleyball Regular Season (Invoice 790904)
    {
      invoice: '790904',
      sport: 'Beach Volleyball',
      awards: [
        {
          awardId: generateNumericAwardId('04', '08', '01'), // Beach Volleyball MOP
          description: 'Most Outstanding Pair',
          quantity: 2
        }
      ]
    },
    
    // Beach Volleyball Championship (Invoice 789041)
    {
      invoice: '789041',
      sport: 'Beach Volleyball',
      awards: [
        {
          awardId: generateNumericAwardId('04', '01', '01'), // Beach Volleyball Championship Trophy
          description: 'Championship Trophy',
          quantity: 1
        }
      ]
    },
    
    // Equestrian Championship (Invoice 788239)
    {
      invoice: '788239',
      sport: 'Equestrian',
      awards: [
        {
          awardId: generateNumericAwardId('07', '01', '01'), // Equestrian Championship Trophy
          description: 'Championship Trophy',
          quantity: 1
        },
        {
          awardId: generateNumericAwardId('07', '08', '01'), // Equestrian MOP
          description: 'Most Outstanding Performer',
          quantity: 4
        },
        {
          awardId: generateNumericAwardId('07', '04', '08'), // Equestrian OTY Large
          description: 'Of The Year Large',
          quantity: 5
        },
        {
          awardId: generateNumericAwardId('07', '13', '01'), // Equestrian 1st Team
          description: '1st Team All-Conference',
          quantity: 20
        }
      ]
    },
    
    // Equestrian Regular Season Plates (Invoice 788788)
    {
      invoice: '788788',
      sport: 'Equestrian',
      awards: [
        {
          awardId: generateNumericAwardId('07', '04', '03'), // Equestrian OTY Plates
          description: 'Of The Year Plates',
          quantity: 6
        },
        {
          awardId: generateNumericAwardId('07', '13', '03'), // Equestrian All Conf Plates
          description: 'All Conference Plates',
          quantity: 20
        }
      ]
    },
    
    // Equestrian Scholar Athlete (Invoice 791347)
    {
      invoice: '791347',
      sport: 'Equestrian',
      awards: [
        {
          awardId: generateNumericAwardId('07', '19', '01'), // Equestrian Scholar Athlete
          description: 'Scholar Athlete',
          quantity: 1
        }
      ]
    }
  ];
  
  return jostensAwards;
}

// Export functions and data
module.exports = {
  BIG12_SPORTS_NUMERIC,
  AWARD_TYPES_NUMERIC,
  AWARD_SPECIFICS_NUMERIC,
  generateNumericAwardId,
  parseNumericAwardId,
  generateJostensNumericAwardIds
};

// Run examples if script is executed directly
if (require.main === module) {
  console.log('🏆 Big 12 Conference Numeric Award ID System\n');
  
  // Show Jostens invoice award IDs
  console.log('📋 Jostens Invoice Award IDs (Numeric):');
  const jostensAwards = generateJostensNumericAwardIds();
  jostensAwards.forEach(invoice => {
    console.log(`\nInvoice ${invoice.invoice} - ${invoice.sport}:`);
    invoice.awards.forEach(award => {
      const parsed = parseNumericAwardId(award.awardId);
      console.log(`  ${award.awardId} - ${award.description} (Qty: ${award.quantity})`);
      console.log(`    ${parsed.fullDescription}`);
    });
  });
  
  // Show mapping examples
  console.log('\n🎯 Award ID Component Examples:');
  console.log('Sport IDs:');
  console.log('  01 = Baseball, 02 = Men\'s Basketball, 04 = Beach Volleyball, 07 = Equestrian, 08 = Football');
  console.log('\nAward Types:');
  console.log('  01 = Championship Trophy, 04 = Of The Year-A, 08 = Most Outstanding Player, 13 = First Team All-Conference, 19 = Scholar Athlete');
  console.log('\nAward Specifics:');
  console.log('  01 = Primary Award, 03 = Plate/Plaque, 08 = Large Format');
  
  // Show season year examples
  console.log('\n📅 Season Year Examples:');
  console.log('Fall Sports (2025): Football, Soccer, Volleyball, Cross Country');
  console.log('Winter Sports (2425): Basketball, Wrestling, Swimming, Gymnastics, Equestrian');
  console.log('Spring Sports (2026): Baseball, Softball, Tennis, Golf, Track');
  
  // Show parsing example
  console.log('\n🔍 Parsing Example:');
  const exampleId = '08-01-01-2025';
  const parsed = parseNumericAwardId(exampleId);
  console.log(`Award ID: ${exampleId}`);
  console.log(`Parsed: ${parsed.fullDescription}`);
}