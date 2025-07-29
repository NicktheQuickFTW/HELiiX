'use client';

import { useState, useEffect } from 'react';
import {
  Column,
  Row,
  Grid,
  Card,
  Button,
  Heading,
  Text,
  Badge,
  StatusIndicator,
} from '@once-ui-system/core';

interface ConferenceManual {
  filename: string;
  type: string;
  description: string;
  exists: boolean;
}

interface ParseResult {
  manual: string;
  section?: string;
  category?: string;
  status: 'processed' | 'error';
  error?: string;
}

export default function ParseConferenceManualsPage() {
  const [manuals, setManuals] = useState<ConferenceManual[]>([]);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [parseResults, setParseResults] = useState<ParseResult[]>([]);

  useEffect(() => {
    fetchConferenceManuals();
  }, []);

  const fetchConferenceManuals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/manuals/parse-conference-manuals');
      if (response.ok) {
        const data = await response.json();
        setManuals(data.manuals);
      }
    } catch (error) {
      console.error('Error fetching conference manuals:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseConferenceManuals = async () => {
    try {
      setParsing(true);
      setParseResults([]);

      const response = await fetch('/api/manuals/parse-conference-manuals', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setParseResults(data.results);
      }
    } catch (error) {
      console.error('Error parsing conference manuals:', error);
    } finally {
      setParsing(false);
    }
  };

  const getManualTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      tv_handbook: 'TV Handbook',
      far_manual: 'FAR Manual',
      handbook: 'Conference Handbook',
    };
    return types[type] || type;
  };

  const getManualTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tv_handbook: 'blue',
      far_manual: 'green',
      handbook: 'purple',
    };
    return colors[type] || 'gray';
  };

  if (loading) {
    return (
      <Column fillWidth gap="l" padding="xl">
        <Row
          justifyContent="center"
          alignItems="center"
          style={{ height: '400px' }}
        >
          <StatusIndicator variant="loading" size="m" />
          <Text variant="body-default-m">Loading conference manuals...</Text>
        </Row>
      </Column>
    );
  }

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Parse Conference Manuals</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Extract conference-wide policies from general Big 12 manuals
          </Text>
        </Column>
        <Button
          variant="primary"
          size="m"
          onClick={parseConferenceManuals}
          disabled={parsing}
        >
          {parsing ? 'Parsing...' : 'Parse Conference Manuals'}
        </Button>
      </Row>

      {/* Stats */}
      <Grid columns="3" gap="m">
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">{manuals.length}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Conference Manuals
            </Text>
          </Column>
        </Card>

        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">
              {manuals.filter((m) => m.exists).length}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Available Files
            </Text>
          </Column>
        </Card>

        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="xs">
            <Text variant="heading-strong-l">2024-25</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Current Season
            </Text>
          </Column>
        </Card>
      </Grid>

      {/* Parsing Instructions */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="s">
          <Text variant="heading-strong-s">Conference Manual Processing</Text>
          <Text variant="body-default-s" onBackground="neutral-medium">
            These manuals contain conference-wide policies that apply to all
            sports:
          </Text>

          <Column gap="xs" style={{ marginLeft: '16px' }}>
            <Text variant="body-strong-s" onBackground="success-medium">
              ✓ Will Extract:
            </Text>
            <Text variant="body-default-s">
              • Governance Structure & Policies
            </Text>
            <Text variant="body-default-s">
              • Television Broadcasting Standards
            </Text>
            <Text variant="body-default-s">
              • Academic Integrity Requirements
            </Text>
            <Text variant="body-default-s">
              • Faculty Athletic Representative Duties
            </Text>
            <Text variant="body-default-s">
              • General Championship Procedures
            </Text>
            <Text variant="body-default-s">
              • Member Institution Requirements
            </Text>
          </Column>

          <Text
            variant="body-default-s"
            onBackground="neutral-weak"
            style={{ fontStyle: 'italic' }}
          >
            These policies will be stored as conference-wide policies (not
            sport-specific).
          </Text>
        </Column>
      </Card>

      {/* Available Manuals */}
      <Card padding="m" background="surface" border="neutral-medium">
        <Column gap="m">
          <Text variant="heading-strong-s">Available Conference Manuals</Text>

          <Grid columns="1" gap="s">
            {manuals.map((manual, index) => (
              <Card
                key={index}
                padding="s"
                background="neutral-weak"
                border="neutral-medium"
              >
                <Row
                  fillWidth
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Column gap="xs" flex={1}>
                    <Row alignItems="center" gap="s">
                      <Badge variant="brand" size="s">
                        {getManualTypeDisplay(manual.type)}
                      </Badge>
                      <Text variant="body-strong-s">{manual.filename}</Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {manual.description}
                    </Text>
                  </Column>

                  <StatusIndicator
                    variant={manual.exists ? 'green' : 'red'}
                    size="s"
                  >
                    {manual.exists ? 'Available' : 'Missing'}
                  </StatusIndicator>
                </Row>
              </Card>
            ))}
          </Grid>
        </Column>
      </Card>

      {/* Parse Results */}
      {parseResults.length > 0 && (
        <Card padding="m" background="surface" border="neutral-medium">
          <Column gap="m">
            <Text variant="heading-strong-s">Parsing Results</Text>

            <Grid columns="1" gap="s">
              {parseResults.map((result, index) => (
                <Row
                  key={index}
                  fillWidth
                  justifyContent="space-between"
                  alignItems="center"
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid var(--neutral-border-medium)',
                  }}
                >
                  <Column gap="xs">
                    <Text variant="body-strong-s">{result.manual}</Text>
                    {result.section && (
                      <Text
                        variant="body-default-xs"
                        onBackground="neutral-weak"
                      >
                        {result.section}{' '}
                        {result.category && `• ${result.category}`}
                      </Text>
                    )}
                    {result.error && (
                      <Text
                        variant="body-default-xs"
                        onBackground="danger-medium"
                      >
                        Error: {result.error}
                      </Text>
                    )}
                  </Column>

                  <StatusIndicator
                    variant={result.status === 'processed' ? 'green' : 'red'}
                    size="s"
                  >
                    {result.status === 'processed' ? 'Success' : 'Error'}
                  </StatusIndicator>
                </Row>
              ))}
            </Grid>

            <Row gap="s" style={{ marginTop: '16px' }}>
              <Text variant="body-default-s">
                Processed:{' '}
                {parseResults.filter((r) => r.status === 'processed').length}
              </Text>
              <Text variant="body-default-s">
                Errors:{' '}
                {parseResults.filter((r) => r.status === 'error').length}
              </Text>
            </Row>
          </Column>
        </Card>
      )}

      {/* Warning for Missing Files */}
      {manuals.some((m) => !m.exists) && (
        <Card padding="m" background="warning-weak" border="warning-medium">
          <Column gap="s">
            <Text variant="heading-strong-s">Missing Files</Text>
            <Text variant="body-default-s">
              Some conference manual files could not be found. Please verify the
              file paths:
            </Text>
            <Column gap="xs" style={{ marginLeft: '16px' }}>
              {manuals
                .filter((m) => !m.exists)
                .map((manual) => (
                  <Text
                    key={manual.filename}
                    variant="body-default-s"
                    onBackground="warning-medium"
                  >
                    • {manual.filename}
                  </Text>
                ))}
            </Column>
          </Column>
        </Card>
      )}
    </Column>
  );
}
