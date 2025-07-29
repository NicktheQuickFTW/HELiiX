'use client';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Heading,
  Badge,
  Icon,
  Dropdown,
  Option,
  Grid,
  StatusIndicator,
} from '@once-ui-system/core';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  MessageCircle,
  Users,
  Activity,
} from 'lucide-react';
import { BIG12_TEAMS } from '@/lib/big12-schools';

interface TeamSentiment {
  team: string;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    engagement: number;
  };
  trend: 'up' | 'down' | 'stable';
  topHashtags: string[];
}

interface SocialSentimentProps {
  teams?: Array<keyof typeof BIG12_TEAMS>;
  showComparison?: boolean;
}

export function SocialSentiment({
  teams = [],
  showComparison = true,
}: SocialSentimentProps) {
  const [selectedTeams, setSelectedTeams] =
    useState<Array<keyof typeof BIG12_TEAMS>>(teams);
  const [sentimentData, setSentimentData] = useState<TeamSentiment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTeams.length > 0) {
      fetchSentimentData();
    }
  }, [selectedTeams]);

  const fetchSentimentData = async () => {
    setLoading(true);
    try {
      const data = await Promise.all(
        selectedTeams.map(async (team) => {
          const response = await fetch(
            `/api/sports/social-sentiment?team=${team}`
          );
          const result = await response.json();

          // Calculate trend (mock for now)
          const trend =
            result.sentiment.positive > 60
              ? 'up'
              : result.sentiment.negative > 40
                ? 'down'
                : 'stable';

          // Extract top hashtags from recent posts
          const hashtags = new Set<string>();
          result.recentPosts?.forEach((post: any) => {
            post.entities?.hashtags?.forEach((tag: any) => {
              hashtags.add(tag.tag);
            });
          });

          return {
            team,
            sentiment: result.sentiment,
            trend,
            topHashtags: Array.from(hashtags).slice(0, 5),
          };
        })
      );

      setSentimentData(data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: TeamSentiment['sentiment']) => {
    if (sentiment.positive > 60) return 'success';
    if (sentiment.negative > 40) return 'danger';
    return 'neutral';
  };

  const getTrendIcon = (trend: TeamSentiment['trend']) => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  const renderSentimentCard = (data: TeamSentiment) => (
    <Card key={data.team}>
      <Column gap="m">
        {/* Team header */}
        <Row justifyContent="space-between" alignItems="center">
          <Heading variant="5">{data.team.replace(/_/g, ' ')}</Heading>
          <Icon
            name={getTrendIcon(data.trend)}
            size="m"
            onBackground={
              data.trend === 'up'
                ? 'success'
                : data.trend === 'down'
                  ? 'danger'
                  : 'neutral'
            }
          />
        </Row>

        {/* Sentiment bars */}
        <Column gap="s">
          <Row justifyContent="space-between" alignItems="center">
            <Text variant="body-3">Sentiment Overview</Text>
            <StatusIndicator
              variant={getSentimentColor(data.sentiment)}
              size="s"
            />
          </Row>

          <div
            style={{
              display: 'flex',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: 'var(--neutral-alpha-weak)',
            }}
          >
            <div
              style={{
                width: `${data.sentiment.positive}%`,
                backgroundColor: 'var(--success-strong)',
              }}
            />
            <div
              style={{
                width: `${data.sentiment.neutral}%`,
                backgroundColor: 'var(--neutral-medium)',
              }}
            />
            <div
              style={{
                width: `${data.sentiment.negative}%`,
                backgroundColor: 'var(--danger-strong)',
              }}
            />
          </div>

          <Row justifyContent="space-between">
            <Text variant="body-3" onBackground="success">
              Positive: {data.sentiment.positive}%
            </Text>
            <Text variant="body-3" onBackground="neutral">
              Neutral: {data.sentiment.neutral}%
            </Text>
            <Text variant="body-3" onBackground="danger">
              Negative: {data.sentiment.negative}%
            </Text>
          </Row>
        </Column>

        {/* Engagement metric */}
        <Row justifyContent="space-between" alignItems="center">
          <Row gap="xs" alignItems="center">
            <Icon name="activity" size="s" onBackground="neutral-weak" />
            <Text variant="body-3" onBackground="neutral-weak">
              Avg. Engagement
            </Text>
          </Row>
          <Text variant="label-strong">
            {data.sentiment.engagement.toLocaleString()}
          </Text>
        </Row>

        {/* Top hashtags */}
        {data.topHashtags.length > 0 && (
          <Column gap="xs">
            <Text variant="body-3" onBackground="neutral-weak">
              Trending Topics
            </Text>
            <Row gap="xs" wrap>
              {data.topHashtags.map((tag) => (
                <Badge key={tag} variant="surface" size="s">
                  #{tag}
                </Badge>
              ))}
            </Row>
          </Column>
        )}
      </Column>
    </Card>
  );

  return (
    <Column gap="l" fillWidth>
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Row gap="m" alignItems="center">
          <Icon name="users" size="l" onBackground="primary" />
          <Heading variant="3">Social Sentiment Analysis</Heading>
        </Row>
      </Row>

      {/* Team selector */}
      <Card variant="surface">
        <Column gap="m">
          <Text variant="label-default">Select Teams to Analyze</Text>
          <Dropdown
            value={selectedTeams.join(',')}
            onValueChange={(value) => {
              const teams = value
                ? (value.split(',') as Array<keyof typeof BIG12_TEAMS>)
                : [];
              setSelectedTeams(teams);
            }}
            multiple
          >
            {Object.keys(BIG12_TEAMS).map((teamKey) => (
              <Option key={teamKey} value={teamKey}>
                {teamKey.replace(/_/g, ' ')}
              </Option>
            ))}
          </Dropdown>
        </Column>
      </Card>

      {/* Sentiment cards */}
      {loading ? (
        <Card variant="surface">
          <Column alignItems="center" padding="xl" gap="m">
            <Icon name="loader" size="l" />
            <Text variant="body-2" onBackground="neutral-weak">
              Analyzing social sentiment...
            </Text>
          </Column>
        </Card>
      ) : sentimentData.length > 0 ? (
        <Grid columns="repeat(auto-fill, minmax(300px, 1fr))" gap="m">
          {sentimentData.map(renderSentimentCard)}
        </Grid>
      ) : (
        <Card variant="surface">
          <Column alignItems="center" padding="xl" gap="m">
            <Icon name="heart" size="xl" onBackground="neutral-weak" />
            <Column alignItems="center" gap="s">
              <Text variant="heading-5" onBackground="neutral-weak">
                Select Teams to Analyze
              </Text>
              <Text variant="body-2" onBackground="neutral-weak" align="center">
                Choose one or more Big 12 teams to see their social media
                sentiment analysis
              </Text>
            </Column>
          </Column>
        </Card>
      )}

      {/* Comparison view */}
      {showComparison && sentimentData.length > 1 && (
        <Card>
          <Column gap="m">
            <Heading variant="4">Sentiment Comparison</Heading>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                      Team
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>
                      Positive
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>
                      Negative
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>
                      Engagement
                    </th>
                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sentimentData
                    .sort((a, b) => b.sentiment.positive - a.sentiment.positive)
                    .map((data) => (
                      <tr key={data.team}>
                        <td style={{ padding: '0.5rem' }}>
                          <Text variant="body-2">
                            {data.team.replace(/_/g, ' ')}
                          </Text>
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                          <Badge variant="success" size="s">
                            {data.sentiment.positive}%
                          </Badge>
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                          <Badge variant="danger" size="s">
                            {data.sentiment.negative}%
                          </Badge>
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                          <Text variant="body-2">
                            {data.sentiment.engagement.toLocaleString()}
                          </Text>
                        </td>
                        <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                          <Icon
                            name={getTrendIcon(data.trend)}
                            size="s"
                            onBackground={
                              data.trend === 'up'
                                ? 'success'
                                : data.trend === 'down'
                                  ? 'danger'
                                  : 'neutral'
                            }
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Column>
        </Card>
      )}
    </Column>
  );
}
