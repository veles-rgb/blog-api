const router = require("express").Router();

const passport = require("passport");

const likesController = require("../controllers/likes.controller");

// Public
router.get("/", likesController.getPostLikesById); // /api/likes?postId=...

// Protected - Logged in
router.post("/:postId", passport.authenticate("jwt", { session: false }), likesController.postLike);
router.delete("/:postId", passport.authenticate("jwt", { session: false }), likesController.deleteLike);

// Protected - Owner or Admin
router.get("/user/:username", passport.authenticate("jwt", { session: false }), likesController.getAllUserLikes);

module.exports = router;