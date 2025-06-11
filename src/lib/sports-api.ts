/**
 * Sports API Integration for Big 12 Conference
 * Supports ESPN API and NCAA API for game results, schedules, and standings
 */

// Big 12 team mappings for ESPN API
export const BIG12_TEAMS = {
  // ESPN team IDs for Big 12 schools
  ARIZONA: '12',
  ARIZONA_STATE: '9',
  BAYLOR: '239',
  BYU: '252',
  CINCINNATI: '2132',
  COLORADO: '38',
  HOUSTON: '248',
  IOWA_STATE: '66',
  KANSAS: '2305',
  KANSAS_STATE: '2306',
  OKLAHOMA_STATE: '197',
  TCU: '2628',
  TEXAS_TECH: '2641',
  UCF: '2116',
  UTAH: '254',
  WEST_VIRGINIA: '277'
} as const;

export const BIG12_CONFERENCE_ID = '4'; // ESPN Big 12 Conference ID

// API Configuration
const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';
const NCAA_BASE_URL = 'https://ncaa-api.henrygd.me';

export interface GameResult {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    abbreviation: string;
    score?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    abbreviation: string;
    score?: number;
  };
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'cancelled';
  sport: string;
  season: string;
  week?: number;
  venue?: string;
  conferenceGame: boolean;
}

export interface TeamSchedule {
  teamId: string;
  teamName: string;
  games: GameResult[];
  season: string;
}

export interface ConferenceStandings {
  conference: string;
  sport: string;
  season: string;
  teams: Array<{
    teamId: string;
    teamName: string;
    conferenceRecord: string;
    overallRecord: string;
    rank?: number;
  }>;
}

/**
 * ESPN API Integration
 */
export class ESPNSportsAPI {
  /**
   * Get Big 12 Conference scoreboard for a specific sport and date range
   */
  static async getConferenceScoreboard(
    sport: 'football' | 'basketball', 
    dates: string, // Format: YYYYMMDD-YYYYMMDD
    gender?: 'mens' | 'womens'
  ): Promise<GameResult[]> {
    const sportPath = sport === 'football' 
      ? 'football/college-football'
      : `basketball/${gender || 'mens'}-college-basketball`;
    
    const url = `${ESPN_BASE_URL}/${sportPath}/scoreboard?dates=${dates}&groups=${BIG12_CONFERENCE_ID}&limit=500`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`ESPN API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseESPNScoreboard(data, sport);
    } catch (error) {
      console.error('Error fetching ESPN scoreboard:', error);
      throw error;
    }
  }

  /**
   * Get team schedule for a Big 12 school
   */
  static async getTeamSchedule(
    teamKey: keyof typeof BIG12_TEAMS,
    sport: 'football' | 'basketball',
    season: string,
    gender?: 'mens' | 'womens'
  ): Promise<TeamSchedule> {
    const teamId = BIG12_TEAMS[teamKey];
    const sportPath = sport === 'football' 
      ? 'football/college-football'
      : `basketball/${gender || 'mens'}-college-basketball`;
    
    const url = `${ESPN_BASE_URL}/${sportPath}/teams/${teamId}/schedule?season=${season}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`ESPN API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseESPNSchedule(data, sport, teamKey);
    } catch (error) {
      console.error('Error fetching team schedule:', error);
      throw error;
    }
  }

  /**
   * Get Big 12 Conference standings
   */
  static async getConferenceStandings(
    sport: 'football' | 'basketball',
    season: string,
    gender?: 'mens' | 'womens'
  ): Promise<ConferenceStandings> {
    const sportPath = sport === 'football' 
      ? 'football/college-football'
      : `basketball/${gender || 'mens'}-college-basketball`;
    
    const url = `${ESPN_BASE_URL}/${sportPath}/standings?season=${season}&group=${BIG12_CONFERENCE_ID}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`ESPN API error: ${response.status}`);
      
