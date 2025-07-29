/**
 * Data Aggregation and Validation Agent
 * Consolidates, validates, and enhances research data from multiple sources
 */

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface DataSource {
  name: string;
  url?: string;
  reliability: number; // 0-1 scale
  lastChecked: Date;
  dataPoints: string[];
}

interface ConsolidatedProfile {
  type: 'player' | 'coach';
  id: string;
  primaryData: any;
  alternativeSources: DataSource[];
  validationResults: ValidationResult;
  confidence: number;
  completeness: number;
  lastUpdated: Date;
}

export class DataValidationAgent {
  private dataSources: { [key: string]: DataSource } = {
    espn: {
      name: 'ESPN',
      url: 'espn.com',
      reliability: 0.9,
      lastChecked: new Date(),
      dataPoints: ['stats', 'bio', 'roster_info'],
    },
    sports_reference: {
      name: 'Sports Reference',
      url: 'sports-reference.com',
      reliability: 0.95,
      lastChecked: new Date(),
      dataPoints: ['historical_stats', 'career_data', 'awards'],
    },
    school_official: {
      name: 'School Athletics',
      url: 'school-athletics-sites',
      reliability: 0.98,
      lastChecked: new Date(),
      dataPoints: ['roster', 'bio', 'academics', 'media_guide'],
    },
    big12_official: {
      name: 'Big 12 Sports',
      url: 'big12sports.com',
      reliability: 0.97,
      lastChecked: new Date(),
      dataPoints: ['conference_records', 'awards', 'official_stats'],
    },
    recruiting_sites: {
      name: 'Recruiting Networks',
      url: '247sports.com|rivals.com',
      reliability: 0.8,
      lastChecked: new Date(),
      dataPoints: ['recruiting_info', 'rankings', 'commitment_data'],
    },
    social_media: {
      name: 'Social Media',
      url: 'twitter.com|instagram.com',
      reliability: 0.6,
      lastChecked: new Date(),
      dataPoints: ['personal_updates', 'photos', 'announcements'],
    },
  };

  private validationRules = {
    player: {
      required: ['name', 'school', 'position'],
      optional: ['height', 'weight', 'year', 'hometown', 'high_school'],
      stats: ['games', 'starts', 'position_specific_stats'],
      ranges: {
        height: { min: 60, max: 84 }, // inches
        weight: { min: 150, max: 350 }, // pounds
        jersey_number: { min: 0, max: 99 },
      },
    },
    coach: {
      required: ['name', 'school', 'title'],
      optional: ['hire_date', 'contract_details', 'career_record'],
      career: ['coaching_history', 'accomplishments', 'win_loss_record'],
      ranges: {
        tenure: { min: 0, max: 50 }, // years
        age: { min: 30, max: 80 },
      },
    },
  };

  async validatePlayerProfile(playerData: any): Promise<ValidationResult> {
    console.log(`🔍 Validating player profile: ${playerData.name}`);

    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // Required field validation
    const required = this.validationRules.player.required;
    for (const field of required) {
      if (!playerData[field] || playerData[field] === 'Research Required') {
        result.errors.push(`Missing required field: ${field}`);
        result.isValid = false;
        result.confidence -= 0.2;
      }
    }

    // Physical attributes validation
    if (playerData.basicInfo) {
      const { height, weight, jersey_number } = playerData.basicInfo;

      if (height) {
        const heightInches = this.parseHeight(height);
        if (
          heightInches < this.validationRules.player.ranges.height.min ||
          heightInches > this.validationRules.player.ranges.height.max
        ) {
          result.warnings.push(
            `Height ${height} seems unusual for football player`
          );
          result.confidence -= 0.1;
        }
      }

      if (weight) {
        const { min, max } = this.validationRules.player.ranges.weight;
        if (weight < min || weight > max) {
          result.warnings.push(`Weight ${weight} lbs is outside typical range`);
          result.confidence -= 0.1;
        }
      }

      if (jersey_number !== undefined) {
        const { min, max } = this.validationRules.player.ranges.jersey_number;
        if (jersey_number < min || jersey_number > max) {
          result.errors.push(`Invalid jersey number: ${jersey_number}`);
          result.isValid = false;
        }
      }
    }

    // Position-specific validation
    result.confidence *= this.validatePositionSpecificData(playerData);

    // Statistical consistency check
    if (playerData.stats) {
      const statsValidation = this.validatePlayerStats(
        playerData.stats,
        playerData.position
      );
      result.confidence *= statsValidation.confidence;
      result.warnings.push(...statsValidation.warnings);
    }

    // Data completeness assessment
    const completeness = this.assessDataCompleteness(playerData, 'player');
    if (completeness < 0.6) {
      result.suggestions.push(
        `Profile is ${Math.round(completeness * 100)}% complete - consider additional research`
      );
    }

    return result;
  }

