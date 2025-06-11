'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users,
  RefreshCw,
  MapPin,
  Target
} from 'lucide-react';
import { Big12SportsAPI, GameResult } from '@/lib/sports-api';

interface SportsScoreboardProps {
  className?: string;
}

export function SportsScoreboard({ className }: SportsScoreboardProps) {
  const [recentResults, setRecentResults] = useState<GameResult[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadSportsData = async () => {
    setLoading(true);
    try {
      const [recent, upcoming] = await Promise.all([
        Big12SportsAPI.getRecentResults(7),
        Big12SportsAPI.getUpcomingGames(14)
      ]);
      
      setRecentResults(recent);
      setUpcomingGames(upcoming);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading sports data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSportsData();
  }, []);

  const formatGameTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: GameResult['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Final</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-red-100 text-red-800 animate-pulse">Live</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'postponed':
        return <Badge variant="secondary">Postponed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const GameCard = ({ game }: { game: GameResult }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-sm">{game.sport.toUpperCase()}</span>
            {game.conferenceGame && (
              <Badge variant="outline" className="text-xs">Big 12</Badge>
            )}
          </div>
          {getStatusBadge(game.status)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <p className="font-semibold">{game.awayTeam.name}</p>
            <p className="text-sm text-muted-foreground">{game.awayTeam.abbreviation}</p>
            {game.awayTeam.score !== undefined && (
              <p className="text-2xl font-bold">{game.awayTeam.score}</p>
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold">{game.homeTeam.name}</p>
            <p className="text-sm text-muted-foreground">{game.homeTeam.abbreviation}</p>
            {game.homeTeam.score !== undefined && (
              <p className="text-2xl font-bold">{game.homeTeam.score}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatGameTime(game.date)}</span>
          </div>
          {game.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-32">{game.venue}</span>
            </div>
          )}
          {game.week && (
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>Week {game.week}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Big 12 Sports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading sports data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Big 12 Sports
            </CardTitle>
            <CardDescription>
              Live scores and upcoming games across all Big 12 sports
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadSportsData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Results</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-4">
            {recentResults.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentResults.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent games found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            {upcomingGames.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {upcomingGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No upcoming games scheduled</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}