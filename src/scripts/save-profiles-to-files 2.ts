/**
 * Save Generated Profiles to Files
 * Persists all comprehensive research results to structured JSON files
 */

import fs from 'fs';
import path from 'path';
import executeComprehensiveResearch from './comprehensive-media-day-research';

interface ProfileSaveResult {
  playerProfiles: number;
  coachProfiles: number;
  filesCreated: string[];
  totalSize: number;
  timestamp: string;
}

async function saveProfilesToFiles(): Promise<ProfileSaveResult> {
  console.log('💾 SAVING PROFILES TO PERMANENT STORAGE');
  console.log('======================================');
  
  const startTime = Date.now();
  
  // Execute comprehensive research to get all profiles
  console.log('🔍 Executing comprehensive research...');
  const researchResults = await executeComprehensiveResearch();
  
  const result: ProfileSaveResult = {
    playerProfiles: 0,
    coachProfiles: 0,
    filesCreated: [],
    totalSize: 0,
    timestamp: new Date().toISOString()
  };

  // Ensure data directory exists
  const dataDir = '/Users/nickw/Documents/XII-Ops/HELiiX/public/data/media-day';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`📁 Created directory: ${dataDir}`);
  }

  // Save player profiles
  await savePlayerProfiles(researchResults.players, dataDir, result);
  
  // Save coach profiles
  await saveCoachProfiles(researchResults.coaches, dataDir, result);
  
  // Save comprehensive summary
  await saveSummaryData(researchResults, dataDir, result);
  
  const totalTime = Date.now() - startTime;
  
  console.log('');
  console.log('✅ PROFILES SUCCESSFULLY SAVED');
  console.log('==============================');
  console.log(`👥 Player Profiles: ${result.playerProfiles}`);
  console.log(`👔 Coach Profiles: ${result.coachProfiles}`);
  console.log(`📁 Files Created: ${result.filesCreated.length}`);
  console.log(`💾 Total Size: ${(result.totalSize / 1024).toFixed(1)} KB`);
  console.log(`⏱️  Processing Time: ${(totalTime / 1000).toFixed(1)}s`);
  console.log('');
  console.log('📍 Profile Locations:');
  result.filesCreated.forEach(file => {
    console.log(`   • ${file}`);
  });
  
  return result;
}

async function savePlayerProfiles(players: any[], dataDir: string, result: ProfileSaveResult): Promise<void> {
  console.log('👥 Saving player profiles...');
  
  const successfulPlayers = players.filter(p => p.success && p.research?.profile);
  const playerProfiles = successfulPlayers.map(p => ({
    ...p.player,
    profile: p.research.profile,
    confidence: p.research.confidence,
    sources: p.research.sources.map((s: any) => s.name),
    lastUpdated: new Date().toISOString()
  }));

  // Group by school for organized storage
  const playersBySchool = playerProfiles.reduce((acc, player) => {
    if (!acc[player.school]) acc[player.school] = [];
    acc[player.school].push(player);
    return acc;
  }, {} as Record<string, typeof playerProfiles>);

  // Save all players in one comprehensive file
  const allPlayersFile = path.join(dataDir, 'big12-football-players-2025.json');
  const allPlayersData = {
    metadata: {
      generated: new Date().toISOString(),
      totalPlayers: playerProfiles.length,
      schools: Object.keys(playersBySchool).length,
      avgConfidence: playerProfiles.reduce((sum, p) => sum + p.confidence, 0) / playerProfiles.length
    },
    players: playerProfiles,
    playersBySchool
  };

  fs.writeFileSync(allPlayersFile, JSON.stringify(allPlayersData, null, 2));
  const fileSize = fs.statSync(allPlayersFile).size;
  
  result.playerProfiles = playerProfiles.length;
  result.filesCreated.push('public/data/media-day/big12-football-players-2025.json');
  result.totalSize += fileSize;
  
  console.log(`  ✅ Saved ${playerProfiles.length} player profiles (${(fileSize / 1024).toFixed(1)} KB)`);
  
  // Save individual school files
  for (const [school, schoolPlayers] of Object.entries(playersBySchool)) {
    const schoolFile = path.join(dataDir, `${school.toLowerCase().replace(/\s+/g, '-')}-players-2025.json`);
    const schoolData = {
      school,
      players: schoolPlayers as any[],
      metadata: {
        generated: new Date().toISOString(),
        playerCount: (schoolPlayers as any[]).length
      }
    };
    
    fs.writeFileSync(schoolFile, JSON.stringify(schoolData, null, 2));
    const schoolFileSize = fs.statSync(schoolFile).size;
    result.totalSize += schoolFileSize;
    result.filesCreated.push(`public/data/media-day/${path.basename(schoolFile)}`);
  }
  
  console.log(`  📚 Created ${Object.keys(playersBySchool).length} school-specific files`);
}

