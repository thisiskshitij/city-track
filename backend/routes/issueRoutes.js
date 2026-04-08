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

router.get("/", getIssues);

router.get("/:id", getIssueById);

router.post("/", verifyToken, upload.single("image"), createIssue);

router.patch("/:id/upvote", verifyToken, upvoteIssue);

router.patch("/:id/status", verifyToken, isAdmin, updateStatus);

router.delete("/:id", verifyToken, isAdmin, deleteIssue);

module.exports = router;