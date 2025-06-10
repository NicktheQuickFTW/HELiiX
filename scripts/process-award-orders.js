const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Big 12 Schools mapping
const schoolMapping = {
  'University of Arizona': { id: 1, code: 'ARIZ', abbrev: 'Arizona' },
  'Arizona State University': { id: 2, code: 'ASU', abbrev: 'Arizona State' },
  'Baylor University': { id: 3, code: 'BAY', abbrev: 'Baylor' },
  'BYU': { id: 4, code: 'BYU', abbrev: 'BYU' },
  'University of Cincinnati': { id: 5, code: 'CIN', abbrev: 'Cincinnati' },
  'University of Colorado Boulder': { id: 6, code: 'COL', abbrev: 'Colorado' },
  'University of Houston': { id: 7, code: 'HOU', abbrev: 'Houston' },
  'Iowa State University': { id: 8, code: 'ISU', abbrev: 'Iowa State' },
  'University of Kansas': { id: 9, code: 'KU', abbrev: 'Kansas' },
  'Kansas State University': { id: 10, code: 'KSU', abbrev: 'Kansas State' },
  'Oklahoma State University': { id: 11, code: 'OSU', abbrev: 'Oklahoma State' },
  'TCU': { id: 12, code: 'TCU', abbrev: 'TCU' },
  'Texas Tech University': { id: 13, code: 'TTU', abbrev: 'Texas Tech' },
  'University of Central Florida': { id: 14, code: 'UCF', abbrev: 'UCF' },
  'University of Utah': { id: 15, code: 'UTAH', abbrev: 'Utah' },
  'West Virginia University': { id: 16, code: 'WVU', abbrev: 'West Virginia' }
};

// Sport code mapping for class codes
const sportCodeMapping = {
  'Men\'s Basketball': 'BB-M',
  'Women\'s Basketball': 'BB-W', 
  'Football': 'FB-M',
  'Baseball': 'HB-M',
  'Softball': 'SB-W',
  'Beach Volleyball': 'BV-W',
  'Volleyball': 'VB-W',
  'Soccer': 'SC-W',
  'Men\'s Cross Country': 'CC-M',
  'Women\'s Cross Country': 'CC-W',
  'Men\'s Tennis': 'TN-M',
  'Women\'s Tennis': 'TN-W',
  'Men\'s Golf': 'GF-M',
  'Women\'s Golf': 'GF-W',
  'Wrestling': 'WW-M',
  'Men\'s Swimming & Diving': 'SD-M',
  'Women\'s Swimming & Diving': 'SD-W',
  'Gymnastics': 'GY-W',
  'Men\'s Indoor Track & Field': 'IT-M',
  'Women\'s Indoor Track & Field': 'IT-W',
  'Men\'s Outdoor Track & Field': 'OT-M',
  'Women\'s Outdoor Track & Field': 'OT-W',
  'Lacrosse': 'LX-W',
  'Rowing': 'RW-W',
  'Equestrian': 'EQ-W'
};

// Award type classification for class codes
function getClassCode(awardType, sportCode) {
  const isRegularSeason = awardType.toLowerCase().includes('regular season') ||
                         awardType.toLowerCase().includes('player of the year') ||
                         awardType.toLowerCase().includes('coach of the year') ||
                         awardType.toLowerCase().includes('freshman') ||
                         awardType.toLowerCase().includes('scholar') ||
                         awardType.toLowerCase().includes('all-big 12') ||
                         awardType.toLowerCase().includes('defensive') ||
                         awardType.toLowerCase().includes('newcomer') ||
                         awardType.toLowerCase().includes('sixth man') ||
                         awardType.toLowerCase().includes('improved') ||
                         awardType.toLowerCase().includes('batting champion') ||
                         awardType.toLowerCase().includes('pitcher');
  
  const baseCode = isRegularSeason ? 'S-050-00-' : 'S-060-00-';
  return baseCode + sportCode;
}

