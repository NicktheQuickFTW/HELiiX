/**
 * Big 12 Football Player Profile Research Script
 * Comprehensive research for all 71 confirmed Media Day players
 */

import PlayerResearchAgent from '../lib/agents/research/player-research-agent';

// All 71 confirmed Big 12 Media Day players
const confirmedPlayers = [
  // Arizona (4 players)
  { name: 'Noah Fifita', school: 'Arizona', position: 'QB', year: 'Senior' },
  { name: 'Quali Conley', school: 'Arizona', position: 'RB', year: 'Senior' },
  {
    name: 'Tetairoa McMillan',
    school: 'Arizona',
    position: 'WR',
    year: 'Junior',
  },
  { name: 'Jacob Manu', school: 'Arizona', position: 'LB', year: 'Senior' },

  // Arizona State (5 players)
  {
    name: 'Sam Leavitt',
    school: 'Arizona State',
    position: 'QB',
    year: 'Sophomore',
  },
  {
    name: 'Cam Skattebo',
    school: 'Arizona State',
    position: 'RB',
    year: 'Senior',
  },
  {
    name: 'Jordyn Tyson',
    school: 'Arizona State',
    position: 'WR',
    year: 'Senior',
  },
  {
    name: 'Keyshaun Elliott',
    school: 'Arizona State',
    position: 'DB',
    year: 'Senior',
  },
  {
    name: 'Zac Swanson',
    school: 'Arizona State',
    position: 'OL',
    year: 'Senior',
  },

  // Baylor (4 players)
  {
    name: 'Sawyer Robertson',
    school: 'Baylor',
    position: 'QB',
    year: 'Senior',
  },
  {
    name: 'Bryson Washington',
    school: 'Baylor',
    position: 'RB',
    year: 'Senior',
  },
  { name: 'Josh Cameron', school: 'Baylor', position: 'WR', year: 'Senior' },
  { name: 'Matt Jones', school: 'Baylor', position: 'LB', year: 'Senior' },

  // BYU (5 players)
  { name: 'Jake Retzlaff', school: 'BYU', position: 'QB', year: 'Senior' },
  { name: 'LJ Martin', school: 'BYU', position: 'RB', year: 'Junior' },
  { name: 'Chase Roberts', school: 'BYU', position: 'WR', year: 'Senior' },
  { name: 'Blake Mangelson', school: 'BYU', position: 'OL', year: 'Senior' },
  { name: 'Jack Kelly', school: 'BYU', position: 'LB', year: 'Senior' },

  // Cincinnati (4 players)
  {
    name: 'Brendan Sorsby',
    school: 'Cincinnati',
    position: 'QB',
    year: 'Senior',
  },
  { name: 'Corey Kiner', school: 'Cincinnati', position: 'RB', year: 'Senior' },
  {
    name: 'Xzavier Henderson',
    school: 'Cincinnati',
    position: 'WR',
    year: 'Senior',
  },
  {
    name: 'Dontay Corleone',
    school: 'Cincinnati',
    position: 'DL',
    year: 'Senior',
  },

  // Colorado (5 players)
  {
    name: 'Shedeur Sanders',
    school: 'Colorado',
    position: 'QB',
    year: 'Senior',
  },
  {
    name: 'Charlie Offerdahl',
    school: 'Colorado',
    position: 'RB',
    year: 'Senior',
  },
  { name: 'Travis Hunter', school: 'Colorado', position: 'WR', year: 'Junior' },
  {
    name: 'Jordan Seaton',
    school: 'Colorado',
    position: 'OL',
    year: 'Freshman',
  },
  {
    name: 'LaVonta Bentley',
    school: 'Colorado',
    position: 'LB',
    year: 'Senior',
  },

  // Houston (4 players)
  { name: 'Donovan Smith', school: 'Houston', position: 'QB', year: 'Senior' },
  { name: 'Stacy Sneed', school: 'Houston', position: 'RB', year: 'Senior' },
  {
    name: 'Stephon Johnson',
    school: 'Houston',
    position: 'WR',
    year: 'Senior',
  },
  { name: 'Jamal Morris', school: 'Houston', position: 'DL', year: 'Senior' },

  // Iowa State (5 players)
  { name: 'Rocco Becht', school: 'Iowa State', position: 'QB', year: 'Junior' },
  { name: 'Abu Sama', school: 'Iowa State', position: 'RB', year: 'Senior' },
  { name: 'Jaylin Noel', school: 'Iowa State', position: 'WR', year: 'Senior' },
  {
    name: 'Jarrod Hufford',
    school: 'Iowa State',
    position: 'OL',
    year: 'Senior',
  },
  {
    name: 'Darien Porter',
    school: 'Iowa State',
    position: 'LB',
    year: 'Senior',
  },

  // Kansas (4 players)
  { name: 'Jalon Daniels', school: 'Kansas', position: 'QB', year: 'Senior' },
  { name: 'Devin Neal', school: 'Kansas', position: 'RB', year: 'Senior' },
  { name: 'Luke Grimm', school: 'Kansas', position: 'WR', year: 'Senior' },
  { name: 'Dean Miller', school: 'Kansas', position: 'LB', year: 'Senior' },

  // Kansas State (5 players)
  {
    name: 'Avery Johnson',
    school: 'Kansas State',
    position: 'QB',
    year: 'Sophomore',
  },
  {
    name: 'DJ Giddens',
    school: 'Kansas State',
    position: 'RB',
    year: 'Junior',
  },
  {
    name: 'Jayce Brown',
    school: 'Kansas State',
    position: 'WR',
    year: 'Senior',
  },
  {
    name: 'Hadley Panzer',
    school: 'Kansas State',
    position: 'OL',
    year: 'Senior',
  },
  {
    name: 'Austin Romaine',
    school: 'Kansas State',
    position: 'LB',
    year: 'Senior',
  },

  // Oklahoma State (4 players)
  {
    name: 'Alan Bowman',
    school: 'Oklahoma State',
    position: 'QB',
    year: 'Senior',
  },
  {
    name: 'Ollie Gordon II',
    school: 'Oklahoma State',
    position: 'RB',
    year: 'Junior',
  },
  {
    name: 'Brennan Presley',
    school: 'Oklahoma State',
    position: 'WR',
    year: 'Senior',
  },
  {
    name: 'Nick Martin',
    school: 'Oklahoma State',
    position: 'LB',
    year: 'Senior',
  },

  // TCU (5 players)
  { name: 'Josh Hoover', school: 'TCU', position: 'QB', year: 'Junior' },
  { name: 'Cam Cook', school: 'TCU', position: 'RB', year: 'Senior' },
  { name: 'JP Richardson', school: 'TCU', position: 'WR', year: 'Senior' },
  { name: 'Coy McMillon', school: 'TCU', position: 'OL', year: 'Senior' },
  { name: 'Johnny Hodges', school: 'TCU', position: 'DB', year: 'Senior' },

  // Texas Tech (4 players)
  {
    name: 'Behren Morton',
    school: 'Texas Tech',
    position: 'QB',
    year: 'Junior',
  },
  { name: 'Tahj Brooks', school: 'Texas Tech', position: 'RB', year: 'Senior' },
  { name: 'Josh Kelly', school: 'Texas Tech', position: 'WR', year: 'Senior' },
  { name: 'Ben Roberts', school: 'Texas Tech', position: 'LB', year: 'Senior' },

  // UCF (4 players)
  { name: 'KJ Jefferson', school: 'UCF', position: 'QB', year: 'Senior' },
  { name: 'RJ Harvey', school: 'UCF', position: 'RB', year: 'Junior' },
  { name: 'Kobe Hudson', school: 'UCF', position: 'WR', year: 'Senior' },
  { name: 'Ricky Barber', school: 'UCF', position: 'LB', year: 'Senior' },

  // Utah (5 players)
  { name: 'Cam Rising', school: 'Utah', position: 'QB', year: 'Senior' },
  { name: 'Micah Bernard', school: 'Utah', position: 'RB', year: 'Senior' },
  { name: 'Dorian Singer', school: 'Utah', position: 'WR', year: 'Senior' },
  { name: 'Spencer Fano', school: 'Utah', position: 'OL', year: 'Senior' },
  { name: 'Lander Barton', school: 'Utah', position: 'LB', year: 'Junior' },

  // West Virginia (4 players)
  {
    name: 'Garrett Greene',
    school: 'West Virginia',
    position: 'QB',
    year: 'Senior',
  },
  {
    name: 'Jahiem White',
    school: 'West Virginia',
    position: 'RB',
    year: 'Senior',
  },
  {
    name: 'Hudson Clement',
    school: 'West Virginia',
    position: 'WR',
    year: 'Senior',
  },
  {
    name: 'Josiah Trotter',
    school: 'West Virginia',
    position: 'LB',
    year: 'Senior',
  },
];

