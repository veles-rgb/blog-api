const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));
router.use("/auth", require("./auth"));

module.exports = router;