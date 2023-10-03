const Texts = require("../constants/texts");


class DatabaseError extends Error {}

class DatabaseConnectionError extends DatabaseError {}

class DatabaseQueryError extends DatabaseError {
  constructor(errorText) {
    this.message = errorText || Texts.unknownErrorText;
  }
}

module.exports = {
  DatabaseConnectionError,
  DatabaseQueryError
};
