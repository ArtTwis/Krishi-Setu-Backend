import { APPLICATION_NAME } from "../constants/common.js";

export const verifyUserAccountEmailTemplate = (name, verifyLink) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px 0;">
    <div style="max-width: 600px; background: #ffffff; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <div style="text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
        <h2 style="color: #4CAF50; margin: 0;">Welcome to ${APPLICATION_NAME} 🌾</h2>
      </div>

      <div style="padding: 20px 0; text-align: left;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          Thank you for registering with <strong>Krishi-Setu</strong>! Please verify your email address by clicking the button below. 
          This helps us ensure your account’s security and authenticity.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" 
             style="background-color: #4CAF50; color: white; text-decoration: none; 
                    padding: 12px 24px; border-radius: 5px; font-weight: bold; 
                    display: inline-block;">
            Verify Your Email
          </a>
        </div>

        <p style="font-size: 14px; color: #777; line-height: 1.5;">
          If the button doesn’t work, you can also verify by copying and pasting the following link in your browser:
        </p>
        <p style="font-size: 13px; color: #0066cc; word-break: break-all;">
          <a href="${verifyLink}" style="color: #0066cc;">${verifyLink}</a>
        </p>
      </div>

      <div style="border-top: 1px solid #ddd; text-align: center; padding-top: 10px; color: #999; font-size: 13px;">
        <p>© ${new Date().getFullYear()} Krishi-Setu. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
};
