const router = require("express").Router();

const usersController = require("../controllers/users.controller");

// Public
router.get("/:userId", usersController.getUserById);

// Protected
router.delete("/:userId", usersController.deleteUserById);

// Admin
router.get("/", usersController.getAllUsers);
router.patch("/:userId/admin", usersController.updateAdminStatus);
router.patch("/:userId/author", usersController.updateAuthorStatus);

module.exports = router;