const router = require("express").Router();

const commentsController = require("../controllers/comments.controller");

// Public
router.get("/", commentsController.getPostCommentsById); // /api/comments?postId=...
router.get("/:commentId", commentsController.getCommentById);

// Protected - Logged in
router.post("/", commentsController.postComment);

// Protected - Owner or Admin
router.get("/user/:username", commentsController.getAllUserComments);
router.patch("/:commentId", commentsController.updateCommentById);
router.delete("/:commentId", commentsController.deleteCommentById);

module.exports = router;