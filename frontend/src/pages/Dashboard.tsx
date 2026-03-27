import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Leaf, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import FarmerProfileCard from '@/components/cards/FarmerProfileCard';
import FieldCard from '@/components/cards/FieldCard';
import { useApp } from '@/hooks/useApp';
 
const Dashboard = () => {
  const navigate = useNavigate();
  const { currentFarmer, fields, isGuest } = useApp();
  console.log("Current Farmer:", currentFarmer);
  const healthCounts = {
    good: fields.filter(f => f.healthStatus === 'good').length,
    warning: fields.filter(f => f.healthStatus === 'warning').length,
    critical: fields.filter(f => f.healthStatus === 'critical').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {isGuest ? 'Welcome, Guest' : `Welcome back, ${currentFarmer?.name?.split(' ')[0] || 'Farmer'}`}
          </h1>
          <p className="text-muted-foreground">
            Monitor your fields and get smart crop recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[300px,1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {currentFarmer && <FarmerProfileCard farmer={currentFarmer} />}
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Field Health Overview</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Healthy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-leaf rounded-full" 
                        style={{ width: `${fields.length ? (healthCounts.good / fields.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-6">{healthCounts.good}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Needs Attention</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-warning rounded-full" 
                        style={{ width: `${fields.length ? (healthCounts.warning / fields.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-6">{healthCounts.warning}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Critical</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-destructive rounded-full" 
                        style={{ width: `${fields.length ? (healthCounts.critical / fields.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-6">{healthCounts.critical}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div>
            {/* Fields Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">Your Fields</h2>
                <span className="text-sm text-muted-foreground">({fields.length})</span>
              </div>
              <Button 
                onClick={() => navigate('/field/new')}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Field
              </Button>
            </div>

            {/* Fields Grid */}
            {fields.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {fields.map((field, index) => (
                  <FieldCard 
                    key={field.id} 
                    field={field} 
                    index={index}
                    onClick={() => navigate(`/field/${field.id}`)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed border-border"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  No Fields Yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by adding your first field to begin tracking soil health, weather data, and get smart recommendations.
                </p>
                <Button 
                  onClick={() => navigate('/field/new')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Field
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;