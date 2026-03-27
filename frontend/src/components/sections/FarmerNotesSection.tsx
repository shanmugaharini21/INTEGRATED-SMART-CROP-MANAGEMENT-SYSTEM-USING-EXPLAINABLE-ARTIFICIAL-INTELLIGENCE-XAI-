import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notebook, Plus, Bug, Leaf, Clock, AlertTriangle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FarmerNote, NoteType } from '@/types';
import { format } from 'date-fns';

interface FarmerNotesSectionProps {
  fieldId: string;
}

const mockNotes: FarmerNote[] = [
  {
    id: '1',
    fieldId: '1',
    versionId: 3,
    noteType: 'pest',
    noteText: 'Noticed small aphids on lower leaves. Applied organic neem spray yesterday.',
    recordDate: new Date('2024-02-01'),
  },
  {
    id: '2',
    fieldId: '1',
    versionId: 2,
    noteType: 'yellow_leaves',
    noteText: 'Some yellowing on older leaves, possibly nitrogen deficiency.',
    recordDate: new Date('2024-01-25'),
  },
  {
    id: '3',
    fieldId: '1',
    versionId: 1,
    noteType: 'other',
    noteText: 'Initial planting completed. Seeds look healthy.',
    recordDate: new Date('2024-01-15'),
  },
];

const noteTypeConfig: Record<NoteType, { label: string; icon: typeof Bug; color: string }> = {
  pest: { label: 'Pest', icon: Bug, color: 'bg-destructive/10 text-destructive' },
  yellow_leaves: { label: 'Yellow Leaves', icon: Leaf, color: 'bg-warning/20 text-warning' },
  growth_delay: { label: 'Growth Delay', icon: Clock, color: 'bg-muted text-muted-foreground' },
  disease: { label: 'Disease', icon: AlertTriangle, color: 'bg-destructive/10 text-destructive' },
  other: { label: 'Other', icon: HelpCircle, color: 'bg-accent text-accent-foreground' },
};

const FarmerNotesSection: React.FC<FarmerNotesSectionProps> = ({ fieldId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<NoteType>('other');

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-wheat/20">
              <Notebook className="h-5 w-5 text-wheat" />
            </div>
            <CardTitle className="font-display text-lg">Farmer Notes</CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/30 rounded-lg p-4 mb-4"
            >
              <h4 className="font-medium text-foreground mb-3">Add New Note</h4>
              
              <div className="mb-4">
                <Label className="mb-2 block">Note Type</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(noteTypeConfig) as NoteType[]).map((type) => {
                    const config = noteTypeConfig[type];
                    const Icon = config.icon;
                    return (
                      <Button
                        key={type}
                        variant={selectedType === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className={selectedType === type ? 'bg-primary' : ''}
                      >
                        <Icon className="h-3.5 w-3.5 mr-1" />
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="noteText">Observation</Label>
                <Textarea 
                  id="noteText" 
                  placeholder="Describe what you observed in your field..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90">Save Note</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes List */}
        <div className="space-y-3">
          {mockNotes.map((note, index) => {
            const config = noteTypeConfig[note.noteType];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={config.color}>
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    v{note.versionId} • {format(note.recordDate, 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-foreground">{note.noteText}</p>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmerNotesSection;