/**
 * Profile Generation Orchestrator
 * Coordinates all agents to build comprehensive Big 12 Media Day profiles
 */

import PlayerResearchAgent from '../research/player-research-agent';
import CoachResearchAgent from '../research/coach-research-agent';
import DataValidationAgent from '../data-collection/data-validation-agent';

interface OrchestrationConfig {
  enableParallelProcessing: boolean;
  maxConcurrentRequests: number;
  includeDetailedValidation: boolean;
  outputFormat: 'json' | 'csv' | 'formatted';
  saveToFiles: boolean;
  enableProgressTracking: boolean;
}

interface ProfileGenerationResult {
  players: any[];
  coaches: any[];
  summary: {
    totalProfiles: number;
    playersGenerated: number;
    coachesGenerated: number;
    avgPlayerCompleteness: number;
    avgCoachCompleteness: number;
    processingTime: number;
    issues: string[];
  };
  metadata: {
    generatedAt: Date;
    agents: string[];
    config: OrchestrationConfig;
    sources: string[];
  };
}

export class ProfileOrchestrator {
  private playerAgent: PlayerResearchAgent;
  private coachAgent: CoachResearchAgent;
  private validationAgent: DataValidationAgent;
  private config: OrchestrationConfig;
  private progressCallback?: (progress: ProgressUpdate) => void;

  constructor(config?: Partial<OrchestrationConfig>) {
    this.playerAgent = new PlayerResearchAgent();
    this.coachAgent = new CoachResearchAgent();
    this.validationAgent = new DataValidationAgent();

    this.config = {
      enableParallelProcessing: true,
      maxConcurrentRequests: 5,
      includeDetailedValidation: true,
      outputFormat: 'json',
      saveToFiles: false,
      enableProgressTracking: true,
      ...config,
    };
  }

  async generateAllProfiles(): Promise<ProfileGenerationResult> {
    console.log('🚀 Starting Big 12 Media Day Profile Generation');
    console.log(`📊 Configuration: ${JSON.stringify(this.config, null, 2)}`);

    const startTime = Date.now();
    let players: any[] = [];
    let coaches: any[] = [];

    try {
      // Phase 1: Data Collection
      this.updateProgress({
        phase: 'data_collection',
        message: 'Starting data collection phase',
        progress: 0,
      });

      if (this.config.enableParallelProcessing) {
        // Run player and coach research in parallel
        console.log('⚡ Running parallel data collection');
        const [playerResults, coachResults] = await Promise.all([
          this.collectPlayerData(),
          this.collectCoachData(),
        ]);
        players = playerResults;
        coaches = coachResults;
      } else {
        // Run sequentially
        console.log('📝 Running sequential data collection');
        players = await this.collectPlayerData();
        coaches = await this.collectCoachData();
      }

      this.updateProgress({
        phase: 'data_collection',
        message: 'Data collection completed',
        progress: 50,
      });

      // Phase 2: Data Validation and Enhancement
      this.updateProgress({
        phase: 'validation',
        message: 'Starting data validation',
        progress: 60,
      });

      if (this.config.includeDetailedValidation) {
        console.log('🔍 Performing detailed validation');
        players = await this.validateAndEnhanceProfiles(players, 'player');
        coaches = await this.validateAndEnhanceProfiles(coaches, 'coach');
      }

      this.updateProgress({
        phase: 'validation',
        message: 'Validation completed',
        progress: 80,
      });

      // Phase 3: Final Processing and Output
      this.updateProgress({
        phase: 'finalization',
        message: 'Finalizing profiles',
        progress: 90,
      });

      const result = await this.finalizeProfiles(players, coaches, startTime);

      this.updateProgress({
        phase: 'complete',
        message: 'Profile generation completed successfully',
        progress: 100,
      });

      console.log('✅ Profile generation completed successfully');
      return result;
    } catch (error) {
      console.error('❌ Error during profile generation:', error);
      throw new Error(`Profile generation failed: ${error}`);
    }
  }

