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
  updateStatus,
  addFeedback,       // ← add
  deleteFeedback     // ← add
} = require("../controllers/issueController");

router.get("/", getIssues);

router.get("/:id", getIssueById);

router.post("/", verifyToken, upload.single("image"), createIssue);

router.patch("/:id/upvote", verifyToken, upvoteIssue);

router.patch("/:id/status", verifyToken, isAdmin, updateStatus);

router.delete("/:id", verifyToken, isAdmin, deleteIssue);

router.post("/:id/feedback", verifyToken, isAdmin, addFeedback); //add
router.delete("/:id/feedback/:feedbackId", verifyToken, isAdmin, deleteFeedback); // add

module.exports = router;

