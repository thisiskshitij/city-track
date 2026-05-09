import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from labels import LABELS
import os

MODEL_NAME = "distilbert-base-uncased"
CHECKPOINT = "distilbert_finetuned"

if os.path.isdir(CHECKPOINT):
    print(f"[text_model] Loading fine-tuned weights from '{CHECKPOINT}'")
    tokenizer = AutoTokenizer.from_pretrained(CHECKPOINT)
    model     = AutoModelForSequenceClassification.from_pretrained(CHECKPOINT)
else:
    print("[text_model] No checkpoint found — using base model with random classifier head")
    print("[text_model] Predictions will be unreliable until fine-tuned")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model     = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=len(LABELS),
        ignore_mismatched_sizes=True   # ← suppresses the MISSING/UNEXPECTED noise
    )

model.eval()

def predict_text(text: str) -> dict:
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probs = F.softmax(outputs.logits, dim=1)[0]
    scores = {LABELS[i]: round(float(probs[i]), 4) for i in range(len(LABELS))}

    # ← ADD THIS so you can see what's happening in uvicorn logs
    print(f"[text_model] Input: '{text[:60]}'")
    print(f"[text_model] Probs: {scores}")

    return scores