import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from torchvision.models import MobileNet_V3_Small_Weights
from PIL import Image
from labels import LABELS
import os

NUM_CLASSES = len(LABELS)
CHECKPOINT  = "mobilenet_finetuned.pth"

model = models.mobilenet_v3_small(weights=None)   # ← no deprecation warning
model.classifier[3] = nn.Linear(
    model.classifier[3].in_features, NUM_CLASSES
)

if os.path.isfile(CHECKPOINT):
    print(f"[image_model] Loading fine-tuned weights from '{CHECKPOINT}'")
    model.load_state_dict(torch.load(CHECKPOINT, map_location="cpu"))
else:
    print("[image_model] No checkpoint found — classifier head is randomly initialized")
    print("[image_model] Predictions will be unreliable until fine-tuned")

model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict_image(image_path: str) -> dict:
    image  = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)

    probs  = F.softmax(outputs[0], dim=0)
    scores = {LABELS[i]: round(float(probs[i]), 4) for i in range(NUM_CLASSES)}

    # ← ADD THIS so you can see image scores in uvicorn logs
    print(f"[image_model] File: '{image_path}'")
    print(f"[image_model] Probs: {scores}")

    return scores