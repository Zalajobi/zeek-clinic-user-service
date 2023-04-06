export const resetPasswordTemplate = (firstName:string, token:string) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <title>Password Reset Request</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
      <tr>
        <td style="background-color: #0072c6; padding: 20px; color: #fff; font-size: 24px; font-weight: bold; text-align: center;">Password Reset Request</td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p>Dear ${firstName},</p>
          <p>We have received a request to reset the password associated with your account. If you did not request this, please ignore this email and no action will be taken.</p>
          <p>To reset your password, please click on the following link:</p>
          <p><a href="http://localhost:3001/api/v1/zeek-clinic/account/admin/reset_password?token=${token}">Reset Password</a></p>
          <p>Please note that this link will expire in 10 minutes.</p>
          <p>If you have any questions or concerns, please contact our support team at zalajobi@gmail.com.</p>
          <p>Best regards,<br>
          Zeek Clinic</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #0072c6; padding: 20px; color: #fff; font-size: 14px; text-align: center;">
          This email was sent by Zeek Clinic.<br>
          Address: 17, Wole-Cole Street.<br>
          Phone: +2347053980998.<br>
          Email: Zalajobi@gmail.com.
        </td>
      </tr>
    </table>
  </body>
</html>

  `
}