const router = require("express").Router();
const passport = require("passport");

const postsController = require("../controllers/posts.controller");

router.get("/", postsController.getAllPosts);
router.get("/me", passport.authenticate("jwt", { session: false }), postsController.getMyPosts);
router.get("/me/:postId", passport.authenticate("jwt", { session: false }), postsController.getMyPostById);
router.get("/:postId", postsController.getPostById);
router.get("/user/:username", postsController.getAllUserPosts);
router.get("/by-slug/:username/:slug", postsController.getPostBySlug);

router.post("/", passport.authenticate("jwt", { session: false }), postsController.createPost);
router.patch("/:postId", passport.authenticate("jwt", { session: false }), postsController.updatePostById);
router.delete("/:postId", passport.authenticate("jwt", { session: false }), postsController.deletePostById);
router.patch("/:postId/publish", passport.authenticate("jwt", { session: false }), postsController.publishPost);
router.patch("/:postId/unpublish", passport.authenticate("jwt", { session: false }), postsController.unpublishPost);

module.exports = router;