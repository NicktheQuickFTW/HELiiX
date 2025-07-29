'use client';

import {
  Column,
  Row,
  Grid,
  Heading,
  Text,
  Card,
  ToggleButton,
} from '@once-ui-system/core';
import { useState } from 'react';
import { SocialFeed } from '@/components/big12/SocialFeed';
import { GrokInsights } from '@/components/big12/GrokInsights';
import { SocialSentiment } from '@/components/big12/SocialSentiment';
import { SportsScoreboard } from '@/components/big12/SportsScoreboard';

export default function SocialDashboard() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <Column gap="xl" padding="l">
      {/* Page Header */}
      <Column gap="m">
        <Heading variant="1">Social Media & AI Insights</Heading>
        <Text variant="body-1" onBackground="neutral-weak">
          Real-time social media monitoring and AI-powered analysis for Big 12
          Conference
        </Text>
      </Column>

      {/* Tab Navigation */}
      <Row gap="m" fillWidth>
        <ToggleButton
          selected={activeTab === 'feed'}
          onClick={() => setActiveTab('feed')}
        >
          Social Feed
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
        >
          AI Insights
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'sentiment'}
          onClick={() => setActiveTab('sentiment')}
        >
          Sentiment
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'live'}
          onClick={() => setActiveTab('live')}
        >
          Live Games
        </ToggleButton>
      </Row>

      {/* Tab Content */}
      {activeTab === 'feed' && (
        <Grid columns="1fr 1fr" gap="l">
          <Column>
            <SocialFeed sport="all" maxHeight="800px" />
          </Column>
          <Column gap="l">
            <SportsScoreboard />
            <GrokInsights type="conference-trends" />
          </Column>
        </Grid>
      )}

      {activeTab === 'insights' && (
        <Grid columns="1fr 1fr" gap="l">
          <Column>
            <GrokInsights type="conference-trends" />
          </Column>
          <Column>
            <SocialFeed sport="all" maxHeight="600px" showFilters={false} />
          </Column>
        </Grid>
      )}

      {activeTab === 'sentiment' && (
        <SocialSentiment
          teams={['KANSAS', 'KANSAS_STATE', 'OKLAHOMA_STATE', 'TEXAS_TECH']}
          showComparison={true}
        />
      )}

      {activeTab === 'live' && (
        <Grid columns="1fr 1fr" gap="l">
          <Column>
            <Card>
              <Column gap="m" padding="l">
                <Heading variant="3">Live Game Updates</Heading>
                <Text variant="body-2" onBackground="neutral-weak">
                  Select a live game from the scoreboard to see real-time
                  updates
                </Text>
              </Column>
            </Card>
            <SocialFeed sport="all" maxHeight="500px" />
          </Column>
          <Column>
            <SportsScoreboard />
          </Column>
        </Grid>
      )}
    </Column>
  );
}
