const express = require("express");
const router = express.Router();

const { createIssue } = require("../controllers/issueController");

router.post("/", createIssue);

module.exports = router;