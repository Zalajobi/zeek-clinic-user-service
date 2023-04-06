import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: true,
    auth: {
      user: process.env.GMAIL_SMTP_EMAIL,
      pass: process.env.GMAIL_SMTP_SECRET
    }
  }
)

export default transporter