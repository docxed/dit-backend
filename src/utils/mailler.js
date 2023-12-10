const nodemailer = require('nodemailer')

// hotmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
})
const sendMail = async (mailOptions) => {
  return await transporter.sendMail(mailOptions)
}
module.exports = {
  sendMail,
}
