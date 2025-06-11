/**
 * Flight Search API Integration for Big 12 Travel Coordination
 * Uses multiple sources to find and compare flight options
 */

// Airport codes for Big 12 cities and common destinations
export const BIG12_AIRPORTS = {
  // Big 12 School Cities
  ARIZONA: { code: 'PHX', city: 'Phoenix', name: 'Phoenix Sky Harbor International' },
  ARIZONA_STATE: { code: 'PHX', city: 'Phoenix', name: 'Phoenix Sky Harbor International' },
  BAYLOR: { code: 'ACT', city: 'Waco', name: 'Waco Regional Airport' },
  BYU: { code: 'SLC', city: 'Salt Lake City', name: 'Salt Lake City International' },
  CINCINNATI: { code: 'CVG', city: 'Cincinnati', name: 'Cincinnati/Northern Kentucky International' },
  COLORADO: { code: 'DEN', city: 'Denver', name: 'Denver International Airport' },
  HOUSTON: { code: 'IAH', city: 'Houston', name: 'George Bush Intercontinental' },
  IOWA_STATE: { code: 'DSM', city: 'Des Moines', name: 'Des Moines International' },
  KANSAS: { code: 'MCI', city: 'Kansas City', name: 'Kansas City International' },
  KANSAS_STATE: { code: 'MHK', city: 'Manhattan', name: 'Manhattan Regional Airport' },
  OKLAHOMA_STATE: { code: 'OKC', city: 'Oklahoma City', name: 'Will Rogers World Airport' },
  TCU: { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International' },
  TEXAS_TECH: { code: 'LBB', city: 'Lubbock', name: 'Lubbock Preston Smith International' },
  UCF: { code: 'MCO', city: 'Orlando', name: 'Orlando International Airport' },
  UTAH: { code: 'SLC', city: 'Salt Lake City', name: 'Salt Lake City International' },
  WEST_VIRGINIA: { code: 'CRW', city: 'Charleston', name: 'Charleston Yeager Airport' },
  
  // Championship/Event Cities
  ARLINGTON: { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International' },
  KANSAS_CITY_CHAMP: { code: 'MCI', city: 'Kansas City', name: 'Kansas City International' },
  OMAHA: { code: 'OMA', city: 'Omaha', name: 'Eppley Airfield' },
  INDIANAPOLIS: { code: 'IND', city: 'Indianapolis', name: 'Indianapolis International' }
} as const;

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD for round trip
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'one_way' | 'round_trip';
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal?: string;
    gate?: string;
  };
  duration: number; // minutes
  stops: number;
  aircraft: string;
  price: {
    total: number;
    currency: string;
    breakdown?: {
      base: number;
      taxes: number;
      fees: number;
    };
  };
  bookingUrl: string;
  amenities: string[];
  baggage: {
    carry_on: boolean;
    checked: string;
  };
  source: 'amadeus' | 'skyscanner' | 'kayak' | 'direct';
}

export interface FlightSearchResponse {
  request: FlightSearchRequest;
  flights: FlightOption[];
  total: number;
  searchTime: number;
  lastUpdated: string;
}

/**
 * Amadeus API Integration (requires API key)
 */
export class AmadeusFlightAPI {
  private static API_KEY = process.env.AMADEUS_API_KEY;
  private static API_SECRET = process.env.AMADEUS_API_SECRET;
  private static BASE_URL = 'https://test.api.amadeus.com/v2';

