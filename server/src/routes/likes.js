const router = require("express").Router();

const likesController = require("../controllers/likes.controller");

// Public
router.get("/", likesController.getPostLikesById); // /api/likes?postId=...

// Protected - Logged in
router.post("/", likesController.postLike);

// Protected - Owner or Admin
router.delete("/:postId", likesController.deleteLike);

module.exports = router;