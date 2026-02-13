const router = require("express").Router();

const passport = require("passport");

const commentsController = require("../controllers/comments.controller");

// Public
router.get("/", commentsController.getPostCommentsById); // GET /api/comments?postId=...
router.get("/:commentId", commentsController.getCommentById); // GET /api/comments/:commentId

// Get ANY posts comments (even if unpublished)
router.get("/:postId/comments", passport.authenticate("jwt", { session: false }), commentsController.getMyPostComments);


// Protected - Logged in
router.post("/:postId", passport.authenticate("jwt", { session: false }), commentsController.postComment);
// POST /api/comments/:postId  (body: { content })

// Protected - Owner or Admin
router.get(
    "/user/:username",
    passport.authenticate("jwt", { session: false }),
    commentsController.getAllUserComments
); // GET /api/comments/user/:username

router.delete(
    "/:commentId",
    passport.authenticate("jwt", { session: false }),
    commentsController.deleteCommentById
);


module.exports = router;