import { NextRequest, NextResponse } from 'next/server';
import { XAPIClient } from '@/lib/x-api';
import { BIG12_TEAMS } from '@/lib/big12-schools';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const homeTeam = searchParams.get('homeTeam') as keyof typeof BIG12_TEAMS;
    const awayTeam = searchParams.get('awayTeam') as keyof typeof BIG12_TEAMS;
    const sport = searchParams.get('sport') as 'football' | 'basketball';

    if (!homeTeam || !awayTeam || !sport) {
      return NextResponse.json(
        { error: 'Missing required parameters: homeTeam, awayTeam, sport' },
        { status: 400 }
      );
    }

    const xClient = new XAPIClient();
    const updates = await xClient.getLiveGameUpdates(homeTeam, awayTeam, sport);

    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Error fetching live updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live updates' },
      { status: 500 }
    );
  }
}
