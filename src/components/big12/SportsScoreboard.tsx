'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Badge,
  Button,
  Column,
  Row,
  Text,
  Heading,
  Icon,
  ToggleButton,
} from '@once-ui-system/core';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  RefreshCw,
  MapPin,
  Target,
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
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent');

  const loadSportsData = async () => {
    setLoading(true);
    try {
      const [recent, upcoming] = await Promise.all([
        Big12SportsAPI.getRecentResults(7),
        Big12SportsAPI.getUpcomingGames(14),
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
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: GameResult['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" size="s">
            Final
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="danger" size="s">
            Live
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="surface" size="s">
            Scheduled
          </Badge>
        );
      case 'postponed':
        return (
          <Badge variant="warning" size="s">
            Postponed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" size="s">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="surface" size="s">
            {status}
          </Badge>
        );
    }
  };

  const GameCard = ({ game }: { game: GameResult }) => (
    <Card style={{ marginBottom: '0.75rem' }}>
      <Column gap="m" padding="m">
        <Row justifyContent="space-between" alignItems="center">
          <Row gap="s" alignItems="center">
            <Icon name="trophy" size="s" onBackground="warning" />
            <Text variant="label-strong" style={{ textTransform: 'uppercase' }}>
              {game.sport}
            </Text>
            {game.conferenceGame && (
              <Badge variant="surface" size="s">
                Big 12
              </Badge>
            )}
          </Row>
          {getStatusBadge(game.status)}
        </Row>

        <Row justifyContent="space-around" alignItems="center" gap="l">
          <Column alignItems="center" gap="xs">
            <Text variant="label-strong">{game.awayTeam.name}</Text>
            <Text variant="body-3" onBackground="neutral-weak">
              {game.awayTeam.abbreviation}
            </Text>
            {game.awayTeam.score !== undefined && (
              <Heading variant="3">{game.awayTeam.score}</Heading>
            )}
          </Column>
          <Text variant="body-2" onBackground="neutral-weak">
            vs
          </Text>
          <Column alignItems="center" gap="xs">
            <Text variant="label-strong">{game.homeTeam.name}</Text>
            <Text variant="body-3" onBackground="neutral-weak">
              {game.homeTeam.abbreviation}
            </Text>
            {game.homeTeam.score !== undefined && (
              <Heading variant="3">{game.homeTeam.score}</Heading>
            )}
          </Column>
        </Row>

        <Row justifyContent="space-between" alignItems="center">
          <Row gap="xs" alignItems="center">
            <Icon name="calendar" size="s" onBackground="neutral-weak" />
            <Text variant="body-3" onBackground="neutral-weak">
              {formatGameTime(game.date)}
            </Text>
          </Row>
          {game.venue && (
            <Row gap="xs" alignItems="center">
              <Icon name="mapPin" size="s" onBackground="neutral-weak" />
              <Text
                variant="body-3"
                onBackground="neutral-weak"
                style={{
                  maxWidth: '150px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {game.venue}
              </Text>
            </Row>
          )}
          {game.week && (
            <Row gap="xs" alignItems="center">
              <Icon name="target" size="s" onBackground="neutral-weak" />
              <Text variant="body-3" onBackground="neutral-weak">
                Week {game.week}
              </Text>
            </Row>
          )}
        </Row>
      </Column>
    </Card>
  );

  if (loading) {
    return (
      <Card className={className}>
        <Column gap="m" padding="l" alignItems="center">
          <Row gap="s" alignItems="center">
            <Icon name="trophy" size="m" onBackground="warning" />
            <Heading variant="4">Big 12 Sports</Heading>
          </Row>
          <Row alignItems="center" gap="s" padding="xl">
            <Icon name="loader" size="m" />
            <Text variant="body-2" onBackground="neutral-weak">
              Loading sports data...
            </Text>
          </Row>
        </Column>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Column gap="l" padding="l">
        <Row justifyContent="space-between" alignItems="center">
          <Column gap="xs">
            <Row gap="s" alignItems="center">
              <Icon name="trophy" size="m" onBackground="warning" />
              <Heading variant="4">Big 12 Sports</Heading>
            </Row>
            <Text variant="body-2" onBackground="neutral-weak">
              Live scores and upcoming games across all Big 12 sports
            </Text>
          </Column>
          <Button
            variant="secondary"
            size="s"
            onClick={loadSportsData}
            disabled={loading}
          >
            <Icon name="refresh" size="s" />
            Refresh
          </Button>
        </Row>

        {lastUpdated && (
          <Text variant="body-3" onBackground="neutral-weak">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}

        {/* Tab buttons */}
        <Row gap="m">
          <ToggleButton
            selected={activeTab === 'recent'}
            onClick={() => setActiveTab('recent')}
          >
            Recent Results
          </ToggleButton>
          <ToggleButton
            selected={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Games
          </ToggleButton>
        </Row>

        {/* Tab content */}
        {activeTab === 'recent' &&
          (recentResults.length > 0 ? (
            <Column gap="s" style={{ maxHeight: '24rem', overflowY: 'auto' }}>
              {recentResults.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </Column>
          ) : (
            <Column alignItems="center" padding="xl">
              <Icon name="clock" size="l" onBackground="neutral-weak" />
              <Text variant="body-2" onBackground="neutral-weak">
                No recent games found
              </Text>
            </Column>
          ))}

        {activeTab === 'upcoming' &&
          (upcomingGames.length > 0 ? (
            <Column gap="s" style={{ maxHeight: '24rem', overflowY: 'auto' }}>
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </Column>
          ) : (
            <Column alignItems="center" padding="xl">
              <Icon name="users" size="l" onBackground="neutral-weak" />
              <Text variant="body-2" onBackground="neutral-weak">
                No upcoming games scheduled
              </Text>
            </Column>
          ))}
      </Column>
    </Card>
  );
}
