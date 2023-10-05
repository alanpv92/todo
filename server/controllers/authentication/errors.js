class UserAlreadyRegistredError extends Error {};
class UserHasNotRegistredError extends Error{};
class UserHasEnterWrongPasswordError extends Error{};
class InvaildOrOtpExpiredError extends Error{};
module.exports = {
  UserAlreadyRegistredError,
  UserHasNotRegistredError,
  UserHasEnterWrongPasswordError,
  InvaildOrOtpExpiredError,
};
