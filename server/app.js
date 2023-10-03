const express = require("express");
const db = require("./database/database");
const { DatabaseConnectionError } = require("./database/errors");
require("dotenv").config();

async function main() {
  const app = express();
  const port = process.env.SERVER_PORT || 5000;
  try {
    db.initDatabaseFromEnv();
    const data=await db.query("select * from users");
    console.log(data.row);
   
    app.listen(port, () => {
      console.log(`server is running at ${port}`);
    });
  } catch (e) {
    if (e instanceof DatabaseConnectionError) {
      console.log("could not connect to database");
    }
    console.log(e);
  }
}

main();
