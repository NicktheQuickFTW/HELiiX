'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Heading,
  Button,
  Badge,
  Icon,
  Dropdown,
  Option,
  Grid,
} from '@once-ui-system/core';
import {
  Brain,
  TrendingUp,
  Trophy,
  Users,
  BarChart3,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { useCompletion } from '@ai-sdk/react';
import { BIG12_TEAMS } from '@/lib/big12-schools';
import { GameResult } from '@/lib/sports-api';

interface GrokInsightsProps {
  game?: GameResult;
  team?: keyof typeof BIG12_TEAMS;
  type?: 'game-preview' | 'post-game' | 'team-sentiment' | 'conference-trends';
}

export function GrokInsights({
  game,
  team,
  type = 'conference-trends',
}: GrokInsightsProps) {
  const [analysisType, setAnalysisType] = useState(type);
  const [selectedTeam, setSelectedTeam] = useState(team);
  const [timeframe, setTimeframe] = useState('7d');

  const { completion, input, stop, isLoading, handleSubmit, setInput } =
    useCompletion({
      api: '/api/ai/grok-analysis',
      body: {
        type: analysisType,
        data: {
          game,
          team: selectedTeam,
          timeframe,
          homeTeam: game?.homeTeam.name,
          awayTeam: game?.awayTeam.name,
          sport: game?.sport,
        },
      },
    });

  const handleAnalyze = () => {
    setInput('analyze'); // Trigger the completion
    handleSubmit(new Event('submit') as any);
  };

  const getInsightIcon = () => {
    switch (analysisType) {
      case 'game-preview':
        return 'eye';
      case 'post-game':
        return 'trophy';
      case 'team-sentiment':
        return 'users';
      case 'conference-trends':
        return 'trending-up';
      default:
        return 'brain';
    }
  };

  const formatCompletion = (text: string) => {
    // Split the completion into sections based on numbered lists
    const sections = text.split(/\d+\.\s+/).filter(Boolean);

    return sections.map((section, idx) => {
      const [title, ...content] = section.split(':');
      return { title: title?.trim(), content: content.join(':').trim() };
    });
  };

  return (
    <Column gap="l" fillWidth>
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Row gap="m" alignItems="center">
          <Icon name="brain" size="l" onBackground="primary" />
          <Heading variant="3">Grok AI Insights</Heading>
        </Row>
        <Badge variant="surface" size="s">
          Powered by xAI
        </Badge>
      </Row>

      {/* Controls */}
      <Card variant="surface">
        <Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="m">
          <Dropdown
            value={analysisType}
            onValueChange={(value) =>
              setAnalysisType(value as typeof analysisType)
            }
          >
            <Option value="conference-trends">Conference Trends</Option>
            <Option value="team-sentiment">Team Sentiment</Option>
            {game && <Option value="game-preview">Game Preview</Option>}
            {game && game.status === 'completed' && (
              <Option value="post-game">Post-Game Analysis</Option>
            )}
          </Dropdown>

          {analysisType === 'team-sentiment' && (
            <Dropdown
              value={selectedTeam || 'none'}
              onValueChange={(value) =>
                setSelectedTeam(
                  value === 'none'
                    ? undefined
                    : (value as keyof typeof BIG12_TEAMS)
                )
              }
            >
              <Option value="none">Select Team</Option>
              {Object.keys(BIG12_TEAMS).map((teamKey) => (
                <Option key={teamKey} value={teamKey}>
                  {teamKey.replace(/_/g, ' ')}
                </Option>
              ))}
            </Dropdown>
          )}

          {analysisType === 'team-sentiment' && (
            <Dropdown value={timeframe} onValueChange={setTimeframe}>
              <Option value="1d">Last 24 Hours</Option>
              <Option value="7d">Last 7 Days</Option>
              <Option value="30d">Last 30 Days</Option>
            </Dropdown>
          )}

          <Button
            variant="primary"
            onClick={handleAnalyze}
            disabled={
              isLoading || (analysisType === 'team-sentiment' && !selectedTeam)
            }
          >
            {isLoading ? (
              <Row gap="xs" alignItems="center">
                <Icon name="loader" size="s" />
                Analyzing...
              </Row>
            ) : (
              <Row gap="xs" alignItems="center">
                <Icon name={getInsightIcon()} size="s" />
                Generate Insights
              </Row>
            )}
          </Button>
        </Grid>
      </Card>

      {/* Analysis Results */}
      {completion && (
        <Card>
          <Column gap="l">
            <Row justifyContent="space-between" alignItems="center">
              <Row gap="s" alignItems="center">
                <Icon name={getInsightIcon()} size="m" onBackground="primary" />
                <Heading variant="4">
                  {analysisType === 'game-preview' && 'Game Preview Analysis'}
                  {analysisType === 'post-game' && 'Post-Game Analysis'}
                  {analysisType === 'team-sentiment' &&
                    `${selectedTeam?.replace(/_/g, ' ')} Sentiment Analysis`}
                  {analysisType === 'conference-trends' &&
                    'Big 12 Conference Trends'}
                </Heading>
              </Row>
              <Text variant="body-3" onBackground="neutral-weak">
                Generated just now
              </Text>
            </Row>

            {/* Formatted completion */}
            <Column gap="m">
              {formatCompletion(completion).map(
                (section, idx) =>
                  section.title && (
                    <Column key={idx} gap="s">
                      <Row gap="s" alignItems="center">
                        <Icon
                          name="chevron-right"
                          size="s"
                          onBackground="primary"
                        />
                        <Text variant="label-strong">{section.title}</Text>
                      </Row>
                      <Text variant="body-2" style={{ paddingLeft: '1.5rem' }}>
                        {section.content}
                      </Text>
                    </Column>
                  )
              )}

              {/* If no sections found, display as-is */}
              {formatCompletion(completion).length === 0 && (
                <Text variant="body-2" style={{ whiteSpace: 'pre-wrap' }}>
                  {completion}
                </Text>
              )}
            </Column>

            {/* Action buttons */}
            <Row gap="m" justifyContent="flex-end">
              <Button variant="secondary" size="s">
                <Icon name="share" size="s" />
                Share
              </Button>
              <Button variant="secondary" size="s">
                <Icon name="download" size="s" />
                Export
              </Button>
            </Row>
          </Column>
        </Card>
      )}

      {/* Empty state */}
      {!completion && !isLoading && (
        <Card variant="surface">
          <Column alignItems="center" padding="xl" gap="m">
            <Icon name="lightbulb" size="xl" onBackground="neutral-weak" />
            <Column alignItems="center" gap="s">
              <Text variant="heading-5" onBackground="neutral-weak">
                Ready for AI-Powered Insights
              </Text>
              <Text variant="body-2" onBackground="neutral-weak" align="center">
                Select an analysis type and generate insights powered by Grok
                AI. Get deep analysis of games, teams, and conference trends.
              </Text>
            </Column>
          </Column>
        </Card>
      )}
    </Column>
  );
}
