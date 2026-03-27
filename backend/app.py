from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import datetime
import os
from werkzeug.utils import secure_filename
import joblib
import numpy as np
import pdfplumber
import requests

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE ----------------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Keerthana@dbms",
    database="agropredict"
)
cursor = db.cursor(dictionary=True)

# ---------------- FILE UPLOAD ----------------
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ---------------- LOAD MODEL ----------------
model = joblib.load('models/xgb_pretrained_model.pkl')
le_target = joblib.load('models/le_target.pkl')
encoders = joblib.load('models/encoders.pkl')

# ---------------- UTIL FUNCTIONS ----------------

# Extract soil data from PDF
import re
import pdfplumber

def extract_soil_data(pdf_path):
    text = ""
    data = {
        "Soil_Type": "Clay", # Defaults
        "pH": 7.0,
        "Nitrogen": 0,
        "Phosphorus": 0,
        "Potassium": 0,
        "Organic_Carbon": 0.0,
        "Moisture": 0
    }

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""

        # 1. Extract Soil Type (Loamy, Sandy, etc.)
        type_match = re.search(r"Soil Type:\s*(\w+)", text)
        if type_match:
            data["Soil_Type"] = type_match.group(1)

        # 2. Extract Numbers (pH, Nitrogen, etc.)
        # This regex looks for the Label, a colon, and then a decimal or integer
        data["pH"] = float(re.search(r"Soil pH:\s*([\d.]+)", text).group(1))
        data["Nitrogen"] = float(re.search(r"Nitrogen Level:\s*([\d.]+)", text).group(1))
        data["Phosphorus"] = float(re.search(r"Phosphorus Level:\s*([\d.]+)", text).group(1))
        data["Potassium"] = float(re.search(r"Potassium Level:\s*([\d.]+)", text).group(1))
        data["Organic_Carbon"] = float(re.search(r"Organic Carbon:\s*([\d.]+)", text).group(1))
        
        # Moisture (stripping the % sign)
        moisture_match = re.search(r"Moisture Content:\s*(\d+)%", text)
        if moisture_match:
            data["Moisture"] = float(moisture_match.group(1))

    except Exception as e:
        print(f"Extraction error: {e}")
        # If extraction fails, it keeps the default values
        
    return data

# Weather API
def get_weather(lat, lon):
    try:
        API_KEY = "YOUR_API_KEY"  # replace
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        res = requests.get(url).json()

        return {
            "Temperature": res["main"]["temp"],
            "Humidity": res["main"]["humidity"]
        }
    except:
        return {
            "Temperature": 30,
            "Humidity": 70
        }

# Process farmer notes
def process_notes(notes):
    notes = (notes or "").lower()

    if "pest" in notes:
        return "High"
    elif "dry" in notes:
        return "Low"
    return "Normal"

# Generate prediction
import numpy as np

def generate_prediction(user_features):
    try:
        # Order MUST match the 'Required Features' list exactly:
        # [Soil, Crop, Growth, Season, Irrigation, Prev_Crop, Region, Fertilizer]
        
        input_data = [
            encoders['Soil_Type'].transform([user_features['Soil_Type']])[0],
            encoders['Crop_Type'].transform([user_features['Crop_Type']])[0],
            encoders['Crop_Growth_Stage'].transform([user_features['Crop_Growth_Stage']])[0],
            encoders['Season'].transform([user_features['Season']])[0],
            encoders['Irrigation_Type'].transform([user_features['Irrigation_Type']])[0],
            encoders['Previous_Crop'].transform([user_features['Previous_Crop']])[0],
            encoders['Region'].transform([user_features['Region']])[0],
            float(user_features['Fertilizer_Used_Last_Season']) # This is a float in your model
        ]

        # Convert to 2D array for XGBoost
        final_features = np.array([input_data])
        
        # Predict
        prediction_idx = model.predict(final_features)[0]
        
        # Convert index back to name (e.g., 0 -> "Urea")
        return le_target.inverse_transform([prediction_idx])[0]

    except Exception as e:
        print(f"Prediction Error: {e}")
        return "Check Input Categories"

