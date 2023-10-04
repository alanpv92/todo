const Texts = require("../constants/texts");

class DatabaseError extends Error {}

class DatabaseConnectionError extends DatabaseError {}

class DatabaseQueryError extends DatabaseError {}

module.exports = {
  DatabaseConnectionError,
  DatabaseQueryError,
};
