const { pipeline } = require("@xenova/transformers");

let imageClassifier;

const loadImageModel = async () => {
  console.log("🚀 Loading Image AI (online lightweight)...");

  imageClassifier = await pipeline(
    "image-classification",
    "Xenova/mobilevit-x-small",
    {
      dtype: "q8" // 🔥 very important (fast + small)
    }
  );

  console.log("✅ Image model loaded");
};

const classifyImage = async (imagePath) => {
  try {
    if (!imageClassifier) {
      await loadImageModel();
    }

    console.time("🖼️ Image AI Time");

    const result = await imageClassifier(imagePath);

    console.timeEnd("🖼️ Image AI Time");

    console.log("🧠 Image Result:", result);

    return result[0].label;

  } catch (err) {
    console.log("❌ Image AI failed:", err.message);
    return null;
  }
};

module.exports = classifyImage;