# ---------------- REGISTER ----------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json

    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    location = data.get('location')
    password = data.get('password')

    if not name or not password:
        return jsonify({"message": "Name and password required"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    cursor.execute(
        "INSERT INTO farmers (name,email,phone,location,password,created_at) VALUES (%s,%s,%s,%s,%s,%s)",
        (name, email, phone, location, hashed.decode(), datetime.datetime.now())
    )
    db.commit()

    return jsonify({"success": True})

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT * FROM farmers WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({
            "success": True,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "phone": user['phone'],
                "location": user['location']
            }
        })

    return jsonify({"message": "Invalid password"}), 401

# ---------------- ADD FIELD + AI ----------------
@app.route("/add-field", methods=["POST"])
def add_field():
    try:
        # 1. Capture Basic Form Data
        farmer_id = request.form.get("farmerId")
        name = request.form.get("name")
        crop_type = request.form.get("cropType", "Rice") # Default to Rice if empty
        area = float(request.form.get("area", 0))
        area_unit = request.form.get("areaUnit")
        latitude = float(request.form.get("latitude", 0))
        longitude = float(request.form.get("longitude", 0))
        farmer_notes = request.form.get("farmerNotes")

        # 2. Handle PDF Upload & Soil Extraction
        soil_pdf = request.files.get("soilPdf")
        filename = None
        soil_data = {"Soil_Type": "Clay"} # Default fallback

        if soil_pdf:
            filename = f"{datetime.datetime.now().timestamp()}_{secure_filename(soil_pdf.filename)}"
            path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            soil_pdf.save(path)
            # Use the extraction logic we discussed to pull "Loamy" from the PDF
            extracted = extract_soil_data(path)
            soil_data.update(extracted)

        # 3. AI Data Preparation (Mapping to Model Encoders)
        # Note: We must ensure the values exist in encoders.pkl categories
        def validate_category(value, category_name, default):
            valid_list = list(encoders[category_name].classes_)
            return value if value in valid_list else default

        features = {
            "Soil_Type": validate_category(soil_data["Soil_Type"], "Soil_Type", "Clay"),
            "Crop_Type": validate_category(crop_type, "Crop_Type", "Rice"),
            "Crop_Growth_Stage": "Vegetative", # Model expects: Flowering, Harvest, Sowing, Vegetative
            "Season": "Kharif",                # Model expects: Kharif, Rabi, Zaid
            "Irrigation_Type": "Drip",         # Model expects: Canal, Drip, Rainfed, Sprinkler
            "Previous_Crop": "Maize",          # Model expects valid Crop names
            "Region": "South",                 # Model expects: Central, East, North, South, West
            "Fertilizer_Used_Last_Season": 50.0 # Model expects a FLOAT (based on your inspection)
        }

        # 4. Generate AI Prediction
        prediction = generate_prediction(features)

        # 5. Database Storage (Field Info)
        location = f"{latitude},{longitude}"
        cursor.execute("""
            INSERT INTO fields 
            (farmer_id, name, crop_type, area, area_unit, location, soil_pdf, farmer_notes, latitude, longitude, health_status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'good', NOW())
        """, (farmer_id, name, crop_type, area, area_unit, location, filename, farmer_notes, latitude, longitude))
        db.commit()
        
        field_id = cursor.lastrowid

        # 6. Database Storage (Recommendation)
        text = f"AgroPredict analysis suggests: {prediction}."
        cursor.execute("""
            INSERT INTO recommendations 
            (field_id, recommendation_text, source, version_id, created_at)
            VALUES (%s, %s, 'ai', 1, NOW())
        """, (field_id, text))
        db.commit()

        return jsonify({
            "success": True, 
            "field_id": field_id, 
            "prediction": prediction, 
            "recommendation": text
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"success": False, "message": str(e)})
# ---------------- GET FIELDS ----------------
@app.route('/farmer/<int:farmer_id>/fields', methods=['GET'])
def get_fields(farmer_id):
    cursor.execute("SELECT * FROM fields WHERE farmer_id=%s", (farmer_id,))
    fields = cursor.fetchall()

    for f in fields:
        f["created_at"] = f["created_at"].isoformat()

    return jsonify({"success": True, "fields": fields})

# ---------------- GET RECOMMENDATIONS ----------------
@app.route("/field/<int:field_id>/recommendations", methods=["GET"])
def get_recs(field_id):
    cursor.execute("SELECT * FROM recommendations WHERE field_id=%s", (field_id,))
    recs = cursor.fetchall()

    for r in recs:
        r["created_at"] = r["created_at"].isoformat()

    return jsonify({"success": True, "recommendations": recs})

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)