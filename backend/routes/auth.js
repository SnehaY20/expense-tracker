const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  updatePassword,
} = require("../controllers/auth.js");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);
router.put("/:id", auth, updatePassword);

module.exports = router;
