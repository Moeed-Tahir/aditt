const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
exports.generateOTP = () => crypto.randomInt(1000, 9999).toString();

exports.sendOTP = async (email, otp) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'info@aditt.app',
      pass: 'frqx vwxi ycjr trzg'
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login OTP',
    html: `
      <div>
        <h3>Login Verification</h3>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Valid for 5 minutes</p>
      </div>
    `
  });
};