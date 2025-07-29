'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Card,
  Heading,
  Text,
  Button,
  Badge,
  Icon,
  Input,
  Skeleton,
  ToggleButton,
  Grid,
} from '@once-ui-system/core';
import { NOTION_CONFIG } from '@/lib/notion';

interface NotionEntry {
  id: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
  url: string;
}

interface DatabaseSchema {
  id: string;
  title: string;
  properties: Record<string, any>;
  url: string;
  created_time: string;
  last_edited_time: string;
}

export default function NotionPage() {
  const [entries, setEntries] = useState<NotionEntry[]>([]);
  const [schema, setSchema] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('entries');
  const [filterProperty, setFilterProperty] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [sortProperty, setSortProperty] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<
    'ascending' | 'descending'
  >('descending');

  useEffect(() => {
    fetchEntries();
    fetchSchema();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.results) {
        setEntries(data.results);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchema = async () => {
    try {
      setSchemaLoading(true);
      const response = await fetch('/api/notion/schema');
      const data = await response.json();

      if (data) {
        setSchema(data);
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
    } finally {
      setSchemaLoading(false);
    }
  };

  const getPropertyValue = (entry: NotionEntry, key: string): string => {
    const prop = entry.properties[key];
    if (!prop) return '';

    switch (prop.type) {
      case 'title':
        return prop.title?.[0]?.text?.content || '';
      case 'rich_text':
        return prop.rich_text?.[0]?.text?.content || '';
      case 'select':
        return prop.select?.name || '';
      case 'multi_select':
        return prop.multi_select?.map((s: any) => s.name).join(', ') || '';
      case 'date':
        return prop.date?.start || '';
      case 'checkbox':
        return prop.checkbox ? 'Yes' : 'No';
      case 'number':
        return prop.number?.toString() || '';
      case 'url':
        return prop.url || '';
      case 'email':
        return prop.email || '';
      case 'phone_number':
        return prop.phone_number || '';
      default:
        return JSON.stringify(prop);
    }
  };

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch = Object.keys(entry.properties).some((key) => {
        const value = getPropertyValue(entry, key).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      });

      const matchesFilter =
        !filterProperty ||
        !filterValue ||
        getPropertyValue(entry, filterProperty)
          .toLowerCase()
          .includes(filterValue.toLowerCase());

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!sortProperty) {
        return (
          new Date(b.last_edited_time).getTime() -
          new Date(a.last_edited_time).getTime()
        );
      }

      const aValue = getPropertyValue(a, sortProperty);
      const bValue = getPropertyValue(b, sortProperty);

      if (sortDirection === 'ascending') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'title':
        return 'text';
      case 'rich_text':
        return 'fileText';
      case 'select':
        return 'list';
      case 'multi_select':
        return 'tags';
      case 'date':
        return 'calendar';
      case 'checkbox':
        return 'checkSquare';
      case 'number':
        return 'hash';
      case 'url':
        return 'link';
      case 'email':
        return 'mail';
      case 'phone_number':
        return 'phone';
      default:
        return 'help';
    }
  };

  return (
    <Column gap="xl" padding="l">
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="s">
          <Heading variant="heading-xl">Notion Integration</Heading>
          <Text variant="body-default-l" muted>
            Manage and view your Big 12 Conference data from Notion
          </Text>
        </Column>
        <Button
          variant="primary"
          onClick={() => {
            fetchEntries();
            fetchSchema();
          }}
        >
          <Icon name="refresh" />
          Refresh Data
        </Button>
      </Row>

      <Row gap="m" fillWidth>
        <ToggleButton
          selected={activeTab === 'entries'}
          onClick={() => setActiveTab('entries')}
        >
          <Icon name="database" />
          Entries ({entries.length})
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'schema'}
          onClick={() => setActiveTab('schema')}
        >
          <Icon name="settings" />
          Database Schema
        </ToggleButton>
        <ToggleButton
          selected={activeTab === 'api'}
          onClick={() => setActiveTab('api')}
        >
          <Icon name="code" />
          API Info
        </ToggleButton>
      </Row>

      {activeTab === 'entries' && (
        <Column gap="l">
          <Card padding="m">
            <Row gap="m" alignItems="end">
              <Column gap="xs" style={{ flex: 1 }}>
                <Text variant="label-default-s">Search</Text>
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Column>
              {schema && (
                <>
                  <Column gap="xs">
                    <Text variant="label-default-s">Filter by</Text>
                    <select
                      value={filterProperty}
                      onChange={(e) => setFilterProperty(e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid var(--neutral-alpha-weak)',
                      }}
                    >
                      <option value="">All properties</option>
                      {Object.entries(schema.properties).map(
                        ([key, prop]: [string, any]) => (
                          <option key={key} value={key}>
                            {prop.name}
                          </option>
                        )
                      )}
                    </select>
                  </Column>
                  {filterProperty && (
                    <Column gap="xs">
                      <Text variant="label-default-s">Filter value</Text>
                      <Input
                        placeholder="Filter value..."
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                      />
                    </Column>
                  )}
                </>
              )}
            </Row>
          </Card>

          {loading ? (
            <Grid columns="1fr 1fr 1fr" gap="m">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} padding="l">
                  <Column gap="m">
                    <Skeleton width="100%" height="20px" />
                    <Skeleton width="80%" height="16px" />
                    <Skeleton width="60%" height="16px" />
                  </Column>
                </Card>
              ))}
            </Grid>
          ) : (
            <Grid columns="1fr 1fr 1fr" gap="m">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} padding="l">
                  <Column gap="m">
                    {Object.entries(entry.properties)
                      .slice(0, 5)
                      .map(([key, prop]) => (
                        <Column key={key} gap="xs">
                          <Text variant="label-default-xs" muted>
                            {key}
                          </Text>
                          <Text variant="body-default-s">
                            {getPropertyValue(entry, key) || '-'}
                          </Text>
                        </Column>
                      ))}
                    <Row justifyContent="space-between" alignItems="center">
                      <Text variant="body-default-xs" muted>
                        Updated {formatDate(entry.last_edited_time)}
                      </Text>
                      <Button
                        variant="secondary"
                        size="s"
                        onClick={() => window.open(entry.url, '_blank')}
                      >
                        <Icon name="externalLink" size="s" />
                        View
                      </Button>
                    </Row>
                  </Column>
                </Card>
              ))}
            </Grid>
          )}
        </Column>
      )}

      {activeTab === 'schema' && (
        <Column gap="l">
          {schemaLoading ? (
            <Card padding="l">
              <Column gap="m">
                <Skeleton width="200px" height="24px" />
                <Skeleton width="100%" height="200px" />
              </Column>
            </Card>
          ) : schema ? (
            <Card padding="l">
              <Column gap="l">
                <Column gap="s">
                  <Heading variant="heading-m">{schema.title}</Heading>
                  <Text variant="body-default-s" muted>
                    Database ID: {schema.id}
                  </Text>
                  <Row gap="m">
                    <Badge
                      label={`Created: ${formatDate(schema.created_time)}`}
                    />
                    <Badge
                      label={`Updated: ${formatDate(schema.last_edited_time)}`}
                    />
                  </Row>
                </Column>

                <Column gap="m">
                  <Heading variant="heading-s">Properties</Heading>
                  <Grid columns="1fr 1fr 1fr" gap="m">
                    {Object.entries(schema.properties).map(
                      ([key, prop]: [string, any]) => (
                        <Card key={key} padding="m" background="secondary">
                          <Row gap="m" alignItems="center">
                            <Icon name={getPropertyTypeIcon(prop.type)} />
                            <Column gap="xs">
                              <Text variant="body-strong-s">{prop.name}</Text>
                              <Row gap="xs">
                                <Badge label={prop.type} size="xs" />
                                {prop.select && (
                                  <Badge
                                    label={`${prop.select.options.length} options`}
                                    size="xs"
                                  />
                                )}
                              </Row>
                            </Column>
                          </Row>
                        </Card>
                      )
                    )}
                  </Grid>
                </Column>

                <Button
                  variant="secondary"
                  onClick={() => window.open(schema.url, '_blank')}
                >
                  <Icon name="externalLink" />
                  Open in Notion
                </Button>
              </Column>
            </Card>
          ) : (
            <Card padding="l">
              <Text variant="body-default-m" muted>
                No schema data available
              </Text>
            </Card>
          )}
        </Column>
      )}

      {activeTab === 'api' && (
        <Column gap="l">
          <Card padding="l">
            <Column gap="l">
              <Heading variant="heading-m">API Configuration</Heading>

              <Column gap="m">
                <Column gap="s">
                  <Text variant="body-strong-s">Database ID</Text>
                  <Card padding="s" background="secondary">
                    <Text
                      variant="body-default-s"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {NOTION_CONFIG.NOTION_DATABASE_ID || 'Not configured'}
                    </Text>
                  </Card>
                </Column>

                <Column gap="s">
                  <Text variant="body-strong-s">API Endpoints</Text>
                  <Column gap="xs">
                    <Card padding="s" background="secondary">
                      <Text
                        variant="body-default-xs"
                        style={{ fontFamily: 'monospace' }}
                      >
                        POST /api/notion/sync - Sync entries from Notion
                      </Text>
                    </Card>
                    <Card padding="s" background="secondary">
                      <Text
                        variant="body-default-xs"
                        style={{ fontFamily: 'monospace' }}
                      >
                        GET /api/notion/schema - Get database schema
                      </Text>
                    </Card>
                    <Card padding="s" background="secondary">
                      <Text
                        variant="body-default-xs"
                        style={{ fontFamily: 'monospace' }}
                      >
                        GET /api/notion/entries - Get all entries
                      </Text>
                    </Card>
                  </Column>
                </Column>

                <Column gap="s">
                  <Text variant="body-strong-s">Integration Status</Text>
                  <Row gap="m">
                    <Badge
                      label={
                        NOTION_CONFIG.NOTION_DATABASE_ID
                          ? 'Configured'
                          : 'Not Configured'
                      }
                      color={
                        NOTION_CONFIG.NOTION_DATABASE_ID ? 'success' : 'danger'
                      }
                    />
                    <Badge label={`${entries.length} entries synced`} />
                  </Row>
                </Column>
              </Column>
            </Column>
          </Card>
        </Column>
      )}
    </Column>
  );
}
