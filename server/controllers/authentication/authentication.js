const userRepository = require("../../database/repository/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  UserAlreadyRegistredError,
  UserHasNotRegistredError,
  UserHasEnterWrongPasswordError,
} = require("./errors");
const texts = require("../../constants/texts");
const { DataBaseUniqueConstrainError } = require("../../database/errors");

class AuthenticationController {
  static resolveError(errorInstance) {
    if (errorInstance instanceof UserAlreadyRegistredError) {
      return texts.userAlreadyRegistredError;
    }
    if (errorInstance instanceof UserHasNotRegistredError) {
      return texts.userHasNotRegistred;
    }
    if (errorInstance instanceof UserHasEnterWrongPasswordError) {
      return texts.userHasEnterWrongPassword;
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
          is_email_verified:user.is_email_verified,
          token: AuthenticationController.generateToken({
            userId: user.id,
            email: email,
          }),
        },
      });
    } catch (e) {
      console.log(e)
      res.json({
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
          user_name: user_name,
          email: email,
          token: AuthenticationController.generateToken({
            userId: insertedData.rows[0].id,
            email: email,
          }),
        },
      });
    } catch (e) {
      res.json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }


}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
