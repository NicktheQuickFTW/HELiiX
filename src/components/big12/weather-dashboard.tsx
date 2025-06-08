'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Wind, 
  Thermometer,
  AlertTriangle,
  MapPin,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';

// Big 12 Schools with locations
const big12Schools = [
  { name: 'Arizona', city: 'Tucson', state: 'AZ', lat: 32.2319, lon: -110.9501, timezone: 'MST' },
  { name: 'Arizona State', city: 'Tempe', state: 'AZ', lat: 33.4242, lon: -111.9281, timezone: 'MST' },
  { name: 'Baylor', city: 'Waco', state: 'TX', lat: 31.5489, lon: -97.1131, timezone: 'CST' },
  { name: 'BYU', city: 'Provo', state: 'UT', lat: 40.2338, lon: -111.6585, timezone: 'MST' },
  { name: 'UCF', city: 'Orlando', state: 'FL', lat: 28.6024, lon: -81.2001, timezone: 'EST' },
  { name: 'Cincinnati', city: 'Cincinnati', state: 'OH', lat: 39.1329, lon: -84.5150, timezone: 'EST' },
  { name: 'Colorado', city: 'Boulder', state: 'CO', lat: 40.0076, lon: -105.2659, timezone: 'MST' },
  { name: 'Houston', city: 'Houston', state: 'TX', lat: 29.7199, lon: -95.3422, timezone: 'CST' },
  { name: 'Iowa State', city: 'Ames', state: 'IA', lat: 42.0267, lon: -93.6465, timezone: 'CST' },
  { name: 'Kansas', city: 'Lawrence', state: 'KS', lat: 38.9543, lon: -95.2558, timezone: 'CST' },
  { name: 'Kansas State', city: 'Manhattan', state: 'KS', lat: 39.1974, lon: -96.5847, timezone: 'CST' },
  { name: 'Oklahoma State', city: 'Stillwater', state: 'OK', lat: 36.1271, lon: -97.0737, timezone: 'CST' },
  { name: 'TCU', city: 'Fort Worth', state: 'TX', lat: 32.7098, lon: -97.3629, timezone: 'CST' },
  { name: 'Texas Tech', city: 'Lubbock', state: 'TX', lat: 33.5843, lon: -101.8748, timezone: 'CST' },
  { name: 'Utah', city: 'Salt Lake City', state: 'UT', lat: 40.7649, lon: -111.8421, timezone: 'MST' },
  { name: 'West Virginia', city: 'Morgantown', state: 'WV', lat: 39.6350, lon: -79.9559, timezone: 'EST' }
];

// Sample weather data (would be fetched from API)
const sampleWeatherData = {
  'Arizona': { temp: 85, condition: 'sunny', wind: 8, precipitation: 0, risk: 'low' },
  'Colorado': { temp: 45, condition: 'snow', wind: 20, precipitation: 80, risk: 'high' },
  'UCF': { temp: 78, condition: 'rain', wind: 15, precipitation: 60, risk: 'medium' },
  'Iowa State': { temp: 32, condition: 'cloudy', wind: 25, precipitation: 20, risk: 'medium' },
};

