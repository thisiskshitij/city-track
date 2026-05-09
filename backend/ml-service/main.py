from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional
import shutil, os

from text_model import predict_text
from image_model import predict_image
from fusion import fuse

app = FastAPI()

@app.post("/predict")
async def predict(
    description: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    text_probs = predict_text(description)

    image_probs = {}
    image_path = None

    if image is not None and image.filename:
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        image_path = f"temp_upload{ext}"

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        try:
            image_probs = predict_image(image_path)
        finally:                          # always clean up even if model errors
            if os.path.exists(image_path):
                os.remove(image_path)

    result = fuse(text_probs, image_probs)

    print(f"[fusion] text_probs:  {text_probs}")
    print(f"[fusion] image_probs: {image_probs}")
    print(f"[fusion] result:      {result}")


    return {
        "category": result["category"],
        "confidence": result["confidence"],
        "text_probs": text_probs,
        "image_probs": image_probs,
        "scores": result["scores"]
    }