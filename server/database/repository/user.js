const db = require("../database");

class UserRepository {
  async findUserOtpById(id) {
    try {
      const query = `SELECT users.id AS user_id,user_otps.id,otp_hash,created_at FROM users INNER JOIN user_otps on users.id=user_otps.user_id where users.id=${id} ;`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async findUserOtpByEmail(email) {
    try {
      
      const query = `SELECT users.id AS user_id,user_otps.id,otp_hash,created_at FROM users INNER JOIN user_otps on users.id=user_otps.user_id where users.email='${email}' ;`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteInvaildOtp(id) {
    try {
      const query = `DELETE FROM user_otps WHERE id=${id} ;`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

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

  async updateUserEmailStatusToVerified(id) {
    try {
      const query = `UPDATE users SET is_email_verified = true WHERE id=${id} `;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async insertOtp(id, otp_hash) {
    try {
      const query = `INSERT INTO user_otps (user_id,otp_hash) VALUES ('${id}','${otp_hash}') ON CONFLICT (user_id) DO UPDATE
     SET otp_hash = '${otp_hash}',created_at=CURRENT_TIMESTAMP;`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async updatePasswordHash(id, newPasswordHash) {
    try {
      const query = `UPDATE users SET password_hash='${newPasswordHash}' WHERE id=${id}`;
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }
}

const userRepository = new UserRepository();

module.exports = userRepository;
