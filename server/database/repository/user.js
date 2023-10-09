const db = require("../database");

class UserRepository {
  async executeUserRepositoryQuery(query) {
    try {
      const response = await db.query(query);
      return response;
    } catch (e) {
      throw e;
    }
  }

  async findUserOtpById(id) {
    return this.executeUserRepositoryQuery(
      `SELECT users.id AS user_id,user_otps.id,otp_hash,created_at FROM users INNER JOIN user_otps on users.id=user_otps.user_id where users.id=${id} ;`
    );
  }

  async findUserOtpByEmail(email) {
    return this.executeUserRepositoryQuery(
      `SELECT users.id AS user_id,user_otps.id,otp_hash,created_at FROM users INNER JOIN user_otps on users.id=user_otps.user_id where users.email='${email}' ;`
    );
  }

  async deleteInvaildOtp(id) {
    return this.executeUserRepositoryQuery(
      `DELETE FROM user_otps WHERE id=${id} ;`
    );
  }

  async findUserByEmail(email) {
    return this.executeUserRepositoryQuery(
      `SELECT * FROM users WHERE email='${email}';`
    );
  }

  async insertUser(email, hashedPassword, userName) {
    return this.executeUserRepositoryQuery(
      `INSERT INTO USERS (user_name,email,password_hash) VALUES ('${userName}','${email}','${hashedPassword}') RETURNING id ;`
    );
  }

  async updateUserEmailStatusToVerified(id) {
    return this.executeUserRepositoryQuery(
      `UPDATE users SET is_email_verified = true WHERE id=${id} `
    );
  }

  async insertOtp(id, otp_hash) {
    return this
      .executeUserRepositoryQuery(`INSERT INTO user_otps (user_id,otp_hash) VALUES ('${id}','${otp_hash}') ON CONFLICT (user_id) DO UPDATE
   SET otp_hash = '${otp_hash}',created_at=CURRENT_TIMESTAMP;`);
  }

  async updatePasswordHash(id, newPasswordHash) {
    return this.executeUserRepositoryQuery(
      `UPDATE users SET password_hash='${newPasswordHash}' WHERE id=${id}`
    );
  }
}

const userRepository = new UserRepository();

module.exports = userRepository;
