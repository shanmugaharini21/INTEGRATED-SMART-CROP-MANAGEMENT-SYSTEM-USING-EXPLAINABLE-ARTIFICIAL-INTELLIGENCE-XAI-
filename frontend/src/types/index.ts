export interface Farmer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  createdAt: Date;
}

export interface Field {
  id: string;
  farmerId: string;
  name: string;
  cropType: string;
  area: number;
  areaUnit: 'acres' | 'hectares';
  location: string;
  createdAt: Date;
  lastRecommendationDate?: Date;
  healthStatus: 'good' | 'warning' | 'critical';
}

export interface SoilData {
  id: string;
  fieldId: string;
  versionId: number;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  organicMatter: number;
  recordDate: Date;
}

export interface WeatherData {
  id: string;
  fieldId: string;
  versionId: number;
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
  forecastNote: string;
  recordDate: Date;
}

export type NoteType = 'pest' | 'yellow_leaves' | 'growth_delay' | 'disease' | 'other';

export interface FarmerNote {
  id: string;
  fieldId: string;
  versionId: number;
  noteType: NoteType;
  noteText: string;
  recordDate: Date;
}

export interface CropRecommendation {
  id: string;
  fieldId: string;
  versionId: number;
  recommendationText: string;
  source: 'soil' | 'weather' | 'farmer_note' | 'ai';
  generatedDate: Date;
}

export interface AppState {
  currentFarmer: Farmer | null;
  fields: Field[];
  isGuest: boolean;
}