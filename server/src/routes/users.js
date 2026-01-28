const router = require("express").Router();

const usersController = require("../controllers/users.controller");

// Public
router.get("/:userId", usersController.getUserById);

// Admin
router.get("/", usersController.getAllUsers);
router.patch("/:userId/admin", usersController.updateAdminStatus);
router.patch("/:userId/author", usersController.updateAuthorStatus);
router.delete("/:userId", usersController.deleteUserById);

module.exports = router;