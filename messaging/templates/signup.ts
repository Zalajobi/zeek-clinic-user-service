export const signupMessage = (id:string, firstName:string) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Zeek Clinic</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
      <tr>
        <td style="background-color: #0072c6; padding: 20px; color: #fff; font-size: 24px; font-weight: bold; text-align: center;">Welcome to Zeek Clinic</td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p>Dear ${firstName},</p>
          <p>Thank you for choosing Zeek Clinic for your healthcare needs. We are delighted to welcome you to our hospital.</p>
          <p>Please find attached your patient registration form, which you can fill out and send back to us via email or bring with you on your first visit to our hospital.</p>
          <p>Additionally, we kindly ask that you complete your patient profile online by clicking on the following link: <a href="#">Update Account</a>. Completing your profile will help us provide you with the best possible care.</p>
          <p>If you have any questions or concerns, please don't hesitate to contact us at [Hospital Phone] or [Hospital Email]. We are here to assist you and provide you with the best possible care.</p>
          <p>Thank you once again for choosing [Hospital Name]. We look forward to seeing you soon.</p>
          <p>Best regards,<br>
          Zeek Clinic</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #0072c6; padding: 20px; color: #fff; font-size: 14px; text-align: center;">
          This email was sent by Zeek Clinic.<br>
          Address: 17, Wole-Cole Street.<br>
          Phone: +2347053980998.<br>
          Email: zalajobi@gmail.com.
        </td>
      </tr>
    </table>
  </body>
</html>

  `
}