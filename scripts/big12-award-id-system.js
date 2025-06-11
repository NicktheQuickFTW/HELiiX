#!/usr/bin/env node

/**
 * Big 12 Conference Award ID System
 * Format: [SPORT_ID]-[AWARD_TYPE]-[AWARD_SPECIFIC]-[SEASON_YEAR]
 * Example: FB-CHAMP-TROPHY-2025, BSB-REG-XII1ST-2025, EQ-REG-DPOTY-2025
 */

// Big 12 Sport ID Mappings (based on your CLAUDE.md data)
const BIG12_SPORTS = {
  // Major Sports
  'FB': { name: 'Football', gender: 'M', season: 'fall', teams: 16 },
  'MBB': { name: 'Men\'s Basketball', gender: 'M', season: 'winter', teams: 16 },
  'WBB': { name: 'Women\'s Basketball', gender: 'W', season: 'winter', teams: 16 },
  
  // Baseball & Softball
  'BSB': { name: 'Baseball', gender: 'M', season: 'spring', teams: 14 },
  'SB': { name: 'Softball', gender: 'W', season: 'spring', teams: 11 },
  
  // Olympic Sports - Fall
  'SOC': { name: 'Soccer', gender: 'W', season: 'fall', teams: 16 },
  'VB': { name: 'Volleyball', gender: 'W', season: 'fall', teams: 15 },
  'EQ': { name: 'Equestrian', gender: 'W', season: 'fall', teams: 4 },
  'WCC': { name: 'Women\'s Cross Country', gender: 'W', season: 'fall', teams: 16 },
  'MCC': { name: 'Men\'s Cross Country', gender: 'M', season: 'fall', teams: 13 },
  
  // Olympic Sports - Winter
  'GY': { name: 'Gymnastics', gender: 'W', season: 'winter', teams: 7 },
  'WR': { name: 'Wrestling', gender: 'M', season: 'winter', teams: 14 },
  'WSWIM': { name: 'Women\'s Swimming & Diving', gender: 'W', season: 'winter', teams: 10 },
  'MSWIM': { name: 'Men\'s Swimming & Diving', gender: 'M', season: 'winter', teams: 7 },
  'WIT': { name: 'Women\'s Indoor Track', gender: 'W', season: 'winter', teams: 16 },
  'MIT': { name: 'Men\'s Indoor Track', gender: 'M', season: 'winter', teams: 13 },
  
  // Olympic Sports - Spring
  'BVB': { name: 'Beach Volleyball', gender: 'W', season: 'spring', teams: 3 },
  'LAX': { name: 'Lacrosse', gender: 'W', season: 'spring', teams: 6 },
  'WTN': { name: 'Women\'s Tennis', gender: 'W', season: 'spring', teams: 16 },
  'MTN': { name: 'Men\'s Tennis', gender: 'M', season: 'spring', teams: 9 },
  'WOT': { name: 'Women\'s Outdoor Track', gender: 'W', season: 'spring', teams: 16 },
  'MOT': { name: 'Men\'s Outdoor Track', gender: 'M', season: 'spring', teams: 13 },
  'WGF': { name: 'Women\'s Golf', gender: 'W', season: 'spring', teams: 14 },
  'MGF': { name: 'Men\'s Golf', gender: 'M', season: 'spring', teams: 16 },
  'ROW': { name: 'Rowing', gender: 'W', season: 'spring', teams: 6 }
};

// Award Type Categories
const AWARD_TYPES = {
  'CHAMP': 'Championship',
  'REG': 'Regular Season',
  'TOURN': 'Tournament',
  'ACAD': 'Academic'
};