      const data = await response.json();
      return this.parseESPNStandings(data, sport, season);
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  }

  private static parseESPNScoreboard(data: any, sport: string): GameResult[] {
    return data.events?.map((event: any) => ({
      id: event.id,
      homeTeam: {
        id: event.competitions[0].competitors[0].team.id,
        name: event.competitions[0].competitors[0].team.displayName,
        abbreviation: event.competitions[0].competitors[0].team.abbreviation,
        score: event.competitions[0].competitors[0].score ? parseInt(event.competitions[0].competitors[0].score) : undefined
      },
      awayTeam: {
        id: event.competitions[0].competitors[1].team.id,
        name: event.competitions[0].competitors[1].team.displayName,
        abbreviation: event.competitions[0].competitors[1].team.abbreviation,
        score: event.competitions[0].competitors[1].score ? parseInt(event.competitions[0].competitors[1].score) : undefined
      },
      date: event.date,
      status: this.mapESPNStatus(event.status.type.name),
      sport,
      season: event.season?.year || new Date().getFullYear().toString(),
      week: event.week?.number,
      venue: event.competitions[0].venue?.fullName,
      conferenceGame: event.competitions[0].conferenceCompetition || false
    })) || [];
  }

  private static parseESPNSchedule(data: any, sport: string, teamKey: string): TeamSchedule {
    const team = data.team;
    const events = data.events || [];
    
    return {
      teamId: team.id,
      teamName: team.displayName,
      season: events[0]?.season?.year || new Date().getFullYear().toString(),
      games: events.map((event: any) => ({
        id: event.id,
        homeTeam: {
          id: event.competitions[0].competitors[0].team.id,
          name: event.competitions[0].competitors[0].team.displayName,
          abbreviation: event.competitions[0].competitors[0].team.abbreviation,
          score: event.competitions[0].competitors[0].score ? parseInt(event.competitions[0].competitors[0].score) : undefined
        },
        awayTeam: {
          id: event.competitions[0].competitors[1].team.id,
          name: event.competitions[0].competitors[1].team.displayName,
          abbreviation: event.competitions[0].competitors[1].team.abbreviation,
          score: event.competitions[0].competitors[1].score ? parseInt(event.competitions[0].competitors[1].score) : undefined
        },
        date: event.date,
        status: this.mapESPNStatus(event.status.type.name),
        sport,
        season: event.season?.year || new Date().getFullYear().toString(),
        week: event.week?.number,
        venue: event.competitions[0].venue?.fullName,
        conferenceGame: event.competitions[0].conferenceCompetition || false
      }))
    };
  }

  private static parseESPNStandings(data: any, sport: string, season: string): ConferenceStandings {
    const standings = data.children?.[0]?.standings?.entries || [];
    
    return {
      conference: 'Big 12',
      sport,
      season,
      teams: standings.map((entry: any) => ({
        teamId: entry.team.id,
        teamName: entry.team.displayName,
        conferenceRecord: entry.stats?.find((s: any) => s.name === 'conferenceRecord')?.displayValue || '0-0',
        overallRecord: entry.stats?.find((s: any) => s.name === 'overall')?.displayValue || '0-0',
        rank: entry.stats?.find((s: any) => s.name === 'rank')?.value
      }))
    };
  }

  private static mapESPNStatus(espnStatus: string): GameResult['status'] {
    switch (espnStatus.toLowerCase()) {
      case 'status_scheduled':
      case 'pre':
        return 'scheduled';
      case 'status_in_progress':
      case 'in':
        return 'in_progress';
      case 'status_final':
      case 'final':
        return 'completed';
      case 'status_postponed':
        return 'postponed';
      case 'status_cancelled':
        return 'cancelled';
      default:
        return 'scheduled';
    }
  }
}

/**
 * NCAA API Integration (future expansion)
 */
export class NCAASportsAPI {
  /**
   * Get NCAA scoreboard data
   */
  static async getScoreboard(
    sport: string,
    division: string,
    year: string,
    date: string
  ): Promise<GameResult[]> {
    const url = `${NCAA_BASE_URL}/scoreboard/${sport}/${division}/${year}/${date}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`NCAA API error: ${response.status}`);
      
      const data = await response.json();
      // TODO: Parse NCAA response format
      return [];
    } catch (error) {
      console.error('Error fetching NCAA scoreboard:', error);
      throw error;
    }
  }

  /**
   * Get NCAA schedule data
   */
  static async getSchedule(
    sport: string,
    division: string,
    year: string,
    month: string
  ): Promise<GameResult[]> {
    const url = `${NCAA_BASE_URL}/schedule/${sport}/${division}/${year}/${month}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`NCAA API error: ${response.status}`);
      
      const data = await response.json();
      // TODO: Parse NCAA response format and filter for Big 12
      return [];
    } catch (error) {
      console.error('Error fetching NCAA schedule:', error);
      throw error;
    }
  }
}

/**
 * Unified Sports API - combines ESPN and NCAA sources
 */
export class Big12SportsAPI {
  /**
   * Get recent Big 12 game results across all sports
   */
  static async getRecentResults(daysBack: number = 7): Promise<GameResult[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    const dateRange = `${this.formatDate(startDate)}-${this.formatDate(endDate)}`;
    
    try {
      // Get results for major sports
      const [footballResults, mensBBResults, womensBBResults] = await Promise.allSettled([
        ESPNSportsAPI.getConferenceScoreboard('football', dateRange),
        ESPNSportsAPI.getConferenceScoreboard('basketball', dateRange, 'mens'),
        ESPNSportsAPI.getConferenceScoreboard('basketball', dateRange, 'womens')
      ]);

      const allResults: GameResult[] = [];
      
      if (footballResults.status === 'fulfilled') allResults.push(...footballResults.value);
      if (mensBBResults.status === 'fulfilled') allResults.push(...mensBBResults.value);
      if (womensBBResults.status === 'fulfilled') allResults.push(...womensBBResults.value);

      return allResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching recent results:', error);
      return [];
    }
  }

  /**
   * Get upcoming Big 12 games
   */
  static async getUpcomingGames(daysAhead: number = 14): Promise<GameResult[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);
    
    const dateRange = `${this.formatDate(startDate)}-${this.formatDate(endDate)}`;
    
    try {
      const [footballGames, mensBBGames, womensBBGames] = await Promise.allSettled([
        ESPNSportsAPI.getConferenceScoreboard('football', dateRange),
        ESPNSportsAPI.getConferenceScoreboard('basketball', dateRange, 'mens'),
        ESPNSportsAPI.getConferenceScoreboard('basketball', dateRange, 'womens')
      ]);

      const allGames: GameResult[] = [];
      
      if (footballGames.status === 'fulfilled') allGames.push(...footballGames.value);
      if (mensBBGames.status === 'fulfilled') allGames.push(...mensBBGames.value);
      if (womensBBGames.status === 'fulfilled') allGames.push(...womensBBGames.value);

      return allGames
        .filter(game => game.status === 'scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('Error fetching upcoming games:', error);
      return [];
    }
  }

  private static formatDate(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }
}

export default Big12SportsAPI;