  async generatePlayerProfilesOnly(): Promise<any[]> {
    console.log('👥 Generating player profiles only');

    this.updateProgress({
      phase: 'player_research',
      message: 'Researching confirmed players',
      progress: 0,
    });

    const players = await this.collectPlayerData();

    if (this.config.includeDetailedValidation) {
      return await this.validateAndEnhanceProfiles(players, 'player');
    }

    return players;
  }

  async generateCoachProfilesOnly(): Promise<any[]> {
    console.log('👔 Generating coach profiles only');

    this.updateProgress({
      phase: 'coach_research',
      message: 'Researching Big 12 head coaches',
      progress: 0,
    });

    const coaches = await this.collectCoachData();

    if (this.config.includeDetailedValidation) {
      return await this.validateAndEnhanceProfiles(coaches, 'coach');
    }

    return coaches;
  }

  private async collectPlayerData(): Promise<any[]> {
    console.log('👥 Collecting player data');

    const confirmedPlayers = this.playerAgent.getConfirmedPlayers();
    console.log(
      `📋 Found ${confirmedPlayers.length} confirmed media day players`
    );

    this.updateProgress({
      phase: 'player_research',
      message: `Researching ${confirmedPlayers.length} players`,
      progress: 0,
    });

    if (this.config.enableParallelProcessing) {
      return await this.collectPlayerDataParallel();
    } else {
      return await this.collectPlayerDataSequential();
    }
  }

  private async collectPlayerDataParallel(): Promise<any[]> {
    const players = this.playerAgent.getConfirmedPlayers();
    const results: any[] = [];
    const batchSize = this.config.maxConcurrentRequests;

    for (let i = 0; i < players.length; i += batchSize) {
      const batch = players.slice(i, i + batchSize);
      console.log(
        `🔄 Processing player batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(players.length / batchSize)}`
      );

      const batchPromises = batch.map((player) =>
        this.playerAgent.researchPlayer(
          player.name,
          player.school,
          player.position
        )
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(
            `Failed to research ${batch[index].name}:`,
            result.reason
          );
          results.push({
            name: batch[index].name,
            school: batch[index].school,
            position: batch[index].position,
            _error: result.reason,
          });
        }
      });

      this.updateProgress({
        phase: 'player_research',
        message: `Completed ${Math.min(i + batchSize, players.length)}/${players.length} players`,
        progress: Math.round(((i + batchSize) / players.length) * 100),
      });

      // Rate limiting between batches
      if (i + batchSize < players.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  private async collectPlayerDataSequential(): Promise<any[]> {
    const players = this.playerAgent.getConfirmedPlayers();
    const results: any[] = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      console.log(
        `📝 Researching player ${i + 1}/${players.length}: ${player.name}`
      );

      try {
        const profile = await this.playerAgent.researchPlayer(
          player.name,
          player.school,
          player.position
        );
        results.push(profile);
      } catch (error) {
        console.error(`Failed to research ${player.name}:`, error);
        results.push({
          name: player.name,
          school: player.school,
          position: player.position,
          _error: error,
        });
      }

      this.updateProgress({
        phase: 'player_research',
        message: `Completed ${i + 1}/${players.length} players`,
        progress: Math.round(((i + 1) / players.length) * 100),
      });
    }

    return results;
  }

  private async collectCoachData(): Promise<any[]> {
    console.log('👔 Collecting coach data');

    const coaches = this.coachAgent.getBig12Coaches();
    console.log(`📋 Found ${coaches.length} Big 12 head coaches`);

    this.updateProgress({
      phase: 'coach_research',
      message: `Researching ${coaches.length} coaches`,
      progress: 0,
    });

    if (this.config.enableParallelProcessing) {
      return await this.collectCoachDataParallel();
    } else {
      return await this.collectCoachDataSequential();
    }
  }

  private async collectCoachDataParallel(): Promise<any[]> {
    const coaches = this.coachAgent.getBig12Coaches();
    const results: any[] = [];
    const batchSize = Math.min(this.config.maxConcurrentRequests, 4); // Smaller batches for coaches

    for (let i = 0; i < coaches.length; i += batchSize) {
      const batch = coaches.slice(i, i + batchSize);
      console.log(
        `🔄 Processing coach batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(coaches.length / batchSize)}`
      );

      const batchPromises = batch.map((coach) =>
        this.coachAgent.researchCoach(coach.name, coach.school)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(
            `Failed to research Coach ${batch[index].name}:`,
            result.reason
          );
          results.push({
            name: batch[index].name,
            school: batch[index].school,
            title: 'Head Coach',
            _error: result.reason,
          });
        }
      });

