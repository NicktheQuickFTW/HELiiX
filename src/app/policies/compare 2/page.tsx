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
  Dropdown,
  Option,
} from '@once-ui-system/core';

interface Policy {
  id: string;
  title: string;
  category: string;
  sport_id?: number;
  policy_number: string;
  version: string;
  status: string;
  summary?: string;
  content_text?: string;
  sports?: {
    sport_code: string;
    sport_name: string;
  };
}

interface Sport {
  sport_id: number;
  sport_code: string;
  sport_name: string;
}

interface ComparisonResult {
  policy_id: string;
  version_from: string;
  version_to: string;
  from_content: string;
  to_content: string;
  changes_detected: boolean;
  comparison_summary: string;
}

export default function PolicyComparePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  const POLICY_CATEGORIES = [
    'sport_specific',
    'playing_rules',
    'championship_procedures',
    'officiating',
    'equipment',
  ];

  useEffect(() => {
    fetchSports();
    fetchPolicies();
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [selectedCategory]);

  const fetchSports = async () => {
    try {
      const response = await fetch('/api/sports');
      if (response.ok) {
        const data = await response.json();
        setSports(data);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory) params.set('category', selectedCategory);
      params.set('status', 'current'); // Only compare current policies

      const response = await fetch(`/api/policies?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPolicies(data);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const comparePoliciesAcrossSports = async () => {
    if (!selectedCategory || selectedSports.length < 2) {
      alert('Please select a category and at least 2 sports to compare');
      return;
    }

    setComparing(true);
    const results = [];

    try {
      // Group policies by category and compare across selected sports
      const sportPolicies = selectedSports.map((sportId) => {
        const sport = sports.find((s) => s.sport_id.toString() === sportId);
        const sportPolicyList = policies.filter(
          (p) =>
            p.sport_id?.toString() === sportId &&
            p.category === selectedCategory
        );

        return {
          sport,
          policies: sportPolicyList,
        };
      });

      // Compare similar policies across sports
      const policyTitles = [
        ...new Set(
          sportPolicies.flatMap((sp) =>
            sp.policies.map((p) =>
              p.title.replace(sp.sport?.sport_name || '', '').trim()
            )
          )
        ),
      ];

      for (const baseTitle of policyTitles) {
        const matchingPolicies = sportPolicies
          .map((sp) => ({
            sport: sp.sport,
            policy: sp.policies.find(
              (p) =>
                p.title.toLowerCase().includes(baseTitle.toLowerCase()) ||
                baseTitle.toLowerCase().includes(
                  p.title
                    .replace(sp.sport?.sport_name || '', '')
                    .trim()
                    .toLowerCase()
                )
            ),
          }))
          .filter((mp) => mp.policy);

        if (matchingPolicies.length >= 2) {
          results.push({
            title: baseTitle,
            category: selectedCategory,
            policies: matchingPolicies,
            differences: analyzePolicyDifferences(matchingPolicies),
          });
        }
      }

      setComparisonResults(results);
    } catch (error) {
      console.error('Error comparing policies:', error);
    } finally {
      setComparing(false);
    }
  };

  const analyzePolicyDifferences = (matchingPolicies: any[]) => {
    const differences = [];

    // Compare content length
    const contentLengths = matchingPolicies.map((mp) => ({
      sport: mp.sport.sport_name,
      length: mp.policy.content_text?.length || 0,
    }));

    const maxLength = Math.max(...contentLengths.map((cl) => cl.length));
    const minLength = Math.min(...contentLengths.map((cl) => cl.length));

    if (maxLength - minLength > 100) {
      differences.push({
        type: 'content_length',
        description: 'Significant variation in policy content length',
        details: contentLengths,
      });
    }

    // Compare summaries
    const summaries = matchingPolicies.map((mp) => mp.policy.summary || '');
    const uniqueSummaries = [...new Set(summaries.filter((s) => s.length > 0))];

    if (uniqueSummaries.length > 1) {
      differences.push({
        type: 'summary_variation',
        description: 'Different policy summaries across sports',
        details: matchingPolicies.map((mp) => ({
          sport: mp.sport.sport_name,
          summary: mp.policy.summary,
        })),
      });
    }

    return differences;
  };

  const getCategoryDisplay = (category: string) => {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleSportSelection = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId]
    );
  };

  return (
    <Column fillWidth gap="l" padding="xl">
      {/* Header */}
      <Row fillWidth justifyContent="space-between" alignItems="center">
        <Column gap="xs">
          <Heading variant="display-strong-s">Policy Comparison</Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Compare policies across sports to identify differences and
            standardization opportunities
          </Text>
        </Column>
      </Row>

      {/* Comparison Setup */}
      <Card padding="m" border="neutral-medium" background="surface">
        <Column gap="m">
          <Text variant="label-strong-s">Comparison Setup</Text>

          <Grid columns="2" gap="m">
            <Column gap="xs">
              <Text variant="label-default-xs">Policy Category</Text>
              <Dropdown
                value={selectedCategory}
                onSelectionChange={setSelectedCategory}
              >
                <Option value="">Select Category</Option>
                {POLICY_CATEGORIES.map((category) => (
                  <Option key={category} value={category}>
                    {getCategoryDisplay(category)}
                  </Option>
                ))}
              </Dropdown>
            </Column>

            <Column gap="xs">
              <Text variant="label-default-xs">
                Sports to Compare ({selectedSports.length} selected)
              </Text>
              <Column
                gap="xs"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {sports.map((sport) => (
                  <Row key={sport.sport_id} alignItems="center" gap="s">
                    <input
                      type="checkbox"
                      checked={selectedSports.includes(
                        sport.sport_id.toString()
                      )}
                      onChange={() =>
                        toggleSportSelection(sport.sport_id.toString())
                      }
                    />
                    <Text variant="body-default-s">
                      {sport.sport_name} ({sport.sport_code})
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Grid>

          <Row gap="s">
            <Button
              variant="primary"
              size="m"
              onClick={comparePoliciesAcrossSports}
              disabled={
                comparing || !selectedCategory || selectedSports.length < 2
              }
            >
              {comparing ? 'Comparing...' : 'Compare Policies'}
            </Button>

            <Button
              variant="secondary"
              size="m"
              onClick={() => {
                setSelectedSports([]);
                setSelectedCategory('');
                setComparisonResults([]);
              }}
            >
              Clear
            </Button>
          </Row>
        </Column>
      </Card>

      {/* Comparison Results */}
      {comparisonResults.length > 0 && (
        <Column gap="m">
          <Text variant="heading-strong-s">
            Comparison Results ({comparisonResults.length} policy groups)
          </Text>

          {comparisonResults.map((result, index) => (
            <Card
              key={index}
              padding="m"
              background="surface"
              border="neutral-medium"
            >
              <Column gap="m">
                <Row justifyContent="space-between" alignItems="center">
                  <Column gap="xs">
                    <Text variant="heading-strong-s">{result.title}</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {getCategoryDisplay(result.category)} •{' '}
                      {result.policies.length} sports
                    </Text>
                  </Column>

                  <Badge
                    variant={
                      result.differences.length > 0 ? 'warning' : 'success'
                    }
                    size="s"
                  >
                    {result.differences.length > 0
                      ? `${result.differences.length} differences`
                      : 'Consistent'}
                  </Badge>
                </Row>

                {/* Sports with this policy */}
                <Column gap="s">
                  <Text variant="label-strong-xs">Sports Coverage:</Text>
                  <Row gap="s" wrap>
                    {result.policies.map((mp: any, idx: number) => (
                      <Badge key={idx} variant="neutral" size="s">
                        {mp.sport.sport_code}
                      </Badge>
                    ))}
                  </Row>
                </Column>

                {/* Differences */}
                {result.differences.length > 0 && (
                  <Column gap="s">
                    <Text variant="label-strong-xs">
                      Identified Differences:
                    </Text>
                    {result.differences.map((diff: any, diffIdx: number) => (
                      <Card
                        key={diffIdx}
                        padding="s"
                        background="warning-weak"
                        border="warning-medium"
                      >
                        <Column gap="xs">
                          <Text variant="body-strong-s">
                            {diff.description}
                          </Text>
                          <Text variant="body-default-xs">
                            Type: {diff.type}
                          </Text>
                          {diff.details && Array.isArray(diff.details) && (
                            <Column gap="xs" style={{ marginTop: '8px' }}>
                              {diff.details.map(
                                (detail: any, detailIdx: number) => (
                                  <Text
                                    key={detailIdx}
                                    variant="body-default-xs"
                                    onBackground="neutral-weak"
                                  >
                                    {detail.sport}:{' '}
                                    {detail.summary ||
                                      detail.length ||
                                      'No content'}
                                  </Text>
                                )
                              )}
                            </Column>
                          )}
                        </Column>
                      </Card>
                    ))}
                  </Column>
                )}
              </Column>
            </Card>
          ))}

          {/* Summary Stats */}
          <Card padding="m" background="surface" border="neutral-medium">
            <Column gap="s">
              <Text variant="heading-strong-s">Comparison Summary</Text>
              <Grid columns="3" gap="m">
                <Column gap="xs">
                  <Text variant="heading-strong-l">
                    {comparisonResults.length}
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Policy Groups
                  </Text>
                </Column>

                <Column gap="xs">
                  <Text variant="heading-strong-l">
                    {
                      comparisonResults.filter((r) => r.differences.length > 0)
                        .length
                    }
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    With Differences
                  </Text>
                </Column>

                <Column gap="xs">
                  <Text variant="heading-strong-l">
                    {Math.round(
                      (comparisonResults.filter(
                        (r) => r.differences.length === 0
                      ).length /
                        comparisonResults.length) *
                        100
                    )}
                    %
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Consistency Rate
                  </Text>
                </Column>
              </Grid>
            </Column>
          </Card>
        </Column>
      )}

      {/* No Results */}
      {comparisonResults.length === 0 &&
        selectedCategory &&
        selectedSports.length >= 2 &&
        !comparing && (
          <Card padding="xl" background="surface" border="neutral-medium">
            <Column alignItems="center" gap="m">
              <Text variant="heading-strong-m">
                No comparable policies found
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                The selected sports may not have policies in the{' '}
                {getCategoryDisplay(selectedCategory)} category, or the policies
                may need to be parsed first.
              </Text>
            </Column>
          </Card>
        )}
    </Column>
  );
}
