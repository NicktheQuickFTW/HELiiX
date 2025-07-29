/**
 * Comprehensive Big 12 Media Day Research
 * Using Gemini Deep Research + Perplexity Deep Research for all confirmed attendees
 */

import DeepResearchAgent from '../lib/agents/research/deep-research-agent';
import ProfileValidationAgent from '../lib/agents/validation/profile-validation-agent';

// All 71 confirmed Big 12 Media Day players (ONLY confirmed attendees)
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

// All 16 confirmed Big 12 head coaches
const confirmedCoaches = [
  { name: 'Brent Brennan', school: 'Arizona' },
  { name: 'Kenny Dillingham', school: 'Arizona State' },
  { name: 'Dave Aranda', school: 'Baylor' },
  { name: 'Kalani Sitake', school: 'BYU' },
  { name: 'Scott Satterfield', school: 'Cincinnati' },
  { name: 'Deion Sanders', school: 'Colorado' },
  { name: 'Willie Fritz', school: 'Houston' },
  { name: 'Matt Campbell', school: 'Iowa State' },
  { name: 'Lance Leipold', school: 'Kansas' },
  { name: 'Chris Klieman', school: 'Kansas State' },
  { name: 'Mike Gundy', school: 'Oklahoma State' },
  { name: 'Sonny Dykes', school: 'TCU' },
  { name: 'Joey McGuire', school: 'Texas Tech' },
  { name: 'Gus Malzahn', school: 'UCF' },
  { name: 'Kyle Whittingham', school: 'Utah' },
  { name: 'Rich Rodriguez', school: 'West Virginia' },
];

interface ComprehensiveResearchResults {
  players: any[];
  coaches: any[];
  summary: {
    totalSubjects: number;
    successfulProfiles: number;
    failedProfiles: number;
    avgPlayerConfidence: number;
    avgCoachConfidence: number;
    avgPlayerCompleteness: number;
    avgCoachCompleteness: number;
    processingTimeMs: number;
    geminiSuccessRate: number;
    perplexitySuccessRate: number;
  };
  qualityAnalysis: any;
  recommendations: string[];
}

async function executeComprehensiveResearch(): Promise<ComprehensiveResearchResults> {
  console.log('🚀 BIG 12 MEDIA DAY COMPREHENSIVE RESEARCH');
  console.log('==========================================');
  console.log(`📊 Research Scope:`);
  console.log(
    `   • ${confirmedPlayers.length} confirmed players across 16 schools`
  );
  console.log(`   • ${confirmedCoaches.length} head coaches`);
  console.log(
    `   • Total subjects: ${confirmedPlayers.length + confirmedCoaches.length}`
  );
  console.log(
    `   • Research engines: Gemini Deep Research + Perplexity Deep Research`
  );
  console.log('');

  const deepResearcher = new DeepResearchAgent();
  const validator = new ProfileValidationAgent();

  const startTime = Date.now();
  const playerResults: any[] = [];
  const coachResults: any[] = [];

  // Phase 1: Player Research
  console.log('👥 PHASE 1: PLAYER RESEARCH');
  console.log('============================');

  await processPlayerResearch(deepResearcher, playerResults);

  console.log('');
  console.log('👔 PHASE 2: COACH RESEARCH');
  console.log('===========================');

  await processCoachResearch(deepResearcher, coachResults);

  const totalTime = Date.now() - startTime;

  // Phase 3: Validation and Quality Analysis
  console.log('');
  console.log('🔍 PHASE 3: QUALITY VALIDATION');
  console.log('===============================');

  const qualityAnalysis = await performQualityValidation(
    validator,
    playerResults,
    coachResults
  );

  // Phase 4: Generate Summary and Recommendations
  console.log('');
  console.log('📊 PHASE 4: SYNTHESIS AND REPORTING');
  console.log('====================================');

  const summary = generateSummary(playerResults, coachResults, totalTime);
  const recommendations = generateRecommendations(qualityAnalysis, summary);

  await generateComprehensiveReport(summary, qualityAnalysis, recommendations);

  console.log('');
  console.log('✅ COMPREHENSIVE RESEARCH COMPLETED');
  console.log('===================================');
  console.log(
    `🎯 Success Rate: ${((summary.successfulProfiles / summary.totalSubjects) * 100).toFixed(1)}%`
  );
  console.log(
    `📈 Avg Confidence: Players ${(summary.avgPlayerConfidence * 100).toFixed(1)}%, Coaches ${(summary.avgCoachConfidence * 100).toFixed(1)}%`
  );
  console.log(`⏱️  Total Time: ${(totalTime / 1000).toFixed(1)} seconds`);

  return {
    players: playerResults,
    coaches: coachResults,
    summary,
    qualityAnalysis,
    recommendations,
  };
}

