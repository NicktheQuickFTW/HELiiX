'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  MapPin,
  Zap,
  Brain,
  ChevronRight,
  BarChart3,
  Globe,
  Activity,
  Sparkles,
  Award,
  Flag,
  Medal,
  Target,
  Gamepad2,
  Timer,
  Plane,
  DollarSign,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Badge, Button, Card, Column } from '@once-ui-system/core';

// Big 12 Schools Data
const big12Schools = [
  {
    name: 'Arizona',
    logo: '/assets/logos/teams/arizona.svg',
    primary: '#003366',
    secondary: '#C10230',
    wins: 8,
    losses: 4,
  },
  {
    name: 'Arizona State',
    logo: '/assets/logos/teams/arizona_state.svg',
    primary: '#8C1D40',
    secondary: '#FFC627',
    wins: 10,
    losses: 2,
  },
  {
    name: 'Baylor',
    logo: '/assets/logos/teams/baylor.svg',
    primary: '#003015',
    secondary: '#FFB81C',
    wins: 7,
    losses: 5,
  },
  {
    name: 'BYU',
    logo: '/assets/logos/teams/byu.svg',
    primary: '#002E5D',
    secondary: '#FFFFFF',
    wins: 9,
    losses: 3,
  },
  {
    name: 'Cincinnati',
    logo: '/assets/logos/teams/cincinnati.svg',
    primary: '#E00122',
    secondary: '#000000',
    wins: 6,
    losses: 6,
  },
  {
    name: 'Colorado',
    logo: '/assets/logos/teams/colorado.svg',
    primary: '#CFB87C',
    secondary: '#565A5C',
    wins: 5,
    losses: 7,
  },
  {
    name: 'Houston',
    logo: '/assets/logos/teams/houston.svg',
    primary: '#C8102E',
    secondary: '#FFFFFF',
    wins: 8,
    losses: 4,
  },
  {
    name: 'Iowa State',
    logo: '/assets/logos/teams/iowa_state.svg',
    primary: '#C8102E',
    secondary: '#F1BE48',
    wins: 11,
    losses: 1,
  },
  {
    name: 'Kansas',
    logo: '/assets/logos/teams/kansas.svg',
    primary: '#0051BA',
    secondary: '#E8000D',
    wins: 7,
    losses: 5,
  },
  {
    name: 'Kansas State',
    logo: '/assets/logos/teams/kansas_state.svg',
    primary: '#512888',
    secondary: '#D1D1D1',
    wins: 9,
    losses: 3,
  },
  {
    name: 'Oklahoma State',
    logo: '/assets/logos/teams/oklahoma_state.svg',
    primary: '#FF7300',
    secondary: '#000000',
    wins: 8,
    losses: 4,
  },
  {
    name: 'TCU',
    logo: '/assets/logos/teams/tcu.svg',
    primary: '#4D1979',
    secondary: '#FFFFFF',
    wins: 6,
    losses: 6,
  },
  {
    name: 'Texas Tech',
    logo: '/assets/logos/teams/texas_tech.svg',
    primary: '#CC0000',
    secondary: '#000000',
    wins: 7,
    losses: 5,
  },
  {
    name: 'UCF',
    logo: '/assets/logos/teams/ucf.svg',
    primary: '#BA9B37',
    secondary: '#000000',
    wins: 5,
    losses: 7,
  },
  {
    name: 'Utah',
    logo: '/assets/logos/teams/utah.svg',
    primary: '#CC0000',
    secondary: '#FFFFFF',
    wins: 8,
    losses: 4,
  },
  {
    name: 'West Virginia',
    logo: '/assets/logos/teams/west_virginia.svg',
    primary: '#002855',
    secondary: '#EAAA00',
    wins: 6,
    losses: 6,
  },
];

