import nodemailer from 'nodemailer';
import { GMAIL_SMTP_EMAIL, GMAIL_SMTP_SECRET } from '@util/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: GMAIL_SMTP_EMAIL,
    pass: GMAIL_SMTP_SECRET,
  },
});

export default transporter;
