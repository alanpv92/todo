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
}

const userRepository = new UserRepository();

module.exports = userRepository;
