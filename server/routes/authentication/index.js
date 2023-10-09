const express = require("express");
const authenticationController = require("../../controllers/authentication/authentication");
const authenticationSchema = require("../../middlewares/validators/authentication");
const router = express.Router();

router.post(
  "/register",
  authenticationSchema.getRegistraionSchema(),
  authenticationSchema.validateRequest,
  authenticationController.registerUser
);
router.post(
  "/login",
  authenticationSchema.getLoginSchema(),
  authenticationSchema.validateRequest,
  authenticationController.loginUser
);
router.post(
  "/forgot-password",
  authenticationSchema.getForgotPasswordSchemea(),
  authenticationSchema.validateRequest,
  authenticationController.forgotPassword
);
router.post(
  "/verify-email",
  authenticationSchema.getVerifyEmailSchema(),
  authenticationSchema.validateRequest,
  authenticationController.startVerifyingMail
);
router.post(
  "/verify-otp",
  authenticationSchema.getVerifyEmailOtpSchema(),
  authenticationSchema.validateRequest,
  authenticationController.verifyOtpForEmail
);
router.post(
  "/verify-otp-password",
  authenticationSchema.getVerifyOtpForPasswordSchema(),
  authenticationSchema.validateRequest,
  authenticationController.verifyOtpForPassword
);
router.post("/refresh-token");

module.exports = router;
