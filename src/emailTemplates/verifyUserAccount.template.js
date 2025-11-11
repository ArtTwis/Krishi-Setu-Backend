import { APPLICATION_NAME } from "../constants/common.js";

export const verifyAccountEmailTemplate = (authName, verifyLink) => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 0; margin: 0;">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 15px;
          color: #333333;
          line-height: 1.6;
          background-color: #f6f9fc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background: #ffffff;
          margin: 40px auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 10px;
        }
        .header h2 {
          color: #4CAF50;
          margin: 0;
          font-size: 18px;
        }
        .content p {
          margin: 10px 0;
        }
        .verify-button {
          text-align: center;
          margin: 30px 0;
        }
        .verify-button a {
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-weight: bold;
          font-size: 15px;
          display: inline-block;
        }
        .footer {
          border-top: 1px solid #ddd;
          text-align: center;
          padding-top: 10px;
          color: #999;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to ${APPLICATION_NAME} 🌾</h2>
        </div>

        <div class="content">
          <p>Hi <strong>${authName}</strong>,</p>
          <p>
            Thank you for registering with <strong>${APPLICATION_NAME}</strong>!  
            Please verify your email address by clicking the button below.
          </p>

          <div class="verify-button">
            <a href="${verifyLink}">Verify Your Email</a>
          </div>

          <p>If the button doesn’t work, copy and paste the following link in your browser:</p>
          <p style="color: #0066cc; word-break: break-all;">
            <a href="${verifyLink}" style="color: #0066cc;">${verifyLink}</a>
          </p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} ${APPLICATION_NAME}. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
