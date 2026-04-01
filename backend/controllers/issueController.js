const Issue = require("../models/Issue");

// CREATE
// exports.createIssue = async (req, res) => {
//   try {
//     const newIssue = new Issue(req.body);
//     const savedIssue = await newIssue.save();
//     res.status(201).json(savedIssue);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createIssue = async (req, res) => {
  try {

    const image_url = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    const newIssue = new Issue({
      ...req.body,
      image_url
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
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ message: "Issue deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};