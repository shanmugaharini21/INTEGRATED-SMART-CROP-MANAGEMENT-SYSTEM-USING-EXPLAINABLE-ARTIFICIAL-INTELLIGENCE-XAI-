import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Wheat, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field } from '@/types';
import { format } from 'date-fns';

interface FieldCardProps {
  field: Field;
  index: number;
  onClick: () => void;
}

const FieldCard: React.FC<FieldCardProps> = ({ field, index, onClick }) => {
  const statusColors = {
    good: 'bg-leaf text-primary-foreground',
    warning: 'bg-warning text-primary-foreground',
    critical: 'bg-destructive text-destructive-foreground',
  };

  const statusLabels = {
    good: 'Healthy',
    warning: 'Needs Attention',
    critical: 'Critical',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group relative overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/30 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {field.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Wheat className="h-3.5 w-3.5" />
                <span>{field.cropType}</span>
              </div>
            </div>
            <Badge className={statusColors[field.healthStatus]}>
              {statusLabels[field.healthStatus]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4 text-sky" />
              <span>{field.area} {field.areaUnit}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="truncate">{field.location}</span>
            </div>
          </div>

          {field.lastRecommendationDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
              <Calendar className="h-3.5 w-3.5" />
              <span>Last recommendation: {format(field.lastRecommendationDate, 'MMM d, yyyy')}</span>
            </div>
          )}

          <Button 
            variant="ghost" 
            className="w-full justify-between text-primary hover:text-primary hover:bg-accent group-hover:bg-accent"
          >
            View Details
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FieldCard;