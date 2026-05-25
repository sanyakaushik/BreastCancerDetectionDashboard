from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from tensorflow.keras.layers import Dense

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/best_DenseNet121.keras"
IMG_SIZE = (224, 224)
THRESHOLD = 0.30

from keras.layers import Dense

original_dense_from_config = Dense.from_config

@classmethod
def fixed_dense_from_config(cls, config):
    config.pop("quantization_config", None)
    return original_dense_from_config(config)

Dense.from_config = fixed_dense_from_config

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False,
    safe_mode=False
)

class FixedDense(Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"Dense": FixedDense},
    compile=False
)

@app.get("/")
def home():
    return {"message": "Breast Thermography AI API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)

    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)

    img_array = tf.keras.applications.densenet.preprocess_input(img_array)

    probability = float(model.predict(img_array)[0][0])

    prediction = "Malignant" if probability >= THRESHOLD else "Benign"
    confidence = probability if prediction == "Malignant" else 1 - probability

    return {
        "prediction": prediction,
        "malignant_probability": round(probability, 4),
        "confidence": round(confidence, 4),
        "threshold": THRESHOLD
    }