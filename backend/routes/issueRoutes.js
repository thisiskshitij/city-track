const express = require("express");
const router = express.Router();
const upload = require("../uploads/config/multer");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  createIssue,
  getIssues,
  getIssueById,
  deleteIssue,
  upvoteIssue,
  updateStatus
} = require("../controllers/issueController");

// GET all issues — public
router.get("/", getIssues);

// GET single issue — public
router.get("/:id", getIssueById);

// CREATE issue — logged in users, with image upload
router.post("/", verifyToken, upload.single("image"), createIssue);

// UPVOTE — logged in users
router.patch("/:id/upvote", verifyToken, upvoteIssue);

// UPDATE STATUS — admin only
router.patch("/:id/status", verifyToken, isAdmin, updateStatus);

// DELETE — admin only
router.delete("/:id", verifyToken, isAdmin, deleteIssue);

module.exports = router;