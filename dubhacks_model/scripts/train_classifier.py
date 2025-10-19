import json, numpy as np
from tensorflow import keras
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
import pickle
import random

# Load features
data = json.load(open("models/training_features.json"))

SEQUENCE_LENGTH = 25  # fixed window length
STRIDE = 12           # 50% overlap
X, y = [], []

for seq in data:
    feats = np.array(seq["features"], dtype=float)
    # optional jitter for augmentation
    feats = feats + np.random.uniform(-0.01, 0.01, feats.shape)
    
    start_idx = 0
    while start_idx < len(feats):
        window = feats[start_idx:start_idx + SEQUENCE_LENGTH]
        # pad if too short
        if len(window) < SEQUENCE_LENGTH:
            window = np.vstack([window, np.zeros((SEQUENCE_LENGTH - len(window), feats.shape[1]))])
        X.append(window.flatten())
        y.append(seq["label"])
        start_idx += STRIDE

X = np.array(X, dtype=float)
y = np.array(y)

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# MLP model
model = keras.Sequential([
    keras.layers.Input(shape=(X.shape[1],)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(len(le.classes_), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X, y_encoded, epochs=20, batch_size=16, validation_split=0.1)

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()
with open("models/activity_classifier.tflite", "wb") as f:
    f.write(tflite_model)

# Save label encoder
with open("models/label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)