// Parse CSV files
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Process individual order records
async function processOrderRecord(record, filename) {
  try {
    const sport = record.SPORT || record.Sport;
    const year = record.YEAR || record.Year;
    const awardType = record.AWARD || record.Award;
    const recipientName = record.NAME || record.Name;
    const schoolName = record.SCHOOL || record.School;
    
    if (!sport || !year || !awardType || !recipientName || !schoolName) {
      console.log(`Skipping incomplete record in ${filename}`);
      return null;
    }
    
    // Get school mapping
    const schoolInfo = schoolMapping[schoolName];
    if (!schoolInfo) {
      console.log(`Unknown school: ${schoolName}`);
      return null;
    }
    
    // Get sport code
    const sportCode = sportCodeMapping[sport];
    if (!sportCode) {
      console.log(`Unknown sport: ${sport}`);
      return null;
    }
    
    // Generate class code
    const classCode = getClassCode(awardType, sportCode);
    
    // Determine award category
    let awardCategory = 'individual_award';
    if (awardType.toLowerCase().includes('coach')) awardCategory = 'coach_of_year';
    else if (awardType.toLowerCase().includes('all-big 12')) awardCategory = 'all_conference';
    else if (awardType.toLowerCase().includes('player of the year')) awardCategory = 'player_of_year';
    else if (awardType.toLowerCase().includes('freshman')) awardCategory = 'freshman_of_year';
    else if (awardType.toLowerCase().includes('scholar')) awardCategory = 'academic_honor';
    else if (awardType.toLowerCase().includes('team')) awardCategory = 'team_award';
    
    // Parse year to integer
    const seasonYear = parseInt(year.split('-')[0]) || parseInt(year);
    
    return {
      sport,
      sportCode,
      year: seasonYear,
      awardType,
      awardCategory,
      recipientName,
      schoolName,
      schoolId: schoolInfo.id,
      schoolCode: schoolInfo.code,
      classCode,
      filename,
      shippingContact: record['SHIPPING CONTACT'] || record['Shipping Contact'],
      shippingAddress: record['SHIPPING ADDRESS'] || record['Shipping Address'],
      city: record.CITY || record.City,
      state: record.STATE || record.State,
      zip: record.ZIP || record.Zip
    };
  } catch (error) {
    console.error(`Error processing record from ${filename}:`, error);
    return null;
  }
}

