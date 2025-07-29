'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import {
  Column,
  Row,
  Heading,
  Card,
  Text,
  Button,
  Icon,
  ToggleButton,
} from '@once-ui-system/core';
import { NewsFeed } from '@/components/basketball/NewsFeed';
import { LiveUpdates } from '@/components/basketball/LiveUpdates';
import { SentimentAnalytics } from '@/components/basketball/SentimentAnalytics';

export default function BasketballPage() {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <Column padding="l" gap="xl" minHeight="100vh">
      <Column gap="m">
        <Row gap="m" alignItems="center">
          <Icon name="sports" size="xl" color="primary" />
          <Heading variant="heading-xl">Basketball Intelligence Center</Heading>
        </Row>
        <Text variant="body-default-l" muted>
          Real-time Big 12 basketball monitoring powered by X (Twitter) and Grok
          AI
        </Text>
      </Column>

      <Row gap="m" fillWidth>
        <ToggleButton
          selected={activeTab === 'news'}
          onClick={() => setActiveTab('news')}
        >
          News Feed
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'live'}
          onClick={() => setActiveTab('live')}
        >
          Live Updates
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'sentiment'}
          onClick={() => setActiveTab('sentiment')}
        >
          Team Sentiment
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'alerts'}
          onClick={() => setActiveTab('alerts')}
        >
          Alert Settings
        </ToggleButton>
      </Row>

      {activeTab === 'news' && (
        <Column gap="m" marginTop="l">
          <Card padding="m" background="secondary">
            <Row gap="m" alignItems="center">
              <Icon name="info" size="m" />
              <Text variant="body-default-s">
                Monitoring all 16 Big 12 basketball programs with AI-powered
                analysis of breaking news, injuries, and game updates.
              </Text>
            </Row>
          </Card>
          <NewsFeed />
        </Column>
      )}

      {activeTab === 'live' && (
        <Column marginTop="l">
          <LiveUpdates />
        </Column>
      )}

      {activeTab === 'sentiment' && (
        <Column marginTop="l">
          <SentimentAnalytics />
        </Column>
      )}

      {activeTab === 'alerts' && (
        <Column gap="l" marginTop="l">
          <Card padding="l">
            <Column gap="m">
              <Heading variant="heading-m">Notification Preferences</Heading>
              <Text variant="body-default-s" muted>
                Configure how you receive alerts for Big 12 basketball news
              </Text>

              <Column gap="s">
                <Card padding="m" background="secondary">
                  <Column gap="s">
                    <Text variant="body-strong-s">High Priority Alerts</Text>
                    <Text variant="body-default-xs" muted>
                      Injuries, ejections, coaching changes, major upsets
                    </Text>
                  </Column>
                </Card>

                <Card padding="m" background="secondary">
                  <Column gap="s">
                    <Text variant="body-strong-s">Medium Priority Updates</Text>
                    <Text variant="body-default-xs" muted>
                      Transfer portal, recruiting, game results
                    </Text>
                  </Column>
                </Card>

                <Card padding="m" background="secondary">
                  <Column gap="s">
                    <Text variant="body-strong-s">General Information</Text>
                    <Text variant="body-default-xs" muted>
                      Social media posts, fan reactions, general updates
                    </Text>
                  </Column>
                </Card>
              </Column>
            </Column>
          </Card>

          <Card padding="l">
            <Column gap="m">
              <Heading variant="heading-m">Team Filters</Heading>
              <Text variant="body-default-s" muted>
                Select which teams to follow for personalized updates
              </Text>
              <Text variant="body-default-xs" muted>
                Configuration UI coming soon...
              </Text>
            </Column>
          </Card>
        </Column>
      )}
    </Column>
  );
}
