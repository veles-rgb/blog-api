const router = require("express").Router();
const passport = require("passport");

const authController = require("../controllers/auth.controller");

// Public
router.post("/register", authController.register);
router.post("/login", passport.authenticate("local", { session: false }), authController.login);
router.post("/logout", passport.authenticate("jwt", { session: false }), authController.logout);

module.exports = router;