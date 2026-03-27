import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, History, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SoilData } from '@/types';
import { format } from 'date-fns';

interface SoilDataSectionProps {
  fieldId: string;
}

const mockSoilHistory: SoilData[] = [
  {
    id: '1',
    fieldId: '1',
    versionId: 2,
    pH: 6.8,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 180,
    moisture: 28,
    organicMatter: 3.5,
    recordDate: new Date('2024-02-01'),
  },
  {
    id: '2',
    fieldId: '1',
    versionId: 1,
    pH: 6.5,
    nitrogen: 40,
    phosphorus: 28,
    potassium: 165,
    moisture: 25,
    organicMatter: 3.2,
    recordDate: new Date('2024-01-15'),
  },
];

const SoilDataSection: React.FC<SoilDataSectionProps> = ({ fieldId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const latestSoil = mockSoilHistory[0];

  const DataItem = ({ label, value, unit }: { label: string; value: number; unit?: string }) => (
    <div className="bg-muted/50 rounded-lg p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-display font-semibold text-foreground">
        {value}{unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </p>
    </div>
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-soil/10">
              <FlaskConical className="h-5 w-5 text-soil" />
            </div>
            <CardTitle className="font-display text-lg">Soil Data</CardTitle>
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
        {latestSoil && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Latest Record (v{latestSoil.versionId})</span>
              <span className="text-muted-foreground">{format(latestSoil.recordDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <DataItem label="pH Level" value={latestSoil.pH} />
              <DataItem label="Nitrogen" value={latestSoil.nitrogen} unit="ppm" />
              <DataItem label="Phosphorus" value={latestSoil.phosphorus} unit="ppm" />
              <DataItem label="Potassium" value={latestSoil.potassium} unit="ppm" />
              <DataItem label="Moisture" value={latestSoil.moisture} unit="%" />
              <DataItem label="Organic Matter" value={latestSoil.organicMatter} unit="%" />
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
              <h4 className="font-medium text-foreground mb-3">Add New Soil Record</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ph">pH Level</Label>
                  <Input id="ph" type="number" step="0.1" placeholder="6.5" />
                </div>
                <div>
                  <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
                  <Input id="nitrogen" type="number" placeholder="40" />
                </div>
                <div>
                  <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
                  <Input id="phosphorus" type="number" placeholder="30" />
                </div>
                <div>
                  <Label htmlFor="potassium">Potassium (ppm)</Label>
                  <Input id="potassium" type="number" placeholder="170" />
                </div>
                <div>
                  <Label htmlFor="moisture">Moisture (%)</Label>
                  <Input id="moisture" type="number" placeholder="25" />
                </div>
                <div>
                  <Label htmlFor="organic">Organic Matter (%)</Label>
                  <Input id="organic" type="number" step="0.1" placeholder="3.2" />
                </div>
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
              <h4 className="font-medium text-foreground mb-3">Soil Data History</h4>
              <div className="space-y-3">
                {mockSoilHistory.map((record) => (
                  <div key={record.id} className="bg-muted/30 rounded-lg p-3 text-sm">
                    <div className="flex justify-between text-muted-foreground mb-2">
                      <span>Version {record.versionId}</span>
                      <span>{format(record.recordDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                      <span>pH: {record.pH}</span>
                      <span>N: {record.nitrogen}</span>
                      <span>P: {record.phosphorus}</span>
                      <span>K: {record.potassium}</span>
                      <span>Moisture: {record.moisture}%</span>
                      <span>OM: {record.organicMatter}%</span>
                    </div>
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

export default SoilDataSection;