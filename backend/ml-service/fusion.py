from labels import LABELS

def fuse(text_probs: dict, image_probs: dict) -> dict:
    has_image = bool(image_probs)

    # weights: text-only when no image is present
    text_w  = 0.4 if has_image else 1.0
    image_w = 0.6 if has_image else 0.0

    final_scores = {
        label: text_probs.get(label, 0) * text_w + image_probs.get(label, 0) * image_w
        for label in LABELS
    }

    best_label  = max(final_scores, key=final_scores.get)
    confidence  = final_scores[best_label]

    return {
        "category":  best_label,
        "confidence": round(confidence, 4),
        "scores":    {k: round(v, 4) for k, v in final_scores.items()}
    }