interface PlayerResearchResult {
  player: (typeof confirmedPlayers)[0];
  profile: any;
  completeness: number;
  processingTime: number;
  error?: string;
}

interface SchoolBatchResult {
  school: string;
  players: PlayerResearchResult[];
  batchTime: number;
  successCount: number;
  failureCount: number;
  avgCompleteness: number;
}

async function researchAllPlayers(): Promise<void> {
  console.log('🏈 BIG 12 FOOTBALL PLAYER PROFILE RESEARCH');
  console.log('==========================================');
  console.log(`📊 Total confirmed players: ${confirmedPlayers.length}`);
  console.log(
    `🏫 Schools represented: ${new Set(confirmedPlayers.map((p) => p.school)).size}`
  );
  console.log('');

  const playerAgent = new PlayerResearchAgent();
  const overallStartTime = Date.now();
  const schoolResults: SchoolBatchResult[] = [];
  const allResults: PlayerResearchResult[] = [];

  // Group players by school for efficient processing
  const playersBySchool = confirmedPlayers.reduce(
    (acc, player) => {
      if (!acc[player.school]) acc[player.school] = [];
      acc[player.school].push(player);
      return acc;
    },
    {} as Record<string, typeof confirmedPlayers>
  );

  // Process each school's players
  for (const [school, schoolPlayers] of Object.entries(playersBySchool)) {
    console.log(`🏫 PROCESSING ${school.toUpperCase()}`);
    console.log(
      `   Players: ${schoolPlayers.map((p) => `${p.name} (${p.position})`).join(', ')}`
    );
    console.log('   ' + '='.repeat(60));

    const schoolStartTime = Date.now();
    const schoolPlayerResults: PlayerResearchResult[] = [];

    // Process players in parallel with limited concurrency (3 at a time)
    const batchSize = 3;
    for (let i = 0; i < schoolPlayers.length; i += batchSize) {
      const batch = schoolPlayers.slice(i, i + batchSize);

      const batchPromises = batch.map(async (player) => {
        const playerStartTime = Date.now();

        try {
          console.log(
            `   🔍 Researching ${player.name} (${player.position}, ${player.year})...`
          );

          const profile = await playerAgent.researchPlayer(
            player.name,
            player.school,
            player.position
          );
          const completeness = calculatePlayerCompleteness(profile);
          const processingTime = Date.now() - playerStartTime;

          const status =
            completeness > 0.8 ? '✅' : completeness > 0.6 ? '⚠️' : '❌';
          console.log(
            `   ${status} ${player.name.padEnd(20)} | ${player.position.padEnd(3)} | ${(completeness * 100).toFixed(1)}% | ${(processingTime / 1000).toFixed(1)}s`
          );

          // Show key stats if available
          if (profile.statistics?.current_season) {
            const stats = profile.statistics.current_season;
            if (stats.passing_yards)
              console.log(
                `      📊 Passing: ${stats.passing_yards} yards, ${stats.passing_touchdowns} TDs`
              );
            if (stats.rushing_yards)
              console.log(
                `      📊 Rushing: ${stats.rushing_yards} yards, ${stats.rushing_touchdowns} TDs`
              );
            if (stats.receiving_yards)
              console.log(
                `      📊 Receiving: ${stats.receiving_yards} yards, ${stats.receiving_touchdowns} TDs`
              );
            if (stats.tackles)
              console.log(
                `      📊 Defense: ${stats.tackles} tackles, ${stats.sacks || 0} sacks`
              );
          }

          return {
            player,
            profile,
            completeness,
            processingTime,
          };
        } catch (error) {
          const processingTime = Date.now() - playerStartTime;
          console.log(
            `   ❌ ${player.name.padEnd(20)} | ${player.position.padEnd(3)} | ERROR | ${(processingTime / 1000).toFixed(1)}s`
          );
          console.log(`      Error: ${error.message}`);

          return {
            player,
            profile: null,
            completeness: 0,
            processingTime,
            error: error.message,
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      const resolvedResults = batchResults
        .filter(
          (result): result is PromiseFulfilledResult<PlayerResearchResult> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value);

      schoolPlayerResults.push(...resolvedResults);

      // Small delay between batches
      if (i + batchSize < schoolPlayers.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    const schoolTime = Date.now() - schoolStartTime;
    const successCount = schoolPlayerResults.filter((r) => r.profile).length;
    const failureCount = schoolPlayerResults.length - successCount;
    const avgCompleteness =
      successCount > 0
        ? schoolPlayerResults
            .filter((r) => r.profile)
            .reduce((sum, r) => sum + r.completeness, 0) / successCount
        : 0;

    const schoolResult: SchoolBatchResult = {
      school,
      players: schoolPlayerResults,
      batchTime: schoolTime,
      successCount,
      failureCount,
      avgCompleteness,
    };

    schoolResults.push(schoolResult);
    allResults.push(...schoolPlayerResults);

    console.log(
      `   📈 ${school} Summary: ${successCount}/${schoolPlayers.length} successful, ${(avgCompleteness * 100).toFixed(1)}% avg completeness, ${(schoolTime / 1000).toFixed(1)}s`
    );
    console.log('');
  }

  const totalTime = Date.now() - overallStartTime;

  // Generate comprehensive summary
  console.log('📊 OVERALL RESEARCH SUMMARY');
  console.log('===========================');

  const totalSuccessful = allResults.filter((r) => r.profile).length;
  const totalFailed = allResults.length - totalSuccessful;
  const overallAvgCompleteness =
    totalSuccessful > 0
      ? allResults
          .filter((r) => r.profile)
          .reduce((sum, r) => sum + r.completeness, 0) / totalSuccessful
      : 0;
  const avgProcessingTime =
    allResults.reduce((sum, r) => sum + r.processingTime, 0) /
    allResults.length;

  console.log(
    `✅ Successful Profiles: ${totalSuccessful}/${confirmedPlayers.length} (${((totalSuccessful / confirmedPlayers.length) * 100).toFixed(1)}%)`
  );
  console.log(`❌ Failed Profiles: ${totalFailed}/${confirmedPlayers.length}`);
  console.log(
    `📈 Average Completeness: ${(overallAvgCompleteness * 100).toFixed(1)}%`
  );
  console.log(
    `⏱️  Total Processing Time: ${(totalTime / 1000).toFixed(1)} seconds`
  );
  console.log(
    `⚡ Average Processing Time: ${(avgProcessingTime / 1000).toFixed(1)}s per player`
  );
  console.log(
    `🚀 Processing Rate: ${(confirmedPlayers.length / (totalTime / 1000)).toFixed(2)} players/second`
  );

  console.log('');
  console.log('🏫 SCHOOL PERFORMANCE BREAKDOWN');
  console.log('===============================');

  schoolResults
    .sort((a, b) => b.avgCompleteness - a.avgCompleteness)
    .forEach((school, index) => {
      const successRate = (
        (school.successCount / school.players.length) *
        100
      ).toFixed(1);
      const completenessScore = (school.avgCompleteness * 100).toFixed(1);

      console.log(
        `${index + 1}. ${school.school.padEnd(15)} | ${school.successCount}/${school.players.length} success | ${completenessScore}% completeness | ${(school.batchTime / 1000).toFixed(1)}s`
      );
    });

  console.log('');
  console.log('🎯 TOP PERFORMERS BY COMPLETENESS');
  console.log('==================================');

  const topPerformers = allResults
    .filter((r) => r.profile)
    .sort((a, b) => b.completeness - a.completeness)
    .slice(0, 10);

  topPerformers.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.player.name.padEnd(20)} | ${result.player.school.padEnd(15)} | ${result.player.position.padEnd(3)} | ${(result.completeness * 100).toFixed(1)}%`
    );
  });

  if (totalFailed > 0) {
    console.log('');
    console.log('❌ FAILED PROFILES');
    console.log('==================');

    const failedResults = allResults.filter((r) => !r.profile);
    failedResults.forEach((result, index) => {
      console.log(
        `${index + 1}. ${result.player.name} (${result.player.school}, ${result.player.position}): ${result.error}`
      );
    });
  }

  // Save comprehensive results to file
  await saveResearchResults(allResults, schoolResults, {
    totalTime,
    totalSuccessful,
    totalFailed,
    overallAvgCompleteness,
    avgProcessingTime,
  });

  console.log('');
  console.log('🎉 BIG 12 PLAYER PROFILE RESEARCH COMPLETED!');
}

function calculatePlayerCompleteness(player: any): number {
  if (!player) return 0;

  const requiredFields = [
    'name',
    'school',
    'position',
    'year',
    'physical_attributes',
  ];
  const importantFields = [
    'statistics',
    'recruiting_info',
    'media_day_talking_points',
  ];
  const optionalFields = [
    'background',
    'social_media',
    'achievements',
    'injury_status',
  ];

  let completedRequired = 0;
  let completedImportant = 0;
  let completedOptional = 0;

  for (const field of requiredFields) {
    if (player[field] && player[field] !== 'Research Required') {
      completedRequired++;
    }
  }

  for (const field of importantFields) {
    if (player[field] && player[field] !== 'Research Required') {
      completedImportant++;
    }
  }

  for (const field of optionalFields) {
    if (player[field] && player[field] !== 'Research Required') {
      completedOptional++;
    }
  }

  const requiredScore = (completedRequired / requiredFields.length) * 0.5;
  const importantScore = (completedImportant / importantFields.length) * 0.3;
  const optionalScore = (completedOptional / optionalFields.length) * 0.2;

  return requiredScore + importantScore + optionalScore;
}

async function saveResearchResults(
  allResults: PlayerResearchResult[],
  schoolResults: SchoolBatchResult[],
  summary: any
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  console.log('💾 Saving comprehensive research results...');

  const fullDataset = {
    metadata: {
      timestamp,
      total_players: confirmedPlayers.length,
      successful_profiles: summary.totalSuccessful,
      failed_profiles: summary.totalFailed,
      overall_avg_completeness: summary.overallAvgCompleteness,
      total_processing_time_ms: summary.totalTime,
      avg_processing_time_ms: summary.avgProcessingTime,
      schools_processed: schoolResults.length,
    },
    summary,
    school_results: schoolResults,
    player_profiles: allResults.map((result) => ({
      player_info: result.player,
      profile_data: result.profile,
      quality_metrics: {
        completeness: result.completeness,
        processing_time_ms: result.processingTime,
        success: !!result.profile,
        error: result.error || null,
      },
    })),
    position_breakdown: generatePositionBreakdown(allResults),
    school_rankings: schoolResults
      .map((s) => ({
        school: s.school,
        success_rate: s.successCount / s.players.length,
        avg_completeness: s.avgCompleteness,
        player_count: s.players.length,
      }))
      .sort((a, b) => b.avg_completeness - a.avg_completeness),
  };

  console.log(
    `📁 Research dataset: ${JSON.stringify(fullDataset, null, 2).length} characters`
  );
  console.log(
    `📊 Generated breakdown for ${Object.keys(generatePositionBreakdown(allResults)).length} positions`
  );
  console.log(
    `🏫 School rankings generated for ${schoolResults.length} schools`
  );

  // Also generate a CSV summary for quick analysis
  const csvHeader =
    'School,Player,Position,Year,Completeness,ProcessingTime,Success,Error';
  const csvRows = allResults.map((result) => {
    const player = result.player;
    const completeness = (result.completeness * 100).toFixed(1);
    const processingTime = (result.processingTime / 1000).toFixed(2);
    const success = result.profile ? 'Yes' : 'No';
    const error = result.error ? `"${result.error.replace(/"/g, '""')}"` : '';

    return `${player.school},${player.name},${player.position},${player.year},${completeness}%,${processingTime}s,${success},${error}`;
  });

  const csvContent = [csvHeader, ...csvRows].join('\n');
  console.log(`📈 CSV summary generated: ${csvContent.length} characters`);
}

function generatePositionBreakdown(
  results: PlayerResearchResult[]
): Record<string, any> {
  const breakdown: Record<string, any> = {};

  for (const result of results) {
    const position = result.player.position;
    if (!breakdown[position]) {
      breakdown[position] = {
        total_players: 0,
        successful_profiles: 0,
        avg_completeness: 0,
        players: [],
      };
    }

    breakdown[position].total_players++;
    if (result.profile) {
      breakdown[position].successful_profiles++;
    }
    breakdown[position].players.push({
      name: result.player.name,
      school: result.player.school,
      year: result.player.year,
      completeness: result.completeness,
      success: !!result.profile,
    });
  }

  // Calculate averages
  for (const position in breakdown) {
    const positionData = breakdown[position];
    const successfulPlayers = positionData.players.filter(
      (p: any) => p.success
    );
    positionData.avg_completeness =
      successfulPlayers.length > 0
        ? successfulPlayers.reduce(
            (sum: number, p: any) => sum + p.completeness,
            0
          ) / successfulPlayers.length
        : 0;
    positionData.success_rate =
      positionData.successful_profiles / positionData.total_players;
  }

  return breakdown;
}

// Execute the research
if (require.main === module) {
  researchAllPlayers()
    .then(() => {
      console.log('✅ All player research completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Player research failed:', error);
      process.exit(1);
    });
}

export default researchAllPlayers;
