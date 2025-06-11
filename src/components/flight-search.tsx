'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin,
  Users,
  DollarSign,
  Zap,
  Wifi,
  Coffee,
  Tv,
  Luggage,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Filter,
  ArrowRight,
  Timer
} from 'lucide-react';
import { Big12FlightAPI, FlightSearchRequest, FlightOption, BIG12_AIRPORTS } from '@/lib/flight-api';
import { toast } from 'sonner';

interface FlightSearchProps {
  className?: string;
  defaultOrigin?: string;
  defaultDestination?: string;
  quickScenario?: 'college_world_series' | 'football_championship' | 'basketball_tournament';
}

export function FlightSearch({ className, defaultOrigin, defaultDestination, quickScenario }: FlightSearchProps) {
  const [searchRequest, setSearchRequest] = useState<FlightSearchRequest>({
    origin: defaultOrigin || 'DFW',
    destination: defaultDestination || 'OMA',
    departureDate: getThisFriday(),
    passengers: { adults: 1 },
    cabinClass: 'economy',
    tripType: 'one_way'
  });

  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterStops, setFilterStops] = useState<'all' | 'nonstop' | 'one_stop'>('all');

  // Auto-search for specific scenarios
  useEffect(() => {
    if (quickScenario && defaultOrigin) {
      handleQuickSearch();
    }
  }, [quickScenario, defaultOrigin]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await Big12FlightAPI.searchFlights(searchRequest);
      setFlights(result.flights);
      setSearchTime(result.searchTime);
      
      if (result.flights.length === 0) {
        toast.error('No flights found for these criteria');
      } else {
        toast.success(`Found ${result.flights.length} flights`);
      }
    } catch (error) {
      console.error('Flight search error:', error);
      toast.error('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async () => {
    if (!quickScenario || !defaultOrigin) return;
    
    setLoading(true);
    try {
      const result = await Big12FlightAPI.quickSearch(quickScenario, defaultOrigin);
      setFlights(result.flights);
      setSearchTime(result.searchTime);
      setSearchRequest(result.request);
      
      if (result.flights.length === 0) {
        toast.error('No flights found for this event');
      } else {
        toast.success(`Found ${result.flights.length} flights to ${getEventName(quickScenario)}`);
      }
    } catch (error) {
      console.error('Quick search error:', error);
      toast.error('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedFlights = () => {
    let filtered = flights;

    // Apply stop filter
    if (filterStops === 'nonstop') {
      filtered = filtered.filter(f => f.stops === 0);
    } else if (filterStops === 'one_stop') {
      filtered = filtered.filter(f => f.stops === 1);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price.total - b.price.total;
        case 'duration':
          return a.duration - b.duration;
        case 'departure':
          return new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAirlineIcon = (code: string) => {
    // In a real app, you'd have airline logos
    return <Plane className="h-4 w-4" />;
  };

  const getStopsBadge = (stops: number) => {
    if (stops === 0) {
      return <Badge className="bg-green-100 text-green-800">Nonstop</Badge>;
    } else if (stops === 1) {
      return <Badge className="bg-yellow-100 text-yellow-800">1 Stop</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">{stops} Stops</Badge>;
    }
  };

  const getEventName = (scenario: string) => {
    switch (scenario) {
      case 'college_world_series': return 'College World Series';
      case 'football_championship': return 'Big 12 Football Championship';
      case 'basketball_tournament': return 'Big 12 Basketball Tournament';
      default: return 'Event';
    }
  };

  const getArrivalTime = (departureTime: string, duration: number) => {
    const dept = new Date(departureTime);
    const arrival = new Date(dept.getTime() + duration * 60000);
    return arrival.toISOString();
  };

  // Check if flight arrives in time for 1pm CT game
  const arrivesInTime = (flight: FlightOption) => {
    if (quickScenario !== 'college_world_series') return true;
    
    const arrivalTime = new Date(getArrivalTime(flight.departure.time, flight.duration));
    const gameTime = new Date(searchRequest.departureDate + 'T13:00:00'); // 1 PM CT
    const bufferTime = 2 * 60 * 60 * 1000; // 2 hours buffer
    
    return arrivalTime.getTime() + bufferTime <= gameTime.getTime();
  };

  const filteredFlights = getFilteredAndSortedFlights();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              Big 12 Flight Search
              {quickScenario && (
                <Badge variant="outline">{getEventName(quickScenario)}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {quickScenario 
                ? `Find flights to ${getEventName(quickScenario)} - Arizona plays at 1:00 PM CT`
                : 'Search and compare flights for Big 12 travel coordination'
              }
            </CardDescription>
          </div>
          {quickScenario && (
            <Button variant="outline" onClick={handleQuickSearch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Form */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="origin">From</Label>
            <Select value={searchRequest.origin} onValueChange={(value) => 
              setSearchRequest(prev => ({ ...prev, origin: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BIG12_AIRPORTS).map(([key, airport]) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">To</Label>
            <Select value={searchRequest.destination} onValueChange={(value) => 
              setSearchRequest(prev => ({ ...prev, destination: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BIG12_AIRPORTS).map(([key, airport]) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure</Label>
            <Input
              type="date"
              value={searchRequest.departureDate}
              onChange={(e) => setSearchRequest(prev => ({ ...prev, departureDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers">Passengers</Label>
            <Select value={searchRequest.passengers.adults.toString()} onValueChange={(value) => 
              setSearchRequest(prev => ({ ...prev, passengers: { adults: parseInt(value) } }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} Adult{num > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSearch} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Plane className="h-4 w-4 mr-2" />
                Search Flights
              </>
            )}
          </Button>
        </div>

        {/* Filters and Sort */}
        {flights.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStops} onValueChange={(value: any) => setFilterStops(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Flights</SelectItem>
                    <SelectItem value="nonstop">Nonstop Only</SelectItem>
                    <SelectItem value="one_stop">1 Stop Max</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="departure">Departure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
              {searchTime > 0 && ` in ${(searchTime / 1000).toFixed(1)}s`}
            </div>
          </div>
        )}

        {/* Flight Results */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-lg text-muted-foreground">Searching flights...</span>
          </div>
        )}

        {filteredFlights.length > 0 && !loading && (
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <Card key={flight.id} className={`border-2 ${arrivesInTime(flight) ? 'border-green-200' : 'border-yellow-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getAirlineIcon(flight.airlineCode)}
                      <div>
                        <div className="font-medium">{flight.airline}</div>
                        <div className="text-sm text-muted-foreground">{flight.flightNumber}</div>
                      </div>
                      {getStopsBadge(flight.stops)}
                      {quickScenario === 'college_world_series' && (
                        arrivesInTime(flight) ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Makes Game Time
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Tight Timing
                          </Badge>
                        )
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">${flight.price.total}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatTime(flight.departure.time)}</div>
                      <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
                      <div className="text-xs text-muted-foreground">
                        Terminal {flight.departure.terminal} • Gate {flight.departure.gate}
                      </div>
                    </div>

                    <div className="text-center flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <div className="h-px bg-border flex-1" />
                        <ArrowRight className="h-4 w-4" />
                        <div className="h-px bg-border flex-1" />
                      </div>
                      <div className="text-sm font-medium">{formatDuration(flight.duration)}</div>
                      <div className="text-xs text-muted-foreground">{flight.aircraft}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatTime(getArrivalTime(flight.departure.time, flight.duration))}</div>
                      <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
                      <div className="text-xs text-muted-foreground">
                        Terminal {flight.arrival.terminal} • Gate {flight.arrival.gate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Luggage className="h-4 w-4" />
                        <span>{flight.baggage.checked}</span>
                      </div>
                      {flight.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1">
                          {amenity === 'WiFi' && <Wifi className="h-4 w-4" />}
                          {amenity === 'Entertainment' && <Tv className="h-4 w-4" />}
                          {amenity === 'Snacks' && <Coffee className="h-4 w-4" />}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild>
                      <a href={flight.bookingUrl} target="_blank" rel="noopener noreferrer">
                        Book Flight
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {flights.length === 0 && !loading && (
          <div className="text-center py-12">
            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No flights found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or dates
            </p>
            <Button onClick={handleSearch}>
              Search Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getThisFriday(): string {
  const today = new Date();
  const friday = new Date();
  friday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
  return friday.toISOString().split('T')[0];
}