  async validateCoachProfile(coachData: any): Promise<ValidationResult> {
    console.log(`🔍 Validating coach profile: ${coachData.name}`);

    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // Required field validation
    const required = this.validationRules.coach.required;
    for (const field of required) {
      if (!coachData[field] || coachData[field] === 'Research Required') {
        result.errors.push(`Missing required field: ${field}`);
        result.isValid = false;
        result.confidence -= 0.2;
      }
    }

    // Contract validation
    if (coachData.contract_details) {
      const contractValidation = this.validateContractData(
        coachData.contract_details
      );
      result.confidence *= contractValidation.confidence;
      result.warnings.push(...contractValidation.warnings);
    }

    // Career record validation
    if (coachData.career_record) {
      const recordValidation = this.validateCareerRecord(
        coachData.career_record
      );
      result.confidence *= recordValidation.confidence;
      result.warnings.push(...recordValidation.warnings);
    }

    // Tenure consistency check
    if (coachData.hire_date) {
      const tenureValidation = this.validateTenure(
        coachData.hire_date,
        coachData.coaching_history
      );
      result.confidence *= tenureValidation.confidence;
      result.warnings.push(...tenureValidation.warnings);
    }

    return result;
  }

  async consolidateMultipleSources(
    profiles: any[],
    type: 'player' | 'coach'
  ): Promise<ConsolidatedProfile[]> {
    console.log(
      `🔗 Consolidating data from multiple sources for ${profiles.length} ${type}s`
    );

    const consolidated: ConsolidatedProfile[] = [];

    for (const profile of profiles) {
      const consolidatedProfile: ConsolidatedProfile = {
        type,
        id: this.generateProfileId(profile, type),
        primaryData: profile,
        alternativeSources: [],
        validationResults:
          type === 'player'
            ? await this.validatePlayerProfile(profile)
            : await this.validateCoachProfile(profile),
        confidence: 0,
        completeness: 0,
        lastUpdated: new Date(),
      };

      // Calculate overall confidence and completeness
      consolidatedProfile.confidence =
        consolidatedProfile.validationResults.confidence;
      consolidatedProfile.completeness = this.assessDataCompleteness(
        profile,
        type
      );

      // Identify data gaps and research opportunities
      consolidatedProfile.validationResults.suggestions.push(
        ...this.identifyResearchOpportunities(profile, type)
      );

      consolidated.push(consolidatedProfile);
    }

    return consolidated;
  }

  async crossReferenceData(
    profile: any,
    type: 'player' | 'coach'
  ): Promise<any> {
    console.log(`🔄 Cross-referencing data for ${profile.name}`);

    // Simulate cross-referencing with multiple sources
    const crossReferences = await this.queryMultipleSources(profile, type);

    // Resolve conflicts and merge data
    const mergedProfile = await this.mergeConflictingData(
      profile,
      crossReferences
    );

    // Flag discrepancies for manual review
    mergedProfile._dataFlags = this.identifyDiscrepancies(
      profile,
      crossReferences
    );

    return mergedProfile;
  }

