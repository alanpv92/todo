const express = require("express");
const authenticationController = require("../../controllers/authentication/authentication");
const router = express.Router();

router.post("/register",authenticationController.registerUser);
router.post("/login", authenticationController.loginUser);
router.post("/forgot-password");
router.post("/verify-email");
router.post("/refresh-token");

module.exports = router;
