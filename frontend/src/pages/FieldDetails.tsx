import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wheat, MapPin, Ruler, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import SoilDataSection from '@/components/sections/SoilDataSection';
import WeatherDataSection from '@/components/sections/WeatherDataSection';
import FarmerNotesSection from '@/components/sections/FarmerNotesSection';
import RecommendationSection from '@/components/sections/RecommendationSection';
import { useApp } from '@/hooks/useApp';
import { format } from 'date-fns';

const FieldDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fields } = useApp();

  // Find the specific field from your AppContext
  const field = fields.find(f => f.id === id);

  if (!field) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 md:px-6 py-8 text-center">
          <p className="text-muted-foreground">Field not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Field Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-border overflow-hidden">
            <div className="h-2 gradient-hero" />
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {field.name}
                    </h1>
                    <Badge className={statusColors[field.healthStatus]}>
                      {statusLabels[field.healthStatus]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Wheat className="h-4 w-4" />
                      <span>{field.cropType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      <span>{field.area} {field.areaUnit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{field.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created {format(new Date(field.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Sections */}
        <div className="space-y-6">
          {/* CORE UPDATE: We pass the field object and the ID 
              to ensure the AI and Notes sections know which data to use.
          */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RecommendationSection fieldId={field.id.toString()} />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SoilDataSection fieldId={field.id.toString()} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeatherDataSection fieldId={field.id.toString()} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FarmerNotesSection fieldId={field.id.toString()} />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default FieldDetails;