const userRepository = require("../../database/repository/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UserAlreadyRegistredError } = require("./errors");
const texts = require("../../constants/texts");

class AuthenticationController {
  static resolveError(errorInstance) {
    if (errorInstance instanceof UserAlreadyRegistredError) {
      return texts.userAlreadyRegistredError;
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

  loginUser(req, res) {
    res.send("hello world");
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
      console.log(insertedData.rows[0].id);
      res.json({
        status: "ok",
        data: {
          token: AuthenticationController.generateToken({
            userId: insertedData.rows[0].id,
            email: email,
          }),
        },
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        message: AuthenticationController.resolveError(e),
      });
    }
  }
}

const authenticationController = new AuthenticationController();

module.exports = authenticationController;
