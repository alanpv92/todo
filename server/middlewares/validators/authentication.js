const { body, validationResult } = require("express-validator");
const Texts = require("../../constants/texts");

const vaildOtpSchema = body("otp")
  .trim()
  .notEmpty()
  .withMessage(Texts.invaildOtp);
const vaildEmailSchema = body("email")
  .isEmail()
  .withMessage(Texts.invalidEmail);
const vaildPasswordSchema = body("password")
  .trim()
  .notEmpty()
  .withMessage(Texts.invaildPassword)
  .isLength({ min: 4 })
  .withMessage(Texts.shortPassword);

const vaildIdSchema = body("id").isEmail().withMessage(Texts.invalidEmail);

const loginSchema = [vaildEmailSchema, vaildPasswordSchema];

class AuthenticationSchema {
  getLoginSchema() {
    return loginSchema;
  }
  getRegistraionSchema() {
    return [
      ...loginSchema,
      body("user_name").exists().withMessage(Texts.invaildUserName),
    ];
  }

  getForgotPasswordSchemea() {
    return vaildEmailSchema;
  }

  getVerifyOtpForPasswordSchema() {
    return [vaildEmailSchema, vaildOtpSchema, vaildPasswordSchema];
  }
  getVerifyEmailSchema() {
    return vaildEmailSchema;
  }

  getVerifyEmailOtpSchema(){
    return [
        vaildIdSchema,
        vaildOtpSchema,
    ]
  }

  validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: errors.array()[0].msg || Texts.unknownErrorText,
      });
    } else {
      next();
    }
  }
}

const authenticationSchema = new AuthenticationSchema();

module.exports = authenticationSchema;