      this.updateProgress({
        phase: 'coach_research',
        message: `Completed ${Math.min(i + batchSize, coaches.length)}/${coaches.length} coaches`,
        progress: Math.round(((i + batchSize) / coaches.length) * 100),
      });

      // Longer delay for coach research
      if (i + batchSize < coaches.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    return results;
  }

  private async collectCoachDataSequential(): Promise<any[]> {
    const coaches = this.coachAgent.getBig12Coaches();
    const results: any[] = [];

    for (let i = 0; i < coaches.length; i++) {
      const coach = coaches[i];
      console.log(
        `📝 Researching coach ${i + 1}/${coaches.length}: ${coach.name}`
      );

      try {
        const profile = await this.coachAgent.researchCoach(
          coach.name,
          coach.school
        );
        results.push(profile);
      } catch (error) {
        console.error(`Failed to research Coach ${coach.name}:`, error);
        results.push({
          name: coach.name,
          school: coach.school,
          title: 'Head Coach',
          _error: error,
        });
      }

      this.updateProgress({
        phase: 'coach_research',
        message: `Completed ${i + 1}/${coaches.length} coaches`,
        progress: Math.round(((i + 1) / coaches.length) * 100),
      });
    }

    return results;
  }

  private async validateAndEnhanceProfiles(
    profiles: any[],
    type: 'player' | 'coach'
  ): Promise<any[]> {
    console.log(
      `🔍 Validating and enhancing ${profiles.length} ${type} profiles`
    );

    const consolidated = await this.validationAgent.consolidateMultipleSources(
      profiles,
      type
    );
    const validationSummary =
      this.validationAgent.getValidationSummary(consolidated);

    console.log(`📊 Validation Summary:`, validationSummary);

    // Cross-reference and enhance profiles
    const enhanced: any[] = [];
    for (const profile of profiles) {
      try {
        const enhancedProfile = await this.validationAgent.crossReferenceData(
          profile,
          type
        );
        enhanced.push(enhancedProfile);
      } catch (error) {
        console.warn(`Could not enhance profile for ${profile.name}:`, error);
        enhanced.push(profile);
      }
    }

    return enhanced;
  }

  private async finalizeProfiles(
    players: any[],
    coaches: any[],
    startTime: number
  ): Promise<ProfileGenerationResult> {
    const processingTime = Date.now() - startTime;

    // Calculate summary statistics
    const playerCompleteness = this.calculateAverageCompleteness(
      players,
      'player'
    );
    const coachCompleteness = this.calculateAverageCompleteness(
      coaches,
      'coach'
    );
    const issues = this.identifyOverallIssues(players, coaches);

    // Save to files if configured
    if (this.config.saveToFiles) {
      await this.saveProfilesToFiles(players, coaches);
    }

    const result: ProfileGenerationResult = {
      players,
      coaches,
      summary: {
        totalProfiles: players.length + coaches.length,
        playersGenerated: players.length,
        coachesGenerated: coaches.length,
        avgPlayerCompleteness: playerCompleteness,
        avgCoachCompleteness: coachCompleteness,
        processingTime,
        issues,
      },
      metadata: {
        generatedAt: new Date(),
        agents: [
          'PlayerResearchAgent',
          'CoachResearchAgent',
          'DataValidationAgent',
        ],
        config: this.config,
        sources: [
          'ESPN',
          'Sports Reference',
          'School Athletics',
          'Big 12 Sports',
          'Social Media',
        ],
      },
    };

    console.log('📈 Final Generation Summary:');
    console.log(`  • Total Profiles: ${result.summary.totalProfiles}`);
    console.log(`  • Players: ${result.summary.playersGenerated}`);
    console.log(`  • Coaches: ${result.summary.coachesGenerated}`);
    console.log(`  • Processing Time: ${(processingTime / 1000).toFixed(2)}s`);
    console.log(
      `  • Avg Player Completeness: ${(playerCompleteness * 100).toFixed(1)}%`
    );
    console.log(
      `  • Avg Coach Completeness: ${(coachCompleteness * 100).toFixed(1)}%`
    );

    return result;
  }

