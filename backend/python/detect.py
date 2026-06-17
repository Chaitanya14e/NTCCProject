import sys
import json
import cv2
import torch
import numpy as np
from torchvision import transforms
from ultralytics import YOLO
import torch.nn as nn
from torchvision.models import efficientnet_b0


VIDEO_PATH = sys.argv[1]

SEQUENCE_LENGTH = 64
FRAME_SKIP = 5
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_PATH = "./python/final_anomaly_model.pth"

class AnomalyDetectionModel(nn.Module):

    def __init__(self):

        super().__init__()

        self.bigru = nn.GRU(
            input_size=1280,
            hidden_size=192,
            batch_first=True,
            bidirectional=True
        )

        self.attention = nn.MultiheadAttention(
            embed_dim=384,
            num_heads=8,
            batch_first=True
        )

        self.dropout = nn.Dropout(0.5)

        self.fc1 = nn.Linear(384,128)

        self.bn1 = nn.BatchNorm1d(128)

        self.relu = nn.ReLU()

        self.fc2 = nn.Linear(128,1)

    def forward(self,x):

        gru_out,_ = self.bigru(x)

        attended,_ = self.attention(
            gru_out,
            gru_out,
            gru_out
        )

        attention_vector,_ = attended.max(dim=1)

        residual_vector,_ = gru_out.max(dim=1)

        fused = attention_vector + residual_vector

        fused = self.dropout(fused)

        fused = self.fc1(fused)

        fused = self.bn1(fused)

        fused = self.relu(fused)

        logits = self.fc2(fused)

        return logits
    
yolo_model = YOLO("yolov8n.pt")

efficientnet = efficientnet_b0(
    weights="DEFAULT"
)

efficientnet.classifier = nn.Identity()

efficientnet = efficientnet.to(DEVICE)

efficientnet.eval()

model = AnomalyDetectionModel()

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=DEVICE
    )
)

model.to(DEVICE)

model.eval()

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

TARGET_CLASSES = [

    0,   # person
    1,   # bicycle
    2,   # car
    3,   # motorcycle
    5,   # bus
    7    # truck

]

def extract_roi(frame):

    results = yolo_model(
        frame,
        verbose=False
    )

    largest_area = 0

    best_roi = None

    for box in results[0].boxes:

        cls = int(
            box.cls.item()
        )

        if cls not in TARGET_CLASSES:
            continue

        x1,y1,x2,y2 = map(
            int,
            box.xyxy[0]
        )

        area = (
            x2-x1
        ) * (
            y2-y1
        )

        if area > largest_area:

            largest_area = area

            best_roi = frame[
                y1:y2,
                x1:x2
            ]

    if best_roi is None:

        best_roi = frame

    return best_roi

def get_feature(frame):

    frame = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2RGB
    )

    frame = transform(
        frame
    )

    frame = frame.unsqueeze(0)

    frame = frame.to(DEVICE)

    with torch.no_grad():

        feature = efficientnet(
            frame
        )

    return feature.squeeze().cpu().numpy()


def extract_video_features(
    video_path
):

    cap = cv2.VideoCapture(
        video_path
    )

    features = []

    frame_idx = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        if frame_idx % FRAME_SKIP == 0:

            roi = extract_roi(
                frame
            )

            feature = get_feature(
                roi
            )

            features.append(
                feature
            )

        frame_idx += 1

    cap.release()

    return np.array(
        features
    )

features = extract_video_features(
    VIDEO_PATH
)

if len(features) < SEQUENCE_LENGTH:

    result = {
        "status":"clean",
        "time":None,
        "confidence":0
    }

    print(json.dumps(result))
    sys.exit()

scores = []

for i in range(
    len(features)-SEQUENCE_LENGTH+1
):

    seq = features[
        i:i+SEQUENCE_LENGTH
    ]

    seq = torch.tensor(
        seq,
        dtype=torch.float32
    ).unsqueeze(0)

    seq = seq.to(DEVICE)

    with torch.no_grad():

        logits = model(seq)

        prob = torch.sigmoid(
            logits
        ).item()

    scores.append(prob)

if len(scores) == 0:

    result = {
        "status":"clean",
        "time":None,
        "confidence":0
    }

    print(json.dumps(result))
    sys.exit()

scores = np.array(scores)

max_score = float(
    np.max(scores)
)

# best_idx = int(
#     np.argmax(scores)
# )

# THRESHOLD = 0.3

# fps = 25

# anomaly_time = (
#     best_idx *
#     FRAME_SKIP
# ) / fps
best_idx = int(
    np.argmax(scores)
)

THRESHOLD = 0.3

fps = 25

best_feature_index = (
    best_idx +
    SEQUENCE_LENGTH // 2
)

actual_frame = (
    best_feature_index *
    FRAME_SKIP
)

anomaly_time = (
    actual_frame / fps
)

print(
    f"Best Window: {best_idx}",
    file=sys.stderr
)

print(
    f"Actual Frame: {actual_frame}",
    file=sys.stderr
)

print(
    f"Anomaly Time: {anomaly_time}",
    file=sys.stderr
)

import os

frame_path = None

if max_score > THRESHOLD:

    cap = cv2.VideoCapture(
        VIDEO_PATH
    )

    # cap.set(
    #     cv2.CAP_PROP_POS_MSEC,
    #     anomaly_time * 1000
    # )
    cap.set(
        cv2.CAP_PROP_POS_FRAMES,
        #cv2.CAP_PROP_POS_MSEC,
        anomaly_time*1000
        #actual_frame
    )

    ret, frame = cap.read()

    if ret:

        os.makedirs(
            "uploads/frames",
            exist_ok=True
        )

        video_name = os.path.splitext(
            os.path.basename(
                VIDEO_PATH
            )
        )[0]

        frame_path = (
            f"frames/{video_name}.jpg"
        )

        cv2.imwrite(
            f"uploads/{frame_path}",
            frame
        )

    cap.release()

if max_score > THRESHOLD:

    result = {

        "status":"anomaly",

        "time":
        f"{anomaly_time:.2f} sec",

        "confidence":
        round(
            max_score,
            4
        ),

        "frame":
        frame_path
    }

else:

    result = {

        "status":"clean",

        "time":None,

        "confidence":
        round(
            max_score,
            4
        ),

        "frame":None
    }
print(
    f"Frame Path: {frame_path}",
    file=sys.stderr
)
print(
    json.dumps(
        result
    )
)

