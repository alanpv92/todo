const express = require("express");
const authenticationController = require("../../controllers/authentication/authentication");
const router = express.Router();

router.post("/register",authenticationController.registerUser);
router.post("/login", authenticationController.loginUser);
router.post("/forgot-password",authenticationController.forgotPassword);
router.post("/verify-email",authenticationController.startVerifyingMail);
router.post("/verify-otp",authenticationController.verifyOtpForEmail);
router.post("/verify-otp-password",authenticationController.verifyOtpForPassword);
router.post("/refresh-token");

module.exports = router;
