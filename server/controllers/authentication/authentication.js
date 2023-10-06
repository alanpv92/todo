const userRepository = require("../../database/repository/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  UserAlreadyRegistredError,
  UserHasNotRegistredError,
  UserHasEnterWrongPasswordError,
  InvaildOrOtpExpiredError,
} = require("./errors");
const texts = require("../../constants/texts");
const { DataBaseUniqueConstrainError } = require("../../database/errors");
const { CouldNotSendMail } = require("../../services/mail/error");
const mailService = require("../../services/mail/mail");

class AuthenticationController {
  static resolveError(errorInstance) {
    if (errorInstance instanceof UserAlreadyRegistredError) {
      return texts.userAlreadyRegistredError;
    }
    if (errorInstance instanceof UserHasNotRegistredError) {
      return texts.userHasNotRegistred;
    }
    if (errorInstance instanceof CouldNotSendMail) {
      return texts.couldNotSendMail;
    }
    if (errorInstance instanceof UserHasEnterWrongPasswordError) {
      return texts.userHasEnterWrongPassword;
    }
    if (errorInstance instanceof InvaildOrOtpExpiredError) {
      return texts.invaildOtpError;
    }
    if (errorInstance instanceof DataBaseUniqueConstrainError) {
      if (errorInstance.constraint === "users_user_name_key") {
        return texts.userNameIsNotUniqueError;
      }
    }
    return texts.unknownErrorText;
  }

  static generateToken(data) {
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
  }
  static async hashPasswordAndOtp(data) {
    const hashedData = await bcrypt.hash(data, 10);
    return hashedData;
  }

  static generateRandom4DigitNumber() {
    const randomNum = Math.floor(Math.random() * 10000);
    const formattedNum = String(randomNum).padStart(4, "0");
    return formattedNum;
  }

  static async sendOtp(email, subject, id) {
    try {
      const otp = AuthenticationController.generateRandom4DigitNumber();
      const otphash = await AuthenticationController.hashPasswordAndOtp(otp);
      await userRepository.insertOtp(id, otphash);

      await mailService.sendMail(email, subject, `otp is ${otp}`);
    } catch (e) {
      throw e;
    }
  }

  static checkIfOtpIsVaild(createdAt) {
    try {
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      const timePassed = currentDate - createdDate;
      if (timePassed >= 180000) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw e;
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await userRepository.findUserByEmail(email);
      if (userData.rowCount === 0) {
        throw new UserHasNotRegistredError();
      }
      const user = userData.rows[0];
      const isPasswordOk = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordOk) {
        throw new UserHasEnterWrongPasswordError();
      }
      res.json({
        status: "ok",
        data: {
          user_name: user.user_name,
          email: email,
          userId: user.id,
          is_email_verified: user.is_email_verified,
          token: AuthenticationController.generateToken({
            userId: user.id,
            email: email,
          }),
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }

  async registerUser(req, res) {
    try {
      const { email, password, user_name } = req.body;
      const { rowCount } = await userRepository.findUserByEmail(email);
      if (rowCount > 0) {
        throw new UserAlreadyRegistredError();
      }
      const hashedPassword = await AuthenticationController.hashPasswordAndOtp(
        password
      );
      const insertedData = await userRepository.insertUser(
        email,
        hashedPassword,
        user_name
      );

      res.json({
        status: "ok",
        data: {
          userId: insertedData.rows[0].id,
          user_name: user_name,
          email: email,
          is_email_verified: false,
          token: AuthenticationController.generateToken({
            userId: insertedData.rows[0].id,
            email: email,
          }),
        },
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }

  async startVerifyingMail(req, res) {
    try {
      const { email } = req.body;

      const userData = await userRepository.findUserByEmail(email);
      if (userData.rowCount == 0) {
        throw new UserHasNotRegistredError();
      }
      await AuthenticationController.sendOtp(
        email,
        "otp for registering for todo app",
        userData.rows[0].id
      );
      res.json({
        status: "ok",
      });
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }

  async verifyOtpForEmail(req, res) {
    try {
      const { id, otp } = req.body;
      const userOtpData = await userRepository.findUserOtpById(id);
      if (userOtpData.rowCount === 0) {
        throw new InvaildOrOtpExpiredError();
      }

      const isOtpVaild = AuthenticationController.checkIfOtpIsVaild(
        userOtpData.rows[0].created_at
      );
      if (!isOtpVaild) {
        await userRepository.deleteInvaildOtp(userOtpData.rows[0].id);
        throw new InvaildOrOtpExpiredError();
      } else {
        const otpHash = userOtpData.rows[0].otp_hash;
        const isOtpOk = await bcrypt.compare(otp, otpHash);
        if (isOtpOk) {
          const user_id = userOtpData.rows[0].user_id;
          await userRepository.updateUserEmailStatusToVerified(user_id);
          res.json({
            status: "ok",
          });
        } else {
          throw new InvaildOrOtpExpiredError();
        }
      }
    } catch (e) {
      res.status(400).json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const userData = await userRepository.findUserByEmail(email);

      if (userData.rowCount == 0) {
        throw new UserHasNotRegistredError();
      }
      await AuthenticationController.sendOtp(
        email,
        "otp for reseting password for todo app",
        userData.rows[0].id
      );
      res.json({
        status: "ok",
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }

  async verifyOtpForPassword(req, res) {
    try {
      const { email, otp, new_password } = req.body;
      const userOtpData = await userRepository.findUserOtpByEmail(email);

      if (userOtpData.rowCount === 0) {
        throw new InvaildOrOtpExpiredError();
      }
      const isOtpVaild = AuthenticationController.checkIfOtpIsVaild(
        userOtpData.rows[0].created_at
      );
      if (!isOtpVaild) {
        await userRepository.deleteInvaildOtp(userOtpData.rows[0].id);
        throw new InvaildOrOtpExpiredError();
      } else {
        const otpHash = userOtpData.rows[0].otp_hash;
        const isOtpOk = await bcrypt.compare(otp, otpHash);
        if (isOtpOk) {
          const user_id = userOtpData.rows[0].user_id;
          const newPasswordHash = await AuthenticationController.hashPasswordAndOtp(new_password);
          await userRepository.updatePasswordHash(user_id, newPasswordHash);
          res.json({
            status: "ok",
          });
        } else {
          throw new InvaildOrOtpExpiredError();
        }
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
