class UserAlreadyRegistredError extends Error {};
class UserHasNotRegistredError extends Error{};
class UserHasEnterWrongPasswordError extends Error{};
module.exports = {
  UserAlreadyRegistredError,
  UserHasNotRegistredError,
  UserHasEnterWrongPasswordError
};
