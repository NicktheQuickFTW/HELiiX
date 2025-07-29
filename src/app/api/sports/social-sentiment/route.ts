import { NextRequest, NextResponse } from 'next/server';
import { realtimeService } from '@/lib/realtime-service';
import { BIG12_TEAMS } from '@/lib/big12-schools';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const team = searchParams.get('team') as keyof typeof BIG12_TEAMS;

    if (!team) {
      return NextResponse.json(
        { error: 'Team parameter is required' },
        { status: 400 }
      );
    }

    const data = await realtimeService.getTeamSentiment(team);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching team sentiment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team sentiment' },
      { status: 500 }
    );
  }
}
