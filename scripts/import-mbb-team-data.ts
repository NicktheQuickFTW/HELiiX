import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Conference mappings
const CONFERENCES = {
  XII: { id: 1, name: 'Big 12 Conference' },
  ACC: { id: 2, name: 'Atlantic Coast Conference' },
  B1G: { id: 3, name: 'Big Ten Conference' },
  SEC: { id: 4, name: 'Southeastern Conference' },
};

// Sport ID for Men's Basketball
const MBB_SPORT_ID = 2;

interface TeamSheetData {
  conferenceCode: string;
  schoolId: number;
  schoolName: string;
  season: string;
  nationalRank?: number;
  netRanking?: number;
  netSosRank?: number;
  rpiRanking?: number;
  rpiSosRank?: number;
  records: {
    overall: { wins: number; losses: number };
    conference: { wins: number; losses: number };
    div1NonConf: { wins: number; losses: number };
    home: { wins: number; losses: number };
    neutral: { wins: number; losses: number };
    road: { wins: number; losses: number };
    quad1: { wins: number; losses: number };
    quad2: { wins: number; losses: number };
    quad3: { wins: number; losses: number };
    quad4: { wins: number; losses: number };
    nonConfQuad1: { wins: number; losses: number };
    nonConfQuad2: { wins: number; losses: number };
    nonConfQuad3: { wins: number; losses: number };
    nonConfQuad4: { wins: number; losses: number };
  };
}

// Sample data structure for Big 12 teams
// This would be populated from OCR or manual entry
const BIG12_TEAMS_DATA: TeamSheetData[] = [
  {
    conferenceCode: 'XII',
    schoolId: 1,
    schoolName: 'Arizona',
    season: '2024-25',
    nationalRank: 15,
    netRanking: 18,
    netSosRank: 25,
    rpiRanking: 20,
    rpiSosRank: 30,
    records: {
      overall: { wins: 24, losses: 11 },
      conference: { wins: 14, losses: 6 },
      div1NonConf: { wins: 10, losses: 5 },
      home: { wins: 15, losses: 3 },
      neutral: { wins: 4, losses: 2 },
      road: { wins: 5, losses: 6 },
      quad1: { wins: 8, losses: 7 },
      quad2: { wins: 6, losses: 2 },
      quad3: { wins: 5, losses: 1 },
      quad4: { wins: 5, losses: 1 },
      nonConfQuad1: { wins: 3, losses: 4 },
      nonConfQuad2: { wins: 2, losses: 1 },
      nonConfQuad3: { wins: 3, losses: 0 },
      nonConfQuad4: { wins: 2, losses: 0 },
    },
  },
  // Add more teams here...
];

async function generateTeamId(
  conferenceId: number,
  schoolId: number,
  sportId: number
): string {
  // Format: conference_id (2 digits) + school_id (2 digits) + sport_id (2 digits)
  return `${String(conferenceId).padStart(2, '0')}${String(schoolId).padStart(2, '0')}${String(sportId).padStart(2, '0')}`;
}

async function importTeamData(teamData: TeamSheetData) {
  const conference =
    CONFERENCES[teamData.conferenceCode as keyof typeof CONFERENCES];
  if (!conference) {
    console.error(`Unknown conference: ${teamData.conferenceCode}`);
    return;
  }

  const teamId = await generateTeamId(
    conference.id,
    teamData.schoolId,
    MBB_SPORT_ID
  );
  const teamName = `${teamData.schoolName} Men's Basketball`;

  const teamRecord = {
    team_id: teamId,
    team_name: teamName,
    conference_id: conference.id,
    school_id: teamData.schoolId,
    sport_id: MBB_SPORT_ID,
    sport_name: "Men's Basketball",
    season: teamData.season,

    // Rankings
    national_rank: teamData.nationalRank,
    net_ranking: teamData.netRanking,
    net_sos_rank: teamData.netSosRank,
    rpi_ranking: teamData.rpiRanking,
    rpi_sos_rank: teamData.rpiSosRank,

    // Records
    overall_wins: teamData.records.overall.wins,
    overall_losses: teamData.records.overall.losses,
    conference_wins: teamData.records.conference.wins,
    conference_losses: teamData.records.conference.losses,
    div1_non_conf_wins: teamData.records.div1NonConf.wins,
    div1_non_conf_losses: teamData.records.div1NonConf.losses,
    home_wins: teamData.records.home.wins,
    home_losses: teamData.records.home.losses,
    neutral_wins: teamData.records.neutral.wins,
    neutral_losses: teamData.records.neutral.losses,
    road_wins: teamData.records.road.wins,
    road_losses: teamData.records.road.losses,

    // Quadrant records
    quad1_wins: teamData.records.quad1.wins,
    quad1_losses: teamData.records.quad1.losses,
    quad2_wins: teamData.records.quad2.wins,
    quad2_losses: teamData.records.quad2.losses,
    quad3_wins: teamData.records.quad3.wins,
    quad3_losses: teamData.records.quad3.losses,
    quad4_wins: teamData.records.quad4.wins,
    quad4_losses: teamData.records.quad4.losses,

    // Non-conference quadrant records
    non_conf_quad1_wins: teamData.records.nonConfQuad1.wins,
    non_conf_quad1_losses: teamData.records.nonConfQuad1.losses,
    non_conf_quad2_wins: teamData.records.nonConfQuad2.wins,
    non_conf_quad2_losses: teamData.records.nonConfQuad2.losses,
    non_conf_quad3_wins: teamData.records.nonConfQuad3.wins,
    non_conf_quad3_losses: teamData.records.nonConfQuad3.losses,
    non_conf_quad4_wins: teamData.records.nonConfQuad4.wins,
    non_conf_quad4_losses: teamData.records.nonConfQuad4.losses,
  };

  console.log(`\nImporting ${teamName} (${teamId})...`);

  const { data, error } = await supabase
    .from('teams')
    .upsert(teamRecord, { onConflict: 'team_id' });

  if (error) {
    console.error(`Error importing ${teamName}:`, error);
  } else {
    console.log(`✅ Successfully imported ${teamName}`);
  }
}

async function main() {
  console.log("🏀 Starting Men's Basketball Team Data Import...\n");

  // First, ensure the tables exist
  console.log("Note: Make sure you've run the migration first!");
  console.log(
    'Go to: https://supabase.com/dashboard/project/vfzgnvcwakjxtdsaedfq/sql'
  );
  console.log(
    'And execute: supabase/migrations/10-team-sheets-and-games.sql\n'
  );

  console.log('Press Enter to continue with import...');

  // Import each team
  for (const teamData of BIG12_TEAMS_DATA) {
    await importTeamData(teamData);
  }

  console.log('\n✅ Team data import complete!');
  console.log('\nNext steps:');
  console.log('1. Extract data from the PNG team sheets');
  console.log('2. Update the BIG12_TEAMS_DATA array with actual values');
  console.log('3. Run this script again to import all teams');
  console.log('4. Create a similar script for game data import');
}

// Uncomment to run
// main();
