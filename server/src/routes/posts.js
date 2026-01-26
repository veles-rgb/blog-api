const router = require("express").Router();

const postsController = require("../controllers/posts.controller");

// Public
router.get("/", postsController.getAllPosts);
router.get("/:postId", postsController.getPostById);
router.get("/by-slug/:username/:slug", postsController.getPostBySlug);

// Protected (User or Admin)
router.post("/", postsController.createPost);
router.patch("/:postId", postsController.updatePostById);
router.delete("/:postId", postsController.deletePostById);

router.patch("/:postId/publish", postsController.updatePostPublished);
router.patch("/:postId/unpublish", postsController.updatePostUnpublish);

module.exports = router;