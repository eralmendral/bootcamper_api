const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_EMAIL} <${process.env.FROM_NAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  const info = await transporter.sendMail(message);

  console.log('message sent...');
}

module.exports = sendEmail;