export function WeatherDashboard() {
  const [selectedView, setSelectedView] = useState('current');
  const [weatherAlerts, setWeatherAlerts] = useState([
    { school: 'Colorado', type: 'Winter Storm Warning', severity: 'high', impact: 'Basketball games may be affected' },
    { school: 'UCF', type: 'Thunderstorm Watch', severity: 'medium', impact: 'Outdoor sports on hold' },
  ]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'rain': return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'snow': return <CloudSnow className="h-5 w-5 text-blue-300" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />;
      default: return <Cloud className="h-5 w-5" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, any> = {
      low: { variant: 'default', className: 'bg-green-100 text-green-800' },
      medium: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
      high: { variant: 'destructive', className: 'bg-red-100 text-red-800' }
    };
    return variants[risk] || variants.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            Big 12 Weather Command Center
          </h2>
          <p className="text-muted-foreground">
            Real-time weather monitoring across all 16 campuses
          </p>
        </div>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      {/* Active Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Active Weather Alerts</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              {weatherAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-medium">{alert.school}: {alert.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {alert.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Conditions</TabsTrigger>
          <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="impact">Game Impact Analysis</TabsTrigger>
          <TabsTrigger value="historical">Historical Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {big12Schools.map((school) => {
              const weather = sampleWeatherData[school.name] || {
                temp: 72,
                condition: 'cloudy',
                wind: 10,
                precipitation: 10,
                risk: 'low'
              };
              const riskStyle = getRiskBadge(weather.risk);

              return (
                <Card key={school.name} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{school.name}</CardTitle>
                      {getWeatherIcon(weather.condition)}
                    </div>
                    <CardDescription className="text-xs">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {school.city}, {school.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold">{weather.temp}°F</span>
                        </div>
                        <Badge {...riskStyle} className={riskStyle.className}>
                          {weather.risk} risk
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Wind className="h-3 w-3 text-muted-foreground" />
                          <span>{weather.wind} mph</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CloudRain className="h-3 w-3 text-muted-foreground" />
                          <span>{weather.precipitation}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Weather Outlook</CardTitle>
              <CardDescription>
                Extended forecast for game planning and travel decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
                    <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{day}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Games scheduled: {Math.floor(Math.random() * 8) + 3}
                        </div>
                        <Badge variant={idx === 1 ? 'destructive' : 'outline'}>
                          {idx === 1 ? '2 at risk' : 'Clear'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Impact on Scheduled Games</CardTitle>
              <CardDescription>
                AI-powered risk assessment for upcoming events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20">
                  <div>
                    <p className="font-medium">Colorado vs Utah - Basketball</p>
                    <p className="text-sm text-muted-foreground">Saturday, 7:00 PM</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">High Risk</Badge>
                    <p className="text-sm text-muted-foreground mt-1">Winter storm warning</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <div>
                    <p className="font-medium">UCF vs Cincinnati - Baseball</p>
                    <p className="text-sm text-muted-foreground">Sunday, 2:00 PM</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Medium Risk</Badge>
                    <p className="text-sm text-muted-foreground mt-1">Thunderstorms possible</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Risk Mitigation Recommendations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Consider moving Colorado vs Utah to alternate date</li>
                  <li>• Prepare indoor backup venue for UCF baseball game</li>
                  <li>• Issue travel advisories for teams flying into Denver</li>
                  <li>• Activate severe weather communication protocols</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Weather Patterns</CardTitle>
              <CardDescription>
                Data-driven insights for schedule optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Cancellation Rates by Month
                    </h4>
                    <div className="space-y-2">
                      {['January', 'February', 'March', 'April'].map((month) => (
                        <div key={month} className="flex items-center justify-between">
                          <span className="text-sm">{month}</span>
                          <div className="flex items-center gap-2 flex-1 ml-4">
                            <Progress 
                              value={month === 'February' ? 12 : month === 'March' ? 8 : 3} 
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-muted-foreground w-10">
                              {month === 'February' ? '12%' : month === 'March' ? '8%' : '3%'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Weather Windows by Region</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 border rounded flex justify-between">
                        <span>Southwest (AZ, TX West)</span>
                        <span className="font-medium text-green-600">Oct-Apr optimal</span>
                      </div>
                      <div className="p-2 border rounded flex justify-between">
                        <span>Mountain (CO, UT)</span>
                        <span className="font-medium text-yellow-600">Sep-Nov, Mar-May</span>
                      </div>
                      <div className="p-2 border rounded flex justify-between">
                        <span>Central (KS, OK, IA)</span>
                        <span className="font-medium text-blue-600">Apr-Oct optimal</span>
                      </div>
                      <div className="p-2 border rounded flex justify-between">
                        <span>Southeast (FL)</span>
                        <span className="font-medium text-red-600">Nov-Apr (hurricane)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}