  static async searchFlights(request: FlightSearchRequest): Promise<FlightOption[]> {
    if (!this.API_KEY || !this.API_SECRET) {
      console.warn('Amadeus API credentials not configured');
      return [];
    }

    try {
      // Get access token first
      const token = await this.getAccessToken();
      
      const searchParams = new URLSearchParams({
        originLocationCode: request.origin,
        destinationLocationCode: request.destination,
        departureDate: request.departureDate,
        adults: request.passengers.adults.toString(),
        travelClass: request.cabinClass.toUpperCase(),
        nonStop: 'false',
        max: '50'
      });

      if (request.returnDate) {
        searchParams.set('returnDate', request.returnDate);
      }

      const response = await fetch(
        `${this.BASE_URL}/shopping/flight-offers?${searchParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Amadeus API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAmadeusResponse(data);
    } catch (error) {
      console.error('Amadeus API error:', error);
      return [];
    }
  }

  private static async getAccessToken(): Promise<string> {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.API_KEY!,
        client_secret: this.API_SECRET!
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  private static parseAmadeusResponse(data: any): FlightOption[] {
    return data.data?.map((offer: any) => {
      const segment = offer.itineraries[0].segments[0];
      return {
        id: offer.id,
        airline: segment.carrierCode,
        airlineCode: segment.carrierCode,
        flightNumber: `${segment.carrierCode}${segment.number}`,
        departure: {
          airport: segment.departure.iataCode,
          time: segment.departure.at,
          terminal: segment.departure.terminal
        },
        arrival: {
          airport: segment.arrival.iataCode,
          time: segment.arrival.at,
          terminal: segment.arrival.terminal
        },
        duration: this.parseDuration(offer.itineraries[0].duration),
        stops: offer.itineraries[0].segments.length - 1,
        aircraft: segment.aircraft?.code || 'Unknown',
        price: {
          total: parseFloat(offer.price.total),
          currency: offer.price.currency
        },
        bookingUrl: offer.source || '',
        amenities: [],
        baggage: {
          carry_on: true,
          checked: '1 bag'
        },
        source: 'amadeus'
      };
    }) || [];
  }

  private static parseDuration(duration: string): number {
    // Parse ISO 8601 duration (PT2H30M) to minutes
    const hours = duration.match(/(\d+)H/)?.[1] || '0';
    const minutes = duration.match(/(\d+)M/)?.[1] || '0';
    return parseInt(hours) * 60 + parseInt(minutes);
  }
}

/**
 * Mock Flight Search for Development
 */
export class MockFlightAPI {
  static async searchFlights(request: FlightSearchRequest): Promise<FlightOption[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockFlights: FlightOption[] = [
      {
        id: 'AA1234',
        airline: 'American Airlines',
        airlineCode: 'AA',
        flightNumber: 'AA1234',
        departure: {
          airport: request.origin,
          time: this.getMockDepartureTime(request.departureDate, 'morning'),
          terminal: 'E',
          gate: 'E15'
        },
        arrival: {
          airport: request.destination,
          time: this.getMockArrivalTime(request.departureDate, 'morning', 120),
          terminal: 'B',
          gate: 'B8'
        },
        duration: 120,
        stops: 0,
        aircraft: 'Boeing 737-800',
        price: {
          total: 285,
          currency: 'USD',
          breakdown: {
            base: 245,
            taxes: 28,
            fees: 12
          }
        },
        bookingUrl: 'https://aa.com/booking/...',
        amenities: ['WiFi', 'Power outlets', 'Snacks'],
        baggage: {
          carry_on: true,
          checked: '1 bag free'
        },
        source: 'direct'
      },
      {
        id: 'UA5678',
        airline: 'United Airlines',
        airlineCode: 'UA',
        flightNumber: 'UA5678',
        departure: {
          airport: request.origin,
          time: this.getMockDepartureTime(request.departureDate, 'afternoon'),
          terminal: 'C',
          gate: 'C22'
        },
        arrival: {
          airport: request.destination,
          time: this.getMockArrivalTime(request.departureDate, 'afternoon', 145),
          terminal: 'A',
          gate: 'A12'
        },
        duration: 145,
        stops: 1,
        aircraft: 'Airbus A320',
        price: {
          total: 245,
          currency: 'USD',
          breakdown: {
            base: 215,
            taxes: 22,
            fees: 8
          }
        },
        bookingUrl: 'https://united.com/booking/...',
        amenities: ['WiFi', 'Entertainment', 'Snacks'],
        baggage: {
          carry_on: true,
          checked: '$35 first bag'
        },
        source: 'direct'
      },
      {
        id: 'WN9012',
        airline: 'Southwest Airlines',
        airlineCode: 'WN',
        flightNumber: 'WN9012',
        departure: {
          airport: request.origin,
          time: this.getMockDepartureTime(request.departureDate, 'evening'),
          terminal: 'E',
          gate: 'E8'
        },
        arrival: {
          airport: request.destination,
          time: this.getMockArrivalTime(request.departureDate, 'evening', 135),
          terminal: 'Main',
          gate: '15'
        },
        duration: 135,
        stops: 0,
        aircraft: 'Boeing 737-700',
        price: {
          total: 198,
          currency: 'USD',
          breakdown: {
            base: 178,
            taxes: 18,
            fees: 2
          }
        },
        bookingUrl: 'https://southwest.com/booking/...',
        amenities: ['WiFi', 'Free snacks', 'Live TV'],
        baggage: {
          carry_on: true,
          checked: '2 bags free'
        },
        source: 'direct'
      }
    ];

    return mockFlights;
  }

  private static getMockDepartureTime(date: string, timeOfDay: 'morning' | 'afternoon' | 'evening'): string {
    const times = {
      morning: '08:30',
      afternoon: '14:45',
      evening: '19:15'
    };
    return `${date}T${times[timeOfDay]}:00`;
  }

  private static getMockArrivalTime(date: string, timeOfDay: 'morning' | 'afternoon' | 'evening', durationMinutes: number): string {
    const departure = new Date(`${date}T${this.getMockDepartureTime(date, timeOfDay).split('T')[1]}`);
    const arrival = new Date(departure.getTime() + durationMinutes * 60000);
    return `${date}T${arrival.toTimeString().slice(0, 5)}:00`;
  }
}

/**
 * Unified Flight Search API
 */
export class Big12FlightAPI {
  static async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResponse> {
    const startTime = Date.now();
    
    try {
      // Try multiple sources in parallel
      const [amadeusFlights, mockFlights] = await Promise.allSettled([
        AmadeusFlightAPI.searchFlights(request),
        MockFlightAPI.searchFlights(request)
      ]);

      let allFlights: FlightOption[] = [];

      if (amadeusFlights.status === 'fulfilled' && amadeusFlights.value.length > 0) {
        allFlights.push(...amadeusFlights.value);
      } else if (mockFlights.status === 'fulfilled') {
        allFlights.push(...mockFlights.value);
      }

      // Sort by price
      allFlights.sort((a, b) => a.price.total - b.price.total);

      return {
        request,
        flights: allFlights,
        total: allFlights.length,
        searchTime: Date.now() - startTime,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Flight search error:', error);
      throw error;
    }
  }

  /**
   * Get quick search for specific Big 12 travel scenarios
   */
  static async quickSearch(scenario: 'college_world_series' | 'football_championship' | 'basketball_tournament', origin: string): Promise<FlightSearchResponse> {
    const scenarios = {
      college_world_series: {
        destination: 'OMA',
        departureDate: this.getNextFriday(),
        returnDate: this.addDays(this.getNextFriday(), 3)
      },
      football_championship: {
        destination: 'DFW',
        departureDate: this.getNextSaturday(),
        returnDate: this.addDays(this.getNextSaturday(), 1)
      },
      basketball_tournament: {
        destination: 'MCI',
        departureDate: this.getNextFriday(),
        returnDate: this.addDays(this.getNextFriday(), 4)
      }
    };

    const config = scenarios[scenario];
    
    const request: FlightSearchRequest = {
      origin,
      destination: config.destination,
      departureDate: config.departureDate,
      returnDate: config.returnDate,
      passengers: { adults: 1 },
      cabinClass: 'economy',
      tripType: 'round_trip'
    };

    return this.searchFlights(request);
  }

  private static getNextFriday(): string {
    const today = new Date();
    const friday = new Date();
    friday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
    return friday.toISOString().split('T')[0];
  }

  private static getNextSaturday(): string {
    const today = new Date();
    const saturday = new Date();
    saturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
    return saturday.toISOString().split('T')[0];
  }

  private static addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}

export default Big12FlightAPI;