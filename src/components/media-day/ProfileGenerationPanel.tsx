/**
 * Profile Generation Panel
 * UI component to trigger and monitor Big 12 Media Day profile generation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GenerationProgress {
  phase: string;
  message: string;
  progress: number;
}

interface GenerationResult {
  players: any[];
  coaches: any[];
  summary?: {
    totalProfiles: number;
    playersGenerated: number;
    coachesGenerated: number;
    avgPlayerCompleteness: number;
    avgCoachCompleteness: number;
    processingTime: number;
    issues: string[];
  };
  type: string;
}

interface ProfileStats {
  expectedProfiles: {
    players: number;
    coaches: number;
    total: number;
  };
  playersBySchool: { [school: string]: number };
  playersByPosition: { [position: string]: number };
  coachesByTenure: { [category: string]: number };
  sources: string[];
}

const ProfileGenerationPanel: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(
        '/api/media-day/generate-profiles?action=stats'
      );
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const startGeneration = async (type: string) => {
    setIsGenerating(true);
    setProgress(null);
    setResult(null);
    setError(null);
    setSelectedType(type);

    try {
      const response = await fetch('/api/media-day/generate-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          config: {
            enableParallelProcessing: true,
            maxConcurrentRequests: 3,
            includeDetailedValidation: true,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setProgress({
          phase: 'complete',
          message: 'Profile generation completed successfully',
          progress: 100,
        });
      } else {
        setError(data.details || 'Generation failed');
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadProfiles = (type: 'players' | 'coaches' | 'all') => {
    if (!result) return;

    let data;
    let filename;

    switch (type) {
      case 'players':
        data = result.players;
        filename = 'big12-media-day-players.json';
        break;
      case 'coaches':
        data = result.coaches;
        filename = 'big12-media-day-coaches.json';
        break;
      case 'all':
        data = result;
        filename = 'big12-media-day-profiles.json';
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Big 12 Media Day Profile Generator
          </CardTitle>
          <p className="text-gray-600 text-center">
            Automated research and profile generation for players and coaches
          </p>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.expectedProfiles.players}
                </div>
                <div className="text-sm text-gray-600">Expected Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.expectedProfiles.coaches}
                </div>
                <div className="text-sm text-gray-600">Head Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.expectedProfiles.total}
                </div>
                <div className="text-sm text-gray-600">Total Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.sources.length}
                </div>
                <div className="text-sm text-gray-600">Data Sources</div>
              </div>
            </div>

            <Tabs defaultValue="schools" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schools">By School</TabsTrigger>
                <TabsTrigger value="positions">By Position</TabsTrigger>
                <TabsTrigger value="tenure">Coach Tenure</TabsTrigger>
              </TabsList>

              <TabsContent value="schools" className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(stats.playersBySchool).map(
                    ([school, count]) => (
                      <div
                        key={school}
                        className="flex justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{school}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="positions" className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(stats.playersByPosition).map(
                    ([position, count]) => (
                      <div
                        key={position}
                        className="flex justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm font-medium">{position}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tenure" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.entries(stats.coachesByTenure).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="flex justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{category}</span>
                        <Badge variant="default">{count}</Badge>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Generation</CardTitle>
          <p className="text-sm text-gray-600">
            Generate comprehensive profiles using multiple data sources and
            AI-powered research
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button
              onClick={() => startGeneration('players')}
              disabled={isGenerating}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <div className="text-lg font-semibold">Players Only</div>
              <div className="text-sm text-gray-600">
                {stats?.expectedProfiles.players || 0} confirmed players
              </div>
            </Button>

            <Button
              onClick={() => startGeneration('coaches')}
              disabled={isGenerating}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <div className="text-lg font-semibold">Coaches Only</div>
              <div className="text-sm text-gray-600">
                {stats?.expectedProfiles.coaches || 0} head coaches
              </div>
            </Button>

            <Button
              onClick={() => startGeneration('all')}
              disabled={isGenerating}
              className="h-20 flex flex-col items-center justify-center"
            >
              <div className="text-lg font-semibold">All Profiles</div>
              <div className="text-sm text-white/80">Complete generation</div>
            </Button>
          </div>

          {/* Progress Display */}
          {isGenerating && progress && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="capitalize">
                  {progress.phase.replace('_', ' ')}
                </span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-2" />
              <p className="text-sm text-gray-600">{progress.message}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generation Results
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadProfiles('players')}
                  disabled={result.players.length === 0}
                >
                  Download Players
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadProfiles('coaches')}
                  disabled={result.coaches.length === 0}
                >
                  Download Coaches
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadProfiles('all')}
                >
                  Download All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Players Generated:</span>
                    <Badge variant="secondary">{result.players.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Coaches Generated:</span>
                    <Badge variant="secondary">{result.coaches.length}</Badge>
                  </div>
                  {result.summary && (
                    <>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span>
                          {(result.summary.processingTime / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Player Completeness:</span>
                        <span>
                          {(result.summary.avgPlayerCompleteness * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coach Completeness:</span>
                        <span>
                          {(result.summary.avgCoachCompleteness * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Issues */}
              {result.summary?.issues && result.summary.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Issues</h3>
                  <div className="space-y-1">
                    {result.summary.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="text-sm text-orange-600 bg-orange-50 p-2 rounded"
                      >
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sample Data Preview */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Sample Profiles</h3>
              <Tabs defaultValue="players" className="w-full">
                <TabsList>
                  <TabsTrigger value="players">Players</TabsTrigger>
                  <TabsTrigger value="coaches">Coaches</TabsTrigger>
                </TabsList>

                <TabsContent value="players">
                  {result.players.slice(0, 3).map((player, index) => (
                    <div key={index} className="border rounded p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{player.name}</h4>
                          <p className="text-sm text-gray-600">
                            {player.position} • {player.school}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {player.basicInfo && (
                            <Badge variant="outline">Bio</Badge>
                          )}
                          {player.stats && (
                            <Badge variant="outline">Stats</Badge>
                          )}
                          {player.accolades && (
                            <Badge variant="outline">Awards</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="coaches">
                  {result.coaches.slice(0, 3).map((coach, index) => (
                    <div key={index} className="border rounded p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{coach.name}</h4>
                          <p className="text-sm text-gray-600">
                            {coach.title} • {coach.school}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {coach.hire_date && (
                            <Badge variant="outline">Hired</Badge>
                          )}
                          {coach.career_record && (
                            <Badge variant="outline">Record</Badge>
                          )}
                          {coach.contract_details && (
                            <Badge variant="outline">Contract</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileGenerationPanel;
