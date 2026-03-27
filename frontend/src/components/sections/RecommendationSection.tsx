import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/hooks/useApp';
import axios from 'axios';
import { format } from 'date-fns';

export interface CropRecommendation {
  id: string;
  fieldId: string;
  versionId: number;
  recommendationText: string;
  source: 'soil' | 'weather' | 'farmer_note' | 'ai';
  generatedDate: Date;
}

interface RecommendationResponse {
  success: boolean;
  recommendations?: {
    id: string;
    field_id: string;
    recommendation_text: string;
    source: string;
    version_id: number;
    created_at: string;
  }[];
}

interface RecommendationSectionProps {
  fieldId: string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({ fieldId }) => {
  const { currentFarmer } = useApp();
  const [recs, setRecs] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentFarmer) return;

      try {
        const res = await axios.get<RecommendationResponse>(
          `http://localhost:5000/field/${fieldId}/recommendations`
        );

        const mapped: CropRecommendation[] = (res.data.recommendations || []).map(r => ({
          id: r.id.toString(),
          fieldId: r.field_id.toString(),
          recommendationText: r.recommendation_text,
          source: r.source as 'soil' | 'weather' | 'farmer_note' | 'ai',
          versionId: r.version_id,
          generatedDate: new Date(r.created_at)
        }));

        setRecs(mapped);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [fieldId, currentFarmer]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading recommendations...</p>
        ) : recs.length === 0 ? (
          <p className="text-muted-foreground">No recommendations yet</p>
        ) : (
          <ul className="space-y-4">
            {recs.map(r => (
              <li key={r.id} className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  {format(r.generatedDate, 'MMM d, yyyy')}
                </p>
                <p className="mt-1 text-foreground">{r.recommendationText}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Source: {r.source.toUpperCase()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationSection;