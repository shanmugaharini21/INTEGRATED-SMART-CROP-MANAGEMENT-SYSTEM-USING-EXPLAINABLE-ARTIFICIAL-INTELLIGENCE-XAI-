import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Plus, History, Thermometer, Droplets, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WeatherData } from '@/types';
import { format } from 'date-fns';

interface WeatherDataSectionProps {
  fieldId: string;
}

const mockWeatherHistory: WeatherData[] = [
  {
    id: '1',
    fieldId: '1',
    versionId: 3,
    temperature: 28,
    rainfall: 12,
    humidity: 65,
    windSpeed: 8,
    forecastNote: 'Partly cloudy with chance of light rain',
    recordDate: new Date('2024-02-02'),
  },
  {
    id: '2',
    fieldId: '1',
    versionId: 2,
    temperature: 31,
    rainfall: 0,
    humidity: 45,
    windSpeed: 12,
    forecastNote: 'Clear skies expected',
    recordDate: new Date('2024-01-28'),
  },
];

const WeatherDataSection: React.FC<WeatherDataSectionProps> = ({ fieldId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const latestWeather = mockWeatherHistory[0];

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky/20">
              <Cloud className="h-5 w-5 text-sky" />
            </div>
            <CardTitle className="font-display text-lg">Weather Data</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-muted-foreground"
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Record
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Latest Data */}
        {latestWeather && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Latest Record (v{latestWeather.versionId})</span>
              <span className="text-muted-foreground">{format(latestWeather.recordDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <Thermometer className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-display font-semibold text-foreground">{latestWeather.temperature}°C</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <Droplets className="h-8 w-8 text-sky" />
                <div>
                  <p className="text-xs text-muted-foreground">Rainfall</p>
                  <p className="font-display font-semibold text-foreground">{latestWeather.rainfall} mm</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <Cloud className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="font-display font-semibold text-foreground">{latestWeather.humidity}%</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                <Wind className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Wind Speed</p>
                  <p className="font-display font-semibold text-foreground">{latestWeather.windSpeed} km/h</p>
                </div>
              </div>
            </div>
            <div className="bg-accent/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Forecast Note</p>
              <p className="text-sm text-foreground">{latestWeather.forecastNote}</p>
            </div>
          </div>
        )}

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border pt-4"
            >
              <h4 className="font-medium text-foreground mb-3">Add Weather Record</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="temp">Temperature (°C)</Label>
                  <Input id="temp" type="number" placeholder="28" />
                </div>
                <div>
                  <Label htmlFor="rain">Rainfall (mm)</Label>
                  <Input id="rain" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="humid">Humidity (%)</Label>
                  <Input id="humid" type="number" placeholder="65" />
                </div>
                <div>
                  <Label htmlFor="wind">Wind Speed (km/h)</Label>
                  <Input id="wind" type="number" placeholder="10" />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="forecast">Forecast Note</Label>
                <Textarea id="forecast" placeholder="Enter weather observations..." />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90">Save Record</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border pt-4"
            >
              <h4 className="font-medium text-foreground mb-3">Weather History</h4>
              <div className="space-y-3">
                {mockWeatherHistory.map((record) => (
                  <div key={record.id} className="bg-muted/30 rounded-lg p-3 text-sm">
                    <div className="flex justify-between text-muted-foreground mb-2">
                      <span>Version {record.versionId}</span>
                      <span>{format(record.recordDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <span>Temp: {record.temperature}°C</span>
                      <span>Rain: {record.rainfall}mm</span>
                      <span>Humidity: {record.humidity}%</span>
                      <span>Wind: {record.windSpeed}km/h</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{record.forecastNote}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default WeatherDataSection;