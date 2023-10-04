

class DatabaseError extends Error {}

class DatabaseConnectionError extends DatabaseError {}

class DatabaseQueryError extends DatabaseError {}

class DataBaseUniqueConstrainError extends DatabaseError{
  constructor(constraint){
    super();
    this.constraint=constraint;
  }
}


module.exports = {
  DatabaseConnectionError,
  DatabaseQueryError,
  DataBaseUniqueConstrainError
};
