import nodemailer from "nodemailer";
import {
  APPLICATION_NAME,
  defaultPassword,
  MailTypeEnum,
} from "../constants/common.js";
import { verifyAccountEmailTemplate } from "../emailTemplates/verifyUserAccount.template.js";
import { registrationSuccessfullEmailTemplate } from "../emailTemplates/registrationSuccessfull.template.js";
import { changePasswordSuccessfullEmailTemplate } from "../emailTemplates/changePasswordSuccessfull.template.js";

// --------------------
// Transporter Setup
// --------------------
const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_TOKEN,
  },
});

// --------------------
// Utility Functions
// --------------------
const getVerificationLink = (authResponse) =>
  `${process.env.BASE_URL}/api/v1/auth/${authResponse.role.toLowerCase()}/verify/${authResponse.verificationToken}`;

const getMailCategory = (mailType) => {
  const categories = {
    [MailTypeEnum.verification]: "User Verification",
    [MailTypeEnum.registration]: "User Registration",
  };
  return categories[mailType] || "General";
};

const getMailSubject = (mailType) => {
  const subjects = {
    [MailTypeEnum.verification]: `Verify your email to activate your ${APPLICATION_NAME} account`,
    [MailTypeEnum.registration]: `Your ${APPLICATION_NAME} account has been verified successfully`,
  };
  return subjects[mailType] || "General";
};

const getHTMLTemplate = (mailType, authResponse) => {
  const link = getVerificationLink(authResponse);

  switch (mailType) {
    case MailTypeEnum.verification:
      return verifyAccountEmailTemplate(
        authResponse.name || authResponse.businessOwner,
        link
      );

    case MailTypeEnum.registration:
      return registrationSuccessfullEmailTemplate(
        authResponse.name || authResponse.businessOwner,
        authResponse.email,
        authResponse.mobile
      );

    case MailTypeEnum.changePassword:
      return changePasswordSuccessfullEmailTemplate(
        authResponse.name || authResponse.businessOwner
      );

    default:
      throw new Error(`Unsupported mail type: ${mailType}`);
  }
};

// --------------------
// Core Function
// --------------------
export const sendMail = async (mailType, authResponse) => {
  try {
    const html = getHTMLTemplate(mailType, authResponse);
    const subject = getMailSubject(mailType);
    const category = getMailCategory(mailType);

    const info = await transport.sendMail({
      from: process.env.SENDER_EMAIL,
      to: authResponse.email,
      subject,
      html,
      category,
    });

    return {
      messageId: info.messageId,
    };
  } catch (error) {
    console.log("error :>> ", error);
    return false;
  }
};
