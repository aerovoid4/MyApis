const nodemailer = require('nodemailer');
require('dotenv').config();

const googleAuth = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

module.exports = googleAuth;
