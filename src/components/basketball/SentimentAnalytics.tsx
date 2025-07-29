'use client';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Heading,
  Badge,
  StatusIndicator,
  Icon,
  Grid,
} from '@once-ui-system/core';
import { TeamSentiment } from '@/lib/db/basketball-news';

const TEAMS = [
  'Arizona',
  'Arizona State',
  'Baylor',
  'BYU',
  'Cincinnati',
  'Colorado',
  'Houston',
  'Iowa State',
  'Kansas',
  'Kansas State',
  'Oklahoma State',
  'TCU',
  'Texas Tech',
  'UCF',
  'Utah',
  'West Virginia',
];

export function SentimentAnalytics() {
  const [sentiments, setSentiments] = useState<Map<string, TeamSentiment>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentiments();
    const interval = setInterval(fetchSentiments, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSentiments = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from an API
      // For now, generate mock data
      const mockSentiments = generateMockSentiments();
      setSentiments(mockSentiments);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (score: number): string => {
    if (score > 0.5) return 'success';
    if (score > 0.2) return 'secondary';
    if (score < -0.5) return 'danger';
    if (score < -0.2) return 'warning';
    return 'neutral';
  };

  const getSentimentEmoji = (score: number): string => {
    if (score > 0.5) return '😊';
    if (score > 0.2) return '🙂';
    if (score < -0.5) return '😟';
    if (score < -0.2) return '😐';
    return '😶';
  };

  const getTrendIcon = (trend: string): string => {
    if (trend === 'improving') return 'trendingUp';
    if (trend === 'declining') return 'trendingDown';
    return 'remove';
  };

  return (
    <Column gap="l">
      <Row gap="m" alignItems="center">
        <Heading variant="heading-l">Team Sentiment Analysis</Heading>
        {loading && <StatusIndicator color="primary" />}
      </Row>

      <Grid columns="repeat(auto-fill, minmax(300px, 1fr))" gap="m">
        {TEAMS.map((team) => {
          const sentiment = sentiments.get(team);
          if (!sentiment) {
            return (
              <Card key={team} padding="m" align="center">
                <Text variant="body-default-s" muted>
                  No data for {team}
                </Text>
              </Card>
            );
          }

          return (
            <Card key={team} padding="m">
              <Column gap="m">
                <Row gap="m" alignItems="center" justifyContent="space-between">
                  <Text variant="heading-m">{team}</Text>
                  <Text variant="heading-l">
                    {getSentimentEmoji(sentiment.sentiment_score)}
                  </Text>
                </Row>

                <Row gap="s" alignItems="center">
                  <Badge
                    label={`${(sentiment.sentiment_score * 100).toFixed(0)}%`}
                    color={getSentimentColor(sentiment.sentiment_score)}
                    size="m"
                  />
                  <Icon
                    name={getTrendIcon(sentiment.sentiment_trend)}
                    size="s"
                    color={
                      sentiment.sentiment_trend === 'improving'
                        ? 'success'
                        : sentiment.sentiment_trend === 'declining'
                          ? 'danger'
                          : 'neutral'
                    }
                  />
                  <Text variant="body-default-xs" muted>
                    {sentiment.sentiment_trend}
                  </Text>
                </Row>

                <Column gap="xs">
                  <Row gap="m" justifyContent="space-between">
                    <Text variant="body-default-xs" muted>
                      Tweet Volume
                    </Text>
                    <Text variant="body-default-s">
                      {sentiment.tweet_volume}
                    </Text>
                  </Row>
                  <Row gap="m" justifyContent="space-between">
                    <Text variant="body-default-xs" muted>
                      Engagement
                    </Text>
                    <Text variant="body-default-s">
                      {sentiment.average_engagement_per_tweet.toFixed(0)} avg
                    </Text>
                  </Row>
                </Column>

                {sentiment.positive_topics.length > 0 && (
                  <Column gap="xs">
                    <Text variant="body-default-xs" muted>
                      Positive Topics:
                    </Text>
                    <Row gap="xs" wrap>
                      {sentiment.positive_topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={topic}
                          label={topic}
                          size="xs"
                          color="success"
                        />
                      ))}
                    </Row>
                  </Column>
                )}

                {sentiment.negative_topics.length > 0 && (
                  <Column gap="xs">
                    <Text variant="body-default-xs" muted>
                      Concerns:
                    </Text>
                    <Row gap="xs" wrap>
                      {sentiment.negative_topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={topic}
                          label={topic}
                          size="xs"
                          color="danger"
                        />
                      ))}
                    </Row>
                  </Column>
                )}
              </Column>
            </Card>
          );
        })}
      </Grid>
    </Column>
  );
}

function generateMockSentiments(): Map<string, TeamSentiment> {
  const sentiments = new Map<string, TeamSentiment>();

  const mockTopics = {
    positive: [
      'winning streak',
      'great defense',
      'player development',
      'tournament bound',
      'coach of year',
    ],
    negative: [
      'injuries',
      'poor shooting',
      'turnovers',
      'losing streak',
      'tough schedule',
    ],
    neutral: ['recruiting', 'practice', 'game preview', 'stats', 'rankings'],
  };

  TEAMS.forEach((team) => {
    const score = Math.random() * 2 - 1; // -1 to 1
    const volume = Math.floor(Math.random() * 200) + 50;

    sentiments.set(team, {
      id: `sentiment_${team}_${Date.now()}`,
      team_name: team,
      date: new Date(),
      sentiment_score: score,
      sentiment_trend:
        score > 0.3 ? 'improving' : score < -0.3 ? 'declining' : 'stable',
      tweet_volume: volume,
      positive_topics: mockTopics.positive.slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
      negative_topics:
        score < 0
          ? mockTopics.negative.slice(0, Math.floor(Math.random() * 2) + 1)
          : [],
      neutral_topics: mockTopics.neutral.slice(0, 2),
      total_engagement: volume * Math.floor(Math.random() * 100) + 100,
      average_engagement_per_tweet: Math.floor(Math.random() * 50) + 10,
      hourly_sentiment: {},
      peak_activity_hour: Math.floor(Math.random() * 24),
    });
  });

  return sentiments;
}
