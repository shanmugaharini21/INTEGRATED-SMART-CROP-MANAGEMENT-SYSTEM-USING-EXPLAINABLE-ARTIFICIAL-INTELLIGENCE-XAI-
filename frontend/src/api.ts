const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Define the structure of your soil data
export interface SoilFeatures {
  Soil_Type: string;
  Soil_pH: number;
  Soil_Moisture: number;
  Nitrogen_Level: number;
  Phosphorus_Level: number;
  Potassium_Level: number;
  Temperature: number;
  Humidity: number;
  Rainfall: number;
  Crop_Type: string;
  Crop_Growth_Stage: string;
  Season: string;
  Region: string;
  Organic_Carbon: number;
  Electrical_Conductivity: number;
  Irrigation_Type: string;
  Previous_Crop: string;
  Fertilizer_Used_Last_Season: string;
  Yield_Last_Season: number;
}

export const agroApi = {
  // We replace 'any' with 'SoilFeatures'
  getPrediction: async (features: SoilFeatures) => {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error("API Error (Predict):", error);
      throw error;
    }
  },

  getNotes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      return await response.json();
    } catch (error) {
      console.error("API Error (GetNotes):", error);
      return [];
    }
  },

  saveNote: async (noteData: { noteType: string; noteText: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      return await response.json();
    } catch (error) {
      console.error("API Error (SaveNote):", error);
      throw error;
    }
  }
};