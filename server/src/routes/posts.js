const router = require("express").Router();
const passport = require("passport");

const postsController = require("../controllers/posts.controller");

// Public
router.get("/", postsController.getAllPosts);
router.get("/:postId", postsController.getPostById);
router.get("/user/:username", postsController.getAllUserPosts);
router.get("/by-slug/:username/:slug", postsController.getPostBySlug);

// Protected (User or Admin)
router.post("/", passport.authenticate("jwt", { session: false }), postsController.createPost);
router.patch("/:postId", passport.authenticate("jwt", { session: false }), postsController.updatePostById);
router.delete("/:postId", passport.authenticate("jwt", { session: false }), postsController.deletePostById);

router.patch("/:postId/publish", passport.authenticate("jwt", { session: false }), postsController.publishPost);
router.patch("/:postId/unpublish", passport.authenticate("jwt", { session: false }), postsController.unpublishPost);

module.exports = router;