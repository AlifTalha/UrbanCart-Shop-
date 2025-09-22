const express = require("express");
const { signupUser, loginUser, logoutUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // logout route

module.exports = router;
