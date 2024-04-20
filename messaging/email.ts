import transporter from '../lib/email';
import { signupMessage } from './templates/signup';
import { resetPasswordTemplate } from './templates/password';
import { GMAIL_SMTP_EMAIL } from '@util/constants';

export const sendTextEmail = (to: string, subject: string, text: string) => {
  transporter.sendMail(
    {
      from: GMAIL_SMTP_EMAIL,
      to,
      subject,
      text,
    },
    (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    }
  );
};

export const sendSignupCompleteProfileEmail = (
  to: string,
  id: string,
  firstName: string
) => {
  transporter.sendMail(
    {
      from: GMAIL_SMTP_EMAIL,
      to,
      subject: 'Welcome To Zeek Clinic',
      html: signupMessage(id, firstName),
    },
    (error: any, info: any) => {
      if (error) {
        console.log('Error');
      } else {
        console.log('Success');
      }
    }
  );
};

export const sendResetPasswordEmail = async (
  to: string,
  token: string,
  firstName: string
) => {
  return await transporter.sendMail({
    from: GMAIL_SMTP_EMAIL,
    to,
    subject: 'Password Reset Request',
    html: resetPasswordTemplate(firstName, token),
  });
};
