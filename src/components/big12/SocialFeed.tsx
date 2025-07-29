'use client';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Card,
  Text,
  Heading,
  Badge,
  Button,
  Dropdown,
  Option,
  Icon,
} from '@once-ui-system/core';
import {
  MessageCircle,
  Heart,
  RefreshCw,
  Share2,
  Clock,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { BIG12_TEAMS } from '@/lib/big12-schools';
import { formatDistanceToNow } from 'date-fns';

interface XPost {
  id: string;
  text: string;
  author_name?: string;
  author_username?: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<{ username: string }>;
    urls?: Array<{ url: string; expanded_url: string }>;
  };
  media?: Array<{
    type: 'photo' | 'video' | 'animated_gif';
    url: string;
    preview_image_url?: string;
  }>;
}

interface SocialFeedProps {
  sport?: 'football' | 'basketball' | 'all';
  team?: keyof typeof BIG12_TEAMS;
  maxHeight?: string;
  showFilters?: boolean;
}

export function SocialFeed({
  sport: initialSport = 'all',
  team: initialTeam,
  maxHeight = '600px',
  showFilters = true,
}: SocialFeedProps) {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState(initialSport);
  const [team, setTeam] = useState(initialTeam);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sport,
        maxResults: '20',
      });

      if (team) params.append('team', team);
      if (!reset && nextToken) params.append('nextToken', nextToken);

      const response = await fetch(`/api/x/timeline?${params}`);
      const data = await response.json();

      if (reset) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }

      setNextToken(data.next_token);
      setHasMore(!!data.next_token);
    } catch (error) {
      console.error('Error fetching social feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, [sport, team]);

  const formatEngagement = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const renderPost = (post: XPost) => (
    <Card key={post.id} style={{ marginBottom: '1rem' }}>
      <Column gap="m">
        {/* Author info */}
        <Row justifyContent="space-between" alignItems="center">
          <Column gap="xs">
            <Text variant="label-strong">{post.author_name || 'Unknown'}</Text>
            <Text variant="body-3" onBackground="neutral-weak">
              @{post.author_username || 'unknown'} ·{' '}
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </Text>
          </Column>
        </Row>

        {/* Post content */}
        <Text variant="body-2" style={{ whiteSpace: 'pre-wrap' }}>
          {post.text}
        </Text>

        {/* Media preview */}
        {post.media && post.media.length > 0 && (
          <Row gap="s" wrap>
            {post.media.map((media, idx) => (
              <div
                key={idx}
                style={{
                  width: media.type === 'photo' ? '100%' : 'auto',
                  maxWidth: '300px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {media.type === 'photo' && (
                  <img
                    src={media.url}
                    alt="Tweet media"
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
                {media.type === 'video' && (
                  <video
                    src={media.url}
                    controls
                    style={{ width: '100%', height: 'auto' }}
                    poster={media.preview_image_url}
                  />
                )}
              </div>
            ))}
          </Row>
        )}

        {/* Hashtags */}
        {post.entities?.hashtags && post.entities.hashtags.length > 0 && (
          <Row gap="xs" wrap>
            {post.entities.hashtags.map((hashtag, idx) => (
              <Badge key={idx} variant="surface" size="s">
                #{hashtag.tag}
              </Badge>
            ))}
          </Row>
        )}

        {/* Engagement metrics */}
        <Row gap="l" alignItems="center">
          <Row gap="xs" alignItems="center">
            <Icon name="message" size="s" onBackground="neutral-weak" />
            <Text variant="body-3" onBackground="neutral-weak">
              {formatEngagement(post.public_metrics.reply_count)}
            </Text>
          </Row>
          <Row gap="xs" alignItems="center">
            <Icon name="repeat" size="s" onBackground="neutral-weak" />
            <Text variant="body-3" onBackground="neutral-weak">
              {formatEngagement(post.public_metrics.retweet_count)}
            </Text>
          </Row>
          <Row gap="xs" alignItems="center">
            <Icon name="heart" size="s" onBackground="neutral-weak" />
            <Text variant="body-3" onBackground="neutral-weak">
              {formatEngagement(post.public_metrics.like_count)}
            </Text>
          </Row>
          <Row gap="xs" alignItems="center">
            <Icon name="share" size="s" onBackground="neutral-weak" />
            <Text variant="body-3" onBackground="neutral-weak">
              {formatEngagement(post.public_metrics.quote_count)}
            </Text>
          </Row>
        </Row>
      </Column>
    </Card>
  );

  return (
    <Column gap="l" fillWidth>
      {/* Header and filters */}
      <Row justifyContent="space-between" alignItems="center" fillWidth>
        <Heading variant="2">Social Feed</Heading>
        <Button
          variant="secondary"
          size="s"
          onClick={() => fetchPosts(true)}
          disabled={loading}
        >
          <Icon name="refresh" size="s" />
          Refresh
        </Button>
      </Row>

      {showFilters && (
        <Row gap="m" fillWidth wrap>
          <Dropdown
            value={sport}
            onValueChange={(value) => setSport(value as typeof sport)}
          >
            <Option value="all">All Sports</Option>
            <Option value="football">Football</Option>
            <Option value="basketball">Basketball</Option>
          </Dropdown>

          <Dropdown
            value={team || 'all'}
            onValueChange={(value) =>
              setTeam(
                value === 'all'
                  ? undefined
                  : (value as keyof typeof BIG12_TEAMS)
              )
            }
          >
            <Option value="all">All Teams</Option>
            {Object.keys(BIG12_TEAMS).map((teamKey) => (
              <Option key={teamKey} value={teamKey}>
                {teamKey.replace(/_/g, ' ')}
              </Option>
            ))}
          </Dropdown>
        </Row>
      )}

      {/* Posts list */}
      <Column
        gap="m"
        style={{
          maxHeight,
          overflowY: 'auto',
          paddingRight: '0.5rem',
        }}
      >
        {loading && posts.length === 0 ? (
          <Column alignItems="center" padding="xl">
            <Icon name="loader" size="l" />
            <Text variant="body-2" onBackground="neutral-weak">
              Loading social feed...
            </Text>
          </Column>
        ) : posts.length === 0 ? (
          <Column alignItems="center" padding="xl">
            <Icon name="inbox" size="l" onBackground="neutral-weak" />
            <Text variant="body-2" onBackground="neutral-weak">
              No posts found
            </Text>
          </Column>
        ) : (
          <>
            {posts.map(renderPost)}

            {hasMore && (
              <Button
                variant="secondary"
                size="m"
                fillWidth
                onClick={() => fetchPosts(false)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </>
        )}
      </Column>
    </Column>
  );
}
