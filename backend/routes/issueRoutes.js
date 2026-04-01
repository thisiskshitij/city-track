// const express = require("express");
// const router = express.Router();

// const { createIssue } = require("../controllers/issueController");

// router.post("/", createIssue);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../uploads/config/multer");

const {   createIssue,
  getIssues,
  getIssueById,
  deleteIssue,
  upvoteIssue,
  updateStatus } = require("../controllers/issueController");

// router.post("/", createIssue);
router.post("/", upload.single("image"), createIssue);
router.get("/", getIssues);

router.get("/:id", getIssueById);
router.delete("/:id", deleteIssue);

router.patch("/:id/upvote", upvoteIssue);
router.patch("/:id/status", updateStatus);

module.exports = router;