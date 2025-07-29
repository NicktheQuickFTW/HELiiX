/**
 * API Route for Big 12 Media Day Profile Generation
 * Triggers the research agents to build comprehensive player and coach profiles
 */

import { NextRequest, NextResponse } from 'next/server';
import ProfileOrchestrator from '@/lib/agents/media-day/profile-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      type = 'all', // 'all', 'players', 'coaches'
      config = {},
      schools = [],
      positions = [],
    } = body;

    console.log(`🚀 Starting profile generation for: ${type}`);
    console.log(`📋 Config:`, config);

    // Initialize orchestrator with configuration
    const orchestrator = new ProfileOrchestrator({
      enableParallelProcessing: true,
      maxConcurrentRequests: 3, // Conservative for API usage
      includeDetailedValidation: true,
      outputFormat: 'json',
      saveToFiles: false,
      enableProgressTracking: true,
      ...config,
    });

    let result;

    switch (type) {
      case 'players':
        console.log('👥 Generating player profiles only');
        const players = await orchestrator.generatePlayerProfilesOnly();
        result = {
          players: filterBySchoolsAndPositions(players, schools, positions),
          coaches: [],
          type: 'players',
        };
        break;

      case 'coaches':
        console.log('👔 Generating coach profiles only');
        const coaches = await orchestrator.generateCoachProfilesOnly();
        result = {
          players: [],
          coaches: filterBySchools(coaches, schools),
          type: 'coaches',
        };
        break;

      case 'all':
      default:
        console.log('🏈 Generating all profiles');
        const fullResult = await orchestrator.generateAllProfiles();
        result = {
          ...fullResult,
          players: filterBySchoolsAndPositions(
            fullResult.players,
            schools,
            positions
          ),
          coaches: filterBySchools(fullResult.coaches, schools),
          type: 'all',
        };
        break;
    }

    console.log(`✅ Profile generation completed`);
    console.log(
      `📊 Generated ${result.players.length} players, ${result.coaches.length} coaches`
    );

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error generating profiles:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate profiles',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'stats';

    const orchestrator = new ProfileOrchestrator();

    switch (action) {
      case 'stats':
        const stats = await orchestrator.getProfileStatistics();
        return NextResponse.json({
          success: true,
          data: stats,
          timestamp: new Date().toISOString(),
        });

      case 'config':
        const config = orchestrator.getConfig();
        return NextResponse.json({
          success: true,
          data: { config },
          timestamp: new Date().toISOString(),
        });

      case 'sources':
        return NextResponse.json({
          success: true,
          data: {
            sources: [
              'ESPN College Football',
              'Sports Reference',
              'School Athletics Websites',
              'Big 12 Sports Official',
              'Recruiting Networks (247Sports, Rivals)',
              'Social Media Platforms',
              'USA Today Salary Database',
              'Conference Record Books',
            ],
          },
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action parameter',
            availableActions: ['stats', 'config', 'sources'],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Error in GET request:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function filterBySchoolsAndPositions(
  profiles: any[],
  schools: string[],
  positions: string[]
): any[] {
  let filtered = profiles;

  if (schools.length > 0) {
    filtered = filtered.filter((profile) => schools.includes(profile.school));
  }

  if (positions.length > 0) {
    filtered = filtered.filter((profile) =>
      positions.includes(profile.position)
    );
  }

  return filtered;
}

function filterBySchools(profiles: any[], schools: string[]): any[] {
  if (schools.length === 0) return profiles;

  return profiles.filter((profile) => schools.includes(profile.school));
}
