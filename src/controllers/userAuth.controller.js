import { UserAuth } from "../models/userAuth.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { statusCodes } from "../constants/statusCodes.js";
import { successMessages } from "../constants/successMessage.js";
import { errorMessages } from "../constants/errorMessage.js";
import { defaultPassword, MailTypeEnum } from "../constants/common.js";
import { sendMail } from "../utils/Nodemailer.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;

    //  Check if user already exist
    const existingUser = await UserAuth.findOne({ email });
    if (existingUser) {
      return res
        .status(statusCodes.error.conflicts)
        .json(
          new ApiError(
            statusCodes.error.conflicts,
            errorMessages.emailAlreadyExist
          )
        );
    }

    const verificationToken = jwt.sign(
      { email },
      process.env.VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY,
      }
    );

    // Create new user
    const user = await UserAuth.create({
      name,
      email,
      mobile,
      refreshToken: null,
      password: defaultPassword + mobile.slice(-4),
      verificationToken,
      role,
    });

    // Convert mongoose document to plain JS object and remove sensitive fields
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    // Sending welcome mail to registered user
    if (user.email) {
      const mail = await sendMail(MailTypeEnum.verification, userResponse);
      console.log("mail.messageId :>> ", mail.messageId);
    }

    // Remove verification token before sending response
    delete userResponse.verificationToken;

    // Return success response
    return res
      .status(statusCodes.success.created)
      .json(
        new ApiResponse(
          statusCodes.success.created,
          userResponse,
          successMessages.newUserCreated
        )
      );
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(statusCodes.serverError.internalServerError)
      .json(
        new ApiError(
          statusCodes.serverError.internalServerError,
          error,
          errorMessages.internalServerError
        )
      );
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);

    const { email } = decoded;
    if (!email) {
      return res
        .status(statusCodes.error.badRequest)
        .json(
          new ApiError(statusCodes.error.badRequest, errorMessages.invalidToken)
        );
    }

    const user = await UserAuth.findOneAndUpdate(
      { email },
      { $set: { isVerified: true, isActive: true } },
      { new: true }
    );

    if (!user) {
      return res
        .status(statusCodes.error.notFound)
        .json(
          new ApiError(statusCodes.error.notFound, errorMessages.userNotFound)
        );
    }

    const userResponse = user.toObject();
    userResponse.password = defaultPassword + userResponse.mobile.slice(-4);
    delete userResponse.refreshToken;
    delete userResponse.verificationToken;
    delete userResponse.isActive;
    delete userResponse.isVerified;

    // Sending registration success mail to registered user
    const mail = await sendMail(MailTypeEnum.registration, userResponse);
    console.log("mail.messageId :>> ", mail.messageId);

    // Return success response
    return res
      .status(statusCodes.success.ok)
      .json(
        new ApiResponse(
          statusCodes.success.ok,
          {},
          successMessages.verifyUserAccount
        )
      );
  } catch (error) {
    console.log("error :>> ", error);
    return res
      .status(statusCodes.serverError.internalServerError)
      .json(
        new ApiError(
          statusCodes.serverError.internalServerError,
          error,
          errorMessages.internalServerError
        )
      );
  }
};

export const loginUser = async (req, res) => {
  const { email, mobile, password } = req.body;
};