// Conference Map Visualization
const ConferenceMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const schoolPositions = useRef<
    Array<{
      x: number;
      y: number;
      school: (typeof big12Schools)[0];
      pulse: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize school positions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    schoolPositions.current = big12Schools.map((school, i) => {
      const angle = (i / big12Schools.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        school,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    const animate = () => {
      ctx.fillStyle = 'rgba(248, 249, 250, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      schoolPositions.current.forEach((pos1, i) => {
        schoolPositions.current.forEach((pos2, j) => {
          if (i >= j) return;

          const distance = Math.sqrt(
            Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
          );

          if (distance < radius * 0.8) {
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.strokeStyle = `rgba(0, 149, 255, ${0.05 + Math.sin(Date.now() * 0.001) * 0.02})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw schools
      schoolPositions.current.forEach((pos) => {
        pos.pulse += 0.02;
        const pulseSize = 1 + Math.sin(pos.pulse) * 0.1;

        // Draw glow
        const gradient = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          20 * pulseSize
        );
        gradient.addColorStop(0, 'rgba(0, 149, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 149, 255, 0)');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20 * pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw node
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#0095FF';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-full"
    />
  );
};

// 3D Tilt Card Component
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX((y - centerY) / 10);
    setRotateY((centerX - x) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// Championship Tracker Component
const ChampionshipTracker: React.FC = () => {
  const championships = [
    {
      sport: 'Football',
      team: 'Kansas State',
      date: 'Dec 2, 2024',
      icon: '🏈',
    },
    { sport: 'Basketball', team: 'Kansas', date: 'Mar 15, 2024', icon: '🏀' },
    { sport: 'Baseball', team: 'Texas Tech', date: 'May 28, 2024', icon: '⚾' },
    { sport: 'Volleyball', team: 'Baylor', date: 'Nov 20, 2024', icon: '🏐' },
  ];

  return (
    <div className="space-y-4">
      {championships.map((champ, i) => (
        <motion.div
          key={champ.sport}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{champ.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{champ.sport}</p>
              <p className="text-sm text-gray-600">{champ.team}</p>
            </div>
          </div>
          <div className="text-right">
            <Trophy className="w-5 h-5 text-amber-500 mb-1" />
            <p className="text-xs text-gray-500">{champ.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Live Game Ticker
const LiveGameTicker: React.FC = () => {
  const games = [
    {
      home: 'Kansas',
      away: 'Iowa State',
      homeScore: 78,
      awayScore: 82,
      time: 'FINAL',
      sport: '🏀',
    },
    {
      home: 'Baylor',
      away: 'TCU',
      homeScore: 21,
      awayScore: 14,
      time: '3rd QTR',
      sport: '🏈',
    },
    {
      home: 'Texas Tech',
      away: 'Oklahoma State',
      homeScore: 3,
      awayScore: 2,
      time: '7th INN',
      sport: '⚾',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        animate={{ x: [0, -100 + '%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...games, ...games].map((game, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur rounded-full border border-gray-200"
          >
            <span className="text-2xl">{game.sport}</span>
            <div className="flex items-center gap-3">
              <span
                className={`font-semibold ${game.homeScore > game.awayScore ? 'text-green-600' : 'text-gray-700'}`}
              >
                {game.home} {game.homeScore}
              </span>
              <span className="text-gray-400">vs</span>
              <span
                className={`font-semibold ${game.awayScore > game.homeScore ? 'text-green-600' : 'text-gray-700'}`}
              >
                {game.awayScore} {game.away}
              </span>
            </div>
            <Badge
              variant={game.time === 'FINAL' ? 'secondary' : 'default'}
              className="bg-blue-100 text-blue-700"
            >
              {game.time}
            </Badge>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Main Dashboard Component
const Big12Dashboard: React.FC = () => {
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 1000], [0, 1]);
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230095FF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ProgressBar Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur-lg opacity-50"
                />
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Big 12 Conference
                </h1>
                <p className="text-sm text-gray-600">Operations Dashboard</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {['Overview', 'Championships', 'Analytics', 'Operations'].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setActiveView(item.toLowerCase())}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeView === item.toLowerCase()
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </nav>

            <MagneticButton className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </MagneticButton>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Live Ticker */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to the Future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Conference Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time insights, AI-powered analytics, and seamless operations
              for all 16 member institutions
            </p>
          </motion.div>

          <LiveGameTicker />
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TiltCard>
            <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  100%
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Member Schools
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                <AnimatedCounter to={16} />
              </p>
              <p className="text-xs text-gray-500 mt-2">All schools active</p>
            </Card>
          </TiltCard>

          <TiltCard>
            <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-amber-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  23%
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Championships
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                <AnimatedCounter to={47} />
              </p>
              <p className="text-xs text-gray-500 mt-2">This academic year</p>
            </Card>
          </TiltCard>

          <TiltCard>
            <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  8%
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Live Events</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                <AnimatedCounter to={12} />
              </p>
              <p className="text-xs text-gray-500 mt-2">Happening now</p>
            </Card>
          </TiltCard>

          <TiltCard>
            <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  15%
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                $<AnimatedCounter to={2.3} decimals={1} />B
              </p>
              <p className="text-xs text-gray-500 mt-2">FY 2024-25</p>
            </Card>
          </TiltCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conference Map */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Conference Network
                </h3>
                <Badge className="bg-blue-100 text-blue-700">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="h-96 relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
                <ConferenceMap />
              </div>
            </Card>
          </div>

          {/* Championship Tracker */}
          <div>
            <Card className="p-6 bg-white/90 backdrop-blur border-0 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Recent Champions
              </h3>
              <ChampionshipTracker />
            </Card>
          </div>
        </div>

        {/* Schools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Member Institutions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {big12Schools.map((school, i) => (
              <motion.div
                key={school.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Card className="p-4 bg-white/90 backdrop-blur border-0 shadow-lg cursor-pointer overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${school.primary}20, ${school.secondary}20)`,
                    }}
                  />
                  <div className="relative">
                    <div className="aspect-square flex items-center justify-center mb-2">
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <p className="text-xs font-medium text-center text-gray-700">
                      {school.name}
                    </p>
                    <div className="flex justify-center gap-1 mt-1">
                      <span className="text-xs text-green-600 font-semibold">
                        {school.wins}W
                      </span>
                      <span className="text-xs text-gray-400">-</span>
                      <span className="text-xs text-red-600 font-semibold">
                        {school.losses}L
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg cursor-pointer">
              <Calendar className="w-8 h-8 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Schedule Event</h4>
              <p className="text-sm opacity-90">
                Create and manage conference events
              </p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0 shadow-lg cursor-pointer">
              <Award className="w-8 h-8 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Awards Program</h4>
              <p className="text-sm opacity-90">
                Manage championships and recognition
              </p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-lg cursor-pointer">
              <BarChart3 className="w-8 h-8 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Analytics Hub</h4>
              <p className="text-sm opacity-90">
                Deep dive into conference metrics
              </p>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <MagneticButton className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center">
          <Zap className="w-6 h-6" />
        </MagneticButton>
      </motion.div>
    </div>
  );
};

export default Big12Dashboard;