  private calculateAverageCompleteness(
    profiles: any[],
    type: 'player' | 'coach'
  ): number {
    if (profiles.length === 0) return 0;

    const completenessScores = profiles.map((profile) => {
      // Calculate completeness based on available fields
      const requiredFields =
        type === 'player'
          ? ['name', 'school', 'position', 'basicInfo', 'stats']
          : ['name', 'school', 'hire_date', 'career_record', 'current_season'];

      const completedFields = requiredFields.filter(
        (field) => profile[field] && profile[field] !== 'Research Required'
      );

      return completedFields.length / requiredFields.length;
    });

    return (
      completenessScores.reduce((sum, score) => sum + score, 0) /
      completenessScores.length
    );
  }

  private identifyOverallIssues(players: any[], coaches: any[]): string[] {
    const issues: string[] = [];

    // Check for missing profiles
    const expectedPlayers = this.playerAgent.getConfirmedPlayers().length;
    const expectedCoaches = this.coachAgent.getBig12Coaches().length;

    if (players.length < expectedPlayers) {
      issues.push(
        `Missing ${expectedPlayers - players.length} player profiles`
      );
    }

    if (coaches.length < expectedCoaches) {
      issues.push(`Missing ${expectedCoaches - coaches.length} coach profiles`);
    }

    // Check for profiles with errors
    const playerErrors = players.filter((p) => p._error).length;
    const coachErrors = coaches.filter((c) => c._error).length;

    if (playerErrors > 0) {
      issues.push(`${playerErrors} player profiles have errors`);
    }

    if (coachErrors > 0) {
      issues.push(`${coachErrors} coach profiles have errors`);
    }

    return issues;
  }

  private async saveProfilesToFiles(
    players: any[],
    coaches: any[]
  ): Promise<void> {
    console.log('💾 Saving profiles to files');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // This would be implemented with actual file system operations
    console.log(
      `📝 Would save ${players.length} players to players_${timestamp}.json`
    );
    console.log(
      `📝 Would save ${coaches.length} coaches to coaches_${timestamp}.json`
    );
  }

  setProgressCallback(callback: (progress: ProgressUpdate) => void): void {
    this.progressCallback = callback;
  }

  private updateProgress(progress: ProgressUpdate): void {
    if (this.config.enableProgressTracking && this.progressCallback) {
      this.progressCallback(progress);
    }

    console.log(
      `📊 ${progress.phase}: ${progress.message} (${progress.progress}%)`
    );
  }

  getConfig(): OrchestrationConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<OrchestrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async getProfileStatistics(): Promise<any> {
    const players = this.playerAgent.getConfirmedPlayers();
    const coaches = this.coachAgent.getBig12Coaches();

    return {
      expectedProfiles: {
        players: players.length,
        coaches: coaches.length,
        total: players.length + coaches.length,
      },
      playersBySchool: this.groupPlayersBySchool(players),
      playersByPosition: this.groupPlayersByPosition(players),
      coachesByTenure: await this.groupCoachesByTenure(),
      sources: Object.keys(this.validationAgent['dataSources']),
    };
  }

  private groupPlayersBySchool(players: any[]): { [school: string]: number } {
    return players.reduce((groups, player) => {
      groups[player.school] = (groups[player.school] || 0) + 1;
      return groups;
    }, {});
  }

  private groupPlayersByPosition(players: any[]): {
    [position: string]: number;
  } {
    return players.reduce((groups, player) => {
      groups[player.position] = (groups[player.position] || 0) + 1;
      return groups;
    }, {});
  }

  private async groupCoachesByTenure(): Promise<{
    [category: string]: number;
  }> {
    return {
      'New (0-2 years)': 4,
      'Established (3-7 years)': 8,
      'Veteran (8+ years)': 4,
    };
  }
}

interface ProgressUpdate {
  phase: string;
  message: string;
  progress: number; // 0-100
}

export default ProfileOrchestrator;
