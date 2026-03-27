import joblib
import numpy as np

def inspect_ai_components():
    print("🔍 --- Starting AI Model Inspection ---\n")

    try:
        # 1. Load the components
        model = joblib.load('models/xgb_pretrained_model.pkl')
        encoders = joblib.load('models/encoders.pkl')
        le_target = joblib.load('models/le_target.pkl')

        # 2. Identify required Feature Names and Order
        print("📋 FEATURE STRUCTURE:")
        if hasattr(model, 'feature_names_in_'):
            # Works for most Scikit-Learn based models/wrappers
            features = model.feature_names_in_
            print(f"Required Features ({len(features)}): {list(features)}")
        elif hasattr(model, 'get_booster'):
            # Specific to raw XGBoost
            features = model.get_booster().feature_names
            print(f"Required Features ({len(features)}): {features}")
        else:
            # Fallback if names aren't stored (check the number of inputs)
            n_features = model.n_features_in_ if hasattr(model, 'n_features_in_') else "Unknown"
            print(f"Feature names not stored, but model expects {n_features} inputs.")

        # 3. Identify Categorical Labels (What words can you actually use?)
        print("\n🏷️  CATEGORICAL ENCODERS (Valid Words):")
        for col, enc in encoders.items():
            if hasattr(enc, 'classes_'):
                print(f" - {col}: {list(enc.classes_)}")
            else:
                print(f" - {col}: Encoder found but classes not accessible.")

        # 4. Identify Output Predictions
        print("\n🎯 PREDICTION TARGETS (What the AI suggests):")
        if hasattr(le_target, 'classes_'):
            print(list(le_target.classes_))

    except Exception as e:
        print(f"❌ Error during inspection: {e}")

if __name__ == "__main__":
    inspect_ai_components()