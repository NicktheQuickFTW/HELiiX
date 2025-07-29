'use client';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Badge,
  Icon,
  StatusIndicator,
  Heading,
} from '@once-ui-system/core';
import {
  BasketballGame,
  NewsUpdateEvent,
  GameUpdateEvent,
} from '@/lib/db/basketball-news';
import { formatDistanceToNow } from 'date-fns';

export function LiveUpdates() {
  const [events, setEvents] = useState<any[]>([]);
  const [games, setGames] = useState<Map<string, BasketballGame>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/basketball/live-feed');

    eventSource.addEventListener('connected', () => {
      setConnected(true);
    });

    eventSource.addEventListener('initial', (e) => {
      const data = JSON.parse(e.data);
      if (data.news) {
        setEvents(
          data.news.map((n: any) => ({
            type: 'news',
            data: n,
            timestamp: new Date(),
          }))
        );
      }
    });

    eventSource.addEventListener('news', (e) => {
      const event = JSON.parse(e.data) as NewsUpdateEvent;
      setEvents((prev) =>
        [
          {
            type: 'news',
            data: event.news,
            timestamp: event.timestamp,
          },
          ...prev,
        ].slice(0, 50)
      ); // Keep last 50 events
    });

    eventSource.addEventListener('game', (e) => {
      const event = JSON.parse(e.data) as GameUpdateEvent;
      setGames((prev) => {
        const updated = new Map(prev);
        updated.set(event.game.id, event.game);
        return updated;
      });

      setEvents((prev) =>
        [
          {
            type: 'game',
            data: event.game,
            updateType: event.update_type,
            timestamp: event.timestamp,
          },
          ...prev,
        ].slice(0, 50)
      );
    });

    eventSource.addEventListener('alert', (e) => {
      const alert = JSON.parse(e.data);
      setEvents((prev) =>
        [
          {
            type: 'alert',
            data: alert,
            timestamp: new Date(),
          },
          ...prev,
        ].slice(0, 50)
      );
    });

    eventSource.addEventListener('error', () => {
      setConnected(false);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const liveGames = Array.from(games.values()).filter(
    (g) => g.game_status === 'live'
  );

  return (
    <Column gap="l">
      <Row gap="m" alignItems="center">
        <Heading variant="heading-l">Live Basketball Updates</Heading>
        <StatusIndicator
          color={connected ? 'success' : 'danger'}
          label={connected ? 'Connected' : 'Disconnected'}
        />
      </Row>

      {liveGames.length > 0 && (
        <Column gap="m">
          <Heading variant="heading-m">Live Games</Heading>
          <Row gap="m" wrap>
            {liveGames.map((game) => (
              <Card key={game.id} padding="m" style={{ minWidth: '300px' }}>
                <Column gap="s">
                  <Row
                    gap="m"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text variant="body-strong-m">{game.away_team}</Text>
                    <Text variant="heading-m">
                      {game.current_score?.away || 0}
                    </Text>
                  </Row>
                  <Row
                    gap="m"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text variant="body-strong-m">{game.home_team}</Text>
                    <Text variant="heading-m">
                      {game.current_score?.home || 0}
                    </Text>
                  </Row>
                  <Row gap="s" alignItems="center">
                    <Badge
                      label={game.period || 'Live'}
                      size="s"
                      color="danger"
                    />
                    {game.momentum !== 'neutral' && (
                      <Badge
                        label={`${game.momentum === 'home' ? game.home_team : game.away_team} momentum`}
                        size="s"
                        color="secondary"
                      />
                    )}
                  </Row>
                </Column>
              </Card>
            ))}
          </Row>
        </Column>
      )}

      <Column gap="m">
        <Heading variant="heading-m">Recent Updates</Heading>
        <Column gap="s">
          {events.length === 0 ? (
            <Card padding="l" align="center">
              <Text variant="body-default-s" muted>
                Waiting for live updates...
              </Text>
            </Card>
          ) : (
            events.map((event, index) => (
              <Card key={index} padding="m">
                {event.type === 'alert' && (
                  <Row gap="m" alignItems="start">
                    <Icon name="notification" size="l" color="danger" />
                    <Column gap="xs" style={{ flex: 1 }}>
                      <Badge label="ALERT" color="danger" size="s" />
                      <Text variant="body-default-s">{event.data.text}</Text>
                      <Text variant="body-default-xs" muted>
                        {formatDistanceToNow(new Date(event.timestamp), {
                          addSuffix: true,
                        })}
                      </Text>
                    </Column>
                  </Row>
                )}

                {event.type === 'news' && (
                  <Row gap="m" alignItems="start">
                    <Icon name="article" size="l" />
                    <Column gap="xs" style={{ flex: 1 }}>
                      <Row gap="xs">
                        <Badge
                          label={event.data.category.replace('_', ' ')}
                          size="s"
                          color="secondary"
                        />
                        <Badge
                          label={event.data.priority}
                          size="s"
                          color={
                            event.data.priority === 'high'
                              ? 'danger'
                              : event.data.priority === 'medium'
                                ? 'warning'
                                : 'secondary'
                          }
                        />
                      </Row>
                      <Text variant="body-default-s">{event.data.text}</Text>
                      <Text variant="body-default-xs" muted>
                        @{event.data.author_username} •{' '}
                        {formatDistanceToNow(new Date(event.timestamp), {
                          addSuffix: true,
                        })}
                      </Text>
                    </Column>
                  </Row>
                )}

                {event.type === 'game' && (
                  <Row gap="m" alignItems="start">
                    <Icon name="sports" size="l" color="primary" />
                    <Column gap="xs" style={{ flex: 1 }}>
                      <Badge
                        label={`GAME ${event.updateType.toUpperCase()}`}
                        color="primary"
                        size="s"
                      />
                      <Text variant="body-default-s">
                        {event.data.away_team} @ {event.data.home_team}
                        {event.data.current_score && (
                          <>
                            {' '}
                            - {event.data.current_score.away} -{' '}
                            {event.data.current_score.home}
                          </>
                        )}
                      </Text>
                      {event.data.key_moments.length > 0 && (
                        <Text variant="body-default-xs" muted>
                          {event.data.key_moments[0]}
                        </Text>
                      )}
                    </Column>
                  </Row>
                )}
              </Card>
            ))
          )}
        </Column>
      </Column>
    </Column>
  );
}