// Award Specific Abbreviations
const AWARD_ABBREVIATIONS = {
  // Trophies
  'TROPHY': 'Championship Trophy',
  'TOURNTROPHY': 'Tournament Trophy',
  'REGTROPHY': 'Regular Season Trophy',
  
  // Individual Awards
  'POY': 'Player of the Year',
  'COY': 'Coach of the Year',
  'FROY': 'Freshman of the Year',
  'NOTY': 'Newcomer of the Year',
  'MOP': 'Most Outstanding Player/Performer',
  'MVP': 'Most Valuable Player',
  'DPOTY': 'Defensive Player of the Year',
  'OPOTY': 'Offensive Player of the Year',
  'OTY': 'Of the Year (Generic)',
  
  // Team/Conference Awards
  'XII1ST': 'Big 12 First Team All-Conference',
  'XII2ND': 'Big 12 Second Team All-Conference',
  'XII3RD': 'Big 12 Third Team All-Conference',
  'XIIHM': 'Big 12 Honorable Mention',
  'XIIFRESH': 'Big 12 All-Freshman Team',
  'XIINEW': 'Big 12 All-Newcomer Team',
  
  // Academic Awards
  'SCHOLAR': 'Scholar Athlete',
  'ACADPOY': 'Academic Player of the Year',
  'ACADASG': 'Academic All-Big 12',
  
  // Specialty Awards
  'SPTS': 'Sportsmanship Award',
  'LEAD': 'Leadership Award',
  'COMM': 'Community Service Award',
  'SPIRIT': 'Team Spirit Award',
  
  // Plates/Plaques
  'PLATE': 'Award Plate',
  'PLAQUE': 'Award Plaque',
  'MEDAL': 'Medal',
  'CERT': 'Certificate'
};

/**
 * Generate Award ID
 * @param {string} sportCode - Sport abbreviation (FB, MBB, etc.)
 * @param {string} awardType - Award type (CHAMP, REG, TOURN, ACAD)
 * @param {string} awardSpecific - Specific award (TROPHY, POY, XII1ST, etc.)
 * @param {number} seasonYear - Season year (2025, 2026, etc.)
 * @returns {string} Generated award ID
 */
function generateAwardId(sportCode, awardType, awardSpecific, seasonYear) {
  // Validate inputs
  if (!BIG12_SPORTS[sportCode]) {
    throw new Error(`Invalid sport code: ${sportCode}`);
  }
  if (!AWARD_TYPES[awardType]) {
    throw new Error(`Invalid award type: ${awardType}`);
  }
  if (!AWARD_ABBREVIATIONS[awardSpecific]) {
    throw new Error(`Invalid award specific: ${awardSpecific}`);
  }
  
  return `${sportCode}-${awardType}-${awardSpecific}-${seasonYear}`;
}

/**
 * Parse Award ID back to components
 * @param {string} awardId - Award ID to parse
 * @returns {object} Parsed components
 */
function parseAwardId(awardId) {
  const parts = awardId.split('-');
  if (parts.length !== 4) {
    throw new Error(`Invalid award ID format: ${awardId}`);
  }
  
  const [sportCode, awardType, awardSpecific, seasonYear] = parts;
  
  return {
    sportCode,
    sportName: BIG12_SPORTS[sportCode]?.name,
    awardType,
    awardTypeName: AWARD_TYPES[awardType],
    awardSpecific,
    awardSpecificName: AWARD_ABBREVIATIONS[awardSpecific],
    seasonYear: parseInt(seasonYear),
    fullDescription: `${BIG12_SPORTS[sportCode]?.name} ${AWARD_TYPES[awardType]} ${AWARD_ABBREVIATIONS[awardSpecific]} (${seasonYear})`
  };
}

/**
 * Generate Award IDs for Jostens Invoice Data
 */
function generateJostensAwardIds() {
  const jostensAwards = [
    // Baseball Championship (Invoice 791346)
    {
      invoice: '791346',
      awards: [
        generateAwardId('BSB', 'CHAMP', 'TROPHY', 2025),
        generateAwardId('BSB', 'CHAMP', 'MOP', 2025)
      ]
    },
    
    // Beach Volleyball Regular Season (Invoice 790904)
    {
      invoice: '790904',
      awards: [
        generateAwardId('BVB', 'REG', 'MOP', 2025) // Most Outstanding Pair
      ]
    },
    
    // Beach Volleyball Championship (Invoice 789041)
    {
      invoice: '789041',
      awards: [
        generateAwardId('BVB', 'CHAMP', 'TROPHY', 2025)
      ]
    },
    
    // Equestrian Championship (Invoice 788239)
    {
      invoice: '788239',
      awards: [
        generateAwardId('EQ', 'CHAMP', 'TROPHY', 2025),
        generateAwardId('EQ', 'CHAMP', 'MOP', 2025), // 4 awards
        generateAwardId('EQ', 'CHAMP', 'OTY', 2025), // 5 awards
        generateAwardId('EQ', 'CHAMP', 'XII1ST', 2025) // 20 awards
      ]
    },
    
    // Equestrian Regular Season Plates (Invoice 788788)
    {
      invoice: '788788',
      awards: [
        generateAwardId('EQ', 'REG', 'OTY', 2025), // 6 plates
        generateAwardId('EQ', 'REG', 'XII1ST', 2025) // 20 plates
      ]
    },
    
    // Equestrian Scholar Athlete (Invoice 791347)
    {
      invoice: '791347',
      awards: [
        generateAwardId('EQ', 'ACAD', 'SCHOLAR', 2025)
      ]
    }
  ];
  
  return jostensAwards;
}

