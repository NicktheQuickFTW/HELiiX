'use client';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Badge,
  Icon,
  Button,
  Dropdown,
  Option,
  StatusIndicator,
} from '@once-ui-system/core';
import { BasketballNews } from '@/lib/db/basketball-news';
import { formatDistanceToNow } from 'date-fns';

interface NewsFeedProps {
  initialNews?: BasketballNews[];
  autoRefresh?: boolean;
  refreshInterval?: number;
  onNewsClick?: (news: BasketballNews) => void;
}

const priorityColors = {
  high: 'danger',
  medium: 'warning',
  low: 'secondary',
} as const;

const categoryIcons = {
  breaking_news: 'news',
  game_update: 'sports',
  injury: 'medical',
  roster_change: 'people',
  recruiting: 'personAdd',
  general: 'article',
} as const;

export function NewsFeed({
  initialNews = [],
  autoRefresh = true,
  refreshInterval = 30000,
  onNewsClick,
}: NewsFeedProps) {
  const [news, setNews] = useState<BasketballNews[]>(initialNews);
  const [filter, setFilter] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const teams = [
    'all',
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

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'breaking_news', label: 'Breaking News' },
    { value: 'game_update', label: 'Game Updates' },
    { value: 'injury', label: 'Injuries' },
    { value: 'roster_change', label: 'Roster Changes' },
    { value: 'recruiting', label: 'Recruiting' },
    { value: 'general', label: 'General' },
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLatestNews, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchLatestNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/basketball/news');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter((item) => {
    const categoryMatch = filter === 'all' || item.category === filter;
    const teamMatch =
      selectedTeam === 'all' || item.teams_mentioned.includes(selectedTeam);
    return categoryMatch && teamMatch;
  });

  const handleNewsClick = (newsItem: BasketballNews) => {
    if (onNewsClick) {
      onNewsClick(newsItem);
    } else {
      // Default behavior - open tweet in new window
      window.open(`https://x.com/i/web/status/${newsItem.tweet_id}`, '_blank');
    }
  };

  return (
    <Column gap="m">
      <Row gap="m" alignItems="center">
        <Dropdown
          value={filter}
          onValueChange={setFilter}
          placeholder="Filter by category"
        >
          {categories.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Dropdown>

        <Dropdown
          value={selectedTeam}
          onValueChange={setSelectedTeam}
          placeholder="Filter by team"
        >
          {teams.map((team) => (
            <Option key={team} value={team}>
              {team === 'all' ? 'All Teams' : team}
            </Option>
          ))}
        </Dropdown>

        <Button
          variant="secondary"
          size="s"
          onClick={fetchLatestNews}
          disabled={loading}
        >
          <Icon name="refresh" />
          Refresh
        </Button>

        {loading && <StatusIndicator color="primary" />}
      </Row>

      <Column gap="s">
        {filteredNews.length === 0 ? (
          <Card padding="l" align="center">
            <Text variant="body-default-s" muted>
              No news items found
            </Text>
          </Card>
        ) : (
          filteredNews.map((item) => (
            <Card
              key={item.id}
              padding="m"
              onClick={() => handleNewsClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <Row gap="m" alignItems="start">
                <Icon
                  name={categoryIcons[item.category] || 'article'}
                  size="l"
                  color={item.priority === 'high' ? 'danger' : undefined}
                />

                <Column gap="s" style={{ flex: 1 }}>
                  <Row gap="s" alignItems="center">
                    <Badge
                      label={item.priority.toUpperCase()}
                      size="s"
                      color={priorityColors[item.priority]}
                    />
                    <Badge
                      label={item.category.replace('_', ' ').toUpperCase()}
                      size="s"
                      color="secondary"
                    />
                    {item.action_required && (
                      <Badge label="ACTION REQUIRED" size="s" color="danger" />
                    )}
                  </Row>

                  <Text variant="body-default-s">{item.text}</Text>

                  <Row gap="m" alignItems="center">
                    <Row gap="xs" alignItems="center">
                      <Icon name="person" size="s" />
                      <Text variant="body-default-xs" muted>
                        @{item.author_username}
                        {item.author_verified && (
                          <Icon name="verified" size="xs" color="primary" />
                        )}
                      </Text>
                    </Row>

                    <Text variant="body-default-xs" muted>
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </Text>

                    <Row gap="s" alignItems="center">
                      <Row gap="xs" alignItems="center">
                        <Icon name="heart" size="xs" />
                        <Text variant="body-default-xs" muted>
                          {item.like_count}
                        </Text>
                      </Row>
                      <Row gap="xs" alignItems="center">
                        <Icon name="repeat" size="xs" />
                        <Text variant="body-default-xs" muted>
                          {item.retweet_count}
                        </Text>
                      </Row>
                    </Row>
                  </Row>

                  {item.teams_mentioned.length > 0 && (
                    <Row gap="xs">
                      {item.teams_mentioned.map((team) => (
                        <Badge
                          key={team}
                          label={team}
                          size="xs"
                          color="neutral"
                        />
                      ))}
                    </Row>
                  )}

                  {item.summary && (
                    <Text variant="body-default-xs" muted>
                      <strong>Summary:</strong> {item.summary}
                    </Text>
                  )}
                </Column>
              </Row>
            </Card>
          ))
        )}
      </Column>
    </Column>
  );
}
