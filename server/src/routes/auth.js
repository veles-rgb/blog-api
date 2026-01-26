const router = require("express").Router();

const authController = require("../controllers/auth.controller");

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;