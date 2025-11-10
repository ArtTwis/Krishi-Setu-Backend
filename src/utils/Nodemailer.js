import nodemailer from "nodemailer";
import {
  APPLICATION_NAME,
  defaultPassword,
  MailTypeEnum,
} from "../constants/common.js";
import { verifyUserAccountEmailTemplate } from "../emailTemplates/verifyUserAccount.template.js";
import { registrationSuccessEmailTemplate } from "../emailTemplates/registrationSuccessfull.template.js";
import { statusCodes } from "../constants/statusCodes.js";
import { errorMessages } from "../constants/errorMessage.js";
import ApiError from "./ApiError.js";

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
const getVerificationLink = (user) =>
  `${process.env.BASE_URL}/api/v1/auth/${user.role.toLowerCase()}/verify/${user.verificationToken}`;

const getUserDefaultPassword = (mobile) => defaultPassword + mobile.slice(-4);

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

const getHTMLTemplate = (mailType, user) => {
  const link = getVerificationLink(user);

  switch (mailType) {
    case MailTypeEnum.verification:
      return verifyUserAccountEmailTemplate(
        user.name || user.businessOwner,
        link
      );

    case MailTypeEnum.registration:
      return registrationSuccessEmailTemplate(
        user.name || user.businessOwner,
        user.email,
        getUserDefaultPassword(user.mobile)
      );
    default:
      throw new Error(`Unsupported mail type: ${mailType}`);
  }
};

// --------------------
// Core Function
// --------------------
export const sendMail = async (mailType, user, res) => {
  try {
    const html = getHTMLTemplate(mailType, user);
    const subject = getMailSubject(mailType);
    const category = getMailCategory(mailType);

    const info = await transport.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject,
      html,
      category,
    });

    return {
      messageId: info.messageId,
    };
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(statusCodes.success.created)
      .json(
        new ApiError(
          statusCodes.success.created,
          error,
          errorMessages.emailAlreadyExist
        )
      );
  }
};