  private validatePositionSpecificData(playerData: any): number {
    const position = playerData.position;
    let confidence = 1.0;

    // Position-specific validation rules
    const positionRules: { [key: string]: any } = {
      QB: {
        expectedStats: [
          'passing_yards',
          'completions',
          'touchdowns',
          'interceptions',
        ],
        physicalRanges: { height: [68, 78], weight: [190, 250] },
      },
      RB: {
        expectedStats: ['rushing_yards', 'carries', 'touchdowns'],
        physicalRanges: { height: [66, 74], weight: [180, 230] },
      },
      WR: {
        expectedStats: ['receptions', 'receiving_yards', 'touchdowns'],
        physicalRanges: { height: [68, 76], weight: [170, 220] },
      },
      OL: {
        expectedStats: ['games_started', 'snaps'],
        physicalRanges: { height: [72, 80], weight: [280, 350] },
      },
      DL: {
        expectedStats: ['tackles', 'sacks', 'pressures'],
        physicalRanges: { height: [70, 78], weight: [250, 320] },
      },
      LB: {
        expectedStats: ['tackles', 'sacks', 'interceptions'],
        physicalRanges: { height: [70, 76], weight: [220, 260] },
      },
      DB: {
        expectedStats: ['tackles', 'interceptions', 'pass_breakups'],
        physicalRanges: { height: [68, 74], weight: [170, 210] },
      },
    };

    if (positionRules[position]) {
      const rules = positionRules[position];

      // Check if expected stats are present
      if (playerData.stats) {
        const hasExpectedStats = rules.expectedStats.some((stat: string) =>
          this.hasStatInData(playerData.stats, stat)
        );
        if (!hasExpectedStats) {
          confidence *= 0.8;
        }
      }

      // Check physical attributes against position norms
      if (playerData.basicInfo) {
        const height = this.parseHeight(playerData.basicInfo.height);
        const weight = playerData.basicInfo.weight;

        if (height && rules.physicalRanges.height) {
          const [minHeight, maxHeight] = rules.physicalRanges.height;
          if (height < minHeight || height > maxHeight) {
            confidence *= 0.9; // Minor penalty for unusual size
          }
        }

        if (weight && rules.physicalRanges.weight) {
          const [minWeight, maxWeight] = rules.physicalRanges.weight;
          if (weight < minWeight || weight > maxWeight) {
            confidence *= 0.9;
          }
        }
      }
    }

    return confidence;
  }

  private validatePlayerStats(stats: any, position: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // Check for statistical consistency across seasons
    if (stats.career && stats.season2024) {
      const careerTotal = this.extractTotalFromStats(stats.career, position);
      const currentSeason = this.extractTotalFromStats(
        stats.season2024,
        position
      );

      if (currentSeason > careerTotal) {
        result.warnings.push(
          'Current season stats exceed career totals - verify data'
        );
        result.confidence *= 0.7;
      }
    }

    // Position-specific statistical validation
    const positionValidation = this.validatePositionStats(stats, position);
    result.confidence *= positionValidation.confidence;
    result.warnings.push(...positionValidation.warnings);

    return result;
  }

  private validateContractData(contract: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // Salary reasonableness check
    if (contract.salary && typeof contract.salary === 'string') {
      const salary = this.parseSalary(contract.salary);
      if (salary < 500000 || salary > 15000000) {
        result.warnings.push(
          `Salary ${contract.salary} seems unusual for Big 12 coach`
        );
        result.confidence *= 0.8;
      }
    }

    // Contract length validation
    if (contract.length && (contract.length < 1 || contract.length > 10)) {
      result.warnings.push(
        `Contract length ${contract.length} years is unusual`
      );
      result.confidence *= 0.9;
    }

    return result;
  }

  private validateCareerRecord(record: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    if (record.overall_wins && record.overall_losses) {
      const totalGames = record.overall_wins + record.overall_losses;
      const winPercentage = record.overall_wins / totalGames;

      if (winPercentage > 0.9 || winPercentage < 0.1) {
        result.warnings.push(
          `Win percentage ${(winPercentage * 100).toFixed(1)}% is unusual`
        );
        result.confidence *= 0.9;
      }
    }

    return result;
  }

