const { CouldNotSendMail } = require("./error");
require("dotenv").config()
const nodemailer=require("nodemailer");
class MailService {
  constructor() {
   
    this.transport = nodemailer.createTransport({
      host:process.env.NODE_MAILER_HOST,
      port: process.env.NODE_MAILER_PORT,
      auth: {
        user: process.env.NODE_MAILER_USER_NAME,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });
  }

  async sendMail(to, otp) {
    try {
      await this.transport.sendMail({
        from: "todoTest@gmail.com",
        to: to,
        subject: "otp for registering for todo app",
        text: `otp is ${otp}`,
      });
    } catch (e) {
      console.log(e)
      throw new CouldNotSendMail();
    }
  }
}

const mailService = new MailService();
module.exports = mailService;