async function saveCoachProfiles(coaches: any[], dataDir: string, result: ProfileSaveResult): Promise<void> {
  console.log('👔 Saving coach profiles...');
  
  const successfulCoaches = coaches.filter(c => c.success && c.research?.profile);
  const coachProfiles = successfulCoaches.map(c => ({
    ...c.coach,
    profile: c.research.profile,
    confidence: c.research.confidence,
    sources: c.research.sources.map((s: any) => s.name),
    lastUpdated: new Date().toISOString()
  }));

  const allCoachesFile = path.join(dataDir, 'big12-football-coaches-2025.json');
  const allCoachesData = {
    metadata: {
      generated: new Date().toISOString(),
      totalCoaches: coachProfiles.length,
      avgConfidence: coachProfiles.reduce((sum, c) => sum + c.confidence, 0) / coachProfiles.length,
      avgTenure: calculateAverageTenure(coachProfiles)
    },
    coaches: coachProfiles.sort((a, b) => a.school.localeCompare(b.school))
  };

  fs.writeFileSync(allCoachesFile, JSON.stringify(allCoachesData, null, 2));
  const fileSize = fs.statSync(allCoachesFile).size;
  
  result.coachProfiles = coachProfiles.length;
  result.filesCreated.push('public/data/media-day/big12-football-coaches-2025.json');
  result.totalSize += fileSize;
  
  console.log(`  ✅ Saved ${coachProfiles.length} coach profiles (${(fileSize / 1024).toFixed(1)} KB)`);
}

async function saveSummaryData(researchResults: any, dataDir: string, result: ProfileSaveResult): Promise<void> {
  console.log('📊 Saving comprehensive summary...');
  
  const summaryFile = path.join(dataDir, 'media-day-research-summary-2025.json');
  const summaryData = {
    generated: new Date().toISOString(),
    researchScope: {
      totalSubjects: researchResults.summary.totalSubjects,
      successfulProfiles: researchResults.summary.successfulProfiles,
      failedProfiles: researchResults.summary.failedProfiles,
      successRate: (researchResults.summary.successfulProfiles / researchResults.summary.totalSubjects * 100).toFixed(1) + '%'
    },
    confidence: {
      avgPlayerConfidence: (researchResults.summary.avgPlayerConfidence * 100).toFixed(1) + '%',
      avgCoachConfidence: (researchResults.summary.avgCoachConfidence * 100).toFixed(1) + '%',
      overallConfidence: (((researchResults.summary.avgPlayerConfidence + researchResults.summary.avgCoachConfidence) / 2) * 100).toFixed(1) + '%'
    },
    completeness: {
      avgPlayerCompleteness: (researchResults.summary.avgPlayerCompleteness * 100).toFixed(1) + '%',
      avgCoachCompleteness: (researchResults.summary.avgCoachCompleteness * 100).toFixed(1) + '%'
    },
    apiPerformance: {
      geminiSuccessRate: (researchResults.summary.geminiSuccessRate * 100).toFixed(1) + '%',
      perplexitySuccessRate: (researchResults.summary.perplexitySuccessRate * 100).toFixed(1) + '%'
    },
    qualityAnalysis: researchResults.qualityAnalysis.summary,
    recommendations: researchResults.recommendations,
    processingMetrics: {
      totalTimeMs: researchResults.summary.processingTimeMs,
      totalTimeSeconds: (researchResults.summary.processingTimeMs / 1000).toFixed(1),
      avgProcessingRate: (researchResults.summary.totalSubjects / (researchResults.summary.processingTimeMs / 1000)).toFixed(2) + ' profiles/second'
    }
  };

  fs.writeFileSync(summaryFile, JSON.stringify(summaryData, null, 2));
  const fileSize = fs.statSync(summaryFile).size;
  
  result.filesCreated.push('public/data/media-day/media-day-research-summary-2025.json');
  result.totalSize += fileSize;
  
  console.log(`  ✅ Saved comprehensive summary (${(fileSize / 1024).toFixed(1)} KB)`);
}

function calculateAverageTenure(coaches: any[]): number {
  const currentYear = new Date().getFullYear();
  const tenures = coaches
    .filter(c => c.profile?.hire_date && c.profile.hire_date !== 'Research Required')
    .map(c => {
      try {
        const hireYear = new Date(c.profile.hire_date).getFullYear();
        return currentYear - hireYear;
      } catch {
        return 0;
      }
    })
    .filter(t => t > 0);
    
  return tenures.length > 0 ? tenures.reduce((sum, t) => sum + t, 0) / tenures.length : 0;
}

// Execute profile saving
if (require.main === module) {
  saveProfilesToFiles()
    .then((result) => {
      console.log('');
      console.log('🎯 PROFILE PERSISTENCE COMPLETED');
      console.log('All Big 12 Media Day profiles are now stored in permanent files.');
      console.log('Ready for Media Day application consumption.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Profile saving failed:', error);
      process.exit(1);
    });
}

export default saveProfilesToFiles;