const db = require("./database");
require("dotenv").config();
class DatabaseMigrationManager {
  constructor() {
    this.upMigrations = [
      `CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(150) NOT NULL
    );
    `,
    ];

    this.downMigrations = [
      `
        DROP TABLE USERS;
        `,
    ];
  }

  async startUpMigrations() {
    db.initDatabaseFromEnv();
    const poolClient = await db.pool.connect();
    try {
      console.log("starting migrations");

      await poolClient.query("BEGIN");
      for (const migration of this.upMigrations) {
        await poolClient.query(migration);
      }
      await poolClient.query("COMMIT");
      console.log("migrations done");
      await poolClient.query(
        "INSERT INTO USERS(user_name,email,password_hash) VALUES('alan','alan@gmail.com','asdasdasdasdasdas')"
      );
      const data = await poolClient.query("SELECT * FROM users");
      console.log(data.rowCount);
    } catch (e) {
      await poolClient.query("ROLLBACK");
      console.log("migrations failed");
    } finally {
      poolClient.release();
    }
  }
  async startDownMigrations() {
    db.initDatabaseFromEnv();
    const poolClient = await db.pool.connect();
    try {
      console.log("starting migrations");

      await poolClient.query("BEGIN");
      for (const migration of this.downMigrations) {
        await poolClient.query(migration);
      }
      await poolClient.query("COMMIT");
      console.log("migrations done");
    } catch (e) {
      await poolClient.query("ROLLBACK");
      console.log("migrations failed");
    } finally {
      poolClient.release();
    }
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

  //   await migrationsManager.startDownMigrations();
}

startMigrations();