  private validateTenure(
    hireDate: string,
    coachingHistory?: any[]
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    const hire = new Date(hireDate);
    const tenure =
      (new Date().getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (tenure < 0) {
      result.errors.push('Hire date is in the future');
      result.isValid = false;
    }

    if (tenure > 30) {
      result.warnings.push(
        `Tenure of ${tenure.toFixed(1)} years is unusually long`
      );
      result.confidence *= 0.9;
    }

    return result;
  }

  private assessDataCompleteness(
    profile: any,
    type: 'player' | 'coach'
  ): number {
    const requiredFields =
      type === 'player'
        ? this.validationRules.player.required
        : this.validationRules.coach.required;

    const optionalFields =
      type === 'player'
        ? this.validationRules.player.optional
        : this.validationRules.coach.optional;

    let completedRequired = 0;
    let completedOptional = 0;

    // Check required fields
    for (const field of requiredFields) {
      if (profile[field] && profile[field] !== 'Research Required') {
        completedRequired++;
      }
    }

    // Check optional fields
    for (const field of optionalFields) {
      if (this.hasCompleteData(profile, field)) {
        completedOptional++;
      }
    }

    // Weight required fields more heavily
    const requiredScore = (completedRequired / requiredFields.length) * 0.7;
    const optionalScore = (completedOptional / optionalFields.length) * 0.3;

    return requiredScore + optionalScore;
  }

  private identifyResearchOpportunities(
    profile: any,
    type: 'player' | 'coach'
  ): string[] {
    const opportunities: string[] = [];

    if (type === 'player') {
      if (!profile.basicInfo?.hometown) {
        opportunities.push('Research hometown and background');
      }
      if (!profile.stats?.career) {
        opportunities.push('Gather comprehensive career statistics');
      }
      if (!profile.accolades?.length) {
        opportunities.push('Research awards and recognition');
      }
      if (!profile.social_media?.twitter) {
        opportunities.push('Find verified social media accounts');
      }
    } else {
      if (!profile.contract_details?.salary) {
        opportunities.push('Research contract and salary details');
      }
      if (!profile.coaching_history?.length) {
        opportunities.push('Compile complete coaching history');
      }
      if (!profile.family?.spouse) {
        opportunities.push('Research family and personal background');
      }
    }

    return opportunities;
  }

  private async queryMultipleSources(
    profile: any,
    type: 'player' | 'coach'
  ): Promise<any[]> {
    // Simulate querying multiple data sources
    console.log(
      `🔍 Querying ${Object.keys(this.dataSources).length} sources for ${profile.name}`
    );

    const sources = Object.values(this.dataSources);
    const results = [];

    for (const source of sources) {
      // Simulate API delay and response
      await new Promise((resolve) => setTimeout(resolve, 100));

      results.push({
        source: source.name,
        reliability: source.reliability,
        data: this.simulateSourceData(profile, source, type),
      });
    }

    return results;
  }

  private async mergeConflictingData(
    primaryProfile: any,
    sources: any[]
  ): Promise<any> {
    const merged = { ...primaryProfile };
    const conflicts: string[] = [];

    // Weight data by source reliability
    for (const sourceResult of sources) {
      for (const [key, value] of Object.entries(sourceResult.data)) {
        if (merged[key] && merged[key] !== value) {
          conflicts.push(
            `Conflict in ${key}: ${merged[key]} vs ${value} (${sourceResult.source})`
          );

          // Use more reliable source
          if (sourceResult.reliability > 0.8) {
            merged[key] = value;
          }
        } else if (!merged[key]) {
          merged[key] = value;
        }
      }
    }

    merged._dataConflicts = conflicts;
    return merged;
  }

  private identifyDiscrepancies(original: any, sources: any[]): string[] {
    const flags: string[] = [];

    // Check for major discrepancies between sources
    const keyFields = ['name', 'school', 'position', 'height', 'weight'];

    for (const field of keyFields) {
      const values = sources.map((s) => s.data[field]).filter((v) => v);
      const uniqueValues = [...new Set(values)];

      if (uniqueValues.length > 1) {
        flags.push(
          `Multiple values found for ${field}: ${uniqueValues.join(', ')}`
        );
      }
    }

    return flags;
  }

  private generateProfileId(profile: any, type: 'player' | 'coach'): string {
    const cleanName = profile.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const schoolAbbrev = profile.school.replace(/[^a-zA-Z]/g, '').toLowerCase();
    return `${type}_${schoolAbbrev}_${cleanName}_${Date.now()}`;
  }

  private parseHeight(height: string): number {
    // Convert height string like "6'2\"" to inches
    const match = height.match(/(\d+)'(\d+)/);
    if (match) {
      return parseInt(match[1]) * 12 + parseInt(match[2]);
    }
    return 0;
  }

  private parseSalary(salary: string): number {
    // Extract numeric value from salary string
    const match = salary.match(/[\d.]+/);
    if (match) {
      const value = parseFloat(match[0]);
      if (salary.includes('M')) return value * 1000000;
      if (salary.includes('K')) return value * 1000;
      return value;
    }
    return 0;
  }

  private hasStatInData(stats: any, statName: string): boolean {
    // Check if statistic exists in nested stats object
    if (!stats) return false;

    const checkObject = (obj: any): boolean => {
      if (typeof obj !== 'object') return false;

      if (obj[statName] !== undefined) return true;

      for (const value of Object.values(obj)) {
        if (typeof value === 'object' && checkObject(value)) {
          return true;
        }
      }
      return false;
    };

    return checkObject(stats);
  }

  private extractTotalFromStats(stats: any, position: string): number {
    // Extract relevant total for position comparison
    if (!stats) return 0;

    const positionTotals: { [key: string]: string } = {
      QB: 'passing_yards',
      RB: 'rushing_yards',
      WR: 'receiving_yards',
      TE: 'receiving_yards',
    };

    const totalField = positionTotals[position] || 'games';
    return this.extractNestedValue(stats, totalField) || 0;
  }

  private extractNestedValue(obj: any, field: string): any {
    if (!obj || typeof obj !== 'object') return null;

    if (obj[field] !== undefined) return obj[field];

    for (const value of Object.values(obj)) {
      if (typeof value === 'object') {
        const result = this.extractNestedValue(value, field);
        if (result !== null) return result;
      }
    }

    return null;
  }

  private validatePositionStats(
    stats: any,
    position: string
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      confidence: 1.0,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // Position-specific statistical validation
    if (position === 'QB' && stats.passing) {
      const { completions, attempts } = stats.passing;
      if (completions > attempts) {
        result.warnings.push('Completions exceed attempts in passing stats');
        result.confidence *= 0.7;
      }
    }

    return result;
  }

  private hasCompleteData(profile: any, field: string): boolean {
    const value = profile[field];
    return (
      value !== undefined &&
      value !== null &&
      value !== 'Research Required' &&
      value !== ''
    );
  }

  private simulateSourceData(
    profile: any,
    source: DataSource,
    type: 'player' | 'coach'
  ): any {
    // Simulate what different sources might return
    const simulatedData: any = {};

    if (source.dataPoints.includes('stats') && type === 'player') {
      simulatedData.height = `${Math.floor(Math.random() * 3) + 5}'${Math.floor(Math.random() * 12)}"`;
      simulatedData.weight = Math.floor(Math.random() * 100) + 180;
    }

    if (source.dataPoints.includes('bio')) {
      simulatedData.hometown = `${source.name} Research Result`;
    }

    return simulatedData;
  }

  getDataSourceReliability(sourceName: string): number {
    return this.dataSources[sourceName]?.reliability || 0.5;
  }

  getValidationSummary(profiles: ConsolidatedProfile[]): any {
    const summary = {
      total: profiles.length,
      valid: profiles.filter((p) => p.validationResults.isValid).length,
      avgConfidence:
        profiles.reduce((sum, p) => sum + p.confidence, 0) / profiles.length,
      avgCompleteness:
        profiles.reduce((sum, p) => sum + p.completeness, 0) / profiles.length,
      topIssues: this.getTopValidationIssues(profiles),
    };

    return summary;
  }

  private getTopValidationIssues(profiles: ConsolidatedProfile[]): string[] {
    const allIssues = profiles.flatMap((p) => [
      ...p.validationResults.errors,
      ...p.validationResults.warnings,
    ]);

    const issueCounts = allIssues.reduce(
      (counts, issue) => {
        counts[issue] = (counts[issue] || 0) + 1;
        return counts;
      },
      {} as { [key: string]: number }
    );

    return Object.entries(issueCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);
  }
}

export default DataValidationAgent;
