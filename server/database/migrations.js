const db = require("./database");
require("dotenv").config();
class DatabaseMigrationManager {
  constructor() {
    this.upMigrations = [
      /////////////////////////////////////////////////////////////////////////////
      `CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(150) NOT NULL
    );
    `,
      /////////////////////////////////////////////////////////////////////////////
      `
       ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT false;

     `,
      /////////////////////////////////////////////////////////////////////////////
      `
     CREATE TABLE user_otps(
   
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        otp_hash varchar(150)
    
    );
     `,
      /////////////////////////////////////////////////////////////////////////////
    ];

    this.downMigrations = [
      `DROP TABLE IF EXISTS user_otps`,
      `DROP TABLE IF EXISTS users;`
    
    ];
  }

  async runMigrations(migrations) {
    db.initDatabaseFromEnv();
    const poolClient = await db.pool.connect();
    try {
      console.log("---------------starting migrations-----------");
      await poolClient.query("BEGIN");
      for (const migration of migrations) {
        await poolClient.query(migration);
      }
      await poolClient.query("COMMIT");
      console.log("Migrations completed successfully");
    } catch (e) {
      await poolClient.query("ROLLBACK");
      console.error("Migrations failed:", e);
    } finally {
      console.log("releasing resoruces");
      poolClient.release();
    }
  }

  async startUpMigrations() {
    this.runMigrations(this.upMigrations);
  }
  async startDownMigrations() {
    this.runMigrations(this.downMigrations);
  }
}

async function startMigrations() {
  const args = process.argv.slice(2);
  const migrationsManager = new DatabaseMigrationManager();
  if (args[0] == "up") {
    console.log("up migrations");
    migrationsManager.startUpMigrations();
  } else if (args[0] === "down") {
    console.log("down migrations");
    migrationsManager.startDownMigrations();
  } else {
    console.log("please provide mirgraion");
  }
}

startMigrations();
