/**
 * Media Day Profile Schemas for FlexTime
 * Comprehensive player and coach profile system for Big 12 Media Day coverage
 */

// Player Profile Schema
export const PlayerProfileSchema = {
  id: String, // Unique identifier
  name: String, // Full player name
  school: String, // School name
  conference: String, // Conference (Big 12)
  position: String, // Position abbreviation (QB, RB, WR, etc.)
  position_type: String, // Position category (quarterback, running_back, etc.)
  jersey_number: Number, // Jersey number
  year: String, // Class year (Fr, So, Jr, Sr, Grad)
  height: String, // Height (e.g., "6'2\"")
  weight: Number, // Weight in pounds
  hometown: String, // Hometown
  high_school: String, // High school
  bio: String, // Player biography
  stats: {
    // Career/season statistics
    passing: {
      completions: Number,
      attempts: Number,
      yards: Number,
      touchdowns: Number,
      interceptions: Number,
      rating: Number,
    },
    rushing: {
      carries: Number,
      yards: Number,
      touchdowns: Number,
      avg: Number,
    },
    receiving: {
      receptions: Number,
      yards: Number,
      touchdowns: Number,
      avg: Number,
    },
    defense: {
      tackles: Number,
      sacks: Number,
      interceptions: Number,
      forced_fumbles: Number,
    },
  },
  accolades: [String], // Awards and honors
  media_day_topics: [String], // Key talking points for media day
  social_media: {
    twitter: String,
    instagram: String,
  },
  academic_info: {
    major: String,
    gpa: Number,
    academic_honors: [String],
  },
  created_at: Date,
  updated_at: Date,
};

// Coach Profile Schema
export const CoachProfileSchema = {
  id: String, // Unique identifier
  name: String, // Full coach name
  school: String, // School name
  conference: String, // Conference (Big 12)
  title: String, // Official title (Head Coach, etc.)
  hire_date: Date, // Date hired at current school
  contract_details: {
    length: Number, // Contract length in years
    salary: Number, // Annual salary
    buyout: Number, // Buyout clause amount
  },
  background: {
    birth_date: Date,
    hometown: String,
    alma_mater: String,
    playing_career: String,
    coaching_philosophy: String,
  },
  career_record: {
    overall_wins: Number,
    overall_losses: Number,
    conference_wins: Number,
    conference_losses: Number,
    bowl_record: String,
    championships: [String],
  },
  coaching_history: [
    {
      school: String,
      position: String,
      start_year: Number,
      end_year: Number,
      accomplishments: [String],
    },
  ],
  current_season: {
    year: Number,
    expectations: String,
    key_players: [String],
    schedule_highlights: [String],
  },
  media_day_talking_points: [String],
  recruiting_focus: [String],
  family: {
    spouse: String,
    children: [String],
  },
  social_media: {
    twitter: String,
    instagram: String,
  },
  created_at: Date,
  updated_at: Date,
};

// Media Day Event Schema
export const MediaDayEventSchema = {
  id: String,
  name: String, // "Big 12 Football Media Day 2025"
  date: Date,
  location: String,
  year: Number,
  schools_attending: [String],
  players: [String], // Array of player IDs
  coaches: [String], // Array of coach IDs
  schedule: [
    {
      time: String,
      activity: String,
      participants: [String],
    },
  ],
  media_information: {
    press_conference_schedule: [String],
    interview_availability: [String],
    photo_opportunities: [String],
  },
  created_at: Date,
  updated_at: Date,
};

// Profile Template Functions
export const ProfileTemplates = {
  /**
   * Generate basic player profile template
   */
  createPlayerProfile: (playerData) => ({
    ...PlayerProfileSchema,
    id: generateId('player'),
    name: playerData.name,
    school: playerData.school,
    conference: 'Big 12',
    position: playerData.position,
    position_type: playerData.type,
    media_day_topics: generateMediaTopics(playerData),
    created_at: new Date(),
    updated_at: new Date(),
  }),

  /**
   * Generate basic coach profile template
   */
  createCoachProfile: (coachData) => ({
    ...CoachProfileSchema,
    id: generateId('coach'),
    name: coachData.name,
    school: coachData.school,
    conference: 'Big 12',
    title: 'Head Coach',
    media_day_talking_points: generateCoachTopics(coachData),
    created_at: new Date(),
    updated_at: new Date(),
  }),

  /**
   * Generate Media Day event template
   */
  createMediaDayEvent: (eventData) => ({
    ...MediaDayEventSchema,
    id: generateId('event'),
    name: `Big 12 Football Media Day ${eventData.year}`,
    year: eventData.year,
    date: eventData.date,
    location: eventData.location || 'AT&T Stadium, Arlington, TX',
    schools_attending: getAllBig12Schools(),
    created_at: new Date(),
    updated_at: new Date(),
  }),
};

// Helper Functions
function generateId(type) {
  return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateMediaTopics(playerData) {
  const topics = [];

  switch (playerData.position) {
    case 'QB':
      topics.push('Leadership role', 'Offensive system', 'Team expectations');
      break;
    case 'RB':
      topics.push(
        'Running game strategy',
        'Physical preparation',
        'Team chemistry'
      );
      break;
    case 'WR':
      topics.push(
        'Receiving corps depth',
        'Chemistry with QB',
        'Route running'
      );
      break;
    default:
      topics.push('Team preparation', 'Individual goals', 'Conference outlook');
  }

  return topics;
}

function generateCoachTopics(coachData) {
  return [
    'Season expectations',
    'Team culture and leadership',
    'Recruiting strategy',
    'Conference competitiveness',
    'Key players and depth chart',
    'Coaching staff changes',
    'Schedule challenges',
    'Program development',
  ];
}

function getAllBig12Schools() {
  return [
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
}

// Export schemas and templates
export default {
  PlayerProfileSchema,
  CoachProfileSchema,
  MediaDayEventSchema,
  ProfileTemplates,
};
