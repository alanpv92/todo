const db = require("../database");

class UserRepository {
  async findUserByEmail(email) {
    try {
      const query = `SELECT * FROM users WHERE email='${email}';`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async insertUser(email, hashedPassword, userName) {
    try {
      const query = `INSERT INTO USERS (user_name,email,password_hash) VALUES ('${userName}','${email}','${hashedPassword}') RETURNING id ;`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }
  async insertOtp(id, otp_hash) {
    try {
      const query = `INSERT INTO user_otps (user_id,otp_hash) VALUES ('${id}','${otp_hash}') ON CONFLICT (user_id) DO UPDATE
     SET otp_hash = '${otp_hash}';`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }
}

const userRepository = new UserRepository();

module.exports = userRepository;
