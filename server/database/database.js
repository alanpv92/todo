const { Pool } = require("pg");
const DatabaseError = require("./errors");
class Database {
  initDatabse(portNumber, dbUserName, dbPassword, dbHost, dbName) {
    if (this.isDataseConnected()) {
      return;
    }
    this.pool = new Pool({
      port: portNumber,
      host: dbHost,
      user: dbUserName,
      password: dbPassword,
      database: dbName,
      max: 20,
    });
  }

  initDatabaseFromEnv() {
    if (this.isDataseConnected()) {
      return;
    }
    this.pool = new Pool({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 20,
    });
  }

  isDataseConnected() {
    return this.pool != undefined;
  }

  async query(queryString) {
    if (!this.isDataseConnected()) {
      throw new DatabaseError.DatabaseConnectionError();
    }

    try {
      const data = await this.pool.query(queryString);
      return {
        rowCount: data.rowCount,
        rows: data.rows,
      };
    } catch (e) {
      console.log(e);
      if(e.code==='23505'){
        throw new DatabaseError.DataBaseUniqueConstrainError(e.constraint);
      }
      throw new DatabaseError.DatabaseQueryError();
    }
  }
}

const db = new Database();

module.exports = db;
