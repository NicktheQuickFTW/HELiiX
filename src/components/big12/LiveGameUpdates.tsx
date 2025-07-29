'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Heading,
  Badge,
  Button,
  Icon,
  StatusIndicator,
} from '@once-ui-system/core';
import {
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  Users,
  Zap,
} from 'lucide-react';
import { realtimeService, RealtimeUpdate } from '@/lib/realtime-service';
import { GameResult } from '@/lib/sports-api';
import { formatDistanceToNow } from 'date-fns';

interface LiveGameUpdatesProps {
  game: GameResult;
  showSocialFeed?: boolean;
  maxHeight?: string;
}

export function LiveGameUpdates({
  game,
  showSocialFeed = true,
  maxHeight = '500px',
}: LiveGameUpdatesProps) {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [socialSentiment, setSocialSentiment] = useState<{
    positive: number;
    negative: number;
    neutral: number;
    engagement: number;
  } | null>(null);

  // Subscribe to live updates
  useEffect(() => {
    if (!game || game.status !== 'in_progress') return;

    const subscriptionId = `game-${game.id}`;

    const unsubscribe = realtimeService.subscribe({
      id: subscriptionId,
      type: 'game',
      callback: (update) => {
        setUpdates((prev) => [update, ...prev].slice(0, 50)); // Keep last 50 updates
      },
    });

    setIsSubscribed(true);

    // Start realtime service if not already running
    realtimeService.start();

    return () => {
      unsubscribe();
      setIsSubscribed(false);
    };
  }, [game]);

  // Fetch initial updates and sentiment
  useEffect(() => {
    if (!game) return;

    const fetchInitialData = async () => {
      try {
        // This would fetch from the actual game updates
        // For now, we'll simulate with empty data
        const homeTeamKey = game.homeTeam.name.toUpperCase().replace(' ', '_');
        const awayTeamKey = game.awayTeam.name.toUpperCase().replace(' ', '_');

        const response = await fetch(
          `/api/sports/social-sentiment?team=${homeTeamKey}`
        );

        if (response.ok) {
          const data = await response.json();
          setSocialSentiment(data.sentiment);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [game]);

  const getPriorityColor = (priority: RealtimeUpdate['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  const renderUpdate = (update: RealtimeUpdate) => {
    const isScore = update.type === 'score';
    const isSocial = update.type === 'social';

    return (
      <Card key={update.id} style={{ marginBottom: '0.75rem' }}>
        <Row gap="m" alignItems="flex-start">
          {/* Priority indicator */}
          <StatusIndicator
            variant={getPriorityColor(update.priority)}
            size="s"
          />

          {/* Update content */}
          <Column gap="xs" fillWidth>
            <Row justifyContent="space-between" alignItems="center">
              <Row gap="s" alignItems="center">
                <Badge variant="surface" size="s">
                  {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                </Badge>
                <Text variant="body-3" onBackground="neutral-weak">
                  {formatDistanceToNow(update.timestamp, { addSuffix: true })}
                </Text>
              </Row>
            </Row>

            {isSocial && update.data && (
              <Column gap="xs">
                <Text variant="body-2">{update.data.text}</Text>
                <Row gap="m">
                  <Text variant="body-3" onBackground="neutral-weak">
                    @{update.data.author_username}
                  </Text>
                  <Row gap="xs" alignItems="center">
                    <Icon name="heart" size="s" onBackground="neutral-weak" />
                    <Text variant="body-3" onBackground="neutral-weak">
                      {update.data.public_metrics.like_count}
                    </Text>
                  </Row>
                </Row>
              </Column>
            )}

            {isScore && (
              <Column gap="s">
                <Heading variant="5">Score Update</Heading>
                <Row gap="l">
                  <Text variant="body-1">
                    {game.awayTeam.name}: {game.awayTeam.score}
                  </Text>
                  <Text variant="body-1">
                    {game.homeTeam.name}: {game.homeTeam.score}
                  </Text>
                </Row>
              </Column>
            )}
          </Column>
        </Row>
      </Card>
    );
  };

  return (
    <Column gap="l" fillWidth>
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="3">Live Updates</Heading>
          <Text variant="body-2" onBackground="neutral-weak">
            {game.awayTeam.name} vs {game.homeTeam.name}
          </Text>
        </Column>
        <Row gap="s" alignItems="center">
          {isSubscribed && (
            <Badge variant="success" size="s">
              <Row gap="xs" alignItems="center">
                <StatusIndicator variant="success" size="s" />
                Live
              </Row>
            </Badge>
          )}
        </Row>
      </Row>

      {/* Social sentiment */}
      {socialSentiment && showSocialFeed && (
        <Card variant="surface">
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="label-default">Fan Sentiment</Text>
            <Row gap="m">
              <Column alignItems="center" gap="xs">
                <Text variant="body-3" onBackground="success">
                  {socialSentiment.positive}%
                </Text>
                <Text variant="body-3" onBackground="neutral-weak">
                  Positive
                </Text>
              </Column>
              <Column alignItems="center" gap="xs">
                <Text variant="body-3" onBackground="neutral">
                  {socialSentiment.neutral}%
                </Text>
                <Text variant="body-3" onBackground="neutral-weak">
                  Neutral
                </Text>
              </Column>
              <Column alignItems="center" gap="xs">
                <Text variant="body-3" onBackground="danger">
                  {socialSentiment.negative}%
                </Text>
                <Text variant="body-3" onBackground="neutral-weak">
                  Negative
                </Text>
              </Column>
            </Row>
          </Row>
        </Card>
      )}

      {/* Updates feed */}
      <Column
        gap="s"
        style={{
          maxHeight,
          overflowY: 'auto',
          paddingRight: '0.5rem',
        }}
      >
        {updates.length === 0 ? (
          <Card variant="surface">
            <Column alignItems="center" padding="xl" gap="m">
              <Icon name="activity" size="l" onBackground="neutral-weak" />
              <Text variant="body-2" onBackground="neutral-weak">
                {game.status === 'in_progress'
                  ? 'Waiting for live updates...'
                  : 'No updates available for this game'}
              </Text>
            </Column>
          </Card>
        ) : (
          updates.map(renderUpdate)
        )}
      </Column>
    </Column>
  );
}
