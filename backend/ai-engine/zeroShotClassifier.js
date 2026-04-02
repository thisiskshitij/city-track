const { pipeline } = require("@xenova/transformers");

let classifier;

// Load model once
const loadModel = async () => {
  classifier = await pipeline(
    "zero-shot-classification",
    "Xenova/distilbert-base-uncased-mnli"
  );
};

const classifyWithAI = async (text) => {
  if (!classifier) {
    console.log("Loading text AI model...");
    await loadModel();
    console.log("text ai Model loaded");
  }

  const labels = [
    "Road issues",
    "Sanitation problems",
    "Electricity issues",
    "Water supply problems",
    "Environmental issues"
  ];

  const result = await classifier(text, labels);

  return result.labels[0]; // best match
};

module.exports = classifyWithAI;