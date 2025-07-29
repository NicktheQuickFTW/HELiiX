/**
 * Media Day Profile Manager Component
 * Comprehensive player and coach profile management for Big 12 Media Day
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfileTemplates } from '@/lib/schemas/media-day-profiles';

const MediaDayProfileManager = () => {
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [viewMode, setViewMode] = useState('players'); // 'players', 'coaches', 'combined'
  const [searchTerm, setSearchTerm] = useState('');

  const big12Schools = [
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

  useEffect(() => {
    loadMediaDayData();
  }, []);

  const loadMediaDayData = async () => {
    try {
      // Load player data
      const playerResponse = await fetch(
        '/data/media-day/big12-football-players-2025.json'
      );
      const playerData = await playerResponse.json();
      setPlayers(Object.values(playerData.media_day_players_2025.schools));

      // Load coach data
      const coachResponse = await fetch(
        '/data/media-day/big12-football-coaches-2025.json'
      );
      const coachData = await coachResponse.json();
      setCoaches(Object.values(coachData.big12_football_coaches_2025.coaches));
    } catch (error) {
      console.error('Error loading Media Day data:', error);
    }
  };

  const filteredPlayers = players.filter((school) => {
    if (selectedSchool !== 'all' && school.school !== selectedSchool)
      return false;
    if (searchTerm) {
      return school.players.some(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          player.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const filteredCoaches = coaches.filter((school) => {
    if (selectedSchool !== 'all' && school.school !== selectedSchool)
      return false;
    if (searchTerm) {
      return school.coach.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const PlayerCard = ({ player, school }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{player.name}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{player.position}</Badge>
              <Badge variant="outline">{school}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <strong>Position Type:</strong> {player.type.replace('_', ' ')}
          </div>
          <div className="text-sm">
            <strong>Media Day Topics:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {getMediaTopics(player).map((topic, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CoachCard = ({ coach, school }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{coach.name}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="default">{school}</Badge>
              <Badge variant="secondary">Head Coach</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Hired:</strong> {new Date(coach.hire_date).getFullYear()}
            </div>
            <div>
              <strong>Contract:</strong> Through {coach.contract.end_year}
            </div>
            <div>
              <strong>Record:</strong> {coach.career_record.overall_wins}-
              {coach.career_record.overall_losses}
            </div>
            <div>
              <strong>Salary:</strong>{' '}
              {coach.contract.salary_2025 ||
                coach.contract.estimated_salary_2025 ||
                'N/A'}
            </div>
          </div>

          <div>
            <strong className="text-sm">Key Accomplishments:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {coach.accomplishments?.slice(0, 3).map((achievement, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <strong className="text-sm">2025 Expectations:</strong>
            <p className="text-sm text-gray-600 mt-1">
              {coach.current_season.expectations}
            </p>
          </div>

          <div>
            <strong className="text-sm">Media Day Topics:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {coach.media_day_talking_points?.slice(0, 4).map((topic, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getMediaTopics = (player) => {
    const topics = [];
    switch (player.position) {
      case 'QB':
        topics.push('Leadership', 'Offensive System', 'Team Expectations');
        break;
      case 'RB':
        topics.push('Running Game', 'Physical Prep', 'Team Chemistry');
        break;
      case 'WR':
        topics.push('Receiving Corps', 'QB Chemistry', 'Route Running');
        break;
      case 'TE':
        topics.push('Dual Threat', 'Blocking', 'Red Zone');
        break;
      case 'OL':
      case 'C':
        topics.push('Protection', 'Run Blocking', 'Leadership');
        break;
      case 'DL':
      case 'DE':
      case 'DT':
        topics.push('Pass Rush', 'Run Defense', 'Pressure');
        break;
      case 'LB':
        topics.push('Coverage', 'Run Support', 'Leadership');
        break;
      case 'DB':
      case 'S':
        topics.push('Coverage', 'Ball Skills', 'Communication');
        break;
      case 'K':
        topics.push('Field Goals', 'Consistency', 'Pressure');
        break;
      default:
        topics.push('Team Prep', 'Individual Goals', 'Conference');
    }
    return topics;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Big 12 Media Day Profile Manager
          </h1>
          <p className="text-gray-600">
            Comprehensive player and coach profiles for 2025 Big 12 Football
            Media Day
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('players')}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                    viewMode === 'players'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Players
                </button>
                <button
                  onClick={() => setViewMode('coaches')}
                  className={`px-3 py-2 text-sm font-medium border-t border-b ${
                    viewMode === 'coaches'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Coaches
                </button>
                <button
                  onClick={() => setViewMode('combined')}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                    viewMode === 'combined'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Combined
                </button>
              </div>
            </div>

            {/* School Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Filter
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Schools</option>
                {big12Schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Search players, coaches, positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm">
                Export Data
              </Button>
              <Button size="sm">Add Profile</Button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {players.reduce(
                  (acc, school) => acc + school.players.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Players</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">16</div>
              <div className="text-sm text-gray-600">Head Coaches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">16</div>
              <div className="text-sm text-gray-600">Big 12 Schools</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredPlayers.length + filteredCoaches.length}
              </div>
              <div className="text-sm text-gray-600">Filtered Results</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Players Column */}
          {(viewMode === 'players' || viewMode === 'combined') && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Media Day Players
              </h2>
              <div className="space-y-4">
                {filteredPlayers.map((school) =>
                  school.players.map((player) => (
                    <PlayerCard
                      key={`${school.school}-${player.name}`}
                      player={player}
                      school={school.school}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Coaches Column */}
          {(viewMode === 'coaches' || viewMode === 'combined') && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Head Coaches
              </h2>
              <div className="space-y-4">
                {filteredCoaches.map((school) => (
                  <CoachCard
                    key={school.school}
                    coach={school.coach}
                    school={school.school}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaDayProfileManager;