// Main processing function
async function processAllAwardOrders() {
  const ordersDir = '/Users/nickw/Library/CloudStorage/OneDrive-TheBig12Conference,Inc/Company Drive/CHAMPIONSHIPS/Awards/[01] 2024-25/Orders/[02] Ordered';
  
  console.log('=== PROCESSING 2024-25 AWARD ORDERS ===\n');
  
  try {
    const files = fs.readdirSync(ordersDir).filter(file => 
      file.endsWith('.csv') || file.endsWith('.xlsx')
    );
    
    console.log(`Found ${files.length} order files to process\n`);
    
    let totalRecords = 0;
    let processedRecords = 0;
    const classCodes = new Set();
    const schools = new Set();
    const sports = new Set();
    const awards = [];
    const recipients = [];
    
    for (const file of files) {
      if (file.endsWith('.xlsx')) {
        console.log(`Skipping Excel file ${file} - convert to CSV first`);
        continue;
      }
      
      const filePath = path.join(ordersDir, file);
      console.log(`Processing: ${file}`);
      
      try {
        const records = await parseCSV(filePath);
        totalRecords += records.length;
        
        for (const record of records) {
          const processed = await processOrderRecord(record, file);
          if (processed) {
            processedRecords++;
            
            // Track unique values
            classCodes.add(processed.classCode);
            schools.add(`${processed.schoolName} (${processed.schoolCode})`);
            sports.add(`${processed.sport} (${processed.sportCode})`);
            
            // Create award entry
            const awardKey = `${processed.awardType}_${processed.sport}_${processed.year}`;
            let award = awards.find(a => a.key === awardKey);
            
            if (!award) {
              award = {
                key: awardKey,
                name: `${processed.awardType} - ${processed.sport}`,
                description: `${processed.awardType} award for ${processed.sport} ${processed.year}`,
                award_type: processed.awardCategory,
                sport: processed.sport,
                sport_code: processed.sportCode,
                season_year: processed.year,
                class_code: processed.classCode,
                status: 'ordered',
                quantity: 0,
                recipients: []
              };
              awards.push(award);
            }
            
            award.quantity++;
            award.recipients.push({
              name: processed.recipientName,
              school: processed.schoolName,
              school_id: processed.schoolId,
              school_code: processed.schoolCode,
              shipping_info: {
                contact: processed.shippingContact,
                address: processed.shippingAddress,
                city: processed.city,
                state: processed.state,
                zip: processed.zip
              }
            });
            
            // Add to recipients array
            recipients.push({
              award_key: awardKey,
              recipient_name: processed.recipientName,
              school_name: processed.schoolName,
              school_id: processed.schoolId,
              season_year: processed.year,
              award_type: processed.awardType,
              sport: processed.sport,
              class_code: processed.classCode,
              recipient_type: processed.awardCategory.includes('coach') ? 'coach' : 'individual'
            });
          }
        }
        
        console.log(`  → Processed ${records.length} records`);
        
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
    
    // Display summary
    console.log('\n=== PROCESSING SUMMARY ===');
    console.log(`Total records found: ${totalRecords}`);
    console.log(`Successfully processed: ${processedRecords}`);
    console.log(`Unique awards: ${awards.length}`);
    console.log(`Unique recipients: ${recipients.length}`);
    console.log(`Schools represented: ${schools.size}`);
    console.log(`Sports covered: ${sports.size}`);
    console.log(`Class codes generated: ${classCodes.size}`);
    
    // Display class codes breakdown
    console.log('\n=== CLASS CODES BREAKDOWN ===');
    const regularSeasonCodes = Array.from(classCodes).filter(code => code.includes('S-050'));
    const championshipCodes = Array.from(classCodes).filter(code => code.includes('S-060'));
    
    console.log(`Regular Season Awards (S-050): ${regularSeasonCodes.length}`);
    regularSeasonCodes.sort().forEach(code => console.log(`  ${code}`));
    
    console.log(`\nChampionship Awards (S-060): ${championshipCodes.length}`);
    championshipCodes.sort().forEach(code => console.log(`  ${code}`));
    
    // Display school breakdown
    console.log('\n=== SCHOOLS BREAKDOWN ===');
    Array.from(schools).sort().forEach(school => console.log(`  ${school}`));
    
    // Display sport breakdown
    console.log('\n=== SPORTS BREAKDOWN ===');
    Array.from(sports).sort().forEach(sport => console.log(`  ${sport}`));
    
    // Now add to database
    console.log('\n=== ADDING TO DATABASE ===');
    
    for (const award of awards) {
      try {
        // Insert award
        const { data: awardData, error: awardError } = await supabase
          .from('awards')
          .insert({
            name: award.name,
            description: award.description,
            status: award.status,
            quantity: award.quantity,
            season_year: award.season_year,
            award_type: award.award_type,
            recipient_details: {
              class_code: award.class_code,
              sport: award.sport,
              sport_code: award.sport_code,
              recipients: award.recipients
            }
          })
          .select()
          .single();
          
        if (awardError) {
          console.error(`Error adding award ${award.name}:`, awardError);
          continue;
        }
        
        console.log(`✓ Added award: ${award.name} (${award.quantity} recipients)`);
        
        // Insert recipients
        for (const recipient of award.recipients) {
          const { error: recipientError } = await supabase
            .from('award_recipients')
            .insert({
              award_id: awardData.id,
              school_id: recipient.school_id,
              season_year: award.season_year,
              recipient_type: award.award_type.includes('coach') ? 'coach' : 'individual',
              recipient_name: recipient.name,
              recipient_details: {
                school: recipient.school,
                school_code: recipient.school_code,
                shipping_info: recipient.shipping_info,
                class_code: award.class_code,
                sport: award.sport
              }
            });
            
          if (recipientError) {
            console.error(`Error adding recipient ${recipient.name}:`, recipientError);
          }
        }
        
      } catch (error) {
        console.error(`Error processing award ${award.name}:`, error);
      }
    }
    
    // Final summary
    console.log('\n=== FINAL SUMMARY ===');
    console.log(`✅ Successfully processed ${awards.length} awards with ${recipients.length} recipients`);
    console.log(`📊 Class codes: ${Array.from(classCodes).length} unique codes generated`);
    console.log(`🏫 Schools: ${schools.size} institutions represented`);
    console.log(`🏆 Sports: ${sports.size} different sports covered`);
    
  } catch (error) {
    console.error('Error processing award orders:', error);
  }
}

// Install csv-parser if needed
try {
  require('csv-parser');
} catch (error) {
  console.log('Installing csv-parser...');
  require('child_process').execSync('npm install csv-parser', { stdio: 'inherit' });
}

processAllAwardOrders();