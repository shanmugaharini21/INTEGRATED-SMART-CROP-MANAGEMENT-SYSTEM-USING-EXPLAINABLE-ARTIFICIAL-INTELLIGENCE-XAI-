import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { Farmer, Field, AppState } from '@/types';

// Matches your SQL Table exactly
interface ApiField {
  id: number;
  farmer_id: number;
  name: string;
  crop_type: string;
  area: string; // DECIMAL comes as string from many DB drivers
  area_unit: 'acres' | 'hectares';
  location: string | null;
  latitude: number;
  longitude: number;
  health_status: 'good' | 'warning' | 'critical';
  last_recommendation_date: string | null;
  soil_pdf: string | null;
  farmer_notes: string | null;
  created_at: string;
}

interface FarmerFieldsResponse {
  success: boolean;
  fields: ApiField[];
}

interface AppContextType extends AppState {
  login: (farmerData:Farmer) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  addField: (field: Field) => void;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  setFields: (fields: Field[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [fields, setFieldsState] = useState<Field[]>([]);
  const [isGuest, setIsGuest] = useState(false);

  const login = async (farmerData: Farmer) => {
    // 1. Validate we have a user from the login response
    if (!farmerData?.id) {
      alert('Login failed: No user data received');
      return;
    }

    try {
      // 2. Fetch fields using the ID
      const res = await axios.get<FarmerFieldsResponse>(
        `http://localhost:5000/farmer/${farmerData.id}/fields`
      );

      if (!res.data.success) {
        alert('Could not sync field data');
        return;
      }

      // 3. Update Farmer State
      setCurrentFarmer({
        id: farmerData.id.toString(),
        name: farmerData.name,
        email: farmerData.email,
        phone: farmerData.phone,
        location: farmerData.location || '',
        createdAt: farmerData.createdAt ? new Date(farmerData.createdAt) : new Date(),
      });

      // 4. Update Fields State (mapping SQL names to CamelCase frontend names)
      const fieldsFromApi: Field[] = (res.data.fields || []).map((f) => ({
        id: f.id.toString(),
        farmerId: f.farmer_id.toString(),
        name: f.name,
        cropType: f.crop_type,
        area: parseFloat(f.area),
        areaUnit: f.area_unit,
        // Prioritize latitude/longitude if they exist, else use location string
        location: f.location || `${f.latitude}, ${f.longitude}`, 
        latitude: f.latitude,
        longitude: f.longitude,
        farmerNotes: f.farmer_notes || '',
        soilPdf: f.soil_pdf || '',
        healthStatus: f.health_status,
        createdAt: new Date(f.created_at),
        lastRecommendationDate: f.last_recommendation_date
          ? new Date(f.last_recommendation_date)
          : undefined,
      }));

      setFieldsState(fieldsFromApi);
      setIsGuest(false);
    } catch (err) {
      console.error('Error in login sync:', err);
      alert('Server error while loading your dashboard');
    }
  };

  const loginAsGuest = () => {
    setCurrentFarmer(null);
    setFieldsState([]);
    setIsGuest(true);
  };

  const logout = () => {
    setCurrentFarmer(null);
    setFieldsState([]);
    setIsGuest(false);
  };

  const addField = (field: Field) => setFieldsState((prev) => [...prev, field]);

  const updateField = (fieldId: string, updates: Partial<Field>) =>
    setFieldsState((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );

  const setFields = (newFields: Field[]) => setFieldsState(newFields);

  return (
    <AppContext.Provider
      value={{
        currentFarmer,
        fields,
        isGuest,
        login,
        loginAsGuest,
        logout,
        addField,
        updateField,
        setFields,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };