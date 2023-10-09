class ErrorTexts {
  static unknownErrorText = "something went wrong";
  static userAlreadyRegistredError="user has already registred";
  static userNameIsNotUniqueError="user name is not unique";
  static userHasNotRegistred="user has not yet registred";
  static userHasEnterWrongPassword="password is incorrect";
  static couldNotSendMail="could not send mail";
  static invaildOtpError="otp is invaild or has expired";
  static invalidEmail="email is invaild";
  static invaildUserName="user name is invaild";
  static invaildPassword="password is invaild";
  static shortPassword="password is short";
  static invaildOtp="otp is invalid";
}

class Texts extends ErrorTexts {}




module.exports = Texts;
