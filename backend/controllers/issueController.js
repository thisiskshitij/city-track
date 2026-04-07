
const Issue = require("../models/Issue");
const classifyWithAI = require("../ai-engine/zeroShotClassifier");
const classifyImage = require("../ai-engine/imageClassifier");
const stringSimilarity = require("string-similarity");

const checkDuplicate = async (description, areaName) => {

  const issues = await Issue.find();

  for (let issue of issues) {

    // ✅ SAME AREA CHECK
    if (issue.location?.areaName !== areaName) {
      continue; // skip different areas
    }

    // 🔍 SIMPLE TEXT MATCH (you can improve later)
    const existingDesc = issue.description.toLowerCase();
    const newDesc = description.toLowerCase();

    if (existingDesc.includes(newDesc) || newDesc.includes(existingDesc)) {
      return issue;
    }
  }

  return null;
};

// 🧠 Map Image Labels → Categories

const mapImageToCategory = (label) => {
  label = label.toLowerCase();

  if (label.includes("road") || label.includes("street") || label.includes("hole")) {
    return "Road issues";
  }

  if (label.includes("garbage") || label.includes("trash")) {
    return "Sanitation problems";
  }

  if (label.includes("light")) {
    return "Electricity issues";
  }

  if (label.includes("water")) {
    return "Water supply problems";
  }

  return "Environmental issues";
};

//new line for area data


// 🧠 CATEGORY LIST
const categories = [
  "Road issues",
  "Sanitation problems",
  "Electricity issues",
  "Water supply problems",
  "Environmental issues"
];

// 🧠 Convert category → score vector
const getScoreVector = (predictedCategory) => {
  const scores = {
    "Road issues": 0,
    "Sanitation problems": 0,
    "Electricity issues": 0,
    "Water supply problems": 0,
    "Environmental issues": 0
  };

  if (scores.hasOwnProperty(predictedCategory)) {
    scores[predictedCategory] = 1;
  }

  return scores;
};

// 🧠 Combine Text + Image
const combinePredictions = (textCategory, imageCategory) => {
  const textScores = getScoreVector(textCategory);
  const imageScores = getScoreVector(imageCategory);

  const finalScores = {};

  for (let key in textScores) {
    finalScores[key] =
      0.6 * textScores[key] +
      0.4 * imageScores[key];
  }

  let finalCategory = null;
  let maxScore = -1;

  for (let key in finalScores) {
    if (finalScores[key] > maxScore) {
      maxScore = finalScores[key];
      finalCategory = key;
    }
  }

  console.log("🧠 Combined Scores:", finalScores);
  console.log("🏆 Final AI Decision:", finalCategory);

  return finalCategory;
};

//new line

const predictSeverity = (description, imageLabel) => {
  let score = 0;
  console.log("⚡ Severity function called");
  const text = description.toLowerCase();

  // 🔤 TEXT SIGNALS
  if (text.includes("huge") || text.includes("big") || text.includes("danger")) {
    score += 0.4;
  }

  if (text.includes("accident") || text.includes("risk") || text.includes("blocked")) {
    score += 0.3;
  }

  if (text.includes("water leaking") || text.includes("overflow")) {
    score += 0.2;
  }

  // 🖼️ IMAGE SIGNALS
  if (imageLabel) {
    const label = imageLabel.toLowerCase();

    if (label.includes("garbage") || label.includes("trash")) {
      score += 0.2;
    }

    if (label.includes("hole") || label.includes("damage")) {
      score += 0.4;
    }
  }

  // 🎯 NORMALIZE (max = 1)
  if (score > 1) score = 1;

  console.log("🔥 Severity Score:", score);

  // 🏷️ MAP TO LEVEL
  if (score < 0.34) return "Low";
  if (score < 0.67) return "Medium";
  return "High";
};


exports.createIssue = async (req, res) => {

 

  try {
 const location = {
    lat: req.body.lat,
    lng: req.body.lng,
    areaName: req.body.areaName || "Unknown Area"
  };
    console.log("createIssue hit");

    // const duplicate = await checkDuplicate(req.body.description);
    const duplicate = await checkDuplicate(
  req.body.description,
  req.body.areaName // ✅ NEW
);

    if (duplicate) {
      return res.status(200).json({
        message: "Similar issue already exists",
        existingIssue: duplicate
      });
    }

    const image_url = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    // 🧠 TEXT AI
    const textCategory = await classifyWithAI(req.body.description);
    console.log("Text AI:", textCategory);

    // 🖼️ IMAGE AI

    let imagePrediction = null;
    let imageCategory = null;

    if (req.file) {
      console.log("🖼️ Image received:", req.file.filename);

      imagePrediction = await classifyImage(`uploads/${req.file.filename}`);

      console.log("🧠 Raw Image Prediction:", imagePrediction);

      imageCategory = mapImageToCategory(imagePrediction);

      console.log("🧩 Mapped Image Category:", imageCategory);

    } else {
      console.log("🖼️ No image uploaded");
    }


    let finalCategory = textCategory;

    if (imageCategory) {
      finalCategory = combinePredictions(textCategory, imageCategory);
    }
    console.log("Final Category:", finalCategory);



    const aiSeverity = predictSeverity(
      req.body.description,
      imagePrediction
    );

    console.log("🎯 Final Severity:", aiSeverity);

    const newIssue = new Issue({
      title: req.body.title,
      description: req.body.description,
      severity: aiSeverity, // ✅ AI decides
      category: finalCategory,
      image_url,
      location
    });

    const savedIssue = await newIssue.save();

    res.status(201).json(savedIssue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET ALL
exports.getIssues = async (req, res) => {
  try {

    const search = req.query.search;

    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      };
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });

    res.status(200).json(issues);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPSVOTE (IMPORTANT)
exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.upvotes += 1;
    await issue.save();

    res.status(200).json(issue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ STATUS UPDATE (IMPORTANT)
exports.updateStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = req.body.status;
    await issue.save();

    res.status(200).json(issue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteIssue = async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};