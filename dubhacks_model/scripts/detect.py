import tensorflow as tf
import numpy as np
import cv2

class ObjectDetector:
    def __init__(self, model_path, labels=None):
        # Load TFLite model using TensorFlow
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        self.labels = labels

    def preprocess(self, frame):
        h, w = self.input_details[0]['shape'][1], self.input_details[0]['shape'][2]
        frame_resized = cv2.resize(frame, (w, h))
        frame_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
        input_data = np.expand_dims(frame_rgb, axis=0)
        if self.input_details[0]['dtype'] == np.float32:
            input_data = input_data.astype(np.float32) / 255.0
        else:
            input_data = input_data.astype(np.uint8)
        return input_data

    def infer(self, frame):
        input_data = self.preprocess(frame)
        self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
        self.interpreter.invoke()
        boxes = self.interpreter.get_tensor(self.output_details[0]['index'])[0]
        classes = self.interpreter.get_tensor(self.output_details[1]['index'])[0]
        scores = self.interpreter.get_tensor(self.output_details[2]['index'])[0]
        return boxes, classes, scores

    def draw_detections(self, frame, boxes, classes, scores, threshold=0.5):
        h, w, _ = frame.shape
        for i in range(len(boxes)):
            if scores[i] >= threshold:
                y1, x1, y2, x2 = boxes[i]
                x1, y1, x2, y2 = int(x1*w), int(y1*h), int(x2*w), int(y2*h)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)

                class_idx = int(classes[i]) - 1  # adjust for 1-based indices
                if self.labels and 0 <= class_idx < len(self.labels):
                    label = self.labels[class_idx]
                else:
                    label = str(int(classes[i]))  # fallback to model's raw class ID

                cv2.putText(frame, f"{label}:{scores[i]:.2f}", (x1, y1-5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
        return frame