/**
 * Generate sample award IDs for all sports
 */
function generateSampleAwardIds() {
  const samples = [];
  
  Object.keys(BIG12_SPORTS).forEach(sportCode => {
    const sport = BIG12_SPORTS[sportCode];
    
    // Championship awards
    samples.push({
      awardId: generateAwardId(sportCode, 'CHAMP', 'TROPHY', 2025),
      description: `${sport.name} Championship Trophy`,
      category: 'Championship Trophy'
    });
    
    samples.push({
      awardId: generateAwardId(sportCode, 'CHAMP', 'MOP', 2025),
      description: `${sport.name} Most Outstanding Player`,
      category: 'Championship Individual'
    });
    
    // Regular season awards
    samples.push({
      awardId: generateAwardId(sportCode, 'REG', 'POY', 2025),
      description: `${sport.name} Player of the Year`,
      category: 'Regular Season Individual'
    });
    
    samples.push({
      awardId: generateAwardId(sportCode, 'REG', 'XII1ST', 2025),
      description: `${sport.name} First Team All-Big 12`,
      category: 'Regular Season Team'
    });
    
    samples.push({
      awardId: generateAwardId(sportCode, 'REG', 'COY', 2025),
      description: `${sport.name} Coach of the Year`,
      category: 'Regular Season Coach'
    });
    
    // Academic awards
    samples.push({
      awardId: generateAwardId(sportCode, 'ACAD', 'SCHOLAR', 2025),
      description: `${sport.name} Scholar Athlete`,
      category: 'Academic'
    });
  });
  
  return samples;
}

// Export functions and data
module.exports = {
  BIG12_SPORTS,
  AWARD_TYPES,
  AWARD_ABBREVIATIONS,
  generateAwardId,
  parseAwardId,
  generateJostensAwardIds,
  generateSampleAwardIds
};

// Run examples if script is executed directly
if (require.main === module) {
  console.log('🏆 Big 12 Conference Award ID System\n');
  
  // Show Jostens invoice award IDs
  console.log('📋 Jostens Invoice Award IDs:');
  const jostensAwards = generateJostensAwardIds();
  jostensAwards.forEach(invoice => {
    console.log(`\nInvoice ${invoice.invoice}:`);
    invoice.awards.forEach(awardId => {
      const parsed = parseAwardId(awardId);
      console.log(`  ${awardId} - ${parsed.fullDescription}`);
    });
  });
  
  // Show sample award IDs for major sports
  console.log('\n🎯 Sample Award IDs for Major Sports:');
  const majorSports = ['FB', 'MBB', 'WBB', 'BSB', 'SB'];
  majorSports.forEach(sportCode => {
    console.log(`\n${BIG12_SPORTS[sportCode].name}:`);
    console.log(`  Championship Trophy: ${generateAwardId(sportCode, 'CHAMP', 'TROPHY', 2025)}`);
    console.log(`  Player of the Year: ${generateAwardId(sportCode, 'REG', 'POY', 2025)}`);
    console.log(`  First Team All-Big 12: ${generateAwardId(sportCode, 'REG', 'XII1ST', 2025)}`);
    console.log(`  Scholar Athlete: ${generateAwardId(sportCode, 'ACAD', 'SCHOLAR', 2025)}`);
  });
  
  // Show parsing example
  console.log('\n🔍 Parsing Example:');
  const exampleId = 'FB-CHAMP-TROPHY-2025';
  const parsed = parseAwardId(exampleId);
  console.log(`Award ID: ${exampleId}`);
  console.log(`Parsed:`, parsed);
}