async function processPlayerResearch(
  deepResearcher: DeepResearchAgent,
  results: any[]
): Promise<void> {
  // Group players by school for efficient processing
  const playersBySchool = confirmedPlayers.reduce(
    (acc, player) => {
      if (!acc[player.school]) acc[player.school] = [];
      acc[player.school].push(player);
      return acc;
    },
    {} as Record<string, typeof confirmedPlayers>
  );

  for (const [school, schoolPlayers] of Object.entries(playersBySchool)) {
    console.log(`🏫 ${school.toUpperCase()}`);
    console.log(
      `   Players: ${schoolPlayers.map((p) => `${p.name} (${p.position})`).join(', ')}`
    );

    const schoolStartTime = Date.now();

    // Process players in parallel with controlled concurrency
    const batchSize = 2; // Process 2 players at a time for optimal API usage

    for (let i = 0; i < schoolPlayers.length; i += batchSize) {
      const batch = schoolPlayers.slice(i, i + batchSize);

      const batchPromises = batch.map(async (player) => {
        try {
          console.log(
            `   🔍 Researching ${player.name} (${player.position}, ${player.year})...`
          );

          const research = await deepResearcher.conductDeepResearch(
            player.name,
            player.school,
            'player',
            player.position,
            player.year
          );

          const confidence = research.confidence;
          const completeness =
            research.profile?.research_metadata?.completeness_score || 0;

          const status =
            confidence > 0.8 ? '✅' : confidence > 0.6 ? '⚠️' : '❌';
          console.log(
            `   ${status} ${player.name.padEnd(20)} | ${player.position.padEnd(3)} | ${(confidence * 100).toFixed(1)}% conf | ${(completeness * 100).toFixed(1)}% complete`
          );

          // Show key insights
          if (research.sources.length > 1) {
            console.log(
              `      🔗 Sources: ${research.sources.map((s) => s.name).join(' + ')}`
            );
          }

          if (research.synthesis.agreements.length > 0) {
            console.log(`      ✅ ${research.synthesis.agreements[0]}`);
          }

          if (research.synthesis.conflicts.length > 0) {
            console.log(`      ⚠️ ${research.synthesis.conflicts[0]}`);
          }

          return {
            player,
            research,
            success: true,
          };
        } catch (error) {
          console.log(
            `   ❌ ${player.name.padEnd(20)} | ${player.position.padEnd(3)} | FAILED: ${error.message}`
          );

          return {
            player,
            research: null,
            success: false,
            error: error.message,
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      const resolvedResults = batchResults
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === 'fulfilled'
        )
        .map((result) => result.value);

      results.push(...resolvedResults);

      // Small delay between batches
      if (i + batchSize < schoolPlayers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const schoolTime = Date.now() - schoolStartTime;
    const successCount = results.filter(
      (r) => r.success && r.player && playersBySchool[school].includes(r.player)
    ).length;

    console.log(
      `   📈 ${school} Summary: ${successCount}/${schoolPlayers.length} successful, ${(schoolTime / 1000).toFixed(1)}s`
    );
    console.log('');
  }
}

async function processCoachResearch(
  deepResearcher: DeepResearchAgent,
  results: any[]
): Promise<void> {
  const batchSize = 3; // Process 3 coaches at a time

  for (let i = 0; i < confirmedCoaches.length; i += batchSize) {
    const batch = confirmedCoaches.slice(i, i + batchSize);

    console.log(
      `📋 Processing Batch ${Math.floor(i / batchSize) + 1}: ${batch.map((c) => c.school).join(', ')}`
    );

    const batchPromises = batch.map(async (coach) => {
      try {
        console.log(`   🔍 Researching ${coach.name} (${coach.school})...`);

        const research = await deepResearcher.conductDeepResearch(
          coach.name,
          coach.school,
          'coach'
        );

        const confidence = research.confidence;
        const completeness =
          research.profile?.research_metadata?.completeness_score || 0;

        const status = confidence > 0.8 ? '✅' : confidence > 0.6 ? '⚠️' : '❌';
        console.log(
          `   ${status} ${coach.school.padEnd(15)} | ${coach.name.padEnd(20)} | ${(confidence * 100).toFixed(1)}% conf | ${(completeness * 100).toFixed(1)}% complete`
        );

        // Show key insights
        if (research.profile?.contract?.salary) {
          // console.log(`💰 Salary information removed`);
        }

        if (research.profile?.record) {
          const record = research.profile.record;
          console.log(
            `      📊 Record: ${record.overall_wins}-${record.overall_losses}`
          );
        }

        if (research.synthesis.agreements.length > 0) {
          console.log(`      ✅ ${research.synthesis.agreements[0]}`);
        }

        return {
          coach,
          research,
          success: true,
        };
      } catch (error) {
        console.log(
          `   ❌ ${coach.name.padEnd(20)} | ${coach.school.padEnd(15)} | FAILED: ${error.message}`
        );

        return {
          coach,
          research: null,
          success: false,
          error: error.message,
        };
      }
    });

    const batchResults = await Promise.allSettled(batchPromises);
    const resolvedResults = batchResults
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value);

    results.push(...resolvedResults);

    console.log('');

    // Delay between batches
    if (i + batchSize < confirmedCoaches.length) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

async function performQualityValidation(
  validator: ProfileValidationAgent,
  playerResults: any[],
  coachResults: any[]
): Promise<any> {
  console.log('🔍 Performing comprehensive quality validation...');

  // Extract profiles for validation
  const playerProfiles = playerResults
    .filter((r) => r.success && r.research?.profile)
    .map((r) => r.research.profile);

  const coachProfiles = coachResults
    .filter((r) => r.success && r.research?.profile)
    .map((r) => r.research.profile);

  console.log(
    `📊 Validating ${playerProfiles.length} player profiles and ${coachProfiles.length} coach profiles`
  );

  // Run validation in parallel
  const [playerValidation, coachValidation] = await Promise.all([
    validator.validateBatch(playerProfiles, 'player'),
    validator.validateBatch(coachProfiles, 'coach'),
  ]);

  return {
    players: playerValidation,
    coaches: coachValidation,
    summary: {
      total_profiles: playerProfiles.length + coachProfiles.length,
      player_avg_score: playerValidation.batchSummary.avgScore,
      coach_avg_score: coachValidation.batchSummary.avgScore,
      overall_avg_score:
        (playerValidation.batchSummary.avgScore +
          coachValidation.batchSummary.avgScore) /
        2,
      top_issues: [
        ...playerValidation.batchSummary.topIssues,
        ...coachValidation.batchSummary.topIssues,
      ]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    },
  };
}

function generateSummary(
  playerResults: any[],
  coachResults: any[],
  totalTime: number
): any {
  const successfulPlayers = playerResults.filter((r) => r.success);
  const successfulCoaches = coachResults.filter((r) => r.success);

  const totalSubjects = confirmedPlayers.length + confirmedCoaches.length;
  const successfulProfiles =
    successfulPlayers.length + successfulCoaches.length;

  // Calculate confidence averages
  const avgPlayerConfidence =
    successfulPlayers.length > 0
      ? successfulPlayers.reduce((sum, r) => sum + r.research.confidence, 0) /
        successfulPlayers.length
      : 0;

  const avgCoachConfidence =
    successfulCoaches.length > 0
      ? successfulCoaches.reduce((sum, r) => sum + r.research.confidence, 0) /
        successfulCoaches.length
      : 0;

  // Calculate completeness averages
  const avgPlayerCompleteness =
    successfulPlayers.length > 0
      ? successfulPlayers.reduce(
          (sum, r) =>
            sum +
            (r.research.profile?.research_metadata?.completeness_score || 0),
          0
        ) / successfulPlayers.length
      : 0;

  const avgCoachCompleteness =
    successfulCoaches.length > 0
      ? successfulCoaches.reduce(
          (sum, r) =>
            sum +
            (r.research.profile?.research_metadata?.completeness_score || 0),
          0
        ) / successfulCoaches.length
      : 0;

  // Calculate API success rates
  const geminiSuccesses = [...playerResults, ...coachResults].filter((r) =>
    r.research?.sources?.some((s: any) => s.name === 'gemini')
  ).length;

  const perplexitySuccesses = [...playerResults, ...coachResults].filter((r) =>
    r.research?.sources?.some((s: any) => s.name === 'perplexity')
  ).length;

  return {
    totalSubjects,
    successfulProfiles,
    failedProfiles: totalSubjects - successfulProfiles,
    avgPlayerConfidence,
    avgCoachConfidence,
    avgPlayerCompleteness,
    avgCoachCompleteness,
    processingTimeMs: totalTime,
    geminiSuccessRate: geminiSuccesses / totalSubjects,
    perplexitySuccessRate: perplexitySuccesses / totalSubjects,
  };
}

function generateRecommendations(qualityAnalysis: any, summary: any): string[] {
  const recommendations: string[] = [];

  // API Performance Recommendations
  if (summary.geminiSuccessRate < 0.9) {
    recommendations.push(
      `Improve Gemini API reliability (current: ${(summary.geminiSuccessRate * 100).toFixed(1)}%)`
    );
  }

  if (summary.perplexitySuccessRate < 0.9) {
    recommendations.push(
      `Enhance Perplexity API integration (current: ${(summary.perplexitySuccessRate * 100).toFixed(1)}%)`
    );
  }

  // Profile Quality Recommendations
  if (summary.avgPlayerCompleteness < 0.8) {
    recommendations.push(
      'Enhance player profile completeness through additional data sources'
    );
  }

  if (summary.avgCoachCompleteness < 0.8) {
    recommendations.push(
      'Improve coach profile depth with more comprehensive research'
    );
  }

  // Research Methodology Recommendations
  if (qualityAnalysis.summary.overall_avg_score < 70) {
    recommendations.push('Implement additional quality assurance measures');
  }

  recommendations.push(
    'Verify social media accounts and NIL partnerships for accuracy'
  );
  recommendations.push(
    'Cross-reference statistical data with official conference records'
  );
  recommendations.push(
    'Update profiles with most recent 2024 season performance data'
  );
  recommendations.push(
    'Prepare position-specific interview questions and talking points'
  );

  return recommendations;
}

async function generateComprehensiveReport(
  summary: any,
  qualityAnalysis: any,
  recommendations: string[]
): Promise<void> {
  console.log('📋 COMPREHENSIVE RESEARCH REPORT');
  console.log('=================================');

  console.log('\n📊 EXECUTIVE SUMMARY');
  console.log('-------------------');
  console.log(`Total Research Subjects: ${summary.totalSubjects}`);
  console.log(
    `Successful Profiles: ${summary.successfulProfiles} (${((summary.successfulProfiles / summary.totalSubjects) * 100).toFixed(1)}%)`
  );
  console.log(`Failed Profiles: ${summary.failedProfiles}`);
  console.log(
    `Processing Time: ${(summary.processingTimeMs / 1000).toFixed(1)} seconds`
  );
  console.log(
    `Average Processing Rate: ${(summary.totalSubjects / (summary.processingTimeMs / 1000)).toFixed(2)} profiles/second`
  );

  console.log('\n🎯 CONFIDENCE METRICS');
  console.log('--------------------');
  console.log(
    `Player Confidence: ${(summary.avgPlayerConfidence * 100).toFixed(1)}%`
  );
  console.log(
    `Coach Confidence: ${(summary.avgCoachConfidence * 100).toFixed(1)}%`
  );
  console.log(
    `Overall Confidence: ${(((summary.avgPlayerConfidence + summary.avgCoachConfidence) / 2) * 100).toFixed(1)}%`
  );

  console.log('\n📈 COMPLETENESS ANALYSIS');
  console.log('-----------------------');
  console.log(
    `Player Completeness: ${(summary.avgPlayerCompleteness * 100).toFixed(1)}%`
  );
  console.log(
    `Coach Completeness: ${(summary.avgCoachCompleteness * 100).toFixed(1)}%`
  );
  console.log(
    `Overall Completeness: ${(((summary.avgPlayerCompleteness + summary.avgCoachCompleteness) / 2) * 100).toFixed(1)}%`
  );

  console.log('\n🔧 API PERFORMANCE');
  console.log('------------------');
  console.log(
    `Gemini Success Rate: ${(summary.geminiSuccessRate * 100).toFixed(1)}%`
  );
  console.log(
    `Perplexity Success Rate: ${(summary.perplexitySuccessRate * 100).toFixed(1)}%`
  );
  console.log(
    `Dual-Source Coverage: ${Math.min(summary.geminiSuccessRate, summary.perplexitySuccessRate) * 100}%`
  );

  if (qualityAnalysis.summary.top_issues.length > 0) {
    console.log('\n⚠️  TOP QUALITY ISSUES');
    console.log('---------------------');
    qualityAnalysis.summary.top_issues
      .slice(0, 5)
      .forEach((issue: any, index: number) => {
        console.log(`${index + 1}. ${issue.issue} (${issue.count} profiles)`);
      });
  }

  console.log('\n💡 RECOMMENDATIONS');
  console.log('------------------');
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });

  console.log('\n✅ MEDIA DAY READINESS STATUS');
  console.log('============================');

  const overallScore = qualityAnalysis.summary.overall_avg_score;
  const readinessLevel =
    overallScore >= 85
      ? 'EXCELLENT'
      : overallScore >= 70
        ? 'GOOD'
        : overallScore >= 55
          ? 'ADEQUATE'
          : 'NEEDS IMPROVEMENT';

  console.log(`Overall Quality Score: ${overallScore.toFixed(1)}/100`);
  console.log(`Readiness Level: ${readinessLevel}`);
  console.log(
    `Profiles Ready for Media Day: ${summary.successfulProfiles}/${summary.totalSubjects}`
  );

  if (readinessLevel === 'EXCELLENT' || readinessLevel === 'GOOD') {
    console.log('🎉 SYSTEM READY FOR BIG 12 MEDIA DAY');
  } else {
    console.log('⚠️  Additional refinement recommended before Media Day');
  }
}

// Execute comprehensive research
if (require.main === module) {
  executeComprehensiveResearch()
    .then((results) => {
      console.log('\n🎯 COMPREHENSIVE RESEARCH COMPLETED SUCCESSFULLY');
      console.log(
        `📊 Final Results: ${results.summary.successfulProfiles}/${results.summary.totalSubjects} profiles generated`
      );
      console.log(
        `🔍 Quality Score: ${results.qualityAnalysis.summary.overall_avg_score.toFixed(1)}/100`
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 COMPREHENSIVE RESEARCH FAILED:', error);
      process.exit(1);
    });
}

export default executeComprehensiveResearch;
