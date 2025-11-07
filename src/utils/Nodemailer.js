import nodemailer from "nodemailer";
import { APPLICATION_NAME, MailTypeEnum } from "../constants/common.js";
import { verifyUserAccountEmailTemplate } from "../emailTemplates/verifyUserAccount.template.js";
import { registrationSuccessEmailTemplate } from "../emailTemplates/registrationSuccessfull.template.js";

// --------------------
// Transporter Setup
// --------------------
const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: "api",
    pass: process.env.MAILTRAP_TOKEN,
  },
});

// --------------------
// Utility Functions
// --------------------
const getVerificationLink = (token) =>
  `${process.env.BASE_URL}/api/v1/auth/user/verify/${token}`;

const getMailCategory = (mailType) => {
  const categories = {
    [MailTypeEnum.verification]: "User Verification",
    [MailTypeEnum.registration]: "User Registration",
  };
  return categories[mailType] || "General";
};

const getHTMLTemplate = (mailType, user) => {
  const link = getVerificationLink(user.verificationToken);

  switch (mailType) {
    case MailTypeEnum.verification:
      return verifyUserAccountEmailTemplate(user.name, link);
    case MailTypeEnum.registration:
      return registrationSuccessEmailTemplate(user.name, user.password);
    default:
      throw new Error(`Unsupported mail type: ${mailType}`);
  }
};

// --------------------
// Core Function
// --------------------
export const sendMail = async (mailType, user) => {
  const htmlContent = getHTMLTemplate(mailType, user);
  const category = getMailCategory(mailType);

  const info = await transport.sendMail({
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: `Welcome to ${APPLICATION_NAME}`,
    html: htmlContent,
    category,
  });

  return {
    messageId: info.messageId,
  };
};
