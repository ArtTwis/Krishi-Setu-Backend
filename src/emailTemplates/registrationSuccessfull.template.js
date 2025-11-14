import { APPLICATION_NAME, defaultPassword } from "../constants/common.js";

const getUserDefaultPassword = (mobile) => defaultPassword + mobile.slice(-4);

export const registrationSuccessfullEmailTemplate = (
  authName,
  authEmail,
  authMobile
) => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 0; margin: 0;">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification Successful</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 15px;
          color: #333333;
          line-height: 1.6;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background-color: #ffffff;
          margin: 40px auto;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #2a9d8f;
          color: white;
          padding: 20px 30px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }
        .body {
          padding: 30px;
        }
        .highlight {
          font-weight: bold;
          color: #2a9d8f;
        }
        .password-box {
          background-color: #f0f4f3;
          border-left: 4px solid #2a9d8f;
          padding: 12px 16px;
          font-size: 15px;
          margin: 20px 0;
          word-break: break-word;
        }
        .button {
          display: inline-block;
          background-color: #2a9d8f;
          color: white !important;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 15px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          color: #888888;
          font-size: 13px;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${APPLICATION_NAME} - Verification Successful
        </div>
        <div class="body">
          <p>Hi <span class="highlight">${authName}</span>,</p>
          <p>We’re happy to inform you that your email has been successfully verified 🎉</p>
          <p>You can now log in to your account using the following credentials:</p>
          <div class="password-box">
            <div><strong>User Email:</strong> ${authEmail}</div>
            <div><strong>Password:</strong> ${getUserDefaultPassword(authMobile)}</div>
          </div>
          <p>If you didn’t request this, please ignore this email.</p>
          <p>Thanks for being a part of <span class="highlight">${APPLICATION_NAME}</span>.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ${APPLICATION_NAME}. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
