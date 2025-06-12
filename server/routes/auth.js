const express = require("express");
const { HandleRegister , HandleLogin , HandleLogout } = require("../controllers/auth")
const router = express.Router();

// User registration route
router.post("/register", HandleRegister);

// User login route
router.post("/login", HandleLogin);

//User logout route
router.post("/logout" , HandleLogout)

module.exports = router;
