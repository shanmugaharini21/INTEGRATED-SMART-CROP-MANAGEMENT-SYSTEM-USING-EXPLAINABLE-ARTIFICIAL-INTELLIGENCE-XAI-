import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Leaf, MapPin, Ruler, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Header from "@/components/layout/Header";
import { useApp } from "@/hooks/useApp";

const cropTypes = [
  "Wheat",
  "Rice",
  "Corn",
  "Soybean",
  "Cotton",
  "Sugarcane",
  "Potato",
  "Tomato",
  "Onion",
  "Pulses",
  "Vegetables",
  "Other"
];

const AddField = () => {
  const navigate = useNavigate();
  const { currentFarmer, addField } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cropType: "",
    area: "",
    areaUnit: "acres",
    latitude: "",
    longitude: "",
    farmerNotes: "",
    soilPdf: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("cropType", formData.cropType);
      payload.append("area", formData.area);
      payload.append("areaUnit", formData.areaUnit);
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      payload.append("farmerNotes", formData.farmerNotes);
      payload.append("farmerId", currentFarmer?.id.toString() || "guest");

      if (formData.soilPdf) payload.append("soilPdf", formData.soilPdf);

      const response = await axios.post(
        "http://localhost:5000/add-field",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        // Add to context for dashboard update
        addField({
          id: response.data.field_id.toString(),
          farmerId: currentFarmer?.id.toString() || "guest",
          name: formData.name,
          cropType: formData.cropType,
          area: parseFloat(formData.area),
          areaUnit: formData.areaUnit as "acres" | "hectares",
          location: `${formData.latitude},${formData.longitude}`,
          farmerNotes: formData.farmerNotes,
          soilPdf: formData.soilPdf?.name || "",
          healthStatus: "good",
          createdAt: new Date()
        });

        // Redirect to recommendation page
        navigate(`/field/${response.data.field_id}`, {
          state: {
            fieldName: formData.name,
            prediction: response.data.prediction,
            recommendation: response.data.recommendation
          }
        });
      } else {
        alert("Failed to add field: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add field or generate recommendation");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 py-8 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Add Field for Crop Recommendation</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload soil report and field details to get crop prediction
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Field Name */}
                <div>
                  <Label>Field Name</Label>
                  <Input
                    placeholder="North Farm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Crop Type */}
                <div>
                  <Label>Current Crop</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      <Ruler className="h-4 w-4 inline mr-1" />
                      Area
                    </Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Unit</Label>
                    <Select
                      value={formData.areaUnit}
                      onValueChange={(value) => setFormData({ ...formData, areaUnit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="hectares">Hectares</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* GPS Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Latitude
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="13.0827"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="80.2707"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Soil PDF */}
                <div>
                  <Label>
                    <FileText className="h-4 w-4 inline mr-1" />
                    Upload Soil Report (PDF)
                  </Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setFormData({ ...formData, soilPdf: e.target.files?.[0] || null })
                    }
                  />
                </div>

                {/* Farmer Notes */}
                <div>
                  <Label>Farmer Notes</Label>
                  <Textarea
                    placeholder="Describe soil color, pest problems, irrigation issues..."
                    rows={4}
                    value={formData.farmerNotes}
                    onChange={(e) => setFormData({ ...formData, farmerNotes: e.target.value })}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Processing..." : "Get Recommendation"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AddField;