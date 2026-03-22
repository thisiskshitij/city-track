const Issue = require("../models/Issue");

exports.createIssue = async (req, res) => {
  try {

    const newIssue = new Issue(req.body);

    const savedIssue = await newIssue.save();

    res.status(201).json(savedIssue);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};