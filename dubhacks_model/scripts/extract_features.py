import cv2, os, json, numpy as np, random
from detect import ObjectDetector  # your TFLite SSD MobileNet wrapper

# Initialize detector
detector = ObjectDetector("models/detect.tflite")
output = []

# Base directory for frames
frame_base = "dataset_frames"

# Target sequence lengths (frames at 5 FPS)
SEQUENCE_LENGTHS = {
    "approaching": 20,
    "at_door": 15,
    "delivery": 25,
    "leaving": 25
}

# Loop through labels
for label in os.listdir(frame_base):
    label_path = os.path.join(frame_base, label)
    if not os.path.isdir(label_path):
        continue

    for seq_dir in os.listdir(label_path):
        frames_path = os.path.join(label_path, seq_dir)
        frames = sorted(os.listdir(frames_path))

        # Extract person centers for all frames
        all_features = []
        for f in frames:
            frame = cv2.imread(os.path.join(frames_path, f))
            boxes, classes, scores = detector.infer(frame)

            person_boxes = [boxes[i] for i in range(len(scores)) if int(classes[i]) == 0 and scores[i] > 0.5]
            if person_boxes:
                y1, x1, y2, x2 = person_boxes[0]
                center = [float((x1 + x2) / 2), float((y1 + y2) / 2)]
                # small random jitter for data augmentation
                center = [c + random.uniform(-0.01, 0.01) for c in center]
            else:
                center = [0.0, 0.0]
            all_features.append(center)

        # Sequence length and stride for this label
        sequence_length = SEQUENCE_LENGTHS.get(label, 25)
        stride = max(1, sequence_length // 2)  # 50% overlap

        # Sliding window sequence generation
        start_idx = 0
        while start_idx < len(all_features):
            seq = all_features[start_idx:start_idx + sequence_length]
            # Pad if too short
            if len(seq) < sequence_length:
                seq += [seq[-1]] * (sequence_length - len(seq))
            output.append({"label": label, "features": seq})
            start_idx += stride

# Convert NumPy arrays to floats
def convert(obj):
    if isinstance(obj, np.ndarray):
        return obj.astype(float).tolist()
    elif isinstance(obj, list):
        return [convert(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: convert(v) for k, v in obj.items()}
    else:
        return obj

output_clean = convert(output)

# Save features
os.makedirs("models", exist_ok=True)
with open("models/training_features.json", "w") as f:
    json.dump(output_clean, f)

print(f"Features saved successfully! Created {len(output_clean)} sequences.")
