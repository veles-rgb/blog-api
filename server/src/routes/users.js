const router = require("express").Router();

const passport = require("passport");

const usersController = require("../controllers/users.controller");

// Public
router.get("/:userId", usersController.getUserById);
router.get("/user/:username", usersController.getUserByUsername);

// Admin
router.get("/", passport.authenticate("jwt", { session: false }), usersController.getAllUsers);
router.patch("/:userId/admin", passport.authenticate("jwt", { session: false }), usersController.updateAdminStatus);
router.patch("/:userId/author", passport.authenticate("jwt", { session: false }), usersController.updateAuthorStatus);
router.delete("/:userId", passport.authenticate("jwt", { session: false }), usersController.deleteUserById);

module.exports = router;