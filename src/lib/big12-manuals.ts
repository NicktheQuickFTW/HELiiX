import fs from 'fs';
import path from 'path';

// OneDrive path to Big 12 Championship Manuals
export const BIG12_MANUALS_PATH = '/Users/nickw/Library/CloudStorage/OneDrive-TheBig12Conference,Inc/Company Drive/CHAMPIONSHIPS/Manuals';

// Sport code mappings to match Big 12 nomenclature
export const SPORT_CODES = {
  'BSB': 'Baseball',
  'MBB': "Men's Basketball",
  'WBB': "Women's Basketball",
  'BVB': 'Beach Volleyball',
  'BOW': 'Bowling',
  'MXC': "Men's Cross Country",
  'WXC': "Women's Cross Country",
  'EQU': 'Equestrian',
  'FB': 'Football',
  'MGO': "Men's Golf",
  'WGO': "Women's Golf",
  'GYM': 'Gymnastics',
  'LAX': 'Lacrosse',
  'ROW': 'Rowing',
  'MSOC': "Men's Soccer",
  'WSOC': "Women's Soccer",
  'SB': 'Softball',
  'MSW': "Men's Swimming & Diving",
  'WSW': "Women's Swimming & Diving",
  'MTN': "Men's Tennis",
  'WTN': "Women's Tennis",
  'MTF': "Men's Track & Field",
  'WTF': "Women's Track & Field",
  'VB': 'Volleyball',
  'WRE': 'Wrestling'
};

export interface SportManual {
  sport: string;
  sportCode: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  lastModified: Date;
  exists: boolean;
  season?: string;
}

// Function to scan manual directory
export async function scanManualDirectory(): Promise<SportManual[]> {
  const manuals: SportManual[] = [];
  
  try {
    // Check if directory exists
    if (!fs.existsSync(BIG12_MANUALS_PATH)) {
      console.error('Manual directory not found:', BIG12_MANUALS_PATH);
      return manuals;
    }

    // Read directory contents
    const files = fs.readdirSync(BIG12_MANUALS_PATH);
    
    for (const file of files) {
      const filePath = path.join(BIG12_MANUALS_PATH, file);
      const stats = fs.statSync(filePath);
      
      // Only process files, not directories
      if (stats.isFile()) {
        // Try to extract sport code from filename
        const sportCode = extractSportCode(file);
        const sport = sportCode ? SPORT_CODES[sportCode] : 'Unknown';
        
        manuals.push({
          sport,
          sportCode: sportCode || 'UNK',
          fileName: file,
          filePath,
          fileSize: stats.size,
          lastModified: stats.mtime,
          exists: true,
          season: extractSeason(file)
        });
      }
    }
  } catch (error) {
    console.error('Error scanning manual directory:', error);
  }
  
  return manuals;
}

// Extract sport code from filename
function extractSportCode(fileName: string): string | null {
  // Common patterns in Big 12 manual filenames
  const patterns = [
    /^(\w+)[-_\s]/i,  // Code at beginning
    /[-_\s](\w{2,4})[-_\s]/i,  // Code in middle
    /(\w{2,4})\.pdf$/i  // Code before extension
  ];
  
  for (const pattern of patterns) {
    const match = fileName.match(pattern);
    if (match && match[1]) {
      const code = match[1].toUpperCase();
      if (SPORT_CODES[code]) {
        return code;
      }
    }
  }
  
  // Try to match by sport name in filename
  for (const [code, sportName] of Object.entries(SPORT_CODES)) {
    if (fileName.toLowerCase().includes(sportName.toLowerCase().replace(/['\s]/g, ''))) {
      return code;
    }
  }
  
  return null;
}

// Extract season/year from filename
function extractSeason(fileName: string): string | undefined {
  const yearMatch = fileName.match(/20\d{2}(-\d{2})?/);
  return yearMatch ? yearMatch[0] : undefined;
}

// Get manual for specific sport
export async function getManualForSport(sportCode: string): Promise<SportManual | null> {
  const manuals = await scanManualDirectory();
  return manuals.find(m => m.sportCode === sportCode) || null;
}

// Get all manuals organized by sport
export async function getManualsBySport(): Promise<Record<string, SportManual[]>> {
  const manuals = await scanManualDirectory();
  const organized: Record<string, SportManual[]> = {};
  
  for (const manual of manuals) {
    if (!organized[manual.sport]) {
      organized[manual.sport] = [];
    }
    organized[manual.sport].push(manual);
  }
  
  return organized;
}

// Check which sports are missing manuals
export async function getMissingSportManuals(): Promise<string[]> {
  const manuals = await scanManualDirectory();
  const foundSports = new Set(manuals.map(m => m.sportCode));
  
  const missingSports: string[] = [];
  for (const [code, sport] of Object.entries(SPORT_CODES)) {
    if (!foundSports.has(code)) {
      missingSports.push(sport);
    }
  }
  
  return